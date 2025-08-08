import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAllArticles, getArticleBySlug } from '@/services/supabaseService'
import ArticleHeader from '@/components/blog/ArticleHeader'

import Breadcrumbs from '@/components/ui-kit/breadcrumbs'
import ClientArticleWrapper from '@/components/blog/ClientArticleWrapper'

interface ArticlePageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const article = await getArticleBySlug(params.slug);
  
  if (!article) {
    return {
      title: 'Article non trouvé | ProprioAdvisor',
      description: 'Cet article n\'existe pas ou a été supprimé.',
    };
  }

  return {
    title: `${article.titre} | ProprioAdvisor`,
    description: article.excerpt || article.titre,
    keywords: ['conciergerie', 'airbnb', 'location courte durée', 'blog', 'article'],
    openGraph: {
      title: article.titre,
      description: article.excerpt || article.titre,
      url: `https://proprioadvisor.fr/${params.slug}`,
      type: 'article',
      images: article.image ? [article.image] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.titre,
      description: article.excerpt || article.titre,
      images: article.image ? [article.image] : [],
    },
    alternates: {
      canonical: `/${params.slug}`,
    },
  };
}

export async function generateStaticParams() {
  const articles = await getAllArticles();
  
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const article = await getArticleBySlug(params.slug);
  
  if (!article) {
    notFound();
  }

  // Récupérer les articles similaires (exclure l'article actuel)
  const allArticles = await getAllArticles();
  const relatedArticles = allArticles
    .filter(a => a.id !== article.id)
    .slice(0, 3);

  const breadcrumbItems = [
    {
      label: "Blog",
      href: "/blog"
    },
    {
      label: article.titre,
      href: `/${params.slug}`
    }
  ];

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <Breadcrumbs items={breadcrumbItems} className="mb-8" />

          {/* Article Header */}
          <header className="mb-8">
            <ArticleHeader article={article} />
            {article.excerpt && (
              <p className="text-xl text-gray-600 mb-6">{article.excerpt}</p>
            )}
          </header>

          {/* Article Image */}
          {article.image && (
            <div className="mb-8">
              <img 
                src={article.image} 
                alt={`Image d'illustration pour l'article : ${article.titre}`}
                className="w-full h-64 md:h-96 object-cover rounded-lg"
              />
            </div>
          )}

          {/* Article Content */}
          <article className="mb-12">
            <ClientArticleWrapper article={article} relatedArticles={relatedArticles} />
          </article>
        </div>
      </div>
    </div>
  );
} 