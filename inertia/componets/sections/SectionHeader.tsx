import { Box, Flex, Text, Title } from '@mantine/core'

type Props = {
  title: string
  description?: string
  children?: Readonly<React.ReactNode>
}

const SectionHeader = ({ title, description, children }: Props) => {
  return (
    <Flex
      justify={'space-between'}
      align={'center'}
      gap={'md'}
      pb={'sm'}
      mb={'md'}
      className="border-b border-gray-200"
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
