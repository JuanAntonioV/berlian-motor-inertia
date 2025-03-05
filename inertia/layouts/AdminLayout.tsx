import { Box, ScrollArea } from '@mantine/core'
import AppHeader from '~/componets/headers/AppHeader'
import AppSiderbar from '~/componets/sidebars/AppSiderbar'

type Props = {
  children: Readonly<React.ReactNode>
}
const AdminLayout = ({ children }: Props) => {
  return (
    <Box w={'100vw'} h={'100vh'} display={'flex'} className="!text-gray-900">
      <AppSiderbar />
      <Box component="main" flex={1} bg={'gray.0'}>
        <AppHeader />
        <ScrollArea.Autosize
          scrollbars={'y'}
          pos={'relative'}
          mah={'calc(100vh - 140px)'}
          type="always"
        >
          <Box
            component="main"
            w={{
              base: '100vw',
              lg: 'calc(100vw - 255px)',
            }}
          >
            {children}
          </Box>
        </ScrollArea.Autosize>
      </Box>
    </Box>
  )
}
export default AdminLayout
