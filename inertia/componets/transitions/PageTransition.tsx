import { keyframes } from '@emotion/react'
import { Stack, type BoxProps } from '@mantine/core'

type Props = {
  children: Readonly<React.ReactNode>
} & BoxProps

const slideFromBottom = keyframes({
  from: {
    transform: 'translateY(10%)',
  },
  to: {
    transform: 'translateY(0)',
  },
})

const PageTransition = ({ children, ...props }: Props) => {
  return (
    <Stack
      p={{ base: 'md', lg: 'xl' }}
      component="main"
      sx={{
        animation: `${slideFromBottom} 0.3s`,
      }}
      {...props}
    >
      {children}
    </Stack>
  )
}
export default PageTransition
