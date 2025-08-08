"use client";

import Head from "next/head";
interface SubscriptionHeaderProps {
  existingSubscription: any;
  conciergerieId: string | null;
  conciergerieName: string;
}
export const SubscriptionHeader: React.FC<SubscriptionHeaderProps> = ({
  existingSubscription,
  conciergerieId,
  conciergerieName
}) => {
  return <>
      <Head>
        <title>Devenez partenaire | Soyez + visible sur Google, ChatGPT et Proprioadvisor</title>
        <meta name="description" content="Soutenez Proprioadvisor, un service qui aide les propriÃ©taires Ã  trouver la conciergerie idÃ©ale." />
      </Head>
      
      
      
      <h1 className="text-3xl font-bold text-center mb-6">
        {existingSubscription ? "Modifier vos options de rÃ©fÃ©rencement" : "Finalisez votre inscription"}
      </h1>

      {conciergerieId && <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 text-center">
            <span className="font-medium">Conciergerie identifiÃ©e :</span> {conciergerieName || "Chargement..."}
          </p>
          <p className="text-green-600 text-sm text-center mt-1">
            {existingSubscription ? "Votre souscription sera mise Ã  jour" : "Votre souscription sera automatiquement liÃ©e Ã  votre conciergerie"}
          </p>
        </div>}


    </>;
};

