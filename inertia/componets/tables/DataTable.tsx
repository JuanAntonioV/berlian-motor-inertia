import { ActionIcon, Button, Group, Text, Tooltip } from '@mantine/core'
import { modals } from '@mantine/modals'
import { CircleAlert, Edit3, Plus, RefreshCcw, Trash2 } from 'lucide-react'
import {
  MantineReactTable,
  MRT_ColumnDef,
  MRT_RowData,
  MRT_TableOptions,
  useMantineReactTable,
} from 'mantine-react-table'

type Props<T extends MRT_RowData> = {
  data: T[]
  columns: MRT_ColumnDef<T>[]
  loading?: boolean
  isError?: boolean
  errorMessage?: string
  refetchAction?: () => void
  onDelete?: (data: T) => void
  onEdit?: (data: T) => void
  customActions?: (rowData: T) => React.ReactNode
  onCreate?: () => void
} & MRT_TableOptions<T & MRT_RowData>

const DataTable = <T extends MRT_RowData>({
  data,
  columns,
  loading,
  isError,
  errorMessage,
  refetchAction,
  onDelete,
  onEdit,
  customActions,
  onCreate,
  ...props
}: Props<T>) => {
  const confirmLogoutModal = (id) =>
    modals.openConfirmModal({
      centered: true,
      withCloseButton: false,
      size: 'sm',
      radius: 'lg',
      children: (
        <div className="flex-center flex-col gap-4 py-6">
          <CircleAlert size={62} color="red" />
          <Text size="sm" ta={'center'}>
            Apakah anda yakin ingin menghapus data ini? Data yang dihapus tidak dapat dikembalikan!
          </Text>
        </div>
      ),
      trapFocus: false,
      labels: { confirm: 'Ya', cancel: 'Batal' },
      confirmProps: { color: 'red', w: '100%', loading, autoFocus: true },
      cancelProps: { w: '100%' },
      groupProps: { className: '!flex-nowrap' },
      onConfirm: () => onDelete?.(id),
    })

  const table = useMantineReactTable({
    columns,
    data: data || [],
    mantineTableProps: { striped: true },
    enableRowSelection: true,
    enableColumnDragging: false,
    enableRowNumbers: true,
    enableColumnOrdering: true,
    enableFullScreenToggle: false,
    enableDensityToggle: false,
    enableColumnFilters: true,
    state: {
      showGlobalFilter: true,
      showSkeletons: loading || isError,
      showAlertBanner: isError,
    },
    mantineToolbarAlertBannerProps: isError
      ? {
          color: 'red',
          children: (
            <Group gap={'sm'}>
              {refetchAction && (
                <ActionIcon variant="transparent" color="red" size="sm" onClick={refetchAction}>
                  <RefreshCcw />
                </ActionIcon>
              )}
              <Text span fz={'sm'}>
                {errorMessage || 'Error fetching data'}
              </Text>
            </Group>
          ),
        }
      : undefined,
    positionToolbarAlertBanner: 'bottom',
    // mantineTableBodyRowProps: ({ row }) => ({
    //   onClick: row.getToggleSelectedHandler(),
    //   style: { cursor: 'pointer' },
    // }),
    mantineSearchTextInputProps: {
      placeholder: `Search ${data.length} rows`,
      style: { minWidth: '300px' },
    },
    mantinePaperProps: { withBorder: false, shadow: 'none' },
    enableColumnActions: false,
    enableRowActions: true,
    positionActionsColumn: 'last',
    renderTopToolbarCustomActions: () => (
      <Group>
        {onCreate && (
          <Button
            onClick={() => {
              onCreate()
            }}
            leftSection={<Plus size={18} />}
          >
            Add New
          </Button>
        )}
      </Group>
    ),
    renderRowActions: ({ row }) => (
      <Group>
        {onEdit && (
          <Tooltip label="Edit" position="left" color="blue">
            <ActionIcon
              variant="outline"
              color="blue"
              size="lg"
              onClick={(e) => {
                e.stopPropagation()
                onEdit(row.original)
              }}
            >
              <Edit3 size={20} />
            </ActionIcon>
          </Tooltip>
        )}
        {onDelete && (
          <Tooltip label="Delete" position="right" color="red">
            <ActionIcon
              variant="outline"
              color="red"
              size="lg"
              onClick={(e) => {
                e.stopPropagation()
                confirmLogoutModal(row.original.id)
              }}
            >
              <Trash2 size={20} />
            </ActionIcon>
          </Tooltip>
        )}
        {customActions?.(row.original)}
      </Group>
    ),
    ...props,
  })

  return <MantineReactTable table={table} />
}
export default DataTable
