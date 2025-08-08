"use client";

import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllVilles, getAllConciergeries } from "@/lib/data";
import { supabase } from "@/integrations/supabase/client";
import { anonSupabase } from "@/integrations/supabase/anonClient";
import { transformConciergerieFromDB } from "@/services/conciergerieTransformService";

const TestSupabase: React.FC = () => {
  const [directTest, setDirectTest] = useState<any>(null);
  const [directTestError, setDirectTestError] = useState<string | null>(null);
  const [transformTest, setTransformTest] = useState<any>(null);
  const [simpleTest, setSimpleTest] = useState<any>(null);

  // Test trÃ¨s simple - juste compter les enregistrements
  useEffect(() => {
    const testSimple = async () => {
      console.log("ðŸ” Test simple - DÃ©but");
      try {
        const { count, error } = await supabase
          .from('conciergeries')
          .select('*', { count: 'exact', head: true });
        
        console.log("ðŸ” Test simple - RÃ©sultat:", { count, error });
        setSimpleTest({ count, error });
      } catch (err) {
        console.error("ðŸ” Test simple - Erreur:", err);
        setSimpleTest({ error: String(err) });
      }
    };

    testSimple();
  }, []);

  // Test direct du client Supabase
  useEffect(() => {
    const testDirectSupabase = async () => {
      console.log("ðŸ” Test direct Supabase - DÃ©but");
      try {
        const { data, error } = await supabase
          .from('conciergeries')
          .select('*')
          .limit(5);
        
        console.log("ðŸ” Test direct Supabase - RÃ©sultat:", { data, error });
        setDirectTest({ data, error });
        
        if (error) {
          setDirectTestError(error.message);
        }

        // Test de transformation
        if (data && data.length > 0) {
          try {
            const transformed = transformConciergerieFromDB(data[0]);
            console.log("ðŸ” Test transformation - RÃ©sultat:", transformed);
            setTransformTest(transformed);
          } catch (transformError) {
            console.error("ðŸ” Test transformation - Erreur:", transformError);
            setTransformTest({ error: String(transformError) });
          }
        }
      } catch (err) {
        console.error("ðŸ” Test direct Supabase - Erreur:", err);
        setDirectTestError(String(err));
      }
    };

    testDirectSupabase();
  }, []);

  // Tests via React Query
  const { data: villes, isLoading: villesLoading, error: villesError } = useQuery({
    queryKey: ['villes-test'],
    queryFn: getAllVilles,
  });

  const { data: conciergeries, isLoading: conciergeriesLoading, error: conciergeriesError } = useQuery({
    queryKey: ['conciergeries-test'],
    queryFn: getAllConciergeries,
  });

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Test Supabase - Diagnostic Complet</h1>
      
      {/* Test Simple */}
      <div className="border rounded-lg p-6 mb-8 bg-purple-50">
        <h2 className="text-xl font-semibold mb-4">ðŸ”¢ Test Simple (Count)</h2>
        {simpleTest && (
          <div>
            <p className="text-sm mb-2">
              <strong>Nombre d'enregistrements:</strong> {simpleTest.count || 0}
            </p>
            <p className="text-sm mb-2">
              <strong>Erreur:</strong> {simpleTest.error ? simpleTest.error.message : 'Aucune erreur'}
            </p>
          </div>
        )}
      </div>

      {/* Test Direct Supabase */}
      <div className="border rounded-lg p-6 mb-8 bg-blue-50">
        <h2 className="text-xl font-semibold mb-4">ðŸ” Test Direct Supabase</h2>
        {directTestError && <p className="text-red-500 mb-2">Erreur: {directTestError}</p>}
        {directTest && (
          <div>
            <p className="text-sm mb-2">
              <strong>DonnÃ©es brutes:</strong> {directTest.data ? `${directTest.data.length} enregistrements` : 'Aucune donnÃ©e'}
            </p>
            <p className="text-sm mb-2">
              <strong>Erreur Supabase:</strong> {directTest.error ? directTest.error.message : 'Aucune erreur'}
            </p>
            {directTest.data && directTest.data.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-semibold mb-2">Premier enregistrement brut:</p>
                <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
                  {JSON.stringify(directTest.data[0], null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Test Transformation */}
      {transformTest && (
        <div className="border rounded-lg p-6 mb-8 bg-green-50">
          <h2 className="text-xl font-semibold mb-4">ðŸ”„ Test Transformation</h2>
          {transformTest.error ? (
            <p className="text-red-500">Erreur de transformation: {transformTest.error}</p>
          ) : (
            <div>
              <p className="text-sm mb-2">
                <strong>Transformation rÃ©ussie:</strong> âœ…
              </p>
              <p className="text-sm mb-2">
                <strong>Nom conciergerie:</strong> {transformTest.nom}
              </p>
              <p className="text-sm mb-2">
                <strong>Formules:</strong> {transformTest.formules?.length || 0}
              </p>
              <div className="mt-4">
                <p className="text-sm font-semibold mb-2">DonnÃ©es transformÃ©es:</p>
                <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
                  {JSON.stringify(transformTest, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Test Villes */}
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">ðŸ™ï¸ Villes (via React Query)</h2>
          {villesLoading && <p>Chargement des villes...</p>}
          {villesError && <p className="text-red-500">Erreur: {villesError.message}</p>}
          {villes && (
            <div>
              <p className="text-green-600 mb-2">âœ… {villes.length} villes trouvÃ©es</p>
              <ul className="space-y-2">
                {villes.slice(0, 5).map(ville => (
                  <li key={ville.id} className="text-sm">
                    <strong>{ville.nom}</strong> (slug: {ville.slug})
                  </li>
                ))}
                {villes.length > 5 && <li className="text-sm text-gray-500">... et {villes.length - 5} autres</li>}
              </ul>
            </div>
          )}
        </div>

        {/* Test Conciergeries */}
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">ðŸ¢ Conciergeries (via React Query)</h2>
          {conciergeriesLoading && <p>Chargement des conciergeries...</p>}
          {conciergeriesError && <p className="text-red-500">Erreur: {conciergeriesError.message}</p>}
          {conciergeries && (
            <div>
              <p className="text-green-600 mb-2">âœ… {conciergeries.length} conciergeries trouvÃ©es</p>
              <ul className="space-y-2">
                {conciergeries.slice(0, 5).map(conciergerie => (
                  <li key={conciergerie.id} className="text-sm">
                    <strong>{conciergerie.nom}</strong>
                    {conciergerie.formules && (
                      <span className="text-gray-500"> ({conciergerie.formules.length} formules)</span>
                    )}
                  </li>
                ))}
                {conciergeries.length > 5 && <li className="text-sm text-gray-500">... et {conciergeries.length - 5} autres</li>}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Debug Info */}
      <div className="mt-8 border rounded-lg p-6 bg-gray-50">
        <h3 className="text-lg font-semibold mb-4">ðŸ“Š Informations de dÃ©bogage</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p><strong>Test Simple:</strong></p>
            <p>Count: {simpleTest?.count || 0}</p>
            <p>Erreur: {simpleTest?.error ? 'Oui' : 'Non'}</p>
          </div>
          <div>
            <p><strong>Test Direct:</strong></p>
            <p>DonnÃ©es: {directTest?.data?.length || 0}</p>
            <p>Erreur: {directTestError ? 'Oui' : 'Non'}</p>
          </div>
          <div>
            <p><strong>Villes (React Query):</strong></p>
            <p>Loading: {villesLoading ? 'Oui' : 'Non'}</p>
            <p>Error: {villesError ? 'Oui' : 'Non'}</p>
            <p>Count: {villes?.length || 0}</p>
          </div>
          <div>
            <p><strong>Conciergeries (React Query):</strong></p>
            <p>Loading: {conciergeriesLoading ? 'Oui' : 'Non'}</p>
            <p>Error: {conciergeriesError ? 'Oui' : 'Non'}</p>
            <p>Count: {conciergeries?.length || 0}</p>
          </div>
        </div>
      </div>

      {/* Configuration Info */}
      <div className="mt-8 border rounded-lg p-6 bg-yellow-50">
        <h3 className="text-lg font-semibold mb-4">âš™ï¸ Configuration Supabase</h3>
        <div className="text-sm space-y-2">
          <p><strong>URL:</strong> https://gajceuvnerzlnuqvhnan.supabase.co</p>
          <p><strong>ClÃ© anon:</strong> eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...</p>
          <p><strong>Client utilisÃ©:</strong> {typeof supabase !== 'undefined' ? 'âœ… InitialisÃ©' : 'âŒ Non initialisÃ©'}</p>
          <p><strong>AnonClient utilisÃ©:</strong> {typeof anonSupabase !== 'undefined' ? 'âœ… InitialisÃ©' : 'âŒ Non initialisÃ©'}</p>
        </div>
      </div>
    </div>
  );
};

export default TestSupabase; 

