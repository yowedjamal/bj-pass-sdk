# FAQ - Questions fréquentes

Cette section répond aux questions les plus courantes sur le BjPass SDK.

## 🔐 Authentification

### Comment fonctionne l'authentification BjPass ?

L'authentification BjPass utilise le protocole OAuth 2.0 avec PKCE (Proof Key for Code Exchange) pour une sécurité maximale. Le processus se déroule en plusieurs étapes :

1. **Initialisation** : L'utilisateur clique sur le bouton de connexion
2. **Redirection** : Ouverture d'une popup vers le serveur BjPass
3. **Authentification** : L'utilisateur s'authentifie sur BjPass
4. **Callback** : Retour vers votre application avec un code d'autorisation
5. **Échange** : Échange du code contre des tokens d'accès
6. **Validation** : Vérification des tokens et récupération des informations utilisateur

### Quels sont les types d'authentification supportés ?

Le SDK supporte actuellement :
- **Authentification par identifiant/mot de passe** (par défaut)
- **Authentification par certificat** (si configuré)
- **Authentification par SMS** (si configuré)
- **Authentification par email** (si configuré)

L'authentification multi-facteurs (MFA) sera disponible dans les prochaines versions.

### Comment gérer les sessions expirées ?

```typescript
const widget = new BjPassAuthWidget({
  ...config,
  onError: (error) => {
    if (error.error === 'invalid_token') {
      // Token expiré, rediriger vers la connexion
      widget.startAuthFlow();
    }
  }
});

// Vérifier périodiquement la validité de la session
setInterval(async () => {
  try {
    const userInfo = await widget.getUserInfo();
    if (!userInfo) {
      // Session expirée, rediriger
      window.location.href = '/login';
    }
  } catch (error) {
    console.log('Session expirée');
  }
}, 5 * 60 * 1000); // Toutes les 5 minutes
```

## 🎨 Interface utilisateur

### Comment personnaliser l'apparence du widget ?

```typescript
const widget = new BjPassAuthWidget({
  ...config,
  ui: {
    container: '#auth-container',
    language: 'fr',
    primaryColor: '#0066cc',        // Couleur principale
    backgroundColor: '#ffffff',      // Couleur de fond
    borderColor: '#e0e0e0',         // Couleur des bordures
    textColor: '#333333',           // Couleur du texte
    theme: 'modern',                // Thème : 'default', 'dark', 'modern', 'minimal'
    showEnvSelector: true           // Afficher le sélecteur d'environnement
  }
});
```

### Comment créer un thème personnalisé ?

```css
/* CSS personnalisé pour le widget */
.bjpass-widget {
  --bjpass-primary: #ff6600;
  --bjpass-secondary: #666666;
  --bjpass-success: #28a745;
  --bjpass-danger: #dc3545;
  --bjpass-warning: #ffc107;
  --bjpass-info: #17a2b8;
  
  /* Styles personnalisés */
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.bjpass-login-btn {
  background: linear-gradient(135deg, var(--bjpass-primary), #ff8533);
  border: none;
  border-radius: 8px;
  padding: 15px 30px;
  font-size: 18px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.3s ease;
}

.bjpass-login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 102, 0, 0.3);
}
```

### Comment rendre le widget responsive ?

Le widget est responsive par défaut, mais vous pouvez personnaliser davantage :

```css
/* Responsive design personnalisé */
@media (max-width: 768px) {
  .bjpass-widget {
    margin: 10px;
    padding: 15px;
    border-radius: 8px;
  }
  
  .bjpass-login-btn {
    padding: 12px 24px;
    font-size: 16px;
  }
}

@media (max-width: 480px) {
  .bjpass-widget {
    margin: 5px;
    padding: 10px;
  }
  
  .bjpass-login-btn {
    width: 100%;
    margin: 5px 0;
  }
}
```

## ⚙️ Configuration

### Quelle est la configuration minimale requise ?

```typescript
const config = {
  environment: 'test',           // Obligatoire : 'test' ou 'production'
  clientId: 'your-client-id',   // Obligatoire : Votre ID client BjPass
  redirectUri: 'http://localhost:3000/callback', // Obligatoire
  ui: {
    container: '#auth-container' // Obligatoire : ID du conteneur HTML
  }
};
```

### Comment configurer différents environnements ?

```typescript
// Configuration pour le développement
const devConfig = {
  environment: 'test',
  clientId: 'dev-client-id',
  redirectUri: 'http://localhost:3000/callback',
  debug: true
};

// Configuration pour la production
const prodConfig = {
  environment: 'production',
  clientId: 'prod-client-id',
  redirectUri: 'https://yourapp.com/callback',
  debug: false
};

// Utilisation conditionnelle
const config = process.env.NODE_ENV === 'production' ? prodConfig : devConfig;
const widget = new BjPassAuthWidget(config);
```

### Comment mettre à jour la configuration en cours d'exécution ?

```typescript
// Mettre à jour la configuration
widget.updateConfig({
  environment: 'production',
  ui: {
    primaryColor: '#ff6600',
    theme: 'dark'
  }
});

// Récupérer la configuration actuelle
const currentConfig = widget.getConfig();
console.log('Configuration actuelle:', currentConfig);
```

## 🔒 Sécurité

### Qu'est-ce que PKCE et pourquoi l'utiliser ?

PKCE (Proof Key for Code Exchange) est une extension de sécurité pour OAuth 2.0 qui protège contre les attaques par interception de code. Le SDK l'utilise par défaut :

```typescript
const config = {
  ...baseConfig,
  pkce: true,  // Activé par défaut
  // Le SDK génère automatiquement :
  // - code_verifier (chaîne aléatoire de 64 caractères)
  // - code_challenge (hash SHA-256 du code_verifier)
};
```

### Comment valider les tokens reçus ?

```typescript
const config = {
  ...baseConfig,
  verifyAccessToken: true,  // Valider les access tokens
  scope: 'openid profile',  // Scopes pour la validation
  tokenVerificationScopes: ['urn:safelayer:eidas:oauth:token:introspect']
};

// La validation se fait automatiquement lors de l'authentification
// Vous pouvez aussi valider manuellement :
const tokenData = await widget.validateTokens(receivedTokens);
```

### Comment gérer les origines autorisées ?

```typescript
const config = {
  ...baseConfig,
  frontendOrigin: 'https://yourapp.com',
  backendOrigin: 'https://api.yourapp.com',
  // Ou autoriser toutes les origines (non recommandé en production)
  // frontendOrigin: '*',
  // backendOrigin: '*'
};
```

## 🌐 Intégration backend

### Comment intégrer avec mon propre backend ?

```typescript
const config = {
  ...baseConfig,
  useBackend: true,
  backendUrl: 'https://api.yourapp.com',
  backendEndpoints: {
    start: '/auth/start',
    status: '/auth/api/status',
    user: '/auth/api/user',
    logout: '/auth/api/logout',
    refresh: '/auth/api/refresh'
  },
  frontendOrigin: 'https://yourapp.com',
  backendOrigin: 'https://api.yourapp.com'
};
```

### Comment gérer les sessions côté serveur ?

```typescript
// Vérifier le statut de la session
const checkSessionStatus = async () => {
  try {
    const response = await fetch('https://api.yourapp.com/auth/api/status', {
      credentials: 'include'  // Inclure les cookies de session
    });
    
    if (response.ok) {
      const status = await response.json();
      if (status.authenticated) {
        return status.user;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Erreur lors de la vérification de session:', error);
    return null;
  }
};

// Utiliser avec le widget
const widget = new BjPassAuthWidget({
  ...config,
  onSuccess: async (data) => {
    // Vérifier la session backend
    const user = await checkSessionStatus();
    if (user) {
      console.log('Utilisateur authentifié:', user);
    }
  }
});
```

## 📱 Support mobile

### Le widget fonctionne-t-il sur mobile ?

Oui, le widget est entièrement compatible avec les appareils mobiles et s'adapte automatiquement aux différentes tailles d'écran.

### Comment optimiser pour mobile ?

```typescript
const mobileConfig = {
  ...baseConfig,
  ui: {
    ...baseConfig.ui,
    // Désactiver le sélecteur d'environnement sur mobile
    showEnvSelector: window.innerWidth > 768,
    // Utiliser des couleurs plus contrastées
    primaryColor: '#0066cc',
    backgroundColor: '#ffffff'
  }
};

// Détecter les changements de taille d'écran
window.addEventListener('resize', () => {
  widget.updateConfig({
    ui: {
      showEnvSelector: window.innerWidth > 768
    }
  });
});
```

## 🚀 Performance

### Comment optimiser les performances ?

```typescript
// 1. Utiliser le mode production
const config = {
  environment: 'production',
  debug: false,  // Désactiver le mode debug
  analytics: false  // Désactiver les analytics si non nécessaires
};

// 2. Gérer le cycle de vie
useEffect(() => {
  const widget = new BjPassAuthWidget(config);
  
  return () => {
    widget.destroy();  // Nettoyer les ressources
  };
}, []);

// 3. Utiliser la lazy loading
const loadWidget = async () => {
  const { BjPassAuthWidget } = await import('bj-pass-sdk');
  return new BjPassAuthWidget(config);
};
```

### Quelle est la taille du bundle ?

- **Bundle principal** : ~45KB (gzippé)
- **Avec tous les thèmes** : ~52KB (gzippé)
- **Version minifiée** : ~38KB (gzippé)

### Comment réduire la taille du bundle ?

```typescript
// Importer seulement ce qui est nécessaire
import { BjPassAuthWidget } from 'bj-pass-sdk';

// Utiliser le tree-shaking
const config = {
  ui: {
    showEnvSelector: false,  // Désactiver les fonctionnalités non utilisées
    theme: 'default'         // Utiliser un seul thème
  }
};
```

## 🔧 Débogage

### Comment activer le mode debug ?

```typescript
const widget = new BjPassAuthWidget({
  ...config,
  debug: true  // Activer le mode debug
});

// Les informations de debug apparaissent dans la console
// Vous pouvez aussi utiliser :
console.log('Configuration:', widget.getConfig());
console.log('État de la session:', await widget.getUserInfo());
```

### Comment tracer les erreurs ?

```typescript
const widget = new BjPassAuthWidget({
  ...config,
  onError: (error) => {
    // Logger l'erreur
    console.error('Erreur BjPass:', error);
    
    // Envoyer à votre service de logging
    logError({
      timestamp: new Date().toISOString(),
      error: error.error,
      description: error.error_description,
      userAgent: navigator.userAgent,
      url: window.location.href
    });
    
    // Afficher à l'utilisateur
    showErrorMessage(error.error_description || error.error);
  }
});

// Fonction de logging personnalisée
const logError = async (errorData) => {
  try {
    await fetch('/api/log/error', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(errorData)
    });
  } catch (e) {
    console.error('Erreur lors du logging:', e);
  }
};
```

## 🔄 Migration et compatibilité

### Comment migrer depuis une version précédente ?

```typescript
// Ancienne version
const oldWidget = new BjPassWidget(config);

// Nouvelle version
const newWidget = new BjPassAuthWidget({
  ...config,
  // Nouvelles options
  pkce: true,
  verifyAccessToken: true
});

// Migrer les données de session
const oldUserData = oldWidget.getUserData();
if (oldUserData) {
  // Adapter les données si nécessaire
  const adaptedData = adaptUserData(oldUserData);
  // Utiliser avec la nouvelle version
}
```

### Quels navigateurs sont supportés ?

- **Chrome** : 60+
- **Firefox** : 55+
- **Safari** : 11+
- **Edge** : 79+
- **Internet Explorer** : Non supporté

### Comment vérifier la compatibilité ?

```typescript
import { CryptoUtils } from 'bj-pass-sdk';

// Vérifier la compatibilité du navigateur
if (!CryptoUtils.checkBrowserCompatibility()) {
  // Afficher un message d'erreur
  document.getElementById('auth-container').innerHTML = `
    <div class="browser-error">
      <h3>Navigateur non supporté</h3>
      <p>Veuillez utiliser un navigateur moderne pour l'authentification.</p>
      <a href="https://browsehappy.com/" target="_blank">
        Télécharger un navigateur moderne
      </a>
    </div>
  `;
  return;
}

// Continuer avec l'initialisation
const widget = new BjPassAuthWidget(config);
```

## 🤝 Support et communauté

### Où obtenir de l'aide ?

- **Documentation** : Cette documentation complète
- **GitHub Issues** : [Signaler un bug](https://github.com/your-repo/bj-pass-sdk/issues)
- **Discussions** : [Forum communautaire](https://github.com/your-repo/bj-pass-sdk/discussions)
- **Email** : support@bjpass.bj
- **Stack Overflow** : Tag `bj-pass-sdk`

### Comment contribuer au projet ?

1. **Signaler des bugs** : Créer une issue avec un exemple reproductible
2. **Demander des fonctionnalités** : Créer une discussion détaillée
3. **Contribuer au code** : Fork et Pull Request
4. **Améliorer la documentation** : Corriger ou ajouter du contenu
5. **Partager des exemples** : Ajouter des exemples d'utilisation

### Existe-t-il des exemples de code ?

Oui, de nombreux exemples sont disponibles :
- [Exemples de base](../getting-started/examples.md)
- [Exemples avancés](../advanced/README.md)
- [Démonstrations interactives](./examples-demos.md)
- [Intégrations tierces](./third-party-integrations.md)

---

**Question non trouvée ?** Consultez le [guide de dépannage](./troubleshooting.md) ou [contactez-nous](./support.md)
