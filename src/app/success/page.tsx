import type { Metadata } from 'next'
import SubscriptionSuccess from '@/pages/SubscriptionSuccess'

export async function generateMetadata({ searchParams }: { searchParams: { updated?: string } }): Promise<Metadata> {
  const isUpdate = searchParams.updated === 'true';
  
  return {
    title: isUpdate ? 'Modification de votre souscription ProprioAdvisor' : 'Création de votre souscription ProprioAdvisor',
    description: isUpdate 
      ? 'Votre souscription ProprioAdvisor a été modifiée avec succès. Gérez votre visibilité et optimisez votre présence en ligne.'
      : 'Votre souscription ProprioAdvisor a été créée avec succès. Démarrez votre visibilité et optimisez votre présence en ligne.',
    keywords: ['succès', 'paiement', 'abonnement', 'conciergerie'],
    openGraph: {
      title: isUpdate ? 'Modification de votre souscription ProprioAdvisor' : 'Création de votre souscription ProprioAdvisor',
      description: isUpdate 
        ? 'Votre souscription ProprioAdvisor a été modifiée avec succès. Gérez votre visibilité et optimisez votre présence en ligne.'
        : 'Votre souscription ProprioAdvisor a été créée avec succès. Démarrez votre visibilité et optimisez votre présence en ligne.',
      url: 'https://proprioadvisor.com/success',
    },
    alternates: {
      canonical: '/success',
    },
  }
}

export default function SuccessPage() {
  return <SubscriptionSuccess />
} 