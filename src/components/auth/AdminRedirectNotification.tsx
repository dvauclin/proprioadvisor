"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePathname } from 'next/navigation';
import { Alert, AlertDescription } from '@/components/ui-kit/alert';
import { Shield, ArrowRight } from 'lucide-react';

const AdminRedirectNotification = () => {
  const { user, profile, loading } = useAuth();
  const pathname = usePathname();
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    if (loading) return;

    // Si l'utilisateur est connecté et est admin
    if (user && profile?.role === 'admin') {
      // Si l'utilisateur n'est pas sur une page admin
      if (!pathname.startsWith('/admin')) {
        setShowNotification(true);
        
        // Masquer la notification après 5 secondes
        const timer = setTimeout(() => {
          setShowNotification(false);
        }, 5000);

        return () => clearTimeout(timer);
      }
    }
  }, [user, profile, loading, pathname]);

  if (!showNotification) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <Alert className="border-blue-200 bg-blue-50">
        <Shield className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <div className="flex items-center gap-2">
            <span>Redirection automatique vers le panneau d'administration</span>
            <ArrowRight className="h-4 w-4 animate-pulse" />
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default AdminRedirectNotification;
