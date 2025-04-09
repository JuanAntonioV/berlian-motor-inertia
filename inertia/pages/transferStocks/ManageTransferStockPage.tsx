import { Head } from '@inertiajs/react'
import { Card } from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import { SearchIcon } from 'lucide-react'
import { getTransferStockListApi } from '~/api/transfer_stock_api'
import { transferStockColumn } from '~/componets/columns/transfer_column'
import SectionHeader from '~/componets/sections/SectionHeader'
import DataTable from '~/componets/tables/DataTable'
import PageTransition from '~/componets/transitions/PageTransition'
import AdminLayout from '~/layouts/AdminLayout'

const ManageTransferStockPage = () => {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['transferStocks'],
    queryFn: getTransferStockListApi,
  })

  return (
    <>
      <Head title="Kelola Transfer Barang" />

      <PageTransition>
        <Card shadow="xs">
          <SectionHeader
            title="Tabel Transfer Barang"
            description="Berisi tentang transfer barang yang ada di aplikasi"
          />
          <DataTable
            data={data?.data || []}
            columns={transferStockColumn}
            loading={isPending}
            isError={isError}
            errorMessage={error?.message}
            enableRowSelection={false}
            createPath="/transfer-barang/tambah"
            editAsDetail
            editPath="/transfer-barang"
            editIcon={<SearchIcon />}
            editLabel="Detail"
          />
        </Card>
      </PageTransition>
    </>
  )
}
ManageTransferStockPage.layout = (page) => <AdminLayout children={page} />
export default ManageTransferStockPage
