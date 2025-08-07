import type { Metadata } from 'next'
import Contact from '@/pages/Contact'

export const metadata: Metadata = {
  title: 'Contact | Proprioadvisor',
  description: 'Contactez Proprioadvisor pour toute question sur nos services de conciergerie Airbnb',
  keywords: ['contact', 'conciergerie', 'airbnb', 'support'],
  openGraph: {
    title: 'Contact | Proprioadvisor',
    description: 'Contactez Proprioadvisor pour toute question sur nos services de conciergerie Airbnb',
    url: 'https://proprioadvisor.com/contact',
  },
  alternates: {
    canonical: '/contact',
  },
}

export default function ContactPage() {
  return <Contact />
} 