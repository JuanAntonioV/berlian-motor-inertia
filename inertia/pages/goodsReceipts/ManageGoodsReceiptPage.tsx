import { Head } from '@inertiajs/react'
import { Card } from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import { SearchIcon } from 'lucide-react'
import { getGoodsReceiptListApi } from '~/api/goods_receipt_api'
import { goodsReceiptColumn } from '~/componets/columns/goods_receipt_column'
import GoodsReceiptStatSection from '~/componets/sections/GoodsReceiptStatSection'
import SectionHeader from '~/componets/sections/SectionHeader'
import DataTable from '~/componets/tables/DataTable'
import PageTransition from '~/componets/transitions/PageTransition'
import AdminLayout from '~/layouts/AdminLayout'

const ManageGoodsReceiptPage = () => {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['goodsReceipts'],
    queryFn: getGoodsReceiptListApi,
  })

  return (
    <>
      <Head title="Kelola Penerimaan Barang" />

      <PageTransition>
        <GoodsReceiptStatSection />
        <Card shadow="xs">
          <SectionHeader
            title="Tabel Penerimaan Barang"
            description="Berisi tentang penerimaan barang yang ada di aplikasi"
          />
          <DataTable
            data={data?.data || []}
            columns={goodsReceiptColumn}
            loading={isPending}
            isError={isError}
            errorMessage={error?.message}
            enableRowSelection={false}
            createPath="/penerimaan-barang/tambah"
            editAsDetail
            editPath="/penerimaan-barang"
            editIcon={<SearchIcon />}
            editLabel="Detail"
          />
        </Card>
      </PageTransition>
    </>
  )
}
ManageGoodsReceiptPage.layout = (page: React.ReactNode) => <AdminLayout children={page} />

export default ManageGoodsReceiptPage
