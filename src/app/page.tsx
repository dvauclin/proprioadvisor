import type { Metadata } from 'next'
import Index from '@/pages/Index'

export const metadata: Metadata = {
  title: 'Proprioadvisor | SEUL comparateur de conciergeries Airbnb',
  description: 'Proprioadvisor vous aide à trouver la meilleure conciergerie pour votre bien en location courte durée',
  keywords: ['conciergerie', 'airbnb', 'location courte durée', 'comparateur', 'propriétaire'],
  openGraph: {
    title: 'ProprioAdvisor | Comparateur de conciergeries Airbnb le + complet',
    description: 'ProprioAdvisor vous aide à trouver la meilleure conciergerie pour votre bien en location courte durée',
    url: 'https://proprioadvisor.fr',
    siteName: 'Proprioadvisor',
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ProprioAdvisor | Comparateur de conciergeries Airbnb',
    description: 'ProprioAdvisor vous aide à trouver la meilleure conciergerie pour votre bien en location courte durée',
  },
  alternates: {
    canonical: '/',
  },
}

export default function HomePage() {
  return <Index />
} 

