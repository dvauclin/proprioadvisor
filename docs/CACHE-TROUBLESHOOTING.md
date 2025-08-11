# Résolution des problèmes de cache des articles

## Problème
Après avoir mis à jour un article via le panneau d'admin, les modifications sont visibles sur la page `/blog` mais pas sur la page de l'article individuelle.

## Causes possibles

### 1. Cache Next.js
- Les pages d'articles utilisent `generateStaticParams` qui génère des pages statiques
- Le cache Next.js peut persister plus longtemps que la revalidation configurée

### 2. Cache Supabase
- Supabase peut mettre en cache les requêtes côté serveur
- Les données peuvent être mises en cache au niveau du CDN

### 3. Cache Vercel (si déployé)
- Vercel met en cache les pages au niveau du CDN
- La revalidation peut prendre du temps

## Solutions

### Solution immédiate

1. **Nettoyer le cache local** :
   ```bash
   node scripts/clear-cache.js
   npm run dev
   ```

2. **Forcer la revalidation** :
   ```bash
   node scripts/force-revalidate.js [slug-article]
   ```

3. **Tester les données Supabase** :
   ```bash
   node scripts/test-supabase-articles.js
   ```

### Solution permanente

1. **Désactiver la génération statique** (déjà fait) :
   - Commenté `generateStaticParams` dans `src/app/[slug]/page.tsx`
   - Mis `revalidate = 0` pour forcer la revalidation

2. **Ajouter la revalidation automatique** (déjà fait) :
   - Route API `/api/revalidate` créée
   - Appel automatique après mise à jour d'article

3. **Vérifier les logs** :
   - Les logs de debug sont ajoutés dans `articleService.ts`
   - Vérifier la console pour voir les données récupérées

## Pages de test

- `/test-article-cache` : Affiche les données brutes des articles
- `/api/revalidate` : Force la revalidation des pages

## Debug

1. **Vérifier les données Supabase** :
   ```bash
   node scripts/test-supabase-articles.js
   ```

2. **Vérifier la revalidation** :
   ```bash
   node scripts/test-revalidation.js
   ```

3. **Vérifier les logs** :
   - Regarder la console du navigateur
   - Regarder les logs du serveur Next.js

## Configuration actuelle

- `revalidate = 0` sur les pages d'articles
- Revalidation automatique après mise à jour
- Logs de debug activés
- Génération statique désactivée

## Si le problème persiste

1. Vérifier que les variables d'environnement Supabase sont correctes
2. Vérifier que le serveur de développement est redémarré
3. Vider le cache du navigateur (Ctrl+F5)
4. Vérifier les logs dans la console du navigateur
