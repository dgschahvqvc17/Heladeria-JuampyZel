const pool = require('../config/database');

class PublicStats {
    static async getStats() {
        const [[products]] = await pool.execute(
            'SELECT COUNT(*) AS total FROM producto WHERE estado = 1'
        );
        const [[branches]] = await pool.execute(
            'SELECT COUNT(*) AS total FROM sucursal WHERE estado = 1'
        );
        const [[clients]] = await pool.execute(
            'SELECT COUNT(*) AS total FROM cliente'
        );

        return {
            total_sabores: products.total,
            total_sucursales: branches.total,
            total_clientes: clients.total
        };
    }
}

module.exports = PublicStats;
