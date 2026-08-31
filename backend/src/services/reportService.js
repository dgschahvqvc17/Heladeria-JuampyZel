const Report = require('../models/Report');

class ReportService {
    static parseDate(value) {
        if (!value) return null;
        return String(value);
    }

    static getSales(filters) {
        return Report.getSales({
            dateFrom: this.parseDate(filters.dateFrom),
            dateTo: this.parseDate(filters.dateTo),
            branchId: filters.branch || null
        });
    }

    static getSalesSummary(filters) {
        return Report.getSalesSummary({
            dateFrom: this.parseDate(filters.dateFrom),
            dateTo: this.parseDate(filters.dateTo),
            branchId: filters.branch || null
        });
    }

    static getOrders(filters) {
        return Report.getOrders({
            dateFrom: this.parseDate(filters.dateFrom),
            dateTo: this.parseDate(filters.dateTo),
            estado: filters.estado || null
        });
    }

    static getOrdersSummary(filters) {
        return Report.getOrdersSummary({
            dateFrom: this.parseDate(filters.dateFrom),
            dateTo: this.parseDate(filters.dateTo),
            estado: filters.estado || null
        });
    }

    static getProducts() {
        return Report.getProducts();
    }

    static getProductsSummary() {
        return Report.getProductsSummary();
    }

    static getInventory(filters) {
        return Report.getInventory({
            dateFrom: this.parseDate(filters.dateFrom),
            dateTo: this.parseDate(filters.dateTo)
        });
    }

    static getInventorySummary(filters) {
        return Report.getInventorySummary({
            dateFrom: this.parseDate(filters.dateFrom),
            dateTo: this.parseDate(filters.dateTo)
        });
    }

    static getDashboard() {
        return Report.getDashboard();
    }
}

module.exports = ReportService;
