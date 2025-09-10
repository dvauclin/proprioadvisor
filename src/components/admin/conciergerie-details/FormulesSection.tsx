"use client";

import React, { useEffect, useState } from "react";
import { Formule } from "@/types";
import { Separator } from "@/components/ui-kit/separator";
import FormuleCard from "./FormuleCard";
import { Loader2, Info, Database, Bug } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui-kit/accordion";
import { useToast } from "@/components/ui-kit/use-toast";

interface FormulesSectionProps {
  formules: Formule[];
  loading: boolean;
  conciergerieId: string;
}

const FormulesSection: React.FC<FormulesSectionProps> = ({
  formules,
  loading,
  conciergerieId,
}) => {
  const [debugInfo, setDebugInfo] = useState<string>("");
  const { toast } = useToast();
  
  // Utilisons une référence pour éviter les notifications en double
  const notificationShown = React.useRef<boolean>(false);
  // 0tat pour suivre si les formules ont été chargées avec succès
  const [formulesLoaded, setFormulesLoaded] = useState<boolean>(false);
  
  useEffect(() => {
    // Mettre à jour l'état de chargement des formules
    if (formules.length > 0 && !formulesLoaded) {
      setFormulesLoaded(true);
    }
    
    // Log pour le debug dans la console et dans le composant
    console.log(`Affichage des formules pour conciergerie ${conciergerieId}:`, formules);
    
    // 0viter les notifications en double en utilisant la référence
    if (!notificationShown.current) {
      // Seulement afficher une notification si le chargement est terminé
      if (!loading) {
        if (formules.length === 0) {
          const message = `Aucune formule trouvée pour la conciergerie ID: ${conciergerieId}`;
          setDebugInfo(message);
          toast({
            title: "Information",
            description: message,
            variant: "default",
          });
        } else {
          const message = `${formules.length} formule(s) trouvée(s) pour l'ID: ${conciergerieId}`;
          setDebugInfo(message);
          toast({
            title: "Succès",
            description: message,
          });
        }
        
        // Marquer que la notification a été affichée
        notificationShown.current = true;
      }
    }
  }, [formules, loading, conciergerieId, toast, formulesLoaded]);

  return (
    <div>
      <Separator className="my-6" />
      
      <div>
        <h3 className="text-lg font-medium mb-4 flex items-center">
          Formules ({formules.length})
          <span className="ml-2 text-sm text-muted-foreground bg-gray-100 px-2 py-0.5 rounded">ID: {conciergerieId}</span>
        </h3>
        
        {loading ? (
          <div className="text-center py-8 border border-dashed border-gray-300 rounded-md bg-gray-50">
            <Loader2 className="h-8 w-8 mx-auto animate-spin text-blue-500" />
            <p className="mt-2 text-gray-600">Chargement des formules...</p>
          </div>
        ) : formules.length > 0 ? (
          <div className="space-y-4">
            {formules.map((formule) => (
              <FormuleCard
                key={formule.id}
                formule={formule}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 border border-dashed border-gray-300 rounded-md bg-gray-50">
            <Database className="h-8 w-8 mx-auto text-blue-500" />
            <p className="mt-2">Aucune formule trouvée pour cette conciergerie</p>
            <p className="text-sm mt-1">ID de conciergerie: <code className="bg-gray-100 px-1 py-0.5 rounded">{conciergerieId}</code></p>
            
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
              <div className="flex items-center gap-2 mb-2">
                <Info className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Informations de debug</span>
              </div>
              <p className="text-sm text-blue-700">{debugInfo}</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Section de debug pour les développeurs */}
      <Accordion type="single" collapsible className="mt-6">
        <AccordionItem value="debug">
          <AccordionTrigger className="text-sm">
            <div className="flex items-center gap-2">
              <Bug className="h-4 w-4" />
              Informations de debug
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="p-4 bg-gray-50 rounded-md text-sm">
              <p><strong>Conciergerie ID:</strong> {conciergerieId}</p>
              <p><strong>Nombre de formules:</strong> {formules.length}</p>
              <p><strong>0tat de chargement:</strong> {loading ? "En cours" : "Terminé"}</p>
              <p><strong>Formules chargées:</strong> {formulesLoaded ? "Oui" : "Non"}</p>
              <p><strong>Debug info:</strong> {debugInfo}</p>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default FormulesSection;

