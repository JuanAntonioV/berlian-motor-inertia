import { Head, router, usePage } from '@inertiajs/react'
import { Button } from '@mantine/core'
import { useMutation } from '@tanstack/react-query'
import { logoutApi } from '~/api/auth_api'
import AdminLayout from '~/layouts/AdminLayout'

const DashboardPage = () => {
  const { mutate, isPending } = useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      router.visit('/auth/login')
    },
  })

  const props = usePage().props

  return (
    <div className="flex-center flex-col gap-4 h-screen">
      <Head title="Dashboard" />
      <h1>DashboardPage</h1>
      <pre>{JSON.stringify(props.user, null, 2)}</pre>
      <Button onClick={() => mutate()} loading={isPending}>
        Logout
      </Button>
    </div>
  )
}

DashboardPage.layout = (page: React.ReactNode) => <AdminLayout children={page} />

export default DashboardPage
