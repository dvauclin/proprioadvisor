import type { Metadata } from 'next'
import AnnuaireConciergerie from '@/pages/AnnuaireConciergerie'

export const metadata: Metadata = {
  title: 'Annuaire des conciergeries Airbnb | Proprioadvisor',
  description: 'Annuaire spécialisé des conciergeries Airbnb. Comparez gratuitement les offres et trouvez la meilleure conciergerie pour votre location courte durée.',
  keywords: ['annuaire conciergerie', 'conciergerie airbnb', 'gestion location courte durée', 'proprioadvisor'],
  openGraph: {
    title: 'Annuaire des conciergeries Airbnb | Proprioadvisor',
    description: 'Annuaire spécialisé des conciergeries Airbnb. Comparez gratuitement les offres et trouvez la meilleure conciergerie pour votre location courte durée.',
    url: 'https://proprioadvisor.com/annuaire',
  },
  alternates: {
    canonical: '/annuaire',
  },
}

export default function AnnuairePage() {
  return <AnnuaireConciergerie />
} 
