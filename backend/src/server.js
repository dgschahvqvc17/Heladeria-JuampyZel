const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const app = require('./app');
const supabase = require('./config/supabase');

const PORT = process.env.PORT || 5000;

async function checkSupabase() {
    // Verificacion de conectividad: lee una fila de la tabla mas pequena.
    const { error } = await supabase
        .from('categoria')
        .select('id_categoria')
        .limit(1);

    if (error) {
        console.error(`[Supabase] No se pudo conectar: ${error.message}`);
        return false;
    }

    return true;
}

async function start() {
    const ready = await checkSupabase();

    if (!ready) {
        console.error('[Supabase] No se pudo conectar. Verifica SUPABASE_URL y la clave API.');
        process.exit(1);
    }

    console.log('[Supabase] Conexion establecida correctamente.');

    app.listen(PORT, () => {
        console.log(`Servidor backend corriendo en puerto ${PORT}`);
    });
}

start();