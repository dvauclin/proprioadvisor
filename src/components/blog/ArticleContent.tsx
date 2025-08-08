"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Article } from '@/types';

interface ArticleContentProps {
  article: Article;
  relatedArticles?: Article[];
  processedContent?: string; // Contenu traité avec les IDs
}

const ArticleContent: React.FC<ArticleContentProps> = ({ 
  article, 
  relatedArticles = [], 
  processedContent 
}) => {
  // Fonction pour extraire uniquement les titres H2 du contenu pour le sommaire
  const extractH2Headings = (content: string) => {
    const headingRegex = /<h2[^>]*id="([^"]*)"[^>]*>(.*?)<\/h2>/g;
    const headings: { text: string; id: string }[] = [];
    let match;

    while ((match = headingRegex.exec(content)) !== null) {
      const id = match[1];
      const text = match[2].replace(/<[^>]*>/g, ''); // Enlever les balises HTML
      headings.push({ text, id });
    }

    return headings;
  };

  const headings = extractH2Headings(processedContent || article.contenu);
  const extendedArticle = article as any;

  // Fonction pour gérer le scroll vers les ancres
  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    
    const element = document.getElementById(id);
    if (element) {
      // Attendre un peu pour s'assurer que le DOM est stable
      setTimeout(() => {
        const header = document.querySelector('header');
        const headerHeight = header ? header.getBoundingClientRect().height : 80; // Valeur par défaut plus élevée
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - headerHeight - 20; // 20px de marge supplémentaire
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        // Mettre à jour l'URL sans recharger la page
        const url = new URL(window.location.href);
        url.hash = id;
        window.history.pushState({}, '', url.toString());
      }, 100);
    }
  };

  // Gérer le scroll vers l'ancre au chargement de la page
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash && processedContent) {
      const hash = window.location.hash.substring(1);
      const element = document.getElementById(hash);
      
      if (element) {
        // Attendre que le contenu soit chargé et que le DOM soit stable
        setTimeout(() => {
          const header = document.querySelector('header');
          const headerHeight = header ? header.getBoundingClientRect().height : 80; // Valeur par défaut plus élevée
          const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
          const offsetPosition = elementPosition - headerHeight - 20; // 20px de marge supplémentaire
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }, 200); // Délai plus long pour s'assurer que tout est chargé
      }
    }
  }, [processedContent]);

  return (
    <div className="max-w-none">
      {/* TL;DR */}
      {extendedArticle.resume && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-3 text-blue-900">TL;DR</h2>
          <div 
            className="prose prose-blue max-w-none"
            dangerouslySetInnerHTML={{ __html: extendedArticle.resume }}
          />
        </div>
      )}

      {/* Sommaire - uniquement H2 */}
      {headings.length > 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Sommaire</h2>
          <nav>
            <ul className="space-y-2">
              {headings.map((heading, index) => (
                <li key={index}>
                  <a 
                    href={`#${heading.id}`}
                    onClick={(e) => handleAnchorClick(e, heading.id)}
                    className="text-gray-700 hover:text-brand-chartreuse transition-colors"
                  >
                    {heading.text}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}

      {/* Contenu principal avec formatage amélioré */}
      <div 
        className="prose prose-lg max-w-none"
        style={{
          '--tw-prose-headings': '#374151',
          '--tw-prose-links': '#10b981',
          '--tw-prose-bold': '#111827',
          '--tw-prose-counters': '#6b7280',
          '--tw-prose-bullets': '#d1d5db',
          '--tw-prose-hr': '#e5e7eb',
          '--tw-prose-quotes': '#6b7280',
          '--tw-prose-quote-borders': '#e5e7eb',
          '--tw-prose-captions': '#6b7280',
          '--tw-prose-code': '#111827',
          '--tw-prose-pre-code': '#e5e7eb',
          '--tw-prose-pre-bg': '#1f2937',
          '--tw-prose-th-borders': '#d1d5db',
          '--tw-prose-td-borders': '#e5e7eb',
        } as React.CSSProperties}
        dangerouslySetInnerHTML={{ __html: processedContent || article.contenu }}
      />

      {/* FAQ */}
      {(extendedArticle.question_1 || extendedArticle.question_2 || extendedArticle.question_3 || extendedArticle.question_4 || extendedArticle.question_5) && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Questions fréquentes</h2>
          <div className="space-y-6">
            {extendedArticle.question_1 && extendedArticle.reponse_1 && (
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3">{extendedArticle.question_1}</h3>
                <div 
                  className="prose prose-gray max-w-none"
                  dangerouslySetInnerHTML={{ __html: extendedArticle.reponse_1 }}
                />
              </div>
            )}
            {extendedArticle.question_2 && extendedArticle.reponse_2 && (
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3">{extendedArticle.question_2}</h3>
                <div 
                  className="prose prose-gray max-w-none"
                  dangerouslySetInnerHTML={{ __html: extendedArticle.reponse_2 }}
                />
              </div>
            )}
            {extendedArticle.question_3 && extendedArticle.reponse_3 && (
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3">{extendedArticle.question_3}</h3>
                <div 
                  className="prose prose-gray max-w-none"
                  dangerouslySetInnerHTML={{ __html: extendedArticle.reponse_3 }}
                />
              </div>
            )}
            {extendedArticle.question_4 && extendedArticle.reponse_4 && (
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3">{extendedArticle.question_4}</h3>
                <div 
                  className="prose prose-gray max-w-none"
                  dangerouslySetInnerHTML={{ __html: extendedArticle.reponse_4 }}
                />
              </div>
            )}
            {extendedArticle.question_5 && extendedArticle.reponse_5 && (
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3">{extendedArticle.question_5}</h3>
                <div 
                  className="prose prose-gray max-w-none"
                  dangerouslySetInnerHTML={{ __html: extendedArticle.reponse_5 }}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Articles similaires */}
      {relatedArticles.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Articles similaires</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedArticles.slice(0, 3).map((relatedArticle) => (
              <Link 
                key={relatedArticle.id}
                href={`/${relatedArticle.slug}`}
                className="block bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow group"
              >
                {relatedArticle.image && (
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={relatedArticle.image} 
                      alt={relatedArticle.titre}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-semibold mb-2 group-hover:text-brand-chartreuse transition-colors">
                    {relatedArticle.titre}
                  </h3>
                  {relatedArticle.excerpt && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {relatedArticle.excerpt}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticleContent;

