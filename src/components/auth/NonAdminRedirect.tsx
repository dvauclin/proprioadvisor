"use client";

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const NonAdminRedirect = () => {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Attendre que l'authentification soit terminée
    if (loading) return;

    // Vérifier que pathname est défini
    if (!pathname) return;

    // Si l'utilisateur est connecté et est admin
    if (user && profile?.role === 'admin') {
      // Pages publiques que les admins ne devraient pas voir
      const publicPages = ['/', '/connexion', '/inscription', '/contact', '/a-propos'];
      
      if (publicPages.includes(pathname)) {
        // Redirection automatique vers le panneau d'admin
        router.push('/admin');
      }
    }
  }, [user, profile, loading, router, pathname]);

  // Ce composant ne rend rien, il gère juste la redirection
  return null;
};

export default NonAdminRedirect;
