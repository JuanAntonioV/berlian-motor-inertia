import { usePage } from '@inertiajs/react'
import { getExactUrl } from '~/lib/utils'

const AppPageTitle = () => {
  const { url } = usePage()
  const urlName = getExactUrl(url)
  return <h2 className="font-semibold capitalize">{urlName || 'Dashboard'}</h2>
}
export default AppPageTitle
