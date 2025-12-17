/**
 * API Service
 * Handles all API communication with backend
 */

import axios from 'axios';

const API_BASE_URL = 'http://192.168.20.61:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const message = error.response?.data?.message || error.message || 'An error occurred';
    console.error('API Error:', message);
    return Promise.reject(new Error(message));
  }
);

// Upload endpoints
export const uploadExcelFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  return api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

export const getFilePreview = async (filePath) => {
  return api.get('/upload/preview', {
    params: { filePath }
  });
};

// Convert endpoints
export const convertExcelFile = async (sourceFilePath, templateId = null, template = null) => {
  return api.post('/convert', {
    sourceFilePath,
    templateId,
    template
  });
};

export const downloadConvertedFile = (filePath) => {
  const url = `${API_BASE_URL}/convert/download?filePath=${encodeURIComponent(filePath)}`;
  window.open(url, '_blank');
};

export const getRowPreview = async (sourceFilePath, rowRules, limit = 10) => {
  return api.post('/convert/row-preview', {
    sourceFilePath,
    rowRules,
    limit
  });
};

// Template endpoints
export const createTemplate = async (templateData) => {
  return api.post('/templates', templateData);
};

export const getAllTemplates = async () => {
  return api.get('/templates');
};

export const getTemplateById = async (templateId) => {
  return api.get(`/templates/${templateId}`);
};

export const updateTemplate = async (templateId, updates) => {
  return api.put(`/templates/${templateId}`, updates);
};

export const deleteTemplate = async (templateId) => {
  return api.delete(`/templates/${templateId}`);
};

// Health check
export const healthCheck = async () => {
  return api.get('/health');
};

export default api;
