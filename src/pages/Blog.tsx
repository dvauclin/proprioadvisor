"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Head from "next/head";
import { getAllArticles } from "@/services/supabaseService";
import { Article } from "@/types";
import { Loader2 } from "lucide-react";
import StructuredData from "@/components/seo/StructuredData";
import { createBreadcrumbStructuredData } from "@/utils/structuredDataHelpers";
import Breadcrumbs from "@/components/ui-kit/breadcrumbs";

const Blog: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const fetchedArticles = await getAllArticles();
        setArticles(fetchedArticles);
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  // Vï¿½rification de sï¿½curitï¿½ pour articles et filteredArticles
  const safeArticles = Array.isArray(articles) ? articles : [];
  const filteredArticles = safeArticles.filter(article => 
    article.titre.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (article.contenu || '').toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredArticlesCount = filteredArticles.length;

  const breadcrumbItems = [{
    label: "Blog",
    href: "/blog"
  }];
  const breadcrumbStructuredData = createBreadcrumbStructuredData(
    breadcrumbItems.map(item => ({ name: item.label, url: item.href }))
  );

  return <div className="py-[32px]">
      <Head>
        <title>Blog | Proprioadvisor</title>
        <meta name="description" content="Dï¿½couvrez nos articles et conseils sur la gestion locative courte durï¿½e" />
        <link rel="canonical" href="https://proprioadvisor.fr/blog" />
      </Head>
      
      <StructuredData data={breadcrumbStructuredData} />
      
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Breadcrumbs items={breadcrumbItems} className="mb-6" />
          
          <header className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Blog</h1>
            <p className="text-gray-600 text-lg">
              Dï¿½couvrez nos articles et conseils sur la gestion locative courte durï¿½e
            </p>
          </header>
          
          <section className="mb-8" aria-labelledby="search-heading">
            <h2 id="search-heading" className="sr-only">Rechercher des articles</h2>
            <div className="relative">
              <input type="text" placeholder="Rechercher un article..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} aria-label="Rechercher un article dans le blog" className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-md focus:ring-brand-chartreuse focus:border-brand-chartreuse focus:outline-none" />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </div>
            </div>
          </section>
          
          {loading ? <div className="flex justify-center py-12" role="status" aria-label="Chargement des articles">
              <Loader2 className="h-8 w-8 animate-spin text-brand-chartreuse" />
            </div> : filteredArticlesCount > 0 ? <section className="space-y-8" aria-labelledby="articles-list-heading">
              <h2 id="articles-list-heading" className="sr-only">Liste des articles</h2>
              {filteredArticles.map(article => <article key={article.id}>
                  <Link href={`/${article.slug}`} className="block bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow group focus:outline-none focus:ring-2 focus:ring-brand-chartreuse focus:ring-offset-2" aria-label={`Lire l'article : ${article.titre}`}>
                    <div className="md:flex">
                      <div className="md:w-1/3 relative">
                        {article.image ? <img src={article.image} alt={`Image d'illustration pour l'article : ${article.titre}`} className="w-full h-48 md:h-full object-cover" onError={e => {
                    console.error("Erreur de chargement d'image blog:", article.image);
                    e.currentTarget.src = "/placeholder.svg";
                    e.currentTarget.alt = "Image par dï¿½faut - Article sans illustration";
                    e.currentTarget.classList.add("bg-gray-100");
                  }} loading="lazy" /> : <div className="w-full h-48 md:h-full bg-gray-100 flex items-center justify-center" role="img" aria-label="Aucune image disponible pour cet article">
                            <span className="text-gray-400">Pas d'image</span>
                          </div>}
                        <div className="overlay-gradient" aria-hidden="true"></div>
                      </div>
                      <div className="p-6 md:w-2/3">
                        <h2 className="text-2xl font-semibold mb-3 group-hover:text-brand-chartreuse-dark transition-colors">
                          {article.titre}
                        </h2>
                        <p className="text-gray-600 mb-4">
                          {article.excerpt}
                        </p>
                        <div className="flex items-center text-sm text-gray-500">
                          <time className="mr-2" dateTime={article.datePublication}>
                            {article.datePublication ? new Date(article.datePublication).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : 'Date inconnue'}
                          </time>
                          <span className="inline-block px-2 py-1 bg-gray-100 rounded-full">
                            Article
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </article>)}
            </section> : <section className="text-center py-12 bg-gray-50 rounded-lg" role="status">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 13.5V15m-6 4h12a2 2 0 002-2v-12a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="text-xl font-medium mb-2">Aucun rï¿½sultat trouvï¿½</h3>
              <p className="text-gray-600">
                Aucun article ne correspond ï¿½ votre recherche. Essayez avec d'autres termes.
              </p>
            </section>}
        </div>
      </div>
    </div>;
};

export default Blog;


