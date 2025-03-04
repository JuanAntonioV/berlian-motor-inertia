import { Head } from '@inertiajs/react'
import { Card } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { deleteBrandApi, getBrandListApi } from '~/api/brand_api'
import { brandColumn } from '~/componets/columns/brand_column'
import BrandModal from '~/componets/modals/BrandModal'
import DataTable from '~/componets/tables/DataTable'
import PageTitle from '~/componets/titles/PageTitle'
import PageTransition from '~/componets/transitions/PageTransition'
import AdminLayout from '~/layouts/AdminLayout'
import { TBrand } from '~/types'

const ManageBrandPage = () => {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['brands'],
    queryFn: getBrandListApi,
  })

  const queryClient = useQueryClient()

  const { mutate: deleteBrand, isPending: isDeleting } = useMutation({
    mutationFn: deleteBrandApi,
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['brands'] })
    },
    onError: (err) => {
      toast.error(err?.message || 'Gagal menghapus merek')
    },
  })

  const [brandModalOpened, { open: openBrandModal, close: closeBrandModal }] = useDisclosure(false)

  const [brandModalData, setBrandModalData] = useState<TBrand | null>(null)

  return (
    <>
      <Head title="Kelola Merek" />

      <BrandModal
        data={brandModalData}
        opened={brandModalOpened}
        onClose={() => {
          closeBrandModal()
          setBrandModalData(null)
        }}
      />
      <PageTransition>
        <PageTitle title="Tabel Merek" description="Berisi tentang merek yang ada di aplikasi" />

        <Card shadow="xs">
          <DataTable
            data={data?.data || []}
            columns={brandColumn}
            loading={isPending || isDeleting}
            isError={isError}
            errorMessage={error?.message}
            enableRowSelection={false}
            onCreate={openBrandModal}
            onEdit={(data) => {
              setBrandModalData(data)
              openBrandModal()
            }}
            onDelete={(id) => deleteBrand({ id })}
          />
        </Card>
      </PageTransition>
    </>
  )
}
ManageBrandPage.layout = (page: React.ReactNode) => <AdminLayout children={page} />

export default ManageBrandPage
