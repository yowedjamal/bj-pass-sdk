# Référence de l'API

Cette section fournit une documentation complète de l'API du BjPass SDK, incluant toutes les classes, méthodes, types et interfaces disponibles.

## 📚 Vue d'ensemble de l'API

Le BjPass SDK expose plusieurs classes principales qui travaillent ensemble pour fournir une solution d'authentification complète :

- **`BjPassAuthWidget`** - Classe principale du widget d'authentification
- **`ConfigManager`** - Gestion de la configuration et des environnements
- **`OAuthUrlBuilder`** - Construction des URLs OAuth
- **`TokenValidator`** - Validation des tokens JWT et access tokens
- **`PopupManager`** - Gestion des fenêtres popup d'authentification
- **`UIManager`** - Gestion de l'interface utilisateur
- **`SessionManager`** - Gestion des sessions et du stockage
- **`CryptoUtils`** - Utilitaires cryptographiques

## 🔗 Navigation rapide

### Classes principales
- [BjPassAuthWidget](./classes/bjpass-auth-widget.md) - Widget principal d'authentification
- [ConfigManager](./classes/config-manager.md) - Gestionnaire de configuration
- [OAuthUrlBuilder](./classes/oauth-url-builder.md) - Constructeur d'URLs OAuth
- [TokenValidator](./classes/token-validator.md) - Validateur de tokens

### Gestion de l'interface
- [UIManager](./classes/ui-manager.md) - Gestionnaire d'interface
- [PopupManager](./classes/popup-manager.md) - Gestionnaire de popups

### Utilitaires
- [SessionManager](./classes/session-manager.md) - Gestionnaire de session
- [CryptoUtils](./classes/crypto-utils.md) - Utilitaires cryptographiques
- [ErrorHandler](./classes/error-handler.md) - Gestionnaire d'erreurs

### Types et interfaces
- [Types principaux](./types/main-types.md) - Types de base et interfaces
- [Configuration](./types/configuration.md) - Types de configuration
- [Réponses et événements](./types/responses-events.md) - Types de réponses et d'événements

## 🚀 Utilisation rapide

### Import des classes principales

```typescript
import { 
  BjPassAuthWidget,
  ConfigManager,
  OAuthUrlBuilder,
  TokenValidator,
  PopupManager,
  UIManager,
  SessionManager,
  CryptoUtils,
  ErrorHandler
} from 'bj-pass-sdk';
```

### Import des types

```typescript
import type {
  AuthConfig,
  UIOptions,
  TokenResponse,
  BackendAuthResponse,
  EnvironmentKey
} from 'bj-pass-sdk';
```

## 🔧 Architecture des classes

```
BjPassAuthWidget (Classe principale)
├── ConfigManager (Configuration)
├── UIManager (Interface utilisateur)
├── OAuthUrlBuilder (URLs OAuth)
├── TokenValidator (Validation des tokens)
├── PopupManager (Gestion des popups)
├── BackendClient (Client backend)
└── SessionManager (Gestion des sessions)
```

## 📋 Méthodes principales

### BjPassAuthWidget

| Méthode | Description | Retour |
|---------|-------------|---------|
| `constructor(config)` | Initialise le widget | - |
| `startAuthFlow()` | Démarre le flux d'authentification | `Promise<void>` |
| `getUserInfo()` | Récupère les infos utilisateur | `Promise<any>` |
| `logout()` | Déconnecte l'utilisateur | `Promise<void>` |
| `destroy()` | Détruit le widget | `void` |
| `refresh()` | Rafraîchit le widget | `void` |
| `getConfig()` | Récupère la configuration | `AuthConfig` |
| `updateConfig(config)` | Met à jour la configuration | `void` |

### ConfigManager

| Méthode | Description | Retour |
|---------|-------------|---------|
| `constructor(userConfig)` | Initialise le gestionnaire | - |
| `get()` | Récupère la configuration | `AuthConfig` |
| `updateConfig(newConfig)` | Met à jour la configuration | `void` |
| `getEnvironments()` | Liste des environnements | `string[]` |

### OAuthUrlBuilder

| Méthode | Description | Retour |
|---------|-------------|---------|
| `buildAuthorizationUrl(authData)` | Construit l'URL d'autorisation | `Promise<string>` |
| `buildTokenUrl()` | Construit l'URL de token | `string` |
| `buildJWKSUrl()` | Construit l'URL JWKS | `string` |
| `buildIntrospectionUrl()` | Construit l'URL d'introspection | `string` |

## 🎯 Exemples d'utilisation

### Configuration et initialisation

```typescript
import { BjPassAuthWidget } from 'bj-pass-sdk';

const config = {
  environment: 'test',
  clientId: 'your-client-id',
  redirectUri: 'http://localhost:3000/callback',
  ui: {
    container: '#auth-container',
    language: 'fr',
    primaryColor: '#0066cc'
  }
};

const widget = new BjPassAuthWidget(config);
```

### Gestion des événements

```typescript
const widget = new BjPassAuthWidget({
  ...config,
  onSuccess: (data) => {
    console.log('Authentification réussie:', data);
  },
  onError: (error) => {
    console.error('Erreur:', error);
  },
  onLogout: () => {
    console.log('Déconnexion effectuée');
  }
});
```

### Utilisation des utilitaires

```typescript
import { CryptoUtils, SessionManager } from 'bj-pass-sdk';

// Générer des données d'authentification
const authData = SessionManager.generateAndStoreAuthData('openid profile');

// Vérifier la compatibilité du navigateur
if (!CryptoUtils.checkBrowserCompatibility()) {
  console.error('Navigateur non supporté');
}
```

## 🔍 Recherche dans l'API

### Par nom de méthode

- **Authentification** : `startAuthFlow`, `handlePopupResponse`, `exchangeCodeForTokens`
- **Gestion des tokens** : `validateIdToken`, `verifyAccessToken`
- **Interface utilisateur** : `initialize`, `setState`, `destroy`
- **Configuration** : `getConfig`, `updateConfig`, `getEnvironments`

### Par fonctionnalité

- **OAuth/OIDC** : `OAuthUrlBuilder`, `TokenValidator`, PKCE
- **Interface** : `UIManager`, thèmes, personnalisation
- **Sécurité** : `CryptoUtils`, validation des tokens, gestion des sessions
- **Backend** : `BackendClient`, intégration backend

## 📖 Conventions de documentation

### Format des signatures

```typescript
methodName(param1: Type1, param2: Type2): ReturnType
```

### Exemples de code

Tous les exemples sont testables et incluent :
- Import des classes nécessaires
- Configuration complète
- Gestion des erreurs
- Bonnes pratiques

### Types de paramètres

- **Obligatoires** : Sans valeur par défaut
- **Optionnels** : Avec valeur par défaut ou marqués `?`
- **Union types** : `string | number`
- **Génériques** : `<T>`

## 🆘 Support et aide

### Erreurs courantes

- **"Container not found"** : Vérifiez l'ID du conteneur
- **"Invalid client ID"** : Vérifiez votre configuration BjPass
- **"Browser not supported"** : Vérifiez la compatibilité du navigateur

### Débogage

```typescript
// Activer le mode debug
const widget = new BjPassAuthWidget({
  ...config,
  debug: true
});

// Vérifier la configuration
console.log('Config:', widget.getConfig());

// Vérifier l'état de la session
const userInfo = await widget.getUserInfo();
console.log('User info:', userInfo);
```

---

**Prochaine étape :** [Classe BjPassAuthWidget](./classes/bjpass-auth-widget.md)
