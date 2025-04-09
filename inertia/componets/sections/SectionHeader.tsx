import { Box, Flex, Text, Title } from '@mantine/core'
import { cn } from '~/lib/utils'

type Props = {
  title: string
  description?: string
  children?: Readonly<React.ReactNode>
  withBorder?: boolean
}

const SectionHeader = ({ title, description, children, withBorder = true }: Props) => {
  return (
    <Flex
      justify={'space-between'}
      align={'center'}
      gap={'md'}
      pb={'sm'}
      mb={'md'}
      className={cn(withBorder && 'border-b border-gray-200')}
    >
      <Box>
        <Title order={2} fz={'lg'}>
          {title}
        </Title>
        <Text fz={'sm'} c={'gray'}>
          {description}
        </Text>
      </Box>

      {children}
    </Flex>
  )
}
export default SectionHeader
