import type { Metadata } from 'next'
import Contact from '@/pages/Contact'
import StructuredData from '@/components/seo/StructuredData'
import { contactPageJsonLd } from '@/lib/structured-data-models'

export const metadata: Metadata = {
  title: 'Contact | ProprioAdvisor - Support et assistance',
  description: 'Contactez l\'équipe ProprioAdvisor pour toute question sur nos services de comparaison de conciergeries Airbnb. Support client et assistance personnalisée.',
  keywords: [
    'contact proprioadvisor',
    'support conciergerie',
    'assistance airbnb',
    'aide propriétaire',
    'service client',
    'contact',
    'conciergerie',
    'airbnb',
    'support',
    'assistance'
  ],
  authors: [{ name: 'David Vauclin' }],
  category: 'Contact',
  openGraph: {
    title: 'Contact | ProprioAdvisor - Support et assistance',
    description: 'Contactez l\'équipe ProprioAdvisor pour toute question sur nos services de comparaison de conciergeries Airbnb.',
    url: 'https://proprioadvisor.fr/contact',
    siteName: 'ProprioAdvisor',
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact | ProprioAdvisor',
    description: 'Contactez-nous pour toute question sur nos services de conciergerie.',
    creator: '@proprioadvisor',
  },
  alternates: {
    canonical: '/contact',
  },
}

export default function ContactPage() {
  const structuredData = [contactPageJsonLd()];

  return (
    <>
      <StructuredData data={structuredData} />
      <Contact />
    </>
  )
} 

