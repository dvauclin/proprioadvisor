import type { Metadata } from 'next'
import MyConciergerie from '@/pages/MyConciergerie'

export const metadata: Metadata = {
  title: 'Ma Conciergerie | Proprioadvisor',
  description: 'GÃ©rez votre conciergerie sur Proprioadvisor',
  keywords: ['conciergerie', 'gestion', 'airbnb', 'propriÃ©taire'],
  openGraph: {
    title: 'Ma Conciergerie | Proprioadvisor',
    description: 'GÃ©rez votre conciergerie sur Proprioadvisor',
    url: 'https://proprioadvisor.com/ma-conciergerie',
  },
  alternates: {
    canonical: '/ma-conciergerie',
  },
}

export default function MaConciergeriePage() {
  return <MyConciergerie />
} 

