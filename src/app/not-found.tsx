import type { Metadata } from 'next'
import NotFound from '@/pages/NotFound'

export const metadata: Metadata = {
  title: 'Page Non Trouvée | Proprioadvisor',
  description: 'La page que vous recherchez n\'existe pas',
  robots: {
    index: false,
    follow: false,
  },
}

export default function NotFoundPage() {
  return <NotFound />
} 
