import React from "react";
import FileUpload from "./components/FileUpload";
import RowEditor from "./components/RowEditor";
import ColumnMapper from "./components/ColumnMapper";
import TemplateManager from "./components/TemplateManager";
import { convertExcelFile, downloadConvertedFile } from "./services/api";

import { useExcel } from "./contexts/ExcelContext";

function App() {
  const {
    step,
    setStep,
    mode,
    setMode,
    excelData,
    editedData,
    uploadedFilePath,
    columnMapping,
    rowFilters,
    rowTransforms,
    loading,
    setLoading,
    resetAll,
  } = useExcel();

  const handleConvert = async () => {
    if (!uploadedFilePath) {
      alert("No file uploaded");
      return;
    }

    setLoading(true);

    try {
      // Transform columnMapping object to columnMappings array
      const columnMappings = Object.entries(columnMapping).map(([source, target]) => ({
        sourceColumn: source,
        targetColumn: target,
        transform: null
      }));

      // Build rowRules object from filters and transforms
      const rowRules = {
        filters: rowFilters || [],
        transforms: rowTransforms || [],
        reorder: [] // Can be extended later for row reordering
      };

      const response = await convertExcelFile(uploadedFilePath, null, {
        rowRules,
        columnMappings
      });

      if (response.success) {
        downloadConvertedFile(response.filePath);
        alert("Conversion successful!");
      } else {
        alert("Conversion failed: " + (response.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Conversion error:", err);
      alert("Conversion failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to reset all data?")) {
      resetAll();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-xl shadow">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Excel Mapping Tool</h1>
          {step > 1 && (
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm"
            >
              Reset
            </button>
          )}
        </div>

        {/* STEP 1: Upload */}
        {step === 1 && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Step 1: Upload File</h2>
            <FileUpload />
          </div>
        )}

        {/* STEP 2: Row or Column Mode */}
        {step === 2 && (
          <>
            <div className="flex gap-3 mb-4">
              <button
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  mode === "row"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
                onClick={() => setMode("row")}
              >
                Row Mode
              </button>

              <button
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  mode === "column"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
                onClick={() => setMode("column")}
              >
                Column Mode
              </button>
            </div>

            {mode === "row" && <RowEditor />}
            {mode === "column" && <ColumnMapper />}
          </>
        )}

        {/* STEP 3: Template / Convert */}
        {step === 3 && <TemplateManager />}

        {/* Convert Button */}
        {step === 2 && excelData && excelData.length > 0 && (
          <button
            onClick={handleConvert}
            disabled={loading}
            className={`mt-6 px-5 py-3 rounded-lg font-medium transition-colors ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            {loading ? "Converting..." : "Convert & Download"}
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
