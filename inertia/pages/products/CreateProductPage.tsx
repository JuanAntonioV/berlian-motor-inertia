import Brand from '#models/brand'
import { Head, Link, router, usePage } from '@inertiajs/react'
import { MultiSelect, Textarea, UnstyledButton } from '@mantine/core'
import { Group } from '@mantine/core'
import {
  Alert,
  AspectRatio,
  Button,
  Card,
  FileButton,
  Flex,
  Grid,
  Image,
  NumberInput,
  rem,
  Select,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
} from '@mantine/core'
import { Form, useForm, zodResolver } from '@mantine/form'
import { useDisclosure } from '@mantine/hooks'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { isEmpty } from 'lodash'
import { ArrowLeft, Info } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { createProductApi } from '~/api/product_api'
import BrandModal from '~/componets/modals/BrandModal'
import CategoryModal from '~/componets/modals/CategoryModal'
import TypeModal from '~/componets/modals/TypeModal'
import SectionHeader from '~/componets/sections/SectionHeader'
import PageTitle from '~/componets/titles/PageTitle'
import PageTransition from '~/componets/transitions/PageTransition'
import AdminLayout from '~/layouts/AdminLayout'
import { formErrorResolver } from '~/lib/utils'
import { productSchema } from '~/lib/validators'

const CreateProductPage = () => {
  const serverProps = usePage().props

  const form = useForm({
    mode: 'uncontrolled',
    validate: zodResolver(productSchema),
  })

  useEffect(() => {
    if (serverProps?.sku) {
      form.setValues({
        sku: serverProps.sku,
      })
    }
  }, [serverProps?.sku])

  const queryClient = useQueryClient()

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: createProductApi,
    onSuccess: (res) => {
      queryClient.refetchQueries({ queryKey: ['products'] })
      router.visit(`/kelola-produk/${res?.data?.id}/edit`)
    },
    onError: (err) => {
      form.setErrors(formErrorResolver(err?.errors))
    },
  })

  const onSubmit = (values: typeof form.values) => {
    mutate(values)
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
  }, [serverProps])

  const typeList = useMemo(() => {
    if (isEmpty(serverProps?.typeList)) return []
    return (serverProps?.typeList as Brand[])?.map((type) => ({
      label: type.name,
      value: type.id.toString(),
    }))
  }, [serverProps])

  const categoryList = useMemo(() => {
    if (isEmpty(serverProps?.categoryList)) return []
    return (serverProps?.categoryList as Brand[])?.map((category) => ({
      label: category.name,
      value: category.id.toString(),
    }))
  }, [serverProps])

  const [openedBrandModal, { open: openBrandModal, close: closeBrandModal }] = useDisclosure()
  const [openedTypeModal, { open: openTypeModal, close: closeTypeModal }] = useDisclosure()
  const [openedCategoryModal, { open: openCategoryModal, close: closeCategoryModal }] =
    useDisclosure()

  return (
    <>
      <Head title="Tambah Produk" />
      <BrandModal
        opened={openedBrandModal}
        onClose={closeBrandModal}
        onCreatedId={(id) => {
          if (id) form.getInputProps('brandId').onChange({ value: id.toString() })
        }}
      />
      <TypeModal
        opened={openedTypeModal}
        onClose={closeTypeModal}
        onCreatedId={(id) => {
          if (id) form.getInputProps('typeId').onChange({ value: id.toString() })
        }}
      />
      <CategoryModal
        opened={openedCategoryModal}
        onClose={closeCategoryModal}
        onCreatedId={(id) => {
          if (id) form.getInputProps('categoryIds').onChange({ value: [id.toString()] })
        }}
      />

      <PageTransition>
        <Form form={form} onSubmit={onSubmit}>
          <PageTitle
            title="Tambah Produk"
            description="Merupakan halaman untuk menambah produk baru ke dalam sistem."
          >
            <Button type="submit" loading={isPending}>
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
                    {isError && (
                      <Alert color="red" c={'red'} icon={<Info />}>
                        {error?.message}
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
                        key={form.key('sku')}
                        {...form.getInputProps('sku')}
                      />
                      <Select
                        data={brandList}
                        label="Merek Produk"
                        placeholder="Pilih merek produk"
                        withAsterisk
                        searchable
                        descriptionProps={{ component: 'div' }}
                        description={
                          <Text c={'gray.6'} fz={'xs'}>
                            Tidak menemukan merek?{' '}
                            <UnstyledButton fz={'xs'} c={'blue.5'} onClick={openBrandModal}>
                              Tambah merek.
                            </UnstyledButton>
                          </Text>
                        }
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
                        descriptionProps={{ component: 'div' }}
                        description={
                          <Text c={'gray.6'} fz={'xs'}>
                            Tidak menemukan tipe?{' '}
                            <UnstyledButton fz={'xs'} c={'blue.5'} onClick={openTypeModal}>
                              Tambah tipe.
                            </UnstyledButton>
                          </Text>
                        }
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
                      descriptionProps={{ component: 'div' }}
                      description={
                        <Text c={'gray.6'} fz={'xs'}>
                          Tidak menemukan kategori?{' '}
                          <UnstyledButton fz={'xs'} c={'blue.5'} onClick={openCategoryModal}>
                            Tambah kategori.
                          </UnstyledButton>
                        </Text>
                      }
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
              <Stack gap={'lg'}>
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
              </Stack>
            </Grid.Col>
          </Grid>
        </Form>
      </PageTransition>
    </>
  )
}
CreateProductPage.layout = (page: React.ReactNode) => <AdminLayout children={page} />

export default CreateProductPage
