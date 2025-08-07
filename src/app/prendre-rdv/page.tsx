import type { Metadata } from 'next'
import PrendreRdv from '@/pages/PrendreRdv'

export const metadata: Metadata = {
  title: 'Prendre Rendez-vous | Proprioadvisor',
  description: 'Prenez rendez-vous avec nos experts en conciergerie Airbnb',
  keywords: ['rendez-vous', 'rdv', 'conciergerie', 'expert', 'consultation'],
  openGraph: {
    title: 'Prendre Rendez-vous | Proprioadvisor',
    description: 'Prenez rendez-vous avec nos experts en conciergerie Airbnb',
    url: 'https://proprioadvisor.com/prendre-rdv',
  },
  alternates: {
    canonical: '/prendre-rdv',
  },
}

export default function PrendreRdvPage() {
  return <PrendreRdv />
} 