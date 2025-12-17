/**
 * Row Rule Builder Component - OPTIMIZED VERSION
 * Build filter and transform rules for rows
 * Fixed: Flickering issues with controlled inputs
 */

import { useState, useCallback, memo } from 'react';
import { Plus, Trash2, Filter, Sparkles } from 'lucide-react';
import { generateId } from '../utils/helpers';

const FILTER_OPERATORS = [
  { value: 'equals', label: 'Equals (=)' },
  { value: 'notEquals', label: 'Not Equals (≠)' },
  { value: 'greaterThan', label: 'Greater Than (>)' },
  { value: 'greaterThanOrEquals', label: 'Greater or Equal (≥)' },
  { value: 'lessThan', label: 'Less Than (<)' },
  { value: 'lessThanOrEquals', label: 'Less or Equal (≤)' },
  { value: 'contains', label: 'Contains' },
  { value: 'notContains', label: 'Not Contains' },
  { value: 'startsWith', label: 'Starts With' },
  { value: 'endsWith', label: 'Ends With' },
  { value: 'empty', label: 'Is Empty' },
  { value: 'notEmpty', label: 'Is Not Empty' }
];

const TRANSFORM_ACTIONS = [
  { value: 'uppercase', label: 'UPPERCASE', needsConfig: false },
  { value: 'lowercase', label: 'lowercase', needsConfig: false },
  { value: 'capitalize', label: 'Capitalize', needsConfig: false },
  { value: 'trim', label: 'Trim Spaces', needsConfig: false },
  { value: 'replace', label: 'Replace Text', needsConfig: true },
  { value: 'prefix', label: 'Add Prefix', needsConfig: true },
  { value: 'suffix', label: 'Add Suffix', needsConfig: true },
  { value: 'multiply', label: 'Multiply (×)', needsConfig: true },
  { value: 'divide', label: 'Divide (÷)', needsConfig: true },
  { value: 'add', label: 'Add (+)', needsConfig: true },
  { value: 'subtract', label: 'Subtract (−)', needsConfig: true },
  { value: 'round', label: 'Round Number', needsConfig: true },
  { value: 'removeSpaces', label: 'Remove All Spaces', needsConfig: false },
  { value: 'removeNonNumeric', label: 'Remove Non-Numeric', needsConfig: false },
  { value: 'removeNonAlpha', label: 'Remove Non-Alpha', needsConfig: false }
];

// Memoized Filter Item Component
const FilterItem = memo(({ filter, index, sourceColumns, onUpdate, onRemove }) => {
  const handleColumnChange = useCallback((e) => {
    onUpdate(filter.id, 'column', e.target.value);
  }, [filter.id, onUpdate]);

  const handleOperatorChange = useCallback((e) => {
    onUpdate(filter.id, 'operator', e.target.value);
  }, [filter.id, onUpdate]);

  const handleValueChange = useCallback((e) => {
    onUpdate(filter.id, 'value', e.target.value);
  }, [filter.id, onUpdate]);

  const handleRemove = useCallback(() => {
    onRemove(filter.id);
  }, [filter.id, onRemove]);

  const needsValue = !['empty', 'notEmpty'].includes(filter.operator);

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-gray-500 min-w-[30px]">
          #{index + 1}
        </span>

        <select
          value={filter.column}
          onChange={handleColumnChange}
          className="px-3 py-2 border border-gray-300 rounded text-sm flex-1 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        >
          {sourceColumns.map(col => (
            <option key={col} value={col}>{col}</option>
          ))}
        </select>

        <select
          value={filter.operator}
          onChange={handleOperatorChange}
          className="px-3 py-2 border border-gray-300 rounded text-sm flex-1 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        >
          {FILTER_OPERATORS.map(op => (
            <option key={op.value} value={op.value}>{op.label}</option>
          ))}
        </select>

        {needsValue && (
          <input
            type="text"
            placeholder="Value"
            value={filter.value}
            onChange={handleValueChange}
            className="px-3 py-2 border border-gray-300 rounded text-sm flex-1 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        )}

        <button
          onClick={handleRemove}
          className="p-2 hover:bg-red-100 rounded-lg transition-colors"
          type="button"
        >
          <Trash2 className="w-4 h-4 text-red-600" />
        </button>
      </div>
    </div>
  );
});

FilterItem.displayName = 'FilterItem';

// Memoized Transform Item Component
const TransformItem = memo(({ transform, index, sourceColumns, onUpdate, onConfigUpdate, onRemove }) => {
  const handleColumnChange = useCallback((e) => {
    onUpdate(transform.id, 'column', e.target.value);
  }, [transform.id, onUpdate]);

  const handleActionChange = useCallback((e) => {
    onUpdate(transform.id, 'action', e.target.value);
  }, [transform.id, onUpdate]);

  const handleRemove = useCallback(() => {
    onRemove(transform.id);
  }, [transform.id, onRemove]);

  const action = TRANSFORM_ACTIONS.find(a => a.value === transform.action);
  const needsConfig = action?.needsConfig;

  const renderConfig = () => {
    if (!needsConfig) return null;

    switch (transform.action) {
      case 'replace':
        return (
          <div className="grid grid-cols-2 gap-2 mt-2">
            <input
              type="text"
              placeholder="Find text"
              value={transform.config?.from || ''}
              onChange={(e) => onConfigUpdate(transform.id, 'from', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Replace with"
              value={transform.config?.to || ''}
              onChange={(e) => onConfigUpdate(transform.id, 'to', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        );

      case 'prefix':
        return (
          <input
            type="text"
            placeholder="Prefix text"
            value={transform.config?.prefix || ''}
            onChange={(e) => onConfigUpdate(transform.id, 'prefix', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded text-sm mt-2 w-full focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        );

      case 'suffix':
        return (
          <input
            type="text"
            placeholder="Suffix text"
            value={transform.config?.suffix || ''}
            onChange={(e) => onConfigUpdate(transform.id, 'suffix', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded text-sm mt-2 w-full focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        );

      case 'multiply':
        return (
          <input
            type="number"
            step="any"
            placeholder="Multiply by"
            value={transform.config?.factor || ''}
            onChange={(e) => onConfigUpdate(transform.id, 'factor', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded text-sm mt-2 w-full focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        );

      case 'divide':
        return (
          <input
            type="number"
            step="any"
            placeholder="Divide by"
            value={transform.config?.divisor || ''}
            onChange={(e) => onConfigUpdate(transform.id, 'divisor', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded text-sm mt-2 w-full focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        );

      case 'add':
      case 'subtract':
        return (
          <input
            type="number"
            step="any"
            placeholder="Amount"
            value={transform.config?.amount || ''}
            onChange={(e) => onConfigUpdate(transform.id, 'amount', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded text-sm mt-2 w-full focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        );

      case 'round':
        return (
          <input
            type="number"
            min="0"
            max="10"
            placeholder="Decimal places"
            value={transform.config?.decimals || '0'}
            onChange={(e) => onConfigUpdate(transform.id, 'decimals', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded text-sm mt-2 w-full focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
      <div className="flex items-start gap-2">
        <span className="text-xs font-medium text-gray-500 min-w-[30px] pt-2">
          #{index + 1}
        </span>

        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <select
              value={transform.column}
              onChange={handleColumnChange}
              className="px-3 py-2 border border-gray-300 rounded text-sm flex-1 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              {sourceColumns.map(col => (
                <option key={col} value={col}>{col}</option>
              ))}
            </select>

            <select
              value={transform.action}
              onChange={handleActionChange}
              className="px-3 py-2 border border-gray-300 rounded text-sm flex-1 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              {TRANSFORM_ACTIONS.map(action => (
                <option key={action.value} value={action.value}>
                  {action.label}
                </option>
              ))}
            </select>

            <button
              onClick={handleRemove}
              className="p-2 hover:bg-red-100 rounded-lg transition-colors"
              type="button"
            >
              <Trash2 className="w-4 h-4 text-red-600" />
            </button>
          </div>

          {renderConfig()}
        </div>
      </div>
    </div>
  );
});

TransformItem.displayName = 'TransformItem';

const RowRuleBuilder = ({
  sourceColumns = [],
  filters = [],
  transforms = [],
  onFilterChange,
  onTransformChange
}) => {
  const [activeTab, setActiveTab] = useState('filters');

  // Safety check
  if (!sourceColumns || sourceColumns.length === 0) {
    return (
      <div className="text-center py-6 text-gray-400">
        <p>No columns available. Please load a file first.</p>
      </div>
    );
  }

  // Filter management
  const handleAddFilter = useCallback(() => {
    const newFilter = {
      id: generateId(),
      column: sourceColumns[0] || '',
      operator: 'equals',
      value: ''
    };
    if (onFilterChange) {
      onFilterChange([...filters, newFilter]);
    }
  }, [filters, sourceColumns, onFilterChange]);

  const handleFilterUpdate = useCallback((id, field, value) => {
    if (onFilterChange) {
      onFilterChange(
        filters.map(f => f.id === id ? { ...f, [field]: value } : f)
      );
    }
  }, [filters, onFilterChange]);

  const handleRemoveFilter = useCallback((id) => {
    if (onFilterChange) {
      onFilterChange(filters.filter(f => f.id !== id));
    }
  }, [filters, onFilterChange]);

  // Transform management
  const handleAddTransform = useCallback(() => {
    const newTransform = {
      id: generateId(),
      column: sourceColumns[0] || '',
      action: 'uppercase',
      config: {}
    };
    if (onTransformChange) {
      onTransformChange([...transforms, newTransform]);
    }
  }, [transforms, sourceColumns, onTransformChange]);

  const handleTransformUpdate = useCallback((id, field, value) => {
    if (onTransformChange) {
      onTransformChange(
        transforms.map(t => t.id === id ? { ...t, [field]: value } : t)
      );
    }
  }, [transforms, onTransformChange]);

  const handleTransformConfigUpdate = useCallback((id, configField, value) => {
    if (onTransformChange) {
      onTransformChange(
        transforms.map(t =>
          t.id === id
            ? { ...t, config: { ...t.config, [configField]: value } }
            : t
        )
      );
    }
  }, [transforms, onTransformChange]);

  const handleRemoveTransform = useCallback((id) => {
    if (onTransformChange) {
      onTransformChange(transforms.filter(t => t.id !== id));
    }
  }, [transforms, onTransformChange]);

  return (
    <div className="space-y-4">
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('filters')}
          className={`
            px-4 py-2 font-medium text-sm border-b-2 transition-colors
            ${activeTab === 'filters'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
            }
          `}
          type="button"
        >
          <Filter className="w-4 h-4 inline mr-2" />
          Filters ({filters.length})
        </button>
        <button
          onClick={() => setActiveTab('transforms')}
          className={`
            px-4 py-2 font-medium text-sm border-b-2 transition-colors
            ${activeTab === 'transforms'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
            }
          `}
          type="button"
        >
          <Sparkles className="w-4 h-4 inline mr-2" />
          Transforms ({transforms.length})
        </button>
      </div>

      {/* Filters Tab */}
      {activeTab === 'filters' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Filter rows based on conditions (all filters must pass)
            </p>
            <button
              onClick={handleAddFilter}
              className="px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-sm flex items-center gap-2 transition-colors"
              type="button"
            >
              <Plus className="w-4 h-4" />
              Add Filter
            </button>
          </div>

          {filters.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              No filters added. Click "Add Filter" to start.
            </div>
          ) : (
            <div className="space-y-2">
              {filters.map((filter, index) => (
                <FilterItem
                  key={filter.id}
                  filter={filter}
                  index={index}
                  sourceColumns={sourceColumns}
                  onUpdate={handleFilterUpdate}
                  onRemove={handleRemoveFilter}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Transforms Tab */}
      {activeTab === 'transforms' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Transform column values (applied in order)
            </p>
            <button
              onClick={handleAddTransform}
              className="px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-sm flex items-center gap-2 transition-colors"
              type="button"
            >
              <Plus className="w-4 h-4" />
              Add Transform
            </button>
          </div>

          {transforms.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              No transforms added. Click "Add Transform" to start.
            </div>
          ) : (
            <div className="space-y-2">
              {transforms.map((transform, index) => (
                <TransformItem
                  key={transform.id}
                  transform={transform}
                  index={index}
                  sourceColumns={sourceColumns}
                  onUpdate={handleTransformUpdate}
                  onConfigUpdate={handleTransformConfigUpdate}
                  onRemove={handleRemoveTransform}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default memo(RowRuleBuilder);
