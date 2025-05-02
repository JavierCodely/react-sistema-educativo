// src/services/auth/supabase/supabaseClient.ts

import { createClient } from '@supabase/supabase-js';

// En Vite, las variables de entorno se acceden con import.meta.env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Creamos la instancia del cliente de Supabase
export const supabase = createClient(supabaseUrl, supabaseServiceKey);