import type { Metadata } from 'next'
import Simulator from '@/pages/Simulator'

export const metadata: Metadata = {
  title: 'Simulateur Airbnb | Proprioadvisor',
  description: 'Simulez vos revenus Airbnb avec notre calculateur',
  keywords: ['simulateur', 'airbnb', 'calculateur', 'revenus', 'location'],
  openGraph: {
    title: 'Simulateur Airbnb | Proprioadvisor',
    description: 'Simulez vos revenus Airbnb avec notre calculateur',
    url: 'https://proprioadvisor.com/simulateur-airbnb',
  },
  alternates: {
    canonical: '/simulateur-airbnb',
  },
}

export default function SimulateurPage() {
  return <Simulator />
} 

