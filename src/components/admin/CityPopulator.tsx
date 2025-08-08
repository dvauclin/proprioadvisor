"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui-kit/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui-kit/use-toast";
import { populateCities } from "@/scripts/addCities";
import { CityPopulatorProps } from "@/types";

const CityPopulator: React.FC<CityPopulatorProps> = ({ onCitiesAdded }) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleAddCities = async () => {
    setLoading(true);
    try {
      const result = await populateCities();
      
      if (result.success) {
        toast({
          title: "Succès",
          description: "Les villes ont été ajoutées avec succès !",
        });
        
        // Call the callback function with the count of newly added cities
        if (onCitiesAdded && result.data) {
          onCitiesAdded(result.data.length);
        }
      } else {
        toast({
          title: "Erreur",
          description: `Erreur lors de l'ajout des villes : ${result.error}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erreur lors de l'exécution du script :", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ajout des villes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Importer les villes</h2>
      <p className="mb-4 text-gray-600">
        Cliquez sur le bouton ci-dessous pour ajouter les 29 villes prédéfinies à la base de données.
      </p>
      <Button 
        onClick={handleAddCities} 
        disabled={loading}
        id="add-cities-button"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Import en cours...
          </>
        ) : (
          "Importer les villes"
        )}
      </Button>
    </div>
  );
};

export default CityPopulator;
