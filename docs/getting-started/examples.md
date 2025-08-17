# Exemples pratiques

Cette section présente des exemples concrets d'utilisation du BjPass SDK dans différents contextes.

## 🎯 Exemple de base

### Authentification simple

```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BjPass Auth - Exemple simple</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        .auth-section {
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        .user-info {
            background-color: #f0f8ff;
            padding: 15px;
            border-radius: 5px;
            margin: 10px 0;
        }
    </style>
</head>
<body>
    <h1>Exemple d'authentification BjPass</h1>
    
    <div class="auth-section">
        <h2>Connexion</h2>
        <div id="auth-container"></div>
    </div>
    
    <div class="auth-section">
        <h2>Informations utilisateur</h2>
        <div id="user-info">Non connecté</div>
        <button id="get-user-btn" onclick="getUserInfo()">Récupérer les infos</button>
        <button id="logout-btn" onclick="logout()" style="display: none;">Déconnexion</button>
    </div>

    <script type="module">
        import { BjPassAuthWidget } from 'bj-pass-sdk';
        
        let widget;
        
        // Initialisation du widget
        function initWidget() {
            widget = new BjPassAuthWidget({
                environment: 'test',
                clientId: 'your-client-id',
                redirectUri: 'http://localhost:3000/callback',
                scope: 'openid profile email',
                ui: {
                    container: '#auth-container',
                    language: 'fr',
                    primaryColor: '#0066cc',
                    theme: 'default'
                },
                onSuccess: (data) => {
                    console.log('Authentification réussie:', data);
                    updateUserInfo();
                    document.getElementById('logout-btn').style.display = 'inline';
                },
                onError: (error) => {
                    console.error('Erreur d\'authentification:', error);
                    document.getElementById('user-info').innerHTML = 
                        `<div style="color: red;">Erreur: ${error.error_description || error.error}</div>`;
                }
            });
        }
        
        // Récupérer les informations utilisateur
        async function getUserInfo() {
            if (!widget) return;
            
            try {
                const userInfo = await widget.getUserInfo();
                if (userInfo) {
                    document.getElementById('user-info').innerHTML = 
                        `<div class="user-info">
                            <strong>Connecté en tant que:</strong><br>
                            <pre>${JSON.stringify(userInfo, null, 2)}</pre>
                        </div>`;
                } else {
                    document.getElementById('user-info').innerHTML = 'Non connecté';
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des infos:', error);
            }
        }
        
        // Déconnexion
        async function logout() {
            if (!widget) return;
            
            try {
                await widget.logout();
                document.getElementById('user-info').innerHTML = 'Non connecté';
                document.getElementById('logout-btn').style.display = 'none';
                console.log('Déconnexion réussie');
            } catch (error) {
                console.error('Erreur lors de la déconnexion:', error);
            }
        }
        
        // Initialiser le widget au chargement de la page
        document.addEventListener('DOMContentLoaded', initWidget);
        
        // Exposer les fonctions globalement pour les boutons
        window.getUserInfo = getUserInfo;
        window.logout = logout;
    </script>
</body>
</html>
```

## 🔧 Exemple avec configuration avancée

### Widget personnalisé avec thème sombre

```typescript
import { BjPassAuthWidget } from 'bj-pass-sdk';

const advancedConfig = {
  environment: 'test',
  clientId: 'your-client-id',
  authServer: 'main-as',
  scope: 'openid profile email phone',
  redirectUri: 'http://localhost:3000/callback',
  
  // Sécurité avancée
  pkce: true,
  verifyAccessToken: true,
  tokenVerificationScopes: ['urn:safelayer:eidas:oauth:token:introspect'],
  
  // Interface personnalisée
  ui: {
    container: '#auth-container',
    language: 'fr',
    primaryColor: '#00ff88',
    theme: 'dark',
    backgroundColor: '#1a1a1a',
    borderColor: '#333333',
    textColor: '#ffffff',
    showEnvSelector: true
  },
  
  // Gestion des événements
  onSuccess: (data) => {
    console.log('✅ Authentification réussie:', data);
    
    // Stocker les informations utilisateur
    localStorage.setItem('bjpass_user', JSON.stringify(data));
    
    // Mettre à jour l'interface
    updateUIAfterAuth(data);
    
    // Rediriger si nécessaire
    if (data.redirectUrl) {
      window.location.href = data.redirectUrl;
    }
  },
  
  onError: (error) => {
    console.error('❌ Erreur d\'authentification:', error);
    
    // Afficher l'erreur de manière élégante
    showErrorNotification(error.error_description || error.error);
    
    // Logger l'erreur pour le support
    logError(error);
  },
  
  onLogout: () => {
    console.log('👋 Déconnexion effectuée');
    
    // Nettoyer le stockage local
    localStorage.removeItem('bjpass_user');
    
    // Mettre à jour l'interface
    updateUIAfterLogout();
  }
};

// Initialiser le widget
const widget = new BjPassAuthWidget(advancedConfig);

// Fonctions utilitaires
function updateUIAfterAuth(data) {
  const container = document.getElementById('auth-container');
  container.innerHTML = `
    <div style="text-align: center; padding: 20px;">
      <h3 style="color: #00ff88;">✅ Authentification réussie !</h3>
      <p>Bienvenue, ${data.user?.name || 'Utilisateur'} !</p>
      <button onclick="logout()" style="background: #ff4444; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">
        Se déconnecter
      </button>
    </div>
  `;
}

function updateUIAfterLogout() {
  const container = document.getElementById('auth-container');
  container.innerHTML = `
    <div style="text-align: center; padding: 20px;">
      <h3>👋 Déconnexion effectuée</h3>
      <p>Vous avez été déconnecté avec succès.</p>
      <button onclick="refresh()" style="background: #00ff88; color: black; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">
        Se reconnecter
      </button>
    </div>
  `;
}

function showErrorNotification(message) {
  // Créer une notification d'erreur élégante
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #ff4444;
    color: white;
    padding: 15px 20px;
    border-radius: 5px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    z-index: 1000;
    max-width: 300px;
  `;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  // Auto-suppression après 5 secondes
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 5000);
}

function logError(error) {
  // Envoyer l'erreur à votre service de logging
  fetch('/api/log/error', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      timestamp: new Date().toISOString(),
      error: error.error,
      description: error.error_description,
      userAgent: navigator.userAgent,
      url: window.location.href
    })
  }).catch(console.error);
}

// Fonctions globales
window.logout = () => widget.logout();
window.refresh = () => widget.refresh();
```

## 🌐 Exemple avec intégration backend

### Authentification avec votre propre backend

```typescript
import { BjPassAuthWidget } from 'bj-pass-sdk';

const backendConfig = {
  environment: 'test',
  clientId: 'your-client-id',
  redirectUri: 'http://localhost:3000/callback',
  
  // Configuration backend
  useBackend: true,
  backendUrl: 'https://your-backend.com',
  backendEndpoints: {
    start: '/auth/start',
    status: '/auth/api/status',
    user: '/auth/api/user',
    logout: '/auth/api/logout',
    refresh: '/auth/api/refresh'
  },
  
  // Origines autorisées
  frontendOrigin: 'http://localhost:3000',
  backendOrigin: 'https://your-backend.com',
  
  // Interface
  ui: {
    container: '#auth-container',
    language: 'fr',
    primaryColor: '#0066cc'
  },
  
  // Callbacks
  onSuccess: async (data) => {
    console.log('Authentification backend réussie:', data);
    
    try {
      // Vérifier le statut sur le backend
      const status = await checkBackendStatus();
      if (status.authenticated) {
        // Récupérer les informations utilisateur complètes
        const userInfo = await getUserInfoFromBackend();
        updateUserInterface(userInfo);
      }
    } catch (error) {
      console.error('Erreur lors de la vérification backend:', error);
    }
  },
  
  onError: (error) => {
    console.error('Erreur d\'authentification:', error);
    showError(error.error_description || error.error);
  }
};

// Initialiser le widget
const widget = new BjPassAuthWidget(backendConfig);

// Fonctions utilitaires pour le backend
async function checkBackendStatus() {
  const response = await fetch('https://your-backend.com/auth/api/status', {
    credentials: 'include'
  });
  
  if (!response.ok) {
    throw new Error(`Erreur HTTP: ${response.status}`);
  }
  
  return await response.json();
}

async function getUserInfoFromBackend() {
  const response = await fetch('https://your-backend.com/auth/api/user', {
    credentials: 'include'
  });
  
  if (!response.ok) {
    throw new Error(`Erreur HTTP: ${response.status}`);
  }
  
  return await response.json();
}

function updateUserInterface(userInfo) {
  const container = document.getElementById('user-info');
  container.innerHTML = `
    <div class="user-card">
      <h3>👤 ${userInfo.name}</h3>
      <p><strong>Email:</strong> ${userInfo.email}</p>
      <p><strong>Rôle:</strong> ${userInfo.role}</p>
      <p><strong>Dernière connexion:</strong> ${new Date(userInfo.lastLogin).toLocaleString()}</p>
      <button onclick="logout()" class="logout-btn">Se déconnecter</button>
    </div>
  `;
}

function showError(message) {
  const errorDiv = document.getElementById('error-message');
  errorDiv.textContent = message;
  errorDiv.style.display = 'block';
  
  setTimeout(() => {
    errorDiv.style.display = 'none';
  }, 5000);
}

// Fonction de déconnexion
window.logout = async () => {
  try {
    await widget.logout();
    document.getElementById('user-info').innerHTML = '<p>Non connecté</p>';
    console.log('Déconnexion réussie');
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
  }
};
```

## 📱 Exemple responsive

### Widget adaptatif pour mobile et desktop

```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BjPass Auth - Responsive</title>
    <style>
        * {
            box-sizing: border-box;
        }
        
        body {
            margin: 0;
            padding: 20px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        
        .auth-wrapper {
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            overflow: hidden;
            margin: 20px 0;
        }
        
        .auth-header {
            background: linear-gradient(135deg, #0066cc 0%, #004499 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        
        .auth-header h1 {
            margin: 0;
            font-size: 2.5rem;
            font-weight: 300;
        }
        
        .auth-header p {
            margin: 10px 0 0;
            opacity: 0.9;
            font-size: 1.1rem;
        }
        
        .auth-content {
            padding: 40px;
        }
        
        #auth-container {
            max-width: 400px;
            margin: 0 auto;
        }
        
        .user-dashboard {
            display: none;
            text-align: center;
        }
        
        .user-avatar {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            background: #0066cc;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2rem;
            margin: 0 auto 20px;
        }
        
        .user-info {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
        }
        
        .btn {
            background: #0066cc;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 6px;
            font-size: 16px;
            cursor: pointer;
            transition: all 0.3s ease;
            margin: 10px;
        }
        
        .btn:hover {
            background: #004499;
            transform: translateY(-2px);
        }
        
        .btn-danger {
            background: #dc3545;
        }
        
        .btn-danger:hover {
            background: #c82333;
        }
        
        /* Responsive design */
        @media (max-width: 768px) {
            body {
                padding: 10px;
            }
            
            .auth-header h1 {
                font-size: 2rem;
            }
            
            .auth-content {
                padding: 20px;
            }
            
            #auth-container {
                max-width: 100%;
            }
        }
        
        @media (max-width: 480px) {
            .auth-header {
                padding: 20px;
            }
            
            .auth-header h1 {
                font-size: 1.8rem;
            }
            
            .auth-content {
                padding: 15px;
            }
            
            .btn {
                width: 100%;
                margin: 5px 0;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="auth-wrapper">
            <div class="auth-header">
                <h1>🔐 BjPass Auth</h1>
                <p>Authentification sécurisée et moderne</p>
            </div>
            
            <div class="auth-content">
                <div id="auth-container"></div>
                
                <div id="user-dashboard" class="user-dashboard">
                    <div class="user-avatar" id="user-avatar">👤</div>
                    <h2 id="user-name">Utilisateur</h2>
                    <div class="user-info" id="user-details">
                        <p><strong>Email:</strong> <span id="user-email">-</span></p>
                        <p><strong>Rôle:</strong> <span id="user-role">-</span></p>
                        <p><strong>Dernière connexion:</strong> <span id="user-last-login">-</span></p>
                    </div>
                    <button class="btn btn-danger" onclick="logout()">Se déconnecter</button>
                </div>
            </div>
        </div>
    </div>

    <script type="module">
        import { BjPassAuthWidget } from 'bj-pass-sdk';
        
        let widget;
        
        // Configuration responsive
        const config = {
            environment: 'test',
            clientId: 'your-client-id',
            redirectUri: 'http://localhost:3000/callback',
            scope: 'openid profile email',
            ui: {
                container: '#auth-container',
                language: 'fr',
                primaryColor: '#0066cc',
                theme: 'modern'
            },
            onSuccess: (data) => {
                console.log('✅ Authentification réussie:', data);
                showUserDashboard(data);
            },
            onError: (error) => {
                console.error('❌ Erreur:', error);
                showError(error.error_description || error.error);
            }
        };
        
        // Initialiser le widget
        function initWidget() {
            widget = new BjPassAuthWidget(config);
            
            // Vérifier si l'utilisateur est déjà connecté
            checkExistingSession();
        }
        
        // Vérifier la session existante
        async function checkExistingSession() {
            try {
                const userInfo = await widget.getUserInfo();
                if (userInfo) {
                    showUserDashboard({ user: userInfo });
                }
            } catch (error) {
                console.log('Aucune session existante');
            }
        }
        
        // Afficher le tableau de bord utilisateur
        function showUserDashboard(data) {
            const user = data.user || data;
            
            // Masquer le widget d'authentification
            document.getElementById('auth-container').style.display = 'none';
            
            // Afficher le tableau de bord
            const dashboard = document.getElementById('user-dashboard');
            dashboard.style.display = 'block';
            
            // Mettre à jour les informations utilisateur
            document.getElementById('user-name').textContent = user.name || 'Utilisateur';
            document.getElementById('user-email').textContent = user.email || '-';
            document.getElementById('user-role').textContent = user.role || 'Utilisateur';
            document.getElementById('user-last-login').textContent = 
                user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Maintenant';
            
            // Mettre à jour l'avatar
            const avatar = document.getElementById('user-avatar');
            if (user.name) {
                avatar.textContent = user.name.charAt(0).toUpperCase();
            }
        }
        
        // Afficher une erreur
        function showError(message) {
            const errorDiv = document.createElement('div');
            errorDiv.style.cssText = `
                background: #f8d7da;
                color: #721c24;
                padding: 15px;
                border-radius: 5px;
                margin: 20px 0;
                text-align: center;
            `;
            errorDiv.textContent = message;
            
            const container = document.getElementById('auth-container');
            container.appendChild(errorDiv);
            
            // Auto-suppression après 5 secondes
            setTimeout(() => {
                if (errorDiv.parentNode) {
                    errorDiv.parentNode.removeChild(errorDiv);
                }
            }, 5000);
        }
        
        // Fonction de déconnexion
        window.logout = async () => {
            try {
                await widget.logout();
                
                // Masquer le tableau de bord
                document.getElementById('user-dashboard').style.display = 'none';
                
                // Réafficher le widget d'authentification
                const authContainer = document.getElementById('auth-container');
                authContainer.style.display = 'block';
                
                // Rafraîchir le widget
                widget.refresh();
                
                console.log('✅ Déconnexion réussie');
            } catch (error) {
                console.error('❌ Erreur lors de la déconnexion:', error);
            }
        };
        
        // Initialiser au chargement de la page
        document.addEventListener('DOMContentLoaded', initWidget);
    </script>
</body>
</html>
```

## 🔄 Exemple avec gestion d'état

### Widget avec état persistant et rafraîchissement automatique

```typescript
import { BjPassAuthWidget } from 'bj-pass-sdk';

class AuthManager {
  private widget: BjPassAuthWidget;
  private authState: 'idle' | 'loading' | 'authenticated' | 'error' = 'idle';
  private userInfo: any = null;
  private refreshInterval: number | null = null;
  
  constructor(config: any) {
    this.widget = new BjPassAuthWidget({
      ...config,
      onSuccess: this.handleAuthSuccess.bind(this),
      onError: this.handleAuthError.bind(this),
      onLogout: this.handleLogout.bind(this)
    });
    
    this.initialize();
  }
  
  private async initialize() {
    try {
      this.setState('loading');
      
      // Vérifier la session existante
      const existingUser = await this.widget.getUserInfo();
      if (existingUser) {
        this.userInfo = existingUser;
        this.setState('authenticated');
        this.startAutoRefresh();
      } else {
        this.setState('idle');
      }
    } catch (error) {
      console.error('Erreur lors de l\'initialisation:', error);
      this.setState('error');
    }
  }
  
  private setState(newState: typeof this.authState) {
    this.authState = newState;
    this.updateUI();
    this.emitStateChange(newState);
  }
  
  private updateUI() {
    const container = document.getElementById('auth-container');
    if (!container) return;
    
    switch (this.authState) {
      case 'idle':
        container.innerHTML = `
          <div class="auth-welcome">
            <h3>🔐 Connexion BjPass</h3>
            <p>Connectez-vous pour accéder à votre espace</p>
            <button onclick="authManager.login()" class="btn btn-primary">
              Se connecter
            </button>
          </div>
        `;
        break;
        
      case 'loading':
        container.innerHTML = `
          <div class="auth-loading">
            <div class="spinner"></div>
            <p>Vérification de la session...</p>
          </div>
        `;
        break;
        
      case 'authenticated':
        container.innerHTML = `
          <div class="auth-success">
            <h3>✅ Connecté</h3>
            <div class="user-info">
              <p><strong>Nom:</strong> ${this.userInfo?.name || 'Utilisateur'}</p>
              <p><strong>Email:</strong> ${this.userInfo?.email || '-'}</p>
            </div>
            <button onclick="authManager.logout()" class="btn btn-secondary">
              Se déconnecter
            </button>
          </div>
        `;
        break;
        
      case 'error':
        container.innerHTML = `
          <div class="auth-error">
            <h3>❌ Erreur</h3>
            <p>Une erreur est survenue lors de la vérification de la session</p>
            <button onclick="authManager.retry()" class="btn btn-primary">
              Réessayer
            </button>
          </div>
        `;
        break;
    }
  }
  
  private emitStateChange(state: typeof this.authState) {
    // Émettre un événement personnalisé
    const event = new CustomEvent('authStateChange', {
      detail: { state, userInfo: this.userInfo }
    });
    window.dispatchEvent(event);
  }
  
  private handleAuthSuccess(data: any) {
    this.userInfo = data.user || data;
    this.setState('authenticated');
    this.startAutoRefresh();
    
    // Stocker en localStorage pour la persistance
    localStorage.setItem('bjpass_user', JSON.stringify(this.userInfo));
  }
  
  private handleAuthError(error: any) {
    console.error('Erreur d\'authentification:', error);
    this.setState('error');
    
    // Nettoyer le localStorage en cas d'erreur
    localStorage.removeItem('bjpass_user');
  }
  
  private handleLogout() {
    this.userInfo = null;
    this.setState('idle');
    this.stopAutoRefresh();
    
    // Nettoyer le localStorage
    localStorage.removeItem('bjpass_user');
  }
  
  private startAutoRefresh() {
    // Rafraîchir la session toutes les 5 minutes
    this.refreshInterval = window.setInterval(async () => {
      try {
        const userInfo = await this.widget.getUserInfo();
        if (userInfo) {
          this.userInfo = userInfo;
          this.updateUI();
        } else {
          // Session expirée
          this.handleLogout();
        }
      } catch (error) {
        console.error('Erreur lors du rafraîchissement:', error);
        this.handleLogout();
      }
    }, 5 * 60 * 1000); // 5 minutes
  }
  
  private stopAutoRefresh() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
    }
  }
  
  // Méthodes publiques
  async login() {
    try {
      this.setState('loading');
      await this.widget.startAuthFlow();
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      this.setState('error');
    }
  }
  
  async logout() {
    try {
      await this.widget.logout();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  }
  
  async retry() {
    await this.initialize();
  }
  
  getState() {
    return this.authState;
  }
  
  getUserInfo() {
    return this.userInfo;
  }
  
  destroy() {
    this.stopAutoRefresh();
    this.widget.destroy();
  }
}

// Utilisation
const authManager = new AuthManager({
  environment: 'test',
  clientId: 'your-client-id',
  redirectUri: 'http://localhost:3000/callback',
  ui: {
    container: '#auth-container',
    language: 'fr',
    primaryColor: '#0066cc'
  }
});

// Écouter les changements d'état
window.addEventListener('authStateChange', (event) => {
  const { state, userInfo } = event.detail;
  console.log('État d\'authentification changé:', state, userInfo);
  
  // Mettre à jour d'autres parties de l'application
  updateNavigation(state === 'authenticated');
  updateUserMenu(userInfo);
});

// Fonctions utilitaires
function updateNavigation(isAuthenticated: boolean) {
  const nav = document.querySelector('nav');
  if (nav) {
    nav.style.display = isAuthenticated ? 'block' : 'none';
  }
}

function updateUserMenu(userInfo: any) {
  const userMenu = document.getElementById('user-menu');
  if (userMenu && userInfo) {
    userMenu.innerHTML = `
      <span>Bonjour, ${userInfo.name}</span>
      <button onclick="authManager.logout()">Déconnexion</button>
    `;
  }
}

// Exposer globalement pour les boutons HTML
(window as any).authManager = authManager;
```

---

**Prochaine étape :** [Référence complète de l'API](./../api-reference/README.md)
