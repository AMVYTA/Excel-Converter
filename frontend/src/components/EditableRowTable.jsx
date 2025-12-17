import React, { useCallback, memo } from "react";
import { useExcel } from "../contexts/ExcelContext";

// Memoized cell component to prevent unnecessary re-renders
const EditableCell = memo(({ rowIndex, colKey, value, onChange }) => {
  const handleChange = useCallback((e) => {
    onChange(rowIndex, colKey, e.target.value);
  }, [rowIndex, colKey, onChange]);

  return (
    <td className="border border-gray-300 px-2 py-1">
      <input
        type="text"
        className="w-full px-2 py-1 border-0 focus:ring-2 focus:ring-blue-500 rounded"
        value={value}
        onChange={handleChange}
        placeholder="Empty"
      />
    </td>
  );
});

EditableCell.displayName = 'EditableCell';

const EditableRowTable = ({ rows, columns }) => {
  const { setEditedData } = useExcel();

  const handleChange = useCallback((rowIndex, colKey, value) => {
    setEditedData(prevData => {
      // Safety check
      if (!prevData || !prevData[rowIndex]) {
        console.warn(`Row ${rowIndex} not found in editedData`);
        return prevData;
      }

      // Create new array with updated row
      const updated = [...prevData];
      updated[rowIndex] = {
        ...updated[rowIndex],
        [colKey]: value
      };
      return updated;
    });
  }, [setEditedData]);

  // Safety checks
  if (!rows || rows.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400 bg-gray-50 rounded-lg border-2 border-dashed">
        <p>No data to display</p>
      </div>
    );
  }

  if (!columns || columns.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400 bg-gray-50 rounded-lg border-2 border-dashed">
        <p>No columns to display</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            <th className="border border-gray-300 px-3 py-2 text-left bg-gray-100 font-semibold text-gray-700 sticky left-0 z-10">
              #
            </th>
            {columns.map((col) => (
              <th
                key={col}
                className="border border-gray-300 px-3 py-2 text-left bg-gray-100 font-semibold text-gray-700 min-w-[150px]"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={`row-${rowIndex}`} className="hover:bg-blue-50 transition-colors">
              <td className="border border-gray-300 px-3 py-1 bg-gray-50 font-medium text-gray-600 sticky left-0">
                {rowIndex + 1}
              </td>
              {columns.map((colKey) => {
                const cellValue = row[colKey] ?? "";

                return (
                  <EditableCell
                    key={`${rowIndex}-${colKey}`}
                    rowIndex={rowIndex}
                    colKey={colKey}
                    value={cellValue}
                    onChange={handleChange}
                  />
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default memo(EditableRowTable);
