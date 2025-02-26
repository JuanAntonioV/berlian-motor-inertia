import { em, Flex, rem, Stack, Text, Title } from '@mantine/core'
import { usePage } from '@inertiajs/react'
import { getFormatedAvatarName, getInitialRoleName } from '~/lib/formaters'
import { TUser } from '~/types'
import LogoutIconButton from '../buttons/LogoutIconButton'
import SidebarProfileSkeleton from './skeletons/SidebarProfileSkeleton'
import UserPicture from '../pictures/UserPicture'

export default function SidebarProfile() {
  const props = usePage().props
  const user = props.user as TUser

  if (!user) return <SidebarProfileSkeleton />

  return (
    <Flex
      justify={'space-between'}
      align={'center'}
      px={rem(16)}
      py={rem(12)}
      className="border-t-gray-500"
      bg={'gray.9'}
      c={'white'}
    >
      <Flex align="center" gap={8}>
        <UserPicture color="white" />
        <Stack gap={0}>
          <Title order={2} size={em(14)} lineClamp={1} className="!font-semibold">
            {getFormatedAvatarName(user.fullName)}
          </Title>
          <Text size="xs" c={'gray.5'} lineClamp={1}>
            {getInitialRoleName(user.roles)}
          </Text>
        </Stack>
      </Flex>
      <LogoutIconButton />
    </Flex>
  )
}
