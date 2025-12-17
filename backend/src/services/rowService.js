/**
 * Row Service
 * Handles row-level operations: reordering, filtering, and transformations
 */

class RowService {
  /**
   * Apply all row rules to data
   * @param {Array} data - Source data (array of row objects)
   * @param {Object} rowRules - Row rules configuration
   * @returns {Array} - Processed data
   */
  applyRowRules(data, rowRules) {
    if (!rowRules || !data || data.length === 0) {
      return data;
    }

    let processedData = [...data];

    // Step 1: Apply filters first
    if (rowRules.filters && rowRules.filters.length > 0) {
      processedData = this.applyRowFilters(processedData, rowRules.filters);
    }

    // Step 2: Apply transformations
    if (rowRules.transforms && rowRules.transforms.length > 0) {
      processedData = this.applyRowTransforms(processedData, rowRules.transforms);
    }

    // Step 3: Apply reordering last
    if (rowRules.reorder && rowRules.reorder.length > 0) {
      processedData = this.applyRowReorder(processedData, rowRules.reorder);
    }

    return processedData;
  }

  /**
   * Reorder rows based on index array
   * @param {Array} data - Source data
   * @param {Array} reorderIndices - Array of indices [2, 0, 1, 3]
   * @returns {Array} - Reordered data
   */
  applyRowReorder(data, reorderIndices) {
    if (!reorderIndices || reorderIndices.length === 0) {
      return data;
    }

    const reordered = [];
    reorderIndices.forEach(index => {
      if (index >= 0 && index < data.length) {
        reordered.push(data[index]);
      }
    });

    // Add any remaining rows not in reorder array
    data.forEach((row, idx) => {
      if (!reorderIndices.includes(idx)) {
        reordered.push(row);
      }
    });

    return reordered;
  }

  /**
   * Filter rows based on conditions
   * @param {Array} data - Source data
   * @param {Array} filters - Filter rules
   * @returns {Array} - Filtered data
   */
  applyRowFilters(data, filters) {
    if (!filters || filters.length === 0) {
      return data;
    }

    return data.filter(row => {
      // All filters must pass (AND logic)
      return filters.every(filter => {
        return this.evaluateFilter(row, filter);
      });
    });
  }

  /**
   * Evaluate a single filter condition
   * @param {Object} row - Single row object
   * @param {Object} filter - Filter rule { column, operator, value }
   * @returns {boolean} - Whether row passes filter
   */
  evaluateFilter(row, filter) {
    const { column, operator, value } = filter;
    const cellValue = row[column];

    if (cellValue === undefined || cellValue === null) {
      return operator === 'empty' || operator === 'notExists';
    }

    switch (operator) {
      case '==':
      case 'equals':
        return String(cellValue).toLowerCase() === String(value).toLowerCase();

      case '!=':
      case 'notEquals':
        return String(cellValue).toLowerCase() !== String(value).toLowerCase();

      case '>':
      case 'greaterThan':
        return Number(cellValue) > Number(value);

      case '>=':
      case 'greaterThanOrEquals':
        return Number(cellValue) >= Number(value);

      case '<':
      case 'lessThan':
        return Number(cellValue) < Number(value);

      case '<=':
      case 'lessThanOrEquals':
        return Number(cellValue) <= Number(value);

      case 'contains':
        return String(cellValue).toLowerCase().includes(String(value).toLowerCase());

      case 'notContains':
        return !String(cellValue).toLowerCase().includes(String(value).toLowerCase());

      case 'startsWith':
        return String(cellValue).toLowerCase().startsWith(String(value).toLowerCase());

      case 'endsWith':
        return String(cellValue).toLowerCase().endsWith(String(value).toLowerCase());

      case 'empty':
        return cellValue === '' || cellValue === null || cellValue === undefined;

      case 'notEmpty':
        return cellValue !== '' && cellValue !== null && cellValue !== undefined;

      case 'exists':
        return cellValue !== undefined && cellValue !== null;

      case 'notExists':
        return cellValue === undefined || cellValue === null;

      default:
        return true;
    }
  }

  /**
   * Apply transformations to rows
   * @param {Array} data - Source data
   * @param {Array} transforms - Transform rules
   * @returns {Array} - Transformed data
   */
  applyRowTransforms(data, transforms) {
    if (!transforms || transforms.length === 0) {
      return data;
    }

    return data.map(row => {
      const transformedRow = { ...row };

      transforms.forEach(transform => {
        const { column, action, config } = transform;

        if (transformedRow[column] !== undefined && transformedRow[column] !== null) {
          transformedRow[column] = this.applyTransform(
            transformedRow[column],
            action,
            config || {},
            transformedRow
          );
        }
      });

      return transformedRow;
    });
  }

  /**
   * Apply single transformation to a value
   * @param {any} value - Original value
   * @param {string} action - Transform action
   * @param {Object} config - Transform configuration
   * @param {Object} row - Full row context (for conditional transforms)
   * @returns {any} - Transformed value
   */
  applyTransform(value, action, config = {}, row = {}) {
    const strValue = String(value);

    switch (action) {
      case 'uppercase':
        return strValue.toUpperCase();

      case 'lowercase':
        return strValue.toLowerCase();

      case 'capitalize':
        return strValue.charAt(0).toUpperCase() + strValue.slice(1).toLowerCase();

      case 'trim':
        return strValue.trim();

      case 'replace':
        return strValue.replace(new RegExp(config.from, 'g'), config.to || '');

      case 'replaceAll':
        return strValue.split(config.from).join(config.to || '');

      case 'prefix':
        return config.prefix + strValue;

      case 'suffix':
        return strValue + config.suffix;

      case 'multiply':
        return Number(value) * Number(config.factor || 1);

      case 'divide':
        return Number(value) / Number(config.divisor || 1);

      case 'add':
        return Number(value) + Number(config.amount || 0);

      case 'subtract':
        return Number(value) - Number(config.amount || 0);

      case 'round':
        return Math.round(Number(value) * Math.pow(10, config.decimals || 0)) / Math.pow(10, config.decimals || 0);

      case 'floor':
        return Math.floor(Number(value));

      case 'ceil':
        return Math.ceil(Number(value));

      case 'abs':
        return Math.abs(Number(value));

      case 'substring':
        return strValue.substring(config.start || 0, config.end);

      case 'padStart':
        return strValue.padStart(config.length || 0, config.char || ' ');

      case 'padEnd':
        return strValue.padEnd(config.length || 0, config.char || ' ');

      case 'removeSpaces':
        return strValue.replace(/\s+/g, '');

      case 'removeNonNumeric':
        return strValue.replace(/[^0-9.]/g, '');

      case 'removeNonAlpha':
        return strValue.replace(/[^a-zA-Z]/g, '');

      case 'dateFormat':
        // Simple date formatting (can be expanded with date library)
        try {
          const date = new Date(value);
          if (!isNaN(date.getTime())) {
            return this.formatDate(date, config.format || 'YYYY-MM-DD');
          }
        } catch (e) {
          // Return original if date parsing fails
        }
        return value;

      case 'conditional':
        // Conditional transform: if condition is met, apply value
        if (config.condition && this.evaluateCondition(row, config.condition)) {
          return config.thenValue !== undefined ? config.thenValue : value;
        }
        return config.elseValue !== undefined ? config.elseValue : value;

      case 'concat':
        // Concatenate with other column values
        let result = strValue;
        if (config.columns && Array.isArray(config.columns)) {
          config.columns.forEach(col => {
            result += (config.separator || '') + (row[col] || '');
          });
        }
        return result;

      case 'default':
        // Set default value if empty
        return value === '' || value === null || value === undefined
          ? config.defaultValue
          : value;

      default:
        return value;
    }
  }

  /**
   * Evaluate conditional expression
   * @param {Object} row - Row context
   * @param {Object} condition - Condition { column, operator, value }
   * @returns {boolean} - Condition result
   */
  evaluateCondition(row, condition) {
    return this.evaluateFilter(row, condition);
  }

  /**
   * Simple date formatter
   * @param {Date} date - Date object
   * @param {string} format - Format string (YYYY-MM-DD, DD/MM/YYYY, etc)
   * @returns {string} - Formatted date
   */
  formatDate(date, format) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return format
      .replace('YYYY', year)
      .replace('MM', month)
      .replace('DD', day)
      .replace('HH', hours)
      .replace('mm', minutes)
      .replace('ss', seconds);
  }

  /**
   * Get preview of row rules application
   * @param {Array} data - Source data
   * @param {Object} rowRules - Row rules
   * @param {number} limit - Max rows to preview
   * @returns {Object} - { before: [], after: [], stats: {} }
   */
  getRowPreview(data, rowRules, limit = 10) {
    const before = data.slice(0, limit);
    const after = this.applyRowRules(data, rowRules).slice(0, limit);

    return {
      before,
      after,
      stats: {
        originalCount: data.length,
        processedCount: this.applyRowRules(data, rowRules).length,
        previewCount: Math.min(limit, data.length)
      }
    };
  }

  /**
   * Validate row rules structure
   * @param {Object} rowRules - Row rules to validate
   * @throws {Error} - If validation fails
   */
  validateRowRules(rowRules) {
    if (!rowRules) {
      return; // Row rules are optional
    }

    if (typeof rowRules !== 'object') {
      throw new Error('Row rules must be an object');
    }

    // Validate filters
    if (rowRules.filters) {
      if (!Array.isArray(rowRules.filters)) {
        throw new Error('Row filters must be an array');
      }

      rowRules.filters.forEach((filter, index) => {
        if (!filter.column || !filter.operator) {
          throw new Error(`Filter at index ${index} must have column and operator`);
        }
      });
    }

    // Validate transforms
    if (rowRules.transforms) {
      if (!Array.isArray(rowRules.transforms)) {
        throw new Error('Row transforms must be an array');
      }

      rowRules.transforms.forEach((transform, index) => {
        if (!transform.column || !transform.action) {
          throw new Error(`Transform at index ${index} must have column and action`);
        }
      });
    }

    // Validate reorder
    if (rowRules.reorder) {
      if (!Array.isArray(rowRules.reorder)) {
        throw new Error('Row reorder must be an array of indices');
      }

      if (rowRules.reorder.some(idx => typeof idx !== 'number' || idx < 0)) {
        throw new Error('Row reorder indices must be non-negative numbers');
      }
    }
  }
}

export default new RowService();
