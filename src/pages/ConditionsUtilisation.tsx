"use client";

import React from "react";
import Head from "next/head";
import AllCitiesSection from "@/components/home/AllCitiesSection";
import { useVillesData } from "@/hooks/useVillesData";

const ConditionsUtilisation: React.FC = () => {
  const { villes: allVilles } = useVillesData();

  return (
    <>
      <Head>
        <title>Conditions GÃ©nÃ©rales d'Utilisation | ProprioAdvisor</title>
        <meta name="description" content="Conditions gÃ©nÃ©rales d'utilisation de ProprioAdvisor, comparateur de conciergeries Airbnb" />
        <link rel="canonical" href="https://proprioadvisor.fr/conditions-utilisation" />
      </Head>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold">Conditions GÃ©nÃ©rales d'Utilisation</h1>
          </header>

          <main className="prose max-w-none">
            <section className="mb-8">
              <p className="mb-4">Date de derniÃ¨re mise Ã  jour : <time dateTime="2024-05-06">06/05/2024</time></p>
              <p>Les prÃ©sentes conditions gÃ©nÃ©rales d'utilisation (ci-aprÃ¨s "CGU") rÃ©gissent l'utilisation du site web ProprioAdvisor (ci-aprÃ¨s le "Site") exploitÃ© par David Vauclin.</p>
              <p className="mt-2">
                En accÃ©dant et en utilisant le Site, vous acceptez sans rÃ©serve les prÃ©sentes CGU. 
                Si vous n'acceptez pas ces CGU, veuillez ne pas utiliser le Site.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Description du service</h2>
              <p>
                ProprioAdvisor est un service de comparaison de conciergeries pour la location courte durÃ©e. 
                Le Site met en relation des propriÃ©taires de biens immobiliers avec des sociÃ©tÃ©s de conciergerie 
                susceptibles de rÃ©pondre Ã  leurs besoins.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Conditions d'accÃ¨s et d'utilisation</h2>
              <p>
                L'accÃ¨s au Site est libre et gratuit pour les utilisateurs. Toutefois, certaines fonctionnalitÃ©s 
                peuvent nÃ©cessiter une inscription prÃ©alable.
              </p>
              <p className="mt-2">
                L'utilisateur s'engage Ã  fournir des informations exactes, complÃ¨tes et Ã  jour lors de son 
                inscription et Ã  les maintenir comme telles.
              </p>
              <p className="mt-2">
                L'utilisateur s'engage Ã  ne pas :
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Usurper l'identitÃ© d'un tiers</li>
                <li>Utiliser le Site Ã  des fins illÃ©gales ou frauduleuses</li>
                <li>Perturber ou interrompre le fonctionnement normal du Site</li>
                <li>Collecter des informations sur d'autres utilisateurs sans leur consentement</li>
                <li>Publier des contenus diffamatoires, obscÃ¨nes ou illicites</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">PropriÃ©tÃ© intellectuelle</h2>
              <p>Tous les Ã©lÃ©ments du Site (textes, images, logos, bases de donnÃ©es, etc.) sont protÃ©gÃ©s par le droit de la propriÃ©tÃ© intellectuelle et appartiennent exclusivement Ã  Proprioadvisor ou font l'objet d'une autorisation d'utilisation.</p>
              <p className="mt-2">Toute reproduction, reprÃ©sentation, modification ou exploitation de tout ou partie du Site sans l'autorisation prÃ©alable et Ã©crite de Proprioadvisor est interdite.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">ResponsabilitÃ©</h2>
              <p>Proprioadvisor s'efforce d'assurer au mieux de ses possibilitÃ©s l'exactitude et la mise Ã  jour des informations diffusÃ©es sur le Site. Toutefois, Proprioadvisor ne peut garantir l'exactitude, la prÃ©cision ou l'exhaustivitÃ© des informations mises Ã  la disposition des utilisateurs.</p>
              <p className="mt-2">Proprioadvisor ne saurait Ãªtre tenue responsable :</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Des erreurs ou omissions dans les informations disponibles sur le Site</li>
                <li>Des dommages rÃ©sultant de l'intrusion frauduleuse d'un tiers sur le Site</li>
                <li>Des dommages rÃ©sultant de l'usage du Site par l'utilisateur</li>
                <li>Des services fournis par les conciergeries rÃ©fÃ©rencÃ©es sur le Site</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Liens vers d'autres sites</h2>
              <p>Le Site peut contenir des liens vers des sites tiers. Proprioadvisor n'exerce aucun contrÃ´le sur ces sites et n'assume aucune responsabilitÃ© quant Ã  leur contenu, leur politique de confidentialitÃ© ou leurs pratiques.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">Modification des CGU et droit applicable</h2>
              <p>Proprioadvisor se rÃ©serve le droit de modifier les prÃ©sentes CGU Ã  tout moment. Les modifications entrent en vigueur dÃ¨s leur publication sur le Site.</p>
              <p className="mt-2">
                Les prÃ©sentes CGU sont rÃ©gies par le droit franÃ§ais. Tout litige relatif Ã  l'interprÃ©tation 
                ou Ã  l'exÃ©cution des prÃ©sentes CGU sera soumis Ã  la compÃ©tence exclusive des tribunaux franÃ§ais.
              </p>
            </section>
          </main>
        </div>
      </div>
      <AllCitiesSection allVilles={allVilles} />
    </>
  );
};

export default ConditionsUtilisation;

