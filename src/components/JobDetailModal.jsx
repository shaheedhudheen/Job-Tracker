import React from 'react';
import { HiXMark, HiLink, HiPencilSquare, HiTrash } from 'react-icons/hi2';
import { STATUS_OPTIONS } from '../lib/constants.js';
import { formatDate, formatDateTime } from '../lib/dateUtils.js';

export default function JobDetailModal({ job, isOpen, onClose, onEdit, onDelete }) {
  if (!isOpen || !job) return null;

  const statusConfig = STATUS_OPTIONS.find(s => s.value === job.status) || STATUS_OPTIONS[0];

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this job application?')) {
      onDelete(job.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-end sm:justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal / Drawer Panel */}
      <div className="relative w-full sm:w-[500px] h-[90vh] sm:h-auto sm:max-h-[85vh] bg-white dark:bg-gray-800 sm:rounded-2xl rounded-t-2xl shadow-2xl flex flex-col transform transition-transform duration-300 translate-y-0 sm:translate-x-0">
        
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-100 dark:border-gray-700">
          <div className="pr-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
              {job.job_role}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium">{job.company}</p>
          </div>
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <HiXMark className="w-5 h-5" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          
          <div className="flex flex-wrap gap-3">
            <div className={`px-3 py-1.5 rounded-full text-sm font-medium ${statusConfig.color}`}>
              {statusConfig.label}
            </div>
            {job.platform && (
              <div className="px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600">
                {job.platform}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="block text-gray-500 dark:text-gray-400 mb-1">Applied Date</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {formatDate(job.applied_date)}
              </span>
            </div>
            <div>
              <span className="block text-gray-500 dark:text-gray-400 mb-1">Location</span>
              <span className="font-medium text-gray-900 dark:text-white">{job.location || 'N/A'}</span>
            </div>
            <div>
              <span className="block text-gray-500 dark:text-gray-400 mb-1">Salary Range</span>
              <span className="font-medium text-gray-900 dark:text-white">{job.salary_range || 'Not specified'}</span>
            </div>
            <div>
              <span className="block text-gray-500 dark:text-gray-400 mb-1">Resume Version</span>
              <span className="font-medium text-gray-900 dark:text-white">{job.resume_version || 'Default'}</span>
            </div>
            {job.follow_up_date && (
              <div>
                <span className="block text-gray-500 dark:text-gray-400 mb-1">Follow up by</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {formatDate(job.follow_up_date)}
                </span>
              </div>
            )}
            {job.interview_date && (
              <div>
                <span className="block text-gray-500 dark:text-gray-400 mb-1">Interview Date</span>
                <span className="font-medium text-indigo-600 dark:text-indigo-400">
                  {formatDateTime(job.interview_date)}
                </span>
              </div>
            )}
          </div>

          {job.job_link && (
            <div>
              <a 
                href={job.job_link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
              >
                <HiLink className="w-4 h-4 mr-1.5" />
                View Original Job Posting
              </a>
            </div>
          )}

          {job.contact_info && (
            <div>
              <span className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Contact Info</span>
              <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {job.contact_info}
              </div>
            </div>
          )}

          {job.job_description && (
            <div>
              <span className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Description / Key Requirements</span>
              <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap max-h-48 overflow-y-auto custom-scrollbar border border-gray-100 dark:border-gray-700">
                {job.job_description}
              </div>
            </div>
          )}

          {job.notes && (
            <div>
              <span className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">My Notes</span>
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap border border-yellow-100 dark:border-yellow-900/30">
                {job.notes}
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-100 dark:border-gray-700 flex gap-3 bg-gray-50 dark:bg-gray-800/80 rounded-b-2xl">
          <button
            onClick={() => {
              onEdit(job);
              onClose();
            }}
            className="flex-1 flex justify-center items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
          >
            <HiPencilSquare className="w-4 h-4" />
            Edit Application
          </button>
          <button
            onClick={handleDelete}
            className="flex justify-center items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-medium rounded-lg transition-colors"
          >
            <HiTrash className="w-4 h-4" />
            Delete
          </button>
        </div>

      </div>
    </div>
  );
}
