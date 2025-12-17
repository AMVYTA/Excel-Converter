# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Excel Converter is a full-stack web application for transforming Excel file structures using drag-and-drop interfaces. It supports both row-level and column-level transformations with a template system for reusable mappings.

**Tech Stack:**
- Frontend: React 18 + Vite + Tailwind CSS + react-beautiful-dnd
- Backend: Node.js + Express + xlsx library
- DevOps: Docker + Docker Compose + Nginx

## Development Commands

### Backend (Port 5000)
```bash
cd backend
npm install           # Install dependencies
npm run dev          # Start development server with nodemon
npm start            # Start production server
```

### Frontend (Port 5173)
```bash
cd frontend
npm install          # Install dependencies
npm run dev          # Start Vite dev server with HMR
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Docker
```bash
docker-compose up --build        # Build and start all services
docker-compose up -d --build     # Run in background
docker-compose down              # Stop all services
docker system prune -a           # Clean Docker cache
```

**Access URLs:**
- Frontend (dev): http://localhost:5173
- Frontend (production): http://localhost
- Backend API: http://localhost:5000

## Architecture Overview

### Data Flow & Processing Pipeline

The application processes Excel files through a **two-phase transformation system**:

1. **Row Mode** (optional): Filter, transform, and reorder data at the row level
2. **Column Mode**: Map and rename columns to target format

**Processing Order (Critical):**
```
Upload → Parse Excel → Apply Row Rules → Apply Column Mapping → Generate Excel → Download
```

Row rules are applied in this sequence:
1. **Reorder**: Change row positions based on index array
2. **Filter**: Remove rows not matching conditions (AND logic)
3. **Transform**: Modify cell values (uppercase, multiply, replace, etc.)

### Backend Architecture

```
src/
├── server.js                    # Express app entry point
├── config/config.js             # Centralized environment config
├── middleware/
│   ├── upload.js                # Multer file upload (max 10MB)
│   └── errorHandler.js          # Global error handling
├── routes/
│   ├── index.js                 # Route aggregator
│   ├── uploadRoutes.js          # POST /api/upload, GET /api/upload/preview
│   ├── convertRoutes.js         # POST /api/convert, GET /api/convert/download, POST /api/convert/row-preview
│   └── templateRoutes.js        # CRUD for templates
├── controllers/
│   ├── uploadController.js      # Handle file uploads, return preview data
│   ├── convertController.js     # Orchestrate conversion pipeline
│   └── templateController.js    # Template CRUD operations
└── services/
    ├── excelService.js          # Core Excel processing with xlsx library
    ├── rowService.js            # Row filtering/transformation engine
    └── templateService.js       # Template persistence (JSON files)
```

**Key Service Methods:**
- `excelService.parseExcel(filePath)` - Read Excel to JSON array
- `excelService.applyRowRules(data, rowRules)` - Apply row-level operations
- `excelService.applyColumnMapping(data, columnMappings)` - Map columns
- `excelService.convertExcel(filePath, template)` - Full conversion pipeline
- `rowService.applyRowFilters(data, filters)` - Filter rows (12 operators: equals, contains, greaterThan, etc.)
- `rowService.applyRowTransforms(data, transforms)` - Transform values (15+ actions: uppercase, multiply, replace, etc.)

### Frontend Architecture

```
src/
├── main.jsx                     # Entry point, wraps App with ExcelProvider
├── App.jsx                      # Main component, step navigation (Upload → Edit → Convert)
├── contexts/
│   └── ExcelContext.jsx         # Centralized state management (replaces prop drilling)
├── components/
│   ├── FileUpload.jsx           # Drag-drop upload, calls /api/upload
│   ├── RowEditor.jsx            # Row mode: drag-drop reordering, filters, transforms
│   ├── RowRuleBuilder.jsx       # UI for building filter/transform rules
│   ├── RowPreview.jsx           # Before/after preview modal
│   ├── EditableRowTable.jsx     # Table with inline editing
│   ├── ColumnMapper.jsx         # Column mode: drag-drop column mapping
│   └── TemplateManager.jsx      # Save/load templates
├── services/
│   └── api.js                   # Axios wrapper for all API calls
└── utils/
    └── helpers.js               # Utility functions
```

**ExcelContext State (Critical for All Components):**
- `step` (1=Upload, 2=Edit, 3=Template)
- `mode` ("row" or "column")
- `excelData` (original from server)
- `editedData` (local edits before conversion)
- `uploadedFilePath` (required for /api/convert)
- `columnMapping` (object: { sourceCol: targetCol })
- `rowFilters` (array of filter objects)
- `rowTransforms` (array of transform objects)

### Template Structure

Templates combine row rules and column mappings:

```json
{
  "id": "uuid",
  "name": "Runchise to Accurate",
  "description": "Convert from Runchise to Accurate format",
  "sourceFormat": "Runchise",
  "targetFormat": "Accurate",
  "rowRules": {
    "reorder": [2, 0, 1],
    "filters": [
      { "id": "f1", "column": "price", "operator": "greaterThan", "value": 0 }
    ],
    "transforms": [
      { "id": "t1", "column": "name", "action": "uppercase", "config": {} }
    ]
  },
  "columnMappings": [
    { "sourceColumn": "Nama Produk", "targetColumn": "Product Name", "transform": null }
  ],
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

See `sample-row-template.json` for a complete example.

## Common Development Tasks

### Adding a New Filter Operator

1. Update `backend/src/services/rowService.js` → `evaluateFilter()` function
2. Update `frontend/src/components/RowRuleBuilder.jsx` → `FILTER_OPERATORS` array
3. Test with /api/convert/row-preview endpoint

### Adding a New Transform Action

1. Update `backend/src/services/rowService.js` → `applyTransform()` function
2. Update `frontend/src/components/RowRuleBuilder.jsx` → `TRANSFORM_ACTIONS` array
3. Handle `config` parameters if the action requires them (e.g., multiply needs `factor`)

### Adding a New API Endpoint

1. Create route in `backend/src/routes/`
2. Create controller in `backend/src/controllers/`
3. Add service logic in `backend/src/services/` if needed
4. Register route in `backend/src/routes/index.js`
5. Update `frontend/src/services/api.js` with corresponding client function

### Debugging Tips

**Backend:**
- Check server logs: `console.log` statements print to terminal
- Test endpoints with curl: `curl -X POST http://localhost:5000/api/upload -F "file=@test.xlsx"`
- Verify file paths: Backend expects files in `uploads/` directory

**Frontend:**
- Use React DevTools to inspect ExcelContext state
- Check browser console for API errors
- Use network tab to inspect request/response payloads
- Preview feature shows before/after data transformation

**Common Issues:**
- "File not found": Ensure `uploadedFilePath` is set in context
- "No column mappings": Column mode requires non-empty `columnMapping` object
- CORS errors: Check `CORS_ORIGIN` in backend `.env` matches frontend URL
- Port conflicts: Use `lsof -i :5000` or `lsof -i :5173` to find conflicting processes

## Important Implementation Notes

### Row vs Column Mode

The application has two distinct modes that operate on different data structures:

- **Row Mode** operates on the data array (filtering, transforming, reordering rows)
- **Column Mode** operates on the column structure (renaming, mapping, reordering columns)

These modes are **independent** - users can use one, both, or neither. Backend must handle missing/empty rules gracefully.

### State Management Pattern

The app uses **ExcelContext** (React Context API) instead of prop drilling. All components access state via `useExcel()` hook:

```javascript
const { excelData, columnMapping, setColumnMapping } = useExcel();
```

When adding new state, always add it to ExcelContext and export via the context value.

### File Upload Flow

1. User drops file in FileUpload component
2. Component calls `uploadExcelFile(file)` from api.js
3. Backend saves to `uploads/` and returns file path + preview data
4. Frontend stores `uploadedFilePath` in context (required for conversion)
5. Frontend calls `loadExcelData(previewData)` to populate ExcelContext

**Critical:** Always preserve `uploadedFilePath` - it's required for the /api/convert endpoint.

### Template System

Templates are stored as JSON files in `backend/templates/` directory. The system:
- Uses UUID for template IDs
- Validates structure on save
- Supports partial templates (row rules only, column mappings only, or both)
- Loads template data into context state when selected

### Error Handling Philosophy

- Backend returns structured responses: `{ success: boolean, data?: any, message?: string }`
- Controllers use try-catch and pass errors to errorHandler middleware
- Frontend shows user-friendly alerts for errors
- Console.warn for non-critical issues (e.g., empty mappings)

## Environment Variables

**Backend (.env):**
```
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads
TEMPLATES_DIR=./templates
```

**Frontend (.env):**
```
VITE_API_URL=http://localhost:5000/api
```

## Testing the Application

### Manual Test Workflow

1. Start backend: `cd backend && npm run dev`
2. Start frontend: `cd frontend && npm run dev`
3. Upload sample Excel file (see `sample-template.json` for expected structure)
4. Test Row Mode:
   - Add filter: `price > 0`
   - Add transform: `name` → `uppercase`
   - Click Preview to verify
5. Test Column Mode:
   - Drag columns to reorder
   - Rename target columns
6. Save as template
7. Click "Convert & Download"
8. Open downloaded file in Excel to verify output

### API Testing

```bash
# Health check
curl http://localhost:5000/api/health

# Upload file
curl -X POST http://localhost:5000/api/upload -F "file=@test.xlsx"

# Get all templates
curl http://localhost:5000/api/templates

# Preview row transformation
curl -X POST http://localhost:5000/api/convert/row-preview \
  -H "Content-Type: application/json" \
  -d '{"sourceFilePath":"/uploads/file.xlsx","rowRules":{"filters":[]}}'
```

## Production Deployment

The application is Docker-ready. For production:

1. Build images: `docker-compose build`
2. Run containers: `docker-compose up -d`
3. Frontend served by Nginx on port 80
4. Backend accessible at port 5000
5. Volumes persist uploads and templates

**Important:** Update environment variables for production (remove localhost URLs).

## Documentation References

- **README.md**: User-facing documentation, installation guide
- **ROW_FEATURE_README.md**: Detailed row filtering/transformation documentation
- **INTEGRATION_GUIDE.md**: API integration instructions
- **PROJECT-SUMMARY.md**: Project overview and architecture
- **FASE2-API-INTEGRATION.md**: Roadmap for API connectors (future)
