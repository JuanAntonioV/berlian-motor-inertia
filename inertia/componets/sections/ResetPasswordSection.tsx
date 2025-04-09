import { Alert, Button, Card, PasswordInput, Stack } from '@mantine/core'
import SectionHeader from './SectionHeader'
import { Form, useForm, zodResolver } from '@mantine/form'
import { resetPasswordSchema } from '~/lib/validators'
import { useMutation } from '@tanstack/react-query'
import { resetPasswordApi } from '~/api/profile_api'
import toast from 'react-hot-toast'
import { Info } from 'lucide-react'

const ResetPasswordSection = () => {
  const form = useForm({
    mode: 'uncontrolled',
    validate: zodResolver(resetPasswordSchema),
  })

  const { mutate, isPending, error } = useMutation({
    mutationFn: resetPasswordApi,
    onSuccess: () => {
      form.reset()
      toast.success('Kata sandi berhasil diubah')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onSubmit = (values: typeof form.values) => {
    mutate(values)
  }

  return (
    <Card h={'fit-content'} withBorder p={'lg'}>
      <SectionHeader
        title="Ubah Kata Sandi"
        description="Ubah kata sandi akun yang digunakan untuk login."
      />

      <Form form={form} onSubmit={onSubmit}>
        <Stack gap={'sm'}>
          {error?.message && (
            <Alert color="red" c={'red'} icon={<Info />}>
              {error.message}
            </Alert>
          )}
          <PasswordInput
            placeholder="Masukkan kata sandi lama"
            label="Kata sandi lama"
            withAsterisk
            key={form.key('oldPassword')}
            {...form.getInputProps('oldPassword')}
          />
          <PasswordInput
            placeholder="Kata sandi"
            label="Kata sandi"
            withAsterisk
            key={form.key('password')}
            {...form.getInputProps('password')}
          />
          <PasswordInput
            placeholder="Konfirmasi kata sandi baru"
            label="Konfirmasi kata sandi"
            withAsterisk
            key={form.key('confirmPassword')}
            {...form.getInputProps('confirmPassword')}
          />
        </Stack>

        <Button type="submit" mt={'lg'} loading={isPending}>
          Ubah Kata Sandi
        </Button>
      </Form>
    </Card>
  )
}
export default ResetPasswordSection
