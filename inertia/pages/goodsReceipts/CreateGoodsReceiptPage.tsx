import { Head, router, usePage } from '@inertiajs/react'
import { Alert, ComboboxItem } from '@mantine/core'
import {
  ActionIcon,
  Button,
  Card,
  Center,
  FileInput,
  NumberInput,
  rem,
  Select,
  SimpleGrid,
  Stack,
  Table,
  Text,
  Textarea,
  TextInput,
  UnstyledButton,
} from '@mantine/core'
import { DateInput } from '@mantine/dates'
import { Form, useForm, zodResolver } from '@mantine/form'
import { useDisclosure } from '@mantine/hooks'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { isEmpty } from 'lodash'
import { Info, Plus, Trash } from 'lucide-react'
import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { createGoodsReceiptApi } from '~/api/goods_receipt_api'
import { getProductListApi } from '~/api/product_api'
import { getStorageListApi } from '~/api/storage_api'
import StorageModal from '~/componets/modals/StorageModal'
import SectionHeader from '~/componets/sections/SectionHeader'
import PageTitle from '~/componets/titles/PageTitle'
import PageTransition from '~/componets/transitions/PageTransition'
import AdminLayout from '~/layouts/AdminLayout'
import { formErrorResolver } from '~/lib/utils'
import { goodsReceiptSchema } from '~/lib/validators'
import { TProduct, TStorage } from '~/types'

const CreateGoodsReceiptPage = () => {
  const { generatedId } = usePage().props

  const {
    data: storages,
    isPending: isStoragesPending,
    isError: isStoragesError,
  } = useQuery({
    queryKey: ['storages'],
    queryFn: getStorageListApi,
    select: (res) => res.data,
  })
  const {
    data: products,
    isPending: isProductsPending,
    isError: isProductsError,
  } = useQuery({
    queryKey: ['products'],
    queryFn: getProductListApi,
    select: (res) => res.data,
  })

  const form = useForm({
    mode: 'uncontrolled',
    validate: zodResolver(goodsReceiptSchema),
    initialValues: {
      id: generatedId,
      storageId: 0,
      reference: '',
      supplierName: '',
      receiptDate: new Date(),
      image: null,
      notes: '',
      items: [{ id: -1, quantity: 0, price: 0 }],
    },
  })

  const queryClient = useQueryClient()

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: createGoodsReceiptApi,
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['goodsReceipts'] })
      toast.success('Berhasil menyimpan transaksi!')
      router.visit('/penerimaan-barang')
    },
    onError: (err) => {
      form.setErrors(formErrorResolver(err.errors))
    },
  })

  const onSubmit = (values: typeof form.values) => {
    mutate(values)
  }

  const storageList = useMemo(() => {
    if (isEmpty(storages)) return []
    return (storages as TStorage[])?.map((storage) => ({
      label: storage.name,
      value: storage.id.toString(),
    }))
  }, [storages])

  const [openedStorageModal, { open: openStorageModal, close: closeStorageModal }] = useDisclosure()

  const items = form.getValues()?.items

  const productList = useMemo(() => {
    if (isEmpty(products)) return []
    return (products as TProduct[]).map((product) => ({
      label: `${product.name} - ${product.sku}`,
      value: product.id.toString(),
    }))
  }, [products, items])

  return (
    <>
      <Head title="Penerimaan Barang" />

      <StorageModal
        opened={openedStorageModal}
        onClose={closeStorageModal}
        onCreatedId={(id) => {
          if (id) form.getInputProps('storageId').onChange({ value: [id.toString()] })
        }}
      />

      <PageTransition>
        <Form form={form} onSubmit={onSubmit}>
          <PageTitle
            title="Tambah Penerimaan Barang"
            description="Merupakan halaman untuk menambah penerimaan barang baru ke dalam sistem."
          >
            <Button type="submit" loading={isPending}>
              Simpan
            </Button>
          </PageTitle>
          <Stack>
            <Card shadow="xs">
              <SectionHeader title="Informasi Penerimaan" />

              {isError && (
                <Alert color="red" c={'red'} icon={<Info />}>
                  {error?.message}
                </Alert>
              )}

              <Stack>
                <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing={'lg'}>
                  <TextInput
                    placeholder="Masukkan nomor transaksi"
                    label="Nomor Transaksi"
                    withAsterisk
                    key={form.key('id')}
                    {...form.getInputProps('id')}
                  />
                  <DateInput
                    placeholder="Pilih tanggal penerimaan"
                    label="Tanggal Penerimaan"
                    withAsterisk
                    highlightToday
                    key={form.key('receiptDate')}
                    {...form.getInputProps('receiptDate')}
                  />
                  <TextInput
                    placeholder="Masukkan referensi"
                    label="Referensi"
                    key={form.key('reference')}
                    {...form.getInputProps('reference')}
                  />
                </SimpleGrid>
                <TextInput
                  placeholder="Masukkan nama pemasok"
                  label="Nama Pemasok"
                  withAsterisk
                  autoFocus
                  key={form.key('supplierName')}
                  {...form.getInputProps('supplierName')}
                />
                <Select
                  data={storageList}
                  label="Rak Penyimpanan Barang"
                  placeholder="Pilih rak penyimpanan barang"
                  withAsterisk
                  disabled={isStoragesPending || isStoragesError}
                  searchable
                  descriptionProps={{ component: 'div' }}
                  description={
                    <Text c={'gray.6'} fz={'xs'}>
                      Tidak menemukan rak?{' '}
                      <UnstyledButton fz={'xs'} c={'blue.5'} onClick={openStorageModal}>
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
                <FileInput
                  accept="image/*"
                  placeholder="Pilih file lampiran"
                  label="Unggah Lampiran"
                  clearable
                  key={form.key('image')}
                  {...form.getInputProps('image')}
                />
                <Textarea
                  placeholder="Masukkan keterangan tambahan"
                  label="Keterangan"
                  rows={3}
                  key={form.key('notes')}
                  {...form.getInputProps('notes')}
                />
              </Stack>
            </Card>
            <Card shadow="xs">
              <SectionHeader title="List Barang" />

              <Stack>
                <Table striped>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Aksi</Table.Th>
                      <Table.Th>Nama Barang</Table.Th>
                      <Table.Th>QTY</Table.Th>
                      <Table.Th>Harga</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {items?.map((_, index) => (
                      <Table.Tr key={index}>
                        <Table.Td align="center" w={rem(46)}>
                          <ActionIcon
                            size={'lg'}
                            color="red"
                            onClick={() => form.removeListItem('items', index)}
                          >
                            <Trash size={16} />
                          </ActionIcon>
                        </Table.Td>
                        <Table.Td>
                          <Select
                            data={productList}
                            placeholder="Pilih nama barang"
                            disabled={isProductsPending || isProductsError}
                            searchable
                            withAsterisk
                            filter={({ options }) => {
                              return (options as ComboboxItem[]).filter((option) => {
                                return !items.some(
                                  (item) => String(item.id) === String(option.value)
                                )
                              })
                            }}
                            key={form.key(`items.${index}.id`)}
                            {...form.getInputProps(`items.${index}.id`)}
                          />
                        </Table.Td>
                        <Table.Td>
                          <NumberInput
                            placeholder="Masukkan jumlah barang"
                            withAsterisk
                            hideControls
                            decimalSeparator=","
                            thousandSeparator="."
                            key={form.key(`items.${index}.quantity`)}
                            {...form.getInputProps(`items.${index}.quantity`)}
                          />
                        </Table.Td>
                        <Table.Td>
                          <NumberInput
                            placeholder="Masukkan harga barang"
                            withAsterisk
                            decimalSeparator=","
                            thousandSeparator="."
                            prefix="Rp "
                            hideControls
                            key={form.key(`items.${index}.price`)}
                            {...form.getInputProps(`items.${index}.price`)}
                          />
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                  <Table.Tfoot>
                    <Table.Tr>
                      <Table.Th colSpan={4}>
                        <Center w={'100%'}>
                          <Button
                            variant="outline"
                            onClick={() =>
                              form.insertListItem('items', {
                                id: -1,
                                quantity: 0,
                                price: 0,
                              })
                            }
                            leftSection={<Plus size={16} />}
                          >
                            Tambah Barang
                          </Button>
                        </Center>
                      </Table.Th>
                    </Table.Tr>
                  </Table.Tfoot>
                </Table>
              </Stack>
            </Card>
          </Stack>
        </Form>
      </PageTransition>
    </>
  )
}

CreateGoodsReceiptPage.layout = (page: React.ReactNode) => <AdminLayout children={page} />

export default CreateGoodsReceiptPage
