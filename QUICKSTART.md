# Quick Start Guide - Excel Converter

Panduan cepat untuk menjalankan aplikasi Excel Converter.

## Opsi 1: Jalankan dengan Docker (TERCEPAT)

```bash
# 1. Clone atau extract project
cd /DATA/Excel

# 2. Build dan jalankan dengan Docker Compose
docker-compose up --build

# 3. Buka browser
# Frontend: http://localhost
# Backend: http://localhost:5000
```

**SELESAI!** Aplikasi sudah berjalan.

---

## Opsi 2: Development Mode (Tanpa Docker)

### Backend

```bash
# 1. Masuk ke folder backend
cd backend

# 2. Install dependencies
npm install

# 3. Jalankan server
npm run dev

# Server akan berjalan di http://localhost:5000
```

### Frontend (Terminal Baru)

```bash
# 1. Masuk ke folder frontend
cd frontend

# 2. Install dependencies
npm install

# 3. Jalankan development server
npm run dev

# Aplikasi akan berjalan di http://localhost:5173
```

---

## Cara Menggunakan

### 1. Upload File
- Buka aplikasi di browser
- Drag & drop file Excel atau klik untuk upload
- Format: .xlsx, .xls, .csv (max 10MB)

### 2. Mapping Kolom
- Lihat kolom yang terdeteksi dari file
- Ubah nama kolom tujuan sesuai kebutuhan
- Drag untuk reorder kolom
- Klik "Konversi File"

### 3. Simpan Template (Opsional)
- Klik "Simpan Template"
- Beri nama template
- Template dapat digunakan untuk file lain

### 4. Download Hasil
- Setelah konversi selesai
- Klik "Download File"
- File hasil akan terdownload

---

## Stop Aplikasi

### Jika Menggunakan Docker
```bash
docker-compose down
```

### Jika Development Mode
- Tekan `Ctrl + C` di terminal backend
- Tekan `Ctrl + C` di terminal frontend

---

## Troubleshooting Cepat

**Port sudah digunakan?**
```bash
# Cek port 5000
lsof -i :5000

# Kill process
kill -9 <PID>
```

**Frontend tidak connect ke backend?**
- Pastikan backend sudah running
- Check file `backend/.env` - CORS_ORIGIN harus sesuai

**Docker error?**
```bash
# Clear cache dan rebuild
docker-compose down
docker system prune -a
docker-compose up --build
```

---

## Next Steps

- Baca [README.md](README.md) untuk dokumentasi lengkap
- Lihat [FASE2-API-INTEGRATION.md](FASE2-API-INTEGRATION.md) untuk integrasi API
- Lihat [sample-template.json](sample-template.json) untuk contoh template

---

**Selamat menggunakan Excel Converter!**
