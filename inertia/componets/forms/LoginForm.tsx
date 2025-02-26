import { Alert, Button, Checkbox, PasswordInput, Stack, TextInput } from '@mantine/core'
import { useMutation } from '@tanstack/react-query'
import { useForm, zodResolver } from '@mantine/form'
import { loginSchema } from '~/lib/validators'
import { loginApi } from '~/api/auth_api'
import Form from './Form'
import { router } from '@inertiajs/react'
import { notifications } from '@mantine/notifications'
import { Info } from 'lucide-react'
import { formErrorResolver } from '~/lib/utils'
import toast from 'react-hot-toast'

const LoginForm = () => {
  const { mutate, isPending, error } = useMutation({
    mutationFn: loginApi,
    onSuccess: () => {
      notifications.show({
        title: 'Berhasil!',
        message: 'Anda berhasil masuk',
        color: 'green',
      })
      form.reset()
      toast.success('Login berhasil')
      router.visit('/dashboard')
    },
    onError: (err: Error & Record<string, any>) => {
      form.setErrors(formErrorResolver(err?.errors))
    },
  })

  const form = useForm({
    mode: 'uncontrolled',
    validate: zodResolver(loginSchema),
  })

  function onSubmit(values: typeof form.values) {
    mutate({
      email: values.email,
      password: values.password,
      rememberMe: values.rememberMe,
    })
  }

  return (
    <Stack>
      {error?.message && (
        <Alert color="red" c={'red'} icon={<Info />}>
          {error.message}
        </Alert>
      )}
      <Form onSubmit={form.onSubmit(onSubmit)}>
        <Stack gap={'md'}>
          <TextInput
            placeholder="Alamat email"
            label="Alamat email"
            withAsterisk
            autoFocus
            key={form.key('email')}
            {...form.getInputProps('email')}
          />
          <PasswordInput
            placeholder="Kata sandi"
            label="Kata sandi"
            withAsterisk
            key={form.key('password')}
            {...form.getInputProps('password')}
          />
          <Checkbox
            defaultChecked
            label="Ingat saya"
            key={form.key('rememberMe')}
            {...form.getInputProps('rememberMe')}
          />
        </Stack>

        <Button type="submit" loading={isPending} mt={'sm'}>
          Masuk
        </Button>
      </Form>
    </Stack>
  )
}
export default LoginForm
