"use client";

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui-kit/dialog";
import { Button } from "@/components/ui-kit/button";
import { Info } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { createConciergerieSlug } from "@/utils/conciergerieUtils";
interface GMBInfoDialogProps {
  conciergerieId: string | null;
}
export const GMBInfoDialog = ({
  conciergerieId
}: GMBInfoDialogProps) => {
  const [conciergerieData, setConciergerieData] = useState<any>(null);
  useEffect(() => {
    if (conciergerieId) {
      fetchConciergerieData();
    }
  }, [conciergerieId]);
  const fetchConciergerieData = async () => {
    if (!conciergerieId) return;
    try {
      const {
        data: conciergerie,
        error
      } = await supabase.from('conciergeries').select('nom').eq('id', conciergerieId).single();
      if (error) throw error;
      setConciergerieData(conciergerie);
    } catch (error) {
      console.error("Error fetching conciergerie data:", error);
    }
  };
  const conciergerieDetailsUrl = conciergerieData ? `https://proprioadvisor.fr/conciergerie-details/${createConciergerieSlug(conciergerieData.nom)}` : "https://proprioadvisor.fr/conciergerie-details/votre-conciergerie";
  return <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="p-1 h-auto px-[2px] py-[2px]">
          <Info className="h-4 w-4 text-blue-500" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] sm:max-h-[90vh] max-sm:max-h-[calc(100vh-1rem)] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ajouter la page conciergerie comme site web sur Google My Business</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-2">Conditions d'éligibilité</h3>
            <p className="text-blue-700">
              Cette option est uniquement disponible si vous avez une fiche Google My Business active pour votre conciergerie.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold">Comment procéder :</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Connectez-vous à votre compte Google My Business</li>
              <li>Accédez à l'administration de votre fiche établissement</li>
              <li>Dans la section "Site web", ajoutez l'URL de votre page détails Proprioadvisor</li>
              <li>Validez les modifications</li>
            </ol>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold mb-2">URL à ajouter sur Google My Business :</h4>
            <div className="bg-white border rounded p-2 font-mono text-sm break-all">
              {conciergerieDetailsUrl}
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-800 mb-2">Important :</h4>
            <p className="text-yellow-700">
              Une vérification sera effectuée mensuellement pour s'assurer que le lien est toujours présent sur votre fiche Google My Business.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>;
};

