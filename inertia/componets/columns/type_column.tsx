import { Text } from '@mantine/core'
import { DateTime } from 'luxon'
import { createMRTColumnHelper } from 'mantine-react-table'
import { TType } from '~/types'

const columnHelper = createMRTColumnHelper<TType>()

export const typeColumn = [
  columnHelper.accessor('name', {
    header: 'Nama',
    enableClickToCopy: true,
  }),
  columnHelper.accessor('description', {
    header: 'Deskripsi',
    Cell: ({ cell }) => (
      <Text size="sm" lineClamp={1}>
        {cell.getValue() || '-'}
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
