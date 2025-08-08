import type { Metadata } from 'next'
import Admin from '@/pages/Admin'

export const metadata: Metadata = {
  title: 'Administration | Proprioadvisor',
  description: 'Panneau d\'administration Proprioadvisor',
  keywords: ['admin', 'administration', 'conciergerie'],
  openGraph: {
    title: 'Administration | Proprioadvisor',
    description: 'Panneau d\'administration Proprioadvisor',
    url: 'https://proprioadvisor.com/admin',
  },
  alternates: {
    canonical: '/admin',
  },
}

export default function AdminPage() {
  return <Admin />
} 
