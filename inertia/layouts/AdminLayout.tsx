import { Box, ScrollArea } from '@mantine/core'
import AppHeader from '~/componets/headers/AppHeader'
import AppSiderbar from '~/componets/sidebars/AppSiderbar'

type Props = {
  children: Readonly<React.ReactNode>
}
const AdminLayout = ({ children }: Props) => {
  return (
    <Box className="grid lg:grid-cols-[250px_1fr] dark:bg-inherit" bg={'gray.1'}>
      <AppSiderbar />
      <Box>
        <AppHeader />
        <Box bg={'gray.1'} pb={'md'} className="dark:bg-inherit">
          <ScrollArea className="!h-[calc(100vh-153px)]" type="always">
            {children}
          </ScrollArea>
        </Box>
      </Box>
    </Box>
  )
}
export default AdminLayout
