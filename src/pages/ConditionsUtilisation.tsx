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
        <title>Conditions Générales d'Utilisation | ProprioAdvisor</title>
        <meta name="description" content="Conditions générales d'utilisation de ProprioAdvisor, comparateur de conciergeries Airbnb" />
        <link rel="canonical" href="https://proprioadvisor.fr/conditions-utilisation" />
      </Head>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold">Conditions Générales d'Utilisation</h1>
          </header>

          <main className="prose max-w-none">
            <section className="mb-8">
              <p className="mb-4">Date de dernière mise à jour : <time dateTime="2024-05-06">06/05/2024</time></p>
              <p>Les présentes conditions générales d'utilisation (ci-après "CGU") régissent l'utilisation du site web ProprioAdvisor (ci-après le "Site") exploité par David Vauclin.</p>
              <p className="mt-2">
                En accédant et en utilisant le Site, vous acceptez sans réserve les présentes CGU. 
                Si vous n'acceptez pas ces CGU, veuillez ne pas utiliser le Site.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Description du service</h2>
              <p>
                ProprioAdvisor est un service de comparaison de conciergeries pour la location courte durée. 
                Le Site met en relation des propriétaires de biens immobiliers avec des sociétés de conciergerie 
                susceptibles de répondre à leurs besoins.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Conditions d'accès et d'utilisation</h2>
              <p>
                L'accès au Site est libre et gratuit pour les utilisateurs. Toutefois, certaines fonctionnalités 
                peuvent nécessiter une inscription préalable.
              </p>
              <p className="mt-2">
                L'utilisateur s'engage à fournir des informations exactes, complètes et à jour lors de son 
                inscription et à les maintenir comme telles.
              </p>
              <p className="mt-2">
                L'utilisateur s'engage à ne pas :
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Usurper l'identité d'un tiers</li>
                <li>Utiliser le Site à des fins illégales ou frauduleuses</li>
                <li>Perturber ou interrompre le fonctionnement normal du Site</li>
                <li>Collecter des informations sur d'autres utilisateurs sans leur consentement</li>
                <li>Publier des contenus diffamatoires, obscènes ou illicites</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Propriété intellectuelle</h2>
              <p>Tous les éléments du Site (textes, images, logos, bases de données, etc.) sont protégés par le droit de la propriété intellectuelle et appartiennent exclusivement à Proprioadvisor ou font l'objet d'une autorisation d'utilisation.</p>
              <p className="mt-2">Toute reproduction, représentation, modification ou exploitation de tout ou partie du Site sans l'autorisation préalable et écrite de Proprioadvisor est interdite.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Responsabilité</h2>
              <p>Proprioadvisor s'efforce d'assurer au mieux de ses possibilités l'exactitude et la mise à jour des informations diffusées sur le Site. Toutefois, Proprioadvisor ne peut garantir l'exactitude, la précision ou l'exhaustivité des informations mises à la disposition des utilisateurs.</p>
              <p className="mt-2">Proprioadvisor ne saurait être tenue responsable :</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Des erreurs ou omissions dans les informations disponibles sur le Site</li>
                <li>Des dommages résultant de l'intrusion frauduleuse d'un tiers sur le Site</li>
                <li>Des dommages résultant de l'usage du Site par l'utilisateur</li>
                <li>Des services fournis par les conciergeries référencées sur le Site</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Liens vers d'autres sites</h2>
              <p>Le Site peut contenir des liens vers des sites tiers. Proprioadvisor n'exerce aucun contrôle sur ces sites et n'assume aucune responsabilité quant à leur contenu, leur politique de confidentialité ou leurs pratiques.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">Modification des CGU et droit applicable</h2>
              <p>Proprioadvisor se réserve le droit de modifier les présentes CGU à tout moment. Les modifications entrent en vigueur dès leur publication sur le Site.</p>
              <p className="mt-2">
                Les présentes CGU sont régies par le droit français. Tout litige relatif à l'interprétation 
                ou à l'exécution des présentes CGU sera soumis à la compétence exclusive des tribunaux français.
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

