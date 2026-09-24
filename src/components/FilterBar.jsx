import React from 'react';
import { STATUS_OPTIONS, PLATFORM_OPTIONS } from '../lib/constants.js';

export default function FilterBar({
  statusFilter,
  onStatusFilterChange,
  platformFilter,
  onPlatformFilterChange,
  sortBy,
  onSortChange,
}) {
  const handleClear = () => {
    onStatusFilterChange('All');
    onPlatformFilterChange('All');
    onSortChange('Newest First');
  };

  const hasActiveFilters = statusFilter !== 'All' || platformFilter !== 'All' || sortBy !== 'Newest First';

  const selectClassName = "block w-full py-2 pl-3 pr-10 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors appearance-none";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex flex-col sm:flex-row gap-4 items-end sm:items-center bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
        
        <div className="flex-1 w-full flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-48 relative">
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Status</label>
            <select 
              value={statusFilter} 
              onChange={(e) => onStatusFilterChange(e.target.value)}
              className={selectClassName}
            >
              <option value="All">All Statuses</option>
              {STATUS_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div className="w-full sm:w-48 relative">
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Platform</label>
            <select 
              value={platformFilter} 
              onChange={(e) => onPlatformFilterChange(e.target.value)}
              className={selectClassName}
            >
              <option value="All">All Platforms</option>
              {PLATFORM_OPTIONS.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div className="w-full sm:w-48 relative">
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Sort By</label>
            <select 
              value={sortBy} 
              onChange={(e) => onSortChange(e.target.value)}
              className={selectClassName}
            >
              <option value="Newest First">Newest First</option>
              <option value="Oldest First">Oldest First</option>
              <option value="Company A-Z">Company A-Z</option>
              <option value="Company Z-A">Company Z-A</option>
            </select>
          </div>
        </div>

        {hasActiveFilters && (
          <button 
            onClick={handleClear}
            className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
}
