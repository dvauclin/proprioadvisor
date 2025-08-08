import { Metadata } from 'next'

// Configuration des mÃ©tadonnÃ©es globales
export const siteConfig = {
  name: 'ProprioAdvisor',
  description: 'Comparateur de conciergeries Airbnb pour les propriÃ©taires',
  url: 'https://proprioadvisor.fr',
  ogImage: 'https://proprioadvisor.fr/og-image.jpg',
  links: {
    twitter: 'https://twitter.com/proprioadvisor',
    github: 'https://github.com/proprioadvisor',
  },
}

// MÃ©tadonnÃ©es par dÃ©faut
export const defaultMetadata: Metadata = {
  title: {
    default: 'ProprioAdvisor | SEUL comparateur de conciergeries Airbnb',
    template: '%s | ProprioAdvisor'
  },
  description: 'ProprioAdvisor vous aide Ã  trouver la meilleure conciergerie pour votre bien en location courte durÃ©e',
  keywords: [
    'conciergerie',
    'airbnb',
    'location courte durÃ©e',
    'comparateur',
    'propriÃ©taire',
    'gestion locative',
    'conciergerie airbnb',
    'conciergerie paris',
    'conciergerie lyon',
    'conciergerie marseille'
  ],
  authors: [{ name: 'ProprioAdvisor' }],
  creator: 'ProprioAdvisor',
  publisher: 'ProprioAdvisor',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(siteConfig.url),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: siteConfig.url,
    title: 'ProprioAdvisor | Comparateur de conciergeries Airbnb le + complet',
    description: 'ProprioAdvisor vous aide Ã  trouver la meilleure conciergerie pour votre bien en location courte durÃ©e',
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: 'ProprioAdvisor - Comparateur de conciergeries Airbnb',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ProprioAdvisor | Comparateur de conciergeries Airbnb',
    description: 'ProprioAdvisor vous aide Ã  trouver la meilleure conciergerie pour votre bien en location courte durÃ©e',
    images: [siteConfig.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
}

// Fonction pour gÃ©nÃ©rer des mÃ©tadonnÃ©es dynamiques
export function generateMetadata(
  title?: string,
  description?: string,
  keywords?: string[],
  image?: string,
  url?: string
): Metadata {
  return {
    title: title ? `${title} | ProprioAdvisor` : defaultMetadata.title,
    description: description || defaultMetadata.description,
    keywords: keywords || defaultMetadata.keywords,
    openGraph: {
      ...defaultMetadata.openGraph,
      title: title ? `${title} | ProprioAdvisor` : defaultMetadata.openGraph?.title,
      description: description || defaultMetadata.openGraph?.description,
      url: url || defaultMetadata.openGraph?.url,
      images: image ? [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title || 'ProprioAdvisor',
        },
      ] : defaultMetadata.openGraph?.images,
    },
    twitter: {
      ...defaultMetadata.twitter,
      title: title ? `${title} | ProprioAdvisor` : defaultMetadata.twitter?.title,
      description: description || defaultMetadata.twitter?.description,
      images: image ? [image] : defaultMetadata.twitter?.images,
    },
  }
} 

