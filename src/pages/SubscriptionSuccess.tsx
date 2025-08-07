"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// Import des icônes utilisées
import { CheckCircle, Mail, Calendar, CreditCard, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface SubscriptionDetails {
  id: string;
  monthly_amount: number;
  total_points: number;
  payment_status: string;
  subscription_renewal_day?: number | null;
  basic_listing?: boolean;
  partner_listing?: boolean;
  website_link?: boolean;
  phone_number?: boolean;
  backlink?: boolean;
  conciergerie_page_link?: boolean;
  created_at: string;
}

interface ConciergerieDetails {
  nom: string;
  mail: string | null;
  validated: boolean;
}

const SubscriptionSuccess = () => {
  const [subscription, setSubscription] = useState<SubscriptionDetails | null>(null);
  const [conciergerie, setConciergerie] = useState<ConciergerieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const searchParams = useSearchParams();
  const isUpdate = searchParams?.get('updated') === 'true';

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!searchParams) return;
        
  
        const subscriptionId = searchParams.get('subscription_id');


        if (!subscriptionId) {
          setError("Aucun identifiant de souscription trouvé");
          setLoading(false);
          return;
        }

        // Récupérer les détails de la souscription
        const { data: subscriptionData, error: subscriptionError } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('id', subscriptionId)
          .single();

        if (subscriptionError) {
          console.error('Error fetching subscription:', subscriptionError);
          setError("Impossible de récupérer les détails de la souscription");
          setLoading(false);
          return;
        }

        setSubscription(subscriptionData);

        // Récupérer les détails de la conciergerie
        if (subscriptionData.conciergerie_id) {
          const { data: conciergerieData, error: conciergerieError } = await supabase
            .from('conciergeries')
            .select('nom, mail, validated')
            .eq('id', subscriptionData.conciergerie_id)
            .single();

          if (!conciergerieError && conciergerieData) {
            setConciergerie(conciergerieData);
          }
        }

      } catch (error) {
        console.error('Error fetching data:', error);
        setError("Une erreur est survenue lors du chargement des données");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchParams, supabase]);

  const formatCurrency = (amount: number) => {
    // Le montant est déjà stocké en euros entiers dans Supabase
    return `${amount}€`;
  };

  const getPlanName = (points: number, monthlyAmount: number) => {
    if (monthlyAmount > 0) return "Payant";
    if (points >= 100) return "Premium";
    if (points >= 50) return "Pro";
    return "Gratuit";
  };

  const getRenewalDate = (renewalDay: number) => {
    const now = new Date();
    const currentDay = now.getDate();
    
    if (currentDay >= renewalDay) {
      // Prochain mois
      const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, renewalDay);
      return nextMonth;
    } else {
      // Ce mois
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), renewalDay);
      return thisMonth;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-chartreuse mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de votre souscription...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-xl text-red-600">Erreur</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" asChild>
              <a href="/subscription">Retour à la souscription</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader className="text-center pb-8">
            <div className="mx-auto w-20 h-20 bg-green-100 flex items-center justify-center rounded-full mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
              {isUpdate ? "Souscription mise à jour !" : "Souscription réussie !"}
            </CardTitle>
            <CardDescription className="text-lg">
              {isUpdate ? "Votre abonnement a été modifié avec succès" : "Votre abonnement a été activé avec succès"}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Informations de la conciergerie */}
            {conciergerie && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
                  <Star className="h-5 w-5 mr-2" />
                  {conciergerie.nom}
                </h3>
                <p className="text-blue-700 flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  {conciergerie.mail}
                </p>
                {conciergerie.validated && (
                  <p className="text-green-600 text-sm mt-1">✓ Conciergerie validée</p>
                )}
              </div>
            )}

            {/* Détails de la souscription */}
            {subscription && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                      <CreditCard className="h-5 w-5 mr-2" />
                      Plan d'abonnement
                    </h4>
                    <p className="text-2xl font-bold text-brand-chartreuse">
                      {getPlanName(subscription.total_points, subscription.monthly_amount)}
                    </p>
                    <p className="text-gray-600">
                      {subscription.total_points} points
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                      <Calendar className="h-5 w-5 mr-2" />
                      Montant mensuel
                    </h4>
                    <p className="text-2xl font-bold text-brand-chartreuse">
                      {formatCurrency(subscription.monthly_amount)}
                    </p>
                    <p className="text-gray-600">par mois</p>
                  </div>
                </div>



                {/* Prochain renouvellement */}
                {subscription.subscription_renewal_day && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Prochain renouvellement :</h4>
                    <p className="text-blue-700">
                      {getRenewalDate(subscription.subscription_renewal_day).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                )}
              </div>
            )}
            
            {/* Actions */}
            <div className="space-y-3 pt-4">
              <Button className="w-full" size="lg" asChild>
                <a href="/subscription">
                  Modifier ma souscription
                </a>
              </Button>
              
              <Button variant="outline" className="w-full" size="lg" asChild>
                <a href="/prendre-rdv">
                  Prendre rendez-vous
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SubscriptionSuccess;


