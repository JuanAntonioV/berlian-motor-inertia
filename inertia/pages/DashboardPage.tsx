import { Head } from '@inertiajs/react'
import DashboardStatSection from '~/componets/sections/DashboardStatSection'
import PageTransition from '~/componets/transitions/PageTransition'
import AdminLayout from '~/layouts/AdminLayout'

const DashboardPage = () => {
  return (
    <PageTransition>
      <Head title="Dashboard" />

      <DashboardStatSection />
    </PageTransition>
  )
}

DashboardPage.layout = (page: React.ReactNode) => <AdminLayout children={page} />

export default DashboardPage
