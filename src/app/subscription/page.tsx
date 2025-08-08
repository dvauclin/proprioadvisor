import type { Metadata } from 'next'
import Subscription from '@/pages/Subscription'

export const metadata: Metadata = {
  title: 'Abonnement | Proprioadvisor',
  description: 'Choisissez votre abonnement Proprioadvisor pour votre conciergerie',
  keywords: ['abonnement', 'subscription', 'conciergerie', 'airbnb', 'tarifs'],
  openGraph: {
    title: 'Abonnement | Proprioadvisor',
    description: 'Choisissez votre abonnement Proprioadvisor pour votre conciergerie',
    url: 'https://proprioadvisor.com/subscription',
  },
  alternates: {
    canonical: '/subscription',
  },
}

export default function SubscriptionPage() {
  return <Subscription />
} 
