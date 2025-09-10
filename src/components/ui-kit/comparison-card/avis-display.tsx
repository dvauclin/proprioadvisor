"use client";

import React from "react";
import { supabase } from "@/integrations/supabase/client";
import StarRating from "@/components/ui-kit/star-rating";
import { Button } from "@/components/ui-kit/button";
import { format } from "date-fns/format";
import { fr } from "date-fns/locale/fr";
import { Avis } from "@/types";

interface AvisDisplayProps {
  conciergerieId: string;
  conciergerieName?: string;
  onAddAvis?: () => void;
}

const generateRandomDate = (): Date => {
  const today = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(today.getFullYear() - 1);
  
  const randomTime = oneYearAgo.getTime() + Math.random() * (today.getTime() - oneYearAgo.getTime());
  return new Date(randomTime);
};

const AvisDisplay: React.FC<AvisDisplayProps> = ({ 
  conciergerieId, 
  onAddAvis 
}) => {
  const [avis, setAvis] = React.useState<Avis[]>([]);
  const [loading, setLoading] = React.useState(false); // Pas de loading initial

  React.useEffect(() => {
    const load = async () => {
      if (!conciergerieId) return;
      
      setLoading(true);
      const { data } = await supabase
        .from("avis")
        .select("id, emetteur, note, commentaire, date")
        .eq("conciergerie_id", conciergerieId)
        .eq("valide", true)
        .order("date", { ascending: false });
      
      // Mapper les données pour correspondre au type Avis
      const mappedAvis = (data || []).map((item: any) => ({
        id: item.id,
        emetteur: item.emetteur,
        note: item.note,
        commentaire: item.commentaire,
        date: item.date,
        conciergerieId: conciergerieId,
        valide: true
      }));
      
      setAvis(mappedAvis);
      setLoading(false);
    };
    
    load();
  }, [conciergerieId]);

  // Ne pas afficher de loading, afficher directement le contenu
  return (
    <div className="bg-white rounded-lg p-6 border">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Avis clients</h2>
      </div>
      
      {loading ? (
        <div className="text-center py-8 text-gray-500">
          Chargement des avis...
        </div>
      ) : avis.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">Aucun avis disponible pour cette conciergerie.</p>
          {onAddAvis && (
            <Button onClick={onAddAvis}>
              Laisser le premier avis
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b pb-2">
            <h3 className="font-semibold">
              {avis.length} avis
            </h3>
            {onAddAvis && (
              <Button 
                onClick={onAddAvis}
                variant="outline"
                size="sm"
              >
                Ajouter un avis
              </Button>
            )}
          </div>
          
          <div className="space-y-4">
            {avis.map((avisItem) => {
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
    </div>
  );
};

export default AvisDisplay;

