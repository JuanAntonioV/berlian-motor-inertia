import AppProfileMenu from '../menus/AppProfileMenu'
import AppBreadcrumb from '../navigations/AppBreadcrumb'
import AppPageTitle from '../titles/AppPageTitle'

const AppHeader = () => {
  return (
    <header className="bg-white border-b border-b-gray-200 flex flex-col items-center justify-center">
      <div className="flex items-center justify-between w-full border-b border-b-gray-200 px-6 md:px-10 min-h-20">
        <div className="flex items-center gap-4">
          {/* <AppMobileSidebar /> */}
          <AppPageTitle />
        </div>
        <div>
          <AppProfileMenu />
        </div>
      </div>
      <div className="flex items-center justify-between w-full px-6 md:px-10 py-4">
        <AppBreadcrumb />
      </div>
    </header>
  )
}
export default AppHeader
