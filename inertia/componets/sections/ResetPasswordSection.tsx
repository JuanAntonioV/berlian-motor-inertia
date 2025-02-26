import { Button, Card, PasswordInput, Stack } from '@mantine/core'
import SectionHeader from './SectionHeader'
import { Form, useForm, zodResolver } from '@mantine/form'
import { resetPasswordSchema } from '~/lib/validators'

const ResetPasswordSection = () => {
  const form = useForm({
    mode: 'uncontrolled',
    validate: zodResolver(resetPasswordSchema),
  })

  const onSubmit = (values: typeof form.values) => {
    console.log('values', values)
  }

  return (
    <Card h={'fit-content'} withBorder p={'lg'}>
      <SectionHeader
        title="Ubah Kata Sandi"
        description="Ubah kata sandi akun yang digunakan untuk login."
      />

      <Form form={form} onSubmit={onSubmit}>
        <Stack gap={'sm'}>
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

        <Button type="submit" mt={'lg'}>
          Ubah Kata Sandi
        </Button>
      </Form>
    </Card>
  )
}
export default ResetPasswordSection
