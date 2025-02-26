import { Toaster } from 'react-hot-toast'

type Props = {
  children: Readonly<React.ReactNode>
}

const AppProvider = ({ children }: Props) => {
  return (
    <>
      {children}
      <Toaster position="bottom-right" />
    </>
  )
}
export default AppProvider
