'use client'
import { Burger, Drawer, rem, ScrollArea, Stack } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import NavList from './NavList'
import BrandLogo from '../brands/BrandLogo'
import { Link } from '@inertiajs/react'

export default function AppMobileSidebar() {
  const [opened, { toggle }] = useDisclosure(false)

  return (
    <>
      <Drawer
        hiddenFrom="lg"
        opened={opened}
        onClose={toggle}
        title={
          <Link href="/dashboard" prefetch>
            <BrandLogo />
          </Link>
        }
        size={'sm'}
        scrollAreaComponent={ScrollArea.Autosize}
        classNames={{
          content: '!bg-black !text-white',
          header: '!bg-black !text-white',
        }}
      >
        <Stack component={'nav'} h={'100%'} px={8} mt={rem(38)}>
          <Stack gap={4}>
            <NavList />
          </Stack>
        </Stack>
      </Drawer>

      <Burger
        opened={opened}
        onClick={toggle}
        aria-label="Toggle sidebar"
        size={'sm'}
        hiddenFrom="lg"
      />
    </>
  )
}
