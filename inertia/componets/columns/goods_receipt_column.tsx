import { NumberFormatter, Text } from '@mantine/core'
import { DateTime } from 'luxon'
import { createMRTColumnHelper } from 'mantine-react-table'
import { TGoodsReceipt } from '~/types'

const columnHelper = createMRTColumnHelper<TGoodsReceipt>()

export const goodsReceiptColumn = [
  columnHelper.accessor('id', {
    header: 'Nomor Transaksi',
    enableClickToCopy: true,
    enableSorting: false,
  }),
  columnHelper.accessor('supplier.name', {
    header: 'Nama Pemasok',
  }),
  columnHelper.accessor('totalAmount', {
    header: 'Total Harga',
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
