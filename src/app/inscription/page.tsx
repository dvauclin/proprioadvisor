import type { Metadata } from 'next'
import Inscription from '@/pages/Inscription'

export const metadata: Metadata = {
  title: 'Inscription | Proprioadvisor',
  description: 'Inscrivez-vous sur Proprioadvisor pour accéder à nos services de conciergerie',
  keywords: ['inscription', 'conciergerie', 'airbnb', 'inscription'],
  openGraph: {
    title: 'Inscription | Proprioadvisor',
    description: 'Inscrivez-vous sur Proprioadvisor pour accéder à nos services de conciergerie',
    url: 'https://proprioadvisor.com/inscription',
  },
  alternates: {
    canonical: '/inscription',
  },
}

export default function InscriptionPage() {
  return <Inscription />
} 
