import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAllArticles, getArticleBySlug } from '@/services/supabaseService'
import ArticleHeader from '@/components/blog/ArticleHeader'
import ArticleContentFrame from '@/components/blog/ArticleContentFrame'
import Breadcrumbs from '@/components/ui-kit/breadcrumbs'
import ClientArticleWrapper from '@/components/blog/ClientArticleWrapper'
import StructuredData from '@/components/seo/StructuredData'
import { 
  blogPostingJsonLd, 
  faqJsonLd, 
  articleWebPageJsonLd, 
  breadcrumbsJsonLd 
} from '@/lib/structured-data-models'

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

  // Calculer le temps de lecture
  const formatReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  const readingTime = formatReadingTime(article.contenu || '');
  const description = article.excerpt || article.resume || article.titre;
  const keywords = [
    'conciergerie',
    'airbnb', 
    'location courte durée',
    'gestion locative',
    'propriétaire',
    'blog',
    'article',
    'conseils',
    'rentabilité'
  ];

  // Ajouter des mots-clés spécifiques si disponibles
  if ((article as any).keywords) {
    const articleKeywords = Array.isArray((article as any).keywords) 
      ? (article as any).keywords 
      : (article as any).keywords.split(',').map((k: string) => k.trim());
    keywords.push(...articleKeywords);
  }

  return {
    title: `${article.titre} | ProprioAdvisor`,
    description: description,
    keywords: keywords,
    authors: [{ name: 'David Vauclin' }],
    category: 'Conciergerie Airbnb',
    openGraph: {
      title: article.titre,
      description: description,
      url: `https://proprioadvisor.fr/${params.slug}`,
      type: 'article',
      images: article.image ? [article.image] : [],
      publishedTime: article.date_creation || article.createdAt || article.datePublication,
      modifiedTime: article.date_modification || article.updatedAt || article.datePublication,
      authors: ['David Vauclin'],
      section: 'Conciergerie Airbnb',
      tags: keywords,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.titre,
      description: description,
      images: article.image ? [article.image] : [],
      creator: '@proprioadvisor',
    },
    alternates: {
      canonical: `/${params.slug}`,
    },
    other: {
      'article:reading_time': `${readingTime} min`,
      'article:author': 'David Vauclin',
      'article:section': 'Conciergerie Airbnb',
    },
  };
}

// Commenté temporairement pour éviter la génération statique
// export async function generateStaticParams() {
//   const articles = await getAllArticles();
//   
//   return articles.map((article) => ({
//     slug: article.slug,
//   }));
// }

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

  // Calculer le temps de lecture
  const formatReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  const readingTime = formatReadingTime(article.contenu || '');

  // Générer les données structurées
  const structuredData = [
    // Breadcrumbs
    breadcrumbsJsonLd(breadcrumbItems.map(item => ({ name: item.label, url: item.href }))),
    
    // Page web de l'article
    articleWebPageJsonLd(article),
    
    // Article BlogPosting
    blogPostingJsonLd(article, { 
      imageUrl: article.image, 
      readingTime: readingTime 
    }),
    
    // FAQ si disponible
    faqJsonLd(article)
  ].filter(Boolean); // Enlever les valeurs null/undefined

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Données structurées */}
      <StructuredData data={structuredData} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <Breadcrumbs items={breadcrumbItems} className="mb-6" />

          {/* Article Header */}
          <header className="mb-12">
            <ArticleHeader article={article} />
          </header>

          {/* Article Image */}
          {article.image && (
            <div className="mb-12">
              <div className="relative overflow-hidden rounded-2xl shadow-lg">
                <img 
                  src={article.image} 
                  alt={`Image d'illustration pour l'article : ${article.titre}`}
                  className="w-full h-64 md:h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            </div>
          )}

          {/* Article Content */}
          <article className="mb-16">
            <ArticleContentFrame>
              <ClientArticleWrapper article={article} relatedArticles={relatedArticles} />
            </ArticleContentFrame>
          </article>
        </div>
      </div>
    </div>
  );
} 