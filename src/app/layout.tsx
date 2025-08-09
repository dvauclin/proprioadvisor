import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster as Sonner } from "@/components/ui-kit/sonner"


import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import CookieConsent from "@/components/CookieConsent"
import MobileStickyButton from "@/components/MobileStickyButton"
import StructuredData from "@/components/seo/StructuredData"
import { orgJsonLd, websiteJsonLd } from "@/lib/structured-data-models"
import Providers from "@/components/providers/Providers"
import PageWrapper from "@/components/PageWrapper"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://proprioadvisor.fr'),
  title: 'Proprioadvisor | SEUL comparateur de conciergeries Airbnb',
  description: 'Proprioadvisor vous aide à trouver la meilleure conciergerie pour votre bien en location courte durée. Comparez les services, tarifs et avis des conciergeries Airbnb.',
  keywords: [
    'conciergerie',
    'airbnb',
    'location courte durée',
    'comparateur',
    'propriétaire',
    'gestion locative',
    'conciergerie airbnb',
    'service conciergerie',
    'location saisonnière',
    'gestionnaire airbnb'
  ],
  authors: [{ name: 'Proprioadvisor', url: 'https://proprioadvisor.fr' }],
  creator: 'Proprioadvisor',
  publisher: 'Proprioadvisor',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://proprioadvisor.fr',
    siteName: 'Proprioadvisor',
    title: 'ProprioAdvisor | Comparateur de conciergeries Airbnb le + complet',
    description: 'ProprioAdvisor vous aide à trouver la meilleure conciergerie pour votre bien en location courte durée. Comparez les services, tarifs et avis.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Proprioadvisor - Comparateur de conciergeries Airbnb',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@proprioadvisor',
    creator: '@proprioadvisor',
    title: 'ProprioAdvisor | Comparateur de conciergeries Airbnb',
    description: 'ProprioAdvisor vous aide à trouver la meilleure conciergerie pour votre bien en location courte durée',
    images: ['/og-image.jpg'],
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
  category: 'business',
  classification: 'business',
  other: {
    'geo.region': 'FR',
    'geo.placename': 'France',
    'geo.position': '48.8566;2.3522',
    'ICBM': '48.8566, 2.3522',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        <meta name="theme-color" content="#7FFF00" />
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
        <StructuredData scriptId="ld-global" data={[orgJsonLd(), websiteJsonLd()]} />
      </head>
      <body className={inter.className}>
        <Providers>
          <PageWrapper>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main role="main" className="flex-grow">
                {children}
              </main>
              <Footer />
              <CookieConsent />
              <MobileStickyButton />
            </div>
          </PageWrapper>
          <Sonner />
        </Providers>
      </body>
    </html>
  )
} 

