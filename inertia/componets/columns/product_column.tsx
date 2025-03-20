import { NumberFormatter, Text } from '@mantine/core'
import { DateTime } from 'luxon'
import { createMRTColumnHelper } from 'mantine-react-table'
import { TProduct } from '~/types'
import ImageViewer from '../modals/ImageViewer'

const columnHelper = createMRTColumnHelper<TProduct>()

export const productColumn = [
  columnHelper.display({
    header: 'Gambar',
    Cell: ({ cell }) => <ImageViewer src={cell.row.original.image} />,
  }),
  columnHelper.accessor('sku', {
    header: 'SKU',
    enableClickToCopy: true,
    enableSorting: false,
  }),
  columnHelper.accessor('name', {
    header: 'Nama Produk',
  }),
  columnHelper.accessor('salePrice', {
    header: 'Harga Jual',
    Cell: ({ cell }) => (
      <Text size="sm">
        <NumberFormatter
          value={cell.getValue()}
          prefix="Rp "
          thousandSeparator="."
          decimalSeparator=","
        />
      </Text>
    ),
  }),
  columnHelper.accessor('workshopPrice', {
    header: 'Harga Bengkel',
    Cell: ({ cell }) => (
      <Text size="sm">
        <NumberFormatter
          value={cell.getValue()}
          prefix="Rp "
          thousandSeparator="."
          decimalSeparator=","
        />
      </Text>
    ),
  }),
  columnHelper.accessor('wholesalePrice', {
    header: 'Harga Grosir',
    Cell: ({ cell }) => (
      <Text size="sm">
        <NumberFormatter
          value={cell.getValue()}
          prefix="Rp "
          thousandSeparator="."
          decimalSeparator=","
        />
      </Text>
    ),
  }),
  columnHelper.accessor('supplierPrice', {
    header: 'Harga Supplier',
    Cell: ({ cell }) => (
      <Text size="sm">
        <NumberFormatter
          value={cell.getValue()}
          prefix="Rp "
          thousandSeparator="."
          decimalSeparator=","
        />
      </Text>
    ),
  }),
  columnHelper.accessor('meta.totalStock', {
    header: 'Total Stok',
    Cell: ({ cell }) => (
      <Text size="sm">
        <NumberFormatter value={cell.getValue() || 0} thousandSeparator="." decimalSeparator="," />
      </Text>
    ),
  }),
  columnHelper.accessor('createdAt', {
    header: 'Dibuat',
    Cell: ({ cell }) => (
      <Text size="sm">
        {DateTime.fromJSDate(new Date(cell.getValue())).toLocaleString(DateTime.DATETIME_MED)}
      </Text>
    ),
  }),
]
