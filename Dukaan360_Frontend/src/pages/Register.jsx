import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageControl } from '../components/LanguageControl';
import { getAuthTranslations } from '../utils/authTranslations';
import { 
  Storefront, 
  User, 
  Phone, 
  LockKey, 
  CheckCircle, 
  WarningCircle, 
  ArrowRight, 
  ArrowLeft,
  Buildings, 
  MapPin, 
  EnvelopeSimple,
  Sparkle,
  WhatsappLogo,
  ShieldCheck,
  Lightning,
  CircleNotch
} from '@phosphor-icons/react';

const Register = () => {
  const [formData, setFormData] = useState({
    store_name: '',
    owner_name: '',
    mobile: '',
    email: '',
    password: '',
    plan_type: '1 Month',
    address: '',
    profile_picture: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { language } = useLanguage();
  const txt = getAuthTranslations(language).register;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await axios.post('http://localhost:8000/auth/register', formData);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  // Success Confirmation Screen
  if (success) {
    return (
      <div className="h-screen w-full bg-[#F4F7FE] flex flex-col relative overflow-hidden font-sans select-none">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-[12%] -left-[8%] w-[520px] h-[520px] bg-gradient-to-tr from-[#FF5722]/25 to-amber-400/20 rounded-full blur-[100px] animate-blob-1"></div>
          <div className="absolute -bottom-[15%] -right-[8%] w-[560px] h-[560px] bg-gradient-to-tr from-indigo-600/20 to-purple-500/15 rounded-full blur-[110px] animate-blob-2"></div>
        </div>

        {/* Global Navbar */}
        <header className="relative z-20 w-full h-14 sm:h-16 px-4 sm:px-6 lg:px-8 bg-white/85 backdrop-blur-md border-b border-slate-200/80 flex items-center justify-between shrink-0 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-[#FF5722] to-[#FFA726] flex items-center justify-center text-white shadow-md shadow-orange-500/25">
              <Storefront weight="fill" className="text-xl sm:text-2xl" />
            </div>
            <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-900 leading-none">Dukaan360</h1>
          </div>
          <LanguageControl variant="auth" />
        </header>

        {/* Success Modal Card in Center */}
        <main className="relative z-10 flex-1 flex items-center justify-center p-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-xl border border-slate-200/80 max-w-md w-full p-8 text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner border border-emerald-100">
              <CheckCircle weight="fill" className="text-4xl" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 mb-2 tracking-tight">{txt.success_title}</h2>
            <p className="text-slate-500 font-medium mb-6 leading-relaxed text-xs sm:text-sm">
              {txt.success_desc}
            </p>
            <a
              href={`https://wa.me/918262802961?text=${encodeURIComponent(`नमस्कार ओंकार सर, मी Dukaan360 वर नवीन दुकानाची नोंदणी केली आहे.\nदुकानाचे नाव: ${formData.store_name}\nमालकाचे नाव: ${formData.owner_name}\nमोबाईल: ${formData.mobile}\nपत्ता: ${formData.address || 'N/A'}\n\nकृपया माझे खाते ॲप्रूव्ह (Approve) करा. धन्यवाद!`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full mb-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl py-3 shadow-md shadow-emerald-600/20 transition-all text-xs sm:text-sm cursor-pointer"
            >
              <WhatsappLogo weight="fill" className="text-xl" />
              <span>सुपर ॲडमिनला WhatsApp वर सूचना पाठवा</span>
            </a>
            <Link 
              to="/login" 
              className="inline-flex items-center justify-center gap-2 w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-black rounded-xl py-3 border border-slate-200 transition-all text-xs sm:text-sm cursor-pointer"
            >
              <span>{txt.return_to_login}</span>
              <ArrowRight weight="bold" />
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen lg:h-screen w-full bg-[#F4F7FE] flex flex-col relative overflow-y-auto lg:overflow-hidden font-sans select-none">
      
      {/* ================= ANIMATED BACKGROUND SYSTEM ================= */}
      {/* 1. Fluid Ambient Blobs (Continuous sinusoidal motion) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[12%] -left-[8%] w-[520px] sm:w-[650px] h-[520px] sm:h-[650px] bg-gradient-to-tr from-[#FF5722]/25 via-[#FF8A65]/20 to-amber-400/20 rounded-full blur-[100px] animate-blob-1"></div>
        <div className="absolute -bottom-[15%] -right-[8%] w-[560px] sm:w-[700px] h-[560px] sm:h-[700px] bg-gradient-to-tr from-indigo-600/20 via-blue-500/20 to-purple-500/15 rounded-full blur-[110px] animate-blob-2"></div>
        <div className="absolute top-[20%] -right-[6%] w-[420px] sm:w-[520px] h-[420px] sm:h-[520px] bg-gradient-to-tr from-cyan-400/20 via-sky-500/15 to-blue-500/15 rounded-full blur-[90px] animate-blob-3"></div>
        <div className="absolute -bottom-[10%] left-[22%] w-[380px] sm:w-[480px] h-[380px] sm:h-[480px] bg-gradient-to-tr from-rose-400/20 via-orange-400/15 to-amber-300/15 rounded-full blur-[85px] animate-blob-4"></div>
      </div>

      {/* 2. Animated Tech Dot Grid Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none z-0 opacity-40 animate-grid-pan"
        style={{
          backgroundImage: 'radial-gradient(#64748B 1.2px, transparent 1.2px)',
          backgroundSize: '24px 24px',
          maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,0.85) 20%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,0.85) 20%, transparent 75%)'
        }}
      ></div>

      {/* ================= FULL-WIDTH GLOBAL TOP NAVBAR ================= */}
      <header className="relative z-20 w-full h-14 sm:h-16 px-3 sm:px-6 lg:px-8 bg-white/85 backdrop-blur-md border-b border-slate-200/80 flex items-center justify-between shrink-0 shadow-xs">
        {/* Brand & Badge */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-[#FF5722] to-[#FFA726] flex items-center justify-center text-white shadow-md shadow-orange-500/25 shrink-0">
            <Storefront weight="fill" className="text-xl sm:text-2xl" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-900 leading-none">
                Dukaan360
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full">
                <Sparkle weight="fill" className="text-xs text-emerald-500" />
                <span>{txt.right_badge}</span>
              </span>
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5 sm:hidden">
              {txt.right_brand_sub}
            </p>
          </div>
        </div>

        {/* Action Controls: 3-Language Selector & Back to Login */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <LanguageControl variant="auth" />

          <Link 
            to="/login"
            className="text-xs sm:text-sm font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl transition flex items-center gap-1.5 border border-slate-200/60 shadow-2xs shrink-0 whitespace-nowrap"
          >
            <ArrowLeft weight="bold" className="text-sm" />
            <span className="hidden sm:inline">{txt.return_to_login}</span>
            <span className="sm:hidden font-bold">लॉगिन</span>
          </Link>
        </div>
      </header>

      {/* ================= FULL-PAGE WORKSPACE ================= */}
      <main className="relative z-10 flex-1 w-full max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-6 flex flex-col lg:flex-row gap-6 items-center lg:items-stretch overflow-visible lg:overflow-hidden">
        
        {/* LEFT COLUMN: Spacious Registration Form */}
        <div className="w-full max-w-xl lg:max-w-none lg:w-[56%] bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-200/50 p-5 sm:p-7 lg:p-8 flex flex-col justify-between my-auto lg:my-0 lg:h-full relative">
          
          <div className="w-full max-w-[560px] mx-auto flex flex-col justify-between h-full">
            
            {/* Header Title */}
            <div>
              <div className="lg:hidden inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-xs font-bold text-[#FF5722] mb-1">
                <Sparkle weight="fill" className="text-xs" />
                <span>१ महिना मोफत ट्रायल • ₹0</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                {txt.create_account} <span className="text-xl">🚀</span>
              </h2>
              <div className="h-1.5 w-14 bg-gradient-to-r from-[#FF5722] to-[#FF8A65] rounded-full mt-1.5"></div>
              <p className="text-slate-500 font-medium mt-1 text-xs sm:text-sm">{txt.right_desc}</p>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl my-2 text-xs sm:text-sm font-bold flex items-start gap-2 shadow-xs">
                <WarningCircle weight="fill" className="text-base shrink-0 mt-0.5" />
                <p className="leading-snug">{error}</p>
              </div>
            )}

            {/* The Form */}
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 my-auto py-2">
              
              {/* Row 1: Store & Owner Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-black text-slate-700 uppercase tracking-wider mb-1">
                    {txt.store_name}
                  </label>
                  <div className="relative group">
                    <Buildings className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg group-focus-within:text-[#FF5722] transition-colors" />
                    <input 
                      required 
                      type="text" 
                      value={formData.store_name} 
                      onChange={e => setFormData({...formData, store_name: e.target.value})}
                      className="w-full h-12 bg-slate-50 border-2 border-slate-200 rounded-xl pl-10 pr-3 text-sm sm:text-base font-bold text-slate-800 outline-none focus:bg-white focus:border-[#FF5722] focus:shadow-[0_0_0_4px_rgba(255,87,34,0.12)] transition-all placeholder:font-normal placeholder:text-slate-400"
                      placeholder={txt.store_name_placeholder}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-black text-slate-700 uppercase tracking-wider mb-1">
                    {txt.owner_name}
                  </label>
                  <div className="relative group">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg group-focus-within:text-[#FF5722] transition-colors" />
                    <input 
                      required 
                      type="text" 
                      value={formData.owner_name} 
                      onChange={e => setFormData({...formData, owner_name: e.target.value})}
                      className="w-full h-12 bg-slate-50 border-2 border-slate-200 rounded-xl pl-10 pr-3 text-sm sm:text-base font-bold text-slate-800 outline-none focus:bg-white focus:border-[#FF5722] focus:shadow-[0_0_0_4px_rgba(255,87,34,0.12)] transition-all placeholder:font-normal placeholder:text-slate-400"
                      placeholder={txt.owner_name_placeholder}
                    />
                  </div>
                </div>
              </div>

              {/* Row 2: Mobile & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-black text-slate-700 uppercase tracking-wider mb-1">
                    {txt.mobile}
                  </label>
                  <div className="relative group">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg group-focus-within:text-[#FF5722] transition-colors" />
                    <input 
                      required 
                      type="tel" 
                      maxLength="10" 
                      value={formData.mobile} 
                      onChange={e => setFormData({...formData, mobile: e.target.value.replace(/\D/g, '')})}
                      className="w-full h-12 bg-slate-50 border-2 border-slate-200 rounded-xl pl-10 pr-3 text-sm sm:text-base font-bold text-slate-800 outline-none focus:bg-white focus:border-[#FF5722] focus:shadow-[0_0_0_4px_rgba(255,87,34,0.12)] transition-all placeholder:font-normal placeholder:text-slate-400"
                      placeholder={txt.mobile_placeholder}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs sm:text-sm font-black text-slate-700 uppercase tracking-wider">
                      {txt.email}
                    </label>
                    <span className="text-[10px] text-[#FF5722] font-black">{txt.email_otp_badge}</span>
                  </div>
                  <div className="relative group">
                    <EnvelopeSimple className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg group-focus-within:text-[#FF5722] transition-colors" />
                    <input 
                      required 
                      type="email" 
                      value={formData.email} 
                      onChange={e => setFormData({...formData, email: e.target.value.toLowerCase().trim()})}
                      className="w-full h-12 bg-slate-50 border-2 border-slate-200 rounded-xl pl-10 pr-3 text-sm sm:text-base font-bold text-slate-800 outline-none focus:bg-white focus:border-[#FF5722] focus:shadow-[0_0_0_4px_rgba(255,87,34,0.12)] transition-all placeholder:font-normal placeholder:text-slate-400"
                      placeholder={txt.email_placeholder}
                    />
                  </div>
                </div>
              </div>

              {/* Row 3: Password & Subscription Plan (1 Month Free ₹0) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-black text-slate-700 uppercase tracking-wider mb-1">
                    {txt.password}
                  </label>
                  <div className="relative group">
                    <LockKey className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg group-focus-within:text-[#FF5722] transition-colors" />
                    <input 
                      required 
                      type="password" 
                      value={formData.password} 
                      onChange={e => setFormData({...formData, password: e.target.value})}
                      className="w-full h-12 bg-slate-50 border-2 border-slate-200 rounded-xl pl-10 pr-3 text-sm sm:text-base font-bold text-slate-800 outline-none focus:bg-white focus:border-[#FF5722] focus:shadow-[0_0_0_4px_rgba(255,87,34,0.12)] transition-all placeholder:font-normal placeholder:text-slate-400"
                      placeholder={txt.password_placeholder}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs sm:text-sm font-black text-slate-700 uppercase tracking-wider">
                      {txt.plan_label}
                    </label>
                    <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                      {txt.free_tag}
                    </span>
                  </div>
                  <div className="w-full h-12 bg-orange-50/70 border-2 border-orange-200 rounded-xl px-3 flex items-center justify-between shadow-2xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#FF5722] animate-pulse shrink-0"></span>
                      <span className="text-xs sm:text-sm font-black text-slate-800 truncate">
                        {txt.free_plan_display}
                      </span>
                    </div>
                    <span className="text-xs font-black text-[#FF5722] bg-white px-2.5 py-1 rounded-md border border-orange-200 shrink-0 shadow-2xs">
                      {txt.free_price}
                    </span>
                  </div>
                  <input type="hidden" name="plan_type" value="1 Month" />
                </div>
              </div>

              {/* Row 4: Shop Address */}
              <div>
                <label className="block text-xs sm:text-sm font-black text-slate-700 uppercase tracking-wider mb-1">
                  {txt.address}
                </label>
                <div className="relative group">
                  <MapPin className="absolute left-3 top-3 text-slate-400 text-lg group-focus-within:text-[#FF5722] transition-colors" />
                  <textarea 
                    required 
                    rows="2" 
                    value={formData.address} 
                    onChange={e => setFormData({...formData, address: e.target.value})}
                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl pl-10 pr-3 py-2 text-sm sm:text-base font-semibold text-slate-800 outline-none focus:bg-white focus:border-[#FF5722] focus:shadow-[0_0_0_4px_rgba(255,87,34,0.12)] transition-all resize-none placeholder:font-normal placeholder:text-slate-400 leading-relaxed"
                    placeholder={txt.address_placeholder}
                  ></textarea>
                </div>
              </div>

              {/* Row 5: Submit Button */}
              <button 
                type="submit" 
                disabled={loading}
                className="w-full h-12 sm:h-13 bg-gradient-to-r from-[#FF5722] to-[#FF7043] hover:from-[#E64A19] hover:to-[#FF5722] text-white font-black rounded-xl transition-all shadow-[0_8px_20px_rgba(255,87,34,0.22)] active:scale-98 disabled:opacity-70 flex justify-center items-center gap-2 text-sm sm:text-base cursor-pointer"
              >
                {loading ? (
                  <>
                    <CircleNotch className="animate-spin text-lg" />
                    <span>{txt.submitting}</span>
                  </>
                ) : (
                  <>
                    <span>{txt.register_btn}</span>
                    <ArrowRight weight="bold" className="text-lg" />
                  </>
                )}
              </button>
            </form>

            {/* Bottom Footer & Login Link */}
            <div className="pt-2 text-center text-xs sm:text-sm">
              <p className="text-slate-600 font-medium">
                {txt.already_registered}{' '}
                <Link to="/login" className="text-[#FF5722] font-black hover:underline underline-offset-4">
                  {txt.sign_in_instead}
                </Link>
              </p>
            </div>

          </div>

        </div>

        {/* RIGHT COLUMN: Executive Dark Slate-900 Perks & Guide (DESKTOP ONLY) */}
        <div className="hidden lg:flex lg:w-[44%] bg-slate-900 rounded-2xl border border-slate-800 shadow-xl p-4 sm:p-5 lg:p-6 text-white flex-col justify-between h-full overflow-hidden relative">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_2px_2px,white_1px,transparent_0)] bg-[length:24px_24px] pointer-events-none"></div>

          {/* Top: Headline & ₹0 Badge */}
          <div className="relative z-10 space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white leading-tight">
                  {txt.right_title}
                </h3>
                <span className="text-[10px] font-black text-[#FF5722] bg-[#FF5722]/15 border border-[#FF5722]/30 px-2 py-0.5 rounded-full">
                  ₹0
                </span>
              </div>
              <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Sparkle weight="fill" className="text-xs" />
                <span>{txt.right_badge}</span>
              </span>
            </div>
            <p className="text-slate-400 font-medium text-[11px] leading-relaxed">
              {txt.right_desc}
            </p>
          </div>

          {/* Middle 1: Trial Features Grid (4 Perks) */}
          <div className="relative z-10 bg-slate-800/60 border border-slate-700/60 rounded-xl p-2.5 sm:p-3 my-auto">
            <p className="text-[10px] font-black uppercase tracking-wider text-amber-400 mb-2 flex items-center gap-1.5">
              <Lightning weight="fill" className="text-xs" />
              <span>{txt.trial_features_title}</span>
            </p>
            <div className="grid grid-cols-2 gap-2">
              {txt.features?.map((f, idx) => (
                <div key={idx} className="bg-slate-900/60 border border-slate-750 rounded-xl p-2 transition-all hover:border-slate-600">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-xs">{f.icon}</span>
                    <span className="text-[10.5px] font-black text-slate-200 truncate">{f.title}</span>
                  </div>
                  <p className="text-[9.5px] text-slate-400 leading-tight line-clamp-1">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Middle 2: 3-Step Guide (What to do after trial ends) */}
          <div className="relative z-10 bg-slate-800/90 border border-slate-700/80 rounded-xl p-2.5 sm:p-3 space-y-2">
            <div className="flex items-center gap-1.5 text-orange-400 font-black text-[11px]">
              <Sparkle weight="fill" className="text-xs shrink-0 animate-pulse" />
              <span>{txt.after_trial_title}</span>
            </div>

            <div className="space-y-1.5 text-[10px] sm:text-[10.5px]">
              <div className="flex items-start gap-2">
                <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">
                  १
                </div>
                <div>
                  <p className="font-black text-slate-200 leading-tight">{txt.step1_title}</p>
                  <p className="text-slate-400 text-[9.5px] leading-tight mt-0.5">
                    {txt.step1_desc}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <div className="w-4 h-4 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">
                  २
                </div>
                <div>
                  <p className="font-black text-slate-200 leading-tight">{txt.step2_title}</p>
                  <p className="text-slate-400 text-[9.5px] leading-tight mt-0.5">
                    {txt.step2_desc}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <div className="w-4 h-4 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">
                  ३
                </div>
                <div>
                  <p className="font-black text-slate-200 leading-tight">{txt.step3_title}</p>
                  <p className="text-slate-400 text-[9.5px] leading-tight mt-0.5">
                    {txt.step3_desc}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick WhatsApp Support Help strip */}
          <div className="relative z-10 bg-emerald-950/40 border border-emerald-800/50 rounded-xl px-3 py-1.5 flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-5 h-5 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <WhatsappLogo weight="fill" className="text-xs" />
              </div>
              <p className="text-slate-300 font-medium text-[10px] truncate">{txt.support_text}</p>
            </div>
            <a 
              href={`https://wa.me/91${txt.support_phone}?text=Hello%20Dukaan360%20Support`}
              target="_blank"
              rel="noreferrer"
              className="text-[10px] font-black text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 px-2.5 py-0.5 rounded-lg border border-emerald-500/30 transition-all shrink-0 ml-2"
            >
              +{txt.support_phone} ↗
            </a>
          </div>

          {/* Bottom Trust Badges */}
          <div className="relative z-10 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400 font-medium">
            <span className="flex items-center gap-1">
              <CheckCircle weight="fill" className="text-emerald-400 text-xs shrink-0" />
              <span>{txt.badge_no_setup}</span>
            </span>
            <span className="flex items-center gap-1">
              <ShieldCheck weight="fill" className="text-blue-400 text-xs shrink-0" />
              <span>{txt.badge_cloud_safe}</span>
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle weight="fill" className="text-emerald-400 text-xs shrink-0" />
              <span>{txt.badge_no_cc}</span>
            </span>
          </div>

        </div>

      </main>

      {/* CSS Keyframes for Fluid Blobs & Tech Dot Grid */}
      <style>{`
        /* Continuous Fluid Aurora Blobs */
        @keyframes blob-float-1 {
          0%, 100% { transform: translate(0px, 0px) scale(1) rotate(0deg); }
          33% { transform: translate(65px, -55px) scale(1.1) rotate(6deg); }
          66% { transform: translate(-45px, 45px) scale(0.92) rotate(-5deg); }
        }
        @keyframes blob-float-2 {
          0%, 100% { transform: translate(0px, 0px) scale(1) rotate(0deg); }
          33% { transform: translate(-70px, 65px) scale(1.12) rotate(-7deg); }
          66% { transform: translate(55px, -50px) scale(0.88) rotate(6deg); }
        }
        @keyframes blob-float-3 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(60px, 50px) scale(1.14); }
        }
        @keyframes blob-float-4 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(-55px, -45px) scale(1.1); }
        }
        .animate-blob-1 { animation: blob-float-1 18s ease-in-out infinite; will-change: transform; }
        .animate-blob-2 { animation: blob-float-2 22s ease-in-out infinite; will-change: transform; }
        .animate-blob-3 { animation: blob-float-3 16s ease-in-out infinite; will-change: transform; }
        .animate-blob-4 { animation: blob-float-4 20s ease-in-out infinite; will-change: transform; }

        /* Tech Dot Grid Drift */
        @keyframes grid-drift {
          0% { background-position: 0px 0px; }
          100% { background-position: 48px 48px; }
        }
        .animate-grid-pan { animation: grid-drift 26s linear infinite; }
      `}</style>

    </div>
  );
};

export default Register;
