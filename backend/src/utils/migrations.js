const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

const MIGRATIONS_DIR = path.join(__dirname, '..', '..', 'migrations');

async function runMigrations() {
    let connection;
    let appliedCount = 0;
    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT, 10) || 3306,
            database: process.env.DB_NAME || 'juampyzel',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            multipleStatements: true
        });

        await connection.query(`
            CREATE TABLE IF NOT EXISTS schema_migrations (
                version VARCHAR(255) NOT NULL,
                applied_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (version)
            ) ENGINE=InnoDB
        `);

        const [appliedRows] = await connection.query(
            'SELECT version FROM schema_migrations'
        );
        const applied = new Set(appliedRows.map((r) => r.version));

        const files = fs
            .readdirSync(MIGRATIONS_DIR)
            .filter((f) => f.endsWith('.sql'))
            .sort();

        for (const file of files) {
            if (applied.has(file)) continue;

            const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), 'utf8');

            await connection.beginTransaction();
            try {
                await connection.query(sql);
                await connection.query(
                    'INSERT INTO schema_migrations (version) VALUES (?)',
                    [file]
                );
                await connection.commit();
                console.log(`[Migracion] Aplicada: ${file}`);
                appliedCount += 1;
            } catch (error) {
                await connection.rollback();
                throw new Error(`Error al aplicar la migración ${file}: ${error.message}`);
            }
        }

        if (appliedCount === 0) {
            console.log('[Migracion] Base de datos al día.');
        }
    } catch (error) {
        console.error('[Migracion] Error:', error.message);
        throw error;
    } finally {
        if (connection) await connection.end();
    }

    return appliedCount;
}

module.exports = { runMigrations };
