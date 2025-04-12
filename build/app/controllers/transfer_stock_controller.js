import TransferStock from '#models/transfer_stock';
import TransferStockService from '#services/transfer_stock_service';
export default class TransferStockController {
    async show({ inertia }) {
        return inertia.render('transferStocks/ManageTransferStockPage');
    }
    async showDetail({ inertia, request }) {
        const id = request.param('id');
        return inertia.render('transferStocks/DetailTransferStockPage', {
            id,
        });
    }
    async showCreate({ inertia }) {
        const generatedInvoiceNumber = await TransferStock.generateInvoiceNumber();
        return inertia.render('transferStocks/CreateTransferStockPage', {
            generatedId: generatedInvoiceNumber,
        });
    }
    async list(c) {
        const res = await TransferStockService.list(c);
        return c.response.status(res.code).json(res);
    }
    async stats(c) {
        const res = await TransferStockService.stats(c);
        return c.response.status(res.code).json(res);
    }
    async detail(c) {
        const res = await TransferStockService.detail(c);
        return c.response.status(res.code).json(res);
    }
    async create(c) {
        const res = await TransferStockService.create(c);
        return c.response.status(res.code).json(res);
    }
    async downloadAttachment(c) {
        return await TransferStockService.downloadAttachment(c);
    }
}
//# sourceMappingURL=transfer_stock_controller.js.map