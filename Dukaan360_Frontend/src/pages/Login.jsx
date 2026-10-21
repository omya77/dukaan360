import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageControl } from '../components/LanguageControl';
import { getAuthTranslations } from '../utils/authTranslations';
import { 
  Storefront, 
  ShieldCheck, 
  WarningCircle, 
  CheckCircle, 
  ArrowRight, 
  LockKey, 
  At, 
  Eye, 
  EyeSlash, 
  X, 
  EnvelopeSimple, 
  CircleNotch, 
  Sparkle, 
  WhatsappLogo, 
  Clock 
} from '@phosphor-icons/react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isExpiredError, setIsExpiredError] = useState(false);
  const [isPendingApprovalError, setIsPendingApprovalError] = useState(false);
  const { login, logout } = useAuth();
  const navigate = useNavigate();

  const { language } = useLanguage();
  const txt = getAuthTranslations(language).login;

  // Forgot Password State (Email OTP)
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // 1 = username, 2 = otp & new password
  const [forgotUsername, setForgotUsername] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [showForgotNewPassword, setShowForgotNewPassword] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');
  const [maskedEmail, setMaskedEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [devOtp, setDevOtp] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setIsExpiredError(false);
    setIsPendingApprovalError(false);
    
    try {
      const cleanUsername = username.trim().replace(/^@/, '');
      const formData = new URLSearchParams();
      formData.append('username', cleanUsername);
      formData.append('password', password);
      
      const res = await axios.post('http://localhost:8000/auth/login', formData);
      login(res.data.access_token, {
        name: res.data.name,
        role: res.data.role,
        username: res.data.username,
        store_status: res.data.store_status,
        profile_picture: res.data.profile_picture,
        store_name: res.data.store_name,
        store_mobile: res.data.store_mobile,
        store_address: res.data.store_address
      });
      
      if (res.data.role === 'SuperAdmin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      logout();
      const detail = err.response?.data?.detail;
      if (detail === "PENDING_APPROVAL") {
        setIsPendingApprovalError(true);
        setError("आपल्या दुकानाची नोंदणी प्राप्त झाली आहे. सुपर ॲडमिनने (Omkar Misal) विनंती स्वीकारल्यावरच (Approve) आपण लॉगिन करू शकाल.");
      } else if (detail === "SUBSCRIPTION_EXPIRED") {
        setIsExpiredError(true);
        setError(txt.trial_expired);
        const cleanUsername = username.trim().replace(/^@/, '');
        setTimeout(() => {
          navigate(`/renew?username=${encodeURIComponent(cleanUsername)}`);
        }, 1200);
      } else if (detail === "ACCOUNT_REJECTED") {
        setError(txt.account_rejected);
      } else {
        setError(detail || txt.login_failed);
      }
    } finally {
      setLoading(false);
    }
  };

  // Open Forgot Password Modal
  const openForgotModal = () => {
    setForgotUsername(username.trim().replace(/^@/, '') || '');
    setForgotStep(1);
    setForgotOtp('');
    setForgotNewPassword('');
    setForgotError('');
    setForgotSuccess('');
    setMaskedEmail('');
    setEmailSent(false);
    setDevOtp('');
    setShowForgotModal(true);
  };

  // Step 1: Request OTP via Email
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotError('');

    try {
      const cleanUsername = forgotUsername.trim().replace(/^@/, '');
      const res = await axios.post('http://localhost:8000/auth/forgot-password/request-otp', {
        username: cleanUsername
      });

      setMaskedEmail(res.data.email || res.data.masked_email || 'नोंदणीकृत ईमेल');
      setEmailSent(res.data.email_sent || false);
      setDevOtp(res.data.dev_otp || '');
      setForgotStep(2);
    } catch (err) {
      const detail = err.response?.data?.detail;
      setForgotError(typeof detail === 'string' ? detail : txt.login_failed);
    } finally {
      setForgotLoading(false);
    }
  };

  // Step 2: Reset Password with OTP
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotError('');

    try {
      const cleanUsername = forgotUsername.trim().replace(/^@/, '');
      const res = await axios.post('http://localhost:8000/auth/forgot-password/reset', {
        username: cleanUsername,
        otp: forgotOtp.trim(),
        new_password: forgotNewPassword
      });

      setForgotSuccess(res.data.message || txt.pass_reset_success);
      setTimeout(() => {
        setShowForgotModal(false);
        setUsername(cleanUsername);
        setPassword(forgotNewPassword);
      }, 1500);
    } catch (err) {
      const detail = err.response?.data?.detail;
      setForgotError(typeof detail === 'string' ? detail : txt.login_failed);
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="h-screen w-full bg-[#F8FAFC] flex flex-col lg:flex-row overflow-hidden font-sans select-none">
      
      {/* ================= LEFT COLUMN: Executive Dark Showcase (44% on Desktop) ================= */}
      <div className="hidden lg:flex lg:w-[44%] xl:w-[42%] bg-gradient-to-br from-[#0A0E1A] via-[#0F172A] to-[#1E1B4B] p-8 xl:p-12 text-white flex-col justify-between relative overflow-hidden border-r border-slate-800/80 shrink-0 select-none">
        
        {/* Ambient Glow & Dot Grid */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_2px_2px,white_1px,transparent_0)] bg-[length:24px_24px] pointer-events-none"></div>
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-[#FF5722]/15 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-indigo-600/20 rounded-full blur-[110px] pointer-events-none"></div>

        {/* Top: Brand Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF5722] to-[#FFA726] flex items-center justify-center text-white shadow-lg shadow-orange-500/30 shrink-0">
            <Storefront weight="fill" className="text-2xl" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black tracking-tight text-white leading-none">
                {txt.brand_title}
              </h1>
              <span className="text-[10px] font-black text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded-full">
                {txt.brand_subtitle}
              </span>
            </div>
            <p className="text-[11px] font-semibold text-slate-400 mt-1">
              Cloud POS & Retail Suite
            </p>
          </div>
        </div>

        {/* Middle: Brand Pitch, Animated Marquee Ribbons, Live Stats */}
        <div className="relative z-10 my-auto py-6 space-y-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-orange-400 backdrop-blur-xs">
              <Sparkle weight="fill" className="text-xs text-orange-400" />
              <span>Smart Kirana & Retail Operating System</span>
            </div>
            
            <h2 className="text-2xl xl:text-3xl font-black leading-tight text-white tracking-tight">
              {txt.brand_quote_1} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-amber-400">
                {txt.brand_quote_highlight}
              </span>
            </h2>
            <p className="text-slate-300 font-medium text-xs xl:text-sm leading-relaxed max-w-md">
              {txt.brand_subquote}
            </p>
          </div>

          {/* Dual Row Marquee Ribbons */}
          <div className="relative overflow-hidden w-full space-y-2.5 select-none py-1">
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#0B0F19] to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#0B0F19] to-transparent z-10 pointer-events-none"></div>

            {/* Row 1 */}
            <div className="overflow-hidden">
              <div className="flex gap-2.5 animate-marquee-left">
                {txt.marquee_row1.concat(txt.marquee_row1).map((item, idx) => (
                  <div 
                    key={idx}
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-200 transition-colors shrink-0 backdrop-blur-xs"
                  >
                    <span>{item.icon}</span>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Row 2 */}
            <div className="overflow-hidden">
              <div className="flex gap-2.5 animate-marquee-right">
                {txt.marquee_row2.concat(txt.marquee_row2).map((item, idx) => (
                  <div 
                    key={idx}
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-200 transition-colors shrink-0 backdrop-blur-xs"
                  >
                    <span>{item.icon}</span>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 3 Live Stats Cards */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-white/[0.04] border border-white/10 rounded-2xl py-3 px-2 backdrop-blur-xs">
              <p className="text-base font-black text-white">{txt.stat_stores}</p>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">सक्रिय वापरकर्ते</p>
            </div>
            <div className="bg-white/[0.04] border border-white/10 rounded-2xl py-3 px-2 backdrop-blur-xs">
              <p className="text-base font-black text-[#FF8A65]">{txt.stat_speed}</p>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">जलद बिलिंग</p>
            </div>
            <div className="bg-white/[0.04] border border-white/10 rounded-2xl py-3 px-2 backdrop-blur-xs">
              <p className="text-base font-black text-amber-300">{txt.stat_rating}</p>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">विश्वसनीय रेटिंग</p>
            </div>
          </div>
        </div>

        {/* Bottom: Trusted Users Strip & Live Cloud */}
        <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex -space-x-2">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=70&h=70&fit=crop&crop=faces" alt="Merchant 1" className="w-7 h-7 rounded-full border-2 border-slate-900 object-cover" />
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=70&h=70&fit=crop&crop=faces" alt="Merchant 2" className="w-7 h-7 rounded-full border-2 border-slate-900 object-cover" />
              <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=70&h=70&fit=crop&crop=faces" alt="Merchant 3" className="w-7 h-7 rounded-full border-2 border-slate-900 object-cover" />
            </div>
            <p className="text-xs font-bold text-slate-300">{txt.trusted_stores}</p>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Live Cloud</span>
            </span>
          </div>
        </div>

      </div>

      {/* ================= RIGHT COLUMN: Modern Crisp Login Workspace (56% on Desktop) ================= */}
      <div className="flex-1 bg-[#F8FAFC] flex flex-col justify-between p-5 sm:p-8 lg:p-10 xl:p-12 overflow-y-auto relative">
        
        {/* Top Bar: Mobile Brand Header & Language Switcher / Register Button */}
        <div className="w-full flex items-center justify-between shrink-0 mb-auto pb-4">
          {/* Mobile Only Brand */}
          <div className="lg:hidden flex items-center gap-2">
            <div className="w-8.5 h-8.5 rounded-xl bg-gradient-to-tr from-[#FF5722] to-[#FFA726] flex items-center justify-center text-white shadow-md shadow-orange-500/25">
              <Storefront weight="fill" className="text-lg" />
            </div>
            <span className="text-lg font-black tracking-tight text-slate-900">Dukaan360</span>
          </div>

          {/* Action Controls: 3-Language Selector & Register Button */}
          <div className="flex items-center gap-2.5 ml-auto">
            <LanguageControl variant="auth" />

            <Link 
              to="/register"
              className="text-xs font-black text-white bg-gradient-to-r from-[#FF5722] to-[#FF7043] hover:from-[#E64A19] hover:to-[#FF5722] px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 shadow-md shadow-orange-500/20 active:scale-98 shrink-0 whitespace-nowrap"
              title={txt.register_now}
            >
              <span className="hidden sm:inline">{txt.register_now.replace('→', '').trim()}</span>
              <span className="sm:hidden font-black">नोंदणी</span>
              <ArrowRight weight="bold" className="text-xs" />
            </Link>
          </div>
        </div>

        {/* Center: Focused Login Form Canvas */}
        <div className="w-full max-w-[410px] mx-auto my-auto py-4 sm:py-6">
          
          {/* Header Titles */}
          <div className="mb-5 sm:mb-6">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              {txt.welcome_back} <span className="text-2xl sm:text-3xl">👋</span>
            </h2>
            <div className="h-1 w-12 bg-gradient-to-r from-[#FF5722] via-[#FF8A65] to-amber-400 rounded-full mt-2"></div>
            <p className="text-slate-500 font-medium mt-2 text-xs sm:text-sm leading-relaxed">
              {txt.welcome_sub}
            </p>
          </div>
          
          {/* Error Banner */}
          {error && (
            <div className={`p-3 rounded-xl text-xs font-bold mb-4 animate-in fade-in duration-150 ${
              isPendingApprovalError
                ? 'bg-amber-50 border border-amber-300 text-amber-950 shadow-xs'
                : isExpiredError 
                  ? 'bg-orange-50 border border-orange-200 text-orange-950 shadow-sm'
                  : 'bg-red-50 border border-red-200 text-red-600'
            }`}>
              <div className="flex items-start gap-2.5">
                <WarningCircle weight="fill" className={`text-lg shrink-0 mt-0.5 ${
                  isPendingApprovalError ? 'text-amber-600 animate-pulse' : isExpiredError ? 'text-[#FF5722]' : 'text-red-500'
                }`} />
                <div className="flex-1 space-y-1.5">
                  <div>
                    {isPendingApprovalError && (
                      <p className="font-black text-amber-900 text-xs mb-0.5">नोंदणी मंजुरी प्रलंबित (Pending Approval)</p>
                    )}
                    <p className="leading-tight text-xs font-medium">{error}</p>
                  </div>

                  {isPendingApprovalError && (
                    <a
                      href={`https://wa.me/918262802961?text=${encodeURIComponent(`नमस्कार सर! 🙏\nमी Dukaan360 वर नोंदणी (@${username.trim().replace(/^@/, '')}) केली आहे.\nकृपया माझे खाते तपासून मंजूर (Approve) करा.`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-black shadow-xs transition"
                    >
                      <WhatsappLogo weight="fill" className="text-sm" /> WhatsApp संपर्क
                    </a>
                  )}

                  {isExpiredError && (
                    <Link 
                      to={`/renew?username=${username.trim().replace(/^@/, '')}`}
                      className="inline-flex items-center gap-1 mt-1 bg-[#FF5722] hover:bg-[#E64A19] text-white px-3 py-1.5 rounded-xl text-xs font-black shadow-xs transition cursor-pointer"
                    >
                      <span>{txt.renew_btn_text}</span>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            
            {/* 1. Username / Mobile Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                {txt.username_label}
              </label>
              <div className="relative group">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#FF5722] transition-colors duration-200 flex items-center pointer-events-none">
                  <At weight="bold" className="text-lg" />
                </div>
                <input 
                  type="text" 
                  value={username}
                  onChange={e => setUsername(e.target.value.toLowerCase().replace(/\s+/g, '_'))}
                  required
                  autoCapitalize="none"
                  autoCorrect="off"
                  className="w-full h-11.5 bg-white border border-slate-250 hover:border-slate-350 rounded-xl pl-10.5 pr-4 font-semibold font-mono text-slate-800 outline-none focus:border-[#FF5722] focus:ring-4 focus:ring-[#FF5722]/10 transition-all duration-200 placeholder:font-sans placeholder:font-normal placeholder:text-slate-400 text-sm shadow-2xs"
                  placeholder={txt.username_placeholder} 
                />
              </div>
            </div>
            
            {/* 2. Password Field with Eye Toggle & Forgot Link */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  {txt.password_label}
                </label>
                <button 
                  type="button"
                  onClick={openForgotModal}
                  className="text-xs font-bold text-[#FF5722] hover:text-[#E64A19] hover:underline transition cursor-pointer"
                >
                  {txt.forgot_password}
                </button>
              </div>

              <div className="relative group">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#FF5722] transition-colors duration-200 flex items-center pointer-events-none">
                  <LockKey weight="bold" className="text-lg" />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="w-full h-11.5 bg-white border border-slate-250 hover:border-slate-350 rounded-xl pl-10.5 pr-11 font-semibold text-slate-800 outline-none focus:border-[#FF5722] focus:ring-4 focus:ring-[#FF5722]/10 transition-all duration-200 text-sm placeholder:font-normal placeholder:text-slate-400 shadow-2xs"
                  placeholder={txt.password_placeholder}
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1 rounded-md transition cursor-pointer"
                >
                  {showPassword ? (
                    <EyeSlash weight="bold" className="text-lg text-[#FF5722]" />
                  ) : (
                    <Eye weight="bold" className="text-lg" />
                  )}
                </button>
              </div>
            </div>
            
            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full h-11.5 bg-gradient-to-r from-[#FF5722] via-[#FF6E40] to-[#FF8A65] hover:from-[#E64A19] hover:to-[#FF5722] text-white font-black rounded-xl transition-all duration-200 shadow-[0_6px_20px_rgba(255,87,34,0.32)] hover:shadow-[0_8px_25px_rgba(255,87,34,0.45)] active:scale-[0.99] disabled:opacity-70 flex justify-center items-center gap-2 text-sm cursor-pointer mt-2"
            >
              {loading ? (
                <>
                  <CircleNotch className="animate-spin text-lg" />
                  <span>{txt.logging_in}</span>
                </>
              ) : (
                <>
                  <span>{txt.login_btn.replace('→', '').trim()}</span>
                  <ArrowRight weight="bold" className="text-base" />
                </>
              )}
            </button>
          </form>
          
          {/* New Store Registration Prompt */}
          <div className="pt-4 text-center text-xs sm:text-sm">
            <p className="text-slate-600 font-medium">
              {txt.new_store_prompt}{' '}
              <Link to="/register" className="text-[#FF5722] font-black hover:text-[#E64A19] hover:underline underline-offset-4 ml-1 transition">
                {txt.register_now}
              </Link>
            </p>
          </div>
        </div>

        {/* Bottom Security Footer */}
        <div className="w-full max-w-[410px] mx-auto pt-4 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-400 font-medium shrink-0 mt-auto">
          <span className="flex items-center gap-1.5">
            <ShieldCheck weight="fill" className="text-emerald-500 text-sm" />
            <span>256-Bit SSL</span>
          </span>
          <span className="text-slate-300">•</span>
          <span>ऑटो डेटा सिंक</span>
          <span className="text-slate-300">•</span>
          <span className="flex items-center gap-1.5">
            <CheckCircle weight="fill" className="text-blue-500 text-sm" />
            <span>ISO 27001</span>
          </span>
        </div>

      </div>

      {/* ================= FORGOT PASSWORD MODAL ================= */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 relative animate-in zoom-in-95 duration-200">
            
            <button 
              type="button" 
              onClick={() => setShowForgotModal(false)}
              className="absolute right-4 top-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition cursor-pointer"
            >
              <X weight="bold" className="text-lg" />
            </button>

            <div className="w-12 h-12 bg-orange-100 text-[#FF5722] rounded-2xl flex items-center justify-center mb-4 shadow-inner">
              <EnvelopeSimple weight="fill" className="text-2xl" />
            </div>

            <h3 className="text-lg font-black text-slate-800 tracking-tight">
              {txt.forgot_modal_title}
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-1 mb-4 leading-relaxed">
              {forgotStep === 1 ? txt.forgot_step1_sub : (txt.otp_sent_to + ' ' + maskedEmail)}
            </p>

            {forgotError && (
              <div className="p-2.5 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-bold flex items-center gap-2 mb-3">
                <WarningCircle weight="fill" className="text-base shrink-0" />
                <p className="leading-tight">{forgotError}</p>
              </div>
            )}

            {forgotSuccess && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2 mb-3">
                <CheckCircle weight="fill" className="text-emerald-600 text-base shrink-0" />
                <p className="leading-tight">{forgotSuccess}</p>
              </div>
            )}

            {forgotStep === 1 ? (
              <form onSubmit={handleRequestOtp} className="space-y-4">
                <div>
                  <label className="text-xs sm:text-sm font-bold text-slate-700 mb-1.5 block">{txt.username_label}</label>
                  <div className="relative">
                    <At weight="bold" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xl" />
                    <input 
                      type="text" 
                      required
                      value={forgotUsername} 
                      onChange={e => setForgotUsername(e.target.value.toLowerCase().replace(/\s+/g, '_'))}
                      placeholder={txt.username_placeholder}
                      className="w-full h-11 border-2 border-slate-200 rounded-xl pl-11 pr-3 text-sm font-bold font-mono outline-none focus:border-[#FF5722]"
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={forgotLoading}
                  className="w-full h-11 bg-[#FF5722] hover:bg-[#E64A19] text-white rounded-xl font-bold text-sm transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
                >
                  {forgotLoading ? (
                    <>
                      <CircleNotch className="animate-spin text-base" />
                      <span>{txt.sending_otp}</span>
                    </>
                  ) : (
                    <span>{txt.send_otp_btn}</span>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="text-xs sm:text-sm font-bold text-slate-700 mb-1.5 block">{txt.otp_label}</label>
                  <input 
                    type="text" 
                    required
                    maxLength={6}
                    value={forgotOtp} 
                    onChange={e => setForgotOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder={txt.otp_placeholder}
                    className="w-full h-11 border-2 border-slate-200 rounded-xl px-3 text-center text-lg font-black font-mono tracking-widest outline-none focus:border-[#FF5722]"
                  />
                </div>

                <div>
                  <label className="text-xs sm:text-sm font-bold text-slate-700 mb-1.5 block">{txt.new_pass_label}</label>
                  <div className="relative">
                    <input 
                      type={showForgotNewPassword ? "text" : "password"} 
                      required
                      minLength={4}
                      value={forgotNewPassword} 
                      onChange={e => setForgotNewPassword(e.target.value)}
                      placeholder={txt.new_pass_placeholder}
                      className="w-full h-11 border-2 border-slate-200 rounded-xl px-3.5 pr-11 text-sm font-medium outline-none focus:border-[#FF5722]"
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowForgotNewPassword(!showForgotNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 p-1 cursor-pointer"
                    >
                      {showForgotNewPassword ? <EyeSlash weight="bold" className="text-lg text-[#FF5722]" /> : <Eye weight="bold" className="text-lg" />}
                    </button>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={forgotLoading || !!forgotSuccess}
                  className="w-full h-11 bg-[#FF5722] hover:bg-[#E64A19] text-white rounded-xl font-bold text-sm transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
                >
                  {forgotLoading ? (
                    <>
                      <CircleNotch className="animate-spin text-base" />
                      <span>{txt.resetting_pass}</span>
                    </>
                  ) : (
                    <span>{txt.reset_pass_btn}</span>
                  )}
                </button>

                <button 
                  type="button" 
                  onClick={() => { setForgotStep(1); setForgotError(''); }} 
                  className="text-center text-xs sm:text-sm font-bold text-slate-400 hover:text-slate-600 transition block w-full cursor-pointer py-1"
                >
                  {txt.back_to_username}
                </button>
              </form>
            )}

          </div>
        </div>
      )}

      {/* Infinite Smooth Marquee Keyframes */}
      <style>{`
        @keyframes marquee-left {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0%); }
        }
        .animate-marquee-left {
          display: flex;
          width: max-content;
          animation: marquee-left 24s linear infinite;
        }
        .animate-marquee-right {
          display: flex;
          width: max-content;
          animation: marquee-right 26s linear infinite;
        }
        .animate-marquee-left:hover, .animate-marquee-right:hover {
          animation-play-state: paused;
        }
      `}</style>

    </div>
  );
};

export default Login;
