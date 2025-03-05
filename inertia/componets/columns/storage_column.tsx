import { Text } from '@mantine/core'
import { DateTime } from 'luxon'
import { createMRTColumnHelper } from 'mantine-react-table'
import { TStorage } from '~/types'
import ImageViewer from '../modals/ImageViewer'

const columnHelper = createMRTColumnHelper<TStorage>()

export const storageColumn = [
  columnHelper.display({
    header: 'Gambar',
    Cell: ({ cell }) => <ImageViewer src={cell.row.original.image} />,
  }),
  columnHelper.accessor('name', {
    header: 'Nama',
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
