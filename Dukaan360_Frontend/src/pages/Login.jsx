import React, { useState } from 'react';
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
  Lightning,
  Package,
  Receipt,
  ChartLineUp,
  TrendUp,
  SealCheck,
  Check
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

  // Forgot Password State
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotStep, setForgotStep] = useState(1);
  const [forgotUsername, setForgotUsername] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [showForgotNewPassword, setShowForgotNewPassword] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');
  const [maskedEmail, setMaskedEmail] = useState('');

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

  const openForgotModal = () => {
    setForgotUsername(username.trim().replace(/^@/, '') || '');
    setForgotStep(1);
    setForgotOtp('');
    setForgotNewPassword('');
    setForgotError('');
    setForgotSuccess('');
    setMaskedEmail('');
    setShowForgotModal(true);
  };

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
      setForgotStep(2);
    } catch (err) {
      const detail = err.response?.data?.detail;
      setForgotError(typeof detail === 'string' ? detail : txt.login_failed);
    } finally {
      setForgotLoading(false);
    }
  };

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
    <div className="h-screen w-full bg-[#FAF5F0] relative flex flex-col justify-between overflow-hidden font-sans select-none">
      
      {/* ================= HIGH-LEVEL AURORA GLOW SYSTEM ================= */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[550px] h-[550px] bg-gradient-to-tr from-[#FF5722]/20 via-[#FFA726]/15 to-rose-400/10 rounded-full blur-[110px]"></div>
        <div className="absolute -bottom-[20%] -right-[10%] w-[600px] h-[600px] bg-gradient-to-tr from-amber-400/15 via-[#FF7043]/15 to-orange-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute top-[30%] left-[35%] w-[450px] h-[450px] bg-gradient-to-tr from-orange-400/10 via-rose-300/10 to-transparent rounded-full blur-[90px]"></div>
      </div>

      {/* Subtle Micro-Grid */}
      <div 
        className="absolute inset-0 pointer-events-none z-0 opacity-25"
        style={{
          backgroundImage: 'radial-gradient(#EA580C 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,0.8) 30%, transparent 80%)'
        }}
      ></div>

      {/* ================= TOP BRAND NAVBAR ================= */}
      <header className="relative z-20 w-full h-13 px-4 sm:px-8 bg-white/70 backdrop-blur-xl border-b border-orange-200/50 flex items-center justify-between shrink-0 shadow-[0_2px_15px_rgba(255,87,34,0.04)]">
        {/* Brand Logo & Pill */}
        <div className="flex items-center gap-2.5">
          <div className="w-8.5 h-8.5 rounded-xl bg-gradient-to-tr from-[#FF5722] via-[#FF6E40] to-[#FFA726] flex items-center justify-center text-white shadow-md shadow-orange-500/30 ring-2 ring-white/80">
            <Storefront weight="fill" className="text-xl" />
          </div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-black tracking-tight text-slate-900 leading-none">
              {txt.brand_title}
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-black text-[#FF5722] bg-orange-50/90 border border-orange-200/80 px-2 py-0.5 rounded-full shadow-2xs">
              <Sparkle weight="fill" className="text-[10px]" />
              <span>{txt.brand_subtitle}</span>
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          <LanguageControl variant="auth" />

          <Link 
            to="/register"
            className="text-xs font-black text-white bg-gradient-to-r from-[#FF5722] via-[#FF6E40] to-[#FFA726] hover:from-[#E64A19] hover:to-[#FF5722] px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 shadow-md shadow-orange-500/25 active:scale-98 shrink-0 whitespace-nowrap"
          >
            <span>{txt.register_now.replace('→', '').trim()}</span>
            <ArrowRight weight="bold" className="text-xs" />
          </Link>
        </div>
      </header>

      {/* ================= MAIN HIGH-LEVEL WORKSPACE (ZERO SCROLLING) ================= */}
      <main className="relative z-10 flex-1 w-full max-w-[1080px] mx-auto px-4 py-2 sm:py-3 flex items-center justify-center overflow-hidden">
        
        {/* MASTER HIGH-LEVEL GLASS SUITE */}
        <div className="w-full bg-white/85 backdrop-blur-2xl rounded-[28px] border border-white/90 shadow-[0_20px_50px_-10px_rgba(255,87,34,0.14),0_0_0_1px_rgba(255,255,255,0.9)] overflow-hidden flex flex-col lg:flex-row my-auto max-h-[515px]">
          
          {/* ================= LEFT PANE: High-Level Live POS Hologram Showcase (48%) ================= */}
          <div className="hidden lg:flex lg:w-[48%] bg-gradient-to-br from-[#FFF2EE] via-[#FFF9F7] to-[#FFEFEA] p-6 xl:p-7 flex-col justify-between border-r border-orange-200/60 select-none relative overflow-hidden">
            
            {/* Top: Headline & Smart Pill */}
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-orange-200 text-[11px] font-black text-[#FF5722] shadow-xs">
                <Sparkle weight="fill" className="text-xs text-[#FF5722]" />
                <span>Next-Gen Cloud POS Architecture</span>
              </div>

              <h2 className="text-xl xl:text-[22px] font-black text-slate-900 tracking-tight leading-snug">
                {txt.brand_quote_1} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5722] via-[#FF6E40] to-[#E64A19]">
                  {txt.brand_quote_highlight}
                </span>
              </h2>
            </div>

            {/* Middle: Live Interactive POS Simulator Card (High Level Wow Factor!) */}
            <div className="relative my-2">
              
              {/* Floating Top Widget: Live Profit */}
              <div className="absolute -top-3.5 right-3 z-20 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-3 py-1 rounded-full text-[10.5px] font-black shadow-md flex items-center gap-1.5 animate-bounce-subtle">
                <TrendUp weight="bold" className="text-xs" />
                <span>आजचा नफा: +₹३,८४०</span>
              </div>

              {/* The Live Receipt Simulator Container */}
              <div className="bg-white/95 rounded-2xl border border-orange-200/80 shadow-md p-3.5 space-y-2">
                <div className="flex items-center justify-between pb-1.5 border-b border-dashed border-slate-200">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-md bg-orange-100 text-[#FF5722] flex items-center justify-center text-xs font-black">
                      <Receipt weight="bold" />
                    </div>
                    <span className="text-xs font-black text-slate-800">श्री गणेश किराणा स्टोअर्स</span>
                  </div>
                  <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    ● Live POS
                  </span>
                </div>

                {/* 3 Live Items */}
                <div className="space-y-1 text-[11px] font-medium text-slate-700">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1">1x साखर (Sugar 1kg)</span>
                    <span className="font-bold text-slate-900">₹४२.००</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1">1x Fortune Oil 1L</span>
                    <span className="font-bold text-slate-900">₹११५.००</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1">2x Parle-G Gold</span>
                    <span className="font-bold text-slate-900">₹२०.००</span>
                  </div>
                </div>

                {/* Total & Instant WhatsApp Strip */}
                <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">एकूण बिल (Total)</span>
                    <span className="text-base font-black text-slate-900 leading-none">₹१७७.००</span>
                  </div>
                  <div className="flex items-center gap-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-black px-2.5 py-1 rounded-lg shadow-2xs">
                    <WhatsappLogo weight="fill" className="text-xs text-emerald-600" />
                    <span>WhatsApp बिल पाठवले ✓</span>
                  </div>
                </div>
              </div>

              {/* Floating Bottom Left Badge: Speed */}
              <div className="absolute -bottom-2 left-2 z-20 bg-white border border-orange-200 px-2.5 py-0.5 rounded-full text-[10px] font-black text-slate-800 shadow-sm flex items-center gap-1">
                <Lightning weight="fill" className="text-[#FF5722]" />
                <span>०.२ सेकंदात बिल तयार</span>
              </div>
            </div>

            {/* Bottom: 500+ Storeowners Social Proof & Live Cloud */}
            <div className="pt-2 border-t border-orange-200/70 flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&h=60&fit=crop" alt="User 1" className="w-6 h-6 rounded-full border-2 border-white object-cover shadow-2xs" />
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop" alt="User 2" className="w-6 h-6 rounded-full border-2 border-white object-cover shadow-2xs" />
                  <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&h=60&fit=crop" alt="User 3" className="w-6 h-6 rounded-full border-2 border-white object-cover shadow-2xs" />
                </div>
                <span className="font-bold text-slate-700">{txt.trusted_stores}</span>
              </div>

              <span className="text-amber-600 font-black">⭐ ४.९/५ रेटिंग</span>
            </div>

          </div>

          {/* ================= RIGHT PANE: Ultra-High-End Login Canvas (52%) ================= */}
          <div className="w-full lg:w-[52%] p-6 sm:p-7 xl:p-8 flex flex-col justify-between relative bg-white/90">
            
            <div className="w-full max-w-[360px] mx-auto my-auto space-y-3.5">
              
              {/* Header Titles */}
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  {txt.welcome_back} <span className="text-2xl">👋</span>
                </h2>
                <div className="h-1 w-12 bg-gradient-to-r from-[#FF5722] via-[#FF6E40] to-[#FFA726] rounded-full mt-1.5"></div>
                <p className="text-slate-500 font-medium mt-1 text-xs leading-relaxed">
                  {txt.welcome_sub}
                </p>
              </div>

              {/* Error Banner */}
              {error && (
                <div className={`p-2.5 rounded-xl text-xs font-bold animate-in fade-in duration-150 ${
                  isPendingApprovalError
                    ? 'bg-amber-50 border border-amber-300 text-amber-950 shadow-xs'
                    : isExpiredError 
                      ? 'bg-orange-50 border border-orange-200 text-orange-950 shadow-sm'
                      : 'bg-red-50 border border-red-200 text-red-600'
                }`}>
                  <div className="flex items-start gap-2">
                    <WarningCircle weight="fill" className={`text-base shrink-0 mt-0.5 ${
                      isPendingApprovalError ? 'text-amber-600 animate-pulse' : isExpiredError ? 'text-[#FF5722]' : 'text-red-500'
                    }`} />
                    <div className="flex-1 space-y-1">
                      <p className="leading-tight text-xs font-medium">{error}</p>

                      {isPendingApprovalError && (
                        <a
                          href={`https://wa.me/918262802961?text=${encodeURIComponent(`नमस्कार सर! 🙏\nमी Dukaan360 वर नोंदणी (@${username.trim().replace(/^@/, '')}) केली आहे.\nकृपया माझे खाते तपासून मंजूर (Approve) करा.`)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 rounded-lg text-xs font-black shadow-xs transition"
                        >
                          <WhatsappLogo weight="fill" className="text-xs" /> WhatsApp संपर्क
                        </a>
                      )}

                      {isExpiredError && (
                        <Link 
                          to={`/renew?username=${username.trim().replace(/^@/, '')}`}
                          className="inline-flex items-center gap-1 mt-1 bg-[#FF5722] hover:bg-[#E64A19] text-white px-2.5 py-1 rounded-lg text-xs font-black shadow-xs transition cursor-pointer"
                        >
                          <span>{txt.renew_btn_text}</span>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleLogin} className="space-y-3">
                
                {/* Username Field */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {txt.username_label}
                  </label>
                  <div className="relative group">
                    <At weight="bold" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base group-focus-within:text-[#FF5722] transition-colors pointer-events-none" />
                    <input 
                      type="text" 
                      value={username}
                      onChange={e => setUsername(e.target.value.toLowerCase().replace(/\s+/g, '_'))}
                      required
                      autoCapitalize="none"
                      autoCorrect="off"
                      className="w-full h-10.5 bg-slate-50/80 hover:bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3 font-semibold font-mono text-slate-800 outline-none focus:bg-white focus:border-[#FF5722] focus:ring-4 focus:ring-orange-500/15 transition-all text-xs sm:text-sm placeholder:font-sans placeholder:font-normal placeholder:text-slate-400 shadow-2xs"
                      placeholder={txt.username_placeholder} 
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                      {txt.password_label}
                    </label>
                    <button 
                      type="button"
                      onClick={openForgotModal}
                      className="text-[11px] font-bold text-[#FF5722] hover:text-[#E64A19] hover:underline transition cursor-pointer"
                    >
                      {txt.forgot_password}
                    </button>
                  </div>

                  <div className="relative group">
                    <LockKey weight="bold" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base group-focus-within:text-[#FF5722] transition-colors pointer-events-none" />
                    <input 
                      type={showPassword ? "text" : "password"} 
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      className="w-full h-10.5 bg-slate-50/80 hover:bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 font-semibold text-slate-800 outline-none focus:bg-white focus:border-[#FF5722] focus:ring-4 focus:ring-orange-500/15 transition-all text-xs sm:text-sm placeholder:font-normal placeholder:text-slate-400 shadow-2xs"
                      placeholder={txt.password_placeholder}
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1 rounded-md transition cursor-pointer"
                    >
                      {showPassword ? (
                        <EyeSlash weight="bold" className="text-base text-[#FF5722]" />
                      ) : (
                        <Eye weight="bold" className="text-base" />
                      )}
                    </button>
                  </div>
                </div>

                {/* High-Level Shimmer Button */}
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full h-11 bg-gradient-to-r from-[#FF5722] via-[#FF6E40] to-[#FFA726] hover:from-[#E64A19] hover:to-[#FF5722] text-white font-black rounded-xl transition-all duration-200 shadow-md shadow-orange-500/30 hover:shadow-lg hover:shadow-orange-500/40 active:scale-[0.99] disabled:opacity-70 flex justify-center items-center gap-2 text-xs sm:text-sm cursor-pointer mt-1"
                >
                  {loading ? (
                    <>
                      <CircleNotch className="animate-spin text-base" />
                      <span>{txt.logging_in}</span>
                    </>
                  ) : (
                    <>
                      <span>{txt.login_btn.replace('→', '').trim()}</span>
                      <ArrowRight weight="bold" className="text-sm" />
                    </>
                  )}
                </button>
              </form>

              {/* New Store Registration Prompt */}
              <div className="pt-1 text-center text-xs">
                <p className="text-slate-600 font-medium">
                  {txt.new_store_prompt}{' '}
                  <Link to="/register" className="text-[#FF5722] font-black hover:text-[#E64A19] hover:underline underline-offset-4 ml-1 transition">
                    {txt.register_now.replace('→', '').trim()}
                  </Link>
                </p>
              </div>

            </div>

            {/* Bottom Security Footer */}
            <div className="w-full pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-medium">
              <span className="flex items-center gap-1">
                <ShieldCheck weight="fill" className="text-emerald-500 text-xs" />
                <span>256-Bit SSL</span>
              </span>
              <span className="text-slate-300">•</span>
              <span>ऑटो डेटा सिंक</span>
              <span className="text-slate-300">•</span>
              <span className="flex items-center gap-1">
                <CheckCircle weight="fill" className="text-blue-500 text-xs" />
                <span>ISO 27001</span>
              </span>
            </div>

          </div>

        </div>

      </main>

      {/* Forgot Password Modal */}
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

            <div className="w-12 h-12 bg-orange-50 text-[#FF5722] rounded-2xl flex items-center justify-center mb-3 border border-orange-100">
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
              <form onSubmit={handleRequestOtp} className="space-y-3.5">
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">{txt.username_label}</label>
                  <div className="relative">
                    <At weight="bold" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
                    <input 
                      type="text" 
                      required
                      value={forgotUsername} 
                      onChange={e => setForgotUsername(e.target.value.toLowerCase().replace(/\s+/g, '_'))}
                      placeholder={txt.username_placeholder}
                      className="w-full h-10.5 border border-slate-200 rounded-xl pl-10 pr-3 text-xs sm:text-sm font-bold font-mono outline-none focus:border-[#FF5722]"
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={forgotLoading}
                  className="w-full h-10.5 bg-[#FF5722] hover:bg-[#E64A19] text-white rounded-xl font-bold text-xs sm:text-sm transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
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
              <form onSubmit={handleResetPassword} className="space-y-3.5">
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">{txt.otp_label}</label>
                  <input 
                    type="text" 
                    required
                    maxLength={6}
                    value={forgotOtp} 
                    onChange={e => setForgotOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder={txt.otp_placeholder}
                    className="w-full h-10.5 border border-slate-200 rounded-xl px-3 text-center text-base font-black font-mono tracking-widest outline-none focus:border-[#FF5722]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">{txt.new_pass_label}</label>
                  <div className="relative">
                    <input 
                      type={showForgotNewPassword ? "text" : "password"} 
                      required
                      minLength={4}
                      value={forgotNewPassword} 
                      onChange={e => setForgotNewPassword(e.target.value)}
                      placeholder={txt.new_pass_placeholder}
                      className="w-full h-10.5 border border-slate-200 rounded-xl px-3 pr-10 text-xs sm:text-sm font-medium outline-none focus:border-[#FF5722]"
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowForgotNewPassword(!showForgotNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 p-1 cursor-pointer"
                    >
                      {showForgotNewPassword ? <EyeSlash weight="bold" className="text-base text-[#FF5722]" /> : <Eye weight="bold" className="text-base" />}
                    </button>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={forgotLoading || !!forgotSuccess}
                  className="w-full h-10.5 bg-[#FF5722] hover:bg-[#E64A19] text-white rounded-xl font-bold text-xs sm:text-sm transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
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
                  className="text-center text-xs font-bold text-slate-400 hover:text-slate-600 transition block w-full cursor-pointer py-1"
                >
                  {txt.back_to_username}
                </button>
              </form>
            )}

          </div>
        </div>
      )}

      {/* Floating subtle animation keyframe */}
      <style>{`
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 3s ease-in-out infinite;
        }
      `}</style>

    </div>
  );
};

export default Login;
