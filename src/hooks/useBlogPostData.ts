
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getArticleBySlug, getRecentArticles } from '@/services/supabaseService';
import { Article } from '@/types';
import { getValidImageUrl } from '@/utils/articleUtils';

export const useBlogPostData = (slug: string | undefined) => {
  const router = useRouter();
  const [article, setArticle] = useState<Article | null>(null);
  const [recentArticles, setRecentArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if (slug) {
        try {
          const fetchedArticle = await getArticleBySlug(slug);
          
          if (fetchedArticle && fetchedArticle.image) {
            fetchedArticle.image = getValidImageUrl(fetchedArticle.image);
          }
          
          setArticle(fetchedArticle);
          
          if (fetchedArticle) {
            const fetchedRecentArticles = await getRecentArticles(3);
            fetchedRecentArticles.forEach(article => {
              if (article.image) {
                article.image = getValidImageUrl(article.image);
              }
            });
            setRecentArticles(fetchedRecentArticles.filter(a => a.slug !== slug));
          }
        } catch (error) {
          console.error("Error fetching article data:", error);
        }
      }
      setLoading(false);
    };
    
    fetchData();
  }, [slug]);

  useEffect(() => {
    if (!loading && !article) {
      router.push("/blog");
    }
  }, [article, router, loading]);

  return { article, recentArticles, loading };
};

