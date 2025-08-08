import type { Metadata } from 'next'
import Favoris from '@/pages/Favoris'

export const metadata: Metadata = {
  title: 'Mes Favoris | Proprioadvisor',
  description: 'Consultez vos conciergeries favorites',
  keywords: ['favoris', 'conciergerie', 'airbnb', 'sauvegardé'],
  openGraph: {
    title: 'Mes Favoris | Proprioadvisor',
    description: 'Consultez vos conciergeries favorites',
    url: 'https://proprioadvisor.com/favoris',
  },
  alternates: {
    canonical: '/favoris',
  },
}

export default function FavorisPage() {
  return <Favoris />
} 

