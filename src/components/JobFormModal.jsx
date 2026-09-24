import React, { useState, useEffect } from 'react';
import { HiXMark } from 'react-icons/hi2';
import { STATUS_OPTIONS, PLATFORM_OPTIONS, INITIAL_FORM_STATE } from '../lib/constants.js';

export default function JobFormModal({ isOpen, onClose, onSubmit, initialData, mode = 'add' }) {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);

  useEffect(() => {
    if (isOpen) {
      if (initialData && mode === 'edit') {
        setFormData({ ...initialData });
      } else {
        setFormData({ ...INITIAL_FORM_STATE, applied_date: new Date().toISOString().split('T')[0] });
      }
    }
  }, [isOpen, initialData, mode]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const setToday = () => {
    setFormData(prev => ({ ...prev, applied_date: new Date().toISOString().split('T')[0] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const inputClass = "block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 border";
  const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-0">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {mode === 'add' ? 'Add New Application' : 'Edit Application'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors">
            <HiXMark className="w-6 h-6" />
          </button>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <form id="jobForm" onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Role & Company */}
              <div className="col-span-1 sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="job_role" className={labelClass}>Job Role *</label>
                  <input type="text" id="job_role" name="job_role" required value={formData.job_role} onChange={handleChange} className={inputClass} placeholder="e.g. Frontend Developer" />
                </div>
                <div>
                  <label htmlFor="company" className={labelClass}>Company *</label>
                  <input type="text" id="company" name="company" required value={formData.company} onChange={handleChange} className={inputClass} placeholder="e.g. Acme Corp" />
                </div>
              </div>

              {/* Status & Platform */}
              <div>
                <label htmlFor="status" className={labelClass}>Status</label>
                <select id="status" name="status" value={formData.status} onChange={handleChange} className={inputClass}>
                  {STATUS_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="platform" className={labelClass}>Platform</label>
                <select id="platform" name="platform" value={formData.platform} onChange={handleChange} className={inputClass}>
                  <option value="">Select platform...</option>
                  {PLATFORM_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              {/* Applied Date & Location */}
              <div>
                <label htmlFor="applied_date" className={labelClass}>Applied Date</label>
                <div className="flex gap-2">
                  <input type="date" id="applied_date" name="applied_date" value={formData.applied_date} onChange={handleChange} className={inputClass} />
                  <button type="button" onClick={setToday} className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">Today</button>
                </div>
              </div>
              <div>
                <label htmlFor="location" className={labelClass}>Location</label>
                <input type="text" id="location" name="location" value={formData.location} onChange={handleChange} className={inputClass} placeholder="e.g. Remote, NY" />
              </div>

              {/* Link & Salary */}
              <div className="col-span-1 sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="job_link" className={labelClass}>Job Link</label>
                  <input type="url" id="job_link" name="job_link" value={formData.job_link} onChange={handleChange} className={inputClass} placeholder="https://..." />
                </div>
                <div>
                  <label htmlFor="salary_range" className={labelClass}>Salary Range</label>
                  <input type="text" id="salary_range" name="salary_range" value={formData.salary_range} onChange={handleChange} className={inputClass} placeholder="e.g. $100k - $120k" />
                </div>
              </div>

              {/* Dates */}
              <div>
                <label htmlFor="follow_up_date" className={labelClass}>Follow Up Date</label>
                <input type="date" id="follow_up_date" name="follow_up_date" value={formData.follow_up_date} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label htmlFor="interview_date" className={labelClass}>Interview Date & Time</label>
                <input type="datetime-local" id="interview_date" name="interview_date" value={formData.interview_date} onChange={handleChange} className={inputClass} />
              </div>

              {/* Extras */}
              <div>
                <label htmlFor="resume_version" className={labelClass}>Resume Version</label>
                <input type="text" id="resume_version" name="resume_version" value={formData.resume_version} onChange={handleChange} className={inputClass} placeholder="e.g. Frontend v2" />
              </div>
              <div>
                <label htmlFor="contact_info" className={labelClass}>Contact Info</label>
                <input type="text" id="contact_info" name="contact_info" value={formData.contact_info} onChange={handleChange} className={inputClass} placeholder="Recruiter email or name" />
              </div>

              {/* Textareas */}
              <div className="col-span-1 sm:col-span-2">
                <label htmlFor="job_description" className={labelClass}>Job Description / Requirements</label>
                <textarea id="job_description" name="job_description" rows={4} value={formData.job_description} onChange={handleChange} className={inputClass} />
              </div>
              <div className="col-span-1 sm:col-span-2">
                <label htmlFor="notes" className={labelClass}>Notes</label>
                <textarea id="notes" name="notes" rows={3} value={formData.notes} onChange={handleChange} className={inputClass} placeholder="Interview notes, thoughts, etc." />
              </div>
            </div>

          </form>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80 rounded-b-xl flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm transition-colors">
            Cancel
          </button>
          <button type="submit" form="jobForm" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors">
            {mode === 'add' ? 'Add Application' : 'Save Changes'}
          </button>
        </div>

      </div>
    </div>
  );
}
