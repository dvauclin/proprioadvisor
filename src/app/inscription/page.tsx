import type { Metadata } from 'next'
import dynamic from 'next/dynamic'

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
  const Inscription = dynamic(() => import('@/pages/Inscription'), { ssr: false })
  return <Inscription />
} 

