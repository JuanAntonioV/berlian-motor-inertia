import { Head, Link, router, usePage } from '@inertiajs/react'
import {
  Alert,
  AspectRatio,
  Button,
  Card,
  FileButton,
  Flex,
  Grid,
  Image,
  Loader,
  LoadingOverlay,
  MultiSelect,
  NumberInput,
  rem,
  Select,
  SimpleGrid,
  Stack,
  Text,
  Textarea,
  TextInput,
} from '@mantine/core'
import { modals } from '@mantine/modals'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { StatusCodes } from 'http-status-codes'
import { AlertCircleIcon, ArrowLeft, CircleAlert, Info } from 'lucide-react'
import toast from 'react-hot-toast'
import { deleteProductApi, getProductDetail, updateProductApi } from '~/api/product_api'
import SectionHeader from '~/componets/sections/SectionHeader'
import PageTitle from '~/componets/titles/PageTitle'
import PageTransition from '~/componets/transitions/PageTransition'
import AdminLayout from '~/layouts/AdminLayout'
import NotFound from '../errors/not_found'
import { Form, useForm, zodResolver } from '@mantine/form'
import { productSchema } from '~/lib/validators'
import Brand from '#models/brand'
import { isEmpty } from 'lodash'
import { useEffect, useState, useMemo } from 'react'
import { formErrorResolver } from '~/lib/utils'
import { Group } from '@mantine/core'
import ProductStockTable from '~/componets/tables/ProductStockTable'

const EditProductPage = () => {
  const { id } = usePage().props
  const serverProps = usePage().props

  const { data, isPending, error } = useQuery({
    queryKey: ['product-detail', { id }],
    queryFn: () => getProductDetail({ id: Number(id!) }),
    enabled: !!id,
    select: (res) => res.data,
  })

  const { mutate: deleteProduct, isPending: isDeleting } = useMutation({
    mutationFn: deleteProductApi,
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['products'] })
      queryClient.refetchQueries({ queryKey: ['product-detail', { id: Number(id!) }], exact: true })
      queryClient.refetchQueries({ queryKey: ['product-list'] })
      toast.success('Produk berhasil dihapus')
      router.visit('/kelola-produk')
    },
    onError: (err) => {
      toast.error(err?.message || 'Gagal menghapus rak')
    },
  })

  const form = useForm({
    mode: 'uncontrolled',
    validate: zodResolver(productSchema),
  })

  useEffect(() => {
    if (data) {
      form.setValues({
        ...data,
        categoryIds: data.categories.map((category) => category.id.toString()),
        image: null,
        brandId: data.brandId.toString(),
        typeId: data.typeId.toString(),
      })

      if (data.image) {
        setPreviewImage(data.image)
      }
    }
  }, [data])

  const queryClient = useQueryClient()

  const {
    mutate: updateProduct,
    isPending: isUpdatePending,
    isError: isUpdateError,
    error: updateError,
  } = useMutation({
    mutationFn: updateProductApi,
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['products'] })
      queryClient.refetchQueries({ queryKey: ['product-detail', { id: Number(id!) }], exact: true })
      toast.success('Produk berhasil diubah')
    },
    onError: (err) => {
      form.setErrors(formErrorResolver(err?.errors))
    },
  })

  const onSubmit = (values: typeof form.values) => {
    updateProduct({
      id,
      ...values,
    })
  }

  const [previewImage, setPreviewImage] = useState<string | null>(null)

  const onImageChange = (file: File | null) => {
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setPreviewImage(reader.result as string)
      }
      reader.readAsDataURL(file)
      form.getInputProps('image').onChange(file)
    }
  }

  const brandList = useMemo(() => {
    if (isEmpty(serverProps?.brandList)) return []
    return (serverProps?.brandList as Brand[])?.map((brand) => ({
      label: brand.name,
      value: brand.id.toString(),
    }))
  }, [serverProps?.brandList])

  const typeList = useMemo(() => {
    if (isEmpty(serverProps?.typeList)) return []
    return (serverProps?.typeList as Brand[])?.map((type) => ({
      label: type.name,
      value: type.id.toString(),
    }))
  }, [serverProps?.typeList])

  const categoryList = useMemo(() => {
    if (isEmpty(serverProps?.categoryList)) return []
    return (serverProps?.categoryList as Brand[])?.map((category) => ({
      label: category.name,
      value: category.id.toString(),
    }))
  }, [serverProps?.categoryList])

  const confirmDeleteModal = () =>
    modals.openConfirmModal({
      centered: true,
      withCloseButton: false,
      size: 'sm',
      radius: 'lg',
      children: (
        <div className="flex-center flex-col gap-4 py-6">
          <CircleAlert size={62} color="red" />
          <Text size="sm" ta={'center'}>
            Apakah Anda yakin ingin menghapus produk ini dari aplikasi?
          </Text>
        </div>
      ),
      trapFocus: false,
      labels: { confirm: 'Ya', cancel: 'Batal' },
      confirmProps: { color: 'red', w: '100%', loading: isDeleting, autoFocus: true },
      cancelProps: { w: '100%' },
      groupProps: { className: '!flex-nowrap' },
      onConfirm: () => deleteProduct({ id }),
    })

  if (error?.code == StatusCodes.NOT_FOUND) {
    return <NotFound h="calc(100vh - 300px)" message="Produk tidak ditemukan" />
  }

  return (
    <>
      <Head title="Edit Produk" />
      <LoadingOverlay
        visible={isPending}
        className="z-50"
        loaderProps={{
          children: (
            <Stack align="center" gap={'sm'}>
              <Loader size={42} />
              <Text size="sm">Memuat data produk...</Text>
            </Stack>
          ),
        }}
      />

      <PageTransition>
        <Form form={form} onSubmit={onSubmit}>
          <PageTitle
            title="Ubah Produk"
            description="Merupakan halaman untuk mengubah data produk dalam sistem."
          >
            <Button type="submit" loading={isUpdatePending || isPending}>
              Simpan
            </Button>
          </PageTitle>

          <Grid gutter="lg">
            <Grid.Col span={{ base: 12, md: 9 }} order={{ base: 2, md: 1 }}>
              <Stack gap={'lg'}>
                <Card shadow="xs">
                  <SectionHeader
                    title="Informasi Produk"
                    description="Berisi tentang informasi produk yang akan diunggah."
                  />

                  <Stack>
                    {isUpdateError && (
                      <Alert color="red" c={'red'} icon={<Info />}>
                        {updateError?.message}
                      </Alert>
                    )}

                    <SimpleGrid cols={{ base: 1, md: 2 }} spacing={'lg'}>
                      <TextInput
                        placeholder="Masukkan nama produk"
                        label="Nama Produk"
                        withAsterisk
                        autoFocus
                        key={form.key('name')}
                        {...form.getInputProps('name')}
                      />
                      <TextInput
                        placeholder="Masukkan kode SKU produk"
                        label="SKU Produk"
                        withAsterisk
                        disabled
                        key={form.key('sku')}
                        {...form.getInputProps('sku')}
                      />
                      <Select
                        data={brandList}
                        label="Merek Produk"
                        placeholder="Pilih merek produk"
                        withAsterisk
                        searchable
                        clearable
                        key={form.key('brandId')}
                        {...form.getInputProps('brandId')}
                        onChange={(value) => {
                          form.getInputProps('brandId').onChange(value)
                        }}
                      />

                      <Select
                        data={typeList}
                        key={form.key('typeId')}
                        label="Tipe Produk"
                        placeholder="Pilih tipe produk"
                        withAsterisk
                        searchable
                        clearable
                        {...form.getInputProps('typeId')}
                      />
                    </SimpleGrid>

                    <SimpleGrid cols={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={'lg'}>
                      <NumberInput
                        placeholder="Masukkan harga jual produk"
                        label="Harga Jual"
                        hideControls
                        prefix="Rp "
                        decimalSeparator=","
                        thousandSeparator="."
                        withAsterisk
                        key={form.key('salePrice')}
                        {...form.getInputProps('salePrice')}
                      />
                      <NumberInput
                        placeholder="Masukkan harga pemasok"
                        label="Harga Pemasok"
                        hideControls
                        prefix="Rp "
                        decimalSeparator=","
                        thousandSeparator="."
                        withAsterisk
                        key={form.key('supplierPrice')}
                        {...form.getInputProps('supplierPrice')}
                      />
                      <NumberInput
                        placeholder="Masukkan harga grosir"
                        label="Harga Grosir"
                        hideControls
                        prefix="Rp "
                        decimalSeparator=","
                        thousandSeparator="."
                        withAsterisk
                        key={form.key('wholesalePrice')}
                        {...form.getInputProps('wholesalePrice')}
                      />
                      <NumberInput
                        placeholder="Masukkan harga eceran"
                        label="Harga Eceran"
                        hideControls
                        prefix="Rp "
                        decimalSeparator=","
                        thousandSeparator="."
                        withAsterisk
                        key={form.key('retailPrice')}
                        {...form.getInputProps('retailPrice')}
                      />
                    </SimpleGrid>

                    <MultiSelect
                      data={categoryList}
                      label="Kategori Produk"
                      placeholder="Pilih kategori produk"
                      withAsterisk
                      multiple
                      searchable
                      clearable
                      key={form.key('categoryIds')}
                      {...form.getInputProps('categoryIds')}
                    />

                    <Textarea
                      placeholder="Masukkan deskripsi produk"
                      label="Deskripsi Produk"
                      rows={3}
                      key={form.key('description')}
                      {...form.getInputProps('description')}
                    />
                  </Stack>
                </Card>

                <ProductStockTable id={Number(id)} />

                <Group>
                  <Button
                    component={Link}
                    href="/kelola-produk"
                    color="gray.4"
                    c={'gray'}
                    variant="outline"
                    prefetch
                    leftSection={<ArrowLeft size={16} />}
                  >
                    Kembali
                  </Button>
                </Group>
              </Stack>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 3 }} order={{ base: 1, md: 2 }}>
              <Stack>
                <Card shadow="xs">
                  <SectionHeader
                    title="Foto Produk"
                    description="Berisi tentang foto produk yang akan diunggah."
                  />
                  <Stack gap={'sm'}>
                    <Flex
                      direction={{ base: 'column', xs: 'row', md: 'column' }}
                      align={{
                        base: 'start',
                        xs: 'center',
                        md: 'start',
                      }}
                      gap={'lg'}
                    >
                      {previewImage ? (
                        <AspectRatio ratio={1} w={{ base: '100%', xs: rem(300), lg: '100%' }}>
                          <Image
                            src={previewImage}
                            alt={form.values.name}
                            fit="cover"
                            fallbackSrc="https://images.placeholders.dev/?width=400&height=400&text=image"
                            radius={'lg'}
                          />
                        </AspectRatio>
                      ) : (
                        <AspectRatio ratio={1} w={{ base: '100%', xs: rem(300), lg: '100%' }}>
                          <Image
                            src="https://images.placeholders.dev/?width=400&height=400&text=image"
                            alt={form.values.name}
                            fit="cover"
                            radius={'lg'}
                          />
                        </AspectRatio>
                      )}

                      <Stack gap={'xs'}>
                        <FileButton
                          name="image"
                          accept="image/*"
                          key={form.key('image')}
                          {...form.getInputProps('image')}
                          onChange={onImageChange}
                        >
                          {(props) => (
                            <Button {...props} w={'fit-content'} size="sm">
                              Unggah foto
                            </Button>
                          )}
                        </FileButton>
                        <Text fz={'xs'} c={'gray.6'}>
                          Format: JPG, PNG, maksimal 2MB
                        </Text>
                      </Stack>
                    </Flex>
                  </Stack>
                </Card>

                <Card shadow="xs">
                  <SectionHeader
                    title="Hapus Produk"
                    description="Anda dapat menghapus produk ini dari sistem."
                  />

                  <Stack>
                    <Alert color="red" title="Peringatan" icon={<AlertCircleIcon color="red" />}>
                      Produk yang dihapus tidak dapat dikembalikan.
                    </Alert>

                    <Button color="red" fullWidth onClick={confirmDeleteModal}>
                      Hapus Produk
                    </Button>
                  </Stack>
                </Card>
              </Stack>
            </Grid.Col>
          </Grid>
        </Form>
      </PageTransition>
    </>
  )
}
EditProductPage.layout = (page: React.ReactNode) => <AdminLayout children={page} />

export default EditProductPage
