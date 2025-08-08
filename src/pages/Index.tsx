"use client";

import React, { useEffect, useState } from "react";
import Head from "next/head";
import { getRecentArticles } from "@/lib/data";
import { Article } from "@/types";
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import RecentArticlesSection from "@/components/home/RecentArticlesSection";
import CTASection from "@/components/home/CTASection";
import AllCitiesSection from "@/components/home/AllCitiesSection";
import { useVillesData } from "@/hooks/useVillesData";
import StructuredData from "@/components/seo/StructuredData";
import { createBreadcrumbStructuredData } from "@/utils/structuredDataHelpers";

const Index: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVille] = useState<string | null>(null);
  const { villes: allVilles } = useVillesData();

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      const fetchedArticles = await getRecentArticles(3);
      setArticles(fetchedArticles);
      setLoading(false);
    };
    
    fetchArticles();
  }, []);

  const breadcrumbItems = [
    { name: "Accueil", url: "/" }
  ];

  const breadcrumbStructuredData = createBreadcrumbStructuredData(breadcrumbItems);

  // Structure de donnÃ©es pour l'organisation ProprioAdvisor
  const organizationStructuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "ProprioAdvisor",
    "url": "https://proprioadvisor.fr",
    "logo": "https://proprioadvisor.fr/favicon.svg",
    "description": "Premier comparateur de conciergeries Airbnb en France. Trouvez la meilleure conciergerie pour votre bien en location courte durÃ©e.",
    "foundingDate": "2024",
    "founder": {
      "@type": "Person",
      "name": "David Vauclin",
      "jobTitle": "Expert en location courte durÃ©e"
    },
    "areaServed": {
      "@type": "Country",
      "name": "France"
    },
    "serviceType": "Comparateur de conciergeries Airbnb",
    "sameAs": [
      "https://www.linkedin.com/company/proprioadvisor",
      "https://twitter.com/proprioadvisor",
      "https://www.facebook.com/proprioadvisor"
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Services ProprioAdvisor",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Comparateur de conciergeries",
            "description": "Comparaison gratuite des meilleures conciergeries Airbnb"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Simulateur de revenus Airbnb",
            "description": "Estimation gratuite de vos revenus potentiels"
          }
        }
      ]
    }
  };

  // Structure de donnÃ©es pour le site web
  const websiteStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "ProprioAdvisor",
    "url": "https://proprioadvisor.fr",
    "description": "Comparateur de conciergeries Airbnb en France le + complet. Trouvez la meilleure conciergerie pour maximiser vos revenus locatifs.",
    "inLanguage": "fr-FR",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://proprioadvisor.fr/conciergerie/{search_term_string}"
      },
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "ProprioAdvisor",
      "logo": "https://proprioadvisor.fr/favicon.svg"
    }
  };

  return (
    <>
      <Head>
        <title>ProprioAdvisor | Comparateur de conciergeries Airbnb le + complet</title>
        <meta name="description" content="ProprioAdvisor vous aide Ã  trouver la meilleure conciergerie pour votre bien en location courte durÃ©e. On compare localisation, services, tarifs en profondeur pour vous aider Ã  choisir." />
        <link rel="canonical" href="https://proprioadvisor.fr/" />
      </Head>
      
      <StructuredData data={organizationStructuredData} />
      <StructuredData data={websiteStructuredData} />
      <StructuredData data={breadcrumbStructuredData} />
      
      <div className="flex flex-col">
        <section aria-label="Section principale d'accueil">
          <HeroSection selectedVille={selectedVille} allVilles={allVilles} />
        </section>
        <section aria-label="FonctionnalitÃ©s de ProprioAdvisor">
          <FeaturesSection />
        </section>
        <section aria-label="Articles rÃ©cents du blog">
          <RecentArticlesSection articles={articles} loading={loading} />
        </section>
        <section aria-label="Appel Ã  l'action">
          <CTASection />
        </section>
        <section aria-label="Toutes les villes disponibles">
          <AllCitiesSection allVilles={allVilles} />
        </section>
      </div>
    </>
  );
};

export default Index;

