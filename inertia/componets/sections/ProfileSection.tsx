import { router, usePage } from '@inertiajs/react'
import {
  Avatar,
  Badge,
  Button,
  Card,
  FileButton,
  Flex,
  InputBase,
  Pill,
  rem,
  Stack,
  Text,
  TextInput,
} from '@mantine/core'
import { TUser } from '~/types'
import SectionHeader from './SectionHeader'
import { Form, useForm, zodResolver } from '@mantine/form'
import { profileSchema } from '~/lib/validators'
import { DateTime } from 'luxon'
import { useEffect, useState } from 'react'
import { getInitials, parseFormatedPhoneNumber } from '~/lib/formaters'
import { useMutation } from '@tanstack/react-query'
import { updateProfileApi } from '~/api/profile_api'
import toast from 'react-hot-toast'

const ProfileSection = () => {
  const props = usePage().props
  const user = props.user as TUser

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      fullName: user.fullName,
      email: user.email,
      phone: parseFormatedPhoneNumber(user.phone),
      image: null,
    },
    validate: zodResolver(profileSchema),
  })

  useEffect(() => {
    if (user.image) {
      setPreviewImage(user.image)
    }
  }, [user.image])

  const { mutate, isPending } = useMutation({
    mutationFn: updateProfileApi,
    onSuccess: () => {
      toast.success('Profil berhasil diperbarui')
      router.reload({ only: ['user'] })
    },
    onError: (error) => {
      toast.error(error.message)
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

  return (
    <Card className="col-span-2" h={'fit-content'} withBorder p={'lg'}>
      <SectionHeader
        title="Informasi Akun"
        description="Berisi informasi akun pengguna yang sedang login saat ini."
      />

      <Form form={form} onSubmit={onSubmit}>
        <Stack gap={'sm'}>
          <Stack gap={'sm'}>
            <Text fz={'sm'}>Foto profil</Text>

            <Flex align={'center'} gap={'md'}>
              {previewImage ? (
                <Avatar src={previewImage} alt={user.fullName} size={rem(120)} radius={'100%'} />
              ) : (
                <Avatar size={rem(120)} radius={'100%'}>
                  {getInitials(user.fullName)}
                </Avatar>
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
                    <Button {...props} w={'fit-content'}>
                      Unggah foto
                    </Button>
                  )}
                </FileButton>
                <Text fz={'sm'} c={'gray.6'}>
                  Format: JPG, PNG, maksimal 2MB
                </Text>
              </Stack>
            </Flex>
          </Stack>

          <TextInput
            placeholder="Nama lengkap"
            label="Nama lengkap"
            withAsterisk
            key={form.key('fullName')}
            {...form.getInputProps('fullName')}
          />
          <TextInput
            placeholder="Alamat email"
            label="Alamat email"
            withAsterisk
            key={form.key('email')}
            {...form.getInputProps('email')}
          />
          <TextInput
            placeholder="Masukkan nomor telepon"
            label="Nomor telepon"
            withAsterisk
            key={form.key('phone')}
            {...form.getInputProps('phone')}
          />
          <TextInput
            disabled
            placeholder="Tanggal bergabung"
            label="Tanggal bergabung"
            withAsterisk
            value={DateTime.fromJSDate(new Date(user.joinDate)).toLocaleString(DateTime.DATE_FULL)}
          />
          <InputBase component="div" multiline disabled label="Peran">
            <Pill.Group>
              {user.roles.map((role) => (
                <Badge key={role.id}>{role.name}</Badge>
              ))}
            </Pill.Group>
          </InputBase>
          <Button
            type="submit"
            mt={'lg'}
            w={'fit-content'}
            disabled={!form.isDirty()}
            loading={isPending}
          >
            Simpan
          </Button>
        </Stack>
      </Form>
    </Card>
  )
}
export default ProfileSection
