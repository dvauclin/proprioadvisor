
import React from 'react';
import { Article } from '@/types';
import { Calendar, Clock, User } from 'lucide-react';

interface ArticleHeaderProps {
  article: Article;
}

const ArticleHeader: React.FC<ArticleHeaderProps> = ({ article }) => {
  // Comparer les dates sans l'heure
  const createdDate = new Date(article.createdAt || '').toDateString();
  const modifiedDate = new Date(article.datePublication || '').toDateString();
  const isModified = createdDate !== modifiedDate;

  const formatReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return readingTime;
  };

  const readingTime = formatReadingTime(article.contenu || '');
  const extendedArticle = article as any;

  return (
    <header className="mb-8">
      {/* Métadonnées */}
      <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span>
            {isModified ? (
              <>Modifié le {new Date(article.datePublication || '').toLocaleDateString('fr-FR', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</>
            ) : (
              <>Publié le {new Date(article.createdAt || '').toLocaleDateString('fr-FR', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</>
            )}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span>{readingTime} min de lecture</span>
        </div>
        
        <div className="flex items-center gap-2">
          <User className="h-4 w-4" />
          <span>ProprioAdvisor</span>
        </div>
      </div>

      {/* Titre principal */}
      <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-gray-900">
        {article.titre}
      </h1>

      {/* Résumé / TL;DR sous le titre */}
      {extendedArticle?.resume ? (
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-6 mb-8 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 bg-brand-chartreuse rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">R</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Résumé de l'article</h3>
          </div>
          <div
            className="prose prose-gray max-w-none text-gray-800"
            dangerouslySetInnerHTML={{ __html: extendedArticle.resume }}
          />
        </div>
      ) : (
        article.excerpt && (
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-6 mb-8 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 bg-brand-chartreuse rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">R</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Résumé de l'article</h3>
            </div>
            <p className="text-lg text-gray-700 leading-relaxed font-medium">
              {article.excerpt}
            </p>
          </div>
        )
      )}
    </header>
  );
};

export default ArticleHeader;

