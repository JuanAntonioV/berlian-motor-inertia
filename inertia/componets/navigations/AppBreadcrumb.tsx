import { Link, usePage } from '@inertiajs/react'
import { Breadcrumbs } from '@mantine/core'
import { Home } from 'lucide-react'

const AppBreadcrumb = () => {
  const { url } = usePage()
  return (
    <Breadcrumbs className="px-0 text-sm bg-inherit">
      <Link href="/" className="text-gray-600 flex-center">
        <Home size={16} />
        <span className="ml-2">Home</span>
      </Link>
      {url.split('/').map((item, index, array) => {
        // remove empty string and number
        // if (item === "" || !isNaN(Number(item))) return;
        if (item === '') return

        // remove search query from url
        if (item.includes('?')) {
          item = item.split('?')[0]
        }

        item = item.replace(/-/g, ' ')
        const path = array.slice(0, index + 1).join('/')

        return (
          <Link href={path} key={index} className="capitalize">
            <span>{item}</span>
          </Link>
        )
      })}
    </Breadcrumbs>
  )
}
export default AppBreadcrumb
