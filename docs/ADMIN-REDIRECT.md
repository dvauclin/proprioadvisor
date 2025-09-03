# Redirection Automatique des Administrateurs

## Vue d'ensemble

Ce système implémente une redirection automatique des utilisateurs administrateurs vers le panneau d'administration dès qu'ils se connectent ou naviguent sur le site.

## Composants implémentés

### 1. AdminRedirect
- **Fichier** : `src/components/auth/AdminRedirect.tsx`
- **Fonction** : Redirige automatiquement les admins connectés vers `/admin` s'ils ne sont pas déjà sur une page admin
- **Logique** : Vérifie le rôle de l'utilisateur et redirige si nécessaire

### 2. NonAdminRedirect
- **Fichier** : `src/components/auth/NonAdminRedirect.tsx`
- **Fonction** : Empêche les admins d'accéder aux pages publiques
- **Pages protégées** : `/`, `/connexion`, `/inscription`, `/contact`, `/a-propos`

### 3. AdminRedirectNotification
- **Fichier** : `src/components/auth/AdminRedirectNotification.tsx`
- **Fonction** : Affiche une notification informant l'admin de la redirection
- **Durée** : S'affiche pendant 5 secondes

## Intégration

Tous les composants sont intégrés dans le layout principal (`src/app/layout.tsx`) :

```tsx
<Providers>
  <AdminRedirect />
  <NonAdminRedirect />
  <AdminRedirectNotification />
  <PageWrapper>
    {/* Contenu de l'application */}
  </PageWrapper>
</Providers>
```

## Fonctionnement

### Scénario 1 : Connexion d'un admin
1. L'utilisateur se connecte avec un compte admin
2. `AdminRedirect` détecte le rôle admin
3. Redirection automatique vers `/admin`
4. `AdminRedirectNotification` affiche une notification

### Scénario 2 : Navigation d'un admin connecté
1. L'admin navigue vers une page publique (ex: `/`)
2. `NonAdminRedirect` détecte l'accès à une page publique
3. Redirection immédiate vers `/admin`

### Scénario 3 : Utilisateur normal
1. Aucune redirection automatique
2. Navigation normale dans l'application

## Configuration

### Rôle admin
Le système vérifie le champ `role` dans la table `profiles` :
- `role: 'admin'` → Redirection automatique
- `role: 'user'` → Aucune redirection

### Pages protégées
Les pages publiques qui déclenchent une redirection :
- Page d'accueil (`/`)
- Connexion (`/connexion`)
- Inscription (`/inscription`)
- Contact (`/contact`)
- À propos (`/a-propos`)

## Sécurité

- **Session Storage** : Utilisé pour éviter les redirections en boucle
- **Vérification du rôle** : Basée sur le profil utilisateur authentifié
- **Protection des routes** : Empêche l'accès aux pages publiques pour les admins

## Personnalisation

### Modifier les pages protégées
Dans `NonAdminRedirect.tsx`, modifiez le tableau `publicPages` :

```tsx
const publicPages = ['/', '/connexion', '/inscription', '/contact', '/a-propos'];
```

### Modifier le délai de notification
Dans `AdminRedirectNotification.tsx`, modifiez la valeur du timeout :

```tsx
setTimeout(() => {
  setShowNotification(false);
}, 5000); // 5 secondes
```

### Modifier la destination de redirection
Dans `AdminRedirect.tsx`, modifiez le chemin de redirection :

```tsx
router.push('/admin'); // Chemin personnalisable
```

## Tests

Un fichier de test est fourni : `src/components/auth/AdminRedirect.test.tsx`

## Support

Pour toute question ou problème avec cette fonctionnalité, consultez :
- Le contexte d'authentification (`src/contexts/AuthContext.tsx`)
- Les composants de protection des routes
- La documentation Supabase pour la gestion des rôles
