import Permission from '#models/permission'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    // Write your database queries inside the run method
    const permissionData = [
      {
        name: 'Kelola Karyawan',
        description: 'Mengizinkan user untuk mengakses fitur kelola karyawan',
        slug: 'kelola-karyawan',
      },
      {
        name: 'Kelola Produk',
        description: 'Mengizinkan user untuk mengakses fitur kelola produk',
        slug: 'kelola-produk',
      },
      {
        name: 'Kelola Kategori',
        description: 'Mengizinkan user untuk mengakses fitur kelola kategori',
        slug: 'kelola-kategori',
      },
      {
        name: 'Kelola Merek',
        description: 'Mengizinkan user untuk mengakses fitur kelola merek',
        slug: 'kelola-merek',
      },
      {
        name: 'Kelola Rak',
        description: 'Mengizinkan user untuk mengakses fitur kelola rak',
        slug: 'kelola-rak',
      },
      {
        name: 'Kelola Tipe',
        description: 'Mengizinkan user untuk mengakses fitur kelola tipe',
        slug: 'kelola-tipe',
      },
      {
        name: 'Kelola Penerimaan Barang',
        description: 'Mengizinkan user untuk mengakses fitur kelola penerimaan barang',
        slug: 'kelola-penerimaan-barang',
      },
      {
        name: 'Kelola Pengeluaran Barang',
        description: 'Mengizinkan user untuk mengakses fitur kelola pengeluaran barang',
        slug: 'kelola-pengeluaran-barang',
      },
      {
        name: 'Kelola Transfer Barang',
        description: 'Mengizinkan user untuk mengakses fitur kelola transfer barang',
        slug: 'kelola-transfer-barang',
      },
    ]

    await Permission.createMany(permissionData)
  }
}
