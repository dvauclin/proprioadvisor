import type { Metadata } from 'next'
import Blog from '@/pages/Blog'

export const metadata: Metadata = {
  title: 'Blog | Proprioadvisor',
  description: 'DÃ©couvrez nos articles sur la conciergerie Airbnb et la location courte durÃ©e',
  keywords: ['blog', 'conciergerie', 'airbnb', 'articles', 'location courte durÃ©e'],
  openGraph: {
    title: 'Blog | Proprioadvisor',
    description: 'DÃ©couvrez nos articles sur la conciergerie Airbnb et la location courte durÃ©e',
    url: 'https://proprioadvisor.fr/blog',
  },
  alternates: {
    canonical: '/blog',
  },
}

export default function BlogPage() {
  return <Blog />
} 

