import { Badge, Group, Text } from '@mantine/core'
import { DateTime } from 'luxon'
import { createMRTColumnHelper } from 'mantine-react-table'
import { TStaff } from '~/types'
import ImageViewer from '../modals/ImageViewer'

const columnHelper = createMRTColumnHelper<TStaff>()

export const staffColumn = [
  columnHelper.display({
    header: 'Foto',
    Cell: ({ cell }) => <ImageViewer src={cell.row.original.image} />,
  }),
  columnHelper.accessor('fullName', {
    header: 'Nama Lengkap',
  }),
  columnHelper.accessor('email', {
    header: 'Alamat Email',
    enableClickToCopy: true,
  }),
  columnHelper.accessor('roles', {
    header: 'Peran',
    Cell: ({ cell }) => (
      <Group>
        {cell.getValue().map((role: string) => (
          <Badge key={role} size="sm">
            {role}
          </Badge>
        ))}
      </Group>
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
