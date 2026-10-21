import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  MagnifyingGlass, 
  List, 
  Bell, 
  ClockCounterClockwise, 
  Storefront, 
  X, 
  Package, 
  BookBookmark, 
  User, 
  UserPlus, 
  At, 
  SignOut,
  Translate,
  Eye,
  EyeSlash,
  LockKey,
  DeviceMobile,
  CheckCircle,
  WarningCircle,
  CircleNotch,
  ShieldCheck,
  IdentificationBadge,
  ChartLineUp,
  EnvelopeSimple
} from '@phosphor-icons/react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageControl } from './LanguageControl';

const Header = ({ onMenuClick, searchTerm, onSearch }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { language, setLanguage, t, supportedLanguages, tNotification } = useLanguage();
  
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showAddStaff, setShowAddStaff] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [staffData, setStaffData] = useState({ name: '', username: '', email: '', mobile: '', password: '', role: 'Cashier' });
  const [showPassword, setShowPassword] = useState(false);
  const [staffSubmitting, setStaffSubmitting] = useState(false);
  const [staffServerMsg, setStaffServerMsg] = useState({ type: '', text: '' });
  const [staffTouched, setStaffTouched] = useState({});

  const openAddStaffModal = () => {
    setShowAddStaff(true);
    setShowProfileMenu(false);
    setIsMobileMenuOpen(false);
    setStaffServerMsg({ type: '', text: '' });
    setStaffTouched({});
  };

  const fullName = user?.name || user?.owner_name || "User";
  const firstName = fullName.trim().split(/\s+/)[0] || fullName;
  const storeRawName = user?.store_name || "Store Name";
  const storeWords = storeRawName.trim().split(/\s+/);
  const storeFirstWord = storeWords[0] || "Store";
  const storeRestWords = storeWords.slice(1).join(' ');

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('saas_token');
        if (!token) return;
        const res = await axios.get('http://localhost:8000/notifications/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setNotifications(res.data);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      }
    };
    
    // Initial fetch
    fetchNotifications();
    
    // Poll every 30 seconds for live updates
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // Close notifications or profile dropdown when clicking anywhere outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.notif-container')) {
        setShowNotifications(false);
      }
      if (!e.target.closest('.profile-container')) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  // Real-time Staff Form Validation
  const getStaffErrors = () => {
    const errs = {};
    const trimmedName = (staffData.name || '').trim();
    if (!trimmedName) {
      errs.name = language === 'mr' ? 'कर्मचाऱ्याचे नाव प्रविष्ट करा' : (language === 'hi' ? 'कर्मचारी का नाम दर्ज करें' : 'Staff name is required');
    } else if (trimmedName.length < 2) {
      errs.name = language === 'mr' ? 'नाव किमान २ अक्षरांचे असावे' : (language === 'hi' ? 'नाम कम से कम २ अक्षरों का होना चाहिए' : 'Name must be at least 2 characters');
    }

    const username = (staffData.username || '').trim().toLowerCase();
    if (!username) {
      errs.username = language === 'mr' ? 'लॉगिन युझरनेम प्रविष्ट करा' : (language === 'hi' ? 'लॉगिन यूजरनेम दर्ज करें' : 'Username is required');
    } else if (username.length < 3) {
      errs.username = language === 'mr' ? 'युझरनेम किमान ३ अक्षरांचे असावे' : (language === 'hi' ? 'यूजरनेम कम से कम ३ अक्षरों का होना चाहिए' : 'Username must be at least 3 characters');
    } else if (username.length > 20) {
      errs.username = language === 'mr' ? 'युझरनेम कमाल २० अक्षरांचे असावे' : (language === 'hi' ? 'यूजरनेम अधिकतम २० अक्षरों का होना चाहिए' : 'Username must be at most 20 characters');
    } else if (!/^[a-z0-9_.]+$/.test(username)) {
      errs.username = language === 'mr' ? 'फक्त लहान इंग्रजी अक्षरे, आकडे व _ किंवा . चालेल' : (language === 'hi' ? 'केवल छोटे अक्षर, संख्या और _ या . का उपयोग करें' : 'Only lowercase letters, numbers, and _ or . allowed');
    }

    const password = staffData.password || '';
    if (!password) {
      errs.password = language === 'mr' ? 'पासवर्ड प्रविष्ट करा' : (language === 'hi' ? 'पासवर्ड दर्ज करें' : 'Password is required');
    } else if (password.length < 4) {
      errs.password = language === 'mr' ? 'पासवर्ड किमान ४ अक्षरांचा असावा' : (language === 'hi' ? 'पासवर्ड कम से कम ४ अक्षरों का होना चाहिए' : 'Password must be at least 4 characters');
    }

    const mobile = (staffData.mobile || '').trim();
    if (mobile && !/^[6-9]\d{9}$/.test(mobile)) {
      errs.mobile = language === 'mr' ? '१०-अंकी वैध मोबाईल नंबर टाका (६ ते ९ ने सुरू होणारा)' : (language === 'hi' ? '१०-अंकों का वैध मोबाइल नंबर दर्ज करें' : 'Valid 10-digit mobile number required (starts with 6-9)');
    }

    const email = (staffData.email || '').trim().toLowerCase();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = language === 'mr' ? 'वैध ईमेल आयडी प्रविष्ट करा' : (language === 'hi' ? 'वैध ईमेल आईडी दर्ज करें' : 'Valid email address required');
    }

    return errs;
  };

  const handleAddStaff = async (e) => {
    e.preventDefault();
    setStaffTouched({ name: true, username: true, email: true, password: true, mobile: true });
    
    const errors = getStaffErrors();
    if (Object.keys(errors).length > 0) {
      return;
    }

    setStaffSubmitting(true);
    setStaffServerMsg({ type: '', text: '' });

    try {
      const token = localStorage.getItem('saas_token');
      const payload = {
        name: staffData.name.trim(),
        username: staffData.username.trim().toLowerCase(),
        password: staffData.password,
        role: 'Cashier',
        mobile: staffData.mobile.trim() || null,
        email: staffData.email.trim().toLowerCase() || null
      };
      const res = await axios.post('http://localhost:8000/staff/', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const successText = res.data?.message || (language === 'mr' ? 'कॅशियर खाते यशस्वीरीत्या तयार झाले!' : 'Staff account created successfully!');
      setStaffServerMsg({ type: 'success', text: successText });
      
      setTimeout(() => {
        setShowAddStaff(false);
        setStaffData({ name: '', username: '', email: '', mobile: '', password: '', role: 'Cashier' });
        setStaffTouched({});
        setStaffServerMsg({ type: '', text: '' });
      }, 1400);
    } catch (err) {
      const detail = err.response?.data?.detail;
      const errorText = typeof detail === 'string' ? detail : (detail ? JSON.stringify(detail) : 'Failed to create staff account');
      setStaffServerMsg({ type: 'error', text: errorText });
    } finally {
      setStaffSubmitting(false);
    }
  };

  const renderNotificationsDropdown = () => (
    <div className="absolute right-0 mt-2 w-72 sm:w-80 max-w-[calc(100vw-24px)] bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50">
      <div className="p-3 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
        <h3 className="text-sm font-black text-slate-800">{t('notifications')}</h3>
        <span className="text-[10px] font-bold bg-brand text-white px-2 py-0.5 rounded-full">{notifications.length} {t('new_badge')}</span>
      </div>
      <div className="max-h-80 overflow-y-auto custom-scrollbar">
        {notifications.length === 0 ? (
          <div className="p-6 text-center text-slate-400">
            <Bell weight="fill" className="text-3xl mx-auto mb-2 opacity-50" />
            <p className="text-xs font-bold">{t('no_notifications')}</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {notifications.map(notif => {
              const localized = tNotification ? tNotification(notif) : notif;
              return (
                <div key={notif.id} className="p-3 hover:bg-slate-50 transition cursor-pointer flex gap-3">
                  <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${notif.type === 'DANGER' ? 'bg-red-500' : 'bg-orange-500'}`}></div>
                  <div>
                    <p className="text-xs font-bold text-slate-800 leading-tight mb-0.5">{localized.title}</p>
                    <p className="text-[10px] text-slate-500 font-medium leading-snug">{localized.message}</p>
                    <p className="text-[9px] text-slate-400 mt-1">
                      {new Date(notif.timestamp).toLocaleString(language === 'mr' ? 'mr-IN' : language === 'hi' ? 'hi-IN' : 'en-IN', {
                        hour: '2-digit', 
                        minute: '2-digit', 
                        day: '2-digit', 
                        month: 'short'
                      })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
    {/* Global Hotkey (Alt+L) & Floating Toast Notification */}
    <LanguageControl variant="global" />

    <header className="glass-header flex items-center justify-between px-3 lg:px-6 h-14 shrink-0 z-20">
      
      {/* Left section: Store Logo & Name (Always visible and responsive) */}
      <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 shrink-0">
        <Link to="/pos" className="flex items-center gap-2.5 sm:gap-3 group select-none">
          {/* Premium Store Logo Badge */}
          <div className="relative w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-2xl bg-gradient-to-tr from-[#FF5722] via-[#FF7043] to-[#FFA726] p-[1.5px] shadow-md shadow-orange-500/25 ring-2 ring-orange-200/50 group-hover:ring-orange-400/60 group-hover:scale-105 group-hover:rotate-[-2deg] transition-all duration-300 shrink-0 flex items-center justify-center">
            <div className="w-full h-full rounded-[14px] bg-gradient-to-tr from-[#FF5722] to-[#FF8A65] flex items-center justify-center text-white shadow-inner">
              <Storefront weight="fill" className="text-[18px] sm:text-[20px] lg:text-[22px] drop-shadow" />
            </div>
            {/* Tiny Golden Star Accent */}
            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-900 rounded-full flex items-center justify-center text-[8px] sm:text-[9px] font-black shadow-sm border border-white">
              ★
            </span>
          </div>

          {/* Attractive Dual-Tone Store Branding */}
          <div className="flex flex-col">
            <div className="flex items-center gap-1 sm:gap-1.5 leading-none">
              <span className="font-extrabold text-sm sm:text-base lg:text-[19px] xl:text-[21px] tracking-tight text-slate-900 group-hover:text-brand transition-colors drop-shadow-sm whitespace-nowrap">
                {storeFirstWord}
              </span>
              {storeRestWords && (
                <span className="font-black text-sm sm:text-base lg:text-[19px] xl:text-[21px] tracking-tight bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA726] bg-clip-text text-transparent drop-shadow-sm whitespace-nowrap">
                  {storeRestWords}
                </span>
              )}
            </div>
            
            {/* Store Type & Live Indicator */}
            <div className="flex items-center gap-1.5 leading-none mt-1">
              <span className="text-[9px] sm:text-[10px] font-extrabold text-slate-400 tracking-wider uppercase flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Kirana Store
              </span>
              {user?.address && (
                <>
                  <span className="text-slate-300 text-[10px]">•</span>
                  <span className="text-[10px] font-medium text-slate-400 truncate max-w-[100px] sm:max-w-[150px]">
                    {user.address}
                  </span>
                </>
              )}
            </div>
          </div>
        </Link>
      </div>

      {/* Desktop Navigation Tabs (Centered & Balanced Layout) */}
      <nav className="hidden lg:flex flex-1 justify-center items-center px-4">
        <div className="flex items-center bg-slate-100/80 p-1 rounded-xl border border-slate-200 gap-1">
          {user?.role !== 'Cashier' && (
            <Link 
              to="/dashboard" 
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition flex items-center gap-1.5 ${
                location.pathname === '/dashboard' ? 'bg-white text-brand shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <ChartLineUp weight={location.pathname === '/dashboard' ? "fill" : "bold"} /> {t('dashboard') || 'डॅशबोर्ड'}
            </Link>
          )}

          <Link 
            to="/pos" 
            className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition flex items-center gap-1.5 ${
              location.pathname === '/pos' ? 'bg-white text-brand shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Storefront weight={location.pathname === '/pos' ? "fill" : "bold"} /> {t('pos')}
          </Link>
          
          {user?.role !== 'Cashier' && (
            <>
              <Link 
                to="/inventory" 
                className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition flex items-center gap-1.5 ${
                  location.pathname === '/inventory' ? 'bg-white text-brand shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Package weight={location.pathname === '/inventory' ? "fill" : "bold"} /> {t('stock')}
              </Link>
              <Link 
                to="/khata" 
                className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition flex items-center gap-1.5 ${
                  location.pathname === '/khata' ? 'bg-white text-brand shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <BookBookmark weight={location.pathname === '/khata' ? "fill" : "bold"} /> {t('khata')}
              </Link>
            </>
          )}

          <Link 
            to="/history" 
            className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition flex items-center gap-1.5 ${
              location.pathname === '/history' ? 'bg-white text-brand shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <ClockCounterClockwise weight={location.pathname === '/history' ? "bold" : "bold"} /> {t('history')}
          </Link>
        </div>
      </nav>

      {/* Mobile Right Controls */}
      <div className="lg:hidden flex items-center gap-1.5 sm:gap-2">
        {/* Mobile Notification Bell */}
        <div className="relative notif-container">
          <button 
            onClick={() => setShowNotifications(!showNotifications)} 
            className="relative w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100/90 text-slate-600 hover:bg-slate-200 transition"
          >
            <Bell weight="bold" className="text-base" />
            {notifications.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            )}
          </button>
          {showNotifications && renderNotificationsDropdown()}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100/90 text-slate-700 hover:bg-slate-200 transition text-lg" 
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <List weight="bold" />
        </button>
      </div>
      
      {/* Right (Desktop Only) - Direct Language Selector, Notifications & Profile */}
      <div className="hidden lg:flex items-center gap-2.5 shrink-0">

        {/* Direct Desktop Language Switcher */}
        <div className="flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200 gap-1 text-[11px] font-bold">
          <button
            onClick={() => setLanguage('mr')}
            className={`px-2.5 py-1 rounded-lg transition flex items-center gap-1 cursor-pointer ${
              language === 'mr' ? 'bg-white text-brand shadow-xs font-black' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            🚩 मराठी
          </button>
          <button
            onClick={() => setLanguage('hi')}
            className={`px-2.5 py-1 rounded-lg transition flex items-center gap-1 cursor-pointer ${
              language === 'hi' ? 'bg-white text-brand shadow-xs font-black' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            🇮🇳 हिंदी
          </button>
          <button
            onClick={() => setLanguage('en')}
            className={`px-2.5 py-1 rounded-lg transition flex items-center gap-1 cursor-pointer ${
              language === 'en' ? 'bg-white text-brand shadow-xs font-black' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            🇬🇧 English
          </button>
        </div>
        
        {/* Desktop Notifications Bell */}
        <div className="relative notif-container">
          <button 
            onClick={() => setShowNotifications(!showNotifications)} 
            className="relative w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 text-slate-500 hover:bg-slate-100 transition border border-slate-200"
          >
            <Bell weight="bold" />
            {notifications.length > 0 && (
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full animate-pulse"></span>
            )}
          </button>
          {showNotifications && renderNotificationsDropdown()}
        </div>

        {/* Desktop Profile Menu */}
        <div className="relative profile-container">
          <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setShowProfileMenu(!showProfileMenu)}>
            <div className="text-right hidden sm:block">
              <p className="text-xs font-black text-slate-800 leading-none group-hover:text-brand transition-colors">{firstName}</p>
              <p className="text-[10px] font-bold text-emerald-600 flex items-center justify-end gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                {t('online')}
              </p>
            </div>
            <div className="w-8 h-8 bg-gradient-to-tr from-brand to-orange-400 rounded-full flex items-center justify-center text-white font-black shadow-sm group-hover:ring-2 ring-brand/30 transition shrink-0">
              {firstName.charAt(0).toUpperCase()}
            </div>
          </div>
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/60 overflow-hidden z-50 p-2.5 animate-in fade-in slide-in-from-top-2 duration-200">
              {/* User Header Profile Card */}
              <div className="p-3 rounded-xl bg-gradient-to-br from-slate-50 to-orange-50/40 border border-slate-100 flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand to-orange-400 flex items-center justify-center text-white font-black shadow-md shadow-brand/20 text-sm shrink-0">
                  {firstName.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-black text-slate-800 truncate leading-tight">
                    {fullName}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-brand/10 text-brand border border-brand/20 uppercase tracking-wide">
                      {user?.role === 'Cashier' ? t('cashier') : t('owner')}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      {t('online')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-1">
                {user?.role !== 'Cashier' && (
                  <button 
                    onClick={openAddStaffModal} 
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-orange-50 hover:text-brand transition flex items-center gap-2.5 group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-orange-100 text-brand flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <UserPlus weight="bold" className="text-sm" />
                    </div>
                    <div>
                      <p className="font-black text-slate-800 group-hover:text-brand leading-none">{t('add_staff')}</p>
                      <p className="text-[10px] text-slate-400 font-medium mt-0.5">{t('add_staff_subtitle')}</p>
                    </div>
                  </button>
                )}

                {/* Language Selection in Profile Dropdown */}
                <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 my-1">
                  <LanguageControl variant="grid" onSelect={() => setShowProfileMenu(false)} />
                </div>

                <div className="h-px bg-slate-100 my-1"></div>

                <button 
                  onClick={() => { logout(); navigate('/login'); }} 
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition flex items-center gap-2.5 group"
                >
                  <div className="w-7 h-7 rounded-lg bg-red-100 text-red-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <SignOut weight="bold" className="text-sm" />
                  </div>
                  <div>
                    <p className="font-black text-red-600 leading-none">{t('logout')}</p>
                    <p className="text-[10px] text-red-400 font-medium mt-0.5">{t('logout_subtitle')}</p>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </header>

    {/* Mobile Slide-Out Navigation Drawer */}
    {isMobileMenuOpen && (
      <div 
        onClick={() => setIsMobileMenuOpen(false)}
        className="lg:hidden fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 transition-opacity"
      />
    )}

    <aside className={`lg:hidden fixed inset-y-0 right-0 w-72 sm:w-80 bg-white/95 backdrop-blur-xl shadow-2xl z-50 p-5 flex flex-col justify-between border-l border-white/60 transition-transform duration-300 ease-in-out ${
      isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
    }`}>
      <div>
        {/* Drawer Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand to-orange-400 flex items-center justify-center text-white shadow-md shadow-brand/20">
              <Storefront weight="fill" className="text-lg" />
            </div>
            <h2 className="font-extrabold text-base text-slate-800 truncate max-w-[170px]">
              {user?.store_name || "Dukaan360"}
            </h2>
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition"
          >
            <X weight="bold" className="text-sm" />
          </button>
        </div>

        {/* User Card */}
        <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand to-orange-400 flex items-center justify-center text-white font-black shadow-sm text-sm shrink-0">
            {user?.name ? user.name.charAt(0).toUpperCase() : (user?.owner_name ? user.owner_name.charAt(0).toUpperCase() : "U")}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-black text-slate-800 truncate">{user?.name || user?.owner_name || "User"}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[10px] font-bold text-brand uppercase">{user?.role === 'Cashier' ? t('cashier') : t('owner')}</span>
              <span className="text-[9px] text-emerald-600 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                {t('online')}
              </span>
            </div>
          </div>
        </div>

        {/* Mobile Language Switcher Selector */}
        <div className="mt-4 p-3 rounded-2xl bg-orange-50/60 border border-orange-100">
          <LanguageControl variant="grid" onSelect={() => setIsMobileMenuOpen(false)} />
        </div>

        {/* Navigation Links */}
        <nav className="mt-5 flex flex-col gap-1.5">
          <Link 
            to="/pos" 
            onClick={() => setIsMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-sm transition ${
              location.pathname === '/pos' ? 'bg-brand text-white shadow-md shadow-brand/20' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Storefront weight="fill" className="text-lg" />
            <span>{t('pos')}</span>
          </Link>

          {user?.role !== 'Cashier' && (
            <>
              <Link 
                to="/inventory" 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-sm transition ${
                  location.pathname === '/inventory' ? 'bg-brand text-white shadow-md shadow-brand/20' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Package weight="fill" className="text-lg" />
                <span>{t('stock')}</span>
              </Link>

              <Link 
                to="/khata" 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-sm transition ${
                  location.pathname === '/khata' ? 'bg-brand text-white shadow-md shadow-brand/20' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <BookBookmark weight="fill" className="text-lg" />
                <span>{t('khata')}</span>
              </Link>
            </>
          )}

          <Link 
            to="/history" 
            onClick={() => setIsMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-sm transition ${
              location.pathname === '/history' ? 'bg-brand text-white shadow-md shadow-brand/20' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <ClockCounterClockwise weight="fill" className="text-lg" />
            <span>{t('history')}</span>
          </Link>
        </nav>
      </div>

      {/* Bottom Actions */}
      <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
        {user?.role !== 'Cashier' && (
          <button 
            onClick={openAddStaffModal}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-orange-50 text-brand font-bold text-xs border border-orange-200 hover:bg-orange-100 transition"
          >
            <UserPlus weight="bold" />
            <span>{t('add_staff')}</span>
          </button>
        )}

        <button 
          onClick={() => { logout(); navigate('/login'); }}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-50 text-red-600 font-bold text-xs border border-red-200 hover:bg-red-100 transition"
        >
          <span>{t('logout')}</span>
        </button>
      </div>
    </aside>

      {/* Add Staff Modal - Clean, Compact & Elegant */}
      {showAddStaff && (() => {
        const errors = getStaffErrors();

        return (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-150">
            <div 
              className="bg-white rounded-2xl w-full max-w-sm shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-150"
              onClick={e => e.stopPropagation()}
            >
              
              {/* Clean Header */}
              <div className="bg-gradient-to-r from-brand to-orange-400 px-5 py-4 flex items-center justify-between text-white">
                <div className="flex items-center gap-2.5">
                  <UserPlus weight="bold" className="text-xl" />
                  <h3 className="font-extrabold text-base leading-none">
                    {t('create_cashier_login')}
                  </h3>
                </div>
                <button 
                  onClick={() => {
                    setShowAddStaff(false);
                    setStaffServerMsg({ type: '', text: '' });
                    setStaffTouched({});
                  }}
                  className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition"
                  title="Close"
                >
                  <X weight="bold" className="text-sm" />
                </button>
              </div>

              {/* Server Message Banner */}
              {staffServerMsg.text && (
                <div className={`mx-5 mt-4 p-3 rounded-xl flex items-center gap-2 text-xs font-bold ${
                  staffServerMsg.type === 'success' 
                    ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' 
                    : 'bg-red-50 border border-red-200 text-red-700'
                }`}>
                  {staffServerMsg.type === 'success' ? (
                    <CheckCircle weight="fill" className="text-emerald-600 text-base shrink-0" />
                  ) : (
                    <WarningCircle weight="fill" className="text-red-500 text-base shrink-0" />
                  )}
                  <p className="leading-snug">{staffServerMsg.text}</p>
                </div>
              )}

              {/* Clean Form */}
              <form onSubmit={handleAddStaff} noValidate className="p-5 flex flex-col gap-3.5">
                
                {/* 1. Staff Name */}
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">
                    {t('staff_name')} <span className="text-brand">*</span>
                  </label>
                  <input 
                    type="text" 
                    value={staffData.name} 
                    onBlur={() => setStaffTouched(prev => ({ ...prev, name: true }))}
                    onChange={e => setStaffData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="कर्मचाऱ्याचे पूर्ण नाव प्रविष्ट करा"
                    className={`w-full h-10 border rounded-xl px-3 text-sm font-medium outline-none transition ${
                      staffTouched.name && errors.name 
                        ? 'border-red-400 bg-red-50/30 focus:border-red-500' 
                        : 'border-slate-200 bg-slate-50/50 focus:bg-white focus:border-brand focus:ring-2 focus:ring-brand/10'
                    }`}
                  />
                  {staffTouched.name && errors.name && (
                    <p className="text-[11px] font-bold text-red-600 mt-1">
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* 2. Login Username */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700">
                      {t('staff_username')} <span className="text-brand">*</span>
                    </label>
                    <span className="text-[10px] text-slate-400 font-medium">Unique ID</span>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-black text-brand select-none">@</span>
                    <input 
                      type="text" 
                      value={staffData.username} 
                      onBlur={() => setStaffTouched(prev => ({ ...prev, username: true }))}
                      onChange={e => {
                        const clean = e.target.value.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_.]/g, '');
                        setStaffData(prev => ({ ...prev, username: clean }));
                      }}
                      placeholder="कर्मचाऱ्याचे युझरनेम प्रविष्ट करा"
                      className={`w-full h-10 border rounded-xl pl-7 pr-3 text-sm font-bold font-mono text-slate-800 outline-none transition ${
                        staffTouched.username && errors.username 
                          ? 'border-red-400 bg-red-50/30 focus:border-red-500' 
                          : 'border-slate-200 bg-slate-50/50 focus:bg-white focus:border-brand focus:ring-2 focus:ring-brand/10'
                      }`}
                    />
                  </div>
                  {staffTouched.username && errors.username ? (
                    <p className="text-[11px] font-bold text-red-600 mt-1">
                      {errors.username}
                    </p>
                  ) : (
                    <p className="text-[10px] text-slate-400 mt-0.5 font-medium">
                      फक्त लहान अक्षरे, आकडे व _ (किमान ३ अक्षरे)
                    </p>
                  )}
                </div>

                {/* 3. Password */}
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">
                    {t('password')} <span className="text-brand">*</span>
                  </label>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"}
                      value={staffData.password} 
                      onBlur={() => setStaffTouched(prev => ({ ...prev, password: true }))}
                      onChange={e => setStaffData(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="किमान ४ किंवा अधिक अक्षरी पासवर्ड"
                      className={`w-full h-10 border rounded-xl px-3 pr-10 text-sm font-medium outline-none transition ${
                        staffTouched.password && errors.password 
                          ? 'border-red-400 bg-red-50/30 focus:border-red-500' 
                          : 'border-slate-200 bg-slate-50/50 focus:bg-white focus:border-brand focus:ring-2 focus:ring-brand/10'
                      }`}
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition p-1"
                      title={showPassword ? "Hide" : "Show"}
                    >
                      {showPassword ? <EyeSlash weight="bold" className="text-base text-brand" /> : <Eye weight="bold" className="text-base" />}
                    </button>
                  </div>
                  {staffTouched.password && errors.password && (
                    <p className="text-[11px] font-bold text-red-600 mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* 4. Staff Email (Optional - for Password Reset) */}
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                    <span>ईमेल (Email) - OTP साठी</span>
                    <span className="text-[10px] text-slate-400 font-normal">(ऐच्छिक / Optional)</span>
                  </label>
                  <div className="relative">
                    <EnvelopeSimple className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
                    <input 
                      type="email" 
                      value={staffData.email} 
                      onBlur={() => setStaffTouched(prev => ({ ...prev, email: true }))}
                      onChange={e => setStaffData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="कर्मचाऱ्याचा ईमेल आयडी प्रविष्ट करा"
                      className={`w-full h-10 border rounded-xl pl-9 pr-3 text-sm font-medium outline-none transition ${
                        staffTouched.email && errors.email 
                          ? 'border-red-400 bg-red-50/30 focus:border-red-500' 
                          : 'border-slate-200 bg-slate-50/50 focus:bg-white focus:border-brand focus:ring-2 focus:ring-brand/10'
                      }`}
                    />
                  </div>
                  {staffTouched.email && errors.email ? (
                    <p className="text-[11px] font-bold text-red-600 mt-1">
                      {errors.email}
                    </p>
                  ) : (
                    <p className="text-[10px] text-slate-400 mt-0.5 font-medium">
                      पासवर्ड विसरल्यास या ईमेलवर सुरक्षित OTP येईल
                    </p>
                  )}
                </div>

                {/* 5. Mobile Number (Optional) */}
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                    <span>{t('staff_mobile_optional')}</span>
                    <span className="text-[10px] text-slate-400 font-normal">(ऐच्छिक / Optional)</span>
                  </label>
                  <input 
                    type="tel"
                    maxLength={10}
                    value={staffData.mobile} 
                    onBlur={() => setStaffTouched(prev => ({ ...prev, mobile: true }))}
                    onChange={e => setStaffData(prev => ({ ...prev, mobile: e.target.value.replace(/\D/g, '') }))}
                    placeholder="10-digit number (optional)"
                    className={`w-full h-10 border rounded-xl px-3 text-sm font-medium outline-none transition ${
                      staffTouched.mobile && errors.mobile 
                        ? 'border-red-400 bg-red-50/30 focus:border-red-500' 
                        : 'border-slate-200 bg-slate-50/50 focus:bg-white focus:border-brand focus:ring-2 focus:ring-brand/10'
                    }`}
                  />
                  {staffTouched.mobile && errors.mobile && (
                    <p className="text-[11px] font-bold text-red-600 mt-1">
                      {errors.mobile}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button 
                  type="submit" 
                  disabled={staffSubmitting}
                  className="w-full h-11 bg-brand hover:bg-brandHover text-white rounded-xl font-bold text-sm mt-2 transition shadow-md shadow-brand/20 active:scale-98 flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {staffSubmitting ? (
                    <>
                      <CircleNotch className="animate-spin text-base" />
                      <span>तयार करत आहे...</span>
                    </>
                  ) : (
                    <span>{t('create_account')}</span>
                  )}
                </button>
              </form>
            </div>
          </div>
        );
      })()}
</>
  );
};

export default Header;
