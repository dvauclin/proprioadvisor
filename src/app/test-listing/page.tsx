"use client";

import React from "react";
import { useConciergerieListingLogic } from "@/components/conciergerie/ConciergerieListingLogic";

const TestListing: React.FC = () => {
  // Test avec une ville qui existe dans la base
  const ville = "paris";
  const {
    villeData,
    formules,
    filteredFormules,
    villeLoading,
    formulesLoading,
    error,
    linkedCities,
    pageDescription
  } = useConciergerieListingLogic(ville);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Test Listing - Diagnostic</h1>
      
      {/* Informations de base */}
      <div className="border rounded-lg p-6 mb-8 bg-blue-50">
        <h2 className="text-xl font-semibold mb-4">x9 Informations de base</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p><strong>Ville recherchée:</strong> {ville}</p>
            <p><strong>Ville trouvée:</strong> {villeData?.nom || 'Non trouvée'}</p>
            <p><strong>Loading ville:</strong> {villeLoading ? 'Oui' : 'Non'}</p>
            <p><strong>Loading formules:</strong> {formulesLoading ? 'Oui' : 'Non'}</p>
            <p><strong>Erreur:</strong> {error || 'Aucune'}</p>
          </div>
          <div>
            <p><strong>Formules trouvées:</strong> {formules?.length || 0}</p>
            <p><strong>Formules filtrées:</strong> {filteredFormules?.length || 0}</p>
            <p><strong>Villes liées:</strong> {linkedCities?.length || 0}</p>
            <p><strong>Description:</strong> {pageDescription}</p>
          </div>
        </div>
      </div>

      {/* Détails de la ville */}
      {villeData && (
        <div className="border rounded-lg p-6 mb-8 bg-green-50">
          <h2 className="text-xl font-semibold mb-4">x"️ Détails de la ville</h2>
          <div className="text-sm">
            <p><strong>ID:</strong> {villeData.id}</p>
            <p><strong>Nom:</strong> {villeData.nom}</p>
            <p><strong>Slug:</strong> {villeData.slug}</p>
            <p><strong>Description:</strong> {villeData.description}</p>
            <p><strong>Latitude:</strong> {villeData.latitude || 'Non définie'}</p>
            <p><strong>Longitude:</strong> {villeData.longitude || 'Non définie'}</p>
          </div>
        </div>
      )}

      {/* Liste des formules */}
      {formules && formules.length > 0 && (
        <div className="border rounded-lg p-6 mb-8 bg-yellow-50">
          <h2 className="text-xl font-semibold mb-4">x9 Formules trouvées ({formules.length})</h2>
          <div className="space-y-4">
            {formules.slice(0, 5).map((formule, index) => (
              <div key={index} className="border rounded p-4 bg-white">
                <p><strong>Nom:</strong> {formule.nom}</p>
                <p><strong>Conciergerie:</strong> {formule.conciergerie?.nom || 'Non définie'}</p>
                <p><strong>Commission:</strong> {formule.commission}%</p>
                <p><strong>Services:</strong> {formule.servicesInclus?.join(', ') || 'Aucun'}</p>
              </div>
            ))}
            {formules.length > 5 && (
              <p className="text-sm text-gray-500">... et {formules.length - 5} autres formules</p>
            )}
          </div>
        </div>
      )}

      {/* Villes liées */}
      {linkedCities && linkedCities.length > 0 && (
        <div className="border rounded-lg p-6 mb-8 bg-purple-50">
          <h2 className="text-xl font-semibold mb-4">x Villes liées ({linkedCities.length})</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {linkedCities.slice(0, 8).map((ville, index) => (
              <div key={index} className="text-sm p-2 bg-white rounded border">
                <strong>{ville.nom}</strong>
              </div>
            ))}
            {linkedCities.length > 8 && (
              <p className="text-sm text-gray-500">... et {linkedCities.length - 8} autres villes</p>
            )}
          </div>
        </div>
      )}

      {/* 0tat de chargement */}
      {(villeLoading || formulesLoading) && (
        <div className="border rounded-lg p-6 mb-8 bg-orange-50">
          <h2 className="text-xl font-semibold mb-4">⏳ 0tat de chargement</h2>
          <div className="text-sm">
            <p>Chargement ville: {villeLoading ? 'x En cours' : 'S& Terminé'}</p>
            <p>Chargement formules: {formulesLoading ? 'x En cours' : 'S& Terminé'}</p>
          </div>
        </div>
      )}

      {/* Erreurs */}
      {error && (
        <div className="border rounded-lg p-6 mb-8 bg-red-50">
          <h2 className="text-xl font-semibold mb-4">R Erreurs</h2>
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Debug complet */}
      <div className="border rounded-lg p-6 bg-gray-50">
        <h2 className="text-xl font-semibold mb-4">x: Debug complet</h2>
        <div className="text-xs">
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify({
              ville,
              villeData: villeData ? {
                id: villeData.id,
                nom: villeData.nom,
                slug: villeData.slug
              } : null,
              formulesCount: formules?.length || 0,
              filteredFormulesCount: filteredFormules?.length || 0,
              linkedCitiesCount: linkedCities?.length || 0,
              loading: { villeLoading, formulesLoading },
              error
            }, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default TestListing; 

