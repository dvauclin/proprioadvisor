import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAllArticles, getArticleBySlug } from '@/services/supabaseService'
import ArticlePageLayout from '@/components/blog/ArticlePageLayout'

export async function generateMetadata(): Promise<Metadata> {
  const article = await getArticleBySlug('trouver-des-clients-conciergerie-airbnb');
  
  if (!article) {
    return {
      title: 'Article non trouvé | ProprioAdvisor',
      description: 'Cet article n\'existe pas ou a été supprimé.',
    };
  }

  return {
    title: `${article.titre} | ProprioAdvisor`,
    description: article.excerpt || article.titre,
    keywords: ['conciergerie airbnb', 'trouver clients', 'développement commercial', 'marketing conciergerie', 'clients propriétaires'],
    openGraph: {
      title: article.titre,
      description: article.excerpt || article.titre,
      url: 'https://proprioadvisor.fr/trouver-des-clients-conciergerie-airbnb',
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
      canonical: '/trouver-des-clients-conciergerie-airbnb',
    },
  };
}

export default async function TrouverClientsPage() {
  const article = await getArticleBySlug('trouver-des-clients-conciergerie-airbnb');
  
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
      href: "/trouver-des-clients-conciergerie-airbnb"
    }
  ];

  return (
    <ArticlePageLayout
      article={article}
      relatedArticles={relatedArticles}
      slug="trouver-des-clients-conciergerie-airbnb"
      breadcrumbItems={breadcrumbItems}
    />
  );
} 

