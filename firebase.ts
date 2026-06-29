import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Trash2, 
  Check, 
  Eye, 
  LogOut, 
  Menu, 
  X, 
  Inbox, 
  CheckSquare, 
  Sparkles, 
  RefreshCw, 
  SlidersHorizontal, 
  User, 
  Calendar, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  MessageSquare,
  Lock,
  ChevronRight,
  Bell,
  EyeOff,
  AlertTriangle,
  GraduationCap,
  BookOpen,
  Award,
  Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  listenToEnquiriesByCategory, 
  listenToEnquiryCounts,
  updateEnquiryStatusInDb, 
  deleteEnquiryFromDb, 
  loginAdminUser,
  logoutAdminUser,
  Enquiry 
} from '../firebase';

// Categorize enquiries based on interestedProgram
function getEnquiryCategory(enquiry: Enquiry): string {
  const prog = (enquiry.interestedProgram || '').toLowerCase();
  
  if (prog.includes('ausbildung')) {
    return 'ausbildung';
  }
  if (prog.includes('bachelor')) {
    return 'bachelors';
  }
  if (prog.includes('master')) {
    return 'masters';
  }
  if (prog.includes('opportunity') || prog.includes('chancenkarte')) {
    return 'opportunity_card';
  }
  if (prog.includes('a1 to b1')) {
    return 'a1_b1_package';
  }
  if (prog.includes('a1 to b2')) {
    return 'package';
  }
  if (prog.includes('a1')) {
    return 'a1';
  }
  if (prog.includes('a2')) {
    return 'a2';
  }
  if (prog.includes('b1')) {
    return 'b1';
  }
  if (prog.includes('b2')) {
    return 'b2';
  }
  return 'general';
}

interface AdminDashboardProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export default function AdminDashboard({ currentPath, onNavigate }: AdminDashboardProps) {
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  
  // Login Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Enquiries States
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'All' | 'New' | 'Contacted' | 'Follow-up' | 'Closed'>('All');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [categoryCounts, setCategoryCounts] = useState<{ [key: string]: { total: number; new: number } }>({
    all: { total: 0, new: 0 },
    ausbildung: { total: 0, new: 0 },
    bachelors: { total: 0, new: 0 },
    masters: { total: 0, new: 0 },
    opportunity_card: { total: 0, new: 0 },
    a1: { total: 0, new: 0 },
    a2: { total: 0, new: 0 },
    b1: { total: 0, new: 0 },
    b2: { total: 0, new: 0 },
    a1_b1_package: { total: 0, new: 0 },
    package: { total: 0, new: 0 },
    general: { total: 0, new: 0 },
  });
  
  // Real-time notifications tracking
  const [prevNewCount, setPrevNewCount] = useState<number | null>(null);
  const [showNotificationBadge, setShowNotificationBadge] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('info');

  // Delete Action states
  const [enquiryToDelete, setEnquiryToDelete] = useState<Enquiry | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Auto-hide toast messages
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Track authenticated user state using secure sessionStorage
  useEffect(() => {
    const savedSession = sessionStorage.getItem('assam2abroad_admin_session');
    if (savedSession) {
      setUser({ email: savedSession });
      if (currentPath === '/admin-login' || currentPath === '/admin') {
        onNavigate('/admin-dashboard');
      }
    } else {
      setUser(null);
      if (currentPath === '/admin-dashboard' || currentPath === '/admin') {
        onNavigate('/admin-login');
      }
    }
    setAuthLoading(false);
  }, [currentPath, onNavigate]);

  // Real-time subscription to Enquiries in Firestore by Category
  useEffect(() => {
    if (!user) return;

    const unsubscribe = listenToEnquiriesByCategory(selectedCategory, (fetchedEnquiries) => {
      setEnquiries(fetchedEnquiries);
    });

    return () => unsubscribe();
  }, [user, selectedCategory]);

  // Real-time counts subscription
  useEffect(() => {
    if (!user) return;

    const unsubscribeCounts = listenToEnquiryCounts((counts) => {
      setCategoryCounts(counts);

      const newCount = counts.all.new;
      if (prevNewCount !== null && newCount > prevNewCount) {
        setShowNotificationBadge(true);
        setToastMessage(`New Enquiry received!`);
        setTimeout(() => setToastMessage(null), 5000);
      }
      setPrevNewCount(newCount);
    });

    return () => unsubscribeCounts();
  }, [user, prevNewCount]);

  // Handle Admin Login submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    const trimmedPassword = password.trim();
    if (trimmedPassword !== 'A2A@2026#Admin') {
      setIsLoggingIn(false);
      setLoginError('Invalid security password. Access denied.');
      return;
    }

    const trimmedEmail = email.trim();
    const formattedEmail = trimmedEmail.includes('@') ? trimmedEmail : `${trimmedEmail}@assam2abroad.com`;

    try {
      // Also login via Firebase Auth to authenticate the connection
      await loginAdminUser(formattedEmail, trimmedPassword);
    } catch (authErr) {
      console.warn("Firebase Auth login failed, using sessionStorage fallback:", authErr);
    }

    // Save session securely in sessionStorage
    sessionStorage.setItem('assam2abroad_admin_session', formattedEmail);
    setUser({ email: formattedEmail });
    setIsLoggingIn(false);
    onNavigate('/admin-dashboard');
  };

  // Handle Admin Logout
  const handleLogout = async () => {
    try {
      await logoutAdminUser();
    } catch (err) {
      console.warn("Firebase Auth logout failed:", err);
    }
    sessionStorage.removeItem('assam2abroad_admin_session');
    setUser(null);
    onNavigate('/admin-login');
  };

  // Mark status action to support four distinct states
  const handleUpdateStatus = async (enquiry: Enquiry, newStatus: 'New' | 'Contacted' | 'Follow-up' | 'Closed') => {
    // Save copy of current status for rollback if database fails
    const originalStatus = enquiry.status;

    // Optimistic state update
    setEnquiries(prev => prev.map(e => e.id === enquiry.id ? { ...e, status: newStatus } : e));
    if (selectedEnquiry && selectedEnquiry.id === enquiry.id) {
      setSelectedEnquiry(prev => prev ? { ...prev, status: newStatus } : null);
    }

    const res = await updateEnquiryStatusInDb(enquiry.id, newStatus);
    if (!res.success) {
      // Revert if database fails
      setEnquiries(prev => prev.map(e => e.id === enquiry.id ? { ...e, status: originalStatus } : e));
      if (selectedEnquiry && selectedEnquiry.id === enquiry.id) {
        setSelectedEnquiry(prev => prev ? { ...prev, status: originalStatus } : null);
      }
      showToast("Failed to update status. Please try again.", "error");
    } else {
      showToast(`Enquiry marked as ${newStatus}.`, "success");
    }
  };

  // Helper to show custom toasts
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToastMessage(message);
    setToastType(type);
  };

  // Delete enquiry action (triggers custom confirmation modal)
  const handleDeleteEnquiry = (id: string) => {
    const enquiry = enquiries.find(e => e.id === id);
    if (enquiry) {
      setEnquiryToDelete(enquiry);
    }
  };

  // Perform actual deletion from the database
  const handleConfirmDelete = async () => {
    if (!enquiryToDelete) return;
    setIsDeleting(true);
    const id = enquiryToDelete.id;

    // Save copy of current state for rollback if database fails
    const originalEnquiries = [...enquiries];
    const wasSelected = selectedEnquiry && selectedEnquiry.id === id;

    // Optimistic state update
    setEnquiries(prev => prev.filter(e => e.id !== id));
    if (wasSelected) {
      setSelectedEnquiry(null);
    }

    try {
      const res = await deleteEnquiryFromDb(id);
      if (res.success) {
        showToast("Enquiry deleted successfully.", "success");
      } else {
        throw res.error || new Error("Deletion failed on server");
      }
    } catch (err) {
      console.error("Error deleting enquiry:", err);
      // Rollback optimistic state update on failure
      setEnquiries(originalEnquiries);
      if (wasSelected && enquiryToDelete) {
        setSelectedEnquiry(enquiryToDelete);
      }
      showToast("Unable to delete the enquiry. Please try again.", "error");
    } finally {
      setIsDeleting(false);
      setEnquiryToDelete(null);
    }
  };

  // Export listed enquiries to CSV format category-wise
  const handleExportCSV = () => {
    if (processedEnquiries.length === 0) {
      showToast("No enquiries in this category to export.", "info");
      return;
    }

    const headers = ['ID', 'Full Name', 'Email', 'Mobile', 'Country', 'Program', 'Category', 'Status', 'Date', 'Message'];
    const rows = processedEnquiries.map(e => [
      e.id,
      `"${(e.fullName || '').replace(/"/g, '""')}"`,
      `"${(e.emailAddress || '').replace(/"/g, '""')}"`,
      `"${(e.mobileNumber || '').replace(/"/g, '""')}"`,
      `"${(e.country || '').replace(/"/g, '""')}"`,
      `"${(e.interestedProgram || '').replace(/"/g, '""')}"`,
      `"${(e.category || '').replace(/"/g, '""')}"`,
      `"${(e.status || '').replace(/"/g, '""')}"`,
      `"${formatDate(e.createdAt).replace(/"/g, '""')}"`,
      `"${(e.message || '').replace(/"/g, '""')}"`
    ]);

    const csvString = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `enquiries_${selectedCategory}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Category enquiries exported successfully.", "success");
  };

  // Statistics Computations of the current loaded category
  const stats = useMemo(() => {
    const total = enquiries.length;
    const newCount = enquiries.filter(e => e.status === 'New').length;
    const contacted = enquiries.filter(e => e.status === 'Contacted').length;
    const followedUp = enquiries.filter(e => e.status === 'Follow-up').length;
    const closed = enquiries.filter(e => e.status === 'Closed').length;
    return { total, newCount, contacted, followedUp, closed };
  }, [enquiries]);

  // Filter & Search & Sort list computation
  const processedEnquiries = useMemo(() => {
    let list = [...enquiries];

    // Filter by category (as client-side fallback/guard)
    if (selectedCategory !== 'all') {
      list = list.filter(e => getEnquiryCategory(e) === selectedCategory);
    }

    // 1. Status Filter
    if (statusFilter !== 'All') {
      list = list.filter(e => e.status === statusFilter);
    }

    // 2. Search query matching name, email, phone, program, or message
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      list = list.filter(e => 
        e.fullName.toLowerCase().includes(q) ||
        e.emailAddress.toLowerCase().includes(q) ||
        e.mobileNumber.toLowerCase().includes(q) ||
        e.interestedProgram.toLowerCase().includes(q) ||
        e.message.toLowerCase().includes(q)
      );
    }

    // 3. Sorting
    list.sort((a, b) => {
      const timeA = a.createdAt?.seconds || 0;
      const timeB = b.createdAt?.seconds || 0;
      return sortOrder === 'newest' ? timeB - timeA : timeA - timeB;
    });

    return list;
  }, [enquiries, statusFilter, searchQuery, sortOrder]);

  // Format Firestore date helper
  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Just now';
    const d = new Date(timestamp.seconds * 1000);
    return d.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Clear notification badge
  const handleClearNotifications = () => {
    setShowNotificationBadge(false);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#070c14] flex flex-col items-center justify-center text-white">
        <RefreshCw className="w-8 h-8 animate-spin text-amber-500 mb-4" />
        <p className="text-sm tracking-wider uppercase font-mono text-slate-400">Loading Secure Admin Panel...</p>
      </div>
    );
  }

  // LOGIN PAGE VIEW
  if (currentPath === '/admin-login') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#05080e] relative overflow-hidden font-sans p-4">
        {/* Cinematic Blur Accents */}
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-amber-500/[0.04] rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-rose-600/[0.04] rounded-full blur-[120px] pointer-events-none" />
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md relative z-10"
        >
          {/* Logo Title */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold font-display tracking-tight text-white">
              Assam<span className="text-amber-400">2</span>Abroad
            </h1>
            <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-mono">Internal CRM Portal</p>
          </div>

          {/* Login Card */}
          <div className="bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-2xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/20 text-amber-400">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white leading-none">Admin Login</h2>
                <p className="text-xs text-slate-400 mt-1">Authorized institute access only</p>
              </div>
            </div>

            {loginError && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-rose-500/10 border border-rose-500/20 text-rose-200 text-xs py-3 px-4 rounded-xl mb-4 font-medium"
              >
                {loginError}
              </motion.div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Admin Email / Username
                </label>
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g., admin or admin@assam2abroad.com"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-400/10 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-400/10 transition pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-amber-500/50 text-slate-950 font-extrabold py-3 rounded-xl shadow-lg shadow-amber-500/10 transition flex items-center justify-center space-x-2 text-sm uppercase tracking-wider cursor-pointer"
              >
                {isLoggingIn ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Authenticate</span>
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Footer branding */}
          <div className="text-center mt-6">
            <button 
              onClick={() => onNavigate('/')}
              className="text-xs text-slate-400 hover:text-white transition underline"
            >
              Back to Public Website
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // DASHBOARD VIEW
  if (!user) {
    return (
      <div className="min-h-screen bg-[#070c14] flex flex-col items-center justify-center text-white">
        <RefreshCw className="w-8 h-8 animate-spin text-amber-500 mb-4" />
        <p className="text-sm tracking-wider uppercase font-mono text-slate-400">Redirecting to login...</p>
      </div>
    );
  }

  const sections = [
    {
      title: 'OVERVIEW',
      items: [
        { id: 'all', name: 'All Enquiries', icon: Inbox, color: 'text-amber-400' },
      ]
    },
    {
      title: 'GERMAN CLASSES',
      items: [
        { id: 'a1', name: 'A1 Level', icon: BookOpen, color: 'text-amber-400' },
        { id: 'a2', name: 'A2 Level', icon: BookOpen, color: 'text-amber-400' },
        { id: 'b1', name: 'B1 Level', icon: BookOpen, color: 'text-amber-400' },
        { id: 'b2', name: 'B2 Level', icon: BookOpen, color: 'text-amber-400' },
        { id: 'a1_b1_package', name: 'A1-B1 Package', icon: Award, color: 'text-teal-400' },
        { id: 'package', name: 'A1-B2 Package', icon: Award, color: 'text-emerald-400' },
      ]
    },
    {
      title: 'GERMANY PATHWAYS',
      items: [
        { id: 'ausbildung', name: 'Ausbildung', icon: Briefcase, color: 'text-indigo-400' },
        { id: 'bachelors', name: 'Bachelor’s', icon: GraduationCap, color: 'text-pink-400' },
        { id: 'masters', name: 'Master’s', icon: GraduationCap, color: 'text-violet-400' },
        { id: 'opportunity_card', name: 'Opportunity Card', icon: Sparkles, color: 'text-cyan-400' },
      ]
    },
    {
      title: 'OTHER',
      items: [
        { id: 'general', name: 'General & Contact', icon: SlidersHorizontal, color: 'text-slate-400' },
      ]
    }
  ];

  const categoryDetails: { [key: string]: { title: string; desc: string } } = {
    all: { title: "All Student Enquiries", desc: "Unified real-time repository of all website submissions and leads." },
    a1: { title: "A1 German Enquiries", desc: "Leads interested in Beginner German language classes (A1 Level)." },
    a2: { title: "A2 German Enquiries", desc: "Leads interested in Elementary German language classes (A2 Level)." },
    b1: { title: "B1 German Enquiries", desc: "Leads interested in Intermediate German language classes (B1 Level)." },
    b2: { title: "B2 German Enquiries", desc: "Leads interested in Upper-Intermediate German language classes (B2 Level)." },
    a1_b1_package: { title: "A1–B1 Package Enquiries", desc: "Leads interested in the combined fast-track German language program up to B1 level." },
    package: { title: "A1–B2 Package Enquiries", desc: "Leads interested in the complete German language program." },
    ausbildung: { title: "Ausbildung Enquiries", desc: "Leads looking for vocational training placements with stipends in Germany." },
    bachelors: { title: "Bachelor's Degree Enquiries", desc: "Leads targeting tuition-free undergraduate university admissions." },
    masters: { title: "Master's Degree Enquiries", desc: "Leads targeting advanced postgraduate programs and career pathways." },
    opportunity_card: { title: "Opportunity Card Enquiries", desc: "Leads seeking points-based German job-seeker (Chancenkarte) visas." },
    general: { title: "General & Contact Leads", desc: "General contact inquiries and non-pathway lead submissions." },
  };

  const currentCategoryDetails = categoryDetails[selectedCategory] || { title: "Student Enquiries", desc: "Real-time repository of website submissions and leads" };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row text-slate-800 font-sans">
      
      {/* Real-time Notification Banner / Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className={`fixed top-6 right-6 z-50 border py-3 px-5 rounded-2xl shadow-2xl flex items-center space-x-3 ${
              toastType === 'success'
                ? 'bg-slate-900 border-emerald-500/30 text-white'
                : toastType === 'error'
                ? 'bg-slate-900 border-rose-500/30 text-white'
                : 'bg-slate-900 border-amber-500/30 text-white'
            }`}
          >
            <div className={`p-1.5 rounded-lg ${
              toastType === 'success'
                ? 'bg-emerald-500/10 text-emerald-400'
                : toastType === 'error'
                ? 'bg-rose-500/10 text-rose-400'
                : 'bg-amber-500/10 text-amber-400'
            }`}>
              {toastType === 'success' ? (
                <Check className="w-4 h-4" />
              ) : toastType === 'error' ? (
                <Trash2 className="w-4 h-4" />
              ) : (
                <Bell className="w-4 h-4 animate-ring" />
              )}
            </div>
            <div className="text-sm font-semibold pr-2">{toastMessage}</div>
            <button 
              onClick={() => setToastMessage(null)} 
              className="text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MOBILE HEADER BAR */}
      <div className="md:hidden flex justify-between items-center bg-slate-950 border-b border-white/10 py-4 px-6 text-white z-40">
        <div className="flex items-center space-x-2.5">
          <span className="font-display font-extrabold text-base tracking-tight">
            Assam<span className="text-amber-400">2</span>Abroad
          </span>
          <span className="text-[9px] font-mono tracking-widest text-slate-400 border border-slate-800 py-0.5 px-1.5 rounded bg-slate-900 uppercase">
            CRM
          </span>
        </div>
        
        <div className="flex items-center space-x-3">
          {showNotificationBadge && (
            <button 
              onClick={handleClearNotifications}
              className="relative p-2 bg-amber-500/10 text-amber-400 rounded-lg border border-amber-500/20"
              title="Clear new notification badge"
            >
              <Bell className="w-4.5 h-4.5 animate-bounce" />
              <span className="absolute -top-1 -right-1 h-2.5 w-2.5 bg-rose-500 rounded-full" />
            </button>
          )}

          <button
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            className="p-1.5 text-slate-300 hover:text-white"
            aria-label="Toggle Mobile Menu"
          >
            {isMobileSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* SIDEBAR: Permanent on desktop, toggleable on mobile */}
      <div className={`
        fixed inset-y-0 left-0 w-64 bg-slate-950 text-white z-40 transform transition-transform duration-300 ease-in-out border-r border-white/5
        md:relative md:translate-x-0 flex flex-col justify-between
        ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Sidebar Header */}
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <span className="font-display font-extrabold text-lg tracking-tight">
                Assam<span className="text-amber-400">2</span>Abroad
              </span>
              <span className="text-[9px] font-mono tracking-widest text-slate-400 border border-slate-800 py-0.5 px-1.5 rounded bg-slate-900 uppercase font-bold">
                CRM
              </span>
            </div>
            <button 
              onClick={() => setIsMobileSidebarOpen(false)} 
              className="md:hidden text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-8 py-3 px-4 bg-white/[0.03] border border-white/10 rounded-2xl flex items-center space-x-3">
            <div className="w-9 h-9 bg-amber-500 text-slate-950 font-bold text-sm flex items-center justify-center rounded-xl shadow-lg shadow-amber-500/15">
              A
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-bold truncate text-slate-200">Admin Owner</div>
              <div className="text-[10px] text-slate-400 truncate">{user?.email || 'admin@assam2abroad.com'}</div>
            </div>
          </div>
        </div>

        {/* Sidebar Menu Items */}
        <div className="flex-1 px-3 py-2 space-y-4 overflow-y-auto no-scrollbar">
          {sections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-1">
              <div className="px-3 text-[10px] font-mono tracking-wider font-extrabold text-slate-500 uppercase">
                {section.title}
              </div>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive = selectedCategory === item.id;
                  const countInfo = categoryCounts[item.id] || { total: 0, new: 0 };
                  const Icon = item.icon;
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setSelectedCategory(item.id);
                        setIsMobileSidebarOpen(false);
                      }}
                      className={`w-full flex items-center justify-between text-left px-3 py-2 rounded-xl transition duration-150 cursor-pointer ${
                        isActive
                          ? 'bg-amber-500/15 border border-amber-500/20 text-white font-bold shadow-sm'
                          : 'text-slate-400 hover:text-white hover:bg-white/[0.03] border border-transparent'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5 min-w-0">
                        <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-amber-400' : item.color}`} />
                        <span className="text-xs truncate">{item.name}</span>
                      </div>
                      
                      <div className="flex items-center space-x-1.5 shrink-0">
                        {countInfo.new > 0 && (
                          <span className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[9px] font-bold px-1.5 py-0.5 rounded-md leading-none animate-pulse">
                            {countInfo.new}
                          </span>
                        )}
                        <span className="text-[10px] font-semibold text-slate-500">
                          {countInfo.total}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar Footer */}
        <div className="p-6 border-t border-white/5">
          {showNotificationBadge && (
            <button 
              onClick={handleClearNotifications}
              className="w-full mb-3 py-2 px-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-between text-xs text-amber-400 font-bold transition hover:bg-amber-500/15"
            >
              <div className="flex items-center space-x-2">
                <Bell className="w-3.5 h-3.5 animate-pulse" />
                <span>New items pending</span>
              </div>
              <span className="bg-rose-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-sans">
                NEW
              </span>
            </button>
          )}

          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-rose-400 transition bg-white/[0.02] border border-white/5 hover:border-rose-500/20 hover:bg-rose-500/5 py-3 rounded-xl cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout Panel</span>
          </button>
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="flex-1 overflow-y-auto min-h-screen p-6 sm:p-10 bg-slate-50 relative">
        {/* Header Title Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-6 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight font-display">{currentCategoryDetails.title}</h2>
            <p className="text-xs text-slate-500 mt-1">{currentCategoryDetails.desc}</p>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={handleExportCSV}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 shadow-sm px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
            <button 
              onClick={() => onNavigate('/')}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 bg-white shadow-sm hover:shadow px-4 py-2 rounded-xl transition cursor-pointer"
            >
              ← View Public Site
            </button>
          </div>
        </div>

        {/* STATS GRID (DYNAMIC STATISTICS DASHBOARD) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {/* Card: Total Enquiries */}
          <div className="bg-white rounded-2xl p-4.5 border border-slate-200 shadow-sm relative overflow-hidden flex items-center justify-between group hover:border-slate-300 transition duration-300">
            <div className="space-y-1 min-w-0">
              <span className="text-[10px] font-mono tracking-wider font-extrabold text-slate-400 uppercase block truncate">Total Enquiries</span>
              <div className="text-2xl font-extrabold text-slate-900">{categoryCounts.all?.total || 0}</div>
            </div>
            <div className="p-2.5 bg-slate-100 rounded-xl text-slate-600 group-hover:scale-105 transition duration-300 shrink-0">
              <Inbox className="w-5 h-5" />
            </div>
            <div className="absolute top-0 bottom-0 left-0 w-1 bg-slate-400" />
          </div>

          {/* Card: Ausbildung */}
          <div className="bg-white rounded-2xl p-4.5 border border-slate-200 shadow-sm relative overflow-hidden flex items-center justify-between group hover:border-slate-300 transition duration-300">
            <div className="space-y-1 min-w-0">
              <span className="text-[10px] font-mono tracking-wider font-extrabold text-slate-400 uppercase block truncate">Ausbildung</span>
              <div className="text-2xl font-extrabold text-slate-900">{categoryCounts.ausbildung?.total || 0}</div>
            </div>
            <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-500 group-hover:scale-105 transition duration-300 shrink-0">
              <Briefcase className="w-5 h-5" />
            </div>
            <div className="absolute top-0 bottom-0 left-0 w-1 bg-indigo-400" />
          </div>

          {/* Card: Bachelor's */}
          <div className="bg-white rounded-2xl p-4.5 border border-slate-200 shadow-sm relative overflow-hidden flex items-center justify-between group hover:border-slate-300 transition duration-300">
            <div className="space-y-1 min-w-0">
              <span className="text-[10px] font-mono tracking-wider font-extrabold text-slate-400 uppercase block truncate">Bachelor's</span>
              <div className="text-2xl font-extrabold text-slate-900">{categoryCounts.bachelors?.total || 0}</div>
            </div>
            <div className="p-2.5 bg-pink-50 rounded-xl text-pink-500 group-hover:scale-105 transition duration-300 shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="absolute top-0 bottom-0 left-0 w-1 bg-pink-400" />
          </div>

          {/* Card: Master's */}
          <div className="bg-white rounded-2xl p-4.5 border border-slate-200 shadow-sm relative overflow-hidden flex items-center justify-between group hover:border-slate-300 transition duration-300">
            <div className="space-y-1 min-w-0">
              <span className="text-[10px] font-mono tracking-wider font-extrabold text-slate-400 uppercase block truncate">Master's</span>
              <div className="text-2xl font-extrabold text-slate-900">{categoryCounts.masters?.total || 0}</div>
            </div>
            <div className="p-2.5 bg-violet-50 rounded-xl text-violet-500 group-hover:scale-105 transition duration-300 shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="absolute top-0 bottom-0 left-0 w-1 bg-violet-400" />
          </div>

          {/* Card: Opportunity Card */}
          <div className="bg-white rounded-2xl p-4.5 border border-slate-200 shadow-sm relative overflow-hidden flex items-center justify-between group hover:border-slate-300 transition duration-300">
            <div className="space-y-1 min-w-0">
              <span className="text-[10px] font-mono tracking-wider font-extrabold text-slate-400 uppercase block truncate">Opportunity Card</span>
              <div className="text-2xl font-extrabold text-slate-900">{categoryCounts.opportunity_card?.total || 0}</div>
            </div>
            <div className="p-2.5 bg-cyan-50 rounded-xl text-cyan-500 group-hover:scale-105 transition duration-300 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="absolute top-0 bottom-0 left-0 w-1 bg-cyan-400" />
          </div>
        </div>

        {/* CONTROLS (SEARCH, FILTER & SORT) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 mb-6 flex flex-col lg:flex-row gap-4 justify-between items-center">
          {/* Search Bar */}
          <div className="relative w-full lg:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search leads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 bg-slate-50/50 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:bg-white transition"
            />
          </div>

          {/* Filter & Sort Controls */}
          <div className="flex flex-wrap gap-3 items-center w-full lg:w-auto justify-end">
            {/* Status Filter buttons */}
            <div className="bg-slate-100 p-1 rounded-xl flex flex-wrap items-center border border-slate-200 gap-0.5">
              {(['All', 'New', 'Contacted', 'Follow-up', 'Closed'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setStatusFilter(filter)}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                    statusFilter === filter 
                      ? 'bg-white text-slate-900 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Sort Toggle */}
            <div className="relative">
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
                className="appearance-none bg-white border border-slate-200 text-xs font-bold text-slate-700 py-2.5 pl-4 pr-10 rounded-xl focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 cursor-pointer shadow-sm"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
              <SlidersHorizontal className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* MAIN DATA TABLE PANEL */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {processedEnquiries.length === 0 ? (
            <div className="py-20 text-center flex flex-col items-center justify-center">
              <div className="p-4 bg-slate-100 text-slate-400 rounded-full mb-3">
                <Inbox className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-slate-800 text-base">No enquiries found</h3>
              <p className="text-xs text-slate-500 max-w-xs mt-1">
                Try adjusting your search criteria, clearing your filters, or waiting for a new client submission.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase text-[10px] font-mono tracking-wider">
                    <th className="py-4 px-6 font-extrabold">Full Name</th>
                    <th className="py-4 px-6 font-extrabold">Interested Program</th>
                    <th className="py-4 px-6 font-extrabold">Mobile / Contact</th>
                    <th className="py-4 px-6 font-extrabold">Date & Time</th>
                    <th className="py-4 px-6 font-extrabold text-center">Status</th>
                    <th className="py-4 px-6 font-extrabold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {processedEnquiries.map((enquiry) => (
                    <tr 
                      key={enquiry.id} 
                      className={`hover:bg-slate-50/70 transition duration-150 ${
                        enquiry.status === 'New' ? 'font-medium bg-amber-50/[0.12]' : ''
                      }`}
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                            enquiry.status === 'New' 
                              ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' 
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            {enquiry.fullName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span className="text-slate-900 block font-bold leading-tight">{enquiry.fullName}</span>
                            <span className="text-xs text-slate-400 block mt-0.5">{enquiry.emailAddress}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="px-3 py-1 rounded-full bg-slate-100 border border-slate-200/50 text-slate-700 text-xs font-bold inline-block max-w-[200px] truncate" title={enquiry.interestedProgram}>
                          {enquiry.interestedProgram}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-slate-600 font-mono text-xs">
                        {enquiry.mobileNumber}
                      </td>
                      <td className="py-4 px-6 text-slate-500 text-xs font-medium">
                        {formatDate(enquiry.createdAt)}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className={`px-2.5 py-1.5 text-[10px] font-mono tracking-wider font-extrabold uppercase rounded-lg inline-block ${
                          enquiry.status === 'New' 
                            ? 'bg-amber-100 text-amber-800' 
                            : enquiry.status === 'Contacted'
                            ? 'bg-emerald-100 text-emerald-800'
                            : enquiry.status === 'Follow-up'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-slate-200 text-slate-800'
                        }`}>
                          {enquiry.status === 'New' && '🟢 New'}
                          {enquiry.status === 'Contacted' && '✅ Contacted'}
                          {enquiry.status === 'Follow-up' && '📞 Follow-up'}
                          {enquiry.status === 'Closed' && '🔒 Closed'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => setSelectedEnquiry(enquiry)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={() => handleUpdateStatus(enquiry, enquiry.status === 'New' ? 'Contacted' : 'New')}
                            className={`p-1.5 rounded-lg transition cursor-pointer ${
                              enquiry.status === 'New'
                                ? 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'
                                : 'text-emerald-600 hover:text-slate-400 hover:bg-slate-100'
                            }`}
                            title={enquiry.status === 'New' ? "Mark as Contacted" : "Mark as New"}
                          >
                            <Check className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleDeleteEnquiry(enquiry.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                            title="Delete Enquiry"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* DETAILED SIDE PANEL (Enquiry view modal) */}
      <AnimatePresence>
        {selectedEnquiry && (
          <div className="fixed inset-0 z-50 flex justify-end">
            {/* Overlay background */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedEnquiry(null)}
              className="absolute inset-0 bg-slate-950"
            />

            {/* Panel sheet */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 220 }}
              className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between z-10 border-l border-slate-200"
            >
              {/* Panel Header */}
              <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                <div>
                  <span className={`px-2 py-1 text-[9px] font-mono font-extrabold uppercase rounded-md tracking-wider ${
                    selectedEnquiry.status === 'New' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {selectedEnquiry.status}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-2 font-display leading-tight">Enquiry details</h3>
                </div>
                <button
                  onClick={() => setSelectedEnquiry(null)}
                  className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200/50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Panel Content (scrollable) */}
              <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                {/* Section: Applicant name */}
                <div className="flex items-start space-x-3.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center font-bold">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block font-mono uppercase tracking-wider font-bold">Full Name</span>
                    <span className="text-slate-900 font-extrabold text-base mt-0.5 block leading-tight">{selectedEnquiry.fullName}</span>
                  </div>
                </div>

                {/* Section: Contact info */}
                <div className="space-y-4 pt-2 border-t border-slate-100">
                  <div className="flex items-start space-x-3.5">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 block font-mono uppercase tracking-wider font-bold">Email Address</span>
                      <a href={`mailto:${selectedEnquiry.emailAddress}`} className="text-amber-600 hover:underline font-bold text-sm mt-0.5 block">{selectedEnquiry.emailAddress}</a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3.5">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 block font-mono uppercase tracking-wider font-bold">Phone Number</span>
                      <a href={`tel:${selectedEnquiry.mobileNumber}`} className="text-slate-800 hover:text-amber-600 font-bold font-mono text-sm mt-0.5 block">{selectedEnquiry.mobileNumber}</a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3.5">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 block font-mono uppercase tracking-wider font-bold">Origin Country</span>
                      <span className="text-slate-800 font-bold text-sm mt-0.5 block">{selectedEnquiry.country}</span>
                    </div>
                  </div>
                </div>

                {/* Section: Program */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <div className="flex items-start space-x-3.5">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 block font-mono uppercase tracking-wider font-bold">Interested Course / Program</span>
                      <span className="text-slate-800 font-extrabold text-sm mt-0.5 block leading-tight">{selectedEnquiry.interestedProgram}</span>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3.5">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 block font-mono uppercase tracking-wider font-bold">Received Date</span>
                      <span className="text-slate-800 font-semibold text-sm mt-0.5 block">{formatDate(selectedEnquiry.createdAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Section: Message body */}
                <div className="space-y-2 pt-4 border-t border-slate-100">
                  <span className="text-xs text-slate-400 block font-mono uppercase tracking-wider font-bold flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-slate-400" />
                    <span>Student's Message</span>
                  </span>
                  <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4.5 text-sm text-slate-700 leading-relaxed font-medium whitespace-pre-wrap">
                    {selectedEnquiry.message}
                  </div>
                </div>
              </div>

              {/* Panel Footer Actions */}
              <div className="p-6 border-t border-slate-200 bg-slate-50 flex flex-col gap-4">
                <div>
                  <span className="text-[10px] font-mono tracking-wider font-extrabold text-slate-400 uppercase block mb-2">Change Enquiry Status</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(['New', 'Contacted', 'Follow-up', 'Closed'] as const).map((status) => (
                      <button
                        key={status}
                        onClick={() => handleUpdateStatus(selectedEnquiry, status)}
                        className={`py-2.5 px-1 text-xs font-bold rounded-xl border transition-all duration-200 cursor-pointer text-center ${
                          selectedEnquiry.status === status
                            ? status === 'New'
                              ? 'bg-amber-500 border-amber-600 text-white shadow-sm shadow-amber-500/10'
                              : status === 'Contacted'
                              ? 'bg-emerald-500 border-emerald-600 text-white shadow-sm shadow-emerald-500/10'
                              : status === 'Follow-up'
                              ? 'bg-blue-500 border-blue-600 text-white shadow-sm shadow-blue-500/10'
                              : 'bg-slate-600 border-slate-700 text-white shadow-sm shadow-slate-500/10'
                            : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleDeleteEnquiry(selectedEnquiry.id)}
                    className="w-full bg-rose-50 hover:bg-rose-100 border border-rose-200/60 text-rose-600 font-extrabold text-xs uppercase tracking-wider py-3.5 px-4 rounded-xl transition flex items-center justify-center space-x-1.5 cursor-pointer"
                    title="Delete lead"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Enquiry</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PROFESSIONAL DELETE CONFIRMATION DIALOG */}
      <AnimatePresence>
        {enquiryToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100 p-6 md:p-8 text-center flex flex-col items-center justify-center z-50 text-slate-900"
            >
              {/* Alert Triangle Icon */}
              <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-200 text-rose-500 flex items-center justify-center mb-5 shadow-sm">
                <AlertTriangle className="w-8 h-8" />
              </div>

              <h4 className="text-xl font-display font-extrabold text-slate-900 leading-tight">
                Delete Enquiry?
              </h4>

              <p className="text-slate-500 text-sm mt-3.5 leading-relaxed font-medium">
                Are you sure you want to permanently delete this enquiry?
              </p>

              {enquiryToDelete && (
                <div className="w-full mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-left text-xs space-y-1.5 font-sans">
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">Name:</span>
                    <span className="text-slate-700 font-bold">{enquiryToDelete.fullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">Email:</span>
                    <span className="text-slate-700 font-bold">{enquiryToDelete.emailAddress}</span>
                  </div>
                  {enquiryToDelete.interestedProgram && (
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-medium">Program:</span>
                      <span className="text-slate-700 font-bold max-w-[200px] truncate">{enquiryToDelete.interestedProgram}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-3 w-full mt-7">
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => setEnquiryToDelete(null)}
                  className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-3 px-4 rounded-xl transition-all text-xs uppercase tracking-wider cursor-pointer active:scale-95 shadow-sm disabled:opacity-55"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={handleConfirmDelete}
                  className="flex-1 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-400 text-white font-bold py-3 px-4 rounded-xl transition-all text-xs uppercase tracking-wider cursor-pointer active:scale-95 shadow-sm flex items-center justify-center gap-2"
                >
                  {isDeleting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      <span>Delete Permanently</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
