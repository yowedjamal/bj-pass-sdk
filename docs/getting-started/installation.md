# Installation et Configuration

Ce guide vous accompagne dans l'installation et la configuration initiale du BjPass SDK.

## 📦 Installation

### Via npm (recommandé)

```bash
npm install bj-pass-sdk
```

### Via yarn

```bash
yarn add bj-pass-sdk
```

### Via CDN

```html
<!-- Version ES Module -->
<script type="module">
  import { BjPassAuthWidget } from 'https://unpkg.com/bj-pass-sdk@latest/dist/index.esm.js';
</script>

<!-- Version UMD (globale) -->
<script src="https://unpkg.com/bj-pass-sdk@latest/dist/index.global.js"></script>
```

## ⚙️ Configuration minimale

### Configuration de base

```typescript
import { BjPassAuthWidget } from 'bj-pass-sdk';

const widget = new BjPassAuthWidget({
  environment: 'test',           // 'test' ou 'production'
  clientId: 'your-client-id',   // Votre ID client BjPass
  redirectUri: 'http://localhost:3000/callback',
  ui: {
    container: '#auth-container'
  }
});
```

### Configuration complète recommandée

```typescript
const config = {
  // Configuration de base
  environment: 'test',
  clientId: 'your-client-id',
  authServer: 'main-as',
  scope: 'openid profile email',
  redirectUri: 'http://localhost:3000/callback',
  
  // Sécurité
  pkce: true,
  verifyAccessToken: true,
  
  // Interface utilisateur
  ui: {
    container: '#auth-container',
    language: 'fr',
    primaryColor: '#0066cc',
    theme: 'default',
    showEnvSelector: true
  },
  
  // Callbacks
  onSuccess: (data) => {
    console.log('Authentification réussie:', data);
  },
  onError: (error) => {
    console.error('Erreur d\'authentification:', error);
  }
};

const widget = new BjPassAuthWidget(config);
```

## 🔑 Obtention des identifiants

### 1. Créer un compte BjPass

Rendez-vous sur [https://tx-pki.gouv.bj](https://tx-pki.gouv.bj) pour créer votre compte développeur.

### 2. Créer une application

Dans votre tableau de bord BjPass :

1. Cliquez sur "Nouvelle application"
2. Remplissez les informations :
   - **Nom de l'application** : Nom descriptif
   - **Type** : Application web
   - **URL de redirection** : Votre URL de callback
   - **Scopes** : Permissions nécessaires

### 3. Récupérer les identifiants

Vous recevrez :
- **Client ID** : Identifiant unique de votre application
- **Client Secret** : Secret pour l'authentification backend (si applicable)

## 🌍 Configuration des environnements

### Environnement de test

```typescript
{
  environment: 'test',
  // URLs automatiquement configurées :
  // - baseUrl: "https://test-tx-pki.gouv.bj"
  // - authServer: "main-as"
}
```

### Environnement de production

```typescript
{
  environment: 'production',
  // URLs automatiquement configurées :
  // - baseUrl: "https://tx-pki.gouv.bj"
  // - authServer: "main-as"
}
```

## 🔧 Configuration de l'interface

### Personnalisation des couleurs

```typescript
ui: {
  primaryColor: '#0066cc',      // Couleur principale
  backgroundColor: '#ffffff',    // Couleur de fond
  borderColor: '#e0e0e0',       // Couleur des bordures
  textColor: '#333333'          // Couleur du texte
}
```

### Choix du thème

```typescript
ui: {
  theme: 'default',    // 'default', 'dark', 'modern', 'minimal'
}
```

### Langues supportées

```typescript
ui: {
  language: 'fr'  // 'fr' (français) ou 'en' (anglais)
}
```

## 📱 Configuration responsive

Le widget s'adapte automatiquement aux différentes tailles d'écran. Pour une personnalisation avancée :

```css
.bjpass-widget {
  max-width: 100%;
  min-width: 300px;
}

@media (max-width: 768px) {
  .bjpass-widget {
    padding: 15px;
    margin: 10px;
  }
}
```

## 🚀 Première utilisation

### 1. Créer le conteneur HTML

```html
<div id="auth-container"></div>
```

### 2. Initialiser le widget

```typescript
import { BjPassAuthWidget } from 'bj-pass-sdk';

const widget = new BjPassAuthWidget({
  environment: 'test',
  clientId: 'your-client-id',
  redirectUri: 'http://localhost:3000/callback',
  ui: {
    container: '#auth-container'
  }
});
```

### 3. Gérer les événements

```typescript
const widget = new BjPassAuthWidget({
  // ... configuration ...
  onSuccess: (data) => {
    console.log('Utilisateur connecté:', data);
    // Rediriger vers le dashboard
    window.location.href = '/dashboard';
  },
  onError: (error) => {
    console.error('Erreur:', error);
    // Afficher un message d'erreur
    showErrorMessage(error.error_description);
  }
});
```

## ✅ Vérification de l'installation

### Test rapide

```typescript
// Vérifier que le widget est initialisé
console.log('Widget config:', widget.getConfig());

// Vérifier l'état de la session
const userInfo = await widget.getUserInfo();
console.log('Utilisateur actuel:', userInfo);
```

### Vérification des erreurs courantes

1. **Erreur de conteneur** : Vérifiez que l'élément HTML existe
2. **Erreur de client ID** : Vérifiez que votre client ID est correct
3. **Erreur de redirection** : Vérifiez que l'URL de redirection correspond à votre configuration BjPass

## 🔄 Mise à jour de la configuration

```typescript
// Mettre à jour la configuration en cours d'exécution
widget.updateConfig({
  environment: 'production',
  ui: {
    primaryColor: '#ff6600'
  }
});
```

## 📋 Checklist d'installation

- [ ] SDK installé via npm/yarn ou chargé via CDN
- [ ] Conteneur HTML créé avec l'ID approprié
- [ ] Identifiants BjPass obtenus (Client ID, etc.)
- [ ] Configuration de base définie
- [ ] URLs de redirection configurées
- [ ] Gestion des événements implémentée
- [ ] Test d'initialisation réussi

## 🆘 Problèmes courants

### "Container not found"
- Vérifiez que l'élément HTML existe avant l'initialisation
- Assurez-vous que l'ID correspond à celui de la configuration

### "Invalid client ID"
- Vérifiez que votre Client ID est correct
- Assurez-vous que votre application est activée dans BjPass

### "Redirect URI mismatch"
- L'URL de redirection doit correspondre exactement à celle configurée dans BjPass
- Vérifiez les protocoles (http vs https) et les ports

---

**Étape suivante :** [Premiers pas avec des exemples pratiques](./examples.md)
