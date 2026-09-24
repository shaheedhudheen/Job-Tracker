import React from 'react';
import { HiSun, HiMoon, HiArrowDownTray, HiPlus, HiMagnifyingGlass, HiArrowRightOnRectangle } from 'react-icons/hi2';

export default function Header({
  searchQuery,
  onSearchChange,
  onAddClick,
  onExportClick,
  darkMode,
  onToggleDarkMode,
  user,
  onSignOut
}) {
  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between py-3 gap-3">
          {/* Title Row */}
          <div className="flex items-center justify-between w-full sm:w-auto">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span role="img" aria-label="target">🎯</span> JobTracker
            </h1>
            
            {/* Mobile Actions */}
            <div className="flex sm:hidden items-center gap-2">
              <button onClick={onToggleDarkMode} className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                {darkMode ? <HiSun className="w-5 h-5" /> : <HiMoon className="w-5 h-5" />}
              </button>
              <button onClick={onExportClick} className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                <HiArrowDownTray className="w-5 h-5" />
              </button>
              <button onClick={onAddClick} className="p-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-full transition-colors shadow-sm">
                <HiPlus className="w-5 h-5" />
              </button>
              {user && onSignOut && (
                <button onClick={onSignOut} className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors" title="Sign Out">
                  <HiArrowRightOnRectangle className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Search Bar */}
          <div className="w-full sm:max-w-md relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <HiMagnifyingGlass className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by role, company..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
            />
          </div>

          {/* Desktop Actions */}
          <div className="hidden sm:flex items-center gap-3">
            {/* User info */}
            {user && (
              <span className="text-xs text-gray-500 dark:text-gray-400 hidden lg:inline truncate max-w-[160px]" title={user.email}>
                {user.email}
              </span>
            )}

            <button
              onClick={onToggleDarkMode}
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              title="Toggle Dark Mode"
            >
              {darkMode ? <HiSun className="w-5 h-5" /> : <HiMoon className="w-5 h-5" />}
            </button>
            
            <button
              onClick={onExportClick}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
            >
              <HiArrowDownTray className="w-4 h-4" />
              <span className="hidden md:inline">Export Excel</span>
            </button>

            <button
              onClick={onAddClick}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-sm"
            >
              <HiPlus className="w-4 h-4" />
              <span>Add Job</span>
            </button>

            {user && onSignOut && (
              <button
                onClick={onSignOut}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                title="Sign Out"
              >
                <HiArrowRightOnRectangle className="w-4 h-4" />
                <span className="hidden md:inline">Sign Out</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
