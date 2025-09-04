import { supabase } from '@/integrations/supabase/client';

export interface RankingPosition {
  position: number;
  points: number;
  conciergerieId: string;
  conciergerieName: string;
  villeId: string;
  villeName: string;
}

export interface RankingTarget {
  targetPosition: 1 | 3 | 10;
  requiredPoints: number;
  villeName: string;
  villeId: string;
  currentLeader?: {
    conciergerieName: string;
    points: number;
  };
}

/**
 * Calcule les positions de classement pour une conciergerie dans toutes ses villes
 */
export async function calculateRankingPositions(conciergerieId: string): Promise<RankingTarget[]> {
  try {
    // Récupérer la conciergerie avec ses villes
    const { data: conciergerie, error: conciergerieError } = await supabase
      .from('conciergeries')
      .select(`
        id,
        nom,
        villes_ids
      `)
      .eq('id', conciergerieId)
      .single();

    if (conciergerieError || !conciergerie) {
      console.error('Erreur lors de la récupération de la conciergerie:', conciergerieError);
      return [];
    }

    // Récupérer toutes les villes de la conciergerie
    const villeIds = conciergerie.villes_ids || [];
    if (villeIds.length === 0) {
      return [];
    }

    // Pour chaque ville, calculer le classement
    const rankingTargets: RankingTarget[] = [];

    for (const villeId of villeIds) {
      const villeRanking = await calculateVilleRanking(villeId, conciergerieId);
      rankingTargets.push(...villeRanking);
    }

    return rankingTargets;
  } catch (error) {
    console.error('Erreur lors du calcul des positions de classement:', error);
    return [];
  }
}

/**
 * Calcule le classement pour une ville spécifique
 */
async function calculateVilleRanking(villeId: string, currentConciergerieId: string): Promise<RankingTarget[]> {
  try {
    // Récupérer toutes les formules de cette ville avec leurs conciergeries et souscriptions
    const { data: formules, error } = await supabase
      .from('formules')
      .select(`
        *,
        conciergeries!inner (
          *,
          subscriptions (*)
        )
      `)
      .eq('conciergeries.validated', true)
      .contains('conciergeries.villes_ids', [villeId]);

    if (error) {
      console.error('Erreur lors de la récupération des formules:', error);
      return [];
    }

    // Récupérer le nom de la ville
    const { data: ville, error: villeError } = await supabase
      .from('villes')
      .select('nom')
      .eq('id', villeId)
      .single();

    if (villeError || !ville) {
      console.error('Erreur lors de la récupération de la ville:', villeError);
      return [];
    }

    // Calculer les scores effectifs pour chaque formule (même logique que les listings)
    const formulesWithScores = formules.map(formule => {
      const conciergerie = formule.conciergeries;
      const subscription = conciergerie?.subscriptions?.[0];
      
      // Même logique que ConciergerieList.tsx : score manuel uniquement si pas de souscription
      const effectiveScore = subscription?.payment_status === 'completed' 
        ? (subscription.total_points || 0) 
        : (conciergerie?.score_manuel ?? 0);

      return {
        id: formule.id,
        nom: formule.nom,
        conciergerieId: conciergerie?.id,
        conciergerieNom: conciergerie?.nom,
        score: effectiveScore,
        isCurrent: conciergerie?.id === currentConciergerieId
      };
    });

    // Trier par score décroissant (même logique que les listings)
    formulesWithScores.sort((a, b) => {
      // First: Compare effective scores (highest first)
      if (a.score !== b.score) {
        return b.score - a.score; // Sort by effective score descending
      }
      
      // Second: If effective scores are equal, compare conciergerie creation dates (oldest first)
      // Pour simplifier, on utilise l'ID de la formule comme critère de départage
      return a.id.localeCompare(b.id);
    });

    // Calculer les positions nécessaires pour être 1er, top 3, top 10
    const targets: RankingTarget[] = [];
    
    // Position 1 (1ère formule)
    const firstPosition = formulesWithScores[0];
    if (firstPosition && !firstPosition.isCurrent) {
      targets.push({
        targetPosition: 1,
        requiredPoints: firstPosition.score + 1,
        villeName: ville.nom,
        villeId: villeId,
        currentLeader: {
          conciergerieName: firstPosition.conciergerieNom,
          points: firstPosition.score
        }
      });
    }

    // Position 3 (3ème formule)
    if (formulesWithScores.length >= 3) {
      const thirdPosition = formulesWithScores[2];
      if (thirdPosition && !thirdPosition.isCurrent) {
        targets.push({
          targetPosition: 3,
          requiredPoints: thirdPosition.score + 1,
          villeName: ville.nom,
          villeId: villeId,
          currentLeader: {
            conciergerieName: thirdPosition.conciergerieNom,
            points: thirdPosition.score
          }
        });
      }
    } else if (formulesWithScores.length > 0) {
      // Si moins de 3 formules, être 3ème nécessite au moins 1 point
      const lastPosition = formulesWithScores[formulesWithScores.length - 1];
      if (!lastPosition.isCurrent) {
        targets.push({
          targetPosition: 3,
          requiredPoints: Math.max(1, lastPosition.score + 1),
          villeName: ville.nom,
          villeId: villeId,
          currentLeader: {
            conciergerieName: lastPosition.conciergerieNom,
            points: lastPosition.score
          }
        });
      }
    }


    return targets;
  } catch (error) {
    console.error('Erreur lors du calcul du classement pour la ville:', error);
    return [];
  }
}

/**
 * Groupe les targets par position et prend le maximum des points requis
 */
export function groupRankingTargets(targets: RankingTarget[]): {
  position1: RankingTarget | null;
  position3: RankingTarget | null;
  villes: string[];
} {
  const position1Targets = targets.filter(t => t.targetPosition === 1);
  const position3Targets = targets.filter(t => t.targetPosition === 3);
  
  // Récupérer toutes les villes uniques
  const villes = [...new Set(targets.map(t => t.villeName))];

  return {
    position1: position1Targets.length > 0 
      ? position1Targets.reduce((max, current) => 
          current.requiredPoints > max.requiredPoints ? current : max
        )
      : null,
    position3: position3Targets.length > 0 
      ? position3Targets.reduce((max, current) => 
          current.requiredPoints > max.requiredPoints ? current : max
        )
      : null,
    villes
  };
}
