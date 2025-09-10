"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Formule, Conciergerie } from '@/types';

interface FavoriteFormule extends Formule {
  conciergerie?: Conciergerie;
}

interface FavoritesContextType {
  favorites: FavoriteFormule[];
  addToFavorites: (formule: FavoriteFormule) => void;
  removeFromFavorites: (formuleId: string) => void;
  isFavorite: (formuleId: string) => boolean;
  clearFavorites: () => void;
  favoritesCount: number;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({ children }) => {
  const [favorites, setFavorites] = useState<FavoriteFormule[]>([]);
  const [hasMounted, setHasMounted] = useState(false);

  // Load favorites from localStorage on mount - client only
  useEffect(() => {
    setHasMounted(true);
    const savedFavorites = localStorage.getItem('proprioadvisor-favorites');
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (error) {
        console.error('Error loading favorites from localStorage:', error);
      }
    }
  }, []);

  // Save favorites to localStorage whenever favorites change - client only
  useEffect(() => {
    if (hasMounted) {
      localStorage.setItem('proprioadvisor-favorites', JSON.stringify(favorites));
    }
  }, [favorites, hasMounted]);

  const addToFavorites = (formule: FavoriteFormule) => {
    setFavorites(prev => {
      // Check if already exists
      if (prev.some(f => f.id === formule.id)) {
        return prev;
      }
      return [...prev, formule];
    });
  };

  const removeFromFavorites = (formuleId: string) => {
    setFavorites(prev => prev.filter(f => f.id !== formuleId));
  };

  const isFavorite = (formuleId: string) => {
    return favorites.some(f => f.id === formuleId);
  };

  const clearFavorites = () => {
    setFavorites([]);
  };

  const favoritesCount = favorites.length;

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        clearFavorites,
        favoritesCount
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

