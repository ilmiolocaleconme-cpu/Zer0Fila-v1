import { createClient } from '@supabase/supabase-js';

// Caricamento sicuro delle chiavi di Supabase dalle variabili d'ambiente (.env)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://baogwyqcwkdfeuhjjdti.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_Mj5cBuv9PXIhTz5vYnwXtQ_s8m88DvL';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
