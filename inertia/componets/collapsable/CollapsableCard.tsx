import { Paper, Flex, Stack, Title, ActionIcon, Collapse } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { ChevronUp } from 'lucide-react'
import { cn } from '~/lib/utils'

type Props = {
  children: Readonly<React.ReactNode>
  title?: string
}

const CollapsableCard = ({ children, title }: Props) => {
  const [opened, { toggle }] = useDisclosure(true)

  return (
    <Paper withBorder shadow="none">
      <Flex
        justify="space-between"
        align={'center'}
        component="header"
        className={cn(opened && 'border-b border-gray-300')}
        p={'sm'}
        px={'md'}
      >
        <Stack>
          <Title order={3} fz={'md'}>
            {title || 'Detail'}
          </Title>
        </Stack>
        <ActionIcon variant="subtle" size={'lg'} onClick={toggle}>
          <ChevronUp size={20} />
        </ActionIcon>
      </Flex>

      <Collapse in={opened}>
        <Stack p={'sm'} gap={'sm'}>
          {children}
        </Stack>
      </Collapse>
    </Paper>
  )
}
export default CollapsableCard
