import { Settings } from 'luxon'
import { Toaster } from 'react-hot-toast'

type Props = {
  children: Readonly<React.ReactNode>
}

Settings.defaultZone = 'Asia/Jakarta'
Settings.defaultLocale = 'id-ID'

const AppProvider = ({ children }: Props) => {
  return (
    <>
      {children}
      <Toaster position="top-center" />
    </>
  )
}
export default AppProvider
