import { Subscription } from '@/types';

/**
 * Vérifie si un abonnement est dans un état valide pour accéder aux fonctionnalités premium
 */
export const isSubscriptionActive = (subscription: Subscription | null): boolean => {
  if (!subscription) return false;
  
  const validStatuses = ['completed', 'active'];
  return validStatuses.includes(subscription.payment_status);
};

/**
 * Vérifie si un abonnement est en échec de paiement
 */
export const isSubscriptionFailed = (subscription: Subscription | null): boolean => {
  if (!subscription) return false;
  
  const failedStatuses = ['failed', 'past_due', 'unpaid', 'cancelled', 'expired'];
  return failedStatuses.includes(subscription.payment_status);
};

/**
 * Vérifie si un abonnement est en attente de paiement
 */
export const isSubscriptionPending = (subscription: Subscription | null): boolean => {
  if (!subscription) return false;
  
  return subscription.payment_status === 'pending';
};

/**
 * Obtient le montant mensuel actuel valide d'un abonnement
 */
export const getValidMonthlyAmount = (subscription: Subscription | null): number => {
  if (!isSubscriptionActive(subscription)) return 0;
  return subscription?.monthly_amount || 0;
};

/**
 * Obtient le nombre total de points valides d'un abonnement
 * Les points des options sont toujours valides, le montant mensuel seulement si le paiement est OK
 */
export const getValidTotalPoints = (subscription: Subscription | null): number => {
  if (!subscription) return 0;
  
  // Les points des options sont toujours valides
  const optionsPoints = subscription.points_options || 0;
  
  // Le montant mensuel n'est valide que si le paiement est OK
  const validMonthlyPoints = isSubscriptionActive(subscription) ? (subscription.monthly_amount || 0) : 0;
  
  return optionsPoints + validMonthlyPoints;
};

/**
 * Obtient uniquement les points des options (toujours valides)
 */
export const getOptionsPoints = (subscription: Subscription | null): number => {
  if (!subscription) return 0;
  return subscription.points_options || 0;
};

/**
 * Obtient uniquement les points du montant mensuel (seulement si paiement OK)
 */
export const getMonthlyAmountPoints = (subscription: Subscription | null): number => {
  if (!subscription) return 0;
  return isSubscriptionActive(subscription) ? (subscription.monthly_amount || 0) : 0;
};

/**
 * Obtient une description lisible du statut de paiement
 */
export const getPaymentStatusDescription = (status: string): string => {
  const statusMap: Record<string, string> = {
    'completed': 'Paiement complété',
    'active': 'Actif',
    'pending': 'En attente de paiement',
    'failed': 'Paiement échoué',
    'past_due': 'Paiement en retard',
    'unpaid': 'Impayé',
    'cancelled': 'Annulé',
    'incomplete': 'Incomplet',
    'expired': 'unknown'
  };
  
  return statusMap[status] || `Statut inconnu: ${status}`;
};

/**
 * Vérifie si un abonnement a accès aux fonctionnalités premium
 */
export const hasPremiumAccess = (subscription: Subscription | null): boolean => {
  return isSubscriptionActive(subscription) && (subscription?.monthly_amount || 0) > 0;
};
