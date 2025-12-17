/**
 * Convert Routes
 */

import express from 'express';
import { convertExcelFile, downloadConvertedFile, getRowRulesPreview } from '../controllers/convertController.js';

const router = express.Router();

// POST /api/convert - Convert Excel file
router.post('/', convertExcelFile);

// GET /api/convert/download - Download converted file
router.get('/download', downloadConvertedFile);

// POST /api/convert/row-preview - Get row rules preview
router.post('/row-preview', getRowRulesPreview);

export default router;
