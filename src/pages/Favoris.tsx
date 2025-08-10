"use client";

import React, { useState, useEffect } from "react";
import { Heart, Trash2, Send } from "lucide-react";
import { Button } from "@/components/ui-kit/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui-kit/card";
import Head from "next/head";
import { useFavorites } from "@/contexts/FavoritesContext";
import ComparisonCard from "@/components/ui-kit/comparison-card";
import DevisModal from "@/components/conciergerie/DevisModal";
import { useToast } from "@/components/ui-kit/use-toast";
import MultipleDevisModal from "@/components/favoris/MultipleDevisModal";
import { supabase } from "@/integrations/supabase/client";

const Favoris = () => {
  const {
    favorites,
    clearFavorites
  } = useFavorites();
  const {
    toast
  } = useToast();
  const [showSingleDevisModal, setShowSingleDevisModal] = useState(false);
  const [showMultipleDevisModal, setShowMultipleDevisModal] = useState(false);
  const [selectedFormule, setSelectedFormule] = useState<{
    formuleId: string;
    conciergerieId: string;
  } | null>(null);
  const [subscriptions, setSubscriptions] = useState<Map<string, any>>(new Map());
  const [conciergerieRatings, setConciergerieRatings] = useState<Map<string, number>>(new Map());
  const [conciergerieReviewCounts, setConciergerieReviewCounts] = useState<Map<string, number>>(new Map());

  // Vérification de sécurité pour favorites
  const safeFavorites = Array.isArray(favorites) ? favorites : [];
  const favoritesCount = safeFavorites.length;

  // Charger les données des subscriptions et avis pour les favoris
  useEffect(() => {
    const loadSubscriptionData = async () => {
      if (safeFavorites.length === 0) return;

      const conciergerieIds = safeFavorites
        .map(f => f.conciergerie?.id)
        .filter(Boolean) as string[];

      if (conciergerieIds.length === 0) return;

      try {
        // Charger les subscriptions
        const { data: subscriptionData } = await supabase
          .from('subscriptions')
          .select('*')
          .in('conciergerie_id', conciergerieIds);

        const subscriptionMap = new Map();
        subscriptionData?.forEach(sub => {
          subscriptionMap.set(sub.conciergerie_id, sub);
        });
        setSubscriptions(subscriptionMap);

        // Charger les avis
        const { data: avisData } = await supabase
          .from('avis')
          .select('conciergerie_id, note')
          .in('conciergerie_id', conciergerieIds)
          .eq('valide', true);

        const ratingMap = new Map();
        const reviewCountMap = new Map();
        
        // Grouper par conciergerie
        const avisByConciergerie = avisData?.reduce((acc, avis) => {
          if (!acc[avis.conciergerie_id]) {
            acc[avis.conciergerie_id] = [];
          }
          acc[avis.conciergerie_id].push(avis.note);
          return acc;
        }, {} as Record<string, number[]>) || {};

        // Calculer les moyennes et counts
        Object.entries(avisByConciergerie).forEach(([conciergerieId, notes]) => {
          const average = notes.reduce((sum, note) => sum + note, 0) / notes.length;
          ratingMap.set(conciergerieId, average);
          reviewCountMap.set(conciergerieId, notes.length);
        });

        setConciergerieRatings(ratingMap);
        setConciergerieReviewCounts(reviewCountMap);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      }
    };

    loadSubscriptionData();
  }, [safeFavorites]);

  const handleSingleDevisRequest = (formuleId: string, conciergerieId: string) => {
    setSelectedFormule({
      formuleId,
      conciergerieId
    });
    setShowSingleDevisModal(true);
  };

  const handleMultipleContact = () => {
    if (favoritesCount === 0) {
      toast({
        title: "Aucun favori",
        description: "Vous devez d'abord ajouter des formules à vos favoris",
        variant: "destructive"
      });
      return;
    }
    setShowMultipleDevisModal(true);
  };

  const handleClearFavorites = () => {
    clearFavorites();
    toast({
      title: "Favoris supprimés",
      description: "Tous vos favoris ont été supprimés"
    });
  };

  const selectedFormuleData = selectedFormule ? safeFavorites.find(f => f.id === selectedFormule.formuleId) : null;

  return <div className="container mx-auto px-4 py-8">
      <Head>
        <title>Mes favoris - Proprioadvisor</title>
        <meta name="description" content="Retrouvez toutes vos formules de conciergerie favorites et contactez-les facilement." />
        <link rel="canonical" href="https://proprioadvisor.fr/favoris" />
      </Head>

      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Heart className="h-8 w-8 text-red-500" />
          <h1 className="text-3xl font-bold">Mes favoris</h1>
        </div>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          {favoritesCount > 0 ? `Vous avez ${favoritesCount} formule${favoritesCount > 1 ? 's' : ''} en favoris` : "Aucune formule en favoris pour le moment"}
        </p>

        {favoritesCount > 0 && <div className="flex gap-2 justify-center mt-6">
            <Button onClick={handleMultipleContact}>
              <Send className="h-4 w-4 mr-2" />
              Contacter tous
            </Button>
            <Button variant="outline" onClick={handleClearFavorites} className="text-red-600 border-red-600 hover:bg-red-50">
              <Trash2 className="h-4 w-4 mr-2" />
              Vider les favoris
            </Button>
          </div>}
      </div>

      {favoritesCount === 0 ? <Card className="text-center py-12 max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-xl text-gray-600">Aucun favori pour le moment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Heart className="h-16 w-16 text-gray-300 mx-auto" />
              <p className="text-gray-500 max-w-md mx-auto">Parcourez nos conciergeries Airbnb et ajoutez vos formules préférées en cliquant sur l'icône coeur pour pouvoir contacter plusieurs conciergeries en même temps.</p>
              <Button asChild>
                <a href="https://proprioadvisor.fr">Rechercher une conciergerie</a>
              </Button>
            </div>
          </CardContent>
        </Card> : <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {safeFavorites.map(favorite => {
            if (!favorite.conciergerie) return null;
            
            const subscription = subscriptions.get(favorite.conciergerie.id);
            const preloadedRating = conciergerieRatings.get(favorite.conciergerie.id);
            const preloadedReviewsCount = conciergerieReviewCounts.get(favorite.conciergerie.id);
            
            return (
              <ComparisonCard 
                key={favorite.id} 
                formule={favorite} 
                conciergerie={favorite.conciergerie} 
                subscription={subscription}
                onDevisClick={() => handleSingleDevisRequest(favorite.id, favorite.conciergerie!.id)}
                preloadedRating={preloadedRating}
                preloadedReviewsCount={preloadedReviewsCount}
              />
            );
          })}
        </div>}

      <DevisModal open={showSingleDevisModal} onOpenChange={setShowSingleDevisModal} selectedFormule={selectedFormule} formuleData={selectedFormuleData || null} />

      <MultipleDevisModal open={showMultipleDevisModal} onOpenChange={setShowMultipleDevisModal} favorites={safeFavorites} />
    </div>;
};

export default Favoris;

