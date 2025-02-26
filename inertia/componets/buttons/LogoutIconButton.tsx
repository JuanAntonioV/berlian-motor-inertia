'use client'

import { router } from '@inertiajs/react'
import { ActionIcon, Text } from '@mantine/core'
import { modals } from '@mantine/modals'
import { useMutation } from '@tanstack/react-query'
import { CircleAlert, LucideLogOut } from 'lucide-react'
import toast from 'react-hot-toast'
import { logoutApi } from '~/api/auth_api'

export default function LogoutIconButton() {
  const { mutate, isPending } = useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      toast.success('Logout berhasil')
      router.visit('/auth/login', { replace: true })
    },
    onError: (err) => {
      toast.error(err?.message)
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

  return (
    <ActionIcon
      color="red"
      variant="filled"
      size="lg"
      loading={isPending}
      onClick={confirmLogoutModal}
    >
      <LucideLogOut size={16} />
    </ActionIcon>
  )
}
