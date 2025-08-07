import type { Metadata } from 'next'
import ConditionsUtilisation from '@/pages/ConditionsUtilisation'

export const metadata: Metadata = {
  title: 'Conditions d\'Utilisation | Proprioadvisor',
  description: 'Conditions d\'utilisation de Proprioadvisor',
  keywords: ['conditions', 'utilisation', 'terms', 'conciergerie'],
  openGraph: {
    title: 'Conditions d\'Utilisation | Proprioadvisor',
    description: 'Conditions d\'utilisation de Proprioadvisor',
    url: 'https://proprioadvisor.com/conditions-utilisation',
  },
  alternates: {
    canonical: '/conditions-utilisation',
  },
}

export default function ConditionsUtilisationPage() {
  return <ConditionsUtilisation />
} 