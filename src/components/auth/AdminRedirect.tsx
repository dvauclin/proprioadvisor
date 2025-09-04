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

    // Vérifier que pathname est défini
    if (!pathname) return;

    // Si l'utilisateur est connecté et est admin
    if (user && profile?.role === 'admin') {
      // Si l'utilisateur n'est pas déjà sur une page admin
      if (!pathname.startsWith('/admin')) {
        // Ne rediriger que lors de la première connexion, pas à chaque visite de page
        const hasRedirected = sessionStorage.getItem('adminRedirected');
        if (!hasRedirected) {
          sessionStorage.setItem('adminRedirected', 'true');
          // Redirection automatique vers le panneau d'admin uniquement lors de la connexion
          router.push('/admin');
        }
      }
    } else {
      // Si l'utilisateur n'est plus admin ou n'est plus connecté, réinitialiser le flag
      sessionStorage.removeItem('adminRedirected');
    }
  }, [user, profile, loading, router, pathname]);

  // Ce composant ne rend rien, il gère juste la redirection
  return null;
};

export default AdminRedirect;
