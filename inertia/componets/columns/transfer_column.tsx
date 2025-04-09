import { NumberFormatter, Text } from '@mantine/core'
import { DateTime } from 'luxon'
import { createMRTColumnHelper } from 'mantine-react-table'
import { TTransferStock } from '~/types'

const columnHelper = createMRTColumnHelper<TTransferStock>()

export const transferStockColumn = [
  columnHelper.accessor('id', {
    header: 'Nomor Transaksi',
    enableClickToCopy: true,
    enableSorting: false,
  }),
  columnHelper.accessor('reference', {
    header: 'Referensi',
    enableClickToCopy: true,
    enableSorting: false,
    Cell: ({ cell }) => <Text size="sm">{cell.getValue() || '-'}</Text>,
  }),
  columnHelper.accessor('sourceStorage.name', {
    header: 'Dari Rak',
    enableSorting: false,
    Cell: ({ cell }) => <Text size="sm">{cell.getValue() || '-'}</Text>,
  }),
  columnHelper.accessor('destinationStorage.name', {
    header: 'Rak Tujuan',
    enableSorting: false,
    Cell: ({ cell }) => <Text size="sm">{cell.getValue() || '-'}</Text>,
  }),
  columnHelper.accessor('totalAmount', {
    header: 'Total Barang',
    Cell: ({ cell }) => (
      <Text size="sm">
        <NumberFormatter value={cell.getValue()} thousandSeparator="." decimalSeparator="," />
      </Text>
    ),
  }),
  columnHelper.accessor('totalQuantity', {
    header: 'Total QTY',
    Cell: ({ cell }) => (
      <Text size="sm">
        <NumberFormatter value={cell.getValue()} thousandSeparator="." decimalSeparator="," />
      </Text>
    ),
  }),
  columnHelper.accessor('user.fullName', {
    header: 'Dibuat Oleh',
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
