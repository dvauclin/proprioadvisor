"use client";

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';


import { Conciergerie, Formule } from '@/types';

import EditConciergerieForm from '@/components/admin/EditConciergerieForm';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { saveConciergerie } from '@/services/conciergerieService';
import { toast } from 'sonner';
import { transformConciergerieFromDB } from '@/services/conciergerieTransformService';

const MyConciergerie = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useRouter();
  const queryClient = useQueryClient();

  const { data: conciergerieData, isLoading: conciergerieLoading, error } = useQuery({
    queryKey: ['my-conciergerie', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      
      const { data, error } = await supabase
        .from('conciergeries')
        .select('*, formules(*)')
        .eq('mail', user.email)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') { // No rows found
          return null;
        }
        throw error;
      }
      return transformConciergerieFromDB(data);
    },
    enabled: !!user?.email,
  });

  const handleSave = async (data: Conciergerie & { formules: Formule[], deletedFormulesIds?: string[] }) => {
    try {
      await saveConciergerie(data);
      toast.success("Modifications enregistrées avec succès!");
      await queryClient.invalidateQueries({ queryKey: ['my-conciergerie', user?.email] });
      navigate.push('/subscription');
    } catch (error: any) {
      toast.error("Erreur lors de l'enregistrement", { description: error.message });
    }
  };

  const handleCancel = () => {
    navigate.push('/subscription');
  };
  
  const isLoading = authLoading || conciergerieLoading;

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }
  
  if (error) {
    return (
        <div className="container mx-auto py-10 text-center">
            <Card className="max-w-md mx-auto">
                <CardHeader>
                    <CardTitle>Erreur</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Erreur lors du chargement de votre conciergerie :</p>
                    <p className="text-red-500 mt-2">{(error as any).message}</p>
                </CardContent>
            </Card>
        </div>
    );
  }
  
  if (!conciergerieData) {
    return (
        <div className="container mx-auto py-10 text-center">
            <Card className="max-w-md mx-auto">
                <CardHeader>
                    <CardTitle>Aucune conciergerie trouvée</CardTitle>
                    <CardDescription>
                        Aucune conciergerie n'est associée à votre compte.
                    </CardDescription>
                </CardHeader>
            </Card>
        </div>
    );
  }

  const { formules, ...conciergerie } = conciergerieData;

  return (
    <EditConciergerieForm
      open={true}
      conciergerie={conciergerie}
      formules={formules || []}
      onSave={handleSave}
      onCancel={handleCancel}
      onSuccess={() => {}}
    />
  );
};

export default MyConciergerie;



