import GoodsReceipt from '#models/goods_receipt';
import GoodsReceiptService from '#services/goods_receipt_service';
export default class GoodsReceiptController {
    async show({ inertia }) {
        return inertia.render('goodsReceipts/ManageGoodsReceiptPage');
    }
    async showDetail({ inertia, request }) {
        const id = request.param('id');
        return inertia.render('goodsReceipts/DetailGoodsReceiptPage', {
            id,
        });
    }
    async showCreate({ inertia }) {
        const generatedInvoiceNumber = await GoodsReceipt.generateInvoiceNumber();
        return inertia.render('goodsReceipts/CreateGoodsReceiptPage', {
            generatedId: generatedInvoiceNumber,
        });
    }
    async list(c) {
        const res = await GoodsReceiptService.list(c);
        return c.response.status(res.code).json(res);
    }
    async stats(c) {
        const res = await GoodsReceiptService.stats(c);
        return c.response.status(res.code).json(res);
    }
    async detail(c) {
        const res = await GoodsReceiptService.detail(c);
        return c.response.status(res.code).json(res);
    }
    async create(c) {
        const res = await GoodsReceiptService.create(c);
        return c.response.status(res.code).json(res);
    }
    async downloadAttachment(c) {
        return await GoodsReceiptService.downloadAttachment(c);
    }
}
//# sourceMappingURL=goods_receipt_controller.js.map