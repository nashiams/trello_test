Backend (Express.js, Sequelize, PostgreSQL)
Buat REST API dengan struktur yang rapi (misal: memisahkan routes, controllers, models).

Model Task (PostgreSQL/Sequelize)
● id: UUID (atau integer)
● title: String (wajib diisi, tidak boleh kosong)
● description: Text (opsional)
● status: Enum/String (Kolom ini wajib, dengan nilai default: 'To Do'. Nilai yang diizinkan: 'To Do', 'In
Progress', 'Done')
● createdAt, updatedAt: (dibuat otomatis oleh Sequelize)

Endpoints API

1. POST /api/tasks: Membuat tugas baru.
   ○ Input: {"title":"...","description":"..."}

○ status harus otomatis diatur ke 'To Do' saat pembuatan.
○ Terapkan validasi: title tidak boleh kosong.

2. GET /api/tasks: Mendapatkan semua tugas.
   ○ Respons harus mengelompokkan tugas berdasarkan statusnya agar mudah dirender oleh
   frontend.
   ○ Contoh Respons:
   JSON
   {
   "To Do": [
   {"id": 1,"title":"Task A", ... },
   {"id": 2,"title":"Task B", ... }
   ],
   "In Progress": [
   {"id": 3,"title":"Task C", ... }
   ],
   "Done": [
   {"id": 4,"title":"Task D", ... }
   ]
   }

3. PUT /api/tasks/:id: Memperbarui tugas.
   ○ Bisa digunakan untuk memperbarui title, description, atau status (untuk memindahkan tugas
   antar kolom).

4. DELETE /api/tasks/:id: Menghapus tugas.

Persyaratan Backend
● Migrations: Setup tabel database harus menggunakan Sequelize Migrations.
● Validasi: Terapkan validasi input (misal: title tidak boleh kosong) menggunakan express-validator atau
validasi bawaan Sequelize.
● Error Handling: Buat satu middleware error handling terpusat untuk menangani kesalahan secara
konsisten.
● Struktur: Kode harus terorganisir dengan baik.
