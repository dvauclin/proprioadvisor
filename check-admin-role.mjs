import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkAdminUser() {
  try {
    console.log('Vérification du rôle admin pour vauclin.david@gmail.com...');
    
    // Vérifier le profil de l'utilisateur admin
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', 'vauclin.david@gmail.com')
      .single();
    
    if (error) {
      console.log('Erreur lors de la récupération du profil:', error);
      return;
    }
    
    console.log('Profil trouvé:', {
      id: profile.id,
      email: profile.email,
      role: profile.role,
      created_at: profile.created_at
    });
    
    if (profile.role !== 'admin') {
      console.log('Le rôle n\'est pas admin, mise à jour en cours...');
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ role: 'admin' })
        .eq('email', 'vauclin.david@gmail.com');
      
      if (updateError) {
        console.log('Erreur lors de la mise à jour:', updateError);
      } else {
        console.log('Rôle mis à jour avec succès vers admin ✓');
      }
    } else {
      console.log('Le rôle est déjà admin ✓');
    }
  } catch (error) {
    console.log('Erreur:', error);
  }
}

checkAdminUser();
