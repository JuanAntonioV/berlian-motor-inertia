import { Deferred, Head, Link, router, usePage } from '@inertiajs/react'
import {
  Alert,
  Group,
  Image,
  PasswordInput,
  Select,
  SimpleGrid,
  Text,
  TextInput,
} from '@mantine/core'
import { AspectRatio, Button, Card, FileButton, Flex, Grid, rem, Stack } from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import { Form, useForm, zodResolver } from '@mantine/form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { isEmpty } from 'lodash'
import { ArrowLeft, Info } from 'lucide-react'
import { DateTime } from 'luxon'
import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { createStaffApi } from '~/api/staff_api'
import SectionHeader from '~/componets/sections/SectionHeader'
import PageTitle from '~/componets/titles/PageTitle'
import PageTransition from '~/componets/transitions/PageTransition'
import AdminLayout from '~/layouts/AdminLayout'
import { formErrorResolver } from '~/lib/utils'
import { staffSchema } from '~/lib/validators'
import { TRole } from '~/types'

const CreateStaffPage = () => {
  const serverProps = usePage().props

  const form = useForm({
    mode: 'uncontrolled',
    validate: zodResolver(staffSchema),
  })

  const queryClient = useQueryClient()

  const { mutate, isPending, error } = useMutation({
    mutationFn: createStaffApi,
    onSuccess: () => {
      toast.success('Karyawan berhasil ditambahkan')
      queryClient.refetchQueries({ queryKey: ['staffs'] })
      router.visit('/kelola-karyawan')
      form.reset()
      form.setErrors({})
    },
    onError: (err) => {
      form.setErrors(formErrorResolver(err?.errors))
    },
  })

  const onSubmit = (values: typeof form.values) => {
    mutate({
      ...values,
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

  return (
    <>
      <Head title="Tambah Karyawan" />

      <PageTransition>
        <Form form={form} onSubmit={onSubmit}>
          <PageTitle
            title="Tambah Karyawan"
            description="Merupakan halaman untuk menambah karyawan baru ke dalam sistem."
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
                    {error?.message && (
                      <Alert color="red" c={'red'} icon={<Info />}>
                        {error?.message}
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
                    <SimpleGrid cols={{ base: 1, md: 2 }} spacing={'lg'}>
                      <PasswordInput
                        placeholder="Masukkan kata sandi"
                        label="Kata Sandi"
                        withAsterisk
                        key={form.key('password')}
                        {...form.getInputProps('password')}
                      />
                      <PasswordInput
                        placeholder="Konfirmasi kata sandi"
                        label="Konfirmasi Kata Sandi"
                        withAsterisk
                        key={form.key('confirmPassword')}
                        {...form.getInputProps('confirmPassword')}
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
                      highlightToday
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

CreateStaffPage.layout = (page: React.ReactNode) => <AdminLayout children={page} />

export default CreateStaffPage
