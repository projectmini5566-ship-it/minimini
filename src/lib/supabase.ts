import { createClient } from '@supabase/supabase-js';

// Using hardcoded values as provided by the user for direct connection
const supabaseUrl = 'https://nbohtmylnioomywptcyh.supabase.co';
const supabaseAnonKey = 'sb_publishable_vnsw5_o-pvJUuMHWQ4i6rg_j_ZIppvY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
