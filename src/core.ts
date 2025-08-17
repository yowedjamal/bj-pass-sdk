
import { AuthConfig, JWKSResponse, BackendAuthResponse, TokenResponse } from "./types";
import { CryptoUtils, SessionManager } from "./utils";

export class ConfigManager {
  private environments = {
    test: {
      baseUrl: "https://test-tx-pki.gouv.bj",
      defaultAuthServer: "main-as",
    },
    production: {
      baseUrl: "https://tx-pki.gouv.bj",
      defaultAuthServer: "main-as",
    },
  } as const;

  private defaultConfig: AuthConfig = {
    environment: "test",
    clientId: "",
    authServer: "",
    scope: "openid profile",
    redirectUri: "http://127.0.0.1:5500/examples/redirect.html",
    pkce: true,
    verifyAccessToken: false,
    tokenVerificationScopes: ["urn:safelayer:eidas:oauth:token:introspect"],
    beUrl: "",
    beBearer: "",
    header: {},
    ui: {
      showEnvSelector: true,
      container: "#bjpass-auth-container",
      language: "fr",
      primaryColor: "#0066cc",
      theme: "default",
    },
    backendUrl: "https://your-backend.com",
    backendEndpoints: {
      start: "/auth/start",
      status: "/auth/api/status",
      user: "/auth/api/user",
      logout: "/auth/api/logout",
      refresh: "/auth/api/refresh",
    },
    frontendOrigin: "https://your-frontend.com",
    backendOrigin: "https://your-backend.com",
    useBackend: true,
    popupMode: true,
    autoClosePopup: true,
  };

  private config: AuthConfig;
  private resolvedConfig: AuthConfig & { baseUrl: string };

  constructor(userConfig: Partial<AuthConfig> = {}) {
    this.config = { ...this.defaultConfig, ...userConfig };
    this.resolvedConfig = this.applyEnvironmentConfig();
  }

  private applyEnvironmentConfig() {
    const env = this.config.environment || "test";
    const envConfig = this.environments[env as keyof typeof this.environments] || this.environments.test;
    return {
      ...this.config,
      baseUrl: envConfig.baseUrl,
      authServer: this.config.authServer || envConfig.defaultAuthServer,
    };
  }

  updateConfig(newConfig: Partial<AuthConfig>) {
    this.config = { ...this.config, ...newConfig };
    this.resolvedConfig = this.applyEnvironmentConfig();
  }

  get(): AuthConfig & { baseUrl: string } {
    return this.resolvedConfig;
  }

  getEnvironments(): string[] {
    return Object.keys(this.environments);
  }
}

export class OAuthUrlBuilder {
  constructor(private config: AuthConfig & { baseUrl: string }) {}
  async buildAuthorizationUrl(authData: { state: string; nonce?: string; codeVerifier: string }): Promise<string> {
    const { state, nonce, codeVerifier } = authData;
    const codeChallenge = await CryptoUtils.generateCodeChallenge(codeVerifier);
    const base = new URL(`${this.config.baseUrl}/trustedx-authserver/oauth`);
    if (this.config.authServer) {
      base.pathname += `/${encodeURIComponent(this.config.authServer)}`;
    }
    const params = new URLSearchParams({
      response_type: "code",
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      scope: this.config.scope.split("+").join(" "),
      state,
      code_challenge: codeChallenge,
      code_challenge_method: "S256",
      prompt: "login",
    });
    if (this.config.scope.includes("openid") && nonce) params.set("nonce", nonce);
    base.search = params.toString();
    return base.toString();
  }
  buildTokenUrl(): string {
    return `${this.config.baseUrl}/trustedx-authserver/oauth/${encodeURIComponent(this.config.authServer)}/token`;
  }
  buildJWKSUrl(): string {
    return `${this.config.baseUrl}/trustedx-authserver/oauth/keys`;
  }
  buildIntrospectionUrl(): string {
    return `${this.config.baseUrl}/trustedx-authserver/oauth/token/verify`;
  }
}

export class TokenValidator {
  constructor(private config: AuthConfig, private urlBuilder: OAuthUrlBuilder) {}
  async validateIdToken(idToken: string): Promise<unknown> {
    const [header, payload] = idToken.split(".");
    if (!header || !payload) {
      throw new Error("Invalid idToken format");
    }
    const decodedHeader = JSON.parse(atob(header));
    const decodedPayload = JSON.parse(atob(payload));
    const now = Math.floor(Date.now() / 1000);
    const savedNonce = SessionManager.getItem("nonce");
    if (decodedPayload.exp < now) throw new Error("Token expired");
    if (decodedPayload.nonce !== savedNonce) throw new Error("Invalid nonce");
    if (decodedPayload.aud !== this.config.clientId) throw new Error("Invalid audience");
    const jwks = await this.fetchJWKS();
    const publicKey = jwks.keys.find((key) => key.kid === decodedHeader.kid);
    if (!publicKey) throw new Error("No matching public key found");
    const isValid = await this.verifySignature(idToken, publicKey);
    if (!isValid) throw new Error("Invalid signature");
    return decodedPayload;
  }
  async verifyAccessToken(accessToken: string): Promise<unknown> {
    const response = await fetch(this.urlBuilder.buildIntrospectionUrl(), {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Bearer ${accessToken}`
      },
      body: new URLSearchParams({ token: accessToken } as any)
    });
    const data = await response.json();
    if (!response.ok || !data.active) {
      throw new Error("Token verification failed");
    }
    return data;
  }
  private async fetchJWKS(): Promise<JWKSResponse> {
    const response = await fetch(this.urlBuilder.buildJWKSUrl());
    if (!response.ok) throw new Error("Failed to fetch JWKS");
    return await response.json();
  }
  private async verifySignature(token: string, jwk: any): Promise<boolean> {
    try {
      const key = await crypto.subtle.importKey(
        "jwk",
        jwk,
        { name: "RSASSA-PKCS1-v1_5", hash: { name: "SHA-256" } },
        false,
        ["verify"]
      );
      const [header, payload, signature] = token.split(".");
      if (!signature) {
        throw new Error("Token signature is missing");
      }
      const signatureData = (await import("./utils")).CryptoUtils.base64UrlToArrayBuffer(signature);
      const data = new TextEncoder().encode(`${header}.${payload}`);
      return await crypto.subtle.verify("RSASSA-PKCS1-v1_5", key, signatureData, data);
    } catch (e) {
      console.error("Signature verification error:", e);
      return false;
    }
  }
}

export class PopupManager {
  private popup: Window | null = null;
  private checkInterval: number | null = null;
  open(url: string, onClose?: () => void) {
    const width = 500, height = 600;
    const left = (screen.width - width) / 2;
    const top = (screen.height - height) / 2;
    this.popup = window.open(
      url,
      "BjPassAuth",
      `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes`
    );
    this.checkInterval = window.setInterval(() => {
      if (this.popup && this.popup.closed) {
        this.close();
        onClose?.();
      }
    }, 500);
  }
  close() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
    if (this.popup && !this.popup.closed) this.popup.close();
    this.popup = null;
  }
  isOpen() {
    return !!(this.popup && !this.popup.closed);
  }
}

export class ErrorHandler {
  static getErrorMessage(error: string, description?: string): string {
    let errorMessage = "Erreur d'authentification";
    const errorMessages: Record<string, string> = {
      invalid_token: "Token invalide ou expiré",
      unsuported_grant_type_error: "Type de subvention OAuth invalide",
      insufficient_scope: "Permissions insuffisantes",
      invalid_grant: "Code d'autorisation invalide ou expiré",
      access_denied: "Authentification annulée",
      invalid_request: "Requête invalide",
      invalid_scope: "Permissions invalides",
      server_error: "Erreur du serveur",
      popup_closed: "La fenêtre d'authentification a été fermée",
      browser_error: "Navigateur non supporté",
      backend_error: "Erreur du backend",
      token_error: "Erreur de validation du token",
      token_exchange_error: "Erreur lors de l'échange",
    };
    if (errorMessages[error]) errorMessage = errorMessages[error];
    if (description) errorMessage += `: ${description}`;
    return errorMessage;
  }
}
