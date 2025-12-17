/**
 * Template Service
 * Manages column mapping templates
 */

import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import config from '../config/config.js';
import rowService from './rowService.js';

class TemplateService {
  constructor() {
    this.templatesDir = config.templatesDir;
    this.ensureTemplatesDirectory();
  }

  /**
   * Ensure templates directory exists
   */
  ensureTemplatesDirectory() {
    if (!fs.existsSync(this.templatesDir)) {
      fs.mkdirSync(this.templatesDir, { recursive: true });
    }
  }

  /**
   * Save a new template
   * @param {Object} templateData - Template data
   * @returns {Object} - Saved template with ID
   */
  saveTemplate(templateData) {
    try {
      const template = {
        id: uuidv4(),
        name: templateData.name,
        description: templateData.description || '',
        sourceFormat: templateData.sourceFormat,
        targetFormat: templateData.targetFormat,
        columnMappings: templateData.columnMappings,
        rowRules: templateData.rowRules || null, // Support row rules
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Validate template
      this.validateTemplate(template);

      // Save to file
      const filePath = path.join(this.templatesDir, `${template.id}.json`);
      fs.writeFileSync(filePath, JSON.stringify(template, null, 2));

      return template;
    } catch (error) {
      throw new Error(`Failed to save template: ${error.message}`);
    }
  }

  /**
   * Get all templates
   * @returns {Array} - List of templates
   */
  getAllTemplates() {
    try {
      const files = fs.readdirSync(this.templatesDir);
      const templates = [];

      files.forEach(file => {
        if (path.extname(file) === '.json') {
          const filePath = path.join(this.templatesDir, file);
          const data = fs.readFileSync(filePath, 'utf8');
          templates.push(JSON.parse(data));
        }
      });

      // Sort by creation date (newest first)
      templates.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      return templates;
    } catch (error) {
      throw new Error(`Failed to get templates: ${error.message}`);
    }
  }

  /**
   * Get template by ID
   * @param {string} templateId - Template ID
   * @returns {Object} - Template object
   */
  getTemplateById(templateId) {
    try {
      const filePath = path.join(this.templatesDir, `${templateId}.json`);

      if (!fs.existsSync(filePath)) {
        throw new Error('Template not found');
      }

      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      throw new Error(`Failed to get template: ${error.message}`);
    }
  }

  /**
   * Update existing template
   * @param {string} templateId - Template ID
   * @param {Object} updates - Updated data
   * @returns {Object} - Updated template
   */
  updateTemplate(templateId, updates) {
    try {
      const template = this.getTemplateById(templateId);

      // Update fields
      if (updates.name) template.name = updates.name;
      if (updates.description !== undefined) template.description = updates.description;
      if (updates.sourceFormat) template.sourceFormat = updates.sourceFormat;
      if (updates.targetFormat) template.targetFormat = updates.targetFormat;
      if (updates.columnMappings) template.columnMappings = updates.columnMappings;
      if (updates.rowRules !== undefined) template.rowRules = updates.rowRules;

      template.updatedAt = new Date().toISOString();

      // Validate
      this.validateTemplate(template);

      // Save
      const filePath = path.join(this.templatesDir, `${templateId}.json`);
      fs.writeFileSync(filePath, JSON.stringify(template, null, 2));

      return template;
    } catch (error) {
      throw new Error(`Failed to update template: ${error.message}`);
    }
  }

  /**
   * Delete template
   * @param {string} templateId - Template ID
   * @returns {boolean} - Success status
   */
  deleteTemplate(templateId) {
    try {
      const filePath = path.join(this.templatesDir, `${templateId}.json`);

      if (!fs.existsSync(filePath)) {
        throw new Error('Template not found');
      }

      fs.unlinkSync(filePath);
      return true;
    } catch (error) {
      throw new Error(`Failed to delete template: ${error.message}`);
    }
  }

  /**
   * Validate template structure
   * @param {Object} template - Template to validate
   * @throws {Error} - If template is invalid
   */
  validateTemplate(template) {
    if (!template.name || template.name.trim() === '') {
      throw new Error('Template name is required');
    }

    if (!template.columnMappings || !Array.isArray(template.columnMappings)) {
      throw new Error('Column mappings must be an array');
    }

    if (template.columnMappings.length === 0) {
      throw new Error('At least one column mapping is required');
    }

    // Validate each mapping
    template.columnMappings.forEach((mapping, index) => {
      if (!mapping.sourceColumn || !mapping.targetColumn) {
        throw new Error(`Mapping at index ${index} must have sourceColumn and targetColumn`);
      }
    });

    // Validate row rules if present
    if (template.rowRules) {
      rowService.validateRowRules(template.rowRules);
    }
  }
}

export default new TemplateService();
