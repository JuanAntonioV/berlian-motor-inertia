import { Center, Flex, NumberFormatter, Paper, rem, Skeleton, Text } from '@mantine/core'
import { Group } from '@mantine/core'
import { Card, SimpleGrid, Title } from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import { ShoppingBasket, Wallet } from 'lucide-react'
import { DateTime } from 'luxon'
import { getGoodsReceiptStatsApi } from '~/api/goods_receipt_api'

const GoodsReceiptStatSection = () => {
  const { data, isPending, isError } = useQuery({
    queryKey: ['goodsReceiptStats'],
    queryFn: getGoodsReceiptStatsApi,
    select: (res) => res.data,
  })

  if (isPending || isError)
    return (
      <SimpleGrid cols={{ base: 1, sm: 2, md: 3, xl: 4 }}>
        <Skeleton height={120} radius="md" />
        <Skeleton height={120} radius="md" />
      </SimpleGrid>
    )

  return (
    <SimpleGrid cols={{ base: 1, sm: 2, md: 3, xl: 4 }}>
      <Card shadow="xs" className="!space-y-2">
        <Title order={3} fz={'sm'} fw={'normal'} c={'gray.6'}>
          Total Harga
        </Title>
        <Group justify="space-between" align="center">
          <Text fz={'h2'} fw={'bold'}>
            <NumberFormatter
              value={data?.totalAmount || 0}
              prefix="Rp "
              decimalSeparator=","
              thousandSeparator="."
            />
          </Text>

          <Paper p="xs" radius="md" bg="teal" className="!text-white">
            <Center>
              <Wallet size={24} />
            </Center>
          </Paper>
        </Group>
        <Flex align={'center'} gap={rem(4)}>
          <Text fz={'sm'} c={'gray.6'}>
            Terakhir diperbarui:{' '}
            <Text span fz={'sm'} c={'black'}>
              {DateTime.fromISO(data?.lastUpdated).toFormat('HH:mm')}
            </Text>
          </Text>
        </Flex>
      </Card>
      <Card shadow="xs" className="!space-y-2">
        <Title order={3} fz={'sm'} fw={'normal'} c={'gray.6'}>
          Total Transaksi
        </Title>
        <Group justify="space-between" align="center">
          <Text fz={'h2'} fw={'bold'}>
            {data?.totalGoodsReceipt}
          </Text>

          <Paper p="xs" radius="md" bg="blue" className="!text-white">
            <Center>
              <ShoppingBasket size={24} />
            </Center>
          </Paper>
        </Group>
        <Flex align={'center'} gap={rem(4)}>
          <Text fz={'sm'} c={'gray.6'}>
            Terakhir diperbarui:{' '}
            <Text span fz={'sm'} c={'black'}>
              {DateTime.fromISO(data?.lastUpdated).toFormat('HH:mm')}
            </Text>
          </Text>
        </Flex>
      </Card>
    </SimpleGrid>
  )
}
export default GoodsReceiptStatSection
