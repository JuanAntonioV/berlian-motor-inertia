import 'dayjs/locale/id'
import { DatesProvider } from '@mantine/dates'
import { Settings } from 'luxon'
import { Toaster } from 'react-hot-toast'

type Props = {
  children: Readonly<React.ReactNode>
}

Settings.defaultZone = 'Asia/Jakarta'
Settings.defaultLocale = 'id-ID'

const AppProvider = ({ children }: Props) => {
  return (
    <DatesProvider settings={{ locale: 'id', timezone: 'Asia/Jakarta' }}>
      {children}
      <Toaster position="top-center" />
    </DatesProvider>
  )
}
export default AppProvider
