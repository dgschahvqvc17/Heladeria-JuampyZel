import { createClient } from '@supabase/supabase-js';

// Cliente de Supabase usado por el frontend.
// Usa solo la publishable key (anon): el backend opera con la SERVICE ROLE.
// Por ahora el frontend consume la API REST del backend; este cliente queda
// disponible para funcionalidades futuras (realtime, storage, etc.).
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);