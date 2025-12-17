import React, { useState } from 'react';
import { Upload, File, X } from 'lucide-react';
import { isValidExcelFile, formatFileSize } from '../utils/helpers';
import { uploadExcelFile } from '../services/api';
import { useExcel } from '../contexts/ExcelContext';

const FileUpload = () => {
  const { loadExcelData, setUploadedFilePath, setLoading } = useExcel();
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!isValidExcelFile(file)) {
      setError('Invalid file type. Please upload an Excel file (.xlsx, .xls, .csv)');
      setSelectedFile(null);
      return;
    }

    setError(null);
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file first');
      return;
    }

    setUploading(true);
    setLoading(true);
    setError(null);

    try {
      // Upload file - now returns complete metadata including rowsPreview
      const uploadRes = await uploadExcelFile(selectedFile);

      if (!uploadRes?.success) {
        throw new Error(uploadRes?.message || 'Upload failed');
      }

      const { filePath, rowsPreview } = uploadRes.data;

      // Validate response data
      if (!filePath) {
        throw new Error('Server did not return file path');
      }

      if (!rowsPreview || rowsPreview.length === 0) {
        throw new Error('File is empty or has no data');
      }

      // Save file path to context
      setUploadedFilePath(filePath);

      // Load data to context (will set step to 2 and mode to 'row')
      loadExcelData(rowsPreview);

      // Success
      console.log('File uploaded and loaded successfully');

    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message || 'Upload failed');
      setSelectedFile(null);
    } finally {
      setUploading(false);
      setLoading(false);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setError(null);
  };

  return (
    <div className="space-y-4">
      {/* File Selector */}
      <label className="flex items-center gap-3 cursor-pointer p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
        <Upload className="w-6 h-6 text-gray-500" />
        <input
          type="file"
          onChange={handleFileChange}
          className="hidden"
          accept=".xlsx,.xls,.csv"
          disabled={uploading}
        />
        <div>
          <span className="text-gray-700 font-medium">Select Excel File</span>
          <p className="text-sm text-gray-500">Click to browse (.xlsx, .xls, .csv)</p>
        </div>
      </label>

      {/* Selected File Info */}
      {selectedFile && (
        <div className="p-3 border border-gray-300 rounded-lg flex items-center justify-between bg-gray-50">
          <div className="flex items-center gap-2">
            <File className="w-5 h-5 text-blue-500" />
            <div>
              <span className="font-medium">{selectedFile.name}</span>
              <span className="text-sm text-gray-500 ml-2">
                ({formatFileSize(selectedFile.size)})
              </span>
            </div>
          </div>

          {!uploading && (
            <button
              onClick={handleRemoveFile}
              className="p-1 hover:bg-red-100 rounded transition-colors"
            >
              <X className="w-5 h-5 text-red-500" />
            </button>
          )}
        </div>
      )}

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={!selectedFile || uploading}
        className={`w-full py-3 rounded-lg font-medium transition-colors ${
          !selectedFile || uploading
            ? 'bg-gray-300 cursor-not-allowed text-gray-500'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
      >
        {uploading ? 'Uploading...' : 'Upload & Load File'}
      </button>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-300 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
