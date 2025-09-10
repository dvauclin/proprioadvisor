"use client";

import React, { ReactNode } from "react";
import Head from "next/head";
import InscriptionHeader from "./InscriptionHeader";
import AnimatedCounter from "@/components/ui-kit/AnimatedCounter";

interface InscriptionLayoutProps {
  children: ReactNode;
  onScrollToForm?: () => void;
}

const InscriptionLayout: React.FC<InscriptionLayoutProps> = ({ children, onScrollToForm }) => {
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
          
          {/* Description de ProprioAdvisor */}
          <div className="text-center mb-6">
            <p className="text-xl text-gray-800 font-medium leading-relaxed">
              ProprioAdvisor est le comparateur de conciergeries Airbnb n°1, le plus consulté, le plus complet. Vous ne pouvez pas ne pas y être, surtout si vous...
            </p>
            <div className="mt-6">
              <div className="flex flex-row justify-center items-center gap-3 sm:gap-8">
                <div 
                  className="flex flex-col items-center text-center cursor-pointer hover:scale-105 transition-transform duration-200"
                  onClick={onScrollToForm}
                >
                  <div className="bg-green-100 text-green-600 rounded-full w-12 h-12 flex items-center justify-center mb-2 hover:bg-green-200 transition-colors duration-200">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-700 font-medium">lancez votre conciergerie</span>
                </div>
                <div 
                  className="flex flex-col items-center text-center cursor-pointer hover:scale-105 transition-transform duration-200"
                  onClick={onScrollToForm}
                >
                  <div className="bg-blue-100 text-blue-600 rounded-full w-12 h-12 flex items-center justify-center mb-2 hover:bg-blue-200 transition-colors duration-200">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-700 font-medium">êtes en phase de croissance</span>
                </div>
                <div 
                  className="flex flex-col items-center text-center cursor-pointer hover:scale-105 transition-transform duration-200"
                  onClick={onScrollToForm}
                >
                  <div className="bg-purple-100 text-purple-600 rounded-full w-12 h-12 flex items-center justify-center mb-2 hover:bg-purple-200 transition-colors duration-200">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-700 font-medium">ouvrez de nouvelles villes</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Compteur animé juste avant le formulaire */}
          <div className="text-center mb-8">
            <AnimatedCounter 
              className="inline-block"
              textClassName="text-lg text-gray-700"
              numberClassName="font-bold text-brand-chartreuse text-xl"
              suffix=" se font connaître grâce à ProprioAdvisor"
            />
          </div>
          
          {children}
        </section>
      </div>
    </div>
  );
};

export default InscriptionLayout;

