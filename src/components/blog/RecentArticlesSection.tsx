
import React from 'react';
import { Article } from '@/types';
import RecentArticleCard from './RecentArticleCard';

interface RecentArticlesSectionProps {
  articles: Article[];
}

const RecentArticlesSection: React.FC<RecentArticlesSectionProps> = ({ articles }) => {
  if (articles.length === 0) {
    return null;
  }

  return (
    <section className="mt-12" aria-labelledby="similar-articles-heading">
      <h2 id="similar-articles-heading" className="text-2xl font-bold mb-6">Articles similaires</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {articles.map(article => (
          <article key={article.id}>
            <RecentArticleCard article={article} />
          </article>
        ))}
      </div>
    </section>
  );
};

export default RecentArticlesSection;
