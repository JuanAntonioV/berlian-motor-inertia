import AnalyticService from '#services/analytic_service';
export default class DashboardController {
    async show({ inertia }) {
        return inertia.render('DashboardPage');
    }
    async stats(c) {
        const res = await AnalyticService.getDashboardStats(c);
        return c.response.status(res.code).json(res);
    }
}
//# sourceMappingURL=dashboard_controller.js.map