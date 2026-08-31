const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const app = require('./app');
const { runMigrations } = require('./utils/migrations');

const PORT = process.env.PORT || 5000;

async function start() {
    try {
        await runMigrations();
    } catch (error) {
        console.error('[Server] No se pudo iniciar por error en las migraciones.');
        process.exit(1);
    }

    app.listen(PORT, () => {
        console.log(`Servidor backend corriendo en puerto ${PORT}`);
    });
}

start();
