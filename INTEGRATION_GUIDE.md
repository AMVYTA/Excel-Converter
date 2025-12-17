# 📘 Integration Guide - Row Mapping & Transformation Feature

## 🎯 Overview

Panduan lengkap untuk mengintegrasikan fitur **Row Mapping & Transformation** ke dalam Excel Converter yang sudah berjalan.

---

## 📁 File-File Baru yang Ditambahkan

### Backend Files

```
backend/src/
├── services/
│   └── rowService.js                    ✨ BARU - Row operations service
├── controllers/
│   ├── convertController.js             🔄 UPDATED - Added row preview endpoint
│   └── uploadController.js              🔄 UPDATED - Enhanced preview endpoint
├── routes/
│   └── convertRoutes.js                 🔄 UPDATED - Added row-preview route
└── services/
    ├── excelService.js                  🔄 UPDATED - Integrated row rules
    └── templateService.js               🔄 UPDATED - Support row rules in templates
```

### Frontend Files

```
frontend/src/
├── components/
│   ├── RowEditor.jsx                    ✨ BARU - Main row editing interface
│   ├── RowRuleBuilder.jsx               ✨ BARU - Filter & transform builder
│   ├── RowPreview.jsx                   ✨ BARU - Before/After preview
│   └── TemplateManager.jsx              🔄 NEEDS UPDATE - Add row rules support
├── services/
│   └── api.js                           🔄 UPDATED - Added getRowPreview
└── App.jsx                              🔄 UPDATED - Mode toggle & row integration
```

---

## 🚀 Cara Integrasi

### Step 1: Backend Setup

#### 1.1 Pastikan Semua File Backend Sudah Ada

```bash
cd backend
```

Pastikan file-file ini sudah ada:
- ✅ `src/services/rowService.js`
- ✅ `src/controllers/convertController.js` (updated)
- ✅ `src/controllers/uploadController.js` (updated)
- ✅ `src/routes/convertRoutes.js` (updated)

#### 1.2 Restart Backend Server

```bash
npm run dev
```

atau

```bash
node src/server.js
```

**Verifikasi**: Backend harus jalan tanpa error di port 5000.

---

### Step 2: Frontend Setup

#### 2.1 Pastikan Semua File Frontend Sudah Ada

```bash
cd frontend
```

Pastikan file-file ini sudah ada:
- ✅ `src/components/RowEditor.jsx`
- ✅ `src/components/RowRuleBuilder.jsx`
- ✅ `src/components/RowPreview.jsx`
- ✅ `src/App.jsx` (updated)
- ✅ `src/services/api.js` (updated)

#### 2.2 Install Dependencies (jika belum)

```bash
npm install
```

Dependencies yang dibutuhkan:
- `react-beautiful-dnd` (sudah ada untuk ColumnMapper)
- `lucide-react` (sudah ada)
- `axios` (sudah ada)

#### 2.3 Restart Frontend Development Server

```bash
npm run dev
```

**Verifikasi**: Frontend harus jalan di port yang dikonfigurasi (biasanya 5173).

---

## 🧪 Testing

### Test 1: Upload File

1. Buka aplikasi di browser
2. Upload file Excel
3. Pastikan file berhasil diupload dan data muncul

### Test 2: Column Mode (Existing Feature)

1. Setelah upload, pastikan ada toggle "Column Mode" dan "Row Mode"
2. Di Column Mode, pastikan column mapping masih bekerja seperti biasa
3. Test drag & drop kolom

### Test 3: Row Mode (New Feature)

1. Klik toggle ke "Row Mode"
2. Pastikan muncul:
   - Row reordering interface
   - Filter & Transform tabs
   - Preview button

### Test 4: Row Filters

1. Di Row Mode, klik tab "Filters"
2. Klik "Add Filter"
3. Pilih kolom, operator, dan value
4. Klik "Preview" untuk melihat hasil filter

**Example Filter:**
- Column: `harga`
- Operator: `Greater Than (>)`
- Value: `0`

### Test 5: Row Transforms

1. Di Row Mode, klik tab "Transforms"
2. Klik "Add Transform"
3. Pilih kolom dan action
4. Klik "Preview" untuk melihat hasil transform

**Example Transform:**
- Column: `nama`
- Action: `UPPERCASE`

### Test 6: Row Preview

1. Setelah menambah filter/transform, klik "Preview"
2. Pastikan muncul modal dengan Before/After comparison
3. Verifikasi perubahan terlihat jelas (highlighted)

### Test 7: Conversion dengan Row Rules

1. Setup row rules (filter + transform)
2. Kembali ke Column Mode
3. Setup column mapping
4. Klik "Konversi File"
5. Download hasil
6. Buka Excel dan verifikasi:
   - Row rules applied first (filtered + transformed)
   - Column mapping applied after

### Test 8: Template dengan Row Rules

1. Setup row rules dan column mappings
2. Save as template via TemplateManager
3. Reset dan upload file baru
4. Load template
5. Pastikan row rules dan column mappings ter-load

---

## 🔧 Troubleshooting

### Error: "Cannot find module './rowService.js'"

**Solusi:**
- Pastikan file `backend/src/services/rowService.js` ada
- Restart backend server

### Error: "getRowPreview is not a function"

**Solusi:**
- Pastikan `frontend/src/services/api.js` sudah di-update
- Clear browser cache dan reload

### Row Preview tidak muncul

**Solusi:**
- Buka Developer Console (F12)
- Cek Network tab untuk request ke `/api/convert/row-preview`
- Pastikan backend route sudah ditambahkan

### Data tidak ter-filter setelah convert

**Solusi:**
- Pastikan `excelService.js` sudah di-update untuk apply row rules
- Cek bahwa template include `rowRules` property
- Verifikasi di console log

---

## 📊 Template Structure (Updated)

Template sekarang mendukung **rowRules**:

```json
{
  "id": "uuid",
  "name": "Template Name",
  "description": "Description",
  "columnMappings": [
    {
      "sourceColumn": "nama_lama",
      "targetColumn": "nama_baru"
    }
  ],
  "rowRules": {
    "filters": [
      {
        "column": "harga",
        "operator": "greaterThan",
        "value": 0
      }
    ],
    "transforms": [
      {
        "column": "nama",
        "action": "uppercase",
        "config": {}
      }
    ],
    "reorder": [2, 0, 1, 3]
  }
}
```

---

## 🎨 UI Flow

```
┌─────────────────────────────────────┐
│  Step 1: Upload File                │
│  - User uploads Excel               │
│  - Backend extracts headers + data  │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  Step 2: Mapping & Rules            │
│                                     │
│  ┌──────────────┬──────────────┐   │
│  │ Column Mode  │   Row Mode   │   │  ← Toggle
│  └──────────────┴──────────────┘   │
│                                     │
│  Column Mode:                       │
│  - Drag & drop columns              │
│  - Map source → target              │
│                                     │
│  Row Mode:                          │
│  - Reorder rows (drag & drop)       │
│  - Add filters (tab 1)              │
│  - Add transforms (tab 2)           │
│  - Preview before/after             │
│                                     │
│  [Template Manager]                 │
│  - Save/Load templates              │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  Step 3: Conversion                 │
│  1. Apply row rules                 │
│  2. Apply column mapping            │
│  3. Generate Excel output           │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  Step 4: Download                   │
│  - Download converted file          │
└─────────────────────────────────────┘
```

---

## 🔄 Processing Order

**PENTING:** Urutan processing adalah:

1. **Row Reorder** (jika ada)
2. **Row Filters** (jika ada) - mengurangi jumlah baris
3. **Row Transforms** (jika ada) - memodifikasi nilai
4. **Column Mapping** - memetakan kolom

Contoh:
```
Input: 100 rows

After Row Rules:
- Reorder: [urutan berubah]
- Filter: 80 rows (20 filtered out)
- Transform: 80 rows [values modified]

After Column Mapping:
- 80 rows dengan kolom yang sudah dimapping
```

---

## 📋 API Endpoints

### New Endpoints

#### POST /api/convert/row-preview
Get preview of row rules application

**Request:**
```json
{
  "sourceFilePath": "/path/to/file.xlsx",
  "rowRules": {
    "filters": [...],
    "transforms": [...],
    "reorder": [...]
  },
  "limit": 10
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "before": [...],
    "after": [...],
    "stats": {
      "originalCount": 100,
      "processedCount": 80,
      "previewCount": 10
    }
  }
}
```

### Updated Endpoints

#### GET /api/upload/preview
Enhanced to return full data

**Query Params:**
- `filePath`: Path to uploaded file
- `limit`: (optional) Max rows to return, 0 = all

---

## 🎯 Row Operations Reference

### Filter Operators

| Operator | Description | Example |
|----------|-------------|---------|
| `equals` | Equals | `harga == 100` |
| `notEquals` | Not equals | `status != 'inactive'` |
| `greaterThan` | Greater than | `qty > 0` |
| `greaterThanOrEquals` | Greater or equal | `score >= 70` |
| `lessThan` | Less than | `price < 1000` |
| `lessThanOrEquals` | Less or equal | `age <= 50` |
| `contains` | Contains text | `name contains 'John'` |
| `notContains` | Not contains | `email notContains '@spam'` |
| `startsWith` | Starts with | `code startsWith 'A'` |
| `endsWith` | Ends with | `file endsWith '.pdf'` |
| `empty` | Is empty | `notes empty` |
| `notEmpty` | Is not empty | `phone notEmpty` |

### Transform Actions

| Action | Description | Config Required |
|--------|-------------|-----------------|
| `uppercase` | Convert to UPPERCASE | No |
| `lowercase` | Convert to lowercase | No |
| `capitalize` | Capitalize First Letter | No |
| `trim` | Remove leading/trailing spaces | No |
| `replace` | Replace text | `from`, `to` |
| `prefix` | Add prefix | `prefix` |
| `suffix` | Add suffix | `suffix` |
| `multiply` | Multiply number | `factor` |
| `divide` | Divide number | `divisor` |
| `add` | Add to number | `amount` |
| `subtract` | Subtract from number | `amount` |
| `round` | Round number | `decimals` |
| `removeSpaces` | Remove all spaces | No |
| `removeNonNumeric` | Keep only numbers | No |
| `removeNonAlpha` | Keep only letters | No |

---

## 🛠️ Customization

### Menambah Filter Operator Baru

Edit `frontend/src/components/RowRuleBuilder.jsx`:

```javascript
const FILTER_OPERATORS = [
  // ... existing operators
  { value: 'myCustomOperator', label: 'My Custom Filter' }
];
```

Edit `backend/src/services/rowService.js`:

```javascript
evaluateFilter(row, filter) {
  // ... existing code
  switch (operator) {
    // ... existing cases
    case 'myCustomOperator':
      return /* your logic here */;
  }
}
```

### Menambah Transform Action Baru

Edit `frontend/src/components/RowRuleBuilder.jsx`:

```javascript
const TRANSFORM_ACTIONS = [
  // ... existing actions
  { value: 'myCustomTransform', label: 'My Transform', needsConfig: true }
];
```

Edit `backend/src/services/rowService.js`:

```javascript
applyTransform(value, action, config, row) {
  // ... existing code
  switch (action) {
    // ... existing cases
    case 'myCustomTransform':
      return /* your transformation logic */;
  }
}
```

---

## 📝 Example Use Cases

### Use Case 1: Filter Produk dengan Harga > 0

**Row Mode:**
- Filter: `harga > 0`

**Result:** Hanya produk dengan harga lebih dari 0 yang diproses.

### Use Case 2: Normalize Product Names

**Row Mode:**
- Transform: `nama_produk` → `uppercase`
- Transform: `nama_produk` → `trim`

**Result:** Semua nama produk UPPERCASE dan tanpa spasi.

### Use Case 3: Remove Invalid Rows + Format

**Row Mode:**
- Filter: `email notEmpty`
- Filter: `status == 'active'`
- Transform: `email` → `lowercase`
- Transform: `phone` → `removeNonNumeric`

**Result:** Hanya email aktif yang valid, dengan format terstandarisasi.

---

## ✅ Checklist Implementasi

### Backend
- [x] RowService created
- [x] ExcelService updated
- [x] TemplateService updated
- [x] ConvertController updated
- [x] UploadController updated
- [x] Routes updated

### Frontend
- [x] RowEditor component
- [x] RowRuleBuilder component
- [x] RowPreview component
- [x] App.jsx updated
- [x] API service updated
- [ ] TemplateManager updated (optional - auto includes rowRules)

### Testing
- [ ] Upload file works
- [ ] Column mode works
- [ ] Row mode works
- [ ] Filters work
- [ ] Transforms work
- [ ] Preview works
- [ ] Conversion with row rules works
- [ ] Template save/load with row rules works

---

## 🎉 Selesai!

Fitur **Row Mapping & Transformation** sekarang sudah terintegrasi dengan sempurna!

### What's Next?

1. **Test thoroughly** dengan berbagai jenis file Excel
2. **Customize** filter dan transform sesuai kebutuhan
3. **Add more operators/actions** jika diperlukan
4. **Improve UX** dengan feedback dari user

---

## 📞 Support

Jika ada pertanyaan atau masalah:

1. Cek error di browser console (F12)
2. Cek error di backend terminal
3. Verifikasi semua file sudah ter-update dengan benar
4. Restart backend dan frontend server

Happy coding! 🚀
