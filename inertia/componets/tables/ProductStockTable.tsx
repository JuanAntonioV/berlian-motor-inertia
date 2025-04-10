import { Card, Stack } from '@mantine/core'
import SectionHeader from '../sections/SectionHeader'
import { useQuery } from '@tanstack/react-query'
import { getProductStockApi } from '~/api/product_api'
import DataTable from './DataTable'
import { useDisclosure } from '@mantine/hooks'
import AddProductStockModal from '../modals/AddProductStockModal'
import { productStockColumn } from '../columns/product_stock_column'
import { isEmpty } from 'lodash'
import { usePage } from '@inertiajs/react'
import { TUser } from '~/types'

type Props = {
  id: number
}
const ProductStockTable = ({ id }: Props) => {
  const user = usePage().props.user as TUser
  const userRoles = user?.roles?.map((role) => role.slug) || []
  const canAddStock = userRoles.includes('super-admin') || userRoles.includes('admin')

  const { data, isPending, isError, error } = useQuery({
    queryKey: ['product-stock', { id }],
    queryFn: () => getProductStockApi({ id }),
    select: (res) => res.data,
  })

  const [openedAddStockModal, { open: openAddStockModal, close: closeAddStockModal }] =
    useDisclosure()

  return (
    <Card shadow="xs">
      <Stack>
        <SectionHeader
          title="Stok Produk"
          description="Berisi tentang informasi stok produk yang tersedia."
        />

        {canAddStock && isEmpty(data) && (
          <AddProductStockModal
            opened={openedAddStockModal}
            onClose={closeAddStockModal}
            productId={id}
          />
        )}

        <DataTable
          data={data || []}
          columns={productStockColumn}
          loading={isPending}
          isError={isError}
          errorMessage={error?.message}
          enableRowSelection={false}
          onCreate={canAddStock && isEmpty(data) ? openAddStockModal : undefined}
          enableRowActions={false}
        />
      </Stack>
    </Card>
  )
}
export default ProductStockTable
