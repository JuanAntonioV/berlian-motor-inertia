import { router, usePage } from '@inertiajs/react'
import { em, Flex, Menu, rem, Stack, Text, Title } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { modals } from '@mantine/modals'
import { useMutation } from '@tanstack/react-query'
import { CircleAlert, LogOut, ScanSearch, User } from 'lucide-react'
import { logoutApi } from '~/api/auth_api'
import UserPicture from '../pictures/UserPicture'
import { TUser } from '~/types'
import { getFormatedAvatarName, getInitialRoleName } from '~/lib/formaters'

const AppProfileMenu = () => {
  const [opened, { toggle }] = useDisclosure()

  const { mutate, isPending } = useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      router.visit('/auth/login')
    },
  })

  const confirmLogoutModal = () =>
    modals.openConfirmModal({
      centered: true,
      withCloseButton: false,
      size: 'sm',
      radius: 'lg',
      children: (
        <div className="flex-center flex-col gap-4 py-6">
          <CircleAlert size={62} color="red" />
          <Text size="sm">Apakah Anda yakin ingin keluar dari aplikasi?</Text>
        </div>
      ),
      trapFocus: false,
      labels: { confirm: 'Ya', cancel: 'Batal' },
      confirmProps: { color: 'red', w: '100%', loading: isPending, autoFocus: true },
      cancelProps: { w: '100%' },
      groupProps: { className: '!flex-nowrap' },
      onConfirm: mutate,
    })

  const props = usePage().props
  const user = props.user as TUser

  return (
    <div>
      <Menu shadow="md" width={200} opened={opened} onChange={toggle} position="bottom-end">
        <Menu.Target>
          <Flex gap={'md'} className="!cursor-pointer">
            <UserPicture size={38} />
            <Stack gap={rem(4)}>
              <Title order={2} size={em(14)} lineClamp={1} className="!font-semibold">
                {getFormatedAvatarName(user.fullName)}
              </Title>
              <Text size="xs" c={'gray'} lineClamp={1}>
                {getInitialRoleName(user.roles)}
              </Text>
            </Stack>
          </Flex>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Item leftSection={<User size={14} />}>Akun Saya</Menu.Item>
          <Menu.Item
            leftSection={<ScanSearch size={14} />}
            rightSection={
              <Text size="xs" c="dimmed">
                ⌘K
              </Text>
            }
            className="flex-nowrap"
          >
            Cari Menu
          </Menu.Item>

          <Menu.Divider />
          <Menu.Item color="red" leftSection={<LogOut size={14} />} onClick={confirmLogoutModal}>
            Logout
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </div>
  )
}
export default AppProfileMenu
