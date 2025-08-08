
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui-kit/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export const useSubscriptionData = () => {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { user } = useAuth();
  const [conciergerieId, setConciergerieId] = useState<string | null>(null);
  const [conciergerieName, setConciergerieName] = useState<string>("");
  const [conciergerieEmail, setConciergerieEmail] = useState<string>("");
  const [existingSubscription, setExistingSubscription] = useState<any>(null);
  const [currentMonthlyPayment, setCurrentMonthlyPayment] = useState<number>(0);
  const [renewalDay, setRenewalDay] = useState<number | null>(null);
  const [isLoadingSubscriptionData, setIsLoadingSubscriptionData] = useState<boolean>(true);

  useEffect(() => {
    const idFromUrl = searchParams?.get('conciergerieId');
    const subscriptionIdFromUrl = searchParams?.get('subscriptionId');

    setIsLoadingSubscriptionData(true);

    const processFetches = async () => {
      try {
        let targetConciergerieId = idFromUrl;
        
        // Si aucun conciergerieId n'est fourni dans l'URL mais qu'un utilisateur est connecté,
        // on récupère sa conciergerie
        if (!targetConciergerieId && user) {
          console.log("[useSubscriptionData] No conciergerieId in URL, fetching user's conciergerie");
          
          const { data: userConciergerie, error: userConciergerieError } = await supabase
            .from('conciergeries')
            .select('id, nom, mail')
            .eq('mail', user.email || '')
            .single();

          if (userConciergerieError) {
            console.error("Error fetching user's conciergerie:", userConciergerieError);
            toast({
              title: "Erreur",
              description: "Impossible de récupérer votre conciergerie.",
              variant: "destructive"
            });
            setIsLoadingSubscriptionData(false);
            return;
          }

          if (userConciergerie) {
            targetConciergerieId = userConciergerie.id;
            console.log("[useSubscriptionData] Found user's conciergerie:", userConciergerie);
          }
        }

        if (targetConciergerieId) {
          setConciergerieId(targetConciergerieId);
          console.log("[useSubscriptionData] Starting data fetch for conciergerieId:", targetConciergerieId);
          
          const conciergeriePromise = supabase
            .from('conciergeries')
            .select('nom, mail')
            .eq('id', targetConciergerieId)
            .single();

          let subscriptionQuery = supabase.from('subscriptions').select('*').eq('conciergerie_id', targetConciergerieId);
          if (subscriptionIdFromUrl) {
            subscriptionQuery = subscriptionQuery.eq('id', subscriptionIdFromUrl);
            console.log("[useSubscriptionData] Looking for specific subscription:", subscriptionIdFromUrl);
          }
          const subscriptionPromise = subscriptionQuery.single();

          console.log("[useSubscriptionData] Executing parallel queries...");
          const [conciergerieResult, subscriptionResult] = await Promise.all([
            conciergeriePromise,
            subscriptionPromise
          ]);

          console.log("[useSubscriptionData] Conciergerie result:", conciergerieResult);
          console.log("[useSubscriptionData] Subscription result:", subscriptionResult);

          if (conciergerieResult.error) {
            console.error("Error fetching conciergerie:", conciergerieResult.error);
            toast({
              title: "Erreur",
              description: "Impossible de charger les informations de la conciergerie.",
              variant: "destructive"
            });
          } else if (conciergerieResult.data) {
            setConciergerieName(conciergerieResult.data.nom);
            setConciergerieEmail(conciergerieResult.data.mail || "");
          }

          if (subscriptionResult.error && subscriptionResult.error.code !== 'PGRST116') {
            console.error("Error checking existing subscription:", subscriptionResult.error);
            toast({
              title: "Erreur de souscription",
              description: "Impossible de vérifier la souscription existante.",
              variant: "destructive"
            });
          } else if (subscriptionResult.data) {
            setExistingSubscription(subscriptionResult.data);
            const currentPayment = subscriptionResult.data.payment_status === 'completed' ? subscriptionResult.data.monthly_amount : 0;
            setCurrentMonthlyPayment(currentPayment);
            setRenewalDay(subscriptionResult.data.subscription_renewal_day);
          } else {
            setExistingSubscription(null);
            setCurrentMonthlyPayment(0);
            setRenewalDay(null);
          }
        } else {
          // Aucun conciergerieId trouvé et aucun utilisateur connecté
          setConciergerieId(null);
          setConciergerieName("");
          setConciergerieEmail("");
          setExistingSubscription(null);
          setCurrentMonthlyPayment(0);
          setRenewalDay(null);
        }
      } catch (error) {
        console.error("[useSubscriptionData] Error processing subscription data fetches:", error);
        console.error("[useSubscriptionData] Error details:", {
          message: (error as Error)?.message,
          stack: (error as Error)?.stack
        });
        toast({
          title: "Erreur",
          description: "Un problème est survenu lors du chargement des données.",
          variant: "destructive"
        });
      } finally {
        setIsLoadingSubscriptionData(false);
      }
    };

    processFetches();
  }, [searchParams, toast, user]);

  return {
    conciergerieId,
    conciergerieName,
    conciergerieEmail,
    existingSubscription,
    currentMonthlyPayment,
    renewalDay,
    isLoadingSubscriptionData
  };
};

