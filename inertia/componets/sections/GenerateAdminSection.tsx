import { Alert, Button, Card, Center, Stack } from '@mantine/core'
import { BetweenVerticalStart } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { generateAdminApi } from '~/api/auth_api'
import Form from '../forms/Form'
import { router } from '@inertiajs/react'

const GenerateAdminSection = () => {
  const { mutate, isPending, error, isError, isSuccess } = useMutation({
    mutationFn: generateAdminApi,
    onSuccess: () => {
      router.reload({ only: ['isAdminExist'] })
    },
  })

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    mutate()
  }

  return (
    <Card shadow="lg" padding="lg" radius="md" withBorder w={{ base: 500, sm: 400 }}>
      <Stack gap={'lg'}>
        {isError ? (
          <Alert color="red" title="Perhatian!">
            {error.message}
          </Alert>
        ) : isSuccess ? (
          <Alert color="green" title="Berhasil!">
            Admin berhasil dibuat, silakan masuk dengan email dan password yang sama.
          </Alert>
        ) : (
          <Alert color="blue" title="Perhatian!">
            Anda hanya bisa mendaftarkan admin sekali saja, setelah itu tombol ini akan hilang.
          </Alert>
        )}

        <Center>
          <Form onSubmit={onSubmit} className="w-full">
            <Button
              type="submit"
              variant={'secondary'}
              leftSection={<BetweenVerticalStart size={18} />}
              loading={isPending}
            >
              Generate Admin
            </Button>
          </Form>
        </Center>
      </Stack>
    </Card>
  )
}
export default GenerateAdminSection
