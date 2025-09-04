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

  // Calculate current points based on watched form values
  const currentPoints = useMemo(() => {
    const customAmountValue = useCustomAmount ? Number(customAmount) || 0 : 0;
    return customAmountValue;
  }, [useCustomAmount, customAmount]);

  // État pour les données de classement
  const [rankingData, setRankingData] = useState<{
    position1: any;
    position3: any;
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
          <div className="border border-gray-200 rounded-lg p-6 md:p-6 p-3 bg-white px-[12px] py-[12px]">
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
                      J'accepte de passer à un abonnement payant
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
            <div className={`mt-6 md:mt-6 mt-3 p-4 md:p-4 p-2 rounded-lg ${currentPoints === 0 ? 'bg-red-50 border border-red-200' : 'bg-blue-50 border border-blue-200'}`}>
              <p className={`text-sm font-medium ${currentPoints === 0 ? 'text-red-800' : 'text-blue-800'}`}>
                Total de points : {currentPoints} points
              </p>
              <div className={`text-xs mt-2 ${currentPoints === 0 ? 'text-red-600' : 'text-blue-600'}`}>
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
                        {rankingData.position1 && (
                          <div className={`text-sm ${currentPoints >= rankingData.position1.requiredPoints ? "animate-pulse text-yellow-600 font-semibold" : ""}`}>
                            <p>
                              Pour atteindre la 1ère position {rankingData.villes.length === 1 ? `à ${rankingData.villes[0]}` : 'dans les villes sélectionnées'}, il vous faut <strong>{rankingData.position1.requiredPoints}</strong> <strong>points</strong>.
                            </p>
                            {currentPoints >= rankingData.position1.requiredPoints && (
                              <p className="text-yellow-600 mt-1">
                                🏆 <span className="animate-bounce inline-block">Objectif atteint !</span>
                              </p>
                            )}
                          </div>
                        )}
                        {rankingData.position3 && (
                          <div className={`text-sm ${currentPoints >= rankingData.position3.requiredPoints ? "animate-pulse text-orange-600 font-semibold" : ""}`}>
                            <p>
                              Pour figurer dans le Top 3 {rankingData.villes.length === 1 ? `à ${rankingData.villes[0]}` : 'dans les villes sélectionnées'}, il vous faut <strong>{rankingData.position3.requiredPoints}</strong> <strong>points</strong>.
                            </p>
                            {currentPoints >= rankingData.position3.requiredPoints && (
                              <p className="text-orange-600 mt-1">
                                🥉 <span className="animate-bounce inline-block">Objectif atteint !</span>
                              </p>
                            )}
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
            {rankingData && rankingData.villes.length > 0 && (
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

