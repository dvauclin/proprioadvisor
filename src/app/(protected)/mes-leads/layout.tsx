import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mes Leads | Proprioadvisor',
  description: 'GÃ©rez vos leads de conciergerie sur Proprioadvisor',
  keywords: ['leads', 'conciergerie', 'gestion', 'airbnb'],
  openGraph: {
    title: 'Mes Leads | Proprioadvisor',
    description: 'GÃ©rez vos leads de conciergerie sur Proprioadvisor',
    url: 'https://proprioadvisor.com/mes-leads',
  },
  alternates: {
    canonical: '/mes-leads',
  },
}

export default function MesLeadsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

