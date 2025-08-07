import type { Metadata } from 'next'
import MyConciergerie from '@/pages/MyConciergerie'

export const metadata: Metadata = {
  title: 'Ma Conciergerie | Proprioadvisor',
  description: 'Gérez votre conciergerie sur Proprioadvisor',
  keywords: ['conciergerie', 'gestion', 'airbnb', 'propriétaire'],
  openGraph: {
    title: 'Ma Conciergerie | Proprioadvisor',
    description: 'Gérez votre conciergerie sur Proprioadvisor',
    url: 'https://proprioadvisor.com/ma-conciergerie',
  },
  alternates: {
    canonical: '/ma-conciergerie',
  },
}

export default function MaConciergeriePage() {
  return <MyConciergerie />
} 