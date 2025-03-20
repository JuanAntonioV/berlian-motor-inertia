import { Button, Card, Center, rem, Stack, Text, Title } from '@mantine/core'

interface Props {
  h?: string
  message?: string
}

export default function NotFoundScreen({ h, message }: Props) {
  return (
    <Center h={h} w={'100%'}>
      <Card p={'xl'} miw={rem(400)} bg={'inherit'}>
        <Stack align="center" gap="md">
          <Title order={1} className="!text-6xl">
            404
          </Title>
          <Text ta="center" c={'gray.6'}>
            {message || `Halaman yang Anda cari tidak ditemukan`}
          </Text>

          <Button onClick={() => window.history.back()}>Kembali</Button>
        </Stack>
      </Card>
    </Center>
  )
}
