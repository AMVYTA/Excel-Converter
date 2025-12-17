/**
 * Template Controller
 * Handles template management operations
 */

import templateService from '../services/templateService.js';

/**
 * Create new template
 */
export const createTemplate = async (req, res) => {
  try {
    const templateData = req.body;

    const savedTemplate = templateService.saveTemplate(templateData);

    res.status(201).json({
      success: true,
      message: 'Template created successfully',
      data: savedTemplate
    });
  } catch (error) {
    console.error('Create template error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get all templates
 */
export const getAllTemplates = async (req, res) => {
  try {
    const templates = templateService.getAllTemplates();

    res.json({
      success: true,
      data: templates
    });
  } catch (error) {
    console.error('Get templates error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get template by ID
 */
export const getTemplateById = async (req, res) => {
  try {
    const { id } = req.params;

    const template = templateService.getTemplateById(id);

    res.json({
      success: true,
      data: template
    });
  } catch (error) {
    console.error('Get template error:', error);
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Update template
 */
export const updateTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedTemplate = templateService.updateTemplate(id, updates);

    res.json({
      success: true,
      message: 'Template updated successfully',
      data: updatedTemplate
    });
  } catch (error) {
    console.error('Update template error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Delete template
 */
export const deleteTemplate = async (req, res) => {
  try {
    const { id } = req.params;

    templateService.deleteTemplate(id);

    res.json({
      success: true,
      message: 'Template deleted successfully'
    });
  } catch (error) {
    console.error('Delete template error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
