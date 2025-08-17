type EnvironmentKey = "test" | "production";
interface BackendEndpoints {
    start: string;
    status: string;
    user: string;
    logout: string;
    refresh: string;
}
interface UIOptions {
    showEnvSelector: boolean;
    container: string;
    language: "fr" | "en" | (string & {});
    primaryColor: string;
    theme: "default" | "dark" | "modern" | "minimal" | (string & {});
    backgroundColor?: string;
    borderColor?: string;
    textColor?: string;
}
interface AuthConfig {
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
    onError?: (err: {
        error: string;
        error_description?: string;
    }) => void;
    onLogout?: () => void;
    analytics?: boolean;
    debug?: boolean;
    maxRetries?: number;
    retryDelay?: number;
    returnUrl?: string;
}
interface TokenResponse {
    access_token?: string;
    id_token?: string;
    refresh_token?: string;
    token_type?: string;
    expires_in?: number;
    scope?: string;
    [k: string]: unknown;
}
interface BackendAuthResponseSuccess {
    type?: "bjpass-auth-response";
    status: "success";
    user: unknown;
    [k: string]: unknown;
}
interface BackendAuthResponseError {
    type?: "bjpass-auth-response";
    status?: "error";
    error: string;
    message?: string;
    [k: string]: unknown;
}
type BackendAuthResponse = BackendAuthResponseSuccess | BackendAuthResponseError;

declare class OAuthUrlBuilder {
    private config;
    constructor(config: AuthConfig & {
        baseUrl: string;
    });
    buildAuthorizationUrl(authData: {
        state: string;
        nonce?: string;
        codeVerifier: string;
    }): Promise<string>;
    buildTokenUrl(): string;
    buildJWKSUrl(): string;
    buildIntrospectionUrl(): string;
}
declare class PopupManager {
    private popup;
    private checkInterval;
    open(url: string, onClose?: () => void): void;
    close(): void;
    isOpen(): boolean;
}

declare class UIManager {
    private config;
    private container;
    private components;
    private state;
    private mainElement;
    constructor(config: AuthConfig & {
        baseUrl: string;
    });
    initialize(): void;
    private createMainContainer;
    private initializeComponents;
    setOnEnvironmentChange(cb: (env: string) => void): void;
    setOnLogin(cb: () => void): void;
    private onEnvironmentChange;
    private onLoginClick;
    setState(newState: Partial<{
        isLoading: boolean;
        error: string | null;
    }>): void;
    private updateUI;
    destroy(): void;
}

declare class BackendClient {
    private config;
    private popupManager;
    private uiManager;
    constructor(config: AuthConfig & {
        baseUrl: string;
    }, popupManager: PopupManager, uiManager: UIManager);
    exchangeCode(code: string, state: string): Promise<any>;
    exchangeCodeDirect(code: string, state: string, urlBuilder: OAuthUrlBuilder): Promise<TokenResponse>;
    handleBackendAuthResponse(data: BackendAuthResponse): Promise<void>;
    private handleBackendAuthSuccess;
    private handleBackendAuthError;
    verifyBackendStatus(): Promise<void>;
    startBackendAuthFlow(): Promise<void>;
    getUserInfoFromBackend(): Promise<any>;
    logoutFromBackend(): Promise<void>;
}
declare class BjPassAuthWidget {
    private configManager;
    private uiManager;
    private urlBuilder;
    private tokenValidator;
    private backendClient;
    private popupManager;
    constructor(config?: Partial<AuthConfig>);
    private initialize;
    private setupEventHandlers;
    private setupMessageListener;
    private isValidMessageOrigin;
    startAuthFlow(): Promise<void>;
    private startDirectAuthFlow;
    handlePopupResponse(queryParams: string): Promise<void>;
    exchangeCodeForTokens(code: string, state: string): Promise<void>;
    private validateTokens;
    private handleError;
    getUserInfo(): Promise<any>;
    logout(): Promise<void>;
    destroy(): void;
    refresh(): void;
    getConfig(): AuthConfig & {
        baseUrl: string;
    };
    updateConfig(newConfig: Partial<AuthConfig>): void;
}
declare global {
    interface Window {
        BjPassAuthWidget?: typeof BjPassAuthWidget;
        createBjPassWidget?: (config?: Partial<AuthConfig>) => BjPassAuthWidget;
    }
}

export { BackendClient, BjPassAuthWidget, BjPassAuthWidget as default };
