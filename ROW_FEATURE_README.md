# 🎯 Row Mapping & Transformation Feature

## Overview

Fitur baru yang powerful untuk Excel Converter - sekarang user dapat **memanipulasi data di level baris (row)** sebelum melakukan column mapping!

---

## ✨ Features

### 1️⃣ Row Reordering
- Drag & drop untuk mengubah urutan baris
- Visual interface yang mudah digunakan
- Preview row data

### 2️⃣ Row Filtering
- Filter baris berdasarkan kondisi
- Multiple filters (AND logic)
- 12+ filter operators:
  - Equals, Not Equals
  - Greater/Less Than
  - Contains, Starts With, Ends With
  - Empty, Not Empty
  - Dan lainnya...

### 3️⃣ Row Transformations
- Transform nilai cell secara massal
- 15+ transformation actions:
  - **Text**: uppercase, lowercase, capitalize, trim, replace
  - **Numeric**: multiply, divide, add, subtract, round
  - **Cleaning**: remove spaces, remove non-numeric, remove non-alpha
  - Dan lainnya...

### 4️⃣ Live Preview
- Before/After comparison
- See changes before conversion
- Highlight changed values
- Show filter statistics

### 5️⃣ Template Support
- Save row rules to templates
- Load existing templates with row rules
- Combine row rules + column mapping in one template

---

## 🎨 UI Screenshots

### Mode Toggle
```
┌──────────────────────────────────────┐
│ [ Column Mode ] [ Row Mode ]         │
└──────────────────────────────────────┘
```

### Row Mode Interface
```
┌──────────────────────────────────────┐
│ Row Mapping & Transformation         │
│                                      │
│ Stats:                               │
│ ┌─────────┬─────────┬─────────┐     │
│ │  100    │    3    │    5    │     │
│ │  Rows   │ Filters │Transforms│    │
│ └─────────┴─────────┴─────────┘     │
│                                      │
│ Row Reordering (Drag to reorder):   │
│ ┌──────────────────────────────┐    │
│ │ ≡ Row #1: nama: ABC, harga:..│    │
│ │ ≡ Row #2: nama: DEF, harga:..│    │
│ │ ≡ Row #3: nama: GHI, harga:..│    │
│ └──────────────────────────────┘    │
│                                      │
│ [ Filters ] [ Transforms ]           │
│                                      │
│ Filters (3):                         │
│ ┌──────────────────────────────┐    │
│ │ #1 [harga] [>] [0]        ✕ │    │
│ │ #2 [stock] [>=] [0]       ✕ │    │
│ │ #3 [nama] [notEmpty] []   ✕ │    │
│ └──────────────────────────────┘    │
│                                      │
│              [Preview]               │
└──────────────────────────────────────┘
```

### Preview Modal
```
┌────────────────────────────────────────┐
│ Row Transformation Preview        ✕   │
├────────────────────────────────────────┤
│ Stats:                                 │
│ Original: 100 | After: 85 | Preview: 10│
│                                        │
│ ┌─────────────┬─────────────┐         │
│ │   BEFORE    │    AFTER    │         │
│ ├─────────────┼─────────────┤         │
│ │ Row 1       │ Row 1       │         │
│ │ nama: abc   │ nama: ABC   │ ← Changed
│ │ harga: 100  │ harga: 100  │         │
│ │             │             │         │
│ │ Row 2       │ Row 2       │         │
│ │ nama: def   │ nama: DEF   │ ← Changed
│ │ harga: 0    │ [filtered]  │ ← Removed
│ └─────────────┴─────────────┘         │
└────────────────────────────────────────┘
```

---

## 🔧 Technical Architecture

### Backend Components

```
rowService.js
├── applyRowRules()        - Main orchestrator
├── applyRowReorder()      - Reorder rows
├── applyRowFilters()      - Filter rows
├── applyRowTransforms()   - Transform values
├── evaluateFilter()       - Check filter conditions
├── applyTransform()       - Apply single transform
└── getRowPreview()        - Generate preview

excelService.js (updated)
├── convertExcel()         - Now applies row rules first
└── getRowRulesPreview()   - Get preview of row rules

templateService.js (updated)
├── saveTemplate()         - Support rowRules field
└── validateTemplate()     - Validate rowRules structure
```

### Frontend Components

```
RowEditor.jsx
├── Row reordering (drag & drop)
├── Stats display
├── Rule builder integration
└── Preview modal

RowRuleBuilder.jsx
├── Filter management
├── Transform management
├── Tab interface
└── Dynamic config inputs

RowPreview.jsx
├── Before/After tables
├── Highlight changes
└── Statistics summary
```

### Data Flow

```
1. Upload File
   ↓
2. User selects Row Mode
   ↓
3. User builds row rules:
   - Add filters
   - Add transforms
   - Reorder rows
   ↓
4. User clicks Preview
   ↓
5. Frontend → POST /api/convert/row-preview
   ↓
6. Backend applies rules (without saving)
   ↓
7. Return before/after data
   ↓
8. Display in modal
   ↓
9. User clicks Convert
   ↓
10. Backend applies:
    a. Row rules
    b. Column mapping
    ↓
11. Generate Excel
    ↓
12. Download
```

---

## 📋 Row Rules Structure

```javascript
{
  "rowRules": {
    // Reorder rows (optional)
    "reorder": [2, 0, 1, 3],  // New order of row indices

    // Filter rows (optional)
    "filters": [
      {
        "id": "filter-1",
        "column": "harga",
        "operator": "greaterThan",  // or: equals, contains, etc.
        "value": 0
      }
    ],

    // Transform rows (optional)
    "transforms": [
      {
        "id": "transform-1",
        "column": "nama",
        "action": "uppercase",  // or: lowercase, trim, replace, etc.
        "config": {}            // Action-specific config
      },
      {
        "id": "transform-2",
        "column": "sku",
        "action": "replace",
        "config": {
          "from": "-",
          "to": ""
        }
      }
    ]
  }
}
```

---

## 🎯 Processing Order

**CRITICAL:** Row rules are applied in this exact order:

```
1. Reorder       → Change row positions
   ↓
2. Filter        → Remove rows that don't match
   ↓
3. Transform     → Modify cell values
   ↓
4. Column Map    → Remap columns
```

Example:
```
Input:
  100 rows × 5 columns

After Reorder:
  100 rows (different order)

After Filter (price > 0):
  85 rows (15 removed)

After Transform (UPPERCASE names):
  85 rows (values modified)

After Column Mapping:
  85 rows × 3 columns (mapped)
```

---

## 🚀 Usage Examples

### Example 1: Clean Product Data

**Goal:** Remove invalid products and standardize names

```javascript
{
  "filters": [
    { "column": "price", "operator": ">", "value": 0 },
    { "column": "name", "operator": "notEmpty", "value": "" }
  ],
  "transforms": [
    { "column": "name", "action": "trim" },
    { "column": "name", "action": "uppercase" }
  ]
}
```

**Result:**
- ✅ Only products with price > 0
- ✅ Only products with non-empty names
- ✅ All names trimmed and UPPERCASE

### Example 2: Normalize Phone Numbers

**Goal:** Clean and standardize phone numbers

```javascript
{
  "filters": [
    { "column": "phone", "operator": "notEmpty", "value": "" }
  ],
  "transforms": [
    { "column": "phone", "action": "removeNonNumeric" },
    { "column": "phone", "action": "prefix", "config": { "prefix": "+62" } }
  ]
}
```

**Result:**
- ✅ Only rows with phone numbers
- ✅ Phone numbers contain only digits
- ✅ All phone numbers prefixed with +62

### Example 3: Calculate Discounted Prices

**Goal:** Apply 10% discount to all prices

```javascript
{
  "transforms": [
    {
      "column": "price",
      "action": "multiply",
      "config": { "factor": 0.9 }
    },
    {
      "column": "price",
      "action": "round",
      "config": { "decimals": 0 }
    }
  ]
}
```

**Result:**
- ✅ All prices multiplied by 0.9 (10% off)
- ✅ Rounded to whole numbers

---

## 🛠️ API Reference

### POST /api/convert/row-preview

Get preview of row rules application.

**Request:**
```json
{
  "sourceFilePath": "/uploads/file.xlsx",
  "rowRules": {
    "filters": [...],
    "transforms": [...]
  },
  "limit": 10
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "before": [
      { "nama": "abc", "harga": 100 },
      { "nama": "def", "harga": 0 }
    ],
    "after": [
      { "nama": "ABC", "harga": 100 }
    ],
    "stats": {
      "originalCount": 100,
      "processedCount": 85,
      "previewCount": 10
    }
  }
}
```

### POST /api/convert

Convert with row rules + column mapping.

**Request:**
```json
{
  "sourceFilePath": "/uploads/file.xlsx",
  "template": {
    "name": "My Template",
    "rowRules": { ... },
    "columnMappings": [ ... ]
  }
}
```

---

## 📊 Filter Operators Reference

| Operator | Symbol | Description | Example |
|----------|--------|-------------|---------|
| `equals` | `==` | Exact match | `status == 'active'` |
| `notEquals` | `!=` | Not equal | `type != 'draft'` |
| `greaterThan` | `>` | Greater than | `price > 100` |
| `greaterThanOrEquals` | `>=` | Greater or equal | `qty >= 1` |
| `lessThan` | `<` | Less than | `discount < 50` |
| `lessThanOrEquals` | `<=` | Less or equal | `age <= 65` |
| `contains` | | Contains text | `name contains 'John'` |
| `notContains` | | Not contains | `email notContains 'spam'` |
| `startsWith` | | Starts with | `code startsWith 'A'` |
| `endsWith` | | Ends with | `file endsWith '.pdf'` |
| `empty` | | Is empty | `notes empty` |
| `notEmpty` | | Not empty | `email notEmpty` |

---

## 🎨 Transform Actions Reference

### Text Transforms

| Action | Description | Config | Example |
|--------|-------------|--------|---------|
| `uppercase` | UPPERCASE | - | `abc` → `ABC` |
| `lowercase` | lowercase | - | `ABC` → `abc` |
| `capitalize` | Capitalize | - | `john` → `John` |
| `trim` | Remove spaces | - | ` abc ` → `abc` |
| `replace` | Replace text | `from`, `to` | `a-b-c` → `abc` |
| `prefix` | Add prefix | `prefix` | `123` → `ID-123` |
| `suffix` | Add suffix | `suffix` | `data` → `data.csv` |

### Numeric Transforms

| Action | Description | Config | Example |
|--------|-------------|--------|---------|
| `multiply` | Multiply by | `factor` | `100 × 1.1` → `110` |
| `divide` | Divide by | `divisor` | `100 ÷ 2` → `50` |
| `add` | Add to | `amount` | `100 + 10` → `110` |
| `subtract` | Subtract | `amount` | `100 - 10` → `90` |
| `round` | Round | `decimals` | `3.14159` → `3.14` |
| `floor` | Floor | - | `3.9` → `3` |
| `ceil` | Ceiling | - | `3.1` → `4` |
| `abs` | Absolute | - | `-5` → `5` |

### Cleaning Transforms

| Action | Description | Example |
|--------|-------------|---------|
| `removeSpaces` | Remove all spaces | `a b c` → `abc` |
| `removeNonNumeric` | Keep only numbers | `ID-123` → `123` |
| `removeNonAlpha` | Keep only letters | `abc123` → `abc` |

---

## 🎓 Best Practices

### 1. Filter First, Transform Later
```javascript
// ✅ GOOD: Filter out invalid data first
{
  "filters": [{ "column": "price", "operator": ">", "value": 0 }],
  "transforms": [{ "column": "price", "action": "round" }]
}

// ❌ BAD: Transform invalid data
{
  "transforms": [{ "column": "price", "action": "round" }],
  "filters": [{ "column": "price", "operator": ">", "value": 0 }]
}
```

### 2. Use Specific Filters
```javascript
// ✅ GOOD: Specific conditions
{ "column": "status", "operator": "equals", "value": "active" }

// ❌ BAD: Too broad
{ "column": "status", "operator": "notEmpty" }
```

### 3. Chain Transforms Logically
```javascript
// ✅ GOOD: Logical order
[
  { "action": "trim" },      // Remove spaces first
  { "action": "uppercase" }, // Then convert case
  { "action": "replace" }    // Then replace
]

// ❌ BAD: Illogical order
[
  { "action": "replace" },   // Replace might fail with spaces
  { "action": "trim" }
]
```

### 4. Test with Preview
- Always click **Preview** before converting
- Verify filter count matches expectations
- Check transform results are correct
- Look for edge cases in preview data

---

## 🐛 Common Issues & Solutions

### Issue: No data after filter
**Cause:** All rows filtered out
**Solution:** Check filter conditions are not too strict

### Issue: Transform not working
**Cause:** Missing config parameters
**Solution:** Ensure config is complete for actions that need it

### Issue: Preview shows same before/after
**Cause:** No rules applied or empty rules
**Solution:** Add at least one filter or transform

### Issue: Column not found error
**Cause:** Column name mismatch
**Solution:** Verify column names match exactly (case-sensitive)

---

## 📈 Performance Notes

- **Small files (<1000 rows):** Instant preview & conversion
- **Medium files (1000-10000 rows):** Preview shows first 10 rows
- **Large files (>10000 rows):** May take a few seconds

**Optimization tips:**
- Use filters to reduce data early
- Limit preview to 10 rows
- Avoid complex regex in replace transforms

---

## 🎉 What's New

### Version 2.0 Features

✨ **Row Mode**
- Drag & drop row reordering
- Visual row management

✨ **Advanced Filtering**
- 12 filter operators
- Multiple filters (AND logic)
- Real-time preview

✨ **Powerful Transforms**
- 15+ transformation actions
- Text, numeric, and cleaning operations
- Configurable parameters

✨ **Live Preview**
- Before/After comparison
- Highlight changes
- Statistics display

✨ **Template Integration**
- Save row rules with templates
- Load row rules from templates
- Combined row + column templates

---

## 🔮 Future Enhancements

Potential features for future versions:

- [ ] OR logic for filters
- [ ] Conditional transforms (if-then-else)
- [ ] Custom JavaScript expressions
- [ ] Import/Export row rules separately
- [ ] Row grouping and aggregation
- [ ] Duplicate row detection
- [ ] More transform actions (date formatting, etc.)
- [ ] Undo/Redo for row operations
- [ ] Batch operations across multiple files

---

## 📞 Need Help?

1. Check **INTEGRATION_GUIDE.md** for setup instructions
2. See **sample-row-template.json** for template example
3. Test with preview before converting
4. Check browser console for errors
5. Verify backend logs

---

## 🙏 Credits

Built with:
- React + Vite
- react-beautiful-dnd (drag & drop)
- lucide-react (icons)
- Node.js + Express
- xlsx library

---

**Happy data transforming! 🚀**
