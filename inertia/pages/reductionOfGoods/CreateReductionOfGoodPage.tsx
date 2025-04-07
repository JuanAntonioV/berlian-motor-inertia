import { Head, router, usePage } from '@inertiajs/react'
import {
  ActionIcon,
  Alert,
  Badge,
  Button,
  Card,
  Center,
  ComboboxItem,
  FileInput,
  Flex,
  NumberInput,
  OptionsFilter,
  rem,
  Select,
  SimpleGrid,
  Stack,
  Table,
  Textarea,
  TextInput,
} from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import { Form, useForm, zodResolver } from '@mantine/form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { isEmpty } from 'lodash'
import { Trash, Plus, Info } from 'lucide-react'
import { DateTime } from 'luxon'
import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { getProductListApi } from '~/api/product_api'
import { createReductionOfGoodsApi } from '~/api/reduction_of_good_api'
import { getStorageListApi } from '~/api/storage_api'
import SectionHeader from '~/componets/sections/SectionHeader'
import PageTitle from '~/componets/titles/PageTitle'
import PageTransition from '~/componets/transitions/PageTransition'
import AdminLayout from '~/layouts/AdminLayout'
import { formErrorResolver } from '~/lib/utils'
import { reductionOfGoodsSchema } from '~/lib/validators'
import { TProduct, TStorage } from '~/types'

const CreateReductionOfGoodPage = () => {
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
    validate: zodResolver(reductionOfGoodsSchema),
    initialValues: {
      id: generatedId,
      storageId: 0,
      reference: '',
      reducedAt: new Date(),
      attachment: null,
      notes: '',
      items: [{ id: -1, quantity: '', price: '' }],
    },
  })

  const selectedStorageId = form.getValues().storageId

  const {
    data: products,
    isPending: isProductsPending,
    isError: isProductsError,
  } = useQuery({
    queryKey: ['products', { storageId: selectedStorageId }],
    queryFn: () => getProductListApi({ storageId: selectedStorageId }),
    select: (res) => res.data,
  })

  const queryClient = useQueryClient()

  const { mutate, isPending, error } = useMutation({
    mutationFn: createReductionOfGoodsApi,
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['reductionOfGoods'] })
      queryClient.refetchQueries({ queryKey: ['products'] })
      queryClient.refetchQueries({ queryKey: ['reductionOfGoodStats'] })
      toast.success('Berhasil menyimpan transaksi!')
      router.visit('/pengeluaran-barang')
    },
    onError: (err) => {
      form.setErrors(formErrorResolver(err.errors))
    },
  })

  const onSubmit = (values: typeof form.values) => {
    mutate({
      ...values,
      reducedAt: DateTime.fromJSDate(new Date(values.reducedAt)).toISODate({ format: 'extended' }),
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

  const getCurrentProductAvailableStock = (productId: number, storageId: number) => {
    const product = products?.find((item) => item.id === productId)
    return product?.stocks?.find((item) => item.storageId === storageId)?.quantity || 0
  }

  return (
    <>
      <Head title="Pengeluaran Barang" />

      <PageTransition>
        <Form form={form} onSubmit={onSubmit}>
          <PageTitle
            title="Tambah Pengeluaran Barang"
            description="Merupakan halaman untuk menambah pengeluaran barang baru ke dalam sistem."
          >
            <Button type="submit" loading={isPending}>
              Simpan
            </Button>
          </PageTitle>
          <Stack>
            <Card shadow="xs">
              <SectionHeader title="Informasi Pengeluaran" />

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
                    placeholder="Pilih tanggal penerimaan"
                    label="Tanggal Penerimaan"
                    withAsterisk
                    highlightToday
                    valueFormat="DD MMMM YYYY"
                    key={form.key('reducedAt')}
                    {...form.getInputProps('reducedAt')}
                  />
                  <TextInput
                    placeholder="Masukkan referensi"
                    label="Referensi"
                    key={form.key('reference')}
                    {...form.getInputProps('reference')}
                  />
                </SimpleGrid>
                <Select
                  data={storageList}
                  label="Rak Penyimpanan Barang"
                  placeholder="Pilih rak penyimpanan barang"
                  withAsterisk
                  disabled={isStoragesPending || isStoragesError}
                  searchable
                  descriptionProps={{ component: 'div' }}
                  clearable
                  key={form.key('storageId')}
                  {...form.getInputProps('storageId')}
                  onChange={(value) => {
                    form.getInputProps('storageId').onChange(value)
                  }}
                />
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
                      <Table.Th>Harga</Table.Th>
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
                              isEmpty(form.getValues()?.storageId)
                            }
                            searchable
                            withAsterisk
                            filter={optionsFilter}
                            key={form.key(`items.${index}.id`)}
                            {...form.getInputProps(`items.${index}.id`)}
                            onChange={(value) => {
                              form.getInputProps(`items.${index}.id`).onChange(value)
                              const selectedProduct =
                                products?.find((item) => item.id === Number(value))?.salePrice || 0

                              form.setFieldValue(`items.${index}.price`, selectedProduct)
                            }}
                          />
                        </Table.Td>
                        <Table.Td>
                          <Flex align={'center'} gap={'sm'}>
                            <NumberInput
                              placeholder="Masukkan jumlah barang"
                              withAsterisk
                              hideControls
                              w={'100%'}
                              max={getCurrentProductAvailableStock(
                                Number(form.getValues().items[index].id),
                                Number(form.getValues().storageId)
                              )}
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
                                Number(form.getValues().storageId)
                              )}
                            </Badge>
                          </Flex>
                        </Table.Td>
                        <Table.Td>
                          <NumberInput
                            placeholder="Masukkan harga barang"
                            withAsterisk
                            decimalSeparator=","
                            thousandSeparator="."
                            prefix="Rp "
                            allowNegative={false}
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
                                quantity: '',
                                price: '',
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

CreateReductionOfGoodPage.layout = (page) => <AdminLayout children={page} />
export default CreateReductionOfGoodPage
