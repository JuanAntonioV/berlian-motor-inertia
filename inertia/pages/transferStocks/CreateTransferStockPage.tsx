import { Head, router, usePage } from '@inertiajs/react'
import {
  OptionsFilter,
  ComboboxItem,
  Button,
  Stack,
  Card,
  Alert,
  SimpleGrid,
  ActionIcon,
  Center,
  NumberInput,
  rem,
  Select,
  Textarea,
  TextInput,
  FileInput,
  Table,
  Badge,
  Flex,
} from '@mantine/core'
import { Form, useForm, zodResolver } from '@mantine/form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { isEmpty } from 'lodash'
import { DateTime } from 'luxon'
import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { createTransferStockApi } from '~/api/transfer_stock_api'
import { getProductListApi } from '~/api/product_api'
import { getStorageListApi } from '~/api/storage_api'
import PageTransition from '~/componets/transitions/PageTransition'
import AdminLayout from '~/layouts/AdminLayout'
import { formErrorResolver } from '~/lib/utils'
import { transferStockSchema } from '~/lib/validators'
import { TStorage, TProduct } from '~/types'
import PageTitle from '~/componets/titles/PageTitle'
import SectionHeader from '~/componets/sections/SectionHeader'
import { Info, Plus, Trash } from 'lucide-react'
import { DatePickerInput } from '@mantine/dates'

const CreateTransferStockPage = () => {
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

  const form = useForm({
    mode: 'uncontrolled',
    validate: zodResolver(transferStockSchema),
    initialValues: {
      id: generatedId,
      reference: '',
      transferedAt: new Date(),
      sourceStorageId: 0,
      destinationStorageId: 0,
      attachment: null,
      notes: '',
      items: [{ id: -1, quantity: '' }],
    },
  })

  const [selectedSourceStorageId, setSelectedSourceStorageId] = useState<number | null>(null)

  form.watch('sourceStorageId', ({ value }) => {
    setSelectedSourceStorageId(value)
  })

  const {
    data: products,
    isPending: isProductsPending,
    isError: isProductsError,
  } = useQuery({
    queryKey: ['products', { storageId: selectedSourceStorageId }],
    queryFn: () => getProductListApi({ storageId: selectedSourceStorageId || undefined }),
    select: (res) => res.data,
  })

  const queryClient = useQueryClient()

  const { mutate, isPending, error } = useMutation({
    mutationFn: createTransferStockApi,
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['transferStocks'] })
      queryClient.refetchQueries({ queryKey: ['products'] })
      queryClient.refetchQueries({ queryKey: ['transferStockStats'] })
      toast.success('Berhasil menyimpan transaksi!')
      router.visit('/transfer-barang')
    },
    onError: (err) => {
      form.setErrors(formErrorResolver(err.errors))
    },
  })

  const onSubmit = (values: typeof form.values) => {
    mutate({
      ...values,
      transferedAt: DateTime.fromJSDate(new Date(values.transferedAt)).toISODate({
        format: 'extended',
      }),
    })
  }

  const storageList = useMemo(() => {
    if (isEmpty(storages)) return []
    return (storages as TStorage[])?.map((storage) => ({
      label: storage.name,
      value: storage.id.toString(),
    }))
  }, [storages])

  const productList = useMemo(() => {
    if (isEmpty(products)) return []
    return (products as TProduct[]).map((product) => ({
      label: `${product.name} - ${product.sku}`,
      value: product.id.toString(),
    }))
  }, [products])

  const optionsFilter: OptionsFilter = ({ options }) => {
    return (options as ComboboxItem[]).filter((option) => {
      return !form.getValues()?.items.some((item) => String(item.id) === String(option.value))
    })
  }

  const storageDestinationFilter: OptionsFilter = ({ options }) => {
    return (options as ComboboxItem[]).filter((option) => {
      return String(form.getValues()?.sourceStorageId) !== String(option.value)
    })
  }

  const getCurrentProductAvailableStock = (productId: number, storageId: number) => {
    const product = products?.find((item) => item.id === productId)
    return product?.stocks?.find((item) => item.storageId === storageId)?.quantity || 0
  }

  return (
    <>
      <Head title="Transfer Barang" />

      <PageTransition>
        <Form form={form} onSubmit={onSubmit}>
          <PageTitle
            title="Tambah Transfer Barang"
            description="Merupakan halaman untuk menambah transfer barang baru ke dalam sistem."
          >
            <Button type="submit" loading={isPending}>
              Simpan
            </Button>
          </PageTitle>
          <Stack>
            <Card shadow="xs">
              <SectionHeader title="Informasi Transfer" />

              {error?.message && (
                <Alert color="red" c={'red'} icon={<Info />} mb={'md'}>
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
                  <DatePickerInput
                    placeholder="Pilih tanggal transfer"
                    label="Tanggal Transfer"
                    withAsterisk
                    highlightToday
                    valueFormat="DD MMMM YYYY"
                    key={form.key('transferedAt')}
                    {...form.getInputProps('transferedAt')}
                  />
                  <TextInput
                    placeholder="Masukkan referensi"
                    label="Referensi"
                    key={form.key('reference')}
                    {...form.getInputProps('reference')}
                  />
                </SimpleGrid>
                <SimpleGrid cols={{ base: 1, md: 2 }} spacing={'lg'}>
                  <Select
                    data={storageList}
                    label="Rak Penyimpanan Asal"
                    placeholder="Pilih rak penyimpanan barang"
                    withAsterisk
                    disabled={isStoragesPending || isStoragesError}
                    searchable
                    descriptionProps={{ component: 'div' }}
                    clearable
                    onClear={() => {
                      form.setFieldValue('sourceStorageId', 0)
                      form.setFieldValue('destinationStorageId', 0)
                      if (
                        form.getValues().items.length > 1 ||
                        form.getValues().items.some((item) => item.id !== -1)
                      ) {
                        form.removeListItem('items', form.getValues().items.length - 1)
                      }
                    }}
                    key={form.key('sourceStorageId')}
                    {...form.getInputProps('sourceStorageId')}
                    onChange={(value) => {
                      form.getInputProps('sourceStorageId').onChange(value)
                      if (
                        form.getValues().items.length > 1 ||
                        form.getValues().items.some((item) => item.id !== -1)
                      ) {
                        form.removeListItem('items', form.getValues().items.length - 1)
                      }
                    }}
                  />
                  <Select
                    data={storageList}
                    label="Rak Tujuan"
                    placeholder="Pilih rak tujuan barang"
                    withAsterisk
                    disabled={isStoragesPending || isStoragesError}
                    searchable
                    descriptionProps={{ component: 'div' }}
                    clearable
                    onClear={() => {
                      form.setFieldValue('destinationStorageId', 0)
                    }}
                    filter={storageDestinationFilter}
                    key={form.key('destinationStorageId')}
                    {...form.getInputProps('destinationStorageId')}
                    onChange={(value) => {
                      form.getInputProps('destinationStorageId').onChange(value)
                    }}
                  />
                </SimpleGrid>
                <FileInput
                  accept="image/*, application/pdf"
                  placeholder="Pilih file lampiran"
                  label="Upload Lampiran"
                  clearable
                  key={form.key('attachment')}
                  {...form.getInputProps('attachment')}
                  onChange={(file) => {
                    form.getInputProps('attachment').onChange(file)
                  }}
                />
                <Textarea
                  placeholder="Masukkan catatan tambahan"
                  label="Catatan"
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
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {form.getValues()?.items?.map((_, index) => (
                      <Table.Tr key={index}>
                        <Table.Td align="center" w={rem(46)}>
                          <ActionIcon
                            size={'lg'}
                            color="red"
                            onClick={() => form.removeListItem('items', index)}
                            disabled={form.getValues().items.length === 1}
                          >
                            <Trash size={16} />
                          </ActionIcon>
                        </Table.Td>
                        <Table.Td>
                          <Select
                            data={productList}
                            placeholder="Pilih nama barang"
                            disabled={
                              isProductsPending ||
                              isProductsError ||
                              isStoragesPending ||
                              isEmpty(form.getValues().sourceStorageId)
                            }
                            searchable
                            withAsterisk
                            filter={optionsFilter}
                            key={form.key(`items.${index}.id`)}
                            {...form.getInputProps(`items.${index}.id`)}
                          />
                        </Table.Td>
                        <Table.Td>
                          <Flex align={'center'} gap={'sm'}>
                            <NumberInput
                              placeholder="Masukkan jumlah barang"
                              withAsterisk
                              hideControls
                              w={'100%'}
                              allowNegative={false}
                              decimalSeparator=","
                              thousandSeparator="."
                              key={form.key(`items.${index}.quantity`)}
                              {...form.getInputProps(`items.${index}.quantity`)}
                            />
                            <Badge className="min-w-max !capitalize">
                              Sisa Stok:{' '}
                              {getCurrentProductAvailableStock(
                                Number(form.getValues().items[index].id),
                                Number(form.getValues().sourceStorageId)
                              )}
                            </Badge>
                          </Flex>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                  <Table.Tfoot>
                    <Table.Tr>
                      <Table.Th colSpan={5}>
                        <Center w={'100%'}>
                          <Button
                            variant="outline"
                            onClick={() =>
                              form.insertListItem('items', {
                                id: -1,
                                quantity: '',
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
CreateTransferStockPage.layout = (page) => <AdminLayout children={page} />
export default CreateTransferStockPage
