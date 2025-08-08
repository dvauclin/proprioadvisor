"use client";

import React, { useEffect, useState } from 'react';
import { Article } from '@/types';
import ArticleContent from './ArticleContent';

interface ClientArticleWrapperProps {
  article: Article;
  relatedArticles?: Article[];
}

const ClientArticleWrapper: React.FC<ClientArticleWrapperProps> = ({ 
  article, 
  relatedArticles = [] 
}) => {
  const [processedContent, setProcessedContent] = useState<string>('');

  // Fonction pour créer un ID à partir du texte
  const slugify = (text: string): string => {
    return text.toString().toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '').replace(/--+/g, '-');
  };

  // Traiter le contenu HTML pour ajouter les IDs aux headings
  useEffect(() => {
    if (article.contenu) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(article.contenu, 'text/html');
      
      // Traiter tous les headings (h2, h3, h4)
      doc.querySelectorAll('h2, h3, h4').forEach(heading => {
        const text = heading.textContent || '';
        const id = slugify(text);
        heading.setAttribute('id', id);
      });
      
      setProcessedContent(doc.body.innerHTML);
    }
  }, [article.contenu]);

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
    <ArticleContent 
      article={article} 
      relatedArticles={relatedArticles} 
      processedContent={processedContent}
    />
  );
};

export default ClientArticleWrapper; 

