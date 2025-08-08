"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllConciergeries } from "@/lib/data";

const TestConciergeries: React.FC = () => {
  const { data: conciergeries, isLoading, error } = useQuery({
    queryKey: ['conciergeries-test'],
    queryFn: getAllConciergeries,
  });

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Test Conciergeries - Diagnostic</h1>
      
      {/* Ã‰tat de chargement */}
      {isLoading && (
        <div className="border rounded-lg p-6 mb-8 bg-orange-50">
          <h2 className="text-xl font-semibold mb-4">â³ Chargement en cours...</h2>
          <p>RÃ©cupÃ©ration des conciergeries depuis Supabase...</p>
        </div>
      )}

      {/* Erreurs */}
      {error && (
        <div className="border rounded-lg p-6 mb-8 bg-red-50">
          <h2 className="text-xl font-semibold mb-4">âŒ Erreur</h2>
          <p className="text-red-600">{error.message}</p>
        </div>
      )}

      {/* Liste des conciergeries */}
      {conciergeries && (
        <div className="border rounded-lg p-6 mb-8 bg-green-50">
          <h2 className="text-xl font-semibold mb-4">ðŸ¢ Conciergeries trouvÃ©es ({conciergeries.length})</h2>
          <div className="space-y-4">
            {conciergeries.slice(0, 5).map((conciergerie) => (
              <div key={conciergerie.id} className="border rounded p-4 bg-white">
                <h3 className="font-semibold text-lg mb-2">{conciergerie.nom}</h3>
                <div className="text-sm space-y-1">
                  <p><strong>ID:</strong> {conciergerie.id}</p>
                  <p><strong>Ville ID:</strong> {conciergerie.villeId}</p>
                  <p><strong>Villes IDs:</strong> {conciergerie.villesIds?.join(', ') || 'Aucune'}</p>
                  <p><strong>Villes (relation):</strong> {(conciergerie as any).villes?.map((v: any) => v.nom).join(', ') || 'Aucune'}</p>
                  <p><strong>Formules:</strong> {conciergerie.formules?.length || 0}</p>
                  <p><strong>ValidÃ©e:</strong> {conciergerie.validated ? 'Oui' : 'Non'}</p>
                </div>
              </div>
            ))}
            {conciergeries.length > 5 && (
              <p className="text-sm text-gray-500">... et {conciergeries.length - 5} autres conciergeries</p>
            )}
          </div>
        </div>
      )}

      {/* Recherche de conciergeries pour Paris */}
      {conciergeries && (
        <div className="border rounded-lg p-6 mb-8 bg-blue-50">
          <h2 className="text-xl font-semibold mb-4">ðŸ” Conciergeries pour Paris</h2>
          <div className="space-y-2">
            <p><strong>Recherche par villeId:</strong></p>
            <p>Conciergeries avec villeId "paris": {conciergeries.filter(c => c.villeId === "paris").length}</p>
            
            <p><strong>Recherche par villesIds:</strong></p>
            <p>Conciergeries avec "paris" dans villesIds: {conciergeries.filter(c => c.villesIds?.includes("paris")).length}</p>
            
            <p><strong>Recherche par relation villes:</strong></p>
            <p>Conciergeries avec ville "Paris" dans relation: {conciergeries.filter(c => (c as any).villes?.some((v: any) => v.slug === "paris")).length}</p>
            
            <p><strong>Recherche par nom de ville:</strong></p>
            <p>Conciergeries avec ville "Paris" par nom: {conciergeries.filter(c => (c as any).villes?.some((v: any) => v.nom.toLowerCase() === "paris")).length}</p>
          </div>
        </div>
      )}

      {/* DÃ©tails des premiÃ¨res conciergeries */}
      {conciergeries && (
        <div className="border rounded-lg p-6 mb-8 bg-yellow-50">
          <h2 className="text-xl font-semibold mb-4">ðŸ“‹ DÃ©tails des premiÃ¨res conciergeries</h2>
          <div className="space-y-4">
            {conciergeries.slice(0, 3).map((conciergerie) => (
              <div key={conciergerie.id} className="border rounded p-4 bg-white">
                <h3 className="font-semibold text-lg mb-2">{conciergerie.nom}</h3>
                <div className="text-xs">
                  <pre className="bg-gray-100 p-2 rounded overflow-auto">
                    {JSON.stringify({
                      id: conciergerie.id,
                      nom: conciergerie.nom,
                      villeId: conciergerie.villeId,
                      villesIds: conciergerie.villesIds,
                      villes: (conciergerie as any).villes?.map((v: any) => ({ id: v.id, nom: v.nom, slug: v.slug })),
                      formulesCount: conciergerie.formules?.length || 0
                    }, null, 2)}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Debug complet */}
      <div className="border rounded-lg p-6 bg-gray-50">
        <h2 className="text-xl font-semibold mb-4">ðŸ› Debug complet</h2>
        <div className="text-xs">
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify({
              loading: isLoading,
              error: error?.message || null,
              conciergeriesCount: conciergeries?.length || 0,
              conciergeriesSample: conciergeries?.slice(0, 2).map(c => ({
                id: c.id,
                nom: c.nom,
                villeId: c.villeId,
                villesIds: c.villesIds,
                villesCount: (c as any).villes?.length || 0,
                formulesCount: c.formules?.length || 0
              })) || []
            }, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default TestConciergeries; 

