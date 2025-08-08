
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://gajceuvnerzlnuqvhnan.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdhamNldXZuZXJ6bG51cXZobmFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU5MzM1MzgsImV4cCI6MjA2MTUwOTUzOH0.7gsaxDRXCGBALLfbAawQoFZEPxATam_0oWdgig5oDIs";

// Client Supabase dÃ©diÃ© aux utilisateurs anonymes
// Ne persiste aucune session et utilise uniquement la clÃ© anon
export const anonSupabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
    storageKey: 'supabase-anon-session' // ClÃ© distincte pour Ã©viter les conflits
  }
});

