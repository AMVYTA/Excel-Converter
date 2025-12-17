# ⚡ Quick Start Guide - Row Feature

## 🚀 5-Minute Setup

### 1. Verify Files

```bash
# Backend
ls backend/src/services/rowService.js
ls backend/src/controllers/convertController.js
ls backend/src/routes/convertRoutes.js

# Frontend
ls frontend/src/components/RowEditor.jsx
ls frontend/src/components/RowRuleBuilder.jsx
ls frontend/src/components/RowPreview.jsx
```

All files should exist. ✅

### 2. Start Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 3. Test It!

1. Open http://localhost:5173
2. Upload Excel file
3. Click **"Row Mode"** toggle
4. Add a filter:
   - Column: `harga`
   - Operator: `Greater Than (>)`
   - Value: `0`
5. Click **"Preview"**
6. See filtered results! 🎉

---

## 🎯 Quick Examples

### Example 1: Remove Empty Rows

**Goal:** Remove rows where "nama" is empty

**Steps:**
1. Switch to Row Mode
2. Click "Filters" tab
3. Add Filter:
   - Column: `nama`
   - Operator: `Is Not Empty`
4. Preview → Convert

### Example 2: Uppercase All Names

**Goal:** Convert all names to UPPERCASE

**Steps:**
1. Switch to Row Mode
2. Click "Transforms" tab
3. Add Transform:
   - Column: `nama`
   - Action: `UPPERCASE`
4. Preview → Convert

### Example 3: Clean Product SKUs

**Goal:** Remove hyphens and convert to uppercase

**Steps:**
1. Switch to Row Mode
2. Click "Transforms" tab
3. Add Transform #1:
   - Column: `sku`
   - Action: `Replace Text`
   - From: `-`
   - To: `` (empty)
4. Add Transform #2:
   - Column: `sku`
   - Action: `UPPERCASE`
5. Preview → Convert

---

## 🔧 Common Commands

### View Logs
```bash
# Backend logs
cd backend && npm run dev

# Frontend logs
cd frontend && npm run dev
```

### Restart Servers
```bash
# Kill existing processes
Ctrl+C

# Restart
npm run dev
```

### Clear Cache
```bash
# Frontend
rm -rf frontend/node_modules/.vite

# Browser
F12 → Application → Clear Storage → Clear site data
```

---

## 📋 Checklist

Before using:
- [ ] Backend running on port 5000
- [ ] Frontend running on port 5173
- [ ] Can upload file
- [ ] Mode toggle visible
- [ ] Row Mode shows interface
- [ ] Preview button works

---

## 🆘 Quick Troubleshooting

**Problem: Mode toggle not visible**
→ Check App.jsx updated, restart frontend

**Problem: Preview button does nothing**
→ Check browser console (F12), verify API endpoint

**Problem: Changes not applied**
→ Verify rowService.js exists, restart backend

**Problem: Template not loading row rules**
→ Check template JSON has "rowRules" field

---

## 📚 Full Documentation

- **INTEGRATION_GUIDE.md** - Complete setup guide
- **ROW_FEATURE_README.md** - Feature documentation
- **IMPLEMENTATION_SUMMARY.md** - What was implemented

---

**Ready to go! 🎉**

Start with a simple filter, then explore transforms!
