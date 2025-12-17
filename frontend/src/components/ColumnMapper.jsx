import React, { useEffect, useState, useRef, useCallback, memo } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useExcel } from "../contexts/ExcelContext";

// Memoized draggable item component
const MappingItem = memo(({ map, index, onTargetChange }) => {
  const handleChange = useCallback((e) => {
    onTargetChange(map.id, e.target.value);
  }, [map.id, onTargetChange]);

  return (
    <Draggable draggableId={map.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`p-3 bg-white border rounded-lg shadow-sm transition-all ${
            snapshot.isDragging
              ? 'shadow-lg border-blue-500 rotate-2'
              : 'hover:shadow-md'
          }`}
        >
          <div className="flex items-center gap-3">
            {/* Drag Handle Indicator */}
            <div className="flex flex-col gap-1 cursor-grab active:cursor-grabbing">
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            </div>

            {/* Index */}
            <span className="text-sm font-medium text-gray-500 min-w-[30px]">
              #{index + 1}
            </span>

            {/* Source Column (Read-only) */}
            <div className="flex-1">
              <label className="text-xs text-gray-500">Source</label>
              <input
                type="text"
                value={map.source}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100 text-gray-700 cursor-not-allowed"
              />
            </div>

            {/* Arrow */}
            <span className="text-gray-400">→</span>

            {/* Target Column (Editable) */}
            <div className="flex-1">
              <label className="text-xs text-gray-500">Target</label>
              <input
                type="text"
                value={map.target}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Enter target column name"
              />
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
});

MappingItem.displayName = 'MappingItem';

function ColumnMapper() {
  const {
    sourceColumns,
    columnMapping,
    setColumnMapping,
    excelData,
  } = useExcel();

  const [mappings, setMappings] = useState([]);
  const initializedRef = useRef(false);

  // Initialize mappings from context
  useEffect(() => {
    if (initializedRef.current) return;
    if (!sourceColumns || sourceColumns.length === 0) return;

    initializedRef.current = true;

    // Convert columnMapping object to array for drag & drop
    const mappingArray = sourceColumns.map((col, index) => ({
      id: String(index),
      source: col,
      target: columnMapping[col] || col,
    }));

    setMappings(mappingArray);
  }, [sourceColumns, columnMapping]);

  // Update context when mappings change
  const updateContextMapping = useCallback((newMappings) => {
    const newMapping = {};
    newMappings.forEach(map => {
      newMapping[map.source] = map.target;
    });
    setColumnMapping(newMapping);
  }, [setColumnMapping]);

  const onDragEnd = useCallback((result) => {
    if (!result.destination) return;

    const items = Array.from(mappings);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);

    setMappings(items);
    updateContextMapping(items);
  }, [mappings, updateContextMapping]);

  const handleTargetChange = useCallback((id, newTarget) => {
    setMappings(prevMappings => {
      const updated = prevMappings.map(map =>
        map.id === id ? { ...map, target: newTarget } : map
      );
      updateContextMapping(updated);
      return updated;
    });
  }, [updateContextMapping]);

  // Safety checks
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
    <div className="p-4 rounded-lg border bg-white shadow-sm">
      <h2 className="font-semibold text-lg mb-3">Column Mapping</h2>
      <p className="text-sm text-gray-600 mb-4">
        Drag to reorder columns, or edit target names
      </p>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="columns">
          {(provided, snapshot) => (
            <div
              className={`space-y-2 p-3 rounded-lg transition-colors ${
                snapshot.isDraggingOver ? 'bg-blue-50' : 'bg-gray-50'
              }`}
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {mappings.map((map, i) => (
                <MappingItem
                  key={map.id}
                  map={map}
                  index={i}
                  onTargetChange={handleTargetChange}
                />
              ))}

              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <p className="text-xs text-gray-500 mt-3">
        {mappings.length} column(s) mapped
      </p>
    </div>
  );
}

export default memo(ColumnMapper);
