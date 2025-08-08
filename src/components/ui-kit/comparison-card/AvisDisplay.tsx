"use client";

import React, { useState, useEffect } from 'react';
import { Avis } from '@/types';
import StarRating from '../StarRating';
import { SimpleAvisForm } from '../SimpleAvisForm';
import { getAvisByConciergerie } from '@/services/avisService';
import { format } from 'date-fns/format';
import { fr } from 'date-fns/locale/fr';
import { Button } from '@/components/ui-kit/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui-kit/dialog';

interface AvisDisplayProps {
  conciergerieId: string;
}

const generateRandomDate = (): Date => {
  const today = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(today.getFullYear() - 1);
  const randomTime = oneYearAgo.getTime() + Math.random() * (today.getTime() - oneYearAgo.getTime());
  return new Date(randomTime);
};

const AvisDisplay: React.FC<AvisDisplayProps> = ({
  conciergerieId
}) => {
  const [avis, setAvis] = useState<Avis[]>([]);
  const [isAvisFormOpen, setIsAvisFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadAvis = async () => {
    try {
      const avisList = await getAvisByConciergerie(conciergerieId);
      setAvis(avisList);
    } catch (error) {
      console.error('Error loading avis:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAvis();
  }, [conciergerieId]);

  const averageRating = avis.length > 0 ? avis.reduce((sum, a) => sum + a.note, 0) / avis.length : 0;

  const handleAvisSuccess = () => {
    setIsAvisFormOpen(false);
    loadAvis();
  };

  if (loading) {
    return <div className="h-6 bg-gray-200 animate-pulse rounded"></div>;
  }

  return (
    <div id="avis-clients-section" className="bg-white rounded-lg border p-6">
      <div className="flex justify-between items-center border-b pb-4 mb-6">
        <h2 className="text-2xl font-bold">Avis clients</h2>
        <Button 
          onClick={() => setIsAvisFormOpen(true)} 
          variant="outline" 
          size="sm"
        >
          Ajouter un avis
        </Button>
      </div>
      
      {avis.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">Aucun avis disponible pour cette conciergerie.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="text-3xl font-bold">{averageRating.toFixed(1)}</div>
              <StarRating rating={averageRating} size="md" showNumber={false} />
              <div className="text-sm text-gray-600 mt-1">
                {avis.length} avis
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            {avis.map(avisItem => {
              let displayDate: Date;
              if (!avisItem.date) {
                displayDate = generateRandomDate();
              } else {
                displayDate = new Date(avisItem.date);
                if (isNaN(displayDate.getTime())) {
                  displayDate = generateRandomDate();
                }
              }

              return (
                <div key={avisItem.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium">{avisItem.emetteur}</p>
                      <StarRating rating={avisItem.note} size="sm" />
                    </div>
                    <span className="text-sm text-gray-500">
                      {format(displayDate, 'dd MMM yyyy', { locale: fr })}
                    </span>
                  </div>
                  {avisItem.commentaire && (
                    <p className="text-gray-700 mt-2">{avisItem.commentaire}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Formulaire d'avis avec overlay forcé */}
      <Dialog open={isAvisFormOpen} onOpenChange={setIsAvisFormOpen}>
        <DialogContent className="max-w-md bg-white z-50">
          <DialogHeader>
            <DialogTitle>Nouvel avis</DialogTitle>
          </DialogHeader>
          <SimpleAvisForm 
            conciergerieId={conciergerieId}
            onSuccess={handleAvisSuccess}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AvisDisplay;
