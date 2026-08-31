const PublicStats = require('../models/PublicStats');

class PublicController {
    static async getStats(req, res) {
        try {
            const stats = await PublicStats.getStats();
            res.status(200).json({ success: true, data: stats });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message || 'Error al obtener las estadísticas.' });
        }
    }
}

module.exports = PublicController;
