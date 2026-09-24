import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import Header from './components/Header';
import DashboardStats from './components/DashboardStats';
import FilterBar from './components/FilterBar';
import JobCardGrid from './components/JobCardGrid';
import JobDetailModal from './components/JobDetailModal';
import JobFormModal from './components/JobFormModal';
import AuthModal from './components/AuthModal';
import {
  getJobs, addJob, updateJob, deleteJob,
  subscribeToChanges, isSupabaseConfigured,
  signIn, signUp, signOut, onAuthStateChange, getUser
} from './lib/storage';
import { exportToExcel } from './lib/exportExcel';

export default function App() {
  // Auth state
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(isSupabaseConfigured());
  const [authActionLoading, setAuthActionLoading] = useState(false);

  // Jobs state
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // UI state
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem('job_tracker_dark_mode');
    if (stored !== null) return JSON.parse(stored);
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [platformFilter, setPlatformFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Newest First');

  // Modal state
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [formMode, setFormMode] = useState('add');
  const [editingJob, setEditingJob] = useState(null);

  // Dark mode effect
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('job_tracker_dark_mode', JSON.stringify(darkMode));
  }, [darkMode]);

  // Auth state listener (Supabase only)
  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setAuthLoading(false);
      return;
    }

    // Check initial session
    getUser().then((u) => {
      setUser(u);
      setAuthLoading(false);
    });

    // Listen for auth changes
    const unsubscribe = onAuthStateChange((u) => {
      setUser(u);
    });

    return unsubscribe;
  }, []);

  // Load jobs when authenticated (or always in local mode)
  useEffect(() => {
    if (authLoading) return;
    if (isSupabaseConfigured() && !user) {
      setJobs([]);
      setLoading(false);
      return;
    }

    const loadJobs = async () => {
      setLoading(true);
      try {
        const data = await getJobs();
        setJobs(data);
      } catch (err) {
        toast.error('Failed to load jobs');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadJobs();
  }, [user, authLoading]);

  // Subscribe to real-time changes
  useEffect(() => {
    if (authLoading) return;
    if (isSupabaseConfigured() && !user) return;

    const unsubscribe = subscribeToChanges((updatedJobs) => {
      setJobs(updatedJobs);
    });
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user, authLoading]);

  // Filtered and sorted jobs
  const filteredJobs = useMemo(() => {
    let result = [...jobs];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(job =>
        job.job_role?.toLowerCase().includes(q) ||
        job.company?.toLowerCase().includes(q) ||
        job.platform?.toLowerCase().includes(q) ||
        job.location?.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== 'All') {
      result = result.filter(job => job.status === statusFilter);
    }

    if (platformFilter !== 'All') {
      result = result.filter(job => job.platform === platformFilter);
    }

    switch (sortBy) {
      case 'Newest First':
        result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
      case 'Oldest First':
        result.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        break;
      case 'Company A-Z':
        result.sort((a, b) => (a.company || '').localeCompare(b.company || ''));
        break;
      case 'Company Z-A':
        result.sort((a, b) => (b.company || '').localeCompare(a.company || ''));
        break;
      default:
        break;
    }

    return result;
  }, [jobs, searchQuery, statusFilter, platformFilter, sortBy]);

  // --- Auth handlers ---
  const handleSignIn = useCallback(async (email, password) => {
    setAuthActionLoading(true);
    try {
      await signIn(email, password);
      toast.success('Welcome back!');
    } finally {
      setAuthActionLoading(false);
    }
  }, []);

  const handleSignUp = useCallback(async (email, password) => {
    setAuthActionLoading(true);
    try {
      await signUp(email, password);
      toast.success('Account created! Check your email to verify if required.');
    } finally {
      setAuthActionLoading(false);
    }
  }, []);

  const handleSignOut = useCallback(async () => {
    try {
      await signOut();
      setJobs([]);
      toast.success('Signed out');
    } catch (err) {
      toast.error('Failed to sign out');
    }
  }, []);

  // --- CRUD handlers ---
  const handleAddClick = useCallback(() => {
    setFormMode('add');
    setEditingJob(null);
    setShowFormModal(true);
  }, []);

  const handleEditClick = useCallback((job) => {
    setFormMode('edit');
    setEditingJob(job);
    setShowFormModal(true);
  }, []);

  const handleCardClick = useCallback((job) => {
    setSelectedJob(job);
    setShowDetailModal(true);
  }, []);

  const handleFormSubmit = useCallback(async (formData) => {
    try {
      if (formMode === 'add') {
        const newJob = await addJob(formData);
        setJobs(prev => [newJob, ...prev]);
        toast.success('Application added!');
      } else {
        const updated = await updateJob(editingJob.id, formData);
        setJobs(prev => prev.map(j => j.id === editingJob.id ? updated : j));
        toast.success('Application updated!');
      }
      setShowFormModal(false);
      setEditingJob(null);
    } catch (err) {
      toast.error(formMode === 'add' ? 'Failed to add job' : 'Failed to update job');
      console.error(err);
    }
  }, [formMode, editingJob]);

  const handleDelete = useCallback(async (jobId) => {
    try {
      await deleteJob(jobId);
      setJobs(prev => prev.filter(j => j.id !== jobId));
      toast.success('Application deleted');
      setShowDetailModal(false);
      setSelectedJob(null);
    } catch (err) {
      toast.error('Failed to delete job');
      console.error(err);
    }
  }, []);

  const handleExport = useCallback(() => {
    if (jobs.length === 0) {
      toast.error('No data to export');
      return;
    }
    try {
      exportToExcel(filteredJobs);
      toast.success(`Exported ${filteredJobs.length} applications`);
    } catch (err) {
      toast.error('Export failed');
      console.error(err);
    }
  }, [jobs, filteredJobs]);

  // --- Auth gate ---
  // Show loading spinner while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth screen if Supabase is configured but user isn't logged in
  if (isSupabaseConfigured() && !user) {
    return (
      <>
        <Toaster position="top-right" toastOptions={{
          className: 'text-sm',
          style: { background: darkMode ? '#1f2937' : '#fff', color: darkMode ? '#f3f4f6' : '#1f2937' },
        }} />
        <AuthModal
          onSignIn={handleSignIn}
          onSignUp={handleSignUp}
          isLoading={authActionLoading}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-200">
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'text-sm',
          style: {
            background: darkMode ? '#1f2937' : '#fff',
            color: darkMode ? '#f3f4f6' : '#1f2937',
          },
        }}
      />

      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAddClick={handleAddClick}
        onExportClick={handleExport}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(prev => !prev)}
        user={user}
        onSignOut={handleSignOut}
      />

      <main className="pb-8">
        {/* Local mode indicator */}
        {!isSupabaseConfigured() && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg text-sm text-amber-700 dark:text-amber-400">
              <span className="font-medium">📦 Local Mode</span>
              <span className="hidden sm:inline">— Data stored in browser. Configure Supabase in <code className="bg-amber-100 dark:bg-amber-900/40 px-1.5 py-0.5 rounded">.env</code> for cross-device sync.</span>
            </div>
          </div>
        )}

        {/* Dashboard Stats */}
        <div className="pt-6">
          <DashboardStats jobs={jobs} />
        </div>

        {/* Filters */}
        <FilterBar
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          platformFilter={platformFilter}
          onPlatformFilterChange={setPlatformFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        {/* Job Cards */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <JobCardGrid jobs={filteredJobs} onCardClick={handleCardClick} />
        )}
      </main>

      {/* Detail Modal */}
      <JobDetailModal
        job={selectedJob}
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedJob(null);
        }}
        onEdit={handleEditClick}
        onDelete={handleDelete}
      />

      {/* Add/Edit Form Modal */}
      <JobFormModal
        isOpen={showFormModal}
        onClose={() => {
          setShowFormModal(false);
          setEditingJob(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={editingJob}
        mode={formMode}
      />
    </div>
  );
}
