import type { Metadata } from 'next'
import MentionsLegales from '@/pages/MentionsLegales'

export const metadata: Metadata = {
  title: 'Mentions LÃ©gales | Proprioadvisor',
  description: 'Mentions lÃ©gales de Proprioadvisor',
  keywords: ['mentions lÃ©gales', 'lÃ©gal', 'conciergerie'],
  openGraph: {
    title: 'Mentions LÃ©gales | Proprioadvisor',
    description: 'Mentions lÃ©gales de Proprioadvisor',
    url: 'https://proprioadvisor.com/mentions-legales',
  },
  alternates: {
    canonical: '/mentions-legales',
  },
}

export default function MentionsLegalesPage() {
  return <MentionsLegales />
} 

