import React, { createContext, useState, useContext } from 'react';

export const ExcelContext = createContext();

// Custom hook untuk akses context dengan mudah
export const useExcel = () => {
  const context = useContext(ExcelContext);
  if (!context) {
    throw new Error('useExcel must be used within ExcelProvider');
  }
  return context;
};

export const ExcelProvider = ({ children }) => {

  // STEP NAVIGATION
  const [step, setStep] = useState(1);

  // MODE: row atau column (default = row mode)
  const [mode, setMode] = useState('row');

  // DATA STATES
  const [excelData, setExcelData] = useState([]);
  const [editedData, setEditedData] = useState([]);
  const [uploadedFilePath, setUploadedFilePath] = useState('');

  // COLUMN MAPPING
  const [sourceColumns, setSourceColumns] = useState([]);
  const [columnMapping, setColumnMapping] = useState({});

  // ROW EDITING RULES
  const [rowFilters, setRowFilters] = useState([]);
  const [rowTransforms, setRowTransforms] = useState([]);

  // LOADING STATE
  const [loading, setLoading] = useState(false);

  // When file uploaded & preview loaded
  const loadExcelData = (rows) => {
    if (!rows || rows.length === 0) {
      console.warn('loadExcelData: No rows provided');
      return;
    }

    setExcelData(rows);
    setEditedData(JSON.parse(JSON.stringify(rows))); // Deep copy

    const columns = Object.keys(rows[0] || {});
    setSourceColumns(columns);

    // Initialize column mapping
    const initialMapping = {};
    columns.forEach(col => {
      initialMapping[col] = col;
    });
    setColumnMapping(initialMapping);

    setStep(2);         // langsung masuk editing mode
    setMode("row");     // default masuk row mode
  };

  const resetAll = () => {
    setStep(1);
    setMode("row");
    setExcelData([]);
    setEditedData([]);
    setUploadedFilePath('');
    setSourceColumns([]);
    setColumnMapping({});
    setRowFilters([]);
    setRowTransforms([]);
    setLoading(false);
  };

  const value = {
    // Navigation
    step,
    setStep,
    mode,
    setMode,

    // Data
    excelData,
    setExcelData,
    editedData,
    setEditedData,
    uploadedFilePath,
    setUploadedFilePath,

    // Functions
    loadExcelData,
    resetAll,

    // Columns
    sourceColumns,
    setSourceColumns,
    columnMapping,
    setColumnMapping,

    // Row Rules
    rowFilters,
    setRowFilters,
    rowTransforms,
    setRowTransforms,

    // Loading
    loading,
    setLoading,
  };

  return (
    <ExcelContext.Provider value={value}>
      {children}
    </ExcelContext.Provider>
  );
};
