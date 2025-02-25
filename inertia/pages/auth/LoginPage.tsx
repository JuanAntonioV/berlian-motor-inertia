import { Center } from '@mantine/core'
import LoginSection from '../../componets/sections/LoginSection'
import GenerateAdminSection from '~/componets/sections/GenerateAdminSection'
import { Head, usePage } from '@inertiajs/react'

const LoginPage = () => {
  const { isAdminExist } = usePage().props

  return (
    <>
      <Head title="Masuk" />
      <Center h={'100vh'} className="bg-linear-to-r from-cyan-500 to-blue-500">
        {isAdminExist ? <LoginSection /> : <GenerateAdminSection />}
      </Center>
    </>
  )
}
export default LoginPage
