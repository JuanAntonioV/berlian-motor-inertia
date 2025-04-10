import { Button, Card, Center, rem, Stack, Text, Title } from '@mantine/core'

interface Props {
  h?: string
  message?: string
}

export default function ForbiddenScreen({ h = '100vh', message }: Props) {
  return (
    <Center h={h} w={'100%'}>
      <Card p={'xl'} miw={rem(400)} bg={'inherit'}>
        <Stack align="center" gap="md">
          <Title order={1} className="!text-6xl">
            403
          </Title>
          <Text ta="center" c={'gray.6'}>
            {message || `Anda tidak memiliki akses untuk melihat halaman ini`}
          </Text>

          <Button onClick={() => window.history.back()}>Kembali</Button>
        </Stack>
      </Card>
    </Center>
  )
}
