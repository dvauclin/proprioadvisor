"use client";

import React, { useEffect, useState } from "react";
import Head from "next/head";
import { getRecentArticles } from "@/services/supabaseService";
import { Article } from "@/types";
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import RecentArticlesSection from "@/components/home/RecentArticlesSection";
import CTASection from "@/components/home/CTASection";
import AllCitiesSection from "@/components/home/AllCitiesSection";
import { useVillesData } from "@/hooks/useVillesData";
import StructuredData from "@/components/seo/StructuredData";
import { breadcrumbsJsonLd } from "@/lib/structured-data-models";

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
  const breadcrumbStructuredData = breadcrumbsJsonLd(breadcrumbItems);

  return (
    <>
      <Head>
        <title>ProprioAdvisor | Comparateur de conciergeries Airbnb le + complet</title>
        <meta name="description" content="ProprioAdvisor vous aide à trouver la meilleure conciergerie pour votre bien en location courte durée. On compare localisation, services, tarifs en profondeur pour vous aider à choisir." />
        <link rel="canonical" href="https://proprioadvisor.fr/" />
      </Head>
      
      <StructuredData data={breadcrumbStructuredData} />
      
      <div className="flex flex-col">
        <section aria-label="Section principale d'accueil">
          <HeroSection selectedVille={selectedVille} allVilles={allVilles} />
        </section>
        <section aria-label="Fonctionnalités de ProprioAdvisor">
          <FeaturesSection />
        </section>
        <section aria-label="Articles récents du blog">
          <RecentArticlesSection articles={articles} loading={loading} />
        </section>
        <section aria-label="Appel à l'action">
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

