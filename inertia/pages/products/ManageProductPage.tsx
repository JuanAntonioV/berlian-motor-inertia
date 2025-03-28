import { Head } from '@inertiajs/react'
import { Card } from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import { getProductListApi } from '~/api/product_api'
import { productColumn } from '~/componets/columns/product_column'
import SectionHeader from '~/componets/sections/SectionHeader'
import DataTable from '~/componets/tables/DataTable'
import PageTransition from '~/componets/transitions/PageTransition'
import AdminLayout from '~/layouts/AdminLayout'

const ManageProductPage = () => {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['products'],
    queryFn: () => getProductListApi(),
  })

  return (
    <>
      <Head title="Kelola Produk" />

      <PageTransition>
        <Card shadow="xs">
          <SectionHeader
            title="Tabel Produk"
            description="Berisi tentang produk yang ada di aplikasi"
          />
          <DataTable
            data={data?.data || []}
            columns={productColumn}
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
ManageProductPage.layout = (page: React.ReactNode) => <AdminLayout children={page} />

export default ManageProductPage
