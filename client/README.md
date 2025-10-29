Frontend (React.js, Vite)
Buat antarmuka (UI) untuk menampilkan board Kanban menggunakan React.js dan Vite.

Fitur UI

1. Tampilan Board:
   ○ Tampilkan 3 kolom:"To Do","In Progress","Done".
   ○ Render card tugas di bawah kolom yang sesuai berdasarkan data yang diterima dari API (GET
   /api/tasks).

2. Tambah Tugas:
   ○ Buat tombol"Tambah Tugas" yang membuka modal atau form.
   ○ Form ini mengirim data ke POST /api/tasks.
   ○ Setelah berhasil, board harus otomatis diperbarui untuk menampilkan tugas baru di kolom "To Do".

3. Update Status (Pindah Kolom):
   ○ Pengguna harus bisa mengubah status tugas untuk memindahkannya ke kolom lain.
   ○ Opsi 1 (Wajib): Setiap card tugas memiliki dropdown untuk memilih status baru (To Do, In Progress,
   Done).
   ○ Opsi 2 (Bonus): Implementasi Drag and Drop (misal: react-beautiful-dnd atau dnd-kit) untuk
   memindahkan card antar kolom.
   ○ Aksi ini harus memanggil PUT /api/tasks/:id dengan status yang baru.

4. Hapus Tugas:
   ○ Setiap card memiliki tombol hapus (disarankan ada konfirmasi) yang memanggil DELETE
   /api/tasks/:id.

Persyaratan Frontend
● Gunakan React Hooks (terutama useState, useEffect) untuk manajemen state dan logic.

● Gunakan axios atau fetch untuk berkomunikasi dengan API backend.
● Pisahkan UI menjadi komponen-komponen yang reusable (misal: <Board>, <Column>, <TaskCard>).
