"use client";

import React, { useMemo, useState, useEffect } from "react";
import { Button } from "@/components/ui-kit/button";
import { Form } from "@/components/ui-kit/form";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui-kit/form";
import { Input } from "@/components/ui-kit/input";
import { PasswordForm } from "@/components/subscription/PasswordForm";
import { useSubscriptionSubmit } from "@/hooks/useSubscriptionSubmit";
import { useFormPreFill } from "@/hooks/useFormPreFill";
import { createSubscriptionSchema } from "@/schemas/subscriptionSchemaFactory";
import { SubscriptionFormValues } from "@/types/subscription";
import { calculateRankingPositions, groupRankingTargets } from "@/services/rankingService";

interface SubscriptionFormProps {
  existingSubscription: any;
  conciergerieId: string | null;
  conciergerieEmail: string;
  conciergerieName: string;
}
export const SubscriptionForm: React.FC<SubscriptionFormProps> = ({
  existingSubscription,
  conciergerieId,
  conciergerieEmail,
  conciergerieName
}) => {
  const subscriptionSchema = useMemo(() => {
    return createSubscriptionSchema(!!existingSubscription, !!conciergerieEmail);
  }, [existingSubscription, conciergerieEmail]);
  const form = useForm<SubscriptionFormValues>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      options: {
        websiteLink: false,
        phoneNumber: false,
        backlink: false
      },
      customAmount: "10",
      useCustomAmount: false,
      websiteUrl: "",
      phoneNumberValue: "",
      password: "",
      confirmPassword: ""
    }
  });
  useFormPreFill({
    form,
    existingSubscription
  });

  // Watch form values for reactive calculation
  const useCustomAmount = form.watch("useCustomAmount");
  const customAmount = form.watch("customAmount");
  const backlink = form.watch("options.backlink");

  // Calculate current points based on watched form values
  const currentPoints = useMemo(() => {
    const customAmountValue = useCustomAmount ? Number(customAmount) || 0 : 0;
    const bonusPoints = backlink ? 5 : 0;
    return customAmountValue + bonusPoints;
  }, [useCustomAmount, customAmount, backlink]);

  // État pour les données de classement
  const [rankingData, setRankingData] = useState<{
    position1: any;
    position3: any;
    positionSecure: any;
    villes: string[];
  } | null>(null);
  const [loadingRanking, setLoadingRanking] = useState(false);

  // Charger les données de classement
  useEffect(() => {
    if (!conciergerieId) return;

    const fetchRankingData = async () => {
      setLoadingRanking(true);
      try {
        const targets = await calculateRankingPositions(conciergerieId);
        const grouped = groupRankingTargets(targets);
        setRankingData(grouped);
      } catch (error) {
        console.error('Erreur lors du chargement des données de classement:', error);
      } finally {
        setLoadingRanking(false);
      }
    };

    fetchRankingData();
  }, [conciergerieId]);
  
  const {
    handleSubscription,
    loading
  } = useSubscriptionSubmit({
    totalMonthlyFee: Number(customAmount) || 0,
    totalPoints: currentPoints,
    conciergerieId,
    conciergerieEmail,
    conciergerieNom: conciergerieName,
    existingSubscription
  });
  
  return <div className="mb-8 bg-gray-50 p-6 rounded-lg border border-gray-100 px-[12px] py-[12px]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubscription)} className="space-y-6 md:space-y-6 space-y-3">
          
          {/* Section de sélection du montant d'abonnement */}
          <div className="p-4 md:p-4 p-2">
            <h3 className="text-lg font-semibold mb-4">Montant de l'abonnement</h3>
            
            <div className="space-y-4 md:space-y-4 space-y-2">
              <FormField control={form.control} name="useCustomAmount" render={({
                field
              }) => <FormItem className="space-y-3">
                <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 md:p-4 p-2">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      className="h-4 w-4 text-brand-chartreuse focus:ring-brand-chartreuse border-gray-300 rounded"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none flex-1">
                                         <FormLabel className="text-base">
                       Je souhaite profiter des avantages de l'abonnement payant
                      <div className="text-gray-600 text-xs mt-1">
                        {rankingData && rankingData.villes.length > 0 ? (
                          <>
                            Pour classer <strong>{conciergerieName}</strong> comme conciergerie partenaire et recommandée à {rankingData.villes.join(', ')}.
                          </>
                        ) : (
                          `Pour classer ${conciergerieName} comme conciergerie partenaire et recommandée.`
                        )}
                      </div>
                      <div className="text-blue-600 font-medium text-sm mt-1 md:mt-1 mt-0.5">1€ = 1 point supplémentaire</div>
                    </FormLabel>
                  </div>
                </div>
                
                {form.watch("useCustomAmount") && <FormField control={form.control} name="customAmount" render={({
                  field: amountField
                }) => <FormItem className="ml-8 md:ml-8 ml-4">
                  <FormLabel>Montant mensuel (en €)</FormLabel>
                  <FormControl>
                    <div className="flex items-center">
                      <Input 
                        type="number" 
                        min={1} 
                        value={amountField.value} 
                        onChange={amountField.onChange} 
                        placeholder="10" 
                        className="w-24" 
                      />
                      <span className="ml-2 text-sm text-gray-500">/mois</span>
                    </div>
                  </FormControl>
                </FormItem>} />}
              </FormItem>} />
            </div>

            {/* Message dynamique en bas */}
            <div className={`mt-6 md:mt-6 mt-3 p-4 md:p-4 p-2 rounded-lg ${currentPoints === 0 ? 'bg-red-50 border border-red-200' : 'bg-gray-50 border border-gray-200'}`}>
              <p className={`text-sm font-medium ${currentPoints === 0 ? 'text-red-800' : 'text-gray-800'}`}>
                Total de points : <span className={`font-semibold ${currentPoints === 0 ? 'text-red-600' : 'text-blue-600'}`}>
                  {currentPoints} point{currentPoints > 1 ? 's' : ''}
                  {backlink && useCustomAmount && Number(customAmount) > 0 && (
                    <span className="text-xs font-normal text-gray-500 ml-1">
                      (incluant les 5 points bonus gagnés pour le lien ajouté)
                    </span>
                  )}
                </span>
              </p>
              <div className={`text-xs mt-2 ${currentPoints === 0 ? 'text-red-600' : 'text-gray-600'}`}>
                {currentPoints === 0 ? (
                  <p>
                    Avec 0 point vous ne serez pas considéré comme une conciergerie partenaire. Les clients ne pourront pas vous contacter et vous serez placé tout en bas des listings. Votre visibilité est quasi nulle. Il faut au moins 1 point pour être considéré comme une conciergerie partenaire.
                  </p>
                ) : (
                  <div>
                    {loadingRanking ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        <span>Calcul des positions de classement...</span>
                      </div>
                    ) : rankingData && rankingData.villes.length > 0 ? (
                      <div className="space-y-1">
                        {(rankingData.position1 || rankingData.position3) && (
                          <div className="space-y-3">
                            <div className="text-sm">
                              <span className="font-medium">
                                Objectifs de classement {rankingData.villes.length === 1 ? `à ${rankingData.villes[0]}` : 'dans les villes sélectionnées'}
                              </span>
                            </div>
                            
                            {/* Barre de progression unique */}
                            <div className="relative w-full bg-gray-200 rounded-full h-4">
                              {/* Barre de progression actuelle */}
                              <div 
                                className="h-4 rounded-full transition-all duration-500 bg-gradient-to-r from-gray-400 to-gray-600"
                                style={{ 
                                  width: `${Math.min(100, (currentPoints / Math.max(rankingData.position1?.requiredPoints || 0, rankingData.position3?.requiredPoints || 0, rankingData.positionSecure?.requiredPoints || 0)) * 100)}%` 
                                }}
                              ></div>
                              
                              {/* Marqueur Top 3 - seulement si différent de la 1ère position */}
                              {rankingData.position3 && rankingData.position1 && rankingData.position3.requiredPoints !== rankingData.position1.requiredPoints && (
                                <div 
                                  className="absolute top-0 w-1 h-4 bg-orange-500 rounded-full"
                                  style={{ 
                                    left: `${(rankingData.position3.requiredPoints / Math.max(rankingData.position1?.requiredPoints || 0, rankingData.position3?.requiredPoints || 0, rankingData.positionSecure?.requiredPoints || 0)) * 100}%` 
                                  }}
                                ></div>
                              )}
                              
                              {/* Marqueur 1ère position */}
                              {rankingData.position1 && (
                                <div 
                                  className="absolute top-0 w-1 h-4 bg-yellow-500 rounded-full"
                                  style={{ 
                                    left: `${(rankingData.position1.requiredPoints / Math.max(rankingData.position1?.requiredPoints || 0, rankingData.position3?.requiredPoints || 0, rankingData.positionSecure?.requiredPoints || 0)) * 100}%` 
                                  }}
                                ></div>
                              )}
                              
                              {/* Marqueur Sécuriser 1ère position */}
                              {rankingData.positionSecure && (
                                <div 
                                  className="absolute top-0 w-1 h-4 bg-green-500 rounded-full"
                                  style={{ 
                                    left: `${(rankingData.positionSecure.requiredPoints / Math.max(rankingData.position1?.requiredPoints || 0, rankingData.position3?.requiredPoints || 0, rankingData.positionSecure?.requiredPoints || 0)) * 100}%` 
                                  }}
                                ></div>
                              )}
                            </div>
                            
                            {/* Légende des objectifs */}
                            <div className="space-y-1 text-sm">
                              {/* Afficher Top 3 seulement si différent de la 1ère position */}
                              {rankingData.position3 && (!rankingData.position1 || rankingData.position3.requiredPoints !== rankingData.position1.requiredPoints) && (
                                <div className="md:flex md:items-center md:justify-between">
                                  <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                                    <span>Figurer top 3 : {rankingData.position3.requiredPoints} points</span>
                                  </div>
                                  {currentPoints >= rankingData.position3.requiredPoints && (
                                    <div className="text-orange-600 font-semibold mt-1 md:mt-0 md:ml-2">
                                      🥉 Atteint !
                                    </div>
                                  )}
                                </div>
                              )}
                              {rankingData.position1 && (
                                <div className="md:flex md:items-center md:justify-between">
                                  <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                    <span>Atteindre 1ère position : {rankingData.position1.requiredPoints} points</span>
                                  </div>
                                  {currentPoints >= rankingData.position1.requiredPoints && (
                                    <div className="text-yellow-600 font-semibold mt-1 md:mt-0 md:ml-2">
                                      🏆 Atteint !
                                    </div>
                                  )}
                                </div>
                              )}
                              {rankingData.positionSecure && (
                                <div className="md:flex md:items-center md:justify-between">
                                  <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                    <span>Sécuriser 1ère position : {rankingData.positionSecure.requiredPoints} points</span>
                                  </div>
                                  {currentPoints >= rankingData.positionSecure.requiredPoints && (
                                    <div className="text-green-600 font-semibold mt-1 md:mt-0 md:ml-2">
                                      🛡️ Atteint !
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p>
                        Si une autre conciergerie de votre ville a moins de points elle sera positionnée derrière, si elle en a plus elle sera positionnée devant. Plus vous avez de points, plus vous maximisez votre visibilité.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Cadre mémo séparé */}
            {rankingData && rankingData.villes.length > 0 && currentPoints > 0 && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
                💡 Plus vous êtes classé haut, plus vous êtes visible sur les IA et moteurs de recherche.
              </div>
            )}
          </div>

          {/* <PaidPlanOptionsSection form={form} isPaid={isPaidPlan} /> */}

          <PasswordForm form={form} existingSubscription={existingSubscription} conciergerieEmail={conciergerieEmail} />

          <div className="text-center pt-6 md:pt-6 pt-3">
            <Button type="submit" size="lg" disabled={loading}>
              {loading ? <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                  Traitement en cours...
                </> : existingSubscription ? "Mettre à jour la souscription" : "Souscrire maintenant"}
            </Button>
            <p className="text-sm text-gray-500 mt-2">
              Vous pourrez modifier ou annuler votre souscription à tout moment
            </p>
          </div>
        </form>
      </Form>
    </div>;
};

