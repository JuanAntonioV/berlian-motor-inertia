import { Head } from '@inertiajs/react'
import { Card } from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import { SearchIcon } from 'lucide-react'
import { getReductionOfGoodsListApi } from '~/api/reduction_of_good_api'
import { reductionOfGoodsColumn } from '~/componets/columns/reductionOfGoodColumn'
import ReductionOfGoodStatSection from '~/componets/sections/ReductionOfGoodStatSection'
import SectionHeader from '~/componets/sections/SectionHeader'
import DataTable from '~/componets/tables/DataTable'
import PageTransition from '~/componets/transitions/PageTransition'
import AdminLayout from '~/layouts/AdminLayout'

const ManageReductionOfGoodPage = () => {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['reductionOfGoods'],
    queryFn: getReductionOfGoodsListApi,
  })

  return (
    <>
      <Head title="Kelola Pengeluaran Barang" />

      <PageTransition>
        <ReductionOfGoodStatSection />
        <Card shadow="xs">
          <SectionHeader
            title="Tabel Pengeluaran Barang"
            description="Berisi tentang pengeluaran barang yang ada di aplikasi"
          />
          <DataTable
            data={data?.data || []}
            columns={reductionOfGoodsColumn}
            loading={isPending}
            isError={isError}
            errorMessage={error?.message}
            enableRowSelection={false}
            createPath="/pengeluaran-barang/tambah"
            editAsDetail
            editPath="/pengeluaran-barang"
            editIcon={<SearchIcon />}
            editLabel="Detail"
          />
        </Card>
      </PageTransition>
    </>
  )
}

ManageReductionOfGoodPage.layout = (page) => <AdminLayout children={page} />

export default ManageReductionOfGoodPage
