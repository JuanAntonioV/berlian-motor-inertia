import { Link, usePage } from '@inertiajs/react'
import { useQuery } from '@tanstack/react-query'
import { StatusCodes } from 'http-status-codes'
import { getReductionOfGoodsDetailApi } from '~/api/reduction_of_good_api'
import PageTransition from '~/componets/transitions/PageTransition'
import AdminLayout from '~/layouts/AdminLayout'
import NotFoundScreen from '../errors/not_found'
import {
  LoadingOverlay,
  Stack,
  Card,
  SimpleGrid,
  Divider,
  Title,
  NumberFormatter,
  Flex,
  Button,
  Text,
  Loader,
  Table,
  Group,
} from '@mantine/core'
import { ArrowLeft, Download } from 'lucide-react'
import { DateTime } from 'luxon'
import DisplayField from '~/componets/fields/DisplayField'
import PageTitle from '~/componets/titles/PageTitle'

const DetailReductionOfGoodPage = () => {
  const { id } = usePage().props

  const { data, isPending, error } = useQuery({
    queryKey: ['reductionOfGoods', { id }],
    queryFn: () => getReductionOfGoodsDetailApi({ id: id as string }),
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
            title="Detail Pengeluaran Barang"
            description={`Merupakan halaman detail pengeluaran barang dari transaksi dengan nomor ${id}`}
          />
          <Card shadow="xs" p={'xl'}>
            <Stack gap={'xl'}>
              <SimpleGrid cols={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing="lg">
                <DisplayField title="Nomor Transaksi" value={data?.id} copyable />
                <DisplayField
                  title="Tanggal Pengeluaran"
                  value={DateTime.fromISO(data?.reducedAt).toLocaleString(DateTime.DATE_MED)}
                />
                <DisplayField
                  title="Tanggal Transaksi"
                  value={DateTime.fromISO(data?.createdAt).toLocaleString(DateTime.DATETIME_MED)}
                />
                <DisplayField title="Nomor Referensi" value={data?.reference || '-'} />
              </SimpleGrid>
              <DisplayField title="Catatan" value={data?.notes || '-'} fz="md" fw={'normal'} />
              <Divider />
              <Stack gap={'md'}>
                <Title order={3} fz={'md'}>
                  Detail Pengguna
                </Title>
                <SimpleGrid cols={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing="lg">
                  <DisplayField title="Dilakukan Oleh" value={data?.user?.fullName || '-'} />
                  <DisplayField title="Email" value={data?.user?.email || '-'} />
                  <DisplayField title="Telepon" value={data?.user?.phone || '-'} />
                </SimpleGrid>
              </Stack>
              <Divider />
              <Stack gap={'md'}>
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

                {data?.attachment && (
                  <Button
                    w={'fit-content'}
                    variant="outline"
                    leftSection={<Download size={16} />}
                    mt={'md'}
                    component={'a'}
                    target="_blank"
                    download={`${id}_Pengeluaran_Barang`}
                    href={`/api/reduction-of-goods/${id}/download-attachment`}
                  >
                    Download Lampiran
                  </Button>
                )}
              </Stack>

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
              href="/pengeluaran-barang"
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

DetailReductionOfGoodPage.layout = (page) => <AdminLayout children={page} />
export default DetailReductionOfGoodPage
