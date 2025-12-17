/**
 * Configuration module
 * Manages all application configuration and environment variables
 */

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

const config = {
  // Server configuration
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',

  // CORS configuration
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',

  // File upload configuration
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB default
  uploadDir: process.env.UPLOAD_DIR || path.join(__dirname, '../../uploads'),
  templatesDir: process.env.TEMPLATES_DIR || path.join(__dirname, '../../templates'),

  // API configuration (untuk fase 2)
  app1: {
    apiUrl: process.env.APP1_API_URL || '',
    apiKey: process.env.APP1_API_KEY || ''
  },
  app2: {
    apiUrl: process.env.APP2_API_URL || '',
    apiKey: process.env.APP2_API_KEY || ''
  }
};

export default config;
