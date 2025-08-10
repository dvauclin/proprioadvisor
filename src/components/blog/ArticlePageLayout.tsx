import React from 'react';
import { Article } from '@/types';
import Breadcrumbs from '@/components/ui-kit/breadcrumbs';
import ArticleContentFrame from '@/components/blog/ArticleContentFrame';
import RealtimeArticleWrapper from '@/components/blog/RealtimeArticleWrapper';

interface ArticlePageLayoutProps {
  article: Article;
  relatedArticles?: Article[];
  slug: string;
  breadcrumbItems: Array<{
    label: string;
    href: string;
  }>;
}

const ArticlePageLayout: React.FC<ArticlePageLayoutProps> = ({
  article,
  relatedArticles = [],
  slug,
  breadcrumbItems
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <Breadcrumbs items={breadcrumbItems} className="mb-6" />

          {/* Article Content */}
          <article className="mb-16">
            <ArticleContentFrame>
              <RealtimeArticleWrapper 
                initialArticle={article} 
                relatedArticles={relatedArticles} 
                slug={slug}
              />
            </ArticleContentFrame>
          </article>
        </div>
      </div>
    </div>
  );
};

export default ArticlePageLayout;
