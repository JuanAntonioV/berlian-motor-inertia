import { HttpContext } from '@adonisjs/core/http'
import ResponseHelper from '../helpers/response_helper.js'
import GoodsReceipt from '#models/goods_receipt'
import ReductionOfGood from '#models/reduction_of_good'
import Product from '#models/product'
import ProductStock from '#models/product_stock'

export default class AnalyticService {
  static async getDashboardStats({}: HttpContext = {}) {
    try {
      const totalIncomeQuery = GoodsReceipt.query().sum('totalAmount', 'total').firstOrFail()
      const totalOutcomeQuery = ReductionOfGood.query().sum('totalAmount', 'total').firstOrFail()
      const totalProductQuery = Product.query().count('id', 'total').firstOrFail()
      const totalStocksQuery = ProductStock.query().sum('quantity', 'total').firstOrFail()

      const lastUpdated = new Date().toISOString()

      const [totalIncome, totalOutcome, totalProduct, totalStocks] = await Promise.all([
        totalIncomeQuery,
        totalOutcomeQuery,
        totalProductQuery,
        totalStocksQuery,
      ])

      return ResponseHelper.okResponse({
        totalIncome: totalIncome.$extras.total,
        totalOutcome: totalOutcome.$extras.total,
        totalProduct: totalProduct.$extras.total,
        totalStocks: totalStocks.$extras.total,
        lastUpdated,
      })
    } catch (err) {
      return ResponseHelper.serverErrorResponse(err.message)
    }
  }
}
