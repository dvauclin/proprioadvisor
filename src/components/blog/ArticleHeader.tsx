
import React from 'react';
import { Article } from '@/types';

interface ArticleHeaderProps {
  article: Article;
}

const ArticleHeader: React.FC<ArticleHeaderProps> = ({ article }) => {
  // Comparer les dates sans l'heure
  const createdDate = new Date(article.createdAt || '').toDateString();
  const modifiedDate = new Date(article.datePublication || '').toDateString();
  const isModified = createdDate !== modifiedDate;

  return (
    <>
      <div className="mb-6 text-sm text-gray-500">
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
      </div>
      <h1 className="text-3xl md:text-4xl font-bold mb-6">{article.titre}</h1>
    </>
  );
};

export default ArticleHeader;
