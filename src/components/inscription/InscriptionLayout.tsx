"use client";

import React, { ReactNode } from "react";
import Head from "next/head";
import InscriptionHeader from "./InscriptionHeader";

interface InscriptionLayoutProps {
  children: ReactNode;
  onScrollToForm?: () => void;
}

const InscriptionLayout: React.FC<InscriptionLayoutProps> = ({ children }) => {
  return (
    <div className="py-12">
      <Head>
        <title>Inscrivez votre conciergerie Airbnb sur ProprioAdvisor</title>
        <meta name="description" content="Rejoignez notre réseau de conciergeries partenaires et gagnez en visibilité auprès des propriétaires." />
      </Head>
      
      <div className="container mx-auto px-4">
        <section className="max-w-4xl mx-auto">
          <InscriptionHeader />
          {children}
        </section>
      </div>
    </div>
  );
};

export default InscriptionLayout;

