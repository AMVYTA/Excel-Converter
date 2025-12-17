import React from "react";
import { useExcel } from "../contexts/ExcelContext";
import EditableRowTable from "./EditableRowTable";
import RowRuleBuilder from "./RowRuleBuilder";

const RowEditor = () => {
  const {
    editedData,
    excelData,
    sourceColumns,
    rowFilters,
    rowTransforms,
    setRowFilters,
    setRowTransforms,
  } = useExcel();

  // Safety check
  if (!excelData || excelData.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed">
        <p className="text-lg font-medium">No Excel file loaded.</p>
        <p className="text-sm mt-2">Please upload a file first.</p>
      </div>
    );
  }

  if (!sourceColumns || sourceColumns.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed">
        <p className="text-lg font-medium">No columns detected.</p>
        <p className="text-sm mt-2">The file may be empty or corrupted.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Data Table */}
      <div className="p-4 rounded-lg border bg-white shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Row Data Editor</h2>
        <p className="text-sm text-gray-600 mb-4">
          Edit cells directly in the table below
        </p>

        <div className="overflow-x-auto">
          <EditableRowTable rows={editedData} columns={sourceColumns} />
        </div>

        <p className="text-xs text-gray-500 mt-3">
          {editedData.length} row(s) loaded
        </p>
      </div>

      {/* Row Rules */}
      <div className="p-4 rounded-lg border bg-white shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Row Rules & Transformations</h2>
        <p className="text-sm text-gray-600 mb-4">
          Add filters and transformations to modify your data
        </p>

        <RowRuleBuilder
          sourceColumns={sourceColumns}
          filters={rowFilters}
          transforms={rowTransforms}
          onFilterChange={setRowFilters}
          onTransformChange={setRowTransforms}
        />
      </div>
    </div>
  );
};

export default RowEditor;
