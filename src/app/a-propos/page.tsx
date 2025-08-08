import type { Metadata } from 'next'
import APropos from '@/pages/APropos'

export const metadata: Metadata = {
  title: 'Ã€ propos de ProprioAdvisor',
  description: 'ProprioAdvisor - DÃ©couvrez notre mission et notre engagement',
  keywords: ['Ã  propos', 'histoire', 'mission', 'conciergerie', 'airbnb'],
  openGraph: {
    title: 'Ã€ propos de ProprioAdvisor',
    description: 'ProprioAdvisor - DÃ©couvrez notre mission et notre engagement',
    url: 'https://proprioadvisor.com/a-propos',
  },
  alternates: {
    canonical: '/a-propos',
  },
}

export default function AProposPage() {
  return <APropos />
} 

