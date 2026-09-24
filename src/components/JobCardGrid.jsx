import React from 'react';
import JobCard from './JobCard';

export default function JobCardGrid({ jobs, onCardClick }) {
  if (!jobs || jobs.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-12 shadow-sm">
          <div className="text-6xl mb-4" role="img" aria-label="empty">📭</div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No applications found</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
            No applications match your current filters, or you haven't added any yet. Start tracking your job hunt!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {jobs.map(job => (
          <JobCard 
            key={job.id || Math.random().toString(36).substr(2, 9)} 
            job={job} 
            onClick={onCardClick} 
          />
        ))}
      </div>
    </div>
  );
}
