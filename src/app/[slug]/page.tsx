import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAllArticles, getArticleBySlug } from '@/services/supabaseService'
import ArticlePageLayout from '@/components/blog/ArticlePageLayout'

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

// Revalidation toutes les 60 secondes pour les articles
export const revalidate = 60;

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
    <ArticlePageLayout
      article={article}
      relatedArticles={relatedArticles}
      slug={params.slug}
      breadcrumbItems={breadcrumbItems}
    />
  );
} 