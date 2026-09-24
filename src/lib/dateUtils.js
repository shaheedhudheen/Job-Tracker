/**
 * Formats a date string into DD/MM/YYYY.
 * Handles both "YYYY-MM-DD" and ISO strings safely without timezone shifts.
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A'

  // If already in YYYY-MM-DD format, split directly to prevent UTC offset shifting
  if (typeof dateStr === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const [year, month, day] = dateStr.split('-')
    return `${day}/${month}/${year}`
  }

  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return 'N/A'

  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()

  return `${day}/${month}/${year}`
}

/**
 * Formats a date-time string into DD/MM/YYYY, HH:MM AM/PM
 */
export const formatDateTime = (dateTimeStr) => {
  if (!dateTimeStr) return 'N/A'

  const d = new Date(dateTimeStr)
  if (isNaN(d.getTime())) return 'N/A'

  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()

  let hours = d.getHours()
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const ampm = hours >= 12 ? 'PM' : 'AM'
  hours = hours % 12 || 12

  return `${day}/${month}/${year}, ${hours}:${minutes} ${ampm}`
}
