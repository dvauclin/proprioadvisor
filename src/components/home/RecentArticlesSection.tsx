"use client";

import React from "react";
import Link from "next/link";
import { Article } from "@/types";
import { Button } from "@/components/ui-kit/button";

interface RecentArticlesSectionProps {
  articles: Article[];
  loading: boolean;
}

const RecentArticlesSection: React.FC<RecentArticlesSectionProps> = ({ articles, loading }) => {
  return (
    <section className="py-20" aria-labelledby="recent-articles-heading">
      <div className="container mx-auto px-4">
        <header className="text-center mb-16">
          <h2 id="recent-articles-heading" className="text-3xl font-bold mb-4">Nos derniers articles</h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Découvrez nos conseils et actualités sur la location courte durée et la gestion de conciergerie
          </p>
        </header>
        
        {loading ? (
          <div className="flex justify-center">
            <div className="spinner"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {articles.map(article => (
                <article key={article.id}>
                  <Link 
                    href={`/${article.slug}`} 
                    className="block group bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
                  >
                    <div className="relative h-48">
                      {article.image ? (
                        <img 
                          src={article.image} 
                          alt={article.titre} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          onError={(e) => {
                            console.error("Erreur de chargement d'image:", article.image);
                            e.currentTarget.src = "/placeholder.svg";
                            e.currentTarget.classList.add("bg-gray-100");
                          }}
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <span className="text-gray-400">Pas d'image</span>
                        </div>
                      )}
                      <div className="overlay-gradient"></div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2 group-hover:text-brand-chartreuse-dark transition-colors duration-200">
                        {article.titre}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center text-sm text-gray-500">
                        <span>{new Date(article.datePublication || '').toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
            
            <div className="text-center mt-10">
              <Button variant="outline" asChild>
                <Link href="/blog">
                  Voir tous les articles
                </Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default RecentArticlesSection;


