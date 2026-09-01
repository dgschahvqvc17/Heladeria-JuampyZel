const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY;

if (!SUPABASE_URL) {
    console.error('[Supabase] Falta la variable de entorno SUPABASE_URL.');
    process.exit(1);
}

// El backend usa la clave SERVICE ROLE para operar sobre todas las tablas
// (ignora RLS por diseño). Si no esta configurada, degrada a la publishable
// key (no podra escribir en tablas sin politica de escritura).
const apiKey = SUPABASE_SERVICE_ROLE_KEY || SUPABASE_PUBLISHABLE_KEY;

if (!apiKey) {
    console.error('[Supabase] Falta SUPABASE_SERVICE_ROLE_KEY o SUPABASE_PUBLISHABLE_KEY.');
    process.exit(1);
}

if (!SUPABASE_SERVICE_ROLE_KEY) {
    console.warn(
        '[Supabase] Usando SUPABASE_PUBLISHABLE_KEY como fallback. ' +
        'Configura SUPABASE_SERVICE_ROLE_KEY en backend/.env para operar con RLS desactivado.'
    );
}

const supabase = createClient(SUPABASE_URL, apiKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false
    }
});

module.exports = supabase;