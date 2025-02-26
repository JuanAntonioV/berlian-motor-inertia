import { em, Flex, rem, Skeleton, Stack } from '@mantine/core'

export default function SidebarProfileSkeleton() {
  return (
    <Flex
      justify={'space-between'}
      align={'center'}
      px={rem(16)}
      py={rem(12)}
      className="border-t-gray-500"
    >
      <Flex align="center" gap={8}>
        <Skeleton circle height={rem(32)} />
        <Stack gap={8}>
          <Skeleton height={em(12)} w={140} radius={'sm'} />
          <Skeleton height={em(8)} w="70%" radius={'sm'} />
        </Stack>
      </Flex>
      <Skeleton height={rem(32)} w={rem(32)} />
    </Flex>
  )
}
