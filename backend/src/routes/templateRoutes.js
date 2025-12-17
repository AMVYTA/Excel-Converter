/**
 * Template Routes
 */

import express from 'express';
import {
  createTemplate,
  getAllTemplates,
  getTemplateById,
  updateTemplate,
  deleteTemplate
} from '../controllers/templateController.js';

const router = express.Router();

// POST /api/templates - Create new template
router.post('/', createTemplate);

// GET /api/templates - Get all templates
router.get('/', getAllTemplates);

// GET /api/templates/:id - Get template by ID
router.get('/:id', getTemplateById);

// PUT /api/templates/:id - Update template
router.put('/:id', updateTemplate);

// DELETE /api/templates/:id - Delete template
router.delete('/:id', deleteTemplate);

export default router;
