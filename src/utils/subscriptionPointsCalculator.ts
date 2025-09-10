/**
 * Utility functions for calculating subscription points based on payment status
 */

export interface SubscriptionData {
  points_options: number;
  monthly_amount: number;
  payment_status: string;
}

/**
 * Calculates the effective total points for a subscription
 * Only includes monthly_amount if payment_status is 'completed'
 * 
 * @param subscription - The subscription data
 * @returns The effective total points
 */
export function calculateEffectiveTotalPoints(subscription: SubscriptionData): number {
  const basePoints = subscription.points_options || 0;
  
  // Only include monthly_amount if payment is completed
  if (subscription.payment_status === 'completed') {
    return basePoints + (subscription.monthly_amount || 0);
  }
  
  // For any other payment status (failed, cancelled, past_due, etc.), only return base points
  return basePoints;
}

/**
 * Checks if a subscription has an active payment status
 * 
 * @param paymentStatus - The payment status to check
 * @returns True if the payment status indicates an active subscription
 */
export function isActivePaymentStatus(paymentStatus: string): boolean {
  return paymentStatus === 'completed';
}

/**
 * Checks if a subscription should have premium features access
 * 
 * @param subscription - The subscription data
 * @returns True if the subscription should have premium features
 */
export function hasPremiumAccess(subscription: SubscriptionData): boolean {
  return isActivePaymentStatus(subscription.payment_status);
}


