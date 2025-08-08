import type { Metadata } from 'next'
import Index from '@/pages/Index'

export const metadata: Metadata = {
  title: 'Proprioadvisor | SEUL comparateur de conciergeries Airbnb',
  description: 'Proprioadvisor vous aide Ã  trouver la meilleure conciergerie pour votre bien en location courte durÃ©e',
  keywords: ['conciergerie', 'airbnb', 'location courte durÃ©e', 'comparateur', 'propriÃ©taire'],
  openGraph: {
    title: 'ProprioAdvisor | Comparateur de conciergeries Airbnb le + complet',
    description: 'ProprioAdvisor vous aide Ã  trouver la meilleure conciergerie pour votre bien en location courte durÃ©e',
    url: 'https://proprioadvisor.fr',
    siteName: 'Proprioadvisor',
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ProprioAdvisor | Comparateur de conciergeries Airbnb',
    description: 'ProprioAdvisor vous aide Ã  trouver la meilleure conciergerie pour votre bien en location courte durÃ©e',
  },
  alternates: {
    canonical: '/',
  },
}

export default function HomePage() {
  return <Index />
} 

