import type { Metadata } from 'next'
import APropos from '@/pages/APropos'

export const metadata: Metadata = {
  title: 'À propos de ProprioAdvisor',
  description: 'ProprioAdvisor - Découvrez notre mission et notre engagement',
  keywords: ['à propos', 'histoire', 'mission', 'conciergerie', 'airbnb'],
  openGraph: {
    title: 'À propos de ProprioAdvisor',
    description: 'ProprioAdvisor - Découvrez notre mission et notre engagement',
    url: 'https://proprioadvisor.com/a-propos',
  },
  alternates: {
    canonical: '/a-propos',
  },
}

export default function AProposPage() {
  return <APropos />
} 