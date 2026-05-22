import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://baogwyqcwkdfeuhjjdti.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_Mj5cBuv9PXIhTz5vYnwXtQ_s8m88DvL';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
