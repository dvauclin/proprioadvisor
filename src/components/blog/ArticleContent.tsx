"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Article } from '@/types';
import { BookOpen, ArrowRight } from 'lucide-react';

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
    const headingRegex = /<h2[^>]*id="([^"]*)"[^>]*>(.*?)<\/h2>/g; // placeholder
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
      {/* Sommaire - uniquement H2 */}
      {headings.length > 0 && (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-8 mb-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-brand-chartreuse rounded-full flex items-center justify-center">
              <BookOpen className="h-4 w-4 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Sommaire</h2>
          </div>
          <nav>
            <ul className="space-y-3">
              {headings.map((heading, index) => (
                <li key={index}>
                  <a 
                    href={`#${heading.id}`}
                    onClick={(e) => handleAnchorClick(e, heading.id)}
                    className="flex items-center gap-3 text-gray-700 hover:text-brand-chartreuse transition-colors group"
                  >
                    <span className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium group-hover:bg-brand-chartreuse group-hover:text-white transition-colors">
                      {index + 1}
                    </span>
                    <span className="font-medium">{heading.text}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}

      {/* Contenu principal avec formatage amélioré */}
      <div 
        className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-headings:font-bold prose-p:text-gray-700 prose-p:leading-relaxed prose-li:text-gray-700 prose-strong:text-gray-900"
        style={{
          '--tw-prose-headings': '#111827',
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
        <div className="mt-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 bg-brand-chartreuse rounded-full flex items-center justify-center">
              <BookOpen className="h-4 w-4 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Questions fréquentes</h2>
          </div>
          <div className="space-y-6">
            {extendedArticle.question_1 && extendedArticle.reponse_1 && (
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold mb-3 text-gray-900">{extendedArticle.question_1}</h3>
                <div 
                  className="prose prose-gray max-w-none"
                  dangerouslySetInnerHTML={{ __html: extendedArticle.reponse_1 }}
                />
              </div>
            )}
            {extendedArticle.question_2 && extendedArticle.reponse_2 && (
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold mb-3 text-gray-900">{extendedArticle.question_2}</h3>
                <div 
                  className="prose prose-gray max-w-none"
                  dangerouslySetInnerHTML={{ __html: extendedArticle.reponse_2 }}
                />
              </div>
            )}
            {extendedArticle.question_3 && extendedArticle.reponse_3 && (
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold mb-3 text-gray-900">{extendedArticle.question_3}</h3>
                <div 
                  className="prose prose-gray max-w-none"
                  dangerouslySetInnerHTML={{ __html: extendedArticle.reponse_3 }}
                />
              </div>
            )}
            {extendedArticle.question_4 && extendedArticle.reponse_4 && (
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold mb-3 text-gray-900">{extendedArticle.question_4}</h3>
                <div 
                  className="prose prose-gray max-w-none"
                  dangerouslySetInnerHTML={{ __html: extendedArticle.reponse_4 }}
                />
              </div>
            )}
            {extendedArticle.question_5 && extendedArticle.reponse_5 && (
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold mb-3 text-gray-900">{extendedArticle.question_5}</h3>
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
        <div className="mt-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 bg-brand-chartreuse rounded-full flex items-center justify-center">
              <BookOpen className="h-4 w-4 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Articles similaires</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedArticles.slice(0, 3).map((relatedArticle) => (
              <Link 
                key={relatedArticle.id}
                href={`/${relatedArticle.slug}`}
                className="block bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-200 hover:scale-[1.02] group"
              >
                {relatedArticle.image && (
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={relatedArticle.image} 
                      alt={relatedArticle.titre}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="font-semibold mb-2 group-hover:text-brand-chartreuse transition-colors line-clamp-2">
                    {relatedArticle.titre}
                  </h3>
                  {relatedArticle.excerpt && (
                    <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                      {relatedArticle.excerpt}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {new Date(relatedArticle.createdAt || '').toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                    <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-brand-chartreuse group-hover:translate-x-1 transition-all" />
                  </div>
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

