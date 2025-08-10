"use client";

import React, { useState, useEffect } from 'react';
import { useArticleRealtime } from '@/hooks/useArticleRealtime';
import { Article } from '@/types';
import { Loader2, Wifi, CheckCircle } from 'lucide-react';
import ArticleContent from './ArticleContent';
import ArticleHeader from './ArticleHeader';

interface RealtimeArticleWrapperProps {
  initialArticle: Article;
  relatedArticles?: Article[];
  slug: string;
}

const RealtimeArticleWrapper: React.FC<RealtimeArticleWrapperProps> = ({ 
  initialArticle, 
  relatedArticles = [], 
  slug 
}) => {
  const { article, loading, error } = useArticleRealtime(slug);
  const [showUpdateIndicator, setShowUpdateIndicator] = useState(false);

  // Utiliser l'article en temps réel s'il est disponible, sinon l'article initial
  const currentArticle = article || initialArticle;

  // Afficher l'indicateur de mise à jour quand l'article change
  useEffect(() => {
    if (article && article !== initialArticle) {
      setShowUpdateIndicator(true);
      setTimeout(() => setShowUpdateIndicator(false), 3000);
    }
  }, [article, initialArticle]);

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
        >
          Recharger la page
        </button>
      </div>
    );
  }

  if (loading && !article) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-brand-chartreuse" />
      </div>
    );
  }

  return (
    <div>
      {/* Indicateur de mise à jour en temps réel */}
      {showUpdateIndicator && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg shadow-lg">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <span className="text-sm text-green-700 font-medium">
            Article mis à jour en temps réel
          </span>
        </div>
      )}

      {/* Indicateur de connexion temps réel */}
      <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 p-2 bg-blue-50 border border-blue-200 rounded-lg shadow-lg">
        <Wifi className="h-3 w-3 text-blue-600" />
        <span className="text-xs text-blue-700">
          Temps réel actif
        </span>
      </div>

      {/* Article Header */}
      <header className="mb-12">
        <ArticleHeader article={currentArticle} />
      </header>

      {/* Article Image */}
      {currentArticle.image && (
        <div className="mb-12">
          <div className="relative overflow-hidden rounded-2xl shadow-lg">
            <img 
              src={currentArticle.image} 
              alt={`Image d'illustration pour l'article : ${currentArticle.titre}`}
              className="w-full h-64 md:h-96 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>
        </div>
      )}

      {/* Article Content */}
      <article className="mb-16">
        <ArticleContent 
          article={currentArticle} 
          relatedArticles={relatedArticles} 
        />
      </article>
    </div>
  );
};

export default RealtimeArticleWrapper;
