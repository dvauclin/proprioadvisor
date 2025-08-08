import type { Metadata } from 'next'
import React, { Suspense } from 'react'
import Subscription from '@/pages/Subscription'

export const dynamic = 'force-dynamic'

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
  return (
    <Suspense fallback={null}>
      <Subscription />
    </Suspense>
  )
} 

