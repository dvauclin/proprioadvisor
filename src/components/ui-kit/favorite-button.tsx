"use client";

import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui-kit/button';
import { useFavorites } from '@/contexts/FavoritesContext';
import { Formule, Conciergerie } from '@/types';
import { useToast } from '@/components/ui-kit/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

interface FavoriteButtonProps {
  formule: Formule;
  conciergerie?: Conciergerie;
  className?: string;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ 
  formule, 
  conciergerie,
  className = "absolute top-2 right-2 z-10" 
}) => {
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [showFloatingHeart, setShowFloatingHeart] = useState(false);
  const isInFavorites = isFavorite(formule.id);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isInFavorites) {
      removeFromFavorites(formule.id);
      toast({
        title: "RetirÃ© des favoris",
        description: `${formule.nom} a Ã©tÃ© retirÃ© de vos favoris`,
      });
    } else {
      addToFavorites({ ...formule, conciergerie });
      toast({
        title: "AjoutÃ© aux favoris",
        description: `${formule.nom} a Ã©tÃ© ajoutÃ© Ã  vos favoris`,
      });
      
      // DÃ©clencher l'animation du cÅ“ur flottant sur mobile
      if (isMobile) {
        setShowFloatingHeart(true);
        setTimeout(() => setShowFloatingHeart(false), 2000);
      }
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleToggleFavorite}
        className={`${className} bg-white/80 hover:bg-white/90 border border-gray-200 shadow-sm`}
        aria-label={isInFavorites ? "Retirer des favoris" : "Ajouter aux favoris"}
      >
        <Heart 
          className={`h-4 w-4 transition-colors ${
            isInFavorites 
              ? 'fill-red-500 text-red-500' 
              : 'text-gray-400 hover:text-red-500'
          }`} 
        />
      </Button>
      
      {/* Animation du cÅ“ur flottant pour mobile */}
      {showFloatingHeart && isMobile && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <Heart 
            className="absolute h-8 w-8 fill-red-500 text-red-500 animate-float-to-nav"
            style={{
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              animation: 'float-to-nav 2s ease-out forwards'
            }}
          />
        </div>
      )}
    </>
  );
};

export default FavoriteButton;

