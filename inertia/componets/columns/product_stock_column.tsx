import { Text } from '@mantine/core'
import { DateTime } from 'luxon'
import { createMRTColumnHelper } from 'mantine-react-table'
import { TProductStock } from '~/types'

const columnHelper = createMRTColumnHelper<TProductStock>()

export const productStockColumn = [
  columnHelper.accessor('storage.name', {
    header: 'Nama Rak',
  }),
  columnHelper.accessor('quantity', {
    header: 'Total Stok',
  }),
  columnHelper.accessor('createdAt', {
    header: 'Dibuat Pada',
    Cell: ({ cell }) => (
      <Text size="sm">
        {DateTime.fromJSDate(new Date(cell.getValue())).toLocaleString(DateTime.DATETIME_MED)}
      </Text>
    ),
  }),
  columnHelper.accessor('updatedAt', {
    header: 'Berubah Pada',
    Cell: ({ cell }) => (
      <Text size="sm">
        {DateTime.fromJSDate(new Date(cell.getValue())).toLocaleString(DateTime.DATETIME_MED)}
      </Text>
    ),
  }),
]
