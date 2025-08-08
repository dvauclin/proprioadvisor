"use client";

import React from "react";
import Head from "next/head";
import AllCitiesSection from "@/components/home/AllCitiesSection";
import { useVillesData } from "@/hooks/useVillesData";

const MentionsLegales: React.FC = () => {
  const { villes: allVilles } = useVillesData();

  return (
    <>
      <Head>
        <title>Mentions Légales | ProprioAdvisor</title>
        <meta name="description" content="Mentions légales de ProprioAdvisor, comparateur de conciergeries Airbnb" />
        <link rel="canonical" href="https://proprioadvisor.fr/mentions-legales" />
      </Head>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold">Mentions Légales</h1>
          </header>

          <main className="prose max-w-none">
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">0diteur du site</h2>
              <p>Le site ProprioAdvisor est édité par :</p>
              <address className="not-italic">
                <p>David Vauclin</p>
                <p>Auto-entrepreneur</p>
                <p>Siège social : 4 rue Chateauneuf, 06000 Nice</p>
                <p>SIRET : 88842323300046</p>
              </address>
              
              <p>Directeur de la publication : David Vauclin</p>
              <p>Contact : <a href="mailto:contact@proprioadvisor.fr" className="text-brand-chartreuse hover:underline">contact@proprioadvisor.fr</a></p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Hébergement</h2>
              <p>Le site est hébergé par :</p>
              <address className="not-italic">
                <p>Vercel Inc.</p>
                <p>440 N Barranca Ave #4133, Covina, CA 91723, USA</p>
              </address>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Propriété intellectuelle</h2>
              <p>L'ensemble de ce site (structure, textes, logos, images, photographies, vidéos, sons, savoir-faire, etc.) est la propriété exclusive de ProprioAdvisor ou fait l'objet d'une autorisation d'utilisation. Toute utilisation, reproduction ou représentation, par quelque procédé que ce soit, et sur quelque support que ce soit, de tout ou partie du site et/ou des éléments qui le composent n'est pas autorisée sans le consentement préalable de ProprioAdvisor.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Limitation de responsabilité</h2>
              <p>ProprioAdvisor ne pourra être tenu responsable des dommages directs et indirects causés au matériel de l'utilisateur, lors de l'accès au site, et résultant de l'utilisation d'un matériel ne répondant pas aux spécifications techniques requises, soit de l'apparition d'un bug ou d'une incompatibilité.</p>
              <p>ProprioAdvisor ne pourra être tenu responsable des dommages indirects consécutifs à l'utilisation du site.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">Loi applicable et juridiction</h2>
              <p>
                Les présentes mentions légales sont soumises à la loi française. En cas de litige, 
                les tribunaux français seront seuls compétents.
              </p>
            </section>
          </main>
        </div>
      </div>
      <AllCitiesSection allVilles={allVilles} />
    </>
  );
};

export default MentionsLegales;

