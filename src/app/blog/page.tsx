import type { Metadata } from 'next'
import Blog from '@/pages/Blog'

export const metadata: Metadata = {
  title: 'Blog | Proprioadvisor - Conseils Conciergerie Airbnb',
  description: 'Découvrez nos articles et conseils experts sur la conciergerie Airbnb, la gestion locative et l\'optimisation de vos revenus en location courte durée.',
  keywords: [
    'blog conciergerie',
    'conciergerie airbnb', 
    'articles location courte durée',
    'conseils gestion locative',
    'rentabilité airbnb',
    'propriétaire airbnb',
    'gestion locative',
    'conseils propriétaire',
    'optimisation revenus',
    'location courte durée'
  ],
  authors: [{ name: 'David Vauclin' }],
  category: 'Conciergerie Airbnb',
  openGraph: {
    title: 'Blog | Proprioadvisor - Conseils Conciergerie Airbnb',
    description: 'Découvrez nos articles et conseils experts sur la conciergerie Airbnb, la gestion locative et l\'optimisation de vos revenus en location courte durée.',
    url: 'https://proprioadvisor.fr/blog',
    type: 'website',
    siteName: 'ProprioAdvisor',
    locale: 'fr_FR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog | Proprioadvisor - Conseils Conciergerie Airbnb',
    description: 'Découvrez nos articles et conseils experts sur la conciergerie Airbnb et la gestion locative.',
    creator: '@proprioadvisor',
  },
  alternates: {
    canonical: '/blog',
  },
  other: {
    'article:section': 'Conciergerie Airbnb',
    'article:author': 'David Vauclin',
  },
}

// Revalidation toutes les 60 secondes pour le blog
export const revalidate = 60;

export default function BlogPage() {
  return <Blog />
} 

