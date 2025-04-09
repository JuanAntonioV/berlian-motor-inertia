import {
  SimpleGrid,
  Card,
  Title,
  NumberFormatter,
  Paper,
  Center,
  Flex,
  rem,
  Group,
  Text,
  Skeleton,
} from '@mantine/core'
import { IconPackageExport, IconShoppingCart } from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'
import { Wallet, ShoppingBasket } from 'lucide-react'
import { DateTime } from 'luxon'
import { getDashboardStatsApi } from '~/api/dashboard_api'

const DashboardStatSection = () => {
  const { data, isPending, isError } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: getDashboardStatsApi,
    select: (res) => res.data,
  })

  if (isPending || isError)
    return (
      <SimpleGrid cols={{ base: 1, sm: 2, md: 3, xl: 4 }}>
        <Skeleton height={120} radius="md" />
        <Skeleton height={120} radius="md" />
        <Skeleton height={120} radius="md" />
        <Skeleton height={120} radius="md" />
      </SimpleGrid>
    )

  return (
    <SimpleGrid cols={{ base: 1, sm: 2, md: 3, xl: 4 }}>
      <Card shadow="xs" className="!space-y-2">
        <Title order={3} fz={'sm'} fw={'normal'} c={'gray.6'}>
          Total Penjualan
        </Title>
        <Group justify="space-between" align="center">
          <Text fz={'h2'} fw={'bold'}>
            <NumberFormatter
              value={data?.totalIncome || 0}
              prefix="Rp "
              decimalSeparator=","
              thousandSeparator="."
            />
          </Text>

          <Paper p="xs" radius="md" bg="cyan" className="!text-white">
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
          Total Pembelian
        </Title>
        <Group justify="space-between" align="center">
          <Text fz={'h2'} fw={'bold'}>
            <NumberFormatter
              value={data?.totalOutcome || 0}
              prefix="Rp "
              decimalSeparator=","
              thousandSeparator="."
            />
          </Text>

          <Paper p="xs" radius="md" bg="orange" className="!text-white">
            <Center>
              <IconShoppingCart size={24} />
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
          Total Produk
        </Title>
        <Group justify="space-between" align="center">
          <Text fz={'h2'} fw={'bold'}>
            <NumberFormatter
              value={data?.totalProduct || 0}
              decimalSeparator=","
              thousandSeparator="."
            />
          </Text>

          <Paper p="xs" radius="md" bg="blue" className="!text-white">
            <Center>
              <IconPackageExport size={24} />
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
          Total Stok
        </Title>
        <Group justify="space-between" align="center">
          <Text fz={'h2'} fw={'bold'}>
            <NumberFormatter
              value={data?.totalStocks || 0}
              decimalSeparator=","
              thousandSeparator="."
            />
          </Text>

          <Paper p="xs" radius="md" bg="teal" className="!text-white">
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
export default DashboardStatSection
