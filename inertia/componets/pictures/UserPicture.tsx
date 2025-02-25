import { usePage } from '@inertiajs/react'
import { Avatar, Center, rem } from '@mantine/core'
import { TUser } from '~/types'

type Props = {
  size?: number
}

const UserPicture = ({ size = 32 }: Props) => {
  const props = usePage().props
  const user = props.user as TUser

  if (!user) return null

  return (
    <Center>
      {user && user?.image ? (
        <Avatar src={user.image} alt={user.fullName} size={rem(size)} radius={'100%'} />
      ) : (
        <Avatar size={rem(size)} radius={'100%'} />
      )}
    </Center>
  )
}
export default UserPicture
