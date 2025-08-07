
import { supabase } from "@/integrations/supabase/client";
import { Subscription } from "@/types";

export interface SubscriptionWithConciergerie extends Subscription {
    conciergerie_nom: string;
}

export const getAllSubscriptions = async (): Promise<SubscriptionWithConciergerie[]> => {
    const { data, error } = await supabase
        .from('subscriptions')
        .select(`
            *,
            conciergeries (
                nom
            )
        `)
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching subscriptions with conciergeries", error);
        throw error;
    }

    if (!data) return [];
    
    const transformedData = data.map((sub: any) => {
        const { conciergeries, ...rest } = sub;
        return {
            ...rest,
            conciergerie_nom: conciergeries?.nom || 'N/A',
        };
    });

    return transformedData as SubscriptionWithConciergerie[];
};
