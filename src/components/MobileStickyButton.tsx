"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui-kit/button";
import { Heart, Plus } from "lucide-react";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useAuth } from "@/contexts/AuthContext";

const MobileStickyButton = () => {
  const { favoritesCount } = useFavorites();
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const pathname = usePathname();

  // Always call useEffect hook regardless of early returns
  useEffect(() => {
    setHasMounted(true);
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Show button when user has scrolled down and there's more content below
      const shouldShow = scrollY > 100 && scrollY + windowHeight < documentHeight - 100;
      setIsVisible(shouldShow);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Don't render on server or before mounting
  if (!hasMounted) {
    return null;
  }

  // Don't show on certain pages
  if (pathname === '/connexion' || pathname === '/inscription' || pathname === '/admin' || pathname === '/subscription') {
    return null;
  }



  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {favoritesCount === 0 && !user ? (
        // Bouton "Ajouter conciergerie" seulement si pas de favoris ET pas connecté
        <Button
          asChild
          className="rounded-full shadow-lg bg-brand-chartreuse hover:bg-brand-chartreuse/90 text-black"
        >
          <a href="/inscription">
            <Plus className="mr-2 h-5 w-5" />
            Ajouter conciergerie
          </a>
        </Button>
      ) : favoritesCount > 0 ? (
        // Bouton favoris quand il y a des favoris
        <Button
          className="rounded-full shadow-lg bg-brand-chartreuse hover:bg-brand-chartreuse/90 text-black"
          onClick={() => {
            // Naviguer vers la page favoris
            window.location.href = '/favoris';
          }}
        >
          <Heart className="mr-2 h-5 w-5" />
          Favoris ({favoritesCount})
        </Button>
      ) : null}
    </div>
  );
};

export default MobileStickyButton;
