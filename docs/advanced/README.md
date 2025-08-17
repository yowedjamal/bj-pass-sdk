# Sujets avancés

Cette section couvre les fonctionnalités avancées du BjPass SDK, incluant la personnalisation poussée, l'intégration backend, la sécurité et le déploiement en production.

## 🚀 Fonctionnalités avancées

### 🔧 Personnalisation avancée
- [Thèmes et styles personnalisés](./customization/themes-styles.md)
- [Composants UI personnalisés](./customization/custom-components.md)
- [Localisation et internationalisation](./customization/localization.md)
- [Responsive design avancé](./customization/responsive-design.md)

### 🌐 Intégration backend
- [Architecture backend personnalisée](./backend/custom-backend.md)
- [Gestion des sessions backend](./backend/session-management.md)
- [APIs REST personnalisées](./backend/custom-apis.md)
- [Webhooks et événements](./backend/webhooks-events.md)

### 🔒 Sécurité avancée
- [PKCE et sécurité OAuth](./security/pkce-security.md)
- [Validation des tokens avancée](./security/token-validation.md)
- [Gestion des permissions](./security/permissions.md)
- [Audit et logging](./security/audit-logging.md)

### 🚀 Déploiement et performance
- [Optimisation des performances](./deployment/performance.md)
- [Déploiement en production](./deployment/production.md)
- [Monitoring et métriques](./deployment/monitoring.md)
- [Tests et qualité](./deployment/testing.md)

## 🎯 Cas d'usage avancés

### 🔐 Authentification multi-facteurs

```typescript
import { BjPassAuthWidget } from 'bj-pass-sdk';

class MultiFactorAuthWidget extends BjPassAuthWidget {
  private mfaStep: 'initial' | 'mfa' | 'complete' = 'initial';
  private mfaMethods: string[] = [];
  
  constructor(config: any) {
    super(config);
    this.setupMFAHandlers();
  }
  
  private setupMFAHandlers() {
    // Gérer les étapes MFA
    this.onSuccess = async (data) => {
      if (data.requiresMFA) {
        this.mfaStep = 'mfa';
        this.mfaMethods = data.mfaMethods || ['sms', 'email', 'totp'];
        this.showMFASelection();
      } else {
        this.mfaStep = 'complete';
        this.handleCompleteAuth(data);
      }
    };
  }
  
  private showMFASelection() {
    const container = document.getElementById('auth-container');
    container.innerHTML = `
      <div class="mfa-selection">
        <h3>Vérification en deux étapes</h3>
        <p>Choisissez votre méthode de vérification :</p>
        ${this.mfaMethods.map(method => `
          <button onclick="this.selectMFAMethod('${method}')" class="mfa-btn">
            ${this.getMFAMethodIcon(method)} ${this.getMFAMethodName(method)}
          </button>
        `).join('')}
      </div>
    `;
  }
  
  private async selectMFAMethod(method: string) {
    try {
      const response = await this.sendMFACode(method);
      this.showMFACodeInput(method, response.requestId);
    } catch (error) {
      this.showError('Erreur lors de l\'envoi du code MFA');
    }
  }
  
  private showMFACodeInput(method: string, requestId: string) {
    const container = document.getElementById('auth-container');
    container.innerHTML = `
      <div class="mfa-code-input">
        <h3>Code de vérification</h3>
        <p>Entrez le code envoyé par ${this.getMFAMethodName(method)}</p>
        <input type="text" id="mfa-code" placeholder="Code à 6 chiffres" maxlength="6">
        <button onclick="this.verifyMFACode('${requestId}')" class="verify-btn">
          Vérifier
        </button>
        <button onclick="this.showMFASelection()" class="back-btn">
          Retour
        </button>
      </div>
    `;
  }
  
  private async verifyMFACode(requestId: string) {
    const code = (document.getElementById('mfa-code') as HTMLInputElement).value;
    
    try {
      const response = await this.validateMFACode(requestId, code);
      if (response.success) {
        this.mfaStep = 'complete';
        this.handleCompleteAuth(response.userData);
      } else {
        this.showError('Code incorrect');
      }
    } catch (error) {
      this.showError('Erreur lors de la vérification');
    }
  }
  
  private getMFAMethodIcon(method: string): string {
    const icons = {
      sms: '📱',
      email: '📧',
      totp: '🔐',
      push: '📲'
    };
    return icons[method] || '🔑';
  }
  
  private getMFAMethodName(method: string): string {
    const names = {
      sms: 'SMS',
      email: 'Email',
      totp: 'Application d\'authentification',
      push: 'Notification push'
    };
    return names[method] || method;
  }
  
  private async sendMFACode(method: string) {
    // Implémentation de l'envoi du code MFA
    const response = await fetch('/api/mfa/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ method, userId: this.getCurrentUserId() })
    });
    return await response.json();
  }
  
  private async validateMFACode(requestId: string, code: string) {
    // Implémentation de la validation du code MFA
    const response = await fetch('/api/mfa/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requestId, code })
    });
    return await response.json();
  }
  
  private getCurrentUserId(): string {
    // Récupérer l'ID utilisateur de la session actuelle
    return sessionStorage.getItem('tx_auth_user_id') || '';
  }
  
  private handleCompleteAuth(userData: any) {
    // Gérer l'authentification complète
    this.mfaStep = 'complete';
    this.config.onSuccess?.(userData);
  }
  
  private showError(message: string) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'mfa-error';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
      color: #dc3545;
      background: #f8d7da;
      padding: 10px;
      border-radius: 4px;
      margin: 10px 0;
      text-align: center;
    `;
    
    const container = document.getElementById('auth-container');
    container.appendChild(errorDiv);
    
    setTimeout(() => {
      if (errorDiv.parentNode) {
        errorDiv.parentNode.removeChild(errorDiv);
      }
    }, 5000);
  }
}

// Utilisation
const mfaWidget = new MultiFactorAuthWidget({
  environment: 'test',
  clientId: 'your-client-id',
  redirectUri: 'http://localhost:3000/callback',
  ui: {
    container: '#auth-container',
    language: 'fr'
  }
});
```

### 🔄 Gestion des sessions avancée

```typescript
import { BjPassAuthWidget } from 'bj-pass-sdk';

class AdvancedSessionManager {
  private widget: BjPassAuthWidget;
  private sessionData: Map<string, any> = new Map();
  private refreshTimer: number | null = null;
  private sessionTimeout: number = 30 * 60 * 1000; // 30 minutes
  
  constructor(widget: BjPassAuthWidget) {
    this.widget = widget;
    this.initializeSessionMonitoring();
  }
  
  private initializeSessionMonitoring() {
    // Vérifier la session au chargement
    this.checkSessionStatus();
    
    // Surveiller les changements de visibilité de la page
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.checkSessionStatus();
      }
    });
    
    // Surveiller l'activité utilisateur
    this.setupActivityMonitoring();
    
    // Démarrer le rafraîchissement automatique
    this.startAutoRefresh();
  }
  
  private setupActivityMonitoring() {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    events.forEach(event => {
      document.addEventListener(event, () => {
        this.resetSessionTimeout();
      }, { passive: true });
    });
  }
  
  private resetSessionTimeout() {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }
    
    this.refreshTimer = window.setTimeout(() => {
      this.handleSessionTimeout();
    }, this.sessionTimeout);
  }
  
  private async checkSessionStatus() {
    try {
      const userInfo = await this.widget.getUserInfo();
      if (userInfo) {
        this.updateSessionData('user', userInfo);
        this.updateSessionData('lastActivity', Date.now());
        this.resetSessionTimeout();
      } else {
        this.handleSessionExpired();
      }
    } catch (error) {
      console.error('Erreur lors de la vérification de session:', error);
      this.handleSessionExpired();
    }
  }
  
  private startAutoRefresh() {
    // Rafraîchir la session toutes les 5 minutes
    setInterval(async () => {
      await this.checkSessionStatus();
    }, 5 * 60 * 1000);
  }
  
  private handleSessionTimeout() {
    console.log('Session expirée par inactivité');
    this.showSessionTimeoutWarning();
    
    // Donner 2 minutes à l'utilisateur pour réagir
    setTimeout(() => {
      this.forceLogout();
    }, 2 * 60 * 1000);
  }
  
  private handleSessionExpired() {
    console.log('Session expirée');
    this.clearSessionData();
    this.showSessionExpiredMessage();
  }
  
  private showSessionTimeoutWarning() {
    const warning = document.createElement('div');
    warning.id = 'session-timeout-warning';
    warning.innerHTML = `
      <div class="session-warning">
        <h4>⚠️ Session expirée</h4>
        <p>Votre session va expirer dans 2 minutes par inactivité.</p>
        <button onclick="sessionManager.extendSession()" class="extend-btn">
          Maintenir la session
        </button>
        <button onclick="sessionManager.forceLogout()" class="logout-btn">
          Se déconnecter
        </button>
      </div>
    `;
    
    warning.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #fff3cd;
      border: 1px solid #ffeaa7;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 1000;
      max-width: 300px;
    `;
    
    document.body.appendChild(warning);
  }
  
  private showSessionExpiredMessage() {
    const message = document.createElement('div');
    message.innerHTML = `
      <div class="session-expired">
        <h4>🔒 Session expirée</h4>
        <p>Votre session a expiré. Veuillez vous reconnecter.</p>
        <button onclick="sessionManager.relogin()" class="relogin-btn">
          Se reconnecter
        </button>
      </div>
    `;
    
    // Remplacer le contenu du conteneur d'authentification
    const container = document.getElementById('auth-container');
    if (container) {
      container.innerHTML = message.innerHTML;
    }
  }
  
  private updateSessionData(key: string, value: any) {
    this.sessionData.set(key, value);
    
    // Persister en localStorage
    try {
      localStorage.setItem(`bjpass_session_${key}`, JSON.stringify(value));
    } catch (error) {
      console.warn('Impossible de persister en localStorage:', error);
    }
  }
  
  private getSessionData(key: string): any {
    if (this.sessionData.has(key)) {
      return this.sessionData.get(key);
    }
    
    // Essayer de récupérer depuis localStorage
    try {
      const stored = localStorage.getItem(`bjpass_session_${key}`);
      if (stored) {
        const value = JSON.parse(stored);
        this.sessionData.set(key, value);
        return value;
      }
    } catch (error) {
      console.warn('Impossible de récupérer depuis localStorage:', error);
    }
    
    return null;
  }
  
  private clearSessionData() {
    this.sessionData.clear();
    
    // Nettoyer localStorage
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('bjpass_session_')) {
        localStorage.removeItem(key);
      }
    });
  }
  
  // Méthodes publiques
  async extendSession() {
    try {
      await this.checkSessionStatus();
      this.removeSessionTimeoutWarning();
      console.log('Session étendue avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'extension de session:', error);
    }
  }
  
  async forceLogout() {
    try {
      await this.widget.logout();
      this.clearSessionData();
      this.removeSessionTimeoutWarning();
      console.log('Déconnexion forcée effectuée');
    } catch (error) {
      console.error('Erreur lors de la déconnexion forcée:', error);
    }
  }
  
  async relogin() {
    try {
      await this.widget.startAuthFlow();
    } catch (error) {
      console.error('Erreur lors de la reconnexion:', error);
    }
  }
  
  private removeSessionTimeoutWarning() {
    const warning = document.getElementById('session-timeout-warning');
    if (warning) {
      warning.remove();
    }
  }
  
  // Getters
  get isSessionActive(): boolean {
    return this.sessionData.has('user');
  }
  
  get currentUser(): any {
    return this.getSessionData('user');
  }
  
  get lastActivity(): number {
    return this.getSessionData('lastActivity') || 0;
  }
  
  get sessionAge(): number {
    return Date.now() - this.lastActivity;
  }
}

// Utilisation
const widget = new BjPassAuthWidget(config);
const sessionManager = new AdvancedSessionManager(widget);

// Exposer globalement pour les boutons HTML
(window as any).sessionManager = sessionManager;
```

### 🌐 Intégration avec des frameworks populaires

#### React

```typescript
import React, { useEffect, useRef, useState } from 'react';
import { BjPassAuthWidget } from 'bj-pass-sdk';

interface BjPassAuthProps {
  config: any;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
  onLogout?: () => void;
}

const BjPassAuth: React.FC<BjPassAuthProps> = ({ 
  config, 
  onSuccess, 
  onError, 
  onLogout 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<BjPassAuthWidget | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (containerRef.current && !widgetRef.current) {
      const widget = new BjPassAuthWidget({
        ...config,
        ui: {
          ...config.ui,
          container: containerRef.current
        },
        onSuccess: (data) => {
          setIsAuthenticated(true);
          setUserInfo(data.user || data);
          setError(null);
          setIsLoading(false);
          onSuccess?.(data);
        },
        onError: (error) => {
          setIsAuthenticated(false);
          setUserInfo(null);
          setError(error.error_description || error.error);
          setIsLoading(false);
          onError?.(error);
        },
        onLogout: () => {
          setIsAuthenticated(false);
          setUserInfo(null);
          setError(null);
          onLogout?.();
        }
      });

      widgetRef.current = widget;

      // Vérifier l'état initial
      checkInitialAuthState();
    }

    return () => {
      if (widgetRef.current) {
        widgetRef.current.destroy();
        widgetRef.current = null;
      }
    };
  }, []);

  const checkInitialAuthState = async () => {
    if (!widgetRef.current) return;

    try {
      setIsLoading(true);
      const user = await widgetRef.current.getUserInfo();
      if (user) {
        setIsAuthenticated(true);
        setUserInfo(user);
      }
    } catch (error) {
      console.log('Aucune session existante');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!widgetRef.current) return;

    try {
      setIsLoading(true);
      setError(null);
      await widgetRef.current.startAuthFlow();
    } catch (error) {
      setError('Erreur lors de la connexion');
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    if (!widgetRef.current) return;

    try {
      setIsLoading(true);
      await widgetRef.current.logout();
    } catch (error) {
      setError('Erreur lors de la déconnexion');
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bjpass-loading">
        <div className="spinner"></div>
        <p>Chargement...</p>
      </div>
    );
  }

  if (isAuthenticated && userInfo) {
    return (
      <div className="bjpass-authenticated">
        <h3>✅ Connecté</h3>
        <div className="user-info">
          <p><strong>Nom:</strong> {userInfo.name}</p>
          <p><strong>Email:</strong> {userInfo.email}</p>
        </div>
        <button onClick={handleLogout} className="logout-btn">
          Se déconnecter
        </button>
      </div>
    );
  }

  return (
    <div className="bjpass-auth-container">
      {error && (
        <div className="bjpass-error">
          {error}
        </div>
      )}
      
      <div ref={containerRef} className="bjpass-widget-container" />
      
      <button onClick={handleLogin} className="login-btn">
        Se connecter
      </button>
    </div>
  );
};

export default BjPassAuth;
```

#### Vue.js

```vue
<template>
  <div class="bjpass-auth">
    <div v-if="isLoading" class="bjpass-loading">
      <div class="spinner"></div>
      <p>Chargement...</p>
    </div>
    
    <div v-else-if="isAuthenticated && userInfo" class="bjpass-authenticated">
      <h3>✅ Connecté</h3>
      <div class="user-info">
        <p><strong>Nom:</strong> {{ userInfo.name }}</p>
        <p><strong>Email:</strong> {{ userInfo.email }}</p>
      </div>
      <button @click="handleLogout" class="logout-btn">
        Se déconnecter
      </button>
    </div>
    
    <div v-else class="bjpass-auth-container">
      <div v-if="error" class="bjpass-error">
        {{ error }}
      </div>
      
      <div ref="widgetContainer" class="bjpass-widget-container"></div>
      
      <button @click="handleLogin" class="login-btn">
        Se connecter
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from 'vue';
import { BjPassAuthWidget } from 'bj-pass-sdk';

export default defineComponent({
  name: 'BjPassAuth',
  props: {
    config: {
      type: Object,
      required: true
    },
    onSuccess: {
      type: Function,
      default: null
    },
    onError: {
      type: Function,
      default: null
    },
    onLogout: {
      type: Function,
      default: null
    }
  },
  setup(props, { emit }) {
    const widgetContainer = ref<HTMLElement | null>(null);
    const widget = ref<BjPassAuthWidget | null>(null);
    const isAuthenticated = ref(false);
    const userInfo = ref<any>(null);
    const isLoading = ref(false);
    const error = ref<string | null>(null);

    const checkInitialAuthState = async () => {
      if (!widget.value) return;

      try {
        isLoading.value = true;
        const user = await widget.value.getUserInfo();
        if (user) {
          isAuthenticated.value = true;
          userInfo.value = user;
        }
      } catch (err) {
        console.log('Aucune session existante');
      } finally {
        isLoading.value = false;
      }
    };

    const handleLogin = async () => {
      if (!widget.value) return;

      try {
        isLoading.value = true;
        error.value = null;
        await widget.value.startAuthFlow();
      } catch (err) {
        error.value = 'Erreur lors de la connexion';
        isLoading.value = false;
      }
    };

    const handleLogout = async () => {
      if (!widget.value) return;

      try {
        isLoading.value = true;
        await widget.value.logout();
      } catch (err) {
        error.value = 'Erreur lors de la déconnexion';
        isLoading.value = false;
      }
    };

    onMounted(async () => {
      if (widgetContainer.value) {
        const authWidget = new BjPassAuthWidget({
          ...props.config,
          ui: {
            ...props.config.ui,
            container: widgetContainer.value
          },
          onSuccess: (data) => {
            isAuthenticated.value = true;
            userInfo.value = data.user || data;
            error.value = null;
            isLoading.value = false;
            emit('success', data);
            props.onSuccess?.(data);
          },
          onError: (err) => {
            isAuthenticated.value = false;
            userInfo.value = null;
            error.value = err.error_description || err.error;
            isLoading.value = false;
            emit('error', err);
            props.onError?.(err);
          },
          onLogout: () => {
            isAuthenticated.value = false;
            userInfo.value = null;
            error.value = null;
            emit('logout');
            props.onLogout?.();
          }
        });

        widget.value = authWidget;
        await checkInitialAuthState();
      }
    });

    onUnmounted(() => {
      if (widget.value) {
        widget.value.destroy();
        widget.value = null;
      }
    });

    return {
      widgetContainer,
      isAuthenticated,
      userInfo,
      isLoading,
      error,
      handleLogin,
      handleLogout
    };
  }
});
</script>

<style scoped>
.bjpass-auth {
  max-width: 400px;
  margin: 0 auto;
}

.bjpass-loading {
  text-align: center;
  padding: 20px;
}

.spinner {
  border: 3px solid #f3f3f3;
  border-radius: 50%;
  border-top: 3px solid #0066cc;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
  margin: 0 auto 10px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.bjpass-authenticated {
  text-align: center;
  padding: 20px;
}

.user-info {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  margin: 20px 0;
}

.bjpass-error {
  background: #f8d7da;
  color: #721c24;
  padding: 15px;
  border-radius: 5px;
  margin: 10px 0;
  text-align: center;
}

.login-btn, .logout-btn {
  background: #0066cc;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  width: 100%;
  margin: 10px 0;
}

.logout-btn {
  background: #dc3545;
}

.login-btn:hover, .logout-btn:hover {
  opacity: 0.9;
}
</style>
```

---

**Prochaine étape :** [Thèmes et styles personnalisés](./customization/themes-styles.md)
