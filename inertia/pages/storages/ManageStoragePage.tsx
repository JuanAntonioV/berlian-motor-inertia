import { Head } from '@inertiajs/react'
import { Card } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { deleteStorageApi, getStorageListApi } from '~/api/storage_api'
import { storageColumn } from '~/componets/columns/storage_column'
import StorageModal from '~/componets/modals/StorageModal'
import SectionHeader from '~/componets/sections/SectionHeader'
import DataTable from '~/componets/tables/DataTable'
import PageTransition from '~/componets/transitions/PageTransition'
import AdminLayout from '~/layouts/AdminLayout'
import { TStorage } from '~/types'

const ManageStoragePage = () => {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['storages'],
    queryFn: getStorageListApi,
  })

  const queryClient = useQueryClient()

  const { mutate: deleteStorage, isPending: isDeleting } = useMutation({
    mutationFn: deleteStorageApi,
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['storages'] })
    },
    onError: (err) => {
      toast.error(err?.message || 'Gagal menghapus rak')
    },
  })

  const [storageModalOpened, { open: openStorageModal, close: closeStorageModal }] =
    useDisclosure(false)

  const [storageModalData, setStorageModalData] = useState<TStorage | null>(null)

  return (
    <>
      <Head title="Kelola Rak" />

      <StorageModal
        data={storageModalData}
        opened={storageModalOpened}
        onClose={() => {
          closeStorageModal()
          setStorageModalData(null)
        }}
      />
      <PageTransition>
        <Card shadow="xs">
          <SectionHeader title="Tabel Rak" description="Berisi tentang rak yang ada di aplikasi" />
          <DataTable
            data={data?.data || []}
            columns={storageColumn}
            loading={isPending || isDeleting}
            isError={isError}
            errorMessage={error?.message}
            enableRowSelection={false}
            onCreate={openStorageModal}
            onEdit={(data) => {
              setStorageModalData(data)
              openStorageModal()
            }}
            onDelete={(id) => deleteStorage({ id })}
          />
        </Card>
      </PageTransition>
    </>
  )
}
ManageStoragePage.layout = (page: React.ReactNode) => <AdminLayout children={page} />

export default ManageStoragePage
