"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export default function TestConciergeries() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const testDatabase = async () => {
      try {
        console.log("Testing database connection...");
        
        // Test 1: Get all conciergeries
        const { data: allConciergeries, error: allError } = await supabase
          .from('conciergeries')
          .select('id, nom, validated');
        
        console.log("All conciergeries:", allConciergeries);
        console.log("All conciergeries error:", allError);
        
        // Test 2: Get validated conciergeries
        const { data: validatedConciergeries, error: validatedError } = await supabase
          .from('conciergeries')
          .select('id, nom, validated')
          .eq('validated', true);
        
        console.log("Validated conciergeries:", validatedConciergeries);
        console.log("Validated conciergeries error:", validatedError);
        
        // Test 3: Count query
        const { count, error: countError } = await supabase
          .from('conciergeries')
          .select('*', { count: 'exact', head: true })
          .eq('validated', true);
        
        console.log("Count result:", { count, error: countError });
        
        setData({
          allConciergeries,
          allError,
          validatedConciergeries,
          validatedError,
          count,
          countError
        });
        
      } catch (error) {
        console.error("Test error:", error);
        setData({ error: error instanceof Error ? error.message : String(error) });
      } finally {
        setLoading(false);
      }
    };

    testDatabase();
  }, []);

  if (loading) {
    return <div className="p-8">Chargement...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Conciergeries</h1>
      <pre className="bg-gray-100 p-4 rounded overflow-auto">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
} 

