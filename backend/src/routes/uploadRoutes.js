/**
 * Upload Routes
 */

import express from 'express';
import upload from '../middleware/upload.js';
import { uploadExcelFile, getFilePreview } from '../controllers/uploadController.js';

const router = express.Router();

// POST /api/upload - Upload Excel file
router.post('/', upload.single('file'), uploadExcelFile);

// GET /api/upload/preview - Get file preview
router.get('/preview', getFilePreview);

export default router;
