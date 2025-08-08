import type { Metadata } from 'next'
import Finalisation from '@/pages/Finalisation'

export const metadata: Metadata = {
  title: 'Finalisation | Proprioadvisor',
  description: 'Finalisez votre inscription sur Proprioadvisor',
  keywords: ['finalisation', 'inscription', 'conciergerie', 'compte'],
  openGraph: {
    title: 'Finalisation | Proprioadvisor',
    description: 'Finalisez votre inscription sur Proprioadvisor',
    url: 'https://proprioadvisor.com/finalisation',
  },
  alternates: {
    canonical: '/finalisation',
  },
}

export default function FinalisationPage() {
  return <Finalisation />
} 
