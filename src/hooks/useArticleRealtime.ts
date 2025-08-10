"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Article } from '@/types';

export const useArticleRealtime = (slug?: string) => {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setArticle(null);
      setLoading(false);
      return;
    }

    // Fonction pour récupérer l'article
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('articles')
          .select('*, resume, question_1, reponse_1, question_2, reponse_2, question_3, reponse_3, question_4, reponse_4, question_5, reponse_5')
          .eq('slug', slug)
          .single();

        if (error) {
          console.error("Error fetching article:", error);
          setError(error.message);
          setArticle(null);
        } else {
          const transformedArticle: Article = {
            id: data.id,
            titre: data.titre,
            slug: data.slug,
            excerpt: data.excerpt,
            contenu: data.contenu,
            image: data.image,
            datePublication: data.date_modification,
            createdAt: data.created_at,
            date_modification: data.date_modification,
            date_creation: data.created_at,
            resume: data.resume,
            question_1: data.question_1,
            reponse_1: data.reponse_1,
            question_2: data.question_2,
            reponse_2: data.reponse_2,
            question_3: data.question_3,
            reponse_3: data.reponse_3,
            question_4: data.question_4,
            reponse_4: data.reponse_4,
            question_5: data.question_5,
            reponse_5: data.reponse_5
          } as any;
          
          setArticle(transformedArticle);
          setError(null);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        setError("Une erreur inattendue s'est produite");
        setArticle(null);
      } finally {
        setLoading(false);
      }
    };

    // Récupérer l'article initial
    fetchArticle();

    // Configurer la subscription pour les changements en temps réel
    const subscription = supabase
      .channel(`article-${slug}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'articles',
          filter: `slug=eq.${slug}`
        },
        (payload) => {
          console.log('Article change detected:', payload);
          
          if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
            const data = payload.new;
            const transformedArticle: Article = {
              id: data.id,
              titre: data.titre,
              slug: data.slug,
              excerpt: data.excerpt,
              contenu: data.contenu,
              image: data.image,
              datePublication: data.date_modification,
              createdAt: data.created_at,
              date_modification: data.date_modification,
              date_creation: data.created_at,
              resume: data.resume,
              question_1: data.question_1,
              reponse_1: data.reponse_1,
              question_2: data.question_2,
              reponse_2: data.reponse_2,
              question_3: data.question_3,
              reponse_3: data.reponse_3,
              question_4: data.question_4,
              reponse_4: data.reponse_4,
              question_5: data.question_5,
              reponse_5: data.reponse_5
            } as any;
            
            setArticle(transformedArticle);
            setError(null);
          } else if (payload.eventType === 'DELETE') {
            setArticle(null);
            setError("Article supprimé");
          }
        }
      )
      .subscribe();

    // Nettoyer la subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [slug]);

  return { article, loading, error };
};
