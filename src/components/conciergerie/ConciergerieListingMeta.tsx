"use client";

import React, { useState, useEffect } from "react";
import Head from "next/head";
import StructuredData from "@/components/seo/StructuredData";
import { createListingStructuredData, createBreadcrumbStructuredData } from "@/utils/structuredDataHelpers";

import { Ville, Formule, Conciergerie } from "@/types";

interface ConciergerieListingMetaProps {
  ville: Ville | null;
  villeSlug: string | undefined;
  filteredFormules: (Formule & { conciergerie?: Conciergerie })[];
  breadcrumbItems: Array<{ label: string; href?: string }>;
  emergencyMetaData: any;
}

const ConciergerieListingMeta: React.FC<ConciergerieListingMetaProps> = ({
  ville,
  villeSlug,
  filteredFormules,
  breadcrumbItems,
  emergencyMetaData
}) => {
  const [structuredDataListing, setStructuredDataListing] = useState<any>(null);
  
  // Titre personnalisé par ville depuis Supabase
  const pageTitle = ville?.titleSeo 
    ? ville.titleSeo
    : ville?.nom 
    ? `Conciergeries Airbnb à ${ville.nom} - Comparateur gratuit | Proprioadvisor`
    : emergencyMetaData?.title || 'Comparateur conciergeries Airbnb';
    
  // Description personnalisée par ville depuis Supabase
  const pageDescription = ville?.description 
    ? ville.description
    : ville?.nom
    ? `Découvrez les meilleures conciergeries Airbnb à ${ville.nom}. Comparez gratuitement les services, tarifs et avis pour choisir la conciergerie idéale pour votre location courte durée.`
    : emergencyMetaData?.description || 'Découvrez les meilleures conciergeries Airbnb pour votre bien.';
  
  const canonicalUrl = `https://proprioadvisor.fr/conciergerie/${villeSlug}`;

  const getLastUpdateDateISO = () => {
    const today = new Date();
    const lastUpdate = new Date(today);
    lastUpdate.setDate(today.getDate() - 7);
    return lastUpdate.toISOString();
  };

  // Générer les données structurées avec les vrais avis de façon asynchrone
  useEffect(() => {
    const generateStructuredData = async () => {
      if (ville && filteredFormules.length > 0) {
        try {
          const data = await createListingStructuredData(ville, filteredFormules, getLastUpdateDateISO());
          setStructuredDataListing(data);
        } catch (error) {
          console.error('Error generating structured data:', error);
          // Fallback vers null pour éviter les erreurs
          setStructuredDataListing(null);
        }
      }
    };

    generateStructuredData();
  }, [ville, filteredFormules]);

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={canonicalUrl} />
        
        {/* Open Graph */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        
        {/* Keywords basés sur la ville */}
        {ville?.nom && (
          <meta name="keywords" content={`conciergerie airbnb, ${ville.nom}, location courte durée, gestion locative, airbnb management`} />
        )}
      </Head>
      
      {ville && (
        <>
          {structuredDataListing && <StructuredData data={structuredDataListing} />}
          <StructuredData data={createBreadcrumbStructuredData(
            breadcrumbItems.map(item => ({ name: item.label, url: item.href }))
          )} />
        </>
      )}
    </>
  );
};

export default ConciergerieListingMeta;
