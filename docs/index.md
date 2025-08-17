# Index de la documentation BjPass SDK

Bienvenue dans la documentation complète du BjPass SDK. Cette page vous guide à travers toutes les sections disponibles.

## 🚀 Démarrage rapide

### [📖 Vue d'ensemble](./README.md)
- Introduction au SDK
- Fonctionnalités principales
- Architecture et composants
- Cas d'usage

### [🔧 Installation et configuration](./getting-started/installation.md)
- Installation via npm/yarn/CDN
- Configuration minimale et avancée
- Obtention des identifiants BjPass
- Première utilisation

### [💡 Exemples pratiques](./getting-started/examples.md)
- Exemple de base
- Configuration avancée
- Intégration backend
- Design responsive
- Gestion d'état

## 🔧 Référence technique

### [📚 Référence de l'API](./api-reference/README.md)
- Vue d'ensemble de l'API
- Classes et méthodes principales
- Architecture des composants
- Exemples d'utilisation

### [🏗️ Classes principales](./api-reference/classes/)
- `BjPassAuthWidget` - Widget principal
- `ConfigManager` - Gestion de la configuration
- `OAuthUrlBuilder` - Construction des URLs OAuth
- `TokenValidator` - Validation des tokens
- `UIManager` - Gestion de l'interface
- `PopupManager` - Gestion des popups
- `SessionManager` - Gestion des sessions
- `CryptoUtils` - Utilitaires cryptographiques
- `ErrorHandler` - Gestion des erreurs

### [🔍 Types et interfaces](./api-reference/types/)
- Types principaux
- Configuration
- Réponses et événements

## ⚡ Fonctionnalités avancées

### [🚀 Sujets avancés](./advanced/README.md)
- Authentification multi-facteurs
- Gestion des sessions avancée
- Intégration avec des frameworks
- Personnalisation poussée

### [🎨 Personnalisation](./advanced/customization/)
- Thèmes et styles personnalisés
- Composants UI personnalisés
- Localisation et internationalisation
- Responsive design avancé

### [🌐 Intégration backend](./advanced/backend/)
- Architecture backend personnalisée
- Gestion des sessions backend
- APIs REST personnalisées
- Webhooks et événements

### [🔒 Sécurité avancée](./advanced/security/)
- PKCE et sécurité OAuth
- Validation des tokens avancée
- Gestion des permissions
- Audit et logging

### [🚀 Déploiement et performance](./advanced/deployment/)
- Optimisation des performances
- Déploiement en production
- Monitoring et métriques
- Tests et qualité

## 📚 Ressources et support

### [📖 Informations supplémentaires](./additional-info/README.md)
- Support et dépannage
- Informations techniques
- Ressources et liens

### [❓ FAQ - Questions fréquentes](./additional-info/faq.md)
- Authentification
- Interface utilisateur
- Configuration
- Sécurité
- Intégration backend
- Support mobile
- Performance
- Débogage
- Migration et compatibilité
- Support et communauté

### [🔧 Guide de dépannage](./additional-info/troubleshooting.md)
- Problèmes courants
- Solutions étape par étape
- Codes d'erreur
- Débogage avancé

### [📋 Changelog](./additional-info/changelog.md)
- Historique des versions
- Nouvelles fonctionnalités
- Corrections de bugs
- Roadmap

### [📞 Support et contact](./additional-info/support.md)
- Comment obtenir de l'aide
- Contact direct
- Support communautaire
- Niveaux de support
- Processus de support

## 🎯 Navigation par cas d'usage

### 🚀 Première utilisation
1. [Vue d'ensemble](./README.md)
2. [Installation et configuration](./getting-started/installation.md)
3. [Exemple de base](./getting-started/examples.md#exemple-de-base)

### 🔧 Intégration dans une application existante
1. [Configuration avancée](./getting-started/examples.md#exemple-avec-configuration-avancée)
2. [Intégration backend](./getting-started/examples.md#exemple-avec-intégration-backend)
3. [Sujets avancés](./advanced/README.md)

### 🎨 Personnalisation de l'interface
1. [Configuration de l'interface](./getting-started/installation.md#configuration-de-linterface)
2. [Thèmes et styles](./advanced/customization/themes-styles.md)
3. [Composants UI personnalisés](./advanced/customization/custom-components.md)

### 🔒 Sécurité et production
1. [Sécurité](./README.md#sécurité)
2. [PKCE et sécurité OAuth](./advanced/security/pkce-security.md)
3. [Déploiement en production](./advanced/deployment/production.md)

### 📱 Support mobile et responsive
1. [Configuration responsive](./getting-started/installation.md#configuration-responsive)
2. [Exemple responsive](./getting-started/examples.md#exemple-responsive)
3. [Responsive design avancé](./advanced/customization/responsive-design.md)

## 🔍 Recherche dans la documentation

### Par fonctionnalité
- **OAuth/OIDC** : [Référence API](./api-reference/README.md), [FAQ OAuth](./additional-info/faq.md#oauth-oidc)
- **Interface** : [Configuration UI](./getting-started/installation.md#configuration-de-linterface), [Thèmes](./advanced/customization/themes-styles.md)
- **Sécurité** : [Sécurité](./README.md#sécurité), [Sécurité avancée](./advanced/security/)
- **Backend** : [Intégration backend](./getting-started/examples.md#exemple-avec-intégration-backend), [Backend avancé](./advanced/backend/)

### Par problème
- **Installation** : [Guide d'installation](./getting-started/installation.md), [FAQ](./additional-info/faq.md#installation)
- **Configuration** : [Configuration](./getting-started/installation.md#configuration-minimale), [FAQ](./additional-info/faq.md#configuration)
- **Erreurs** : [Guide de dépannage](./additional-info/troubleshooting.md), [Codes d'erreur](./additional-info/error-codes.md)
- **Performance** : [Performance](./additional-info/faq.md#performance), [Optimisation](./advanced/deployment/performance.md)

### Par niveau d'expertise
- **Débutant** : [Getting Started](./getting-started/), [FAQ](./additional-info/faq.md)
- **Intermédiaire** : [Exemples avancés](./getting-started/examples.md), [API Reference](./api-reference/README.md)
- **Avancé** : [Sujets avancés](./advanced/README.md), [Déploiement](./advanced/deployment/)

## 📊 Structure de la documentation

```
docs/
├── README.md                    # Vue d'ensemble
├── index.md                     # Index complet (cette page)
├── getting-started/             # Premiers pas
│   ├── installation.md          # Installation et configuration
│   └── examples.md              # Exemples pratiques
├── api-reference/               # Référence technique
│   ├── README.md                # Vue d'ensemble de l'API
│   ├── classes/                 # Documentation des classes
│   └── types/                   # Types et interfaces
├── advanced/                    # Fonctionnalités avancées
│   ├── README.md                # Sujets avancés
│   ├── customization/           # Personnalisation
│   ├── backend/                 # Intégration backend
│   ├── security/                # Sécurité avancée
│   └── deployment/              # Déploiement et performance
└── additional-info/             # Ressources et support
    ├── README.md                # Informations supplémentaires
    ├── faq.md                   # Questions fréquentes
    ├── troubleshooting.md       # Guide de dépannage
    ├── changelog.md             # Historique des versions
    └── support.md               # Support et contact
```

## 🆘 Besoin d'aide ?

### 🔍 Recherche rapide
- **Problème technique** : [FAQ](./additional-info/faq.md) → [Guide de dépannage](./additional-info/troubleshooting.md)
- **Configuration** : [Installation](./getting-started/installation.md) → [Exemples](./getting-started/examples.md)
- **API** : [Référence API](./api-reference/README.md) → [Classes](./api-reference/classes/)
- **Avancé** : [Sujets avancés](./advanced/README.md) → [Déploiement](./advanced/deployment/)

### 📞 Support direct
- **Email** : support@bjpass.bj
- **GitHub** : [Issues](https://github.com/your-repo/bj-pass-sdk/issues)
- **Discussions** : [Forum](https://github.com/your-repo/bj-pass-sdk/discussions)

### 📚 Ressources additionnelles
- **Exemples** : [Exemples pratiques](./getting-started/examples.md)
- **Démo** : [Démonstrations](./additional-info/examples-demos.md)
- **Communauté** : [Discord](https://discord.gg/bjpass), [Stack Overflow](https://stackoverflow.com/questions/tagged/bj-pass-sdk)

## 🔄 Mise à jour de la documentation

Cette documentation est mise à jour régulièrement pour refléter les nouvelles fonctionnalités et améliorations du SDK.

### 📅 Dernière mise à jour
- **Date** : 17 janvier 2024
- **Version** : 0.0.1
- **Statut** : Documentation complète et à jour

### 📋 Prochaines mises à jour
- **Version 0.1.0** : Documentation des thèmes avancés et sessions avancées
- **Version 0.2.0** : Documentation MFA et WebAuthn
- **Version 1.0.0** : Documentation LTS et migration

---

**Prêt à commencer ?** Commencez par la [vue d'ensemble](./README.md) ou allez directement à [l'installation](./getting-started/installation.md)
