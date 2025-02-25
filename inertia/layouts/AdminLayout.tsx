import { Box } from '@mantine/core'
import AppHeader from '~/componets/headers/AppHeader'
import AppSiderbar from '~/componets/sidebars/AppSiderbar'

type Props = {
  children: Readonly<React.ReactNode>
}
const AdminLayout = ({ children }: Props) => {
  return (
    <main className="grid lg:grid-cols-[250px_1fr]">
      <AppSiderbar />
      <Box>
        <AppHeader />
        <Box
          bg={'gray.1'}
          pb={'md'}
          className="dark:bg-inherit rounded-lg h-[calc(100vh-137px)] overflow-y-auto overflow-x-hidden"
        >
          {children}
        </Box>
      </Box>
    </main>
  )
}
export default AdminLayout
