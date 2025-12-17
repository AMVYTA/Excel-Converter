/**
 * Routes Index
 * Central routing configuration
 */

import express from 'express';
import uploadRoutes from './uploadRoutes.js';
import convertRoutes from './convertRoutes.js';
import templateRoutes from './templateRoutes.js';

const router = express.Router();

// Mount routes
router.use('/upload', uploadRoutes);
router.use('/convert', convertRoutes);
router.use('/templates', templateRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Excel Converter API is running',
    timestamp: new Date().toISOString()
  });
});

export default router;
