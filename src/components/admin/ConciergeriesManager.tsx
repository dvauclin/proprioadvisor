"use client";

import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui-kit/button";
import { Badge } from "@/components/ui-kit/badge";
import { toast } from "sonner";
import { Loader2, Check, X, Eye } from "lucide-react";
import ConciergerieLogoDisplay from "@/components/ui-kit/conciergerie-logo-display";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui-kit/dialog";
import EditConciergerieForm from "./EditConciergerieForm";
import { validateConciergerie } from "@/services/conciergerieService";
import { Conciergerie } from "@/types";
import { transformConciergerieFromDB } from "@/services/conciergerieTransformService";

interface ConciergeriesManagerProps {
  validated: boolean;
}

const ConciergeriesManager: React.FC<ConciergeriesManagerProps> = ({ validated }) => {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const [editingConciergerie, setEditingConciergerie] = useState<Conciergerie | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: conciergeries = [], isLoading } = useQuery<Conciergerie[]>({
    queryKey: ['admin-conciergeries', validated],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('conciergeries')
        .select(`
          *,
          formules (*),
          subscriptions (*)
        `)
        .eq('validated', validated)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      if (!data) return [];
      return data.map(transformConciergerieFromDB);
    }
  });

  const handleValidation = async (conciergerieId: string, validate: boolean) => {
    console.log("x VALIDATION CLICKED:", { conciergerieId, validate });
    setLoadingStates(prev => ({ ...prev, [conciergerieId]: true }));
    
    try {
      if (validate) {
        // Use the service function that includes webhook
        const result = await validateConciergerie(conciergerieId);
        if (!result.success) {
          throw new Error(result.error);
        }
      } else {
        // For unvalidation, use direct update
        const { error } = await supabase
          .from('conciergeries')
          .update({ validated: false })
          .eq('id', conciergerieId);

        if (error) throw error;
      }

      toast.success(
        validate ? "Conciergerie validée avec succès" : "Validation de la conciergerie annulée"
      );
      
      queryClient.invalidateQueries({ queryKey: ['admin-conciergeries'] });
      queryClient.invalidateQueries({ queryKey: ['conciergeries'] });
    } catch (error: any) {
      console.error("Erreur lors de la validation:", error);
      toast.error("Erreur lors de la validation");
    } finally {
      setLoadingStates(prev => ({ ...prev, [conciergerieId]: false }));
    }
  };

  const handleOpenEditDialog = (conciergerie: Conciergerie) => {
    setEditingConciergerie(conciergerie);
    setIsDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditingConciergerie(null);
    setIsDialogOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {conciergeries.length === 0 ? (
        <p className="text-center text-gray-500 py-8">
          Aucune conciergerie {validated ? 'validée' : 'en attente de validation'}
        </p>
      ) : (
        <div className="grid gap-4">
          {conciergeries.map((conciergerie) => (
            <div key={conciergerie.id} className="border rounded-lg p-4 bg-white">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <ConciergerieLogoDisplay 
                    logoUrl={conciergerie.logo || null} 
                    altText={conciergerie.nom}
                    size="sm"
                  />
                  <div>
                    <h3 className="font-semibold text-lg">{conciergerie.nom}</h3>
                    <p className="text-sm text-gray-600">{conciergerie.mail}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={validated ? "default" : "secondary"}>
                        {validated ? "Validée" : "En attente"}
                      </Badge>
                      {conciergerie.formules && conciergerie.formules.length > 0 && (
                        <Badge variant="outline">
                          {conciergerie.formules.length} formule(s)
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Dialog open={isDialogOpen && editingConciergerie?.id === conciergerie.id} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        onClick={() => handleOpenEditDialog(conciergerie)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Voir
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] sm:max-h-[90vh] max-sm:max-h-[calc(100vh-1rem)] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Détails de la conciergerie</DialogTitle>
                      </DialogHeader>
                      {editingConciergerie && (
                        <EditConciergerieForm
                          conciergerie={editingConciergerie}
                          onCancel={handleCloseEditDialog}
                          open={isDialogOpen}
                        />
                      )}
                    </DialogContent>
                  </Dialog>
                  
                  <Button
                    size="sm"
                    onClick={() => handleValidation(conciergerie.id, !validated)}
                    disabled={loadingStates[conciergerie.id]}
                    className={validated ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}
                  >
                    {loadingStates[conciergerie.id] ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : validated ? (
                      <>
                        <X className="h-4 w-4 mr-1" />
                        Invalider
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4 mr-1" />
                        Valider
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ConciergeriesManager;

