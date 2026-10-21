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
      
      {/* ================= 1. SOFT AMBIENT SUNSET LIGHTING ================= */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Central Warm Radial Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[720px] bg-gradient-to-tr from-amber-400/18 via-[#FF7043]/12 to-transparent rounded-full blur-[130px]"></div>
        {/* Corner Accents */}
        <div className="absolute -top-[12%] -left-[8%] w-[480px] h-[480px] bg-gradient-to-tr from-[#FF5722]/15 via-[#FFA726]/12 to-rose-400/8 rounded-full blur-[100px]"></div>
        <div className="absolute -bottom-[12%] -right-[8%] w-[520px] h-[520px] bg-gradient-to-tr from-amber-400/15 via-[#FF7043]/12 to-orange-500/8 rounded-full blur-[110px]"></div>
      </div>

      {/* ================= 2. LEFT 3D PERSPECTIVE GLASS PLANE ================= */}
      <div 
        className="absolute -left-16 top-1/2 -translate-y-1/2 w-[460px] 2xl:w-[520px] h-[520px] 2xl:h-[580px] pointer-events-none z-0 hidden lg:block opacity-75"
        style={{
          transform: 'perspective(1200px) rotateY(26deg) rotateX(-6deg) skewY(-3deg)',
          transformOrigin: 'left center'
        }}
      >
        <div className="w-full h-full rounded-[44px] bg-gradient-to-br from-white/70 via-white/20 to-orange-100/30 backdrop-blur-xl border-2 border-white/80 shadow-[0_30px_90px_-20px_rgba(255,112,67,0.22)] relative overflow-hidden">
          {/* Internal Specular Highlight */}
          <div className="absolute top-0 left-0 right-0 h-36 bg-gradient-to-b from-white/50 to-transparent"></div>
          {/* Subtle warm internal glow corner */}
          <div className="absolute -bottom-10 -right-10 w-52 h-52 rounded-full bg-gradient-to-tr from-amber-400/25 to-orange-500/15 blur-2xl"></div>
          <div className="absolute top-16 left-12 w-2 h-2 rounded-full bg-amber-300/60 blur-[1px]"></div>
          <div className="absolute bottom-24 right-20 w-3 h-3 rounded-full bg-orange-300/40 blur-[2px]"></div>
        </div>
      </div>

      {/* ================= 3. RIGHT 3D PERSPECTIVE GLOWING WIREFRAME GRID ================= */}
      <div 
        className="absolute -right-12 top-1/2 -translate-y-1/2 w-[480px] 2xl:w-[540px] h-[520px] 2xl:h-[580px] pointer-events-none z-0 hidden lg:block opacity-70"
        style={{
          transform: 'perspective(1100px) rotateY(-24deg) rotateX(10deg) skewY(2deg)',
          transformOrigin: 'right center'
        }}
      >
        <svg className="w-full h-full" viewBox="0 0 500 500" fill="none">
          <defs>
            <linearGradient id="gridGradLogin" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFA726" stopOpacity="0.75" />
              <stop offset="50%" stopColor="#FF7043" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#FF5722" stopOpacity="0.08" />
            </linearGradient>
            <radialGradient id="sunGlowLogin" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFA726" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#FFA726" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="250" cy="250" r="230" fill="url(#sunGlowLogin)" />
          {/* Vertical Grid Lines */}
          {[40, 90, 140, 190, 240, 290, 340, 390, 440].map((x) => (
            <line 
              key={`v-login-${x}`} 
              x1={x} 
              y1="30" 
              x2={x} 
              y2="470" 
              stroke="url(#gridGradLogin)" 
              strokeWidth="1.2" 
              strokeDasharray={x % 140 === 0 ? "none" : "3 3"} 
            />
          ))}
          {/* Horizontal Grid Lines */}
          {[40, 90, 140, 190, 240, 290, 340, 390, 440].map((y) => (
            <line 
              key={`h-login-${y}`} 
              x1="30" 
              y1={y} 
              x2="470" 
              y2={y} 
              stroke="url(#gridGradLogin)" 
              strokeWidth="1.2" 
              strokeDasharray={y % 140 === 0 ? "none" : "3 3"} 
            />
          ))}
          {/* Glowing Grid Intersections */}
          {[90, 190, 290, 390].map((x) => 
            [90, 190, 290, 390].map((y) => (
              <circle key={`dot-login-${x}-${y}`} cx={x} cy={y} r="2.5" fill="#FF7043" opacity="0.8" />
            ))
          )}
        </svg>

        {/* 4-Point Golden Sparkle Stars */}
        <div className="absolute top-10 left-12 text-amber-400 text-lg animate-pulse">✦</div>
        <div className="absolute top-28 right-12 text-orange-400 text-2xl animate-pulse delay-300">✦</div>
        <div className="absolute bottom-16 left-24 text-amber-300 text-sm animate-pulse delay-700">✦</div>
        <div className="absolute bottom-28 right-16 text-[#FF5722] text-xl animate-pulse delay-500">✦</div>
      </div>

      {/* ================= 4. FLOATING TOP ISLAND NAVBAR ================= */}
      <header className="relative z-30 w-full max-w-[1100px] 2xl:max-w-[1180px] mx-auto pt-2.5 sm:pt-3 px-4 shrink-0 transition-all">
        <div className="w-full h-12 px-4 bg-white/85 backdrop-blur-xl border border-white/90 rounded-2xl flex items-center justify-between shadow-2xs">
          
          {/* Brand Logo & Free Trial Badge */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FF5722] via-[#FF6E40] to-[#FFA726] flex items-center justify-center text-white shadow-sm shadow-orange-500/25 shrink-0">
              <Storefront weight="fill" className="text-lg" />
            </div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-black tracking-tight text-slate-900 leading-none">
                Dukaan<span className="text-[#FF5722]">360</span>
              </h1>
              <span className="inline-flex items-center gap-1 text-[10.5px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full shadow-2xs">
                <Sparkle weight="fill" className="text-[10px]" />
                <span>+ 30 दिवस मोफत</span>
              </span>
            </div>
          </div>

          {/* Action Controls: 3-Pill Language Selector & Register CTA */}
          <div className="flex items-center gap-2.5">
            <LanguageControl variant="auth" />

            <Link 
              to="/register"
              className="text-xs font-bold text-white bg-gradient-to-r from-[#FF5722] via-[#FF6E40] to-[#FFA726] hover:from-[#E64A19] hover:to-[#FF5722] px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1 shadow-sm shadow-orange-500/25 active:scale-95 shrink-0 whitespace-nowrap"
            >
              <span className="hidden sm:inline">{txt.register_now.replace('→', '').trim()}</span>
              <span className="sm:hidden font-bold">{txt.nav_register_short || 'Register'}</span>
              <ArrowRight weight="bold" className="text-xs" />
            </Link>
          </div>
        </div>
      </header>

      {/* ================= 5. MAIN WORKSPACE (STRICT ZERO SCROLLING, LUXURY DESIGN) ================= */}
      <main className="relative z-10 flex-1 w-full max-w-[1100px] 2xl:max-w-[1180px] mx-auto px-4 py-1 flex items-center justify-center overflow-hidden min-h-0">
        
        {/* 2-COLUMN SUITE */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center max-h-[520px]">
          
          {/* ================= LEFT COLUMN: Rich 3D Showcase (6 Cols) ================= */}
          <div className="hidden lg:flex lg:col-span-6 flex-col justify-between py-1 space-y-3.5 select-none">
            
            {/* Top Pill Badge & Headline */}
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/10 via-orange-500/15 to-amber-500/10 border border-orange-300/60 text-[10.5px] font-black text-[#E65100] shadow-2xs">
                <Sparkle weight="fill" className="text-xs text-[#FF5722]" />
                <span>{txt.side_badge}</span>
              </div>

              <h2 className="text-2xl 2xl:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                {txt.brand_quote_1} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5722] via-[#FF6E40] to-[#FFA726]">
                  {txt.brand_quote_highlight}
                </span>
              </h2>
              <p className="text-slate-500 text-xs font-medium leading-relaxed max-w-md">
                {txt.brand_subquote}
              </p>
            </div>

            {/* 3 Rich Feature Cards with 3D Illustrations */}
            <div className="space-y-2.5">
              
              {/* Card 1: Fast Billing */}
              <div className="bg-white/85 hover:bg-white border border-orange-100/90 rounded-2xl p-2.5 sm:p-3 flex items-center justify-between gap-3 shadow-2xs transition group">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-orange-50 text-[#FF5722] flex items-center justify-center text-lg font-black shrink-0 border border-orange-200/60 shadow-inner">
                    <Lightning weight="fill" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-black text-slate-800 tracking-tight truncate">{txt.side_card1_title}</h4>
                    <p className="text-[10px] text-slate-500 font-medium truncate">{txt.side_card1_desc}</p>
                  </div>
                </div>

                {/* 3D Tilted Digital Document / Thermal Receipt */}
                <div className="relative shrink-0 w-11 h-12 select-none ml-2">
                  <div className="w-10 h-10.5 bg-slate-800 rounded-[9px] p-1.5 shadow-md border border-slate-600/80 rotate-[5deg] flex flex-col justify-between overflow-hidden">
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                      <div className="w-4 h-0.5 bg-white/80 rounded-full"></div>
                    </div>
                    <div className="space-y-0.5">
                      <div className="w-full h-0.5 bg-white/40 rounded-full"></div>
                      <div className="w-3/4 h-0.5 bg-white/40 rounded-full"></div>
                      <div className="w-2/3 h-0.5 bg-orange-400/80 rounded-full"></div>
                    </div>
                    <div className="w-full h-0.5 bg-emerald-400/60 rounded-full"></div>
                  </div>
                  <div className="absolute -left-1.5 -top-1 w-4.5 h-4.5 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center shadow-lg ring-2 ring-white text-[9px] font-black">
                    ✓
                  </div>
                </div>
              </div>

              {/* Card 2: WhatsApp Recovery */}
              <div className="bg-white/85 hover:bg-white border border-emerald-100/90 rounded-2xl p-2.5 sm:p-3 flex items-center justify-between gap-3 shadow-2xs transition group">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg font-black shrink-0 border border-emerald-200/60 shadow-inner">
                    <WhatsappLogo weight="fill" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-black text-slate-800 tracking-tight truncate">{txt.side_card2_title}</h4>
                    <p className="text-[10px] text-slate-500 font-medium truncate">{txt.side_card2_desc}</p>
                  </div>
                </div>

                {/* 3D Tilted Smartphone with Invoice & WhatsApp Badge */}
                <div className="relative shrink-0 w-11 h-13 select-none ml-2">
                  <div className="w-9.5 h-12 bg-slate-900 rounded-[9px] p-1 shadow-md border border-slate-700/80 rotate-[7deg] flex flex-col justify-between overflow-hidden">
                    <div className="bg-emerald-500/90 rounded-[3px] px-1 py-0.5 flex items-center justify-between">
                      <span className="text-[5.5px] font-black text-white tracking-wider">INVOICE</span>
                      <span className="w-1 h-1 rounded-full bg-white"></span>
                    </div>
                    <div className="space-y-0.5 px-0.5">
                      <div className="w-full h-0.5 bg-white/70 rounded-full"></div>
                      <div className="w-3/4 h-0.5 bg-white/50 rounded-full"></div>
                      <div className="w-4/5 h-0.5 bg-emerald-400/80 rounded-full"></div>
                    </div>
                    <div className="border-t border-white/20 pt-0.5 flex justify-between items-center text-[5.5px] font-bold text-emerald-400 px-0.5">
                      <span>₹950</span>
                      <span className="text-[5px] text-white/70">PAID ✓</span>
                    </div>
                  </div>
                  <div className="absolute -left-1.5 -top-1 w-5 h-5 rounded-full bg-gradient-to-tr from-emerald-500 to-green-400 text-white flex items-center justify-center shadow-lg ring-2 ring-white text-[11px]">
                    <WhatsappLogo weight="fill" />
                  </div>
                </div>
              </div>

              {/* Card 3: Live Stock & Profit Guard */}
              <div className="bg-white/85 hover:bg-white border border-blue-100/90 rounded-2xl p-2.5 sm:p-3 flex items-center justify-between gap-3 shadow-2xs transition group">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-lg font-black shrink-0 border border-purple-200/60 shadow-inner">
                    <ChartLineUp weight="fill" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-black text-slate-800 tracking-tight truncate">{txt.side_card3_title}</h4>
                    <p className="text-[10px] text-slate-500 font-medium truncate">{txt.side_card3_desc}</p>
                  </div>
                </div>

                {/* 3D Tilted Analytics Dashboard Card with Candlestick Bars */}
                <div className="relative shrink-0 w-12 h-12 select-none ml-2">
                  <div className="w-11 h-10.5 bg-slate-900 rounded-[9px] p-1.5 shadow-md border border-slate-700/80 -rotate-[6deg] flex flex-col justify-between overflow-hidden">
                    <div className="flex items-center justify-between text-[5.5px] text-slate-400 font-bold">
                      <span>PROFIT</span>
                      <span className="text-emerald-400 font-extrabold">+18%</span>
                    </div>
                    <div className="flex items-end gap-1 h-4 pt-0.5 px-0.5">
                      <div className="w-1.5 h-2 bg-emerald-400 rounded-t-xs"></div>
                      <div className="w-1.5 h-3.5 bg-cyan-400 rounded-t-xs"></div>
                      <div className="w-1.5 h-2.5 bg-amber-400 rounded-t-xs"></div>
                      <div className="w-1.5 h-4 bg-emerald-500 rounded-t-xs animate-pulse"></div>
                    </div>
                  </div>
                  <div className="absolute -right-1 -top-1 w-4.5 h-4.5 rounded-full bg-gradient-to-tr from-emerald-500 to-green-400 text-white flex items-center justify-center shadow-lg ring-2 ring-white text-[9px] font-black">
                    ↑
                  </div>
                </div>
              </div>

            </div>

            {/* Direct WhatsApp Founder Support Strip */}
            <div className="pt-1.5 flex items-center justify-between text-xs text-slate-600 border-t border-orange-200/50">
              <span className="flex items-center gap-1.5 text-slate-800 text-[11px] font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>{txt.trusted_stores}</span>
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-[#FF5722] text-[11px] font-bold">{txt.stat_speed}</span>
              <span className="text-slate-300">•</span>
              <span className="text-amber-600 text-[11px] font-bold">⭐ {txt.stat_rating}</span>
            </div>

          </div>

          {/* ================= RIGHT COLUMN: Luxury Double-Bordered Login Card (6 Cols) ================= */}
          <div className="col-span-1 lg:col-span-6 w-full max-w-[420px] mx-auto">
            
            {/* Outer Luxury Double-Border Frame */}
            <div className="relative p-[5px] rounded-[34px] bg-gradient-to-br from-amber-400/90 via-orange-400/80 to-emerald-400/70 shadow-[0_25px_60px_-15px_rgba(255,87,34,0.22),0_10px_20px_-5px_rgba(0,0,0,0.05)]">
              
              {/* Inner Card Container */}
              <div className="relative bg-white/95 backdrop-blur-2xl rounded-[30px] p-6 sm:p-7 border border-white/90 flex flex-col justify-between">
                
                {/* 4-Point Golden Sparkle Accents */}
                <span className="absolute top-4 right-5 text-amber-400/80 text-base pointer-events-none select-none">✦</span>
                <span className="absolute top-7 right-8 text-orange-400/70 text-xs pointer-events-none select-none">✦</span>

                {/* Header Title & Badge */}
                <div className="mb-3">
                  <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-50 border border-orange-200/80 text-[10px] font-black text-[#FF5722] mb-1.5 shadow-2xs">
                    <Sparkle weight="fill" className="text-xs text-[#FF5722]" />
                    <span>✨ दुकानात प्रवेश करा • POS Login</span>
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-tight flex items-center gap-2">
                    {txt.welcome_back} <span className="text-2xl">🏪</span>
                  </h2>
                  <p className="text-slate-500 font-medium text-xs mt-1 leading-snug">
                    {txt.welcome_sub}
                  </p>
                </div>

                {/* Error Banner */}
                {error && (
                  <div className={`p-2.5 rounded-xl text-xs font-bold mb-3 animate-in fade-in duration-150 ${
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
                  
                  {/* Username / Mobile Input */}
                  <div>
                    <label className="block text-[10.5px] font-bold text-slate-700 uppercase tracking-wider mb-1">
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
                        className="w-full h-10 bg-[#FFFBF7] hover:bg-white border border-amber-200/80 rounded-xl pl-10 pr-3 font-semibold font-mono text-slate-800 outline-none focus:bg-white focus:border-[#FF5722] focus:ring-2 focus:ring-[#FF5722]/15 transition-all text-xs sm:text-sm placeholder:font-sans placeholder:font-normal placeholder:text-slate-400 shadow-2xs"
                        placeholder={txt.username_placeholder} 
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[10.5px] font-bold text-slate-700 uppercase tracking-wider">
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
                        className="w-full h-10 bg-[#FFFBF7] hover:bg-white border border-amber-200/80 rounded-xl pl-10 pr-10 font-semibold text-slate-800 outline-none focus:bg-white focus:border-[#FF5722] focus:ring-2 focus:ring-[#FF5722]/15 transition-all text-xs sm:text-sm placeholder:font-normal placeholder:text-slate-400 shadow-2xs"
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
                    className="w-full h-10.5 bg-gradient-to-r from-[#FF5722] via-[#FF6E40] to-[#FFA726] hover:from-[#E64A19] hover:to-[#FF5722] text-white font-black rounded-xl transition-all duration-200 shadow-md shadow-orange-500/30 hover:shadow-lg hover:shadow-orange-500/40 active:scale-[0.99] disabled:opacity-70 flex justify-center items-center gap-2 text-xs sm:text-sm cursor-pointer mt-1"
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

                {/* Bottom Register Prompt */}
                <div className="pt-3 text-center text-xs">
                  <p className="text-slate-600 font-medium">
                    {txt.new_store_prompt}{' '}
                    <Link to="/register" className="text-[#FF5722] font-black hover:text-[#E64A19] hover:underline underline-offset-4 ml-1 transition">
                      {txt.register_now.replace('→', '').trim()}
                    </Link>
                  </p>
                </div>

                {/* Minimal Clean Security Line */}
                <div className="pt-2 mt-2 border-t border-slate-100 text-center text-[10.5px] text-slate-400 font-medium flex items-center justify-center gap-1.5">
                  <ShieldCheck weight="fill" className="text-emerald-500 text-xs" />
                  <span>{txt.security_badge_text}</span>
                </div>

              </div>

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
