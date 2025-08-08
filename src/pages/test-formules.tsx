"use client";

import React from "react";
import { supabase } from "@/integrations/supabase/client";

const TestFormules = () => {
  const [loading, setLoading] = React.useState(true);
  const [results, setResults] = React.useState<any>(null);

  React.useEffect(() => {
    const testFormules = async () => {
      try {
        console.log("ðŸ§ª Testing formules...");
        
        // Test 1: Get all formules
        const { data: allFormules, error: allError } = await supabase
          .from('formules')
          .select('*')
          .limit(5);
        
        console.log("ðŸ“Š All formules:", allFormules);
        console.log("âŒ All formules error:", allError);
        
        // Test 2: Get all conciergeries
        const { data: allConciergeries, error: conciergeriesError } = await supabase
          .from('conciergeries')
          .select('id, nom')
          .limit(5);
        
        console.log("ðŸ¢ All conciergeries:", allConciergeries);
        console.log("âŒ Conciergeries error:", conciergeriesError);
        
        // Test 3: Get formules for a specific conciergerie (if we have one)
        if (allConciergeries && allConciergeries.length > 0) {
          const testConciergerieId = allConciergeries[0].id;
          console.log("ðŸ” Testing formules for conciergerie:", testConciergerieId);
          
          const { data: specificFormules, error: specificError } = await supabase
            .from('formules')
            .select('*')
            .eq('conciergerie_id', testConciergerieId);
          
          console.log("ðŸŽ¯ Formules for specific conciergerie:", specificFormules);
          console.log("âŒ Specific formules error:", specificError);
          
          setResults({
            allFormules,
            allConciergeries,
            specificFormules,
            testConciergerieId,
            errors: {
              allFormules: allError,
              conciergeries: conciergeriesError,
              specific: specificError
            }
          });
        }
        
             } catch (error) {
         console.error("âŒ Test error:", error);
         setResults({ error: error instanceof Error ? error.message : 'Unknown error' });
       } finally {
        setLoading(false);
      }
    };

    testFormules();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Test Formules</h1>
      
      {results && (
        <div className="space-y-6">
          <div className="bg-gray-100 p-4 rounded">
            <h2 className="font-bold mb-2">All Formules ({results.allFormules?.length || 0})</h2>
            <pre className="text-sm overflow-auto">
              {JSON.stringify(results.allFormules, null, 2)}
            </pre>
          </div>
          
          <div className="bg-gray-100 p-4 rounded">
            <h2 className="font-bold mb-2">All Conciergeries ({results.allConciergeries?.length || 0})</h2>
            <pre className="text-sm overflow-auto">
              {JSON.stringify(results.allConciergeries, null, 2)}
            </pre>
          </div>
          
          {results.testConciergerieId && (
            <div className="bg-gray-100 p-4 rounded">
              <h2 className="font-bold mb-2">
                Formules for Conciergerie {results.testConciergerieId} ({results.specificFormules?.length || 0})
              </h2>
              <pre className="text-sm overflow-auto">
                {JSON.stringify(results.specificFormules, null, 2)}
              </pre>
            </div>
          )}
          
          <div className="bg-red-100 p-4 rounded">
            <h2 className="font-bold mb-2">Errors</h2>
            <pre className="text-sm overflow-auto">
              {JSON.stringify(results.errors, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestFormules; 

