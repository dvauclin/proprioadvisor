"use client";

import React from "react";
import Head from "next/head";
import AllCitiesSection from "@/components/home/AllCitiesSection";
import { useVillesData } from "@/hooks/useVillesData";

const PolitiqueConfidentialite: React.FC = () => {
  const { villes: allVilles } = useVillesData();

  return (
    <>
      <Head>
        <title>Politique de ConfidentialitÃ© | ProprioAdvisor</title>
        <meta name="description" content="Politique de confidentialitÃ© de ProprioAdvisor, comparateur de conciergeries Airbnb" />
        <link rel="canonical" href="https://proprioadvisor.fr/politique-confidentialite" />
      </Head>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold">Politique de ConfidentialitÃ©</h1>
          </header>

          <main className="prose max-w-none">
            <section className="mb-8">
              <p className="mb-4">Date de derniÃ¨re mise Ã  jour : <time dateTime="2025-05-06">06/05/2025</time></p>
              <p>Cette politique de confidentialitÃ© dÃ©crit comment Proprioadvisor (reprÃ©sentÃ© par David Vauclin) collecte, utilise et protÃ¨ge vos informations personnelles lorsque vous utilisez le site web ProprioAdvisor.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">DonnÃ©es collectÃ©es</h2>
              <p>Nous collectons les informations suivantes :</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Informations d'identification (nom, prÃ©nom, adresse email, numÃ©ro de tÃ©lÃ©phone)</li>
                <li>Informations concernant votre bien immobilier (adresse, superficie, nombre de chambres)</li>
                <li>DonnÃ©es de navigation (adresse IP, cookies, pages visitÃ©es)</li>
                <li>Informations que vous nous fournissez volontairement via nos formulaires</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Utilisation des donnÃ©es</h2>
              <p>Nous utilisons vos donnÃ©es personnelles pour :</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Vous permettre d'utiliser notre service de comparaison de conciergeries</li>
                <li>Vous mettre en relation avec les conciergeries correspondant Ã  vos besoins</li>
                <li>AmÃ©liorer notre service et personnaliser votre expÃ©rience</li>
                <li>Vous envoyer des informations concernant nos services (avec votre consentement)</li>
                <li>Respecter nos obligations lÃ©gales</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Conservation des donnÃ©es</h2>
              <p>
                Nous conservons vos donnÃ©es personnelles aussi longtemps que nÃ©cessaire pour atteindre 
                les finalitÃ©s pour lesquelles nous les avons collectÃ©es, notamment pour satisfaire Ã  
                des exigences lÃ©gales, comptables ou de dÃ©claration.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Cookies et technologies similaires</h2>
              <p>
                Nous utilisons des cookies et des technologies similaires pour amÃ©liorer votre expÃ©rience 
                sur notre site, analyser notre trafic et personnaliser notre contenu. Vous pouvez contrÃ´ler 
                l'utilisation des cookies via les paramÃ¨tres de votre navigateur.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Partage des donnÃ©es</h2>
              <p>
                Nous pouvons partager vos donnÃ©es personnelles avec :
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Les conciergeries partenaires (uniquement avec votre consentement)</li>
                <li>Nos prestataires de services qui nous aident Ã  exploiter notre site</li>
                <li>Les autoritÃ©s lÃ©gales lorsque la loi nous y oblige</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Vos droits</h2>
              <p>
                ConformÃ©ment Ã  la rÃ©glementation applicable, vous disposez des droits suivants :
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Droit d'accÃ¨s et de rectification de vos donnÃ©es</li>
                <li>Droit Ã  l'effacement de vos donnÃ©es</li>
                <li>Droit Ã  la limitation du traitement</li>
                <li>Droit Ã  la portabilitÃ© de vos donnÃ©es</li>
                <li>Droit d'opposition au traitement</li>
                <li>Droit de retirer votre consentement Ã  tout moment</li>
              </ul>
              <p className="mt-4">Pour exercer ces droits, vous pouvez nous contacter Ã  l'adresse suivante : <a href="mailto:contact@proprioadvisor.fr" className="text-brand-chartreuse hover:underline">contact@proprioadvisor.fr</a></p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">Modifications de cette politique</h2>
              <p>
                Nous nous rÃ©servons le droit de modifier cette politique de confidentialitÃ© Ã  tout moment. 
                Toute modification sera publiÃ©e sur cette page avec une date de mise Ã  jour rÃ©visÃ©e.
              </p>
            </section>
          </main>
        </div>
      </div>
      <AllCitiesSection allVilles={allVilles} />
    </>
  );
};

export default PolitiqueConfidentialite;

