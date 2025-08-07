import type { Metadata } from 'next'
import MentionsLegales from '@/pages/MentionsLegales'

export const metadata: Metadata = {
  title: 'Mentions Légales | Proprioadvisor',
  description: 'Mentions légales de Proprioadvisor',
  keywords: ['mentions légales', 'légal', 'conciergerie'],
  openGraph: {
    title: 'Mentions Légales | Proprioadvisor',
    description: 'Mentions légales de Proprioadvisor',
    url: 'https://proprioadvisor.com/mentions-legales',
  },
  alternates: {
    canonical: '/mentions-legales',
  },
}

export default function MentionsLegalesPage() {
  return <MentionsLegales />
} 