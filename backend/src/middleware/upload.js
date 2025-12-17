/**
 * Upload Middleware - ENHANCED VERSION
 * Configures multer for file uploads with robust file type validation
 * Supports: .xlsx, .xls, .csv
 */

import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import config from '../config/config.js';
import fs from 'fs';

// Ensure upload directory exists
if (!fs.existsSync(config.uploadDir)) {
  fs.mkdirSync(config.uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, config.uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

// File filter - Enhanced to handle various MIME types
const fileFilter = (req, file, cb) => {
  const allowedExtensions = ['.xlsx', '.xls', '.csv'];
  const ext = path.extname(file.originalname).toLowerCase();

  // Check extension
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
    return;
  }

  // Also check MIME type as fallback
  const allowedMimeTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    'application/vnd.ms-excel', // .xls
    'text/csv', // .csv
    'application/csv',
    'text/comma-separated-values',
    'application/octet-stream' // Sometimes Excel files are sent with this MIME type
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
    return;
  }

  // Reject file
  cb(new Error('Invalid file type. Only Excel files (.xlsx, .xls) and CSV files (.csv) are allowed'), false);
};

// Create multer instance
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: config.maxFileSize
  }
});

export default upload;
