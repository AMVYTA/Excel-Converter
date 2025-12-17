/**
 * Row Preview Component
 * Shows before and after comparison of row transformations
 */

import { AlertCircle, CheckCircle, TrendingDown } from 'lucide-react';

const RowPreview = ({ previewData }) => {
  if (!previewData) {
    return <div className="text-center py-8 text-gray-400">No preview data available</div>;
  }

  const { before, after, stats } = previewData;

  const getValueClass = (beforeVal, afterVal) => {
    if (beforeVal !== afterVal) {
      return 'bg-yellow-100 text-yellow-900 font-medium';
    }
    return '';
  };

  const renderTable = (data, title, titleColor) => {
    if (!data || data.length === 0) {
      return (
        <div className="text-center py-8 text-gray-400">
          No data to display
        </div>
      );
    }

    const columns = Object.keys(data[0]);

    return (
      <div className="space-y-2">
        <h4 className={`font-semibold text-sm ${titleColor}`}>{title}</h4>
        <div className="overflow-x-auto border rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  #
                </th>
                {columns.map(col => (
                  <th
                    key={col}
                    className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((row, rowIdx) => (
                <tr key={rowIdx} className="hover:bg-gray-50">
                  <td className="px-3 py-2 text-xs text-gray-500 font-mono">
                    {rowIdx + 1}
                  </td>
                  {columns.map(col => {
                    const beforeVal = before[rowIdx]?.[col];
                    const afterVal = after[rowIdx]?.[col];
                    const isChanged = title === 'After' && beforeVal !== afterVal;

                    return (
                      <td
                        key={col}
                        className={`px-3 py-2 text-sm text-gray-900 ${
                          isChanged ? getValueClass(beforeVal, afterVal) : ''
                        }`}
                      >
                        <div className="max-w-xs truncate" title={String(row[col])}>
                          {String(row[col])}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const rowCountChanged = stats.originalCount !== stats.processedCount;

  return (
    <div className="space-y-6">
      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-blue-600" />
            <p className="text-sm text-blue-600 font-medium">Original Rows</p>
          </div>
          <p className="text-2xl font-bold text-blue-900">{stats.originalCount}</p>
        </div>

        <div className={`border rounded-lg p-4 ${
          rowCountChanged ? 'bg-orange-50 border-orange-200' : 'bg-green-50 border-green-200'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            {rowCountChanged ? (
              <TrendingDown className="w-5 h-5 text-orange-600" />
            ) : (
              <CheckCircle className="w-5 h-5 text-green-600" />
            )}
            <p className={`text-sm font-medium ${
              rowCountChanged ? 'text-orange-600' : 'text-green-600'
            }`}>
              After Rules
            </p>
          </div>
          <p className={`text-2xl font-bold ${
            rowCountChanged ? 'text-orange-900' : 'text-green-900'
          }`}>
            {stats.processedCount}
          </p>
          {rowCountChanged && (
            <p className="text-xs text-orange-700 mt-1">
              {stats.originalCount - stats.processedCount} rows filtered out
            </p>
          )}
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-purple-600" />
            <p className="text-sm text-purple-600 font-medium">Preview Showing</p>
          </div>
          <p className="text-2xl font-bold text-purple-900">{stats.previewCount}</p>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
        <p className="text-sm text-amber-800">
          <span className="font-semibold">Legend:</span>{' '}
          <span className="bg-yellow-100 px-2 py-1 rounded">Changed values</span> are highlighted
        </p>
      </div>

      {/* Before/After Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          {renderTable(before, 'Before', 'text-blue-700')}
        </div>
        <div>
          {renderTable(after, 'After', 'text-green-700')}
        </div>
      </div>

      {/* Summary Message */}
      {rowCountChanged && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <p className="text-sm text-orange-800">
            <strong>Note:</strong> Filters removed {stats.originalCount - stats.processedCount} row(s).
            The final output will contain {stats.processedCount} rows.
          </p>
        </div>
      )}
    </div>
  );
};

export default RowPreview;
