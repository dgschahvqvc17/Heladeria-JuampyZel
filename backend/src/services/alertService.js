const Alert = require('../models/Alert');

class AlertService {
    static async getAll() {
        // Al consultar, primero forzamos la verificación y generación de alertas
        await Alert.checkAndGenerateAlerts();
        return Alert.findAll();
    }

    static async getById(id) {
        const alert = await Alert.findById(id);
        if (!alert) throw new Error('Alerta no encontrada.');
        return alert;
    }

    static async attend(id) {
        const alert = await Alert.findById(id);
        if (!alert) throw new Error('Alerta no encontrada.');
        if (alert.estado === 'ATENDIDA') throw new Error('La alerta ya ha sido atendida.');

        await Alert.markAsAttended(id);
        return this.getById(id);
    }
}

module.exports = AlertService;