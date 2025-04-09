import AnalyticService from '#services/analytic_service'
import type { HttpContext } from '@adonisjs/core/http'

export default class DashboardController {
  async show({ inertia }: HttpContext) {
    return inertia.render('DashboardPage')
  }

  async stats(c: HttpContext) {
    const res = await AnalyticService.getDashboardStats(c)
    return c.response.status(res.code).json(res)
  }
}
