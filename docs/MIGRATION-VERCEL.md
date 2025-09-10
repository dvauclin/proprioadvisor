# Migration vers Vercel - Guide Complet

## ✅ Nettoyage Effectué

### Fichiers supprimés :
- ❌ `netlify/` (dossier complet)
- ❌ `netlify.toml`
- ❌ `public/_redirects`
- ❌ `@netlify/functions` (dépendance)

### Fichiers conservés :
- ✅ `vercel.json` (configuration Vercel)
- ✅ `src/app/api/sitemap/` (API routes Next.js)
- ✅ `next.config.mjs` (redirections)

## 🚀 Configuration Vercel

### 1. Variables d'environnement à configurer sur Vercel :

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://gajceuvnerzlnuqvhnan.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdhamNldXZuZXJ6bG51cXZobmFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU5MzM1MzgsImV4cCI6MjA2MTUwOTUzOH0.7gsaxDRXCGBALLfbAawQoFZEPxATam_0oWdgig5oDIs

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key

# Mapbox
NEXT_PUBLIC_MAPBOX_PUBLIC_TOKEN=your_mapbox_token

# Autres
NEXT_PUBLIC_SITE_URL=https://proprioadvisor.fr
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=your_ga_id
```

### 2. Déploiement Vercel :

1. **Connecter le repository** sur Vercel
2. **Framework** : Next.js (auto-détecté)
3. **Build Command** : `npm run build`
4. **Output Directory** : `.next`
5. **Install Command** : `npm install`

## 🔧 Fonctionnalités Migrées

### ✅ Sitemaps
- **Avant** : Fonctions Netlify (`netlify/functions/sitemap-*.ts`)
- **Après** : API routes Next.js (`src/app/api/sitemap/`)
- **URLs** : 
  - `/api/sitemap` (index)
  - `/api/sitemap/pages`
  - `/api/sitemap/villes`
  - `/api/sitemap/conciergeries`

### ✅ Redirections
- **Avant** : `public/_redirects` (Netlify)
- **Après** : `next.config.mjs` rewrites
- **Fonctionnalité** : URLs traditionnelles redirigent vers les API routes

### ✅ Pré-rendu
- **Avant** : Fonction `prerender.ts` (Netlify)
- **Après** : Pré-rendu automatique Next.js
- **Avantages** : Plus rapide, moins de maintenance

## 🧪 Tests

### Test local :
```bash
npm run dev
npm run test-sitemaps-vercel
```

### Test production :
```bash
npm run test-sitemaps-vercel
```

## 📊 Avantages de la Migration

### Performance
- ⚡ Pré-rendu natif Next.js
- 🚀 Optimisations automatiques
- 📦 Bundle optimisé

### Maintenance
- 🔧 Moins de code à maintenir
- 🐛 Moins de bugs potentiels
- 📚 Documentation Next.js standard

### SEO
- 🔍 Pré-rendu automatique pour les bots
- 📄 Meta tags dynamiques
- 🗺️ Sitemaps fonctionnels

## ⚠️ Points d'attention

### Variables d'environnement
- Vérifier que toutes les variables sont configurées sur Vercel
- Les variables `NEXT_PUBLIC_*` sont disponibles côté client
- Les autres variables sont disponibles côté serveur uniquement

### Sitemaps
- Les sitemaps utilisent maintenant les API routes Next.js
- Les URLs traditionnelles redirigent automatiquement
- Testez après déploiement pour vérifier le bon fonctionnement

### Déploiement
- Premier déploiement peut prendre plus de temps
- Vérifier les logs de build pour détecter d'éventuelles erreurs
- Tester toutes les fonctionnalités après déploiement

## 🎯 Prochaines étapes

1. **Déployer sur Vercel**
2. **Configurer les variables d'environnement**
3. **Tester les sitemaps** : `npm run test-sitemaps-vercel`
4. **Vérifier le SEO** avec les outils de test
5. **Monitorer les performances** avec Vercel Analytics

## 📞 Support

En cas de problème :
1. Vérifier les logs de build Vercel
2. Tester localement : `npm run dev`
3. Vérifier les variables d'environnement
4. Consulter la documentation Next.js
