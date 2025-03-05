import {
  Alert,
  AspectRatio,
  Button,
  FileButton,
  Flex,
  Image,
  Modal,
  ModalProps,
  rem,
  Text,
  Textarea,
  TextInput,
} from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Info } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { createStorageApi, updateStorageApi } from '~/api/storage_api'
import { storageSchema } from '~/lib/validators'
import { TStorage } from '~/types'
import Form from '../forms/Form'
import { Stack } from '@mantine/core'
import { Group } from '@mantine/core'

type Props = { data?: TStorage | null } & ModalProps

const StorageModal = ({ data, ...props }: Props) => {
  const isEditing = useMemo(() => !!data, [data])

  const form = useForm({
    mode: 'uncontrolled',
    validate: zodResolver(storageSchema),
  })

  useEffect(() => {
    if (data) {
      const { name, description, image } = data

      form.setValues({
        name,
        description,
        image: null,
      })

      if (image) {
        setPreviewImage(image)
      }
    }
  }, [data])

  const queryClient = useQueryClient()

  const {
    mutate: updateStorage,
    isPending: isUpdating,
    error: updateError,
  } = useMutation({
    mutationFn: updateStorageApi,
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['storages'] })
      form.reset()
      props.onClose()
    },
    onError: (err) => {
      toast.error(err?.message || 'Gagal mengupdate rak')
    },
  })

  const {
    mutate: createStorage,
    isPending: isCreating,
    error: createError,
  } = useMutation({
    mutationFn: createStorageApi,
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['storages'] })
      form.reset()
      props.onClose()
    },
    onError: (err) => {
      toast.error(err?.message || 'Gagal menambah rak')
    },
  })

  const onSubmit = (values: typeof form.values) => {
    if (isEditing) {
      updateStorage({ id: data?.id, ...values })
    } else {
      createStorage(values)
    }
  }

  const [previewImage, setPreviewImage] = useState<string | null>(null)

  const onImageChange = (file: File | null) => {
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setPreviewImage(reader.result as string)
      }
      reader.readAsDataURL(file)
      form.getInputProps('image').onChange(file)
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
          <Modal.Title>{isEditing ? 'Edit Rak' : 'Tambah Rak'}</Modal.Title>
          <Modal.CloseButton />
        </Modal.Header>

        <Form onSubmit={form.onSubmit(onSubmit)}>
          <Modal.Body py={'lg'}>
            {(updateError || createError) && (
              <Alert color="red" c={'red'} icon={<Info />} mb={'md'}>
                {updateError?.message || createError?.message || 'Gagal mengupdate rak'}
              </Alert>
            )}

            <Stack gap={'md'}>
              <Stack gap={'sm'}>
                <Text fz={'sm'}>Foto Rak</Text>

                <Flex align={'center'} gap={'md'}>
                  {previewImage ? (
                    <AspectRatio ratio={1} w={rem(120)} h={rem(120)}>
                      <Image
                        src={previewImage}
                        alt={form.values.name}
                        fit="cover"
                        fallbackSrc="https://images.placeholders.dev/?width=400&height=400&text=image"
                        radius={'lg'}
                      />
                    </AspectRatio>
                  ) : (
                    <AspectRatio ratio={1} w={rem(120)} h={rem(120)}>
                      <Image
                        src="https://images.placeholders.dev/?width=400&height=400&text=image"
                        alt={form.values.name}
                        fit="cover"
                        radius={'lg'}
                      />
                    </AspectRatio>
                  )}

                  <Stack gap={'xs'}>
                    <FileButton
                      name="image"
                      accept="image/*"
                      key={form.key('image')}
                      {...form.getInputProps('image')}
                      onChange={onImageChange}
                    >
                      {(props) => (
                        <Button {...props} w={'fit-content'} size="xs">
                          Unggah foto
                        </Button>
                      )}
                    </FileButton>
                    <Text fz={'xs'} c={'gray.6'}>
                      Format: JPG, PNG, maksimal 2MB
                    </Text>
                  </Stack>
                </Flex>
              </Stack>

              <TextInput
                placeholder="Masukkan nama rak"
                label="Nama Rak"
                withAsterisk
                data-autofocus
                key={form.key('name')}
                {...form.getInputProps('name')}
              />
              <Textarea
                placeholder="Masukkan deskripsi rak"
                label="Deskripsi Rak"
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
export default StorageModal
