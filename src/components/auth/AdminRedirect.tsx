"use client";

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const AdminRedirect = () => {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Attendre que l'authentification soit terminée
    if (loading) return;

    // Si l'utilisateur est connecté et est admin
    if (user && profile?.role === 'admin') {
      // Si l'utilisateur n'est pas déjà sur une page admin
      if (!pathname.startsWith('/admin')) {
        // Éviter les redirections en boucle en vérifiant l'historique
        const lastPath = sessionStorage.getItem('lastAdminPath');
        if (lastPath !== pathname) {
          sessionStorage.setItem('lastAdminPath', pathname);
          // Redirection automatique vers le panneau d'admin
          router.push('/admin');
        }
      }
    }
  }, [user, profile, loading, router, pathname]);

  // Ce composant ne rend rien, il gère juste la redirection
  return null;
};

export default AdminRedirect;
