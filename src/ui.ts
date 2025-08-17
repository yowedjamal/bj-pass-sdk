
import type { AuthConfig } from "./types";

class UIComponent {
  protected container: HTMLElement;
  protected element: HTMLElement | null = null;
  private eventListeners = new Map<HTMLElement, { event: string; handler: EventListener }[]>();

  constructor(container: HTMLElement) {
    this.container = container;
  }
  protected createElement<T extends keyof HTMLElementTagNameMap>(tag: T, className = "", innerHTML = "") {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (innerHTML) element.innerHTML = innerHTML;
    return element as HTMLElementTagNameMap[T];
  }
  protected addEventListeners(element: HTMLElement, events: Record<string, EventListener>) {
    Object.entries(events).forEach(([event, handler]) => {
      element.addEventListener(event, handler);
      if (!this.eventListeners.has(element)) this.eventListeners.set(element, []);
      this.eventListeners.get(element)!.push({ event, handler });
    });
  }
  removeEventListeners() {
    this.eventListeners.forEach((listeners, element) => {
      listeners.forEach(({ event, handler }) => element.removeEventListener(event, handler));
    });
    this.eventListeners.clear();
  }
  destroy() {
    this.removeEventListeners();
    if (this.element?.parentNode) this.element.parentNode.removeChild(this.element);
  }
  render(): void { throw new Error("render() must be implemented by subclass"); }
  show() { if (this.element) this.element.style.display = "block"; }
  hide() { if (this.element) this.element.style.display = "none"; }
}

export class EnvironmentSelector extends UIComponent {
  constructor(container: HTMLElement, private config: { get(): AuthConfig & { baseUrl: string }; getEnvironments(): string[] }, private onEnvironmentChange: (env: string) => void) {
    super(container);
    this.render();
  }
  render() {
    if (!this.config.get().ui.showEnvSelector) return;
    const currentEnv = this.config.get().environment;
    const envOptions = this.config.getEnvironments().map(env => `
      <label>
        <input type="radio" name="env" value="${env}" ${env === currentEnv ? "checked" : ""}>
        ${env.charAt(0).toUpperCase() + env.slice(1)}
      </label>
    `).join("");
    this.element = this.createElement("div", "bjpass-env-selector", `
      <div class="env-selector-label">Environment:</div>
      ${envOptions}
    `);
    this.element.querySelectorAll('input[name="env"]').forEach((radio) => {
      this.addEventListeners(radio as HTMLInputElement, { change: (e: Event) => this.onEnvironmentChange((e.target as HTMLInputElement).value) });
    });
    this.container.appendChild(this.element);
  }
}

export class LoginButton extends UIComponent {
  constructor(container: HTMLElement, private config: AuthConfig, private onLogin: () => void) {
    super(container);
    this.render();
  }
  render() {
    this.element = this.createElement("button", "bjpass-login-btn", "Se connecter");
    (this.element as HTMLButtonElement).type = "button";
    this.element.style.cssText = `
      width: 100%;
      padding: 12px 24px;
      background-color: ${this.config.ui.primaryColor};
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 16px;
      cursor: pointer;
      transition: background-color 0.2s;
    `;
    this.addEventListeners(this.element, {
      click: () => this.onLogin(),
      mouseover: () => { if (this.element) this.element.style.opacity = "0.9"; },
      mouseout: () => { if (this.element) this.element.style.opacity = "1"; }
    });
    this.container.appendChild(this.element);
  }
  setLoading(isLoading: boolean) {
    if (!this.element) return;
    (this.element as HTMLButtonElement).disabled = isLoading;
    this.element.innerHTML = isLoading ? "Connexion..." : "Se connecter";
  }
}

export class LoadingSpinner extends UIComponent {
  constructor(container: HTMLElement) { super(container); this.render(); }
  render() {
    this.element = this.createElement("div", "bjpass-loading", `
      <div class="spinner"></div>
      <div class="loading-text">Authentification en cours...</div>
    `);
    this.element.style.cssText = "display:none;text-align:center;padding:20px;";
    const spinner = this.element.querySelector(".spinner") as HTMLElement;
    spinner.style.cssText = "border:3px solid #f3f3f3;border-radius:50%;border-top:3px solid #0066cc;width:30px;height:30px;animation:spin 1s linear infinite;margin:0 auto 10px;";
    if (!document.getElementById("bjpass-spinner-styles")) {
      const style = document.createElement("style");
      style.id = "bjpass-spinner-styles";
      style.textContent = "@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}";
      document.head.appendChild(style);
    }
    this.container.appendChild(this.element);
  }
}

export class ErrorDisplay extends UIComponent {
  constructor(container: HTMLElement) { super(container); this.render(); }
  render() {
    this.element = this.createElement("div", "bjpass-error");
    this.element.style.cssText = "display:none;padding:12px;margin:10px 0;background-color:#fee;border:1px solid #fcc;border-radius:4px;color:#c33;font-size:14px;";
    this.container.appendChild(this.element);
  }
  showError(message: string) { if (!this.element) return; this.element.textContent = message; this.show(); }
  clearError() { if (!this.element) return; this.element.textContent = ""; this.hide(); }
}

export class UIManager {
  private container: HTMLElement | null = null;
  private components: any = {};
  private state = { isLoading: false, error: null as string | null };
  private mainElement!: HTMLElement;
  constructor(private config: AuthConfig & { baseUrl: string }) {}
  initialize() {
    this.container = document.querySelector(this.config.ui.container);
    if (!this.container) throw new Error(`Container ${this.config.ui.container} not found`);
    this.createMainContainer();
    this.initializeComponents();
  }
  private createMainContainer() {
    this.mainElement = document.createElement("div");
    this.mainElement.className = "bjpass-widget";
    this.mainElement.style.cssText = "max-width:400px;margin:0 auto;padding:20px;border:1px solid #ddd;border-radius:8px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;";
    const title = document.createElement("h3");
    title.textContent = "Authentification BjPass";
    title.style.cssText = `color:${this.config.ui.primaryColor};text-align:center;margin:0 0 20px;`;
    this.mainElement.appendChild(title);
    this.container!.appendChild(this.mainElement);
  }
  private initializeComponents() {
    this.components.envSelector = new EnvironmentSelector(this.mainElement, { get: () => this.config, getEnvironments: () => ["test","production"] }, this.onEnvironmentChange.bind(this));
    this.components.loginButton = new LoginButton(this.mainElement, this.config, this.onLoginClick.bind(this));
    this.components.loadingSpinner = new LoadingSpinner(this.mainElement);
    this.components.errorDisplay = new ErrorDisplay(this.mainElement);
    const helpText = document.createElement("p");
    helpText.textContent = "Vous serez redirigé vers le service d'authentification sécurisée";
    helpText.style.cssText = "text-align:center;margin:15px 0 0;font-size:.9em;color:#666;";
    this.mainElement.appendChild(helpText);
  }
  setOnEnvironmentChange(cb: (env: string) => void) { (this as any).onEnvironmentChangeCallback = cb; }
  setOnLogin(cb: () => void) { (this as any).onLoginCallback = cb; }
  private onEnvironmentChange(environment: string) { (this as any).onEnvironmentChangeCallback?.(environment); }
  private onLoginClick() { (this as any).onLoginCallback?.(); }
  setState(newState: Partial<{ isLoading: boolean; error: string | null }>) {
    this.state = { ...this.state, ...newState };
    this.updateUI();
  }
  private updateUI() {
    if (this.state.isLoading) {
      this.components.loginButton.setLoading(true);
      this.components.loadingSpinner.show();
      this.components.errorDisplay.clearError();
    } else {
      this.components.loginButton.setLoading(false);
      this.components.loadingSpinner.hide();
      if (this.state.error) this.components.errorDisplay.showError(this.state.error);
      else this.components.errorDisplay.clearError();
    }
  }
  destroy() {
    Object.values(this.components).forEach((c: any) => c?.destroy?.());
    if (this.mainElement?.parentNode) this.mainElement.parentNode.removeChild(this.mainElement);
  }
}
export { UIComponent };
