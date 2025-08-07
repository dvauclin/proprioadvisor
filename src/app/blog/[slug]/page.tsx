import type { Metadata } from 'next'
import BlogPost from '@/pages/BlogPost'

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  // Ici vous pouvez récupérer les métadonnées de l'article depuis votre base de données
  // Pour l'instant, on utilise des métadonnées par défaut
  return {
    title: `Article | Proprioadvisor`,
    description: 'Découvrez cet article sur la conciergerie Airbnb',
    keywords: ['blog', 'conciergerie', 'airbnb', 'article'],
    openGraph: {
      title: `Article | Proprioadvisor`,
      description: 'Découvrez cet article sur la conciergerie Airbnb',
      url: `https://proprioadvisor.com/${params.slug}`,
    },
    alternates: {
      canonical: `/${params.slug}`,
    },
  }
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  return <BlogPost slug={params.slug} />
} 