import type { Metadata } from 'next'
import Blog from '@/pages/Blog'

export const metadata: Metadata = {
  title: 'Blog | Proprioadvisor',
  description: 'Découvrez nos articles sur la conciergerie Airbnb et la location courte durée',
  keywords: ['blog', 'conciergerie', 'airbnb', 'articles', 'location courte durée'],
  openGraph: {
    title: 'Blog | Proprioadvisor',
    description: 'Découvrez nos articles sur la conciergerie Airbnb et la location courte durée',
    url: 'https://proprioadvisor.fr/blog',
  },
  alternates: {
    canonical: '/blog',
  },
}

// Revalidation forcée pour le blog (temporaire pour debug)
export const revalidate = 0;

export default function BlogPage() {
  return <Blog />
} 

