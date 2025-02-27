import { Head } from '@inertiajs/react'
import { SimpleGrid } from '@mantine/core'
import ProfileSection from '~/componets/sections/ProfileSection'
import ResetPasswordSection from '~/componets/sections/ResetPasswordSection'
import AdminLayout from '~/layouts/AdminLayout'

const ProfilePage = () => {
  return (
    <>
      <Head title="Akun Saya" />
      <SimpleGrid
        cols={{ base: 1, md: 3 }}
        p={{ base: 'md', lg: 'xl' }}
        spacing={0}
        className="!gap-y-6 md:!gap-4"
      >
        <ProfileSection />
        <ResetPasswordSection />
      </SimpleGrid>
    </>
  )
}

ProfilePage.layout = (page: React.ReactNode) => <AdminLayout children={page} />

export default ProfilePage
