"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui-kit/dialog';
import { Avis } from '@/types';
import { getAvisByConciergerie } from '@/services/supabaseService';
import StarRating from '@/components/ui-kit/StarRating';
import SimpleAvisForm from '@/components/ui-kit/SimpleAvisForm';
import AvisModal from '@/components/ui-kit/AvisModal';

interface AvisSectionProps {
  conciergerieId: string;
  conciergerieName: string;
  showModalOnClick?: boolean;
}

const AvisSection: React.FC<AvisSectionProps> = ({
  conciergerieId,
  conciergerieName,
  showModalOnClick = false
}) => {
  const [avis, setAvis] = useState<Avis[]>([]);
  const [isAvisFormOpen, setIsAvisFormOpen] = useState(false);
  const [isAvisModalOpen, setIsAvisModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Memoize loadAvis to prevent unnecessary re-renders
  const loadAvis = useCallback(async () => {
    try {
      setLoading(true);
      const avisList = await getAvisByConciergerie(conciergerieId);
      setAvis(avisList);
    } catch (error) {
      console.error('Error loading avis:', error);
    } finally {
      setLoading(false);
    }
  }, [conciergerieId]);

  useEffect(() => {
    loadAvis();
  }, [loadAvis]);

  // Memoize averageRating calculation
  const averageRating = React.useMemo(() => {
    return avis.length > 0 ? avis.reduce((sum, a) => sum + a.note, 0) / avis.length : 0;
  }, [avis]);

  const handleAvisClick = useCallback(() => {
    if (avis.length > 0) {
      if (showModalOnClick) {
        setIsAvisModalOpen(true);
      } else {
        const avisSection = document.getElementById('avis-clients-section');
        if (avisSection) {
          avisSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    } else {
      setIsAvisFormOpen(true);
    }
  }, [avis.length, showModalOnClick]);

  const handleAvisSuccess = useCallback(() => {
    setIsAvisFormOpen(false);
    loadAvis(); // Recharger les avis (même si le nouvel avis ne sera pas visible tant qu'il n'est pas validé)
  }, [loadAvis]);

  if (loading) {
    return <div className="h-6 bg-gray-200 animate-pulse rounded"></div>;
  }

  return (
    <div className="mt-1">
      <button 
        onClick={handleAvisClick} 
        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
      >
        {avis.length > 0 ? (
          <>
            <StarRating rating={averageRating} size="sm" showNumber={false} />
            <span className="text-sm text-gray-600">
              ({avis.length} avis)
            </span>
          </>
        ) : (
          <span className="text-sm hover:underline text-slate-950">
            Laisser un 1er avis
          </span>
        )}
      </button>

      {/* Formulaire d'avis avec overlay forcé et z-index élevé */}
      <Dialog open={isAvisFormOpen} onOpenChange={setIsAvisFormOpen}>
        <DialogContent className="max-w-md bg-white z-[60]">
          <DialogHeader>
            <DialogTitle>Nouvel avis</DialogTitle>
          </DialogHeader>
          <SimpleAvisForm 
            conciergerieId={conciergerieId}
            onSuccess={handleAvisSuccess}
          />
        </DialogContent>
      </Dialog>

      {/* Modal de visualisation des avis avec overlay forcé */}
      {showModalOnClick && (
        <AvisModal
          isOpen={isAvisModalOpen}
          onClose={() => setIsAvisModalOpen(false)}
          onAddAvis={() => {
            setIsAvisModalOpen(false);
            setIsAvisFormOpen(true);
          }}
          avis={avis}
          conciergerieName={conciergerieName}
        />
      )}
    </div>
  );
};

export default AvisSection;
