"use client";

import { useAuth } from '@/contexts/AuthContext'
import MesLeads from '@/pages/MesLeads'

export default function MesLeadsPage() {
  const { user, loading: authLoading } = useAuth();
  
  // Si l'authentification est en cours de chargement, afficher un loader
  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Si l'utilisateur n'est pas connecté, rediriger vers la connexion
  if (!user) {
    window.location.href = '/connexion';
    return null;
  }

  return <MesLeads user={user} authLoading={authLoading} />;
} 