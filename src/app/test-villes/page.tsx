"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui-kit/button";
import { getAllVilles, addVille } from "@/services/villeService";
import { Ville } from "@/types";

const TestVillesPage = () => {
  const [villes, setVilles] = useState<Ville[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const loadVilles = async () => {
    setLoading(true);
    try {
      const villesData = await getAllVilles();
      setVilles(villesData);
      setMessage(`ChargÃ© ${villesData.length} villes`);
    } catch (error) {
      console.error("Erreur lors du chargement des villes:", error);
      setMessage("Erreur lors du chargement des villes");
    } finally {
      setLoading(false);
    }
  };

  const addTestVilles = async () => {
    setLoading(true);
    try {
      const testVilles = [
        { nom: "Paris", slug: "paris", description: "Capitale de la France" },
        { nom: "Lyon", slug: "lyon", description: "Capitale des Gaules" },
        { nom: "Marseille", slug: "marseille", description: "CitÃ© phocÃ©enne" },
        { nom: "Bordeaux", slug: "bordeaux", description: "Capitale du vin" },
        { nom: "Nice", slug: "nice", description: "CÃ´te d'Azur" }
      ];

      for (const ville of testVilles) {
        await addVille(ville);
      }

      setMessage("Villes de test ajoutÃ©es avec succÃ¨s");
      await loadVilles(); // Recharger les villes
    } catch (error) {
      console.error("Erreur lors de l'ajout des villes:", error);
      setMessage("Erreur lors de l'ajout des villes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVilles();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Test des Villes</h1>
      
      <div className="space-y-4 mb-6">
        <Button onClick={loadVilles} disabled={loading}>
          {loading ? "Chargement..." : "Recharger les villes"}
        </Button>
        
        <Button onClick={addTestVilles} disabled={loading} variant="outline">
          Ajouter des villes de test
        </Button>
      </div>

      {message && (
        <div className="mb-4 p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded">
          {message}
        </div>
      )}

      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Villes dans la base de donnÃ©es ({villes.length})</h2>
        {villes.map(ville => (
          <div key={ville.id} className="p-3 border rounded">
            <strong>{ville.nom}</strong> - {ville.description}
          </div>
        ))}
        {villes.length === 0 && (
          <div className="p-3 border rounded text-gray-500">
            Aucune ville trouvÃ©e
          </div>
        )}
      </div>
    </div>
  );
};

export default TestVillesPage; 

