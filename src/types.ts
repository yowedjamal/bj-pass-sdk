
export type EnvironmentKey = "test" | "production";

export interface BackendEndpoints {
  start: string;
  status: string;
  user: string;
  logout: string;
  refresh: string;
}

export interface UIOptions {
  showEnvSelector: boolean;
  container: string;
  language: "fr" | "en" | (string & {});
  primaryColor: string;
  theme: "default" | "dark" | "modern" | "minimal" | (string & {});
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
}

export interface AuthConfig {
  environment: EnvironmentKey;
  clientId: string;
  authServer: string;
  scope: string;
  redirectUri: string;
  pkce: boolean;
  verifyAccessToken: boolean;
  tokenVerificationScopes: string[];
  beUrl: string;
  beBearer: string;
  header: Record<string, string>;
  ui: UIOptions;

  backendUrl: string;
  backendEndpoints: BackendEndpoints;

  frontendOrigin: string;
  backendOrigin: string;

  useBackend: boolean;
  popupMode: boolean;
  autoClosePopup: boolean;

  onSuccess?: (data: unknown) => void;
  onError?: (err: { error: string; error_description?: string }) => void;
  onLogout?: () => void;

  analytics?: boolean;
  debug?: boolean;
  maxRetries?: number;
  retryDelay?: number;

  returnUrl?: string;
}

export interface JWKSKey {
  kid: string;
  kty: string;
  n?: string;
  e?: string;
  alg?: string;
  use?: string;
  [k: string]: unknown;
}

export interface JWKSResponse {
  keys: JWKSKey[];
}

export interface TokenResponse {
  access_token?: string;
  id_token?: string;
  refresh_token?: string;
  token_type?: string;
  expires_in?: number;
  scope?: string;
  [k: string]: unknown;
}

export interface BackendAuthResponseSuccess {
  type?: "bjpass-auth-response";
  status: "success";
  user: unknown;
  [k: string]: unknown;
}

export interface BackendAuthResponseError {
  type?: "bjpass-auth-response";
  status?: "error";
  error: string;
  message?: string;
  [k: string]: unknown;
}

export type BackendAuthResponse = BackendAuthResponseSuccess | BackendAuthResponseError;
