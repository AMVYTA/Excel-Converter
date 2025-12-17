/**
 * Upload Controller - ENHANCED VERSION
 * Handles file upload operations with complete metadata return
 */

import excelService from '../services/excelService.js';

/**
 * Handle Excel file upload and extract headers + preview data
 * Returns: fileId, filePath, headers, rowsPreview, rowCount, sheetName, fileName
 */
export const uploadExcelFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const filePath = req.file.path;

    // Validate Excel file
    try {
      excelService.validateExcelFile(filePath);
    } catch (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError.message
      });
    }

    // Extract headers and metadata
    const fileInfo = excelService.readExcelHeaders(filePath);

    // Read preview data (first 50 rows)
    const allData = excelService.readExcelData(filePath);
    const rowsPreview = allData.slice(0, 50);

    // Return complete metadata
    res.json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        fileId: req.file.filename,
        filePath: filePath,
        headers: fileInfo.headers,
        fileName: fileInfo.fileName,
        rowCount: fileInfo.rowCount,
        sheetName: fileInfo.sheetName,
        rowsPreview: rowsPreview,
        totalRows: allData.length
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to process file'
    });
  }
};

/**
 * Get preview data from uploaded file
 * This endpoint is now optional since upload returns preview
 */
export const getFilePreview = async (req, res) => {
  try {
    const { filePath, limit } = req.query;

    if (!filePath) {
      return res.status(400).json({
        success: false,
        message: 'File path is required'
      });
    }

    // Read data
    const allData = excelService.readExcelData(filePath);
    const maxRows = limit ? parseInt(limit) : 50;
    const previewData = allData.slice(0, maxRows);

    res.json({
      success: true,
      data: {
        rows: previewData,
        totalRows: allData.length
      }
    });
  } catch (error) {
    console.error('Preview error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to load preview'
    });
  }
};
