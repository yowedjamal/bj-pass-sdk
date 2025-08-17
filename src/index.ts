
import type { AuthConfig, BackendAuthResponse, TokenResponse } from "./types";
import { ConfigManager, OAuthUrlBuilder, TokenValidator, PopupManager, ErrorHandler } from "./core";
import { UIManager } from "./ui";
import { SessionManager } from "./utils";

export class BackendClient {
  constructor(private config: AuthConfig & { baseUrl: string }, private popupManager: PopupManager, private uiManager: UIManager) {}

  async exchangeCode(code: string, state: string) {
    const response = await fetch(this.config.beUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...this.config.header },
      body: JSON.stringify({
        code,
        state,
        redirect_uri: this.config.redirectUri,
        code_verifier: SessionManager.getItem("code_verifier"),
      }),
    });
    if (!response.ok) {
      let errorData: any = {};
      try { errorData = await response.json(); } catch {}
      throw new Error(errorData.message || "Échec de l'authentification");
    }
    return await response.json();
  }

  async exchangeCodeDirect(code: string, state: string, urlBuilder: OAuthUrlBuilder) {
    const codeVerifier = SessionManager.getItem("code_verifier");
    if (!codeVerifier) throw new Error("Missing code verifier");
    const response = await fetch(urlBuilder.buildTokenUrl(), {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: this.config.redirectUri,
        client_id: this.config.clientId,
        code_verifier: codeVerifier,
      } as any),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error_description || "Failed to obtain token");
    return data as TokenResponse;
  }

  async handleBackendAuthResponse(data: BackendAuthResponse) {
    if ((data as any).status === "success") {
      await this.handleBackendAuthSuccess(data as any);
    } else {
      this.handleBackendAuthError(data as any);
    }
  }

  private async handleBackendAuthSuccess(data: any) {
    SessionManager.setItem("user", JSON.stringify(data.user));
    SessionManager.setItem("success", "true");
    this.popupManager.close();
    this.uiManager.setState({ isLoading: false, error: null });
    this.config.onSuccess?.({ user: data.user, backendData: data, source: "backend" });
    await this.verifyBackendStatus();
  }

  private handleBackendAuthError(data: any) {
    this.popupManager.close();
    const message = data.message || "Erreur d'authentification";
    const error = data.error || "backend_error";
    this.uiManager.setState({ isLoading: false, error: ErrorHandler.getErrorMessage(error, message) });
    this.config.onError?.({ error, error_description: message });
  }

  async verifyBackendStatus() {
    const statusUrl = new URL(this.config.backendEndpoints.status, this.config.backendUrl);
    const response = await fetch(statusUrl.toString(), {
      method: "GET",
      credentials: "include",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error(`Status check failed: ${response.status}`);
    const statusData = await response.json();
    if (statusData.authenticated) {
      SessionManager.setItem("user", JSON.stringify(statusData.user));
      SessionManager.setItem("authenticated", "true");
    } else {
      SessionManager.clear();
      throw new Error("User not authenticated on backend");
    }
  }

  async startBackendAuthFlow() {
    if (!this.config.backendUrl) throw new Error("Backend URL not configured");
    const startUrl = new URL(this.config.backendEndpoints.start, this.config.backendUrl);
    if (this.config.returnUrl) startUrl.searchParams.set("return_url", this.config.returnUrl);
    this.popupManager.open(startUrl.toString(), () => {
      this.uiManager.setState({ isLoading: false });
      if (!SessionManager.getItem("success")) {
        this.config.onError?.({ error: "popup_closed", error_description: "La fenêtre d'authentification a été fermée" });
      }
    });
  }

  async getUserInfoFromBackend() {
    const userUrl = new URL(this.config.backendEndpoints.user, this.config.backendUrl);
    const response = await fetch(userUrl.toString(), {
      method: "GET",
      credentials: "include",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error(`User info request failed: ${response.status}`);
    const userData = await response.json();
    return userData.user;
  }

  async logoutFromBackend() {
    const logoutUrl = new URL(this.config.backendEndpoints.logout, this.config.backendUrl);
    const response = await fetch(logoutUrl.toString(), {
      method: "POST",
      credentials: "include",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error(`Backend logout failed: ${response.status}`);
  }
}

export class BjPassAuthWidget {
  private configManager: ConfigManager;
  private uiManager: UIManager;
  private urlBuilder: OAuthUrlBuilder;
  private tokenValidator: TokenValidator;
  private backendClient: BackendClient;
  private popupManager: PopupManager;

  constructor(config: Partial<AuthConfig> = {}) {
    this.configManager = new ConfigManager(config);
    this.uiManager = new UIManager(this.configManager.get());
    this.urlBuilder = new OAuthUrlBuilder(this.configManager.get());
    this.tokenValidator = new TokenValidator(this.configManager.get(), this.urlBuilder);
    this.popupManager = new PopupManager();
    this.backendClient = new BackendClient(this.configManager.get(), this.popupManager, this.uiManager);
    if (!("crypto" in globalThis) || !("subtle" in crypto)) {
      throw new Error("Browser not supported. Please use a modern browser.");
    }
    this.initialize();
    this.setupMessageListener();
  }

  private initialize() {
    this.uiManager.initialize();
    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    (this.uiManager as any).setOnEnvironmentChange((environment: string) => {
      this.configManager.updateConfig({ environment } as any);
      this.urlBuilder = new OAuthUrlBuilder(this.configManager.get());
      this.tokenValidator = new TokenValidator(this.configManager.get(), this.urlBuilder);
      this.backendClient = new BackendClient(this.configManager.get(), this.popupManager, this.uiManager);
    });
    (this.uiManager as any).setOnLogin(() => { this.startAuthFlow(); });
  }

  private setupMessageListener() {
    window.addEventListener("message", (event: MessageEvent) => {
      if (!this.isValidMessageOrigin(event.origin)) return;
      const data = event.data as BackendAuthResponse;
      if (data && (data as any).type === "bjpass-auth-response") {
        this.backendClient.handleBackendAuthResponse(data);
      }
    });
  }

  private isValidMessageOrigin(origin: string) {
    const config = this.configManager.get();
    const allowedOrigins = [config.backendOrigin, config.frontendOrigin];
    return allowedOrigins.some((allowed) => allowed === "*" || allowed === origin);
  }

  async startAuthFlow() {
    try {
      const config = this.configManager.get();
      this.uiManager.setState({ isLoading: true, error: null });
      if (config.useBackend) {
        await this.backendClient.startBackendAuthFlow();
      } else {
        await this.startDirectAuthFlow();
      }
    } catch (error: any) {
      this.handleError("auth_flow_error", error?.message);
    }
  }

  private async startDirectAuthFlow() {
    const config = this.configManager.get();
    const authData = SessionManager.generateAndStoreAuthData(config.scope);
    const authUrl = await this.urlBuilder.buildAuthorizationUrl(authData as any);
    this.popupManager.open(authUrl, () => {
      this.uiManager.setState({ isLoading: false });
      if (!SessionManager.getItem("success")) {
        this.handleError("popup_closed", "La fenêtre d'authentification a été fermée");
      }
    });
  }

  async handlePopupResponse(queryParams: string) {
    try {
      const params = new URLSearchParams(queryParams);
      const code = params.get("code");
      const state = params.get("state");
      const error = params.get("error");
      if (error) { this.handleError(error, params.get("error_description") || undefined); return; }
      if (!code || !state) { this.handleError("invalid_response", "Code ou state manquant"); return; }
      const savedState = SessionManager.getItem("state");
      if (state !== savedState) { this.handleError("invalid_state", "Paramètre state invalide"); return; }
      SessionManager.setItem("success", "true");
      this.popupManager.close();
      await this.exchangeCodeForTokens(code, state);
    } catch (error: any) {
      this.handleError("callback_error", error?.message);
    }
  }

  async exchangeCodeForTokens(code: string, state: string) {
    try {
      const config = this.configManager.get();
      let tokenData: any;
      if (config.beUrl) {
        tokenData = await this.backendClient.exchangeCode(code, state);
      } else {
        this.handleError("unsuported_grant_type_error", "Type de subvention OAuth non encore pris en charge.");
        return;
      }
      await this.validateTokens(tokenData.data);
      SessionManager.clear();
      this.uiManager.setState({ isLoading: false, error: null });
      config.onSuccess?.(tokenData);
    } catch (error: any) {
      this.handleError("token_exchange_error", error?.message);
    }
  }

  private async validateTokens(tokenData: TokenResponse) {
    const config = this.configManager.get();
    if (tokenData.id_token && config.scope.includes("openid")) {
      await this.tokenValidator.validateIdToken(tokenData.id_token);
    }
    if (config.verifyAccessToken && tokenData.access_token) {
      await this.tokenValidator.verifyAccessToken(tokenData.access_token);
    }
  }

  private handleError(errorCode: string, description?: string) {
    const errorMessage = ErrorHandler.getErrorMessage(errorCode, description);
    this.uiManager.setState({ isLoading: false, error: errorMessage });
    this.configManager.get().onError?.({ error: errorCode, error_description: description });
  }

  async getUserInfo() {
    const config = this.configManager.get();
    if (config.useBackend) {
      try {
        return await new BackendClient(config, this.popupManager, this.uiManager).getUserInfoFromBackend();
      } catch {
        // fallback
      }
    }
    const userData = SessionManager.getItem("user");
    return userData ? JSON.parse(userData) : null;
  }

  async logout() {
    const config = this.configManager.get();
    if (config.useBackend) {
      try { await new BackendClient(config, this.popupManager, this.uiManager).logoutFromBackend(); } catch {}
    }
    SessionManager.clear();
    this.uiManager.setState({ isLoading: false, error: null });
    this.configManager.get().onLogout?.();
  }

  destroy() {
    this.popupManager.close();
    this.uiManager.destroy();
    SessionManager.clear();
  }
  refresh() {
    this.uiManager.destroy();
    (this as any).initialize?.();
  }
  getConfig() { return this.configManager.get(); }
  updateConfig(newConfig: Partial<AuthConfig>) {
    this.configManager.updateConfig(newConfig);
    this.urlBuilder = new OAuthUrlBuilder(this.configManager.get());
    this.tokenValidator = new TokenValidator(this.configManager.get(), this.urlBuilder);
  }
}

// UMD-style globals for <script> usage
declare global {
  interface Window {
    BjPassAuthWidget?: typeof BjPassAuthWidget;
    createBjPassWidget?: (config?: Partial<AuthConfig>) => BjPassAuthWidget;
  }
}
if (typeof window !== "undefined") {
  window.BjPassAuthWidget = BjPassAuthWidget;
  window.createBjPassWidget = (config: Partial<AuthConfig> = {}) => new BjPassAuthWidget(config);
  document.addEventListener("DOMContentLoaded", () => {
    const containers = document.querySelectorAll("[data-bjpass-widget]");
    containers.forEach((container) => {
      try {
        const cfgRaw = (container as HTMLElement).dataset.bjpassWidget || "{}";
        const config = JSON.parse(cfgRaw);
        (config.ui ||= {}).container = `#${(container as HTMLElement).id}`;
        new BjPassAuthWidget(config);
      } catch (e) {
        console.error("Failed to initialize BjPass widget:", e);
      }
    });
  });
}

export default BjPassAuthWidget;
