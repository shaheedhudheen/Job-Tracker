export const STATUS_OPTIONS = [
  { value: 'applied', label: 'Applied', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400', dotColor: 'bg-blue-500' },
  { value: 'got_response', label: 'Got Response', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400', dotColor: 'bg-yellow-500' },
  { value: 'interview', label: 'Interview', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400', dotColor: 'bg-purple-500' },
  { value: 'offered', label: 'Offered', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400', dotColor: 'bg-emerald-500' },
  { value: 'rejected', label: 'Rejected', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400', dotColor: 'bg-red-500' },
  { value: 'accepted', label: 'Accepted', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400', dotColor: 'bg-green-500' },
]

export const PLATFORM_OPTIONS = [
  'LinkedIn', 'Indeed', 'Naukri', 'Glassdoor', 'Company Website',
  'Referral', 'AngelList', 'Hired', 'Monster', 'Other'
]

export const INITIAL_FORM_STATE = {
  job_role: '',
  company: '',
  location: '',
  applied_date: new Date().toISOString().split('T')[0],
  job_link: '',
  contact_info: '',
  platform: '',
  job_description: '',
  status: 'applied',
  salary_range: '',
  notes: '',
  resume_version: '',
  follow_up_date: '',
  interview_date: '',
}
