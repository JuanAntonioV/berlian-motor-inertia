import { Stack, rem, Title, Text, Group } from '@mantine/core'

type Props = {
  title: string
  description?: string
  children?: Readonly<React.ReactNode>
}
const PageTitle = ({ title, description, children }: Props) => {
  return (
    <Group justify="space-between" align="center" gap={'md'}>
      <Stack gap={rem(4)} mb={'xl'}>
        <Title order={3}>{title}</Title>
        {description && (
          <Text size="sm" c={'gray'}>
            {description}
          </Text>
        )}
      </Stack>
      {children}
    </Group>
  )
}
export default PageTitle
