"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui-kit/card";
import { Button } from "@/components/ui-kit/button";
// Import des icônes utilisées
import { CheckCircle, Mail, Calendar, CreditCard, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface SubscriptionDetails {
  id: string;
  monthly_amount: number;
  total_points: number;
  payment_status: string;
  subscription_renewal_day?: number | null;
  website_link?: boolean;
  phone_number?: boolean;
  backlink?: boolean;

  created_at: string;
}

interface ConciergerieDetails {
  nom: string;
  mail: string | null;
  validated: boolean;
  site_web?: boolean;
}

const SubscriptionSuccess = () => {
  const [subscription, setSubscription] = useState<SubscriptionDetails | null>(null);
  const [conciergerie, setConciergerie] = useState<ConciergerieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [wantsBonusPoints, setWantsBonusPoints] = useState<boolean | null>(null);
  
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
            .select('nom, mail, validated, site_web')
            .eq('id', subscriptionData.conciergerie_id)
            .single();

          if (!conciergerieError && conciergerieData) {
            setConciergerie(conciergerieData as unknown as ConciergerieDetails);
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
                  <p className="text-green-600 text-sm mt-1">✔ Conciergerie validée</p>
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



                {/* Prochain renouvellement - seulement pour les abonnements payants */}
                {subscription.subscription_renewal_day && subscription.monthly_amount > 0 && (
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

                {/* Section de bonus de points - uniquement visible lors de la création */}
                {!isUpdate && subscription && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-800 mb-4">
                      <strong>Voulez-vous passer de {subscription.total_points} points à {subscription.total_points + 5} points ?</strong>
                    </p>
                    
                    {/* Boutons Oui/Non */}
                    <div className="flex space-x-3 mb-4">
                      <button
                        onClick={() => setWantsBonusPoints(true)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          wantsBonusPoints === true
                            ? 'bg-gray-600 text-white'
                            : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        Oui
                      </button>
                      <button
                        onClick={() => setWantsBonusPoints(false)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          wantsBonusPoints === false
                            ? 'bg-gray-600 text-white'
                            : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        Non
                      </button>
                    </div>
                    
                    {/* Instructions conditionnelles - affichées seulement si Oui */}
                    {wantsBonusPoints === true && (
                      <div className="bg-white p-3 rounded border border-blue-200">
                        <p className="text-sm text-blue-900 mb-2">
                          {conciergerie?.site_web 
                            ? "Ajoutez un lien sur la page d'accueil de votre site web menant à ProprioAdvisor :"
                            : "Ajoutez le lien de votre page ProprioAdvisor dans la section 'Site web' de votre profil Google :"
                          }
                        </p>
                        
                        {conciergerie?.site_web ? (
                          <div className="space-y-3">
                            <p className="text-xs text-blue-600 bg-gray-100 px-2 py-1 rounded inline-block">
                              https://proprioadvisor.fr
                            </p>
                            <div className="text-xs text-blue-700 bg-blue-50 p-2 rounded">
                              <p className="text-xs text-blue-600 mb-2">
                                <strong>Types de liens acceptés :</strong> Lien texte, image ou bouton.
                              </p>
                              <p className="text-xs text-blue-600 mb-2">
                                <strong>Emplacement :</strong> Dans une section partenaires ou dans le pied de page.
                              </p>
                              <p className="text-xs text-blue-600 mt-2">
                                <strong>Important :</strong> Le lien doit être visible et cliquable depuis votre page d'accueil.
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <p className="text-xs text-blue-600 bg-gray-100 px-2 py-1 rounded inline-block">
                              {`${window.location.origin}/conciergerie-details/${conciergerie?.nom?.toLowerCase().replace(/\s+/g, '-')}`}
                            </p>
                            <div className="text-xs text-blue-700 bg-blue-50 p-2 rounded">
                              <p className="font-medium mb-1">Étapes pour modifier votre profil Google :</p>
                              <ol className="list-decimal list-inside space-y-1">
                                <li>Connectez-vous à Google My Business</li>
                                <li>Sélectionnez votre établissement</li>
                                <li>Cliquez sur "Informations" dans le menu</li>
                                <li>Dans la section "Site web", ajoutez le lien ci-dessus</li>
                                <li>Cliquez sur "Enregistrer"</li>
                              </ol>
                            </div>
                          </div>
                        )}
                        
                        <p className="text-sm text-blue-900 mt-3">
                          Contactez ensuite <a href="mailto:contact@proprioadvisor.fr" className="text-blue-600 underline">contact@proprioadvisor.fr</a> pour valider vos points.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            
            {/* Actions - uniquement visibles lors de la modification */}
            {isUpdate && (
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
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SubscriptionSuccess;



