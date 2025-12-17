# Excel Converter - Aplikasi Konversi Format Excel

Aplikasi web modern untuk mengubah struktur dan format file Excel dari satu aplikasi ke aplikasi lain dengan mudah menggunakan drag-and-drop interface.

## Fitur Utama

- **Upload File Excel** dengan drag-and-drop
- **Mapping Kolom Visual** dengan drag-and-drop reordering
- **Simpan & Load Template** untuk konversi yang sering dilakukan
- **Download Hasil** dalam format Excel baru
- **Desain Modern** dengan Tailwind CSS
- **Full-Stack Application** dengan React + Express

## Tech Stack

### Backend
- **Node.js** + **Express** - REST API server
- **xlsx** - Excel file processing
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing

### Frontend
- **React 18** - UI library
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Beautiful DnD** - Drag-and-drop functionality
- **Axios** - HTTP client
- **Lucide React** - Icon library

### DevOps
- **Docker** + **Docker Compose** - Containerization
- **Nginx** - Production web server

## Struktur Project

```
excel-converter/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── config.js          # Configuration management
│   │   ├── controllers/
│   │   │   ├── uploadController.js    # File upload logic
│   │   │   ├── convertController.js   # Conversion logic
│   │   │   └── templateController.js  # Template management
│   │   ├── services/
│   │   │   ├── excelService.js        # Excel processing
│   │   │   └── templateService.js     # Template storage
│   │   ├── routes/
│   │   │   ├── index.js               # Route aggregator
│   │   │   ├── uploadRoutes.js
│   │   │   ├── convertRoutes.js
│   │   │   └── templateRoutes.js
│   │   ├── middleware/
│   │   │   ├── upload.js              # Multer configuration
│   │   │   └── errorHandler.js        # Error handling
│   │   └── server.js                  # Express server
│   ├── uploads/                       # Uploaded files
│   ├── templates/                     # Saved templates (JSON)
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── FileUpload.jsx         # Drag-drop upload
│   │   │   ├── ColumnMapper.jsx       # Column mapping UI
│   │   │   └── TemplateManager.jsx    # Template CRUD
│   │   ├── services/
│   │   │   └── api.js                 # API client
│   │   ├── utils/
│   │   │   └── helpers.js             # Utility functions
│   │   ├── App.jsx                    # Main component
│   │   ├── main.jsx                   # Entry point
│   │   └── index.css                  # Global styles
│   ├── public/
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
│
├── docker-compose.yml
├── Dockerfile.backend
├── Dockerfile.frontend
├── .gitignore
└── README.md
```

## Instalasi & Menjalankan Aplikasi

### Opsi 1: Development Mode (Tanpa Docker)

#### Prerequisites
- Node.js >= 18.x
- npm >= 9.x

#### Backend Setup

```bash
# Masuk ke folder backend
cd backend

# Install dependencies
npm install

# Jalankan development server
npm run dev
```

Backend akan berjalan di `http://localhost:5000`

#### Frontend Setup

```bash
# Masuk ke folder frontend
cd frontend

# Install dependencies
npm install

# Jalankan development server
npm run dev
```

Frontend akan berjalan di `http://localhost:5173`

### Opsi 2: Production Mode (Dengan Docker)

#### Prerequisites
- Docker
- Docker Compose

#### Jalankan dengan Docker Compose

```bash
# Build dan jalankan semua services
docker-compose up --build

# Atau jalankan di background
docker-compose up -d --build
```

Aplikasi akan tersedia di:
- Frontend: `http://localhost`
- Backend API: `http://localhost:5000`

#### Stop Docker Services

```bash
docker-compose down
```

## API Endpoints

### Upload
- `POST /api/upload` - Upload Excel file
- `GET /api/upload/preview?filePath={path}` - Preview file data

### Convert
- `POST /api/convert` - Convert Excel file
  ```json
  {
    "sourceFilePath": "/path/to/file.xlsx",
    "templateId": "uuid" // or "template": {...}
  }
  ```
- `GET /api/convert/download?filePath={path}` - Download converted file

### Templates
- `GET /api/templates` - Get all templates
- `GET /api/templates/:id` - Get template by ID
- `POST /api/templates` - Create new template
- `PUT /api/templates/:id` - Update template
- `DELETE /api/templates/:id` - Delete template

### Health Check
- `GET /api/health` - API health status

## Contoh Template JSON

```json
{
  "id": "uuid-here",
  "name": "Runchise ke Accurate",
  "description": "Konversi dari format Runchise ke Accurate",
  "sourceFormat": "Runchise",
  "targetFormat": "Accurate",
  "columnMappings": [
    {
      "sourceColumn": "Nama Produk",
      "targetColumn": "Product Name",
      "transform": null
    },
    {
      "sourceColumn": "Harga",
      "targetColumn": "Price",
      "transform": {
        "type": "numberFormat",
        "config": { "decimals": 2 }
      }
    },
    {
      "sourceColumn": "Stok",
      "targetColumn": "Stock Quantity",
      "transform": null
    }
  ],
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

## Cara Menggunakan Aplikasi

### 1. Upload File Excel
- Drag & drop file Excel (.xlsx, .xls, .csv) ke area upload
- Atau klik area upload untuk memilih file
- Maksimal ukuran file: 10MB

### 2. Mapping Kolom
- Lihat kolom-kolom dari file Excel yang diupload
- Ubah nama kolom tujuan sesuai kebutuhan
- Drag kolom untuk mengubah urutan
- Tambah atau hapus mapping sesuai kebutuhan

### 3. Simpan Template (Opsional)
- Klik "Simpan Template" untuk menyimpan mapping
- Beri nama template (misal: "Runchise → Accurate")
- Template dapat digunakan untuk konversi file lain

### 4. Konversi File
- Klik tombol "Konversi File"
- Tunggu proses konversi selesai

### 5. Download Hasil
- Klik tombol "Download File"
- File hasil akan terdownload otomatis

## Environment Variables

### Backend (.env)

```env
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads
TEMPLATES_DIR=./templates

# API Configuration (untuk fase 2)
APP1_API_URL=
APP1_API_KEY=
APP2_API_URL=
APP2_API_KEY=
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:5000/api
```

## Deployment

### Rekomendasi Hosting

#### 1. Railway (Recommended)
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Deploy
railway up
```

#### 2. Render
- Create new Web Service
- Connect GitHub repository
- Set build command: `cd backend && npm install`
- Set start command: `cd backend && npm start`

#### 3. VPS (Ubuntu/Debian)

```bash
# Install Docker & Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Clone repository
git clone <your-repo-url>
cd excel-converter

# Run with Docker Compose
docker-compose up -d
```

### Nginx Configuration (untuk VPS)

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:80;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Fase 2 - Integrasi API (Roadmap)

### Fitur yang Akan Ditambahkan

1. **Module Integrasi API**
   - Connector untuk Aplikasi 1
   - Connector untuk Aplikasi 2
   - Auto-fetch data dari API
   - Auto-upload hasil ke API tujuan

2. **Scheduler Otomatis**
   - Cron job untuk konversi berkala
   - Queue system untuk batch processing
   - Email notification

3. **Advanced Features**
   - Custom transformations (formula, concat, split)
   - Batch conversion (multiple files)
   - History & logging
   - User authentication & multi-tenant

### Struktur Module API (Persiapan)

```javascript
// backend/src/services/apiIntegration/
├── app1Connector.js
├── app2Connector.js
└── scheduler.js
```

## Troubleshooting

### Backend tidak bisa start
```bash
# Check port 5000 tidak digunakan
lsof -i :5000

# Kill process jika ada
kill -9 <PID>
```

### Frontend tidak bisa connect ke backend
- Pastikan CORS_ORIGIN di backend .env sesuai dengan frontend URL
- Pastikan backend sudah running
- Check browser console untuk error CORS

### File upload gagal
- Check MAX_FILE_SIZE di .env
- Pastikan folder uploads/ memiliki write permission
- Check disk space available

### Docker build error
```bash
# Clear Docker cache
docker system prune -a

# Rebuild tanpa cache
docker-compose build --no-cache
```

## Development Tips

### Hot Reload
- Backend menggunakan `nodemon` untuk auto-reload
- Frontend menggunakan Vite HMR (Hot Module Replacement)

### Debugging
```javascript
// Backend: Tambahkan di controller
console.log('Debug:', variableName);

// Frontend: Gunakan React DevTools
console.log('State:', state);
```

### Testing API dengan curl

```bash
# Health check
curl http://localhost:5000/api/health

# Get all templates
curl http://localhost:5000/api/templates

# Upload file
curl -X POST http://localhost:5000/api/upload \
  -F "file=@/path/to/file.xlsx"
```

## Contributing

Pull requests are welcome! Untuk perubahan besar, silakan buka issue terlebih dahulu.

## License

MIT License - Feel free to use this project for personal or commercial purposes.

## Support

Jika ada pertanyaan atau issue:
1. Buka GitHub Issues
2. Atau email ke: support@example.com

---

**Dibuat dengan ❤️ menggunakan React + Express**
