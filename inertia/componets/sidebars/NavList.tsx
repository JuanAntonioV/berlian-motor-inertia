import { Link, router, usePage } from '@inertiajs/react'
import { List, NavLink, rem, ScrollArea } from '@mantine/core'
import { Spotlight, SpotlightActionData, SpotlightActionGroupData } from '@mantine/spotlight'
import { isEmpty } from 'lodash'
import { FolderCog, Inbox, PanelsTopLeft, Search, ShoppingCart, UsersRound } from 'lucide-react'
import { useMemo } from 'react'
import { TMenu, TUser } from '~/types'

type Props = {
  onToggleSidebar?: () => void
}

const NavList = ({ onToggleSidebar }: Props) => {
  const { url, props } = usePage()
  const user = props.user as TUser
  const userRoles = user?.roles?.map((role) => role.slug) || []

  const menuList = useMemo<TMenu[]>(() => {
    return [
      {
        id: 1,
        label: 'Dashboard',
        href: '/dashboard',
        icon: <PanelsTopLeft size={24} />,
        subMenus: [],
        roles: ['super-admin', 'admin', 'karyawan'],
      },
      {
        id: 2,
        label: 'Produk',
        href: '/kelola-produk',
        icon: <ShoppingCart size={24} />,
        subMenus: [],
        roles: ['super-admin', 'admin', 'karyawan'],
      },
      {
        id: 3,
        label: 'Karyawan',
        href: '/kelola-karyawan',
        icon: <UsersRound size={24} />,
        subMenus: [],
        roles: ['super-admin', 'admin'],
      },
      {
        id: 4,
        label: 'Manajemen',
        href: '/',
        icon: <FolderCog size={24} />,
        subMenus: [
          {
            id: 1,
            label: 'Kelola Kategori',
            href: '/kelola-kategori',
          },
          {
            id: 2,
            label: 'Kelola Merek',
            href: '/kelola-merek',
          },
          {
            id: 3,
            label: 'Kelola Rak',
            href: '/kelola-rak',
          },
          {
            id: 4,
            label: 'Kelola Tipe',
            href: '/kelola-tipe',
          },
        ],
        roles: ['super-admin', 'admin'],
      },
      {
        id: 5,
        label: 'Penyimpanan',
        href: '/',
        icon: <Inbox size={24} />,
        subMenus: [
          {
            id: 1,
            label: 'Penerimaan Barang',
            href: '/penerimaan-barang',
          },
          {
            id: 2,
            label: 'Pengeluaran Barang',
            href: '/pengeluaran-barang',
          },
          {
            id: 3,
            label: 'Transfer Barang',
            href: '/transfer-barang',
          },
        ],
        roles: ['super-admin', 'admin'],
      },
    ]
  }, [])

  const spotlightMenus = useMemo<SpotlightActionGroupData[] | SpotlightActionData[]>(() => {
    if (isEmpty(menuList)) return []
    return menuList.map((menu) => {
      const actions: SpotlightActionData[] = [
        {
          id: menu.href,
          label: menu.label,
          leftSection: menu.icon,
          onClick: () => router.visit(menu.href),
        },
      ]

      if (!isEmpty(menu.subMenus)) {
        menu.subMenus!.forEach((subMenu) => {
          actions.push({
            id: `${menu.href}-${subMenu.href}`,
            label: subMenu.label,
            onClick: () => router.visit(menu.href + subMenu.href),
          })
        })

        // remove the parrent from actions
        actions.shift()
      }

      return {
        group: menu.subMenus && menu.subMenus?.length > 0 ? menu.label : '',
        actions,
      }
    })
  }, [menuList])

  return (
    <>
      <Spotlight
        actions={spotlightMenus}
        shortcut={['mod + K']}
        nothingFound="Menu tidak ditemukan"
        highlightQuery
        searchProps={{
          leftSection: <Search size={20} />,
          placeholder: 'Cari menu...',
        }}
      />

      <ScrollArea pb={rem(62)} offsetScrollbars scrollbars="y" scrollbarSize={6} px={rem(8)}>
        <List
          classNames={{
            itemLabel: '!w-full',
            itemWrapper: '!w-full',
          }}
          spacing={rem(8)}
        >
          {menuList
            .filter((menu) => {
              if (isEmpty(menu.roles)) return true
              return menu.roles?.some((role) => userRoles.includes(role))
            })
            .map((menu) => {
              if (isEmpty(menu.subMenus)) {
                return (
                  <List.Item key={`menu-${menu.id}`}>
                    <NavLink
                      href={menu.href}
                      component={Link}
                      label={menu.label}
                      prefetch
                      onClick={onToggleSidebar}
                      leftSection={menu.icon || <Inbox size={24} />}
                      className="!rounded-lg hover:!bg-gray-900 data-[active=true]:!bg-gray-600 data-[active=true]:!text-white"
                      childrenOffset={28}
                      active={url === menu.href}
                      variant="light"
                    />
                  </List.Item>
                )
              } else {
                return (
                  <List.Item key={`menu-${menu.id}`}>
                    <NavLink
                      component={'button'}
                      label={menu.label}
                      leftSection={menu.icon}
                      className="!rounded-lg hover:!bg-gray-900"
                      childrenOffset={28}
                      active={url === menu.href}
                      variant="light"
                    >
                      {menu.subMenus && (
                        <List
                          classNames={{
                            itemLabel: '!w-full',
                            itemWrapper: '!w-full',
                          }}
                        >
                          {menu.subMenus?.map((subMenu) => (
                            <List.Item key={`sub-menu-${subMenu.id}`}>
                              <NavLink
                                href={subMenu.href}
                                component={Link}
                                prefetch
                                label={subMenu.label}
                                className="!rounded-lg hover:!bg-gray-900 data-[active=true]:!bg-gray-600 data-[active=true]:!text-white"
                                childrenOffset={28}
                                active={url.includes(subMenu.href)}
                                variant="light"
                                onClick={onToggleSidebar}
                              />
                            </List.Item>
                          ))}
                        </List>
                      )}
                    </NavLink>
                  </List.Item>
                )
              }
            })}
        </List>
      </ScrollArea>
    </>
  )
}
export default NavList
