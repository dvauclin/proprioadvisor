"use client";

import Head from "next/head";
import React from "react";
import { Button } from "@/components/ui/button";
import { SubscriptionHeader } from "@/components/subscription/SubscriptionHeader";
import { IntroductionSection } from "@/components/subscription/IntroductionSection";
import { SubscriptionForm } from "@/components/subscription/SubscriptionForm";
import SubscriptionFAQ from "@/components/subscription/SubscriptionFAQ";
import { useCalcomScript } from "@/hooks/useCalcomScript";
import { useSubscriptionData } from "@/hooks/useSubscriptionData";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

const Subscription = () => {
  const {
    conciergerieId,
    conciergerieName,
    conciergerieEmail,
    existingSubscription,
    currentMonthlyPayment,
    renewalDay,
    isLoadingSubscriptionData
  } = useSubscriptionData();
  const { user } = useAuth();
  useCalcomScript();

  if (isLoadingSubscriptionData) {
    return <div className="flex flex-col items-center justify-center min-h-screen py-16 bg-gradient-to-b from-white to-gray-50">
        <Loader2 className="h-12 w-12 animate-spin text-brand-chartreuse" />
        <p className="text-gray-600 mt-4 text-lg">Chargement des informations...</p>
      </div>;
  }

  // Si aucun conciergerieId n'est trouvé et qu'aucune souscription existante
  if (!conciergerieId && !existingSubscription) {
    return (
      <div className="bg-gradient-to-b from-white to-gray-50 py-[32px]">
        <Head>
          <title>Souscription | ProprioAdvisor</title>
          <meta name="robots" content="noindex, nofollow" />
        </Head>
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card className="shadow-lg">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-red-100 flex items-center justify-center rounded-full mb-4">
                  <AlertCircle className="h-8 w-8 text-red-600" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                  Conciergerie non trouvée
                </CardTitle>
                <CardDescription className="text-lg">
                  {!user 
                    ? "Vous devez être connecté pour modifier votre souscription."
                    : "Aucune conciergerie associée à votre compte n'a été trouvée."
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!user ? (
                  <div className="space-y-3">
                    <Button className="w-full" size="lg" asChild>
                      <Link href="/connexion">
                        Se connecter
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full" size="lg" asChild>
                      <Link href="/inscription">
                        Créer une conciergerie
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Button className="w-full" size="lg" asChild>
                      <Link href="/inscription">
                        Créer une conciergerie
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full" size="lg" asChild>
                      <Link href="/">
                        Retour à l'accueil
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return <div className="bg-gradient-to-b from-white to-gray-50 py-[32px]">
      <Head>
        <title>Souscription | ProprioAdvisor</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 p-8 md:p-10 px-[8px]">
          <SubscriptionHeader existingSubscription={existingSubscription} conciergerieId={conciergerieId} conciergerieName={conciergerieName} />

          {!existingSubscription && <IntroductionSection />}
          
          {(conciergerieId || !existingSubscription) && <SubscriptionForm existingSubscription={existingSubscription} conciergerieId={conciergerieId} conciergerieEmail={conciergerieEmail} currentMonthlyPayment={currentMonthlyPayment} />}
          
          <SubscriptionFAQ />
          
          
        </div>
      </div>
    </div>;
};

export default Subscription;