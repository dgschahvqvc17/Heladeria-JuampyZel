const AlertService = require('../services/alertService');

class AlertController {
    static async getAll(req, res) {
        try {
            const alerts = await AlertService.getAll();
            res.status(200).json({ success: true, data: alerts });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message || 'Error al obtener alertas.' });
        }
    }

    static async getById(req, res) {
        try {
            const alert = await AlertService.getById(req.params.id);
            res.status(200).json({ success: true, data: alert });
        } catch (error) {
            const status = error.message.includes('no encontrada') ? 404 : 500;
            res.status(status).json({ success: false, message: error.message });
        }
    }

    static async attend(req, res) {
        try {
            const alert = await AlertService.attend(req.params.id);
            res.status(200).json({ success: true, message: 'Alerta marcada como atendida.', data: alert });
        } catch (error) {
            const status = error.message.includes('no encontrada') ? 404 : 400;
            res.status(status).json({ success: false, message: error.message });
        }
    }
}

module.exports = AlertController;