import type { Metadata } from 'next'
import PolitiqueConfidentialite from '@/pages/PolitiqueConfidentialite'

export const metadata: Metadata = {
  title: 'Politique de Confidentialité | Proprioadvisor',
  description: 'Politique de confidentialité de Proprioadvisor',
  keywords: ['confidentialité', 'privacy', 'données personnelles', 'rgpd'],
  openGraph: {
    title: 'Politique de Confidentialité | Proprioadvisor',
    description: 'Politique de confidentialité de Proprioadvisor',
    url: 'https://proprioadvisor.com/politique-confidentialite',
  },
  alternates: {
    canonical: '/politique-confidentialite',
  },
}

export default function PolitiqueConfidentialitePage() {
  return <PolitiqueConfidentialite />
} 
