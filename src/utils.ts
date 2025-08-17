
export class CryptoUtils {
  static generateRandomString(length: number): string {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("");
  }

  static async generateCodeChallenge(codeVerifier: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const digest = await crypto.subtle.digest("SHA-256", data);
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  }

  static base64UrlToArrayBuffer(base64Url: string): ArrayBuffer {
    const padding = "=".repeat((4 - (base64Url.length % 4)) % 4);
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/") + padding;
    const rawData = atob(base64);
    const output = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      output[i] = rawData.charCodeAt(i);
    }
    return output;
  }

  static checkBrowserCompatibility(): boolean {
    return !!(globalThis.crypto && globalThis.crypto.subtle);
  }
}

export class SessionManager {
  static setItem(key: string, value: string): void {
    sessionStorage.setItem(`tx_auth_${key}`, value);
  }
  static getItem(key: string): string | null {
    return sessionStorage.getItem(`tx_auth_${key}`);
  }
  static removeItem(key: string): void {
    sessionStorage.removeItem(`tx_auth_${key}`);
  }
  static clear(): void {
    const keys = ["state", "code_verifier", "nonce", "success", "authenticated", "user"];
    keys.forEach((key) => this.removeItem(key));
  }
  static generateAndStoreAuthData(scope: string): { state: string; nonce?: string; codeVerifier: string } {
    const state = CryptoUtils.generateRandomString(32);
    const nonce = CryptoUtils.generateRandomString(32);
    const codeVerifier = CryptoUtils.generateRandomString(64);
    this.setItem("state", state);
    this.setItem("code_verifier", codeVerifier);
    if (scope.includes("openid")) {
      this.setItem("nonce", nonce);
      return { state, nonce, codeVerifier };
    }
    return { state, codeVerifier };
  }
}
