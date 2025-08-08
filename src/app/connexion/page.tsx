import type { Metadata } from 'next'
import Connexion from '@/pages/Connexion'

export const metadata: Metadata = {
  title: 'Connexion | Proprioadvisor',
  description: 'Connectez-vous Ã  votre compte Proprioadvisor',
  keywords: ['connexion', 'login', 'conciergerie', 'airbnb'],
  openGraph: {
    title: 'Connexion | Proprioadvisor',
    description: 'Connectez-vous Ã  votre compte Proprioadvisor',
    url: 'https://proprioadvisor.com/connexion',
  },
  alternates: {
    canonical: '/connexion',
  },
}

export default function ConnexionPage() {
  return <Connexion />
} 

