import { Alert, Button, Modal, ModalProps, Textarea, TextInput } from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Info } from 'lucide-react'
import { useEffect, useMemo } from 'react'
import toast from 'react-hot-toast'
import { createTypeApi, updateTypeApi } from '~/api/type_api'
import { typeSchema } from '~/lib/validators'
import { TType } from '~/types'
import Form from '../forms/Form'
import { Stack } from '@mantine/core'
import { Group } from '@mantine/core'

type Props = { data?: TType | null } & ModalProps

const TypeModal = ({ data, ...props }: Props) => {
  const isEditing = useMemo(() => !!data, [data])

  const form = useForm({
    mode: 'uncontrolled',
    validate: zodResolver(typeSchema),
  })

  useEffect(() => {
    if (data) {
      form.setValues(data)
    }
  }, [data])

  const queryClient = useQueryClient()

  const {
    mutate: updateType,
    isPending: isUpdating,
    error: updateError,
  } = useMutation({
    mutationFn: updateTypeApi,
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['types'] })
      form.reset()
      props.onClose()
    },
    onError: (err) => {
      toast.error(err?.message || 'Gagal mengupdate tipe')
    },
  })

  const {
    mutate: createType,
    isPending: isCreating,
    error: createError,
  } = useMutation({
    mutationFn: createTypeApi,
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['types'] })
      form.reset()
      props.onClose()
    },
    onError: (err) => {
      toast.error(err?.message || 'Gagal menambah tipe')
    },
  })

  const onSubmit = (values: typeof form.values) => {
    if (isEditing) {
      updateType({ id: data?.id, ...values })
    } else {
      createType(values)
    }
  }

  return (
    <Modal.Root
      {...props}
      onClose={() => {
        props.onClose()
        form.reset()
      }}
    >
      <Modal.Overlay />
      <Modal.Content radius={'lg'}>
        <Modal.Header className="border-b border-gray-300">
          <Modal.Title>{isEditing ? 'Edit Tipe' : 'Tambah Tipe'}</Modal.Title>
          <Modal.CloseButton />
        </Modal.Header>

        <Form onSubmit={form.onSubmit(onSubmit)}>
          <Modal.Body py={'lg'}>
            {(updateError || createError) && (
              <Alert color="red" c={'red'} icon={<Info />} mb={'md'}>
                {updateError?.message || createError?.message || 'Gagal mengupdate tipe'}
              </Alert>
            )}

            <Stack gap={'md'}>
              <TextInput
                placeholder="Masukkan nama tipe"
                label="Nama Tipe"
                withAsterisk
                data-autofocus
                key={form.key('name')}
                {...form.getInputProps('name')}
              />
              <Textarea
                placeholder="Masukkan deskripsi tipe"
                label="Deskripsi Tipe"
                rows={3}
                key={form.key('description')}
                {...form.getInputProps('description')}
              />
            </Stack>
          </Modal.Body>
          <Stack component={'footer'} gap={'md'} p={'md'} className="border-t border-gray-300">
            <Group justify="end">
              <Button
                variant="outline"
                onClick={() => {
                  props.onClose()
                  form.reset()
                }}
              >
                Batal
              </Button>
              <Button type="submit" loading={isUpdating || isCreating}>
                {isEditing ? 'Update' : 'Tambah'}
              </Button>
            </Group>
          </Stack>
        </Form>
      </Modal.Content>
    </Modal.Root>
  )
}
export default TypeModal
