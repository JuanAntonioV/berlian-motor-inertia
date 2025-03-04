import { Head } from '@inertiajs/react'
import { Card } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { deleteTypeApi, getTypeListApi } from '~/api/type_api'
import { typeColumn } from '~/componets/columns/type_column'
import TypeModal from '~/componets/modals/TypeModal'
import SectionHeader from '~/componets/sections/SectionHeader'
import DataTable from '~/componets/tables/DataTable'
import PageTransition from '~/componets/transitions/PageTransition'
import AdminLayout from '~/layouts/AdminLayout'
import { TType } from '~/types'

const ManageTypePage = () => {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['types'],
    queryFn: getTypeListApi,
  })

  const queryClient = useQueryClient()

  const { mutate: deleteType, isPending: isDeleting } = useMutation({
    mutationFn: deleteTypeApi,
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['types'] })
    },
    onError: (err) => {
      toast.error(err?.message || 'Gagal menghapus tipe')
    },
  })

  const [typeModalOpened, { open: openTypeModal, close: closeTypeModal }] = useDisclosure(false)

  const [typeModalData, setTypeModalData] = useState<TType | null>(null)

  return (
    <>
      <Head title="Kelola Tipe" />

      <TypeModal
        data={typeModalData}
        opened={typeModalOpened}
        onClose={() => {
          closeTypeModal()
          setTypeModalData(null)
        }}
      />
      <PageTransition>
        <Card shadow="xs">
          <SectionHeader
            title="Tabel Tipe"
            description="Berisi tentang tipe yang ada di aplikasi"
          />
          <DataTable
            data={data?.data || []}
            columns={typeColumn}
            loading={isPending || isDeleting}
            isError={isError}
            errorMessage={error?.message}
            enableRowSelection={false}
            onCreate={openTypeModal}
            onEdit={(data) => {
              setTypeModalData(data)
              openTypeModal()
            }}
            onDelete={(id) => deleteType({ id })}
          />
        </Card>
      </PageTransition>
    </>
  )
}
ManageTypePage.layout = (page: React.ReactNode) => <AdminLayout children={page} />

export default ManageTypePage
