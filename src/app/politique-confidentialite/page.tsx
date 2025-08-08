import type { Metadata } from 'next'
import PolitiqueConfidentialite from '@/pages/PolitiqueConfidentialite'

export const metadata: Metadata = {
  title: 'Politique de ConfidentialitÃ© | Proprioadvisor',
  description: 'Politique de confidentialitÃ© de Proprioadvisor',
  keywords: ['confidentialitÃ©', 'privacy', 'donnÃ©es personnelles', 'rgpd'],
  openGraph: {
    title: 'Politique de ConfidentialitÃ© | Proprioadvisor',
    description: 'Politique de confidentialitÃ© de Proprioadvisor',
    url: 'https://proprioadvisor.com/politique-confidentialite',
  },
  alternates: {
    canonical: '/politique-confidentialite',
  },
}

export default function PolitiqueConfidentialitePage() {
  return <PolitiqueConfidentialite />
} 

