const app = require('./app');
const dotenv = require('dotenv');
const { runMigrations } = require('./utils/migrations');

dotenv.config();

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
