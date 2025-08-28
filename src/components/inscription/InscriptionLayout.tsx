"use client";

import React, { ReactNode } from "react";
import Head from "next/head";
import InscriptionHeader from "./InscriptionHeader";
import AnimatedCounter from "@/components/ui-kit/AnimatedCounter";

interface InscriptionLayoutProps {
  children: ReactNode;
  onScrollToForm?: () => void;
}

const InscriptionLayout: React.FC<InscriptionLayoutProps> = ({ children }) => {
  return (
    <div className="relative overflow-hidden py-12">
      {/* Top-only gradient overlay for consistent height with home and listings */}
      <div className="absolute inset-x-0 top-0 h-[640px] -z-10 bg-gradient-to-b from-brand-emerald-50 via-white to-white pointer-events-none overflow-hidden">
        <div
          className="absolute -top-12 -right-12 h-40 w-40 rounded-full blur-2xl opacity-40"
          style={{ background: "radial-gradient(circle at center, rgba(127,255,0,0.35), transparent 60%)" }}
        />
        <div
          className="absolute -bottom-16 -left-10 h-48 w-48 rounded-full blur-2xl opacity-30"
          style={{ background: "radial-gradient(circle at center, rgba(0,191,255,0.25), transparent 60%)" }}
        />
      </div>
      
      <Head>
        <title>Inscrivez votre conciergerie Airbnb sur ProprioAdvisor</title>
        <meta name="description" content="Rejoignez notre réseau de conciergeries partenaires et gagnez en visibilité auprès des propriétaires." />
      </Head>
      
      <div className="container mx-auto px-4 relative z-10">
        <section className="max-w-4xl mx-auto">
          <InscriptionHeader />
          
          {/* Compteur animé juste avant le formulaire */}
          <div className="text-center mb-8">
            <AnimatedCounter 
              className="inline-block"
              textClassName="text-lg text-gray-700"
              numberClassName="font-bold text-brand-chartreuse text-xl"
              suffix=" sur la plateforme"
            />
          </div>
          
          {children}
        </section>
      </div>
    </div>
  );
};

export default InscriptionLayout;

