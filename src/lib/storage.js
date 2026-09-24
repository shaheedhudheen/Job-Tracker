import { v4 as uuidv4 } from 'uuid'
import supabase from './supabaseClient'

const LOCAL_STORAGE_KEY = 'job_tracker_jobs'
const SYNC_CHANNEL_NAME = 'job-tracker-sync'
const TABLE_NAME = 'job_applications'

export const isSupabaseConfigured = () => {
  return supabase !== null
}

// --- Auth helpers ---

export const getUser = async () => {
  if (!isSupabaseConfigured()) return null
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export const signUp = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) throw error
  return data
}

export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export const onAuthStateChange = (callback) => {
  if (!isSupabaseConfigured()) return () => {}
  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user || null)
  })
  return () => subscription.unsubscribe()
}

// --- Local storage helpers ---

const getLocalJobs = () => {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error('Error reading from localStorage', error)
    return []
  }
}

const saveLocalJobs = (jobs) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(jobs))
  } catch (error) {
    console.error('Error saving to localStorage', error)
  }
}

const notifyLocalChange = () => {
  const channel = new BroadcastChannel(SYNC_CHANNEL_NAME)
  channel.postMessage({ type: 'UPDATE' })
  channel.close()
}

// --- CRUD operations ---

export const getJobs = async () => {
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching from Supabase', error)
      return []
    }
    return data
  } else {
    const jobs = getLocalJobs()
    return jobs.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  }
}

export const addJob = async (job) => {
  const now = new Date().toISOString()
  if (isSupabaseConfigured()) {
    const user = await getUser()
    const newJob = { ...job, user_id: user?.id, created_at: now, updated_at: now }
    // Remove any empty-string date fields (Postgres wants null, not '')
    if (!newJob.follow_up_date) newJob.follow_up_date = null
    if (!newJob.interview_date) newJob.interview_date = null

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert([newJob])
      .select()
      .single()
    
    if (error) {
      console.error('Error inserting to Supabase', error)
      throw error
    }
    return data
  } else {
    const newJob = {
      ...job,
      id: uuidv4(),
      created_at: now,
      updated_at: now
    }
    const jobs = getLocalJobs()
    jobs.push(newJob)
    saveLocalJobs(jobs)
    notifyLocalChange()
    return newJob
  }
}

export const updateJob = async (id, updates) => {
  const now = new Date().toISOString()
  if (isSupabaseConfigured()) {
    const cleanUpdates = { ...updates, updated_at: now }
    // Remove any empty-string date fields
    if (cleanUpdates.follow_up_date === '') cleanUpdates.follow_up_date = null
    if (cleanUpdates.interview_date === '') cleanUpdates.interview_date = null
    // Don't send id/user_id/created_at in the update
    delete cleanUpdates.id
    delete cleanUpdates.user_id
    delete cleanUpdates.created_at

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .update(cleanUpdates)
      .eq('id', id)
      .select()
      .single()
      
    if (error) {
      console.error('Error updating in Supabase', error)
      throw error
    }
    return data
  } else {
    const jobs = getLocalJobs()
    const index = jobs.findIndex(j => j.id === id)
    if (index !== -1) {
      jobs[index] = { ...jobs[index], ...updates, updated_at: now }
      saveLocalJobs(jobs)
      notifyLocalChange()
      return jobs[index]
    }
    throw new Error('Job not found')
  }
}

export const deleteJob = async (id) => {
  if (isSupabaseConfigured()) {
    const { error } = await supabase
      .from(TABLE_NAME)
      .delete()
      .eq('id', id)
      
    if (error) {
      console.error('Error deleting from Supabase', error)
      throw error
    }
  } else {
    let jobs = getLocalJobs()
    jobs = jobs.filter(j => j.id !== id)
    saveLocalJobs(jobs)
    notifyLocalChange()
  }
}

export const subscribeToChanges = (callback) => {
  if (isSupabaseConfigured()) {
    const channel = supabase.channel(TABLE_NAME)
      .on('postgres_changes', { event: '*', schema: 'public', table: TABLE_NAME }, async () => {
        const jobs = await getJobs()
        callback(jobs)
      })
      .subscribe()
      
    return () => {
      supabase.removeChannel(channel)
    }
  } else {
    const fetchAndCallback = async () => {
      const jobs = await getJobs()
      callback(jobs)
    }

    const handleStorageChange = (e) => {
      if (e.key === LOCAL_STORAGE_KEY) {
        fetchAndCallback()
      }
    }
    
    window.addEventListener('storage', handleStorageChange)
    
    const channel = new BroadcastChannel(SYNC_CHANNEL_NAME)
    channel.onmessage = (event) => {
      if (event.data.type === 'UPDATE') {
        fetchAndCallback()
      }
    }
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      channel.close()
    }
  }
}
