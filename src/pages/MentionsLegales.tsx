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
        <title>Mentions LÃ©gales | ProprioAdvisor</title>
        <meta name="description" content="Mentions lÃ©gales de ProprioAdvisor, comparateur de conciergeries Airbnb" />
        <link rel="canonical" href="https://proprioadvisor.fr/mentions-legales" />
      </Head>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold">Mentions LÃ©gales</h1>
          </header>

          <main className="prose max-w-none">
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Ã‰diteur du site</h2>
              <p>Le site ProprioAdvisor est Ã©ditÃ© par :</p>
              <address className="not-italic">
                <p>David Vauclin</p>
                <p>Auto-entrepreneur</p>
                <p>SiÃ¨ge social : 4 rue Chateauneuf, 06000 Nice</p>
                <p>SIRET : 88842323300046</p>
              </address>
              
              <p>Directeur de la publication : David Vauclin</p>
              <p>Contact : <a href="mailto:contact@proprioadvisor.fr" className="text-brand-chartreuse hover:underline">contact@proprioadvisor.fr</a></p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">HÃ©bergement</h2>
              <p>Le site est hÃ©bergÃ© par :</p>
              <address className="not-italic">
                <p>Vercel Inc.</p>
                <p>440 N Barranca Ave #4133, Covina, CA 91723, USA</p>
              </address>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">PropriÃ©tÃ© intellectuelle</h2>
              <p>L'ensemble de ce site (structure, textes, logos, images, photographies, vidÃ©os, sons, savoir-faire, etc.) est la propriÃ©tÃ© exclusive de ProprioAdvisor ou fait l'objet d'une autorisation d'utilisation. Toute utilisation, reproduction ou reprÃ©sentation, par quelque procÃ©dÃ© que ce soit, et sur quelque support que ce soit, de tout ou partie du site et/ou des Ã©lÃ©ments qui le composent n'est pas autorisÃ©e sans le consentement prÃ©alable de ProprioAdvisor.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Limitation de responsabilitÃ©</h2>
              <p>ProprioAdvisor ne pourra Ãªtre tenu responsable des dommages directs et indirects causÃ©s au matÃ©riel de l'utilisateur, lors de l'accÃ¨s au site, et rÃ©sultant de l'utilisation d'un matÃ©riel ne rÃ©pondant pas aux spÃ©cifications techniques requises, soit de l'apparition d'un bug ou d'une incompatibilitÃ©.</p>
              <p>ProprioAdvisor ne pourra Ãªtre tenu responsable des dommages indirects consÃ©cutifs Ã  l'utilisation du site.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">Loi applicable et juridiction</h2>
              <p>
                Les prÃ©sentes mentions lÃ©gales sont soumises Ã  la loi franÃ§aise. En cas de litige, 
                les tribunaux franÃ§ais seront seuls compÃ©tents.
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

