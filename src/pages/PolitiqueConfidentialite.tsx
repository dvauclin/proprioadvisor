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
        <title>Politique de Confidentialité | ProprioAdvisor</title>
        <meta name="description" content="Politique de confidentialité de ProprioAdvisor, comparateur de conciergeries Airbnb" />
        <link rel="canonical" href="https://proprioadvisor.fr/politique-confidentialite" />
      </Head>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold">Politique de Confidentialité</h1>
          </header>

          <main className="prose max-w-none">
            <section className="mb-8">
              <p className="mb-4">Date de dernière mise à jour : <time dateTime="2025-05-06">06/05/2025</time></p>
              <p>Cette politique de confidentialité décrit comment Proprioadvisor (représenté par David Vauclin) collecte, utilise et protège vos informations personnelles lorsque vous utilisez le site web ProprioAdvisor.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Données collectées</h2>
              <p>Nous collectons les informations suivantes :</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Informations d'identification (nom, prénom, adresse email, numéro de téléphone)</li>
                <li>Informations concernant votre bien immobilier (adresse, superficie, nombre de chambres)</li>
                <li>Données de navigation (adresse IP, cookies, pages visitées)</li>
                <li>Informations que vous nous fournissez volontairement via nos formulaires</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Utilisation des données</h2>
              <p>Nous utilisons vos données personnelles pour :</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Vous permettre d'utiliser notre service de comparaison de conciergeries</li>
                <li>Vous mettre en relation avec les conciergeries correspondant à vos besoins</li>
                <li>Améliorer notre service et personnaliser votre expérience</li>
                <li>Vous envoyer des informations concernant nos services (avec votre consentement)</li>
                <li>Respecter nos obligations légales</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Conservation des données</h2>
              <p>
                Nous conservons vos données personnelles aussi longtemps que nécessaire pour atteindre 
                les finalités pour lesquelles nous les avons collectées, notamment pour satisfaire à 
                des exigences légales, comptables ou de déclaration.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Cookies et technologies similaires</h2>
              <p>
                Nous utilisons des cookies et des technologies similaires pour améliorer votre expérience 
                sur notre site, analyser notre trafic et personnaliser notre contenu. Vous pouvez contrôler 
                l'utilisation des cookies via les paramètres de votre navigateur.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Partage des données</h2>
              <p>
                Nous pouvons partager vos données personnelles avec :
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Les conciergeries partenaires (uniquement avec votre consentement)</li>
                <li>Nos prestataires de services qui nous aident à exploiter notre site</li>
                <li>Les autorités légales lorsque la loi nous y oblige</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Vos droits</h2>
              <p>
                Conformément à la réglementation applicable, vous disposez des droits suivants :
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Droit d'accès et de rectification de vos données</li>
                <li>Droit à l'effacement de vos données</li>
                <li>Droit à la limitation du traitement</li>
                <li>Droit à la portabilité de vos données</li>
                <li>Droit d'opposition au traitement</li>
                <li>Droit de retirer votre consentement à tout moment</li>
              </ul>
              <p className="mt-4">Pour exercer ces droits, vous pouvez nous contacter à l'adresse suivante : <a href="mailto:contact@proprioadvisor.fr" className="text-brand-chartreuse hover:underline">contact@proprioadvisor.fr</a></p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">Modifications de cette politique</h2>
              <p>
                Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment. 
                Toute modification sera publiée sur cette page avec une date de mise à jour révisée.
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
