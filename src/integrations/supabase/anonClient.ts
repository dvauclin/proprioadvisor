
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Client Supabase dédié aux utilisateurs anonymes
// Ne persiste aucune session et utilise uniquement la clé anon
export const anonSupabase = (() => {
  if (!url || !anon) {
    return new Proxy({}, {
      get() {
        throw new Error('Supabase anon client not configured: set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
      },
    }) as unknown as ReturnType<typeof createClient<Database>>;
  }
  return createClient<Database>(url, anon, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
      storageKey: 'supabase-anon-session',
    },
  });
})();

