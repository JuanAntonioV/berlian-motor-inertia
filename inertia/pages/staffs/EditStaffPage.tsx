import { Head, Deferred, Link, usePage } from '@inertiajs/react'
import {
  Button,
  Stack,
  Card,
  Alert,
  SimpleGrid,
  TextInput,
  Select,
  Flex,
  AspectRatio,
  rem,
  FileButton,
  Grid,
  Group,
  Image,
  Text,
  LoadingOverlay,
  Loader,
  PasswordInput,
} from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import { Form, useForm, zodResolver } from '@mantine/form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { StatusCodes } from 'http-status-codes'
import { isEmpty } from 'lodash'
import { ArrowLeft, Info } from 'lucide-react'
import { DateTime } from 'luxon'
import { useState, useMemo, useEffect } from 'react'
import toast from 'react-hot-toast'
import { getStaffDetail, updateStaffApi } from '~/api/staff_api'
import SectionHeader from '~/componets/sections/SectionHeader'
import PageTitle from '~/componets/titles/PageTitle'
import PageTransition from '~/componets/transitions/PageTransition'
import AdminLayout from '~/layouts/AdminLayout'
import { formErrorResolver } from '~/lib/utils'
import { updateStaffSchema } from '~/lib/validators'
import { TRole } from '~/types'
import NotFoundScreen from '../errors/not_found'
import { parseFormatedPhoneNumber } from '~/lib/formaters'

const EditStaffPage = () => {
  const { id } = usePage().props
  const serverProps = usePage().props

  const form = useForm({
    mode: 'uncontrolled',
    validate: zodResolver(updateStaffSchema),
  })

  const { data, isPending, error } = useQuery({
    queryKey: ['staff-detail', { id }],
    queryFn: () => getStaffDetail({ id: Number(id!) }),
    enabled: !!id,
    select: (res) => res.data,
  })

  useEffect(() => {
    if (data) {
      form.setValues({
        fullName: data.fullName,
        email: data.email,
        phone: parseFormatedPhoneNumber(data.phone),
        joinDate: DateTime.fromISO(data.joinDate).toJSDate(),
        roles: data.roleIds[0]?.toString(),
        image: null,
      })

      if (data.image) {
        setPreviewImage(data.image)
      }
    }
  }, [data, serverProps?.roleList])

  const queryClient = useQueryClient()

  const {
    mutate: updateStaff,
    isPending: isUpdatePending,
    error: updateError,
  } = useMutation({
    mutationFn: updateStaffApi,
    onSuccess: () => {
      toast.success('Karyawan berhasil diubah')
      queryClient.refetchQueries({ queryKey: ['staffs'] })
      queryClient.refetchQueries({
        queryKey: ['staff-detail', { id: serverProps?.id }],
        exact: true,
      })
      form.reset()
      form.setErrors({})
    },
    onError: (err) => {
      form.setErrors(formErrorResolver(err?.errors))
    },
  })

  const onSubmit = (values: typeof form.values) => {
    updateStaff({
      ...values,
      password: values.password || undefined,
      id: serverProps?.id,
      joinDate: DateTime.fromJSDate(new Date(values.joinDate)).toISODate({ format: 'extended' }),
      roles: [values.roles],
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

  const roleList = useMemo(() => {
    if (isEmpty(serverProps?.roleList)) return []
    return (serverProps?.roleList as TRole[])?.map((role) => ({
      label: role.name,
      value: role.id.toString(),
    }))
  }, [serverProps?.roleList])

  if (error?.code == StatusCodes.NOT_FOUND) {
    return <NotFoundScreen h="calc(100vh - 300px)" message="Karyawan tidak ditemukan" />
  }

  return (
    <>
      <Head title="Ubah Karyawan" />
      <LoadingOverlay
        visible={isPending}
        className="z-50"
        loaderProps={{
          children: (
            <Stack align="center" gap={'sm'}>
              <Loader size={42} />
              <Text size="sm">Memuat data karyawan...</Text>
            </Stack>
          ),
        }}
      />

      <PageTransition>
        <Form form={form} onSubmit={onSubmit}>
          <PageTitle
            title="Ubah Karyawan"
            description="Merupakan halaman untuk mengubah karyawan ke dalam sistem."
          >
            <Button type="submit" loading={isPending || isUpdatePending}>
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
                    {updateError?.message && (
                      <Alert color="red" c={'red'} icon={<Info />}>
                        {updateError?.message}
                      </Alert>
                    )}

                    <SimpleGrid cols={{ base: 1, md: 2 }} spacing={'lg'}>
                      <TextInput
                        placeholder="Masukkan nama lengkap"
                        label="Nama Lengkap"
                        withAsterisk
                        autoFocus
                        key={form.key('fullName')}
                        {...form.getInputProps('fullName')}
                      />
                      <TextInput
                        placeholder="Masukkan alamat email"
                        label="Alamat Email"
                        withAsterisk
                        key={form.key('email')}
                        {...form.getInputProps('email')}
                      />
                    </SimpleGrid>
                    <TextInput
                      placeholder="Masukkan nomor telepon"
                      label="Nomor Telepon"
                      withAsterisk
                      maxLength={15}
                      onKeyDown={(e) => {
                        const regex = new RegExp('^[0-9]*$')

                        if (
                          !regex.test(e.key) &&
                          e.key !== 'Backspace' &&
                          e.key !== 'Enter' &&
                          e.key !== 'Tab' &&
                          !(e.ctrlKey && e.key === 'a') &&
                          !(e.ctrlKey && e.key === 'c') &&
                          !(e.ctrlKey && e.key === 'v')
                        ) {
                          e.preventDefault()
                        }
                      }}
                      type="number"
                      inputMode="numeric"
                      key={form.key('phone')}
                      {...form.getInputProps('phone')}
                    />
                    <DatePickerInput
                      label="Tanggal Bergabung"
                      placeholder="Pilih tanggal bergabung"
                      withAsterisk
                      valueFormat="DD MMMM YYYY"
                      key={form.key('joinDate')}
                      {...form.getInputProps('joinDate')}
                    />
                    <Deferred
                      data={'roleList'}
                      fallback={<Select disabled label="Peran Karyawan" />}
                    >
                      <Select
                        data={roleList}
                        label="Peran Karyawan"
                        placeholder="Pilih peran karyawan"
                        withAsterisk
                        searchable
                        clearable
                        key={form.key('roles')}
                        {...form.getInputProps('roles')}
                        onChange={(value) => {
                          console.log('🚀 ~ CreateStaffPage ~ value:', value)
                          form.getInputProps('roles').onChange(value)
                        }}
                      />
                    </Deferred>
                  </Stack>
                </Card>

                <Group>
                  <Button
                    component={Link}
                    href="/kelola-karyawan"
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
                    title="Reset Kata Sandi"
                    description="Reset kata sandi karyawan ke default."
                  />
                  <Stack gap={'sm'}>
                    <PasswordInput
                      placeholder="Masukkan kata sandi"
                      label="Kata Sandi"
                      withAsterisk
                      autoComplete="off"
                      key={form.key('password')}
                      {...form.getInputProps('password')}
                    />
                    <PasswordInput
                      placeholder="Konfirmasi kata sandi"
                      label="Konfirmasi Kata Sandi"
                      withAsterisk
                      autoComplete="off"
                      key={form.key('confirmPassword')}
                      {...form.getInputProps('confirmPassword')}
                    />
                  </Stack>
                </Card>
                <Card shadow="xs">
                  <SectionHeader
                    title="Foto Karyawan"
                    description="Berisi tentang foto karyawan yang akan diunggah."
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

EditStaffPage.layout = (page: React.ReactNode) => <AdminLayout children={page} />

export default EditStaffPage
