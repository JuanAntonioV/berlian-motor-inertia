import { Link } from '@inertiajs/react'
import { Alert, Button, Group, NumberInput, Select, Text, UnstyledButton } from '@mantine/core'
import { Modal, ModalProps, Stack } from '@mantine/core'
import { Form, useForm, zodResolver } from '@mantine/form'
import { useDisclosure } from '@mantine/hooks'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useMutation } from '@tanstack/react-query'
import { isEmpty } from 'lodash'
import { Info } from 'lucide-react'
import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { addProductStockApi } from '~/api/product_api'
import { getStorageListApi } from '~/api/storage_api'
import { stockSchema } from '~/lib/validators'
import { TStorage } from '~/types'

type Props = {
  productId: number
} & ModalProps

const AddProductStockModal = ({ productId, ...props }: Props) => {
  const {
    data: storages,
    isPending: isStoragesPending,
    isError: isStoragesError,
  } = useQuery({
    queryKey: ['storages'],
    queryFn: getStorageListApi,
    select: (res) => res.data,
  })

  const form = useForm({
    mode: 'uncontrolled',
    validate: zodResolver(stockSchema),
  })

  const queryClient = useQueryClient()

  const { mutate, isPending, error } = useMutation({
    mutationFn: addProductStockApi,
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['product-stock', { id: productId }] })
      form.reset()
      props.onClose()
      toast.success('Berhasil menambah stok')
    },
    onError: (err) => {
      toast.error(err?.message || 'Gagal menambah stok')
    },
  })

  const onSubmit = (values: typeof form.values) => {
    mutate({ ...values, id: productId })
  }

  const storageList = useMemo(() => {
    if (isEmpty(storages)) return []
    return (storages as TStorage[])?.map((storage) => ({
      label: storage.name,
      value: storage.id.toString(),
    }))
  }, [storages])

  const [showedInfoAlert, { toggle: toggleInfoAlert }] = useDisclosure(true)

  return (
    <Modal.Root
      {...props}
      onClose={() => {
        props.onClose()
        form.reset()
      }}
    >
      <Modal.Overlay />
      <Modal.Content radius={'lg'}>
        <Modal.Header className="border-b border-gray-300">
          <Modal.Title>Tambah Stok</Modal.Title>
          <Modal.CloseButton />
        </Modal.Header>

        <Form form={form} onSubmit={onSubmit}>
          <Modal.Body py={'lg'}>
            {error?.message ? (
              <Alert color="red" c={'red'} icon={<Info />} mb={'md'}>
                {error?.message || 'Gagal menambahkan stok'}
              </Alert>
            ) : (
              showedInfoAlert && (
                <Alert
                  color="blue"
                  c={'blue'}
                  icon={<Info />}
                  mb={'md'}
                  onClose={toggleInfoAlert}
                  withCloseButton
                >
                  Anda hanya dapat menambahkan stok awal sekali untuk setiap produk.
                </Alert>
              )
            )}

            <Stack gap={'md'}>
              <Select
                data={storageList}
                label="Rak Produk"
                placeholder="Pilih rak produk"
                withAsterisk
                disabled={isStoragesPending || isStoragesError}
                searchable
                descriptionProps={{ component: 'div' }}
                description={
                  <Text c={'gray.6'} fz={'xs'}>
                    Tidak menemukan rak?{' '}
                    <UnstyledButton fz={'xs'} c={'blue.5'} component={Link} href="/kelola-rak">
                      Tambah rak.
                    </UnstyledButton>
                  </Text>
                }
                clearable
                key={form.key('storageId')}
                {...form.getInputProps('storageId')}
                onChange={(value) => {
                  form.getInputProps('storageId').onChange(value)
                }}
              />

              <NumberInput
                label="Jumlah Stok"
                placeholder="Masukkan jumlah stok"
                withAsterisk
                min={0}
                key={form.key('quantity')}
                {...form.getInputProps('quantity')}
              />
            </Stack>
          </Modal.Body>
          <Stack component={'footer'} gap={'md'} p={'md'} className="border-t border-gray-300">
            <Group justify="end">
              <Button
                variant="outline"
                onClick={() => {
                  props.onClose()
                  form.reset()
                }}
              >
                Batal
              </Button>
              <Button type="submit" loading={isPending}>
                Simpan
              </Button>
            </Group>
          </Stack>
        </Form>
      </Modal.Content>
    </Modal.Root>
  )
}
export default AddProductStockModal
