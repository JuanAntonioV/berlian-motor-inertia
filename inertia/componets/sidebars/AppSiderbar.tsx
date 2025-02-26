import { Link } from '@inertiajs/react'
import BrandLogo from '../brands/BrandLogo'
import NavList from './NavList'
import { Box } from '@mantine/core'
import SidebarProfile from './SidebarProfile'

const AppSiderbar = () => {
  return (
    <Box component="aside" c={'white'} bg={'black'} visibleFrom="lg" pos={'relative'}>
      <Box component="header" className="flex-center" p={'md'}>
        <Link href="/dashboard" prefetch className="w-full">
          <BrandLogo />
        </Link>
      </Box>

      <main className="mt-6">
        <NavList />
      </main>

      <Box pos={'absolute'} bottom={0} w={'100%'}>
        <SidebarProfile />
      </Box>
    </Box>
  )
}
export default AppSiderbar
