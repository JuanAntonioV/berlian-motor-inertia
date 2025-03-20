import { Link, usePage } from '@inertiajs/react'
import { Divider, Flex, Loader, LoadingOverlay, NumberFormatter } from '@mantine/core'
import { Table } from '@mantine/core'
import { Button, Card, Group, SimpleGrid, Stack, Text, Title } from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import { StatusCodes } from 'http-status-codes'
import { ArrowLeft } from 'lucide-react'
import { DateTime } from 'luxon'
import { getGoodsReceiptDetailApi } from '~/api/goods_receipt_api'
import DisplayField from '~/componets/fields/DisplayField'
import PageTitle from '~/componets/titles/PageTitle'
import PageTransition from '~/componets/transitions/PageTransition'
import AdminLayout from '~/layouts/AdminLayout'
import NotFoundScreen from '../errors/not_found'

const DetailGoodsReceiptPage = () => {
  const { id } = usePage().props

  const { data, isPending, error } = useQuery({
    queryKey: ['goodsReceipts', { id }],
    queryFn: () => getGoodsReceiptDetailApi({ id: id as string }),
    enabled: !!id,
    select: (res) => res.data,
  })

  if (error?.code == StatusCodes.NOT_FOUND) {
    return <NotFoundScreen h="calc(100vh - 300px)" message="Transksi tidak ditemukan" />
  }

  return (
    <>
      {isPending ? (
        <LoadingOverlay
          visible={isPending}
          className="z-50"
          loaderProps={{
            children: (
              <Stack align="center" gap={'sm'}>
                <Loader size={42} />
                <Text size="sm">Memuat data transaksi...</Text>
              </Stack>
            ),
          }}
        />
      ) : (
        <PageTransition>
          <PageTitle
            title="Detail Penerimaan Barang"
            description={`Merupakan halaman detail penerimaan barang dari transaksi dengan nomor ${id}`}
          />
          <Card shadow="xs" p={'xl'}>
            <Stack gap={'xl'}>
              <SimpleGrid cols={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing="lg">
                <DisplayField title="Nomor Transaksi" value={data?.id} copyable />
                <DisplayField
                  title="Tanggal Transaksi"
                  value={DateTime.fromISO(data?.createdAt).toLocaleString(DateTime.DATETIME_MED)}
                />
                <DisplayField title="Nomor Referensi" value={data?.reference || '-'} />
                <DisplayField title="Nama Pemasok" value={data?.supplier?.name || '-'} />
              </SimpleGrid>
              <DisplayField title="Catatan" value={data?.notes || '-'} fz="md" fw={'normal'} />
              <Divider />
              <Title order={3} fz={'md'}>
                Detail Pengguna
              </Title>
              <SimpleGrid cols={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing="lg">
                <DisplayField title="Dilakukan Oleh" value={data?.user?.fullName || '-'} />
                <DisplayField title="Email" value={data?.user?.email || '-'} />
                <DisplayField title="Telepon" value={data?.user?.phone || '-'} />
              </SimpleGrid>
              <Divider />
              <Title order={3} fz={'md'}>
                Detail Barang
              </Title>
              <Table striped verticalSpacing={'md'}>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>No</Table.Th>
                    <Table.Th>Nama Barang</Table.Th>
                    <Table.Th>QTY</Table.Th>
                    <Table.Th>Harga</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {data?.items?.map((item, index) => (
                    <Table.Tr key={index}>
                      <Table.Td>
                        <Text c={'gray'}>{index + 1}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Text c={'gray'}>
                          {`${item.product?.name} - ${item.product?.sku}` || '-'}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Text c={'gray'}>
                          <NumberFormatter
                            value={item.quantity || 0}
                            thousandSeparator="."
                            decimalSeparator=","
                          />
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Text c={'gray'}>
                          <NumberFormatter
                            value={item.price || 0}
                            thousandSeparator="."
                            decimalSeparator=","
                            prefix="Rp "
                          />
                        </Text>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>

              <Flex justify="flex-end">
                <Stack maw={{ base: '50%', md: '40%' }} w={'100%'} gap={0}>
                  <Flex justify={'space-between'} align={'center'} py={'md'}>
                    <Title order={3} fz={'sm'} fw={'bold'}>
                      Total QTY:
                    </Title>
                    <Text fw={'bold'} fz={'md'}>
                      <NumberFormatter
                        value={data?.items.reduce((acc, item) => acc + item.quantity, 0) || 0}
                        thousandSeparator="."
                        decimalSeparator=","
                      />
                    </Text>
                  </Flex>
                  <Divider />
                  <Flex justify={'space-between'} align={'center'} py={'md'}>
                    <Title order={3} fz={'sm'} fw={'bold'} c={'orange'}>
                      Total Harga:
                    </Title>
                    <Text fw={'bold'} fz={'md'} c={'orange'}>
                      <NumberFormatter
                        value={data?.totalAmount || 0}
                        prefix="Rp "
                        thousandSeparator="."
                        decimalSeparator=","
                      />
                    </Text>
                  </Flex>
                  <Divider />
                </Stack>
              </Flex>
            </Stack>
          </Card>

          <Group>
            <Button
              component={Link}
              href="/penerimaan-barang"
              color="gray.4"
              c={'gray'}
              variant="outline"
              prefetch
              leftSection={<ArrowLeft size={16} />}
            >
              Kembali
            </Button>
          </Group>
        </PageTransition>
      )}
    </>
  )
}

DetailGoodsReceiptPage.layout = (page: React.ReactNode) => <AdminLayout children={page} />

export default DetailGoodsReceiptPage
