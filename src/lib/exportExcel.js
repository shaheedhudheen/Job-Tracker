import * as xlsx from 'xlsx'
import { formatDate, formatDateTime } from './dateUtils'

export const exportToExcel = (jobs) => {
  const formattedJobs = jobs.map((job, index) => ({
    'S.No': index + 1,
    'Job Role': job.job_role,
    'Company': job.company,
    'Location': job.location,
    'Applied Date': job.applied_date ? formatDate(job.applied_date) : '',
    'Platform': job.platform,
    'Status': job.status,
    'Contact Info': job.contact_info,
    'Job Link': job.job_link,
    'Salary Range': job.salary_range,
    'Notes': job.notes,
    'Resume Version': job.resume_version,
    'Follow Up Date': job.follow_up_date ? formatDate(job.follow_up_date) : '',
    'Interview Date': job.interview_date ? formatDateTime(job.interview_date) : ''
  }))

  const worksheet = xlsx.utils.json_to_sheet(formattedJobs)
  
  // Set column widths based on content
  const wscols = [
    { wch: 5 },  // S.No
    { wch: 25 }, // Job Role
    { wch: 20 }, // Company
    { wch: 15 }, // Location
    { wch: 12 }, // Applied Date
    { wch: 15 }, // Platform
    { wch: 15 }, // Status
    { wch: 25 }, // Contact Info
    { wch: 30 }, // Job Link
    { wch: 15 }, // Salary Range
    { wch: 40 }, // Notes
    { wch: 15 }, // Resume Version
    { wch: 15 }, // Follow Up Date
    { wch: 15 }  // Interview Date
  ]
  worksheet['!cols'] = wscols

  const workbook = xlsx.utils.book_new()
  xlsx.utils.book_append_sheet(workbook, worksheet, 'Job Applications')
  
  const today = new Date().toISOString().split('T')[0]
  xlsx.writeFile(workbook, `Job_Applications_${today}.xlsx`)
}
