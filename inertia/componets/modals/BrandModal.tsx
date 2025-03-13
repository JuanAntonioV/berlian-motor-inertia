import { Alert, Button, Modal, ModalProps, Textarea, TextInput } from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Info } from 'lucide-react'
import { useEffect, useMemo } from 'react'
import toast from 'react-hot-toast'
import { createBrandApi, updateBrandApi } from '~/api/brand_api'
import { brandSchema } from '~/lib/validators'
import { TBrand } from '~/types'
import Form from '../forms/Form'
import { Stack } from '@mantine/core'
import { Group } from '@mantine/core'
import { router } from '@inertiajs/react'

type Props = { data?: TBrand | null; onCreatedId?: (id: number) => void } & ModalProps

const BrandModal = ({ data, onCreatedId, ...props }: Props) => {
  const isEditing = useMemo(() => !!data, [data])

  const form = useForm({
    mode: 'uncontrolled',
    validate: zodResolver(brandSchema),
  })

  useEffect(() => {
    if (data) {
      form.setValues(data)
    }
  }, [data])

  const queryClient = useQueryClient()

  const {
    mutate: updateBrand,
    isPending: isUpdating,
    error: updateError,
  } = useMutation({
    mutationFn: updateBrandApi,
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['brands'] })
      form.reset()
      props.onClose()
    },
    onError: (err) => {
      toast.error(err?.message || 'Gagal mengupdate merek')
    },
  })

  const {
    mutate: createBrand,
    isPending: isCreating,
    error: createError,
  } = useMutation({
    mutationFn: createBrandApi,
    onSuccess: (res) => {
      queryClient.refetchQueries({ queryKey: ['brands'] })
      if (onCreatedId) {
        router.reload({ only: ['brandList'] })
        onCreatedId(res.data.id)
      }
      form.reset()
      props.onClose()
    },
    onError: (err) => {
      toast.error(err?.message || 'Gagal menambah merek')
    },
  })

  const onSubmit = (values: typeof form.values) => {
    if (isEditing) {
      updateBrand({ id: data?.id, ...values })
    } else {
      createBrand(values)
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
          <Modal.Title>{isEditing ? 'Edit Merek' : 'Tambah Merek'}</Modal.Title>
          <Modal.CloseButton />
        </Modal.Header>

        <Form onSubmit={form.onSubmit(onSubmit)}>
          <Modal.Body py={'lg'}>
            {(updateError || createError) && (
              <Alert color="red" c={'red'} icon={<Info />} mb={'md'}>
                {updateError?.message || createError?.message || 'Gagal mengupdate merek'}
              </Alert>
            )}

            <Stack gap={'md'}>
              <TextInput
                placeholder="Masukkan nama merek"
                label="Nama Merek"
                withAsterisk
                data-autofocus
                key={form.key('name')}
                {...form.getInputProps('name')}
              />
              <Textarea
                placeholder="Masukkan deskripsi merek"
                label="Deskripsi Merek"
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
export default BrandModal
