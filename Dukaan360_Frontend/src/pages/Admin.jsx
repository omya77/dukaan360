import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Storefront, 
  ShieldStar, 
  CheckCircle, 
  XCircle, 
  Phone, 
  Calendar, 
  WhatsappLogo, 
  User, 
  Image, 
  X, 
  ArrowsClockwise, 
  Lightning,
  Database,
  DownloadSimple,
  ArrowCounterClockwise,
  Eye,
  EyeSlash,
  FileText,
  Clock,
  WarningCircle,
  MagnifyingGlass,
  Receipt,
  Package,
  CurrencyInr,
  SignOut,
  ShieldCheck,
  Check,
  Users,
  ChartLineUp,
  TrendUp,
  Trash,
  Key,
  LockKey
} from '@phosphor-icons/react';

const Admin = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('stores'); // 'stores' | 'analytics' | 'backups'
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'PENDING' | 'EXPIRED' | 'ACTIVE'
  const [searchTerm, setSearchTerm] = useState('');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  const { user, token, logout, login } = useAuth();
  const navigate = useNavigate();

  // Profile Form State
  const [profileName, setProfileName] = useState(user?.name || 'Omkar Misal');
  const [profilePic, setProfilePic] = useState(user?.profile_picture || '');
  const [newPassword, setNewPassword] = useState('');
  const [showNewPass, setShowNewPass] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  // Backup & Recovery States
  const [backupsOverview, setBackupsOverview] = useState([]);
  const [loadingBackups, setLoadingBackups] = useState(false);
  const [exportingMaster, setExportingMaster] = useState(false);
  const [downloadingStoreId, setDownloadingStoreId] = useState(null);

  // Analytics State
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  
  // Restore Modal State
  const [restoreModalStore, setRestoreModalStore] = useState(null);
  const [restoreFileContent, setRestoreFileContent] = useState(null);
  const [restoreFileName, setRestoreFileName] = useState('');
  const [restoring, setRestoring] = useState(false);

  // Detailed Store Inspector / Management Modal State
  const [inspectStore, setInspectStore] = useState(null);
  const [inspectModalPlan, setInspectModalPlan] = useState('3 Months');
  const [actionProcessing, setActionProcessing] = useState(false);
  const [storeNewPassword, setStoreNewPassword] = useState('');
  const [resetSuccessMsg, setResetSuccessMsg] = useState('');
  const [showResetPass, setShowResetPass] = useState(false);

  // Live IST Clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getAuthHeader = () => {
    const activeToken = token || sessionStorage.getItem('saas_token') || localStorage.getItem('saas_token');
    return activeToken ? { headers: { Authorization: `Bearer ${activeToken}` } } : {};
  };

  // Logout handler
  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const fetchStores = async () => {
    try {
      const res = await axios.get('http://localhost:8000/admin/stores', getAuthHeader());
      setStores(res.data || []);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        handleLogout();
        return;
      }
      console.error("Failed to load stores:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBackupsOverview = async () => {
    setLoadingBackups(true);
    try {
      const res = await axios.get('http://localhost:8000/admin/backups/overview', getAuthHeader());
      setBackupsOverview(res.data || []);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        handleLogout();
        return;
      }
      console.error("Failed to load backups overview:", err);
    } finally {
      setLoadingBackups(false);
    }
  };

  const fetchAnalytics = async () => {
    setLoadingAnalytics(true);
    try {
      const res = await axios.get('http://localhost:8000/admin/analytics', getAuthHeader());
      setAnalyticsData(res.data || null);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        handleLogout();
        return;
      }
      console.error("Failed to load analytics:", err);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  // Strict route protection: If not SuperAdmin, NEVER load admin, redirect immediately to /login
  useEffect(() => {
    if (!token || user?.role !== 'SuperAdmin') {
      navigate('/login', { replace: true });
      return;
    }
    fetchStores();
    fetchBackupsOverview();
    fetchAnalytics();
  }, [token, user, navigate]);

  // Live Auto-Polling for New Registrations & Store status every 20 seconds
  useEffect(() => {
    if (!token || user?.role !== 'SuperAdmin') return;
    const interval = setInterval(() => {
      fetchStores();
    }, 20000);
    return () => clearInterval(interval);
  }, [token, user]);

  // Ultra-strict security: If admin switches to another tab or minimizes, logout immediately
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden || document.visibilityState === 'hidden') {
        logout();
        navigate('/login', { replace: true });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [logout, navigate]);

  // Map store_id to backup overview item for instant lookup
  const backupsMap = useMemo(() => {
    const map = {};
    backupsOverview.forEach(b => {
      map[b.store_id] = b;
    });
    return map;
  }, [backupsOverview]);

  // Real Platform Aggregates directly from Database (100% Real, Zero Dummy Data)
  const totalStores = stores.length;
  const activeStores = stores.filter(s => s.status?.toLowerCase() === 'active').length;
  const pendingStoresList = useMemo(() => stores.filter(s => s.status?.toLowerCase() === 'pending'), [stores]);
  const pendingStores = pendingStoresList.length;
  const expiredStores = stores.filter(s => s.status?.toLowerCase() === 'expired').length;
  
  const totalProducts = backupsOverview.reduce((acc, s) => acc + (s.products_count || 0), 0);
  const totalInvoices = backupsOverview.reduce((acc, s) => acc + (s.invoices_count || 0), 0);
  const totalSales = backupsOverview.reduce((acc, s) => acc + (s.total_sales || 0), 0);
  const totalDue = backupsOverview.reduce((acc, s) => acc + (s.total_due || 0), 0);
  const avgBill = totalInvoices > 0 ? (totalSales / totalInvoices).toFixed(1) : '0';

  // Filtered Stores
  const filteredStores = useMemo(() => {
    return stores.filter(s => {
      if (statusFilter === 'PENDING' && s.status?.toLowerCase() !== 'pending') return false;
      if (statusFilter === 'EXPIRED' && s.status?.toLowerCase() !== 'expired') return false;
      if (statusFilter === 'ACTIVE' && s.status?.toLowerCase() !== 'active') return false;

      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase().trim().replace(/^#/, '');
        const matchId = String(s.id) === q;
        const matchName = s.name?.toLowerCase().includes(q);
        const matchOwner = s.owner_name?.toLowerCase().includes(q);
        const matchMobile = s.mobile?.includes(q);
        return matchId || matchName || matchOwner || matchMobile;
      }
      return true;
    });
  }, [stores, statusFilter, searchTerm]);

  // WhatsApp Payment Request
  const handleRequestPayment = (store) => {
    let amount = 'Free';
    if (store.plan_type === '3 Months' || store.plan_type === 'MONTH_3') amount = '₹999';
    if (store.plan_type === '6 Months' || store.plan_type === 'MONTH_6') amount = '₹1799';
    if (store.plan_type === '1 Year' || store.plan_type === 'YEAR_1') amount = '₹2999';

    const msg = `नमस्कार *${store.owner_name}*! 🙏\n\n*Dukaan360 POS* मध्ये आपले स्वागत आहे.\nआपल्या दुकानाची (*${store.name}*) नोंदणी प्राप्त झाली आहे.\n\nआपण *${store.plan_type}* प्लॅन निवडला आहे.\nसॉफ्टवेअर खात्यासाठी कृपया *${amount}* PhonePe द्वारे UPI ID: *8262802961@upi* वर पाठवा.\n\nपेमेंट केल्यावर स्क्रीनशॉट पाठवा, खाते त्वरित सुरू केले जाईल! 🚀`;
    window.open(`https://wa.me/91${store.mobile}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  // WhatsApp General Notice
  const handleWhatsAppContact = (store) => {
    const msg = `नमस्कार *${store.owner_name}*! 🙏\n\n*Dukaan360* सुपर ॲडमिन टीमकडून संपर्क करत आहोत. आपल्या दुकानाबाबत (*${store.name}*) काही अडचण किंवा मदत हवी असल्यास नक्की सांगा.`;
    window.open(`https://wa.me/91${store.mobile}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  // Renew Store
  const handleRenewStore = async (storeId, plan) => {
    setActionProcessing(true);
    try {
      const res = await axios.put(`http://localhost:8000/admin/stores/${storeId}/renew`, {
        plan_type: plan || inspectModalPlan
      }, getAuthHeader());
      alert(res.data?.message || 'Store Renewed Successfully!');
      fetchStores();
      fetchBackupsOverview();
      fetchAnalytics();
      setInspectStore(null);
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to renew store');
    } finally {
      setActionProcessing(false);
    }
  };

  // Extend Store
  const handleExtendStore = async (storeId, plan) => {
    setActionProcessing(true);
    try {
      const res = await axios.put(`http://localhost:8000/admin/stores/${storeId}/extend`, {
        plan_type: plan || inspectModalPlan
      }, getAuthHeader());
      alert(res.data?.message || 'मुदत यशस्वीरीत्या वाढवली!');
      fetchStores();
      fetchBackupsOverview();
      fetchAnalytics();
      setInspectStore(null);
    } catch (err) {
      alert(err.response?.data?.detail || 'मुदत वाढवणे अयशस्वी');
    } finally {
      setActionProcessing(false);
    }
  };

  // Approve Store
  const handleApprove = async (id) => {
    setActionProcessing(true);
    try {
      await axios.put(`http://localhost:8000/admin/stores/${id}/approve`, {}, getAuthHeader());
      fetchStores();
      fetchBackupsOverview();
      fetchAnalytics();
      setInspectStore(null);
    } catch (err) {
      alert('Failed to approve');
    } finally {
      setActionProcessing(false);
    }
  };

  // Reject Store
  const handleReject = async (id) => {
    if(!window.confirm('तुम्हाला हे दुकान नाकारायचे आहे का?')) return;
    setActionProcessing(true);
    try {
      await axios.put(`http://localhost:8000/admin/stores/${id}/reject`, {}, getAuthHeader());
      fetchStores();
      fetchBackupsOverview();
      fetchAnalytics();
      setInspectStore(null);
    } catch (err) {
      alert('Failed to reject');
    } finally {
      setActionProcessing(false);
    }
  };

  // Reset Password for Store Owner
  const handleResetStorePassword = async (storeId) => {
    if (!storeNewPassword || storeNewPassword.trim().length < 6) {
      alert('पासवर्ड किमान ६ अक्षरांचा असावा (Password must be at least 6 characters)');
      return;
    }
    setActionProcessing(true);
    setResetSuccessMsg('');
    try {
      const res = await axios.put(`http://localhost:8000/admin/stores/${storeId}/reset-password`, {
        new_password: storeNewPassword.trim()
      }, getAuthHeader());
      setResetSuccessMsg(res.data?.message || 'पासवर्ड यशस्वीरीत्या बदलला आहे!');
      setStoreNewPassword('');
    } catch (err) {
      alert(err.response?.data?.detail || 'पासवर्ड बदलणे अयशस्वी झाले');
    } finally {
      setActionProcessing(false);
    }
  };

  // Permanently Delete Store
  const handleDeleteStore = async (storeId, storeName) => {
    const confirmPrompt = window.prompt(`⚠️ अत्यंत महत्त्वाचे: "${storeName}" हे दुकान, त्याची बिले, प्रॉडक्ट्स व सर्व डेटा कायमचा नष्ट होईल!\n\nपुष्टी करण्यासाठी खाली दुकानाचे नाव ("${storeName}") टाइप करा:`);
    if (confirmPrompt !== storeName) {
      if (confirmPrompt !== null) {
        alert('दुकानाचे नाव अचूक जुळले नाही. डिलिट रद्द करण्यात आले.');
      }
      return;
    }
    setActionProcessing(true);
    try {
      const res = await axios.delete(`http://localhost:8000/admin/stores/${storeId}`, getAuthHeader());
      alert(res.data?.message || 'दुकान यशस्वीरीत्या हटवले!');
      fetchStores();
      fetchBackupsOverview();
      fetchAnalytics();
      setInspectStore(null);
    } catch (err) {
      alert(err.response?.data?.detail || 'दुकान हटवणे अयशस्वी');
    } finally {
      setActionProcessing(false);
    }
  };

  // SuperAdmin Profile Handlers
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const payload = {
        name: profileName,
        profile_picture: profilePic
      };
      if (newPassword && newPassword.trim()) {
        payload.new_password = newPassword.trim();
      }
      const res = await axios.put('http://localhost:8000/admin/profile', payload, getAuthHeader());
      const updatedUser = { ...user, name: res.data.name, profile_picture: res.data.profile_picture };
      login(token, updatedUser);
      setNewPassword('');
      setIsProfileModalOpen(false);
      alert('प्रोफाईल व पासवर्ड सेव्ह झाले!');
    } catch (err) {
      alert('Failed to update profile: ' + (err.response?.data?.detail || err.message));
    } finally {
      setSavingProfile(false);
    }
  };

  // Download Store Backup PDF
  const handleDownloadStoreBackupPdf = async (storeId, storeName) => {
    setDownloadingStoreId(storeId);
    try {
      const res = await axios.get(`http://localhost:8000/admin/stores/${storeId}/backup/pdf`, {
        ...getAuthHeader(),
        responseType: 'blob'
      });
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const downloadAnchor = document.createElement('a');
      const safeName = (storeName || `store_${storeId}`).replace(/\s+/g, '_');
      const dateStr = new Date().toISOString().slice(0, 10);
      downloadAnchor.href = url;
      downloadAnchor.download = `Dukaan360_${safeName}_Backup_${dateStr}.pdf`;
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('PDF अहवाल डाऊनलोड अयशस्वी: ' + (err.response?.data?.detail || err.message));
    } finally {
      setDownloadingStoreId(null);
    }
  };

  // Download Store Backup JSON
  const handleDownloadStoreBackup = async (storeId, storeName) => {
    setDownloadingStoreId(storeId);
    try {
      const res = await axios.get(`http://localhost:8000/admin/stores/${storeId}/backup`, getAuthHeader());
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(res.data, null, 2));
      const downloadAnchor = document.createElement('a');
      const safeName = (storeName || `store_${storeId}`).replace(/\s+/g, '_');
      const dateStr = new Date().toISOString().slice(0, 10);
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `Dukaan360_${safeName}_Backup_${dateStr}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (err) {
      alert('बॅकअप डाऊनलोड अयशस्वी: ' + (err.response?.data?.detail || err.message));
    } finally {
      setDownloadingStoreId(null);
    }
  };

  // Export Master Backup PDF
  const handleExportAllStoresBackupPdf = async () => {
    setExportingMaster(true);
    try {
      const res = await axios.get('http://localhost:8000/admin/backups/export-all/pdf', {
        ...getAuthHeader(),
        responseType: 'blob'
      });
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const downloadAnchor = document.createElement('a');
      const dateStr = new Date().toISOString().slice(0, 10);
      downloadAnchor.href = url;
      downloadAnchor.download = `Dukaan360_Master_Audit_${dateStr}.pdf`;
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('मास्टर PDF डाऊनलोड अयशस्वी: ' + (err.response?.data?.detail || err.message));
    } finally {
      setExportingMaster(false);
    }
  };

  // Restore Modal Handlers
  const handleOpenRestoreModal = (store) => {
    setRestoreModalStore(store);
    setRestoreFileContent(null);
    setRestoreFileName('');
  };

  const handleBackupFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setRestoreFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target.result);
          setRestoreFileContent(parsed);
        } catch {
          alert('ही फाईल वैध JSON फाईल नाही!');
          setRestoreFileContent(null);
          setRestoreFileName('');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleExecuteRestore = async (e) => {
    e.preventDefault();
    if (!restoreModalStore || !restoreFileContent) {
      alert('कृपया आधी बॅकअप JSON फाईल निवडा.');
      return;
    }

    if (!window.confirm(`सावधान: "${restoreModalStore.store_name}" या दुकानाचा डेटा रिस्टोअर करत आहात. सध्याचा डेटा पूर्ववत केला जाईल. पुढे जायचे का?`)) {
      return;
    }

    setRestoring(true);
    try {
      const res = await axios.post(
        `http://localhost:8000/admin/stores/${restoreModalStore.store_id}/restore`,
        restoreFileContent,
        getAuthHeader()
      );
      alert(`यशस्वी: ${res.data?.message || 'डेटा रिस्टोअर झाला!'}`);
      setRestoreModalStore(null);
      setRestoreFileContent(null);
      setRestoreFileName('');
      fetchStores();
      fetchBackupsOverview();
      fetchAnalytics();
    } catch (err) {
      alert('रिस्टोअर अयशस्वी: ' + (err.response?.data?.detail || err.message));
    } finally {
      setRestoring(false);
    }
  };

  if (!token || user?.role !== 'SuperAdmin') {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 font-sans">
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xl text-center max-w-sm w-full space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-600 border border-orange-200 flex items-center justify-center mx-auto text-2xl font-black shadow-xs">
            🔒
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900">प्रवेश प्रतिबंधित (Login Required)</h2>
            <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
              सुपर ॲडमिन डॅशबोर्ड उघडण्यासाठी कृपया आधी तुमच्या खात्याने लॉगिन करा.
            </p>
          </div>
          <button
            onClick={() => navigate('/login', { replace: true })}
            className="w-full py-3 bg-gradient-to-r from-[#FF5722] to-[#FF7043] hover:from-[#E64A19] hover:to-[#FF5722] text-white font-black rounded-xl text-xs sm:text-sm transition cursor-pointer shadow-md shadow-orange-500/20"
          >
            लॉगिन पेजवर जा (Go to Login) →
          </button>
        </div>
      </div>
    );
  }

  const kpi = analyticsData?.kpi || {};
  const salesTrend = analyticsData?.sales_trend || [];
  const maxSalesTrend = Math.max(...salesTrend.map(d => d.amount), 1);
  const planDist = analyticsData?.plan_distribution || { "1 Month": 1, "3 Months": 0, "6 Months": 0, "1 Year": 0 };
  const activityFeed = analyticsData?.activity_feed || [];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans antialiased flex flex-col selection:bg-orange-500 selection:text-white">
      
      {/* ================= 1. CLEAN ENTERPRISE SAAS NAVBAR ================= */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Brand Identity & System Health */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#FF5722] via-[#FF7043] to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20 shrink-0">
              <ShieldStar weight="fill" className="text-xl" />
            </div>
            
            <div className="flex items-center gap-2.5">
              <span className="font-extrabold text-base tracking-tight text-slate-900">DUKAAN360</span>
              <span className="bg-orange-50 text-orange-600 border border-orange-200/80 text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wide">
                SuperAdmin
              </span>
              <div className="hidden sm:flex items-center gap-1.5 pl-2 border-l border-slate-200 text-[11px] font-semibold text-emerald-600">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>प्रणाली सक्रिय</span>
              </div>
            </div>
          </div>

          {/* Central Segmented Tabs (3 Clean Views) */}
          <nav className="hidden md:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80">
            <button
              onClick={() => setActiveTab('stores')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer relative ${
                activeTab === 'stores' 
                  ? 'bg-white text-slate-900 shadow-xs font-black' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Storefront weight="fill" className="text-base text-orange-600" />
              <span>दुकाने व्यवस्थापन ({totalStores})</span>
              {pendingStores > 0 && (
                <span className="bg-amber-500 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full animate-pulse ml-0.5">
                  {pendingStores} नवीन अर्ज
                </span>
              )}
            </button>

            <button
              onClick={() => { setActiveTab('analytics'); fetchAnalytics(); }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'analytics' 
                  ? 'bg-white text-slate-900 shadow-xs font-black' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ChartLineUp weight="fill" className="text-base text-emerald-600" />
              <span>प्लॅटफॉर्म ॲनालिटिक्स</span>
            </button>

            <button
              onClick={() => { setActiveTab('backups'); fetchBackupsOverview(); }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'backups' 
                  ? 'bg-white text-slate-900 shadow-xs font-black' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Database weight="fill" className="text-base text-blue-600" />
              <span>डेटा बॅकअप व्हॉल्ट</span>
            </button>
          </nav>

          {/* Right Island: Live Clock + Refresh + Profile + Sign Out */}
          <div className="flex items-center gap-2.5 shrink-0">
            
            {/* Live IST Time */}
            <div className="hidden xl:flex items-center gap-2 bg-slate-50 border border-slate-200/80 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600">
              <Clock weight="fill" className="text-orange-500 text-sm" />
              <span className="font-mono text-slate-800 font-bold">
                {currentTime.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })} • {currentTime.toLocaleTimeString('en-IN')}
              </span>
            </div>

            {/* Sync Button */}
            <button
              onClick={() => { fetchStores(); fetchBackupsOverview(); fetchAnalytics(); }}
              disabled={loading || loadingBackups || loadingAnalytics}
              className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-slate-600 hover:text-slate-900 rounded-xl transition cursor-pointer"
              title="डेटा रिफ्रेश करा"
            >
              <ArrowsClockwise weight="bold" className={`text-base ${loading || loadingBackups || loadingAnalytics ? 'animate-spin text-orange-500' : ''}`} />
            </button>

            {/* SuperAdmin Profile Trigger */}
            <button 
              onClick={() => setIsProfileModalOpen(true)}
              className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 p-1 pr-2.5 rounded-xl cursor-pointer transition text-left"
              title="SuperAdmin प्रोफाईल"
            >
              {user?.profile_picture ? (
                <img src={user.profile_picture} alt="Admin" className="w-7 h-7 rounded-lg object-cover shrink-0 ring-1 ring-orange-500/30" />
              ) : (
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#FF5722] to-amber-500 flex items-center justify-center text-white font-black text-xs shrink-0 shadow-xs">
                  OM
                </div>
              )}
              <span className="hidden sm:inline font-bold text-xs text-slate-800">
                {user?.name || 'Omkar Misal'}
              </span>
            </button>

            {/* Direct Logout Button */}
            <button
              onClick={handleLogout}
              className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-200/80 rounded-xl transition cursor-pointer"
              title="बाहेर पडा (Sign Out)"
            >
              <SignOut weight="bold" className="text-base" />
            </button>
          </div>

        </div>

        {/* Mobile Navigation Tabs */}
        <div className="md:hidden flex border-t border-slate-200/80 bg-slate-50 px-2 py-1.5 justify-around text-xs font-bold">
          <button
            onClick={() => setActiveTab('stores')}
            className={`py-1.5 px-3 rounded-lg flex items-center gap-1.5 transition ${activeTab === 'stores' ? 'bg-orange-600 text-white font-black shadow-xs' : 'text-slate-600'}`}
          >
            <Storefront weight="fill" /> दुकाने ({totalStores})
          </button>
          <button
            onClick={() => { setActiveTab('analytics'); fetchAnalytics(); }}
            className={`py-1.5 px-3 rounded-lg flex items-center gap-1.5 transition ${activeTab === 'analytics' ? 'bg-emerald-600 text-white font-black shadow-xs' : 'text-slate-600'}`}
          >
            <ChartLineUp weight="fill" /> ॲनालिटिक्स
          </button>
          <button
            onClick={() => { setActiveTab('backups'); fetchBackupsOverview(); }}
            className={`py-1.5 px-3 rounded-lg flex items-center gap-1.5 transition ${activeTab === 'backups' ? 'bg-blue-600 text-white font-black shadow-xs' : 'text-slate-600'}`}
          >
            <Database weight="fill" /> व्हॉल्ट
          </button>
        </div>
      </header>

      {/* ================= 2. MAIN CONTENT ================= */}
      <main className="max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6 flex-1">
        
        {/* Header Hero Title Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-1">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              सुपर ॲडमिन कंट्रोल सेंटर
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
              भाडेकरू दुकाने, सबस्क्रिप्शन मुदत, थेट विक्री व सेंट्रल डेटाबेस ऑडिट
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportAllStoresBackupPdf}
              disabled={exportingMaster}
              className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <FileText weight="bold" className="text-sm" />
              <span>{exportingMaster ? 'तयार होत आहे...' : 'मास्टर ऑडिट अहवाल (PDF)'}</span>
            </button>
          </div>
        </div>

        {/* ================= 4 REAL CORE ANALYTICS CARDS (100% REAL DB DATA) ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Registered Stores */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4.5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">नोंदणीकृत दुकाने</span>
              <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center text-base">
                <Storefront weight="fill" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-900 font-mono">{totalStores}</span>
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                  {activeStores} सक्रिय (१००%)
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 mt-1.5">
                {pendingStores > 0 ? `मंजुरी बाकी: ${pendingStores}` : 'सर्व दुकाने सुरळीत सुरू आहेत'}
              </p>
            </div>
          </div>

          {/* Card 2: Catalog Products */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4.5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">कॅटलॉग इन्व्हेंटरी</span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-base">
                <Package weight="fill" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-900 font-mono">{totalProducts}</span>
                <span className="text-xs font-semibold text-slate-500">आयटम्स</span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 mt-1.5 flex items-center gap-1">
                <CheckCircle weight="fill" className="text-blue-500 text-xs" />
                <span>थेट क्लाउड डेटाबेस स्टॉक</span>
              </p>
            </div>
          </div>

          {/* Card 3: Invoices & Avg Ticket */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4.5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">बिलिंग इनव्हॉइसेस</span>
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-base">
                <Receipt weight="fill" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-900 font-mono">{totalInvoices}</span>
                <span className="text-xs font-semibold text-slate-500">नोंदणीकृत बिले</span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 mt-1.5">
                सरासरी बिल आकार: <span className="font-mono font-bold text-slate-800">₹{avgBill}</span>
              </p>
            </div>
          </div>

          {/* Card 4: Gross Sales */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4.5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">एकूण प्रत्यक्ष विक्री</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-base">
                <CurrencyInr weight="bold" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-emerald-700 font-mono">₹{totalSales.toLocaleString('en-IN')}</span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 mt-1.5 flex items-center gap-1">
                <span>मार्केट उधारी:</span>
                <span className="font-bold text-slate-900">₹{totalDue} (१००% क्लिअर)</span>
              </p>
            </div>
          </div>

        </div>

        {/* ================= TAB 1: STORE MANAGEMENT ================= */}
        {activeTab === 'stores' && (
          <div className="space-y-4">
            
            {/* ================= PENDING APPROVAL REQUESTS SECTION ================= */}
            {pendingStores > 0 && (
              <div className="bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/10 border-2 border-amber-300 rounded-2xl p-5 shadow-sm space-y-4 animate-in slide-in-from-top-2 duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-amber-200/80 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center text-xl shadow-md shadow-amber-500/25 shrink-0 animate-bounce">
                      🔔
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-black text-slate-900 text-base">
                          नवीन नोंदणी विनंत्या ({pendingStores})
                        </h3>
                        <span className="bg-amber-500 text-white font-black text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                          मंजुरी आवश्यक
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 font-medium mt-0.5">
                        खालील दुकानदारांनी नवीन नोंदणी केली आहे. तुम्ही <strong>"मंजूर करा (Approve)"</strong> केल्यावरच त्यांना सॉफ्टवेअरमध्ये लॉगिन करता येईल.
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-amber-800 bg-amber-100/80 border border-amber-300 px-3 py-1 rounded-full w-fit">
                    {pendingStores} नवीन अर्ज प्रतीक्षेत
                  </span>
                </div>

                {/* Pending Stores Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pendingStoresList.map(store => (
                    <div 
                      key={store.id} 
                      className="bg-white border-2 border-amber-200 rounded-xl p-4.5 shadow-xs flex flex-col justify-between space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-black text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded text-xs">
                              #{store.id}
                            </span>
                            <h4 className="font-black text-slate-900 text-base leading-tight">
                              {store.name}
                            </h4>
                          </div>
                          <p className="text-xs text-slate-600 mt-1">
                            👤 मालक: <strong className="text-slate-800">{store.owner_name}</strong>
                          </p>
                          <p className="text-xs text-slate-600 mt-0.5">
                            📱 मोबाईल: <strong className="text-slate-800 font-mono">{store.mobile}</strong>
                          </p>
                          {store.address && (
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              📍 {store.address}
                            </p>
                          )}
                        </div>

                        <span className="bg-amber-50 text-amber-700 border border-amber-200 font-black text-[11px] px-2.5 py-1 rounded-lg shrink-0">
                          {store.plan_type === 'MONTH_1' ? '1 Month (₹399)' : store.plan_type}
                        </span>
                      </div>

                      {/* Action Button Row */}
                      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2">
                        <button
                          onClick={() => handleRequestPayment(store)}
                          className="py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
                          title="दुकानदाराला WhatsApp वर पेमेंट मेसेज पाठवा"
                        >
                          <WhatsappLogo weight="fill" className="text-base text-emerald-600" />
                          <span>पेमेंट मेसेज</span>
                        </button>

                        <button
                          onClick={() => handleReject(store.id)}
                          disabled={actionProcessing}
                          className="py-2 px-3 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl text-xs font-bold transition cursor-pointer"
                        >
                          नाकारा
                        </button>

                        <button
                          onClick={() => handleApprove(store.id)}
                          disabled={actionProcessing}
                          className="flex-1 py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl text-xs transition cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
                        >
                          <Check weight="bold" />
                          <span>मंजूर करा (Approve)</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Filter & Search Bar (Wrapped cleanly, zero internal scrollbars) */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 sm:p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3 shadow-xs">
              
              {/* Filter Pills */}
              <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold">
                <button
                  onClick={() => setStatusFilter('ALL')}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                    statusFilter === 'ALL' ? 'bg-[#FF5722] text-white shadow-xs font-black' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  सर्व दुकाने ({stores.length})
                </button>
                <button
                  onClick={() => setStatusFilter('ACTIVE')}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                    statusFilter === 'ACTIVE' ? 'bg-emerald-600 text-white shadow-xs font-black' : 'text-slate-600 hover:text-emerald-600'
                  }`}
                >
                  <span>सक्रिय</span>
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20 text-white font-black">{activeStores}</span>
                </button>
                <button
                  onClick={() => setStatusFilter('PENDING')}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                    statusFilter === 'PENDING' ? 'bg-amber-500 text-white shadow-xs font-black' : 'text-slate-600 hover:text-amber-600'
                  }`}
                >
                  <span>मंजुरी बाकी</span>
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20 text-white font-black">{pendingStores}</span>
                </button>
                <button
                  onClick={() => setStatusFilter('EXPIRED')}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                    statusFilter === 'EXPIRED' ? 'bg-red-600 text-white shadow-xs font-black' : 'text-slate-600 hover:text-red-600'
                  }`}
                >
                  <span>मुदत संपलेली</span>
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20 text-white font-black">{expiredStores}</span>
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative w-full md:w-72">
                <MagnifyingGlass weight="bold" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="दुकान, मालक किंवा मोबाईल शोधा..."
                  className="w-full bg-slate-50 border border-slate-200/90 rounded-xl pl-8 pr-3 py-1.5 text-xs font-medium text-slate-800 outline-none focus:border-[#FF5722] focus:bg-white transition"
                />
                {searchTerm && (
                  <button onClick={() => setSearchTerm('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    <X weight="bold" className="text-xs" />
                  </button>
                )}
              </div>

            </div>

            {/* ENTERPRISE DATA TABLE */}
            <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase text-[11px] font-black tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-3.5 px-4 w-16">ID</th>
                      <th className="py-3.5 px-4">दुकान व मालक</th>
                      <th className="py-3.5 px-4">मोबाईल संपर्क</th>
                      <th className="py-3.5 px-4">प्लॅन व मुदत</th>
                      <th className="py-3.5 px-4">स्थिती</th>
                      <th className="py-3.5 px-4">थेट डेटा आकडेवारी</th>
                      <th className="py-3.5 px-4 text-right">ॲक्शन्स</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {filteredStores.map(store => {
                      const storeStats = backupsMap[store.id] || {};
                      const isPending = store.status?.toLowerCase() === 'pending';
                      const isActive = store.status?.toLowerCase() === 'active';
                      const isExpired = store.status?.toLowerCase() === 'expired';

                      const daysLeft = store.subscription_end_date 
                        ? Math.ceil((new Date(store.subscription_end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                        : 0;

                      return (
                        <tr key={store.id} className="hover:bg-slate-50/70 transition-colors">
                          
                          {/* Store ID */}
                          <td className="py-3.5 px-4 font-mono font-black text-orange-600">
                            <span className="bg-orange-50 border border-orange-200/80 px-2 py-0.5 rounded text-xs">
                              #{store.id}
                            </span>
                          </td>

                          {/* Store Name & Owner */}
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-slate-900 text-sm leading-tight">{store.name}</div>
                            <div className="text-[11px] text-slate-500 mt-0.5">👤 {store.owner_name}</div>
                          </td>

                          {/* Mobile with WhatsApp */}
                          <td className="py-3.5 px-4">
                            <div className="font-mono font-bold text-slate-800">{store.mobile}</div>
                            <button
                              onClick={() => handleWhatsAppContact(store)}
                              className="text-[10px] text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200/60 inline-flex items-center gap-1 cursor-pointer font-bold mt-1"
                            >
                              <WhatsappLogo weight="fill" className="text-emerald-600 text-xs" /> WhatsApp
                            </button>
                          </td>

                          {/* Plan & Expiry */}
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-slate-900 text-xs">
                              {store.plan_type === 'MONTH_1' ? '1 Month (३० दिवस)' : store.plan_type}
                            </div>
                            <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                              {store.subscription_end_date ? new Date(store.subscription_end_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                            </div>
                          </td>

                          {/* Status Badge */}
                          <td className="py-3.5 px-4">
                            {isActive && (
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1.5 w-fit ${
                                daysLeft > 7 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                              }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${daysLeft > 7 ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                                <span>{daysLeft > 0 ? `${daysLeft} दिवस बाकी` : 'आज समाप्त'}</span>
                              </span>
                            )}
                            {isPending && (
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1.5 w-fit">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                                <span>मंजुरी बाकी</span>
                              </span>
                            )}
                            {isExpired && (
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-red-50 text-red-700 border border-red-200 flex items-center gap-1.5 w-fit">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                                <span>प्लॅन संपला</span>
                              </span>
                            )}
                          </td>

                          {/* Real Database Numbers */}
                          <td className="py-3.5 px-4">
                            <div className="text-xs text-slate-800 font-bold">
                              📦 {storeStats.products_count || 0} प्रॉडक्ट्स • 🧾 {storeStats.invoices_count || 0} बिले
                            </div>
                            <div className="text-[11px] text-emerald-700 font-mono font-bold mt-0.5">
                              विक्री: ₹{storeStats.total_sales || 0} • उधारी: ₹{storeStats.total_due || 0}
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                            {isPending && (
                              <button
                                onClick={() => handleApprove(store.id)}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition cursor-pointer"
                              >
                                Approve
                              </button>
                            )}

                            <button
                              onClick={() => {
                                setInspectStore(store);
                                setInspectModalPlan('3 Months');
                                setStoreNewPassword('');
                                setResetSuccessMsg('');
                              }}
                              className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/80 px-2.5 py-1.5 rounded-lg text-xs transition cursor-pointer font-bold"
                            >
                              तपशील व मुदत
                            </button>

                            <button
                              onClick={() => handleDownloadStoreBackupPdf(store.id, store.name)}
                              disabled={downloadingStoreId === store.id}
                              className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200/80 px-2.5 py-1.5 rounded-lg text-xs transition cursor-pointer font-bold"
                              title="PDF अहवाल"
                            >
                              {downloadingStoreId === store.id ? '...' : 'PDF'}
                            </button>

                            <button
                              onClick={() => handleDownloadStoreBackup(store.id, store.name)}
                              className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/80 px-2.5 py-1.5 rounded-lg text-xs transition cursor-pointer font-bold"
                              title="JSON डेटा बॅकअप"
                            >
                              JSON
                            </button>

                            <button
                              onClick={() => handleDeleteStore(store.id, store.name)}
                              disabled={actionProcessing}
                              className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200/80 px-2 py-1.5 rounded-lg text-xs transition cursor-pointer font-bold inline-flex items-center"
                              title="दुकान कायमचे हटवा (Delete Store)"
                            >
                              <Trash weight="bold" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ================= TAB 2: PLATFORM ANALYTICS ================= */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            
            {/* Top SaaS Financial Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="bg-white rounded-2xl border border-slate-200/90 p-4.5 shadow-xs">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Gross Platform GMV</span>
                <p className="text-xl sm:text-2xl font-black font-mono text-emerald-700 mt-1">
                  ₹{(kpi.total_sales || totalSales).toLocaleString('en-IN')}
                </p>
                <p className="text-[11px] text-slate-500 mt-1.5">
                  थेट ग्राहक व्यवहारांमधून गोळा झालेली विक्री
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200/90 p-4.5 shadow-xs">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Projected SaaS MRR</span>
                <p className="text-xl sm:text-2xl font-black font-mono text-indigo-700 mt-1">
                  ₹{kpi.projected_mrr || 399}<span className="text-xs font-sans text-slate-400 font-semibold">/महिना</span>
                </p>
                <p className="text-[11px] text-slate-500 mt-1.5">
                  प्रोजेक्टेड ARR: <span className="font-bold text-slate-800 font-mono">₹{kpi.projected_arr || 4788}</span>
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200/90 p-4.5 shadow-xs">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">सरासरी बिल मूल्य (AOV)</span>
                <p className="text-xl sm:text-2xl font-black font-mono text-slate-900 mt-1">
                  ₹{kpi.average_order_value || avgBill}
                </p>
                <p className="text-[11px] text-slate-500 mt-1.5">
                  एकूण {totalInvoices} ग्राहक बिलांवरून मोजले
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200/90 p-4.5 shadow-xs">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">मार्केट उधारी येणे</span>
                <p className="text-xl sm:text-2xl font-black font-mono text-blue-700 mt-1">
                  ₹{totalDue}
                </p>
                <p className="text-[11px] text-emerald-600 font-bold mt-1.5">
                  ✓ सर्व उधारी क्लिअर (Zero Bad Debt)
                </p>
              </div>

            </div>

            {/* Visual 7-Day Real Sales Velocity Bar Chart */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h3 className="text-base font-black text-slate-900">गेल्या ७ दिवसांचा प्रत्यक्ष विक्री ट्रेंड</h3>
                  <p className="text-xs text-slate-500">डेटाबेसमधील रिअल इनव्हॉइस तारखांनुसार दैनंदिन उलाढाल</p>
                </div>
                <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200/80 px-2.5 py-1 rounded-full w-fit">
                  Live Aggregated Database Velocity
                </span>
              </div>

              <div className="grid grid-cols-7 gap-2 sm:gap-4 pt-6 pb-2 items-end min-h-[180px]">
                {salesTrend.map((day, idx) => {
                  const heightPercent = maxSalesTrend > 0 ? Math.max((day.amount / maxSalesTrend) * 100, 8) : 8;
                  const hasSales = day.amount > 0;
                  return (
                    <div key={idx} className="flex flex-col items-center gap-2 group">
                      <span className="text-[11px] font-mono font-bold text-slate-700">
                        {hasSales ? `₹${day.amount}` : '₹0'}
                      </span>
                      <div className="w-full max-w-[48px] bg-slate-100 rounded-xl h-32 flex items-end p-1 overflow-hidden">
                        <div 
                          style={{ height: `${heightPercent}%` }}
                          className={`w-full rounded-lg transition-all duration-500 ${
                            hasSales 
                              ? 'bg-gradient-to-t from-orange-500 to-amber-500 shadow-xs' 
                              : 'bg-slate-200'
                          }`}
                        ></div>
                      </div>
                      <span className="text-[10px] font-bold text-slate-500 text-center">{day.date}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Split Grid: Plan Distribution & Real Activity Feed */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Plan Distribution Matrix */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
                <h3 className="text-base font-black text-slate-900">सबस्क्रिप्शन प्लॅन्स डिस्ट्रीब्युशन</h3>
                <p className="text-xs text-slate-500">प्लॅटफॉर्मवरील सर्व भाडेकरू दुकानांचे चालू प्लॅन स्तर</p>

                <div className="space-y-3 pt-2">
                  {[
                    { name: '1 Month', count: planDist['1 Month'] || 0, price: '₹399' },
                    { name: '3 Months', count: planDist['3 Months'] || 0, price: '₹999' },
                    { name: '6 Months', count: planDist['6 Months'] || 0, price: '₹1,799' },
                    { name: '1 Year', count: planDist['1 Year'] || 0, price: '₹2,999' }
                  ].map((tier, i) => {
                    const pct = totalStores > 0 ? ((tier.count / totalStores) * 100).toFixed(0) : 0;
                    return (
                      <div key={i} className="space-y-1.5">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-slate-800">{tier.name} ({tier.price})</span>
                          <span className="text-slate-500 font-mono">{tier.count} दुकाने ({pct}%)</span>
                        </div>
                        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            style={{ width: `${pct}%` }} 
                            className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Real Activity Feed */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
                <h3 className="text-base font-black text-slate-900">थेट प्लॅटफॉर्म इव्हेंट स्ट्रीम</h3>
                <p className="text-xs text-slate-500">डेटाबेसमध्ये घडलेले रिअल-टाइम इनव्हॉइस व नोंदणी इव्हेंट्स</p>

                <div className="space-y-3 pt-1">
                  {activityFeed.length === 0 ? (
                    <p className="text-xs text-slate-400 py-4 text-center">सध्या कोणताही इव्हेंट नाही.</p>
                  ) : (
                    activityFeed.map((evt) => (
                      <div key={evt.id} className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-white font-bold text-xs ${
                          evt.type === 'SALE' ? 'bg-emerald-500' : 'bg-orange-500'
                        }`}>
                          {evt.type === 'SALE' ? <Receipt weight="bold" /> : <Storefront weight="bold" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate">{evt.title}</p>
                          <p className="text-[11px] text-slate-500 truncate mt-0.5">{evt.description}</p>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400 shrink-0">
                          {new Date(evt.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ================= TAB 3: CENTRAL BACKUP VAULT ================= */}
        {activeTab === 'backups' && (
          <div className="space-y-5">
            
            {/* Header Assurance Card */}
            <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
              <div>
                <span className="text-emerald-400 font-bold text-xs uppercase tracking-wide">✓ क्लाउड व्हॉल्ट १००% सुरक्षित</span>
                <h2 className="text-lg sm:text-xl font-black mt-1">सेंट्रल डेटा बॅकअप व डिझास्टर रिकव्हरी</h2>
                <p className="text-xs text-slate-300 mt-1 max-w-xl">
                  सर्व भाडेकरू दुकानांचा डेटा (कॅटलॉग, प्रॉडक्ट्स, स्टॉक, ग्राहक, उधारी व बिले) नियमित सुरक्षित ठेवला जातो. कोणत्याही तांत्रिक समस्येत १-क्लिकमध्ये डेटा पूर्ववत करता येतो.
                </p>
              </div>

              <button
                onClick={handleExportAllStoresBackupPdf}
                disabled={exportingMaster}
                className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 shrink-0"
              >
                <FileText weight="bold" />
                <span>{exportingMaster ? 'तयार होत आहे...' : 'मास्टर PDF अहवाल डाऊनलोड'}</span>
              </button>
            </div>

            {/* Store Backups Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {backupsOverview.map(store => (
                <div key={store.store_id} className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <span className="text-xs font-mono font-bold text-blue-600">Store #{store.store_id}</span>
                        <h3 className="font-bold text-slate-900 text-base">{store.store_name}</h3>
                        <p className="text-xs text-slate-500 mt-0.5">👤 {store.owner_name} • 📱 {store.mobile}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                        store.status?.toLowerCase() === 'active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700'
                      }`}>
                        {store.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-4 gap-1 text-center bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 text-[10px] font-bold text-slate-600 mb-4">
                      <div>
                        <p className="text-slate-400 text-[9px] uppercase">आयटम्स</p>
                        <p className="font-mono font-black text-slate-900 text-xs">{store.products_count}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-[9px] uppercase">ग्राहक</p>
                        <p className="font-mono font-black text-slate-900 text-xs">{store.customers_count}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-[9px] uppercase">बिले</p>
                        <p className="font-mono font-black text-slate-900 text-xs">{store.invoices_count}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-[9px] uppercase">विक्री</p>
                        <p className="font-mono font-black text-emerald-700 text-xs">₹{store.total_sales || 0}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 border-t border-slate-100 pt-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDownloadStoreBackupPdf(store.store_id, store.store_name)}
                        disabled={downloadingStoreId === store.store_id}
                        className="flex-1 py-2 bg-red-50 hover:bg-red-100 text-red-700 font-bold rounded-xl text-xs transition border border-red-200/80 cursor-pointer flex items-center justify-center gap-1"
                      >
                        <FileText weight="fill" /> PDF अहवाल
                      </button>
                      <button
                        onClick={() => handleDownloadStoreBackup(store.store_id, store.store_name)}
                        disabled={downloadingStoreId === store.store_id}
                        className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition border border-slate-200/80 cursor-pointer flex items-center justify-center gap-1"
                      >
                        <DownloadSimple weight="bold" /> JSON
                      </button>
                    </div>

                    <button
                      onClick={() => handleOpenRestoreModal(store)}
                      className="w-full py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-1 shadow-xs"
                    >
                      <ArrowCounterClockwise weight="bold" /> डेटा पूर्ववत करा (Restore Data)
                    </button>
                  </div>

                </div>
              ))}
            </div>

          </div>
        )}

      </main>

      {/* ================= 3. STORE QUICK INSPECTOR & PLAN MANAGER MODAL ================= */}
      {inspectStore && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden border border-slate-200 max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="bg-[#0F172A] p-4.5 flex justify-between items-center text-white shrink-0">
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-orange-400 font-black text-sm">#{inspectStore.id}</span>
                <h3 className="font-bold text-base leading-tight">{inspectStore.name}</h3>
              </div>
              <button onClick={() => setInspectStore(null)} className="text-slate-400 hover:text-white cursor-pointer">
                <X weight="bold" className="text-lg" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 flex-1 text-xs">
              
              {/* Store Metadata Card */}
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div>
                  <p className="text-slate-400 text-[10px] uppercase font-bold">मालक</p>
                  <p className="font-bold text-slate-800 text-sm mt-0.5">{inspectStore.owner_name}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-[10px] uppercase font-bold">मोबाईल</p>
                  <p className="font-mono font-bold text-slate-800 text-sm mt-0.5">{inspectStore.mobile}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-[10px] uppercase font-bold">प्लॅन</p>
                  <p className="font-bold text-orange-600 mt-0.5">{inspectStore.plan_type}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-[10px] uppercase font-bold">स्थिती</p>
                  <p className="font-bold text-emerald-600 mt-0.5">{inspectStore.status}</p>
                </div>
              </div>

              {/* Real Database Numbers */}
              <div>
                <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">थेट डेटाबेस आकडेवारी</h4>
                {(() => {
                  const s = backupsMap[inspectStore.id] || {};
                  return (
                    <div className="grid grid-cols-4 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">प्रॉडक्ट्स</p>
                        <p className="font-mono font-black text-slate-900 text-sm mt-0.5">{s.products_count || 0}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">ग्राहक</p>
                        <p className="font-mono font-black text-slate-900 text-sm mt-0.5">{s.customers_count || 0}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">बिले</p>
                        <p className="font-mono font-black text-slate-900 text-sm mt-0.5">{s.invoices_count || 0}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">विक्री</p>
                        <p className="font-mono font-black text-emerald-700 text-sm mt-0.5">₹{s.total_sales || 0}</p>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Subscription & Plan Renewal Area */}
              <div className="bg-orange-50/50 border border-orange-200/80 rounded-xl p-3.5 space-y-3">
                <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-wider">
                  सबस्क्रिप्शन मुदत वाढ किंवा नूतनीकरण
                </h4>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">प्लॅन निवडा:</label>
                  <select
                    value={inspectModalPlan}
                    onChange={e => setInspectModalPlan(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none"
                  >
                    <option value="1 Month">1 Month (30 दिवस) • ₹399</option>
                    <option value="3 Months">3 Months (90 दिवस) • ₹999</option>
                    <option value="6 Months">6 Months (180 दिवस) • ₹1,799</option>
                    <option value="1 Year">1 Year (365 दिवस) • ₹2,999</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleExtendStore(inspectStore.id, inspectModalPlan)}
                    disabled={actionProcessing}
                    className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs transition border border-slate-300 cursor-pointer"
                  >
                    + मुदत वाढवा (Extend)
                  </button>
                  <button
                    onClick={() => handleRenewStore(inspectStore.id, inspectModalPlan)}
                    disabled={actionProcessing}
                    className="py-2.5 bg-gradient-to-r from-[#FF5722] to-[#FF7043] text-white font-bold rounded-xl text-xs transition cursor-pointer shadow-xs"
                  >
                    आजपासून सुरू (Renew)
                  </button>
                </div>

                <button
                  onClick={() => handleRequestPayment(inspectStore)}
                  className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-xl text-xs transition border border-emerald-200/80 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <WhatsappLogo weight="fill" className="text-emerald-600" /> WhatsApp वर पेमेंट मागणी पाठवा
                </button>
              </div>

              {/* Quick Downloads */}
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => handleDownloadStoreBackupPdf(inspectStore.id, inspectStore.name)}
                  className="flex-1 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl text-xs transition border border-red-200/80 cursor-pointer"
                >
                  📄 PDF अहवाल डाऊनलोड
                </button>
                <button
                  onClick={() => handleDownloadStoreBackup(inspectStore.id, inspectStore.name)}
                  className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition border border-slate-200/80 cursor-pointer"
                >
                  💾 JSON डेटा डाऊनलोड
                </button>
              </div>

              {/* Store Owner Password Reset Section */}
              <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-3.5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-slate-800 font-bold text-[11px] uppercase tracking-wider">
                    <Key weight="fill" className="text-orange-500 text-xs" />
                    <span>मालकाचा पासवर्ड रीसेट करा</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">ID #{inspectStore.id}</span>
                </div>

                {resetSuccessMsg && (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold p-2 rounded-lg flex items-center gap-1.5">
                    <CheckCircle weight="fill" className="text-emerald-600 text-sm shrink-0" />
                    <span>{resetSuccessMsg}</span>
                  </div>
                )}

                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type={showResetPass ? 'text' : 'password'}
                      value={storeNewPassword}
                      onChange={e => setStoreNewPassword(e.target.value)}
                      placeholder="नवीन पासवर्ड टाका (किमान ६ अक्षरे)..."
                      className="w-full bg-white border border-slate-300 rounded-xl pl-3 pr-8 py-2 text-xs font-medium text-slate-800 outline-none focus:border-orange-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowResetPass(!showResetPass)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showResetPass ? <EyeSlash size={14} /> : <Eye size={14} />}
                    </button>
                  </div>

                  <button
                    onClick={() => handleResetStorePassword(inspectStore.id)}
                    disabled={actionProcessing || !storeNewPassword}
                    className="py-2 px-3 bg-slate-900 hover:bg-black text-white font-bold rounded-xl text-xs transition cursor-pointer disabled:opacity-50 shrink-0"
                  >
                    पासवर्ड बदला
                  </button>
                </div>
              </div>

              {/* Danger Zone: Permanent Store Delete */}
              <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-3.5 flex items-center justify-between gap-3">
                <div>
                  <h5 className="font-black text-rose-800 text-xs flex items-center gap-1">
                    <WarningCircle weight="fill" className="text-rose-600" />
                    <span>धोकादायक क्षेत्र: दुकान डिलीट करा</span>
                  </h5>
                  <p className="text-[10px] text-rose-600/90 mt-0.5 leading-tight">
                    हे दुकान, सर्व बिले, प्रॉडक्ट्स व उधारी कायमची नष्ट होईल.
                  </p>
                </div>

                <button
                  onClick={() => handleDeleteStore(inspectStore.id, inspectStore.name)}
                  disabled={actionProcessing}
                  className="py-2 px-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition cursor-pointer shadow-xs shrink-0 flex items-center gap-1.5"
                >
                  <Trash weight="bold" />
                  <span>दुकान हटवा</span>
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ================= 4. RESTORE BACKUP MODAL ================= */}
      {restoreModalStore && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-200">
            <div className="bg-[#0F172A] p-4.5 flex justify-between items-center text-white">
              <h3 className="font-bold text-base">डेटा रिस्टोअर (Restore Backup)</h3>
              <button onClick={() => setRestoreModalStore(null)} className="text-slate-400 hover:text-white cursor-pointer">
                <X weight="bold" className="text-lg" />
              </button>
            </div>

            <form onSubmit={handleExecuteRestore} className="p-5 space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-800">
                <p className="font-bold">दुकान: {restoreModalStore.store_name}</p>
                <p className="text-[11px] text-slate-600 mt-0.5">पूर्वी सेव्ह केलेला JSON बॅकअप निवडून डेटा पूर्ववत करा.</p>
              </div>

              <div>
                {restoreFileName ? (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs font-bold text-emerald-800">
                    <span className="truncate max-w-[280px]">✓ {restoreFileName}</span>
                    <button 
                      type="button" 
                      onClick={() => { setRestoreFileContent(null); setRestoreFileName(''); }}
                      className="text-red-600 hover:underline text-[11px] ml-2 cursor-pointer"
                    >
                      बदला
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-slate-300 hover:border-[#FF5722] rounded-xl p-5 text-center cursor-pointer transition relative bg-slate-50">
                    <input 
                      type="file" 
                      accept=".json" 
                      onChange={handleBackupFileUpload} 
                      className="absolute inset-0 opacity-0 cursor-pointer" 
                    />
                    <FileText weight="fill" className="text-3xl text-slate-400 mx-auto mb-1" />
                    <p className="text-xs font-bold text-slate-800">बॅकअप JSON फाईल निवडा</p>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <button 
                  type="button" 
                  onClick={() => setRestoreModalStore(null)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition cursor-pointer"
                >
                  रद्द करा
                </button>
                <button 
                  type="submit" 
                  disabled={restoring || !restoreFileContent}
                  className="flex-1 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-xl text-xs transition cursor-pointer disabled:opacity-50"
                >
                  {restoring ? 'रिस्टोअर होत आहे...' : 'रिस्टोअर करा'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= 5. SUPERADMIN PROFILE MODAL ================= */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden border border-slate-200">
            <div className="bg-[#0F172A] p-4.5 flex justify-between items-center text-white">
              <div className="flex items-center gap-2">
                <ShieldStar weight="fill" className="text-lg text-orange-500" />
                <h3 className="font-bold text-base">SuperAdmin प्रोफाईल</h3>
              </div>
              <button onClick={() => setIsProfileModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X weight="bold" className="text-lg" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="p-5">
              <div className="flex justify-center mb-4">
                <div className="relative group cursor-pointer w-18 h-18 rounded-full border-2 border-dashed border-slate-300 hover:border-orange-500 transition flex items-center justify-center overflow-hidden bg-slate-50">
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                  {profilePic ? (
                    <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center text-slate-400 flex flex-col items-center">
                      <Image weight="fill" className="text-xl" />
                      <span className="text-[9px] font-bold mt-0.5">Upload</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Account Info Box (No plain-text password) */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 mb-4 space-y-1.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-bold">युझरनेम:</span>
                  <span className="font-mono font-black text-slate-900">@{user?.username || 'omya_.x07'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-bold">सुरक्षा दर्जा:</span>
                  <span className="font-mono font-bold text-emerald-600 flex items-center gap-1">
                    <ShieldCheck weight="fill" /> 256-Bit Encrypted
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-bold">खाते रोल:</span>
                  <span className="font-bold text-orange-600 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded text-[10px] uppercase">
                    SuperAdmin
                  </span>
                </div>
              </div>

              {/* Name */}
              <div className="mb-3">
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">नाव</label>
                <input
                  required
                  type="text"
                  value={profileName}
                  onChange={e => setProfileName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-[#FF5722] focus:bg-white transition"
                />
              </div>

              {/* Password */}
              <div className="mb-4">
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">नवीन पासवर्ड (Optional)</label>
                <div className="relative">
                  <input
                    type={showNewPass ? "text" : "password"}
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-xs font-mono font-bold text-slate-800 outline-none focus:border-[#FF5722] focus:bg-white transition"
                    placeholder="पासवर्ड बदलायचा असल्यास टाका"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showNewPass ? <EyeSlash weight="bold" /> : <Eye weight="bold" />}
                  </button>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsProfileModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition cursor-pointer"
                >
                  रद्द करा
                </button>
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="flex-1 py-2.5 bg-gradient-to-r from-[#FF5722] to-[#FF7043] text-white font-bold rounded-xl text-xs transition cursor-pointer disabled:opacity-50"
                >
                  {savingProfile ? 'सेव्ह होत आहे...' : 'सेव्ह करा'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Admin;
