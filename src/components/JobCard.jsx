import React from 'react';
import { HiMapPin, HiCalendar, HiExclamationCircle } from 'react-icons/hi2';
import { STATUS_OPTIONS } from '../lib/constants.js';

export default function JobCard({ job, onClick }) {
  const statusConfig = STATUS_OPTIONS.find(s => s.value === job.status) || STATUS_OPTIONS[0];
  
  const isPastFollowUp = () => {
    if (!job.follow_up_date) return false;
    const followUp = new Date(job.follow_up_date);
    const today = new Date();
    today.setHours(0,0,0,0);
    return followUp < today && (job.status === 'applied' || job.status === 'got_response');
  };

  const needsFollowUp = isPastFollowUp();

  return (
    <div 
      onClick={() => onClick(job)}
      className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-200 dark:border-gray-700 relative group flex flex-col h-full"
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1 pr-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {job.job_role}
          </h3>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mt-1 line-clamp-1">
            {job.company}
          </p>
        </div>
        
        {/* Status Badge */}
        <div className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
          {statusConfig.label}
        </div>
      </div>

      <div className="mt-auto pt-4 space-y-2">
        {job.location && (
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
            <HiMapPin className="w-4 h-4 mr-1.5 opacity-70" />
            <span className="truncate">{job.location}</span>
          </div>
        )}
        
        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
          <HiCalendar className="w-4 h-4 mr-1.5 opacity-70" />
          <span>Applied: {new Date(job.applied_date).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
        <span className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">
          {job.platform}
        </span>
        
        {needsFollowUp && (
          <div className="flex items-center text-xs font-medium text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded-md">
            <HiExclamationCircle className="w-4 h-4 mr-1" />
            Follow up!
          </div>
        )}
      </div>
    </div>
  );
}
