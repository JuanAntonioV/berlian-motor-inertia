import { Head } from '@inertiajs/react'
import DashboardStatSection from '~/componets/sections/DashboardStatSection'
import PageTitle from '~/componets/titles/PageTitle'
import PageTransition from '~/componets/transitions/PageTransition'
import AdminLayout from '~/layouts/AdminLayout'

const DashboardPage = () => {
  return (
    <PageTransition>
      <Head title="Dashboard" />

      <PageTitle
        title="Dashboard"
        description="Selamat datang di dashboard. Anda dapat melihat statistik dan informasi penting lainnya di sini."
      />
      <DashboardStatSection />
    </PageTransition>
  )
}

DashboardPage.layout = (page: React.ReactNode) => <AdminLayout children={page} />

export default DashboardPage
