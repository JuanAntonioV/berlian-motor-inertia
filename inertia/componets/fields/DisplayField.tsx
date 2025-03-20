import {
  Paper,
  Stack,
  Title,
  Flex,
  rem,
  CopyButton,
  ActionIcon,
  Text,
  Tooltip,
  MantineFontSize,
  MantineStyleProps,
} from '@mantine/core'
import { IconCheck, IconCopy } from '@tabler/icons-react'

type Props = {
  title: string
  value: string
  copyable?: boolean
  fz?: MantineFontSize
  fw?: MantineStyleProps['fw']
}
const DisplayField = ({ title, value, copyable, fz = 'lg', fw = 'bold' }: Props) => {
  return (
    <Paper shadow="none">
      <Stack gap={'xs'}>
        <Title order={3} fz="sm" fw={'normal'} c={'gray'}>
          {title || 'Judul'}
        </Title>

        <Flex align={'center'} gap={rem(4)}>
          <Text span fz={fz} fw={fw}>
            {value}
          </Text>
          {copyable && (
            <CopyButton value={value || ''} timeout={2000}>
              {({ copied, copy }) => (
                <Tooltip label={copied ? 'Copied' : 'Copy'} withArrow position="right">
                  <ActionIcon color={copied ? 'teal' : 'gray'} variant="subtle" onClick={copy}>
                    {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                  </ActionIcon>
                </Tooltip>
              )}
            </CopyButton>
          )}
        </Flex>
      </Stack>
    </Paper>
  )
}
export default DisplayField
