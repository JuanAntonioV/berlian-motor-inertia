import { Card, Stack, Box, Title, Text } from '@mantine/core'
import LoginForm from '../forms/LoginForm'

const LoginSection = () => {
  return (
    <Card shadow="lg" padding="lg" radius="lg" withBorder w={{ base: 500, sm: 400 }}>
      <Stack gap={'lg'}>
        <Box>
          <Title order={4} fw={'bold'}>
            Masuk
          </Title>
          <Text size="sm" c={'gray'}>
            Silakan masuk untuk melanjutkan
          </Text>
        </Box>
        <LoginForm />
      </Stack>
    </Card>
  )
}
export default LoginSection
