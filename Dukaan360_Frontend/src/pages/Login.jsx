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
  ChartLineUp
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
    <div className="h-screen w-full bg-gradient-to-br from-[#FFF5F2] via-[#F8FAFC] to-[#F1F5F9] flex flex-col overflow-hidden font-sans select-none">
      
      {/* ================= TOP GLOBAL NAVBAR ================= */}
      <header className="w-full h-13 sm:h-14 px-4 sm:px-8 bg-white/80 backdrop-blur-md border-b border-orange-100/70 flex items-center justify-between shrink-0 shadow-2xs z-20">
        <div className="flex items-center gap-2.5">
          <div className="w-8.5 h-8.5 rounded-xl bg-gradient-to-tr from-[#FF5722] to-[#FFA726] flex items-center justify-center text-white shadow-md shadow-orange-500/25 shrink-0">
            <Storefront weight="fill" className="text-xl" />
          </div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-black tracking-tight text-slate-900 leading-none">
              {txt.brand_title}
            </h1>
            <span className="hidden sm:inline-flex text-[10px] font-black text-[#FF5722] bg-orange-50 border border-orange-200/80 px-2 py-0.5 rounded-full">
              {txt.brand_subtitle}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <LanguageControl variant="auth" />

          <Link 
            to="/register"
            className="text-xs font-black text-white bg-gradient-to-r from-[#FF5722] to-[#FF7043] hover:from-[#E64A19] hover:to-[#FF5722] px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 shadow-md shadow-orange-500/20 active:scale-98 shrink-0 whitespace-nowrap"
          >
            <span>{txt.register_now.replace('→', '').trim()}</span>
            <ArrowRight weight="bold" className="text-xs" />
          </Link>
        </div>
      </header>

      {/* ================= MAIN BALANCED WORKSPACE (NO SCROLLING) ================= */}
      <main className="flex-1 w-full max-w-[1040px] mx-auto px-4 py-2 sm:py-4 flex items-center justify-center overflow-hidden">
        
        {/* DUAL-PANE BRAND SUITE CARD */}
        <div className="w-full bg-white/95 backdrop-blur-xl rounded-3xl border border-orange-100/80 shadow-[0_15px_45px_-10px_rgba(255,87,34,0.1),0_2px_10px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col lg:flex-row my-auto max-h-[510px]">
          
          {/* ================= LEFT PANE: Warm Branded Feature Showcase (46%) ================= */}
          <div className="hidden lg:flex lg:w-[46%] bg-gradient-to-br from-[#FFF0ED] via-[#FFF8F6] to-[#FFF0ED] p-6 xl:p-7 flex-col justify-between border-r border-orange-100/70 select-none relative overflow-hidden">
            
            {/* Top Brand Tag & Pitch */}
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-orange-200/80 text-[11px] font-black text-[#FF5722] shadow-2xs">
                <Sparkle weight="fill" className="text-xs text-[#FF5722]" />
                <span>Smart Kirana & Retail POS</span>
              </div>

              <h2 className="text-xl font-black text-slate-900 tracking-tight leading-snug">
                {txt.brand_quote_1} <br />
                <span className="text-[#FF5722]">{txt.brand_quote_highlight}</span>
              </h2>
              <p className="text-slate-500 text-xs font-medium leading-relaxed">
                {txt.brand_subquote}
              </p>
            </div>

            {/* 4 Feature Cards (Clean Warm Glass Pills) */}
            <div className="grid grid-cols-2 gap-2.5 my-3">
              <div className="bg-white/80 hover:bg-white border border-orange-100 rounded-xl p-2.5 shadow-2xs transition">
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="w-6 h-6 rounded-lg bg-orange-100 text-[#FF5722] flex items-center justify-center text-xs shrink-0">
                    <Lightning weight="fill" />
                  </div>
                  <span className="text-xs font-bold text-slate-800">१-क्लिक बिलिंग</span>
                </div>
                <p className="text-[10px] text-slate-500 leading-tight">बारकोड व थर्मल प्रिंट</p>
              </div>

              <div className="bg-white/80 hover:bg-white border border-orange-100 rounded-xl p-2.5 shadow-2xs transition">
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs shrink-0">
                    <WhatsappLogo weight="fill" />
                  </div>
                  <span className="text-xs font-bold text-slate-800">WhatsApp बिल</span>
                </div>
                <p className="text-[10px] text-slate-500 leading-tight">थेट ग्राहकाला मेसेज</p>
              </div>

              <div className="bg-white/80 hover:bg-white border border-orange-100 rounded-xl p-2.5 shadow-2xs transition">
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-xs shrink-0">
                    <Package weight="fill" />
                  </div>
                  <span className="text-xs font-bold text-slate-800">स्टॉक अलर्ट</span>
                </div>
                <p className="text-[10px] text-slate-500 leading-tight">कमी स्टॉक सूचना</p>
              </div>

              <div className="bg-white/80 hover:bg-white border border-orange-100 rounded-xl p-2.5 shadow-2xs transition">
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="w-6 h-6 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center text-xs shrink-0">
                    <ChartLineUp weight="fill" />
                  </div>
                  <span className="text-xs font-bold text-slate-800">नफा अहवाल</span>
                </div>
                <p className="text-[10px] text-slate-500 leading-tight">रोजची एकूण कमाई</p>
              </div>
            </div>

            {/* Bottom: Live Stats Strip */}
            <div className="pt-2.5 border-t border-orange-100/80 flex items-center justify-between text-[11px] text-slate-600 font-bold">
              <span className="flex items-center gap-1 text-slate-800">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>{txt.stat_stores}</span>
              </span>
              <span>•</span>
              <span className="text-[#FF5722]">{txt.stat_speed}</span>
              <span>•</span>
              <span className="text-amber-600">⭐ {txt.stat_rating}</span>
            </div>

          </div>

          {/* ================= RIGHT PANE: Modern Login Canvas (54%) ================= */}
          <div className="w-full lg:w-[54%] p-6 sm:p-7 xl:p-8 flex flex-col justify-between relative bg-white">
            
            <div className="w-full max-w-[370px] mx-auto my-auto space-y-3.5">
              
              {/* Heading */}
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  {txt.welcome_back} <span className="text-xl">👋</span>
                </h2>
                <div className="h-1 w-10 bg-gradient-to-r from-[#FF5722] to-[#FFA726] rounded-full mt-1.5"></div>
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
                      <div>
                        {isPendingApprovalError && (
                          <p className="font-black text-amber-900 text-xs mb-0.5">नोंदणी मंजुरी प्रलंबित</p>
                        )}
                        <p className="leading-tight text-xs font-medium">{error}</p>
                      </div>

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
                      className="w-full h-10 bg-slate-50/70 hover:bg-slate-50 border border-slate-200 rounded-xl pl-9.5 pr-3 font-semibold font-mono text-slate-800 outline-none focus:bg-white focus:border-[#FF5722] focus:ring-3 focus:ring-[#FF5722]/15 transition-all text-xs sm:text-sm placeholder:font-sans placeholder:font-normal placeholder:text-slate-400"
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
                      className="w-full h-10 bg-slate-50/70 hover:bg-slate-50 border border-slate-200 rounded-xl pl-9.5 pr-10 font-semibold text-slate-800 outline-none focus:bg-white focus:border-[#FF5722] focus:ring-3 focus:ring-[#FF5722]/15 transition-all text-xs sm:text-sm placeholder:font-normal placeholder:text-slate-400"
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

                {/* Submit Button */}
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full h-10.5 bg-gradient-to-r from-[#FF5722] via-[#FF6E40] to-[#FF8A65] hover:from-[#E64A19] hover:to-[#FF5722] text-white font-black rounded-xl transition-all duration-200 shadow-md shadow-orange-500/25 active:scale-[0.99] disabled:opacity-70 flex justify-center items-center gap-2 text-xs sm:text-sm cursor-pointer mt-1"
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

    </div>
  );
};

export default Login;
