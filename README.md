# Airbnb Concierge Advisor - Next.js 14

Application Next.js 14 pour la comparaison de conciergeries Airbnb avec SEO optimisé.

## 🚀 Migration de Vite vers Next.js 14

Ce projet a été migré de React + Vite vers Next.js 14 avec le système de routing app directory pour une meilleure optimisation SEO.

### Principales améliorations

- **SEO optimisé** : Métadonnées dynamiques et génération statique
- **Performance** : Server-side rendering et optimisations Next.js
- **Routing moderne** : Système de routing app directory
- **TypeScript** : Configuration complète TypeScript
- **Tailwind CSS** : Styles optimisés avec configuration Next.js

## 🛠️ Technologies

- **Next.js 14** - Framework React avec app directory
- **TypeScript** - Typage statique
- **Tailwind CSS** - Framework CSS utilitaire
- **Supabase** - Backend as a Service
- **Stripe** - Paiements
- **React Query** - Gestion d'état serveur
- **Radix UI** - Composants d'interface

## 📁 Structure du projet

```
src/
├── app/                    # App directory Next.js 14
│   ├── layout.tsx         # Layout racine
│   ├── page.tsx           # Page d'accueil
│   ├── globals.css        # Styles globaux
│   ├── (protected)/       # Routes protégées
│   └── [dynamic]/         # Routes dynamiques
├── components/            # Composants React
├── pages/                # Pages existantes (adaptées)
├── contexts/             # Contextes React
├── hooks/                # Hooks personnalisés
├── services/             # Services API
├── types/                # Types TypeScript
└── utils/                # Utilitaires
```

## 🚀 Installation

```bash
# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev

# Construire pour la production
npm run build

# Démarrer en production
npm start
```

## 🔧 Configuration

### Variables d'environnement

Créez un fichier `.env.local` :

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

### Configuration Next.js

Le fichier `next.config.js` contient :
- Optimisations d'images
- Headers de sécurité
- Redirections
- Configuration webpack

## 📱 Fonctionnalités

- **Authentification** : Système complet avec Supabase
- **Conciergeries** : Comparaison et détails
- **Blog** : Articles avec SEO optimisé
- **Abonnements** : Gestion avec Stripe
- **Favoris** : Système de favoris
- **Admin** : Panel d'administration
- **Responsive** : Design mobile-first

## 🔍 SEO

Chaque page inclut :
- Métadonnées dynamiques
- Open Graph tags
- Twitter Cards
- Structured data
- Canonical URLs

## 🚀 Déploiement

### Vercel (Recommandé)

```bash
npm run build
vercel --prod
```

### Netlify

```bash
npm run build
netlify deploy --prod --dir=.next
```

## 📝 Scripts disponibles

- `npm run dev` - Serveur de développement
- `npm run build` - Build de production
- `npm run start` - Serveur de production
- `npm run lint` - Linting ESLint

## 🔄 Migration depuis Vite

### Changements principaux

1. **Routing** : React Router → Next.js App Router
2. **Métadonnées** : React Helmet → Next.js Metadata API
3. **Configuration** : Vite → Next.js
4. **Build** : Vite → Next.js

### Fichiers supprimés

- `vite.config.ts`
- `src/main.tsx`
- `src/App.tsx`
- `index.html`

### Fichiers ajoutés

- `next.config.js`
- `src/app/layout.tsx`
- `src/app/page.tsx`
- Routes dans `src/app/`

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature
3. Commit les changements
4. Push vers la branche
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT.
