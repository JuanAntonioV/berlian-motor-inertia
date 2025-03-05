import { Head } from '@inertiajs/react'
import { Card } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { deleteCategoryApi, getCategoryListApi } from '~/api/category_api'
import { categoryColumn } from '~/componets/columns/category_column'
import CategoryModal from '~/componets/modals/CategoryModal'
import SectionHeader from '~/componets/sections/SectionHeader'
import DataTable from '~/componets/tables/DataTable'
import PageTransition from '~/componets/transitions/PageTransition'
import AdminLayout from '~/layouts/AdminLayout'
import { TCategory } from '~/types'

const ManageCategoryPage = () => {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategoryListApi,
  })

  const queryClient = useQueryClient()

  const { mutate: deleteCategory, isPending: isDeleting } = useMutation({
    mutationFn: deleteCategoryApi,
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['categories'] })
    },
    onError: (err) => {
      toast.error(err?.message || 'Gagal menghapus kategori')
    },
  })

  const [categoryModalOpened, { open: openCategoryModal, close: closeCategoryModal }] =
    useDisclosure(false)

  const [categoryModalData, setCategoryModalData] = useState<TCategory | null>(null)

  return (
    <>
      <Head title="Kelola Kategori" />

      <CategoryModal
        data={categoryModalData}
        opened={categoryModalOpened}
        onClose={() => {
          closeCategoryModal()
          setCategoryModalData(null)
        }}
      />
      <PageTransition>
        <Card shadow="xs">
          <SectionHeader
            title="Tabel Kategori"
            description="Berisi tentang kategori yang ada di aplikasi"
          />
          <DataTable
            data={data?.data || []}
            columns={categoryColumn}
            loading={isPending || isDeleting}
            isError={isError}
            errorMessage={error?.message}
            enableRowSelection={false}
            onCreate={openCategoryModal}
            onEdit={(data) => {
              setCategoryModalData(data)
              openCategoryModal()
            }}
            onDelete={(id) => deleteCategory({ id })}
          />
        </Card>
      </PageTransition>
    </>
  )
}
ManageCategoryPage.layout = (page: React.ReactNode) => <AdminLayout children={page} />

export default ManageCategoryPage
