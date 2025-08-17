# BjPass SDK - Documentation

Bienvenue dans la documentation officielle du **BjPass SDK**, un widget d'authentification OAuth2/OIDC moderne et sécurisé pour les applications web.

## 🚀 Vue d'ensemble

Le BjPass SDK est une solution d'authentification complète qui permet aux développeurs d'intégrer facilement l'authentification sécurisée dans leurs applications web. Basé sur les standards OAuth 2.0 et OpenID Connect, il offre une expérience utilisateur fluide et sécurisée.

### ✨ Fonctionnalités principales

- **Authentification OAuth 2.0/OIDC** : Support complet des standards d'authentification modernes
- **PKCE (Proof Key for Code Exchange)** : Sécurité renforcée pour les applications publiques
- **Gestion des popups** : Interface utilisateur intuitive avec gestion automatique des fenêtres
- **Validation des tokens** : Vérification automatique des JWT et des access tokens
- **Support multi-environnements** : Test et production avec configuration automatique
- **Interface personnalisable** : Thèmes, couleurs et langues configurables
- **Gestion des erreurs** : Système robuste de gestion et d'affichage des erreurs
- **Support backend** : Intégration avec vos propres services backend

### 🏗️ Architecture

Le SDK est construit avec une architecture modulaire et extensible :

```
src/
├── core.ts          # Classes principales (ConfigManager, OAuthUrlBuilder, etc.)
├── ui.ts            # Gestion de l'interface utilisateur
├── utils.ts         # Utilitaires (cryptographie, session)
├── types.ts         # Définitions TypeScript
└── index.ts         # Point d'entrée principal
```

## 📚 Structure de la documentation

### [🚀 Getting Started](./getting-started/)
- Installation et configuration
- Premiers pas
- Exemples de base
- Configuration minimale

### [🔧 API Reference](./api-reference/)
- Classes et méthodes
- Configuration et options
- Types et interfaces
- Événements et callbacks

### [⚡ Advanced](./advanced/)
- Personnalisation avancée
- Intégration backend
- Sécurité et bonnes pratiques
- Déploiement en production

### [📖 Additional Info](./additional-info/)
- FAQ et dépannage
- Changelog
- Migration et compatibilité
- Ressources et liens

## 🎯 Cas d'usage

Le BjPass SDK est idéal pour :

- **Applications web** nécessitant une authentification sécurisée
- **Portails d'entreprise** avec gestion des utilisateurs
- **APIs publiques** avec authentification OAuth
- **Applications SaaS** avec authentification centralisée
- **Systèmes gouvernementaux** nécessitant une sécurité élevée

## 🔒 Sécurité

- **PKCE** pour prévenir les attaques par interception
- **Validation des tokens** avec vérification cryptographique
- **Gestion sécurisée des sessions** avec sessionStorage
- **Protection CSRF** avec validation des états
- **Support des environnements séparés** (test/production)

## 🌐 Support des navigateurs

- **Chrome** 60+
- **Firefox** 55+
- **Safari** 11+
- **Edge** 79+
- **Internet Explorer** : Non supporté

## 📦 Installation

```bash
npm install bj-pass-sdk
```

## 🚀 Utilisation rapide

```html
<!DOCTYPE html>
<html>
<head>
    <title>BjPass Auth Demo</title>
</head>
<body>
    <div id="auth-container"></div>
    
    <script type="module">
        import { BjPassAuthWidget } from 'bj-pass-sdk';
        
        const widget = new BjPassAuthWidget({
            environment: 'test',
            clientId: 'your-client-id',
            redirectUri: 'http://localhost:3000/callback',
            ui: {
                container: '#auth-container'
            }
        });
    </script>
</body>
</html>
```

## 🤝 Contribution

Ce SDK est un projet open source. Les contributions sont les bienvenues !

## 📄 Licence

MIT License - voir le fichier [LICENSE](../LICENSE) pour plus de détails.

---

**Besoin d'aide ?** Consultez notre [FAQ](./additional-info/faq.md) ou [contactez-nous](mailto:support@bjpass.bj).

**Version actuelle :** 0.0.1
