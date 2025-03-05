import { Image, ImageProps, rem } from '@mantine/core'
import { AspectRatio, Modal } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'

type Props = {
  src: string | null
} & ImageProps
const ImageViewer = ({ src, ...props }: Props) => {
  const [opened, { open, close }] = useDisclosure()

  return (
    <>
      <AspectRatio ratio={1} w={rem(100)} h={rem(100)}>
        <Image
          src={src}
          alt="Gambar"
          fallbackSrc="https://images.placeholders.dev/?width=400&height=400&text=image"
          onClick={open}
          className="cursor-zoom-in"
          radius={'md'}
          {...props}
        />
      </AspectRatio>

      <Modal opened={opened} onClose={close} title="View Image" maw={rem(400)}>
        <Image
          src={src}
          alt="Gambar"
          fallbackSrc="https://images.placeholders.dev/?width=400&height=400&text=image"
          className="w-full"
        />
      </Modal>
    </>
  )
}
export default ImageViewer
