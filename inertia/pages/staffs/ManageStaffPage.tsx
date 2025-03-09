import { Head } from '@inertiajs/react'
import { Card } from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import { getStaffListApi } from '~/api/staff_api'
import { staffColumn } from '~/componets/columns/staff_column'
import SectionHeader from '~/componets/sections/SectionHeader'
import DataTable from '~/componets/tables/DataTable'
import PageTransition from '~/componets/transitions/PageTransition'
import AdminLayout from '~/layouts/AdminLayout'

const ManageStaffPage = () => {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['staffs'],
    queryFn: getStaffListApi,
  })

  return (
    <>
      <Head title="Kelola Karyawan" />

      <PageTransition>
        <Card shadow="xs">
          <SectionHeader
            title="Tabel Karyawan"
            description="Berisi tentang karyawan yang ada di aplikasi"
          />
          <DataTable
            data={data?.data || []}
            columns={staffColumn}
            loading={isPending}
            isError={isError}
            errorMessage={error?.message}
            enableRowSelection={false}
            createPath="/kelola-produk/tambah"
            editPath="/kelola-produk"
          />
        </Card>
      </PageTransition>
    </>
  )
}

ManageStaffPage.layout = (page: React.ReactNode) => <AdminLayout children={page} />

export default ManageStaffPage
