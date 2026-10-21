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
      <div className="h-screen w-full bg-[#F8FAFC] flex flex-col relative overflow-hidden font-sans select-none">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-[12%] -left-[8%] w-[520px] h-[520px] bg-gradient-to-tr from-[#FF5722]/20 to-amber-400/20 rounded-full blur-[100px]"></div>
          <div className="absolute -bottom-[15%] -right-[8%] w-[560px] h-[560px] bg-gradient-to-tr from-indigo-600/15 to-purple-500/15 rounded-full blur-[110px]"></div>
        </div>

        {/* Global Navbar */}
        <header className="relative z-20 w-full h-15 px-4 sm:px-8 bg-white/80 backdrop-blur-md border-b border-slate-200/80 flex items-center justify-between shrink-0 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#FF5722] to-[#FFA726] flex items-center justify-center text-white shadow-md shadow-orange-500/25">
              <Storefront weight="fill" className="text-xl" />
            </div>
            <h1 className="text-lg font-black tracking-tight text-slate-900 leading-none">Dukaan360</h1>
          </div>
          <LanguageControl variant="auth" />
        </header>

        {/* Success Modal Card in Center */}
        <main className="relative z-10 flex-1 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/80 max-w-md w-full p-6 sm:p-8 text-center animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner border border-emerald-100">
              <CheckCircle weight="fill" className="text-3xl" />
            </div>
            <h2 className="text-lg sm:text-xl font-black text-slate-800 mb-1.5 tracking-tight">{txt.success_title}</h2>
            <p className="text-slate-500 font-medium mb-5 leading-relaxed text-xs sm:text-sm">
              {txt.success_desc}
            </p>
            <a
              href={`https://wa.me/918262802961?text=${encodeURIComponent(`नमस्कार ओंकार सर, मी Dukaan360 वर नवीन दुकानाची नोंदणी केली आहे.\nदुकानाचे नाव: ${formData.store_name}\nमालकाचे नाव: ${formData.owner_name}\nमोबाईल: ${formData.mobile}\nपत्ता: ${formData.address || 'N/A'}\n\nकृपया माझे खाते ॲप्रूव्ह (Approve) करा. धन्यवाद!`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full mb-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl py-2.5 shadow-md shadow-emerald-600/20 transition-all text-xs sm:text-sm cursor-pointer"
            >
              <WhatsappLogo weight="fill" className="text-lg" />
              <span>सुपर ॲडमिनला WhatsApp वर सूचना पाठवा</span>
            </a>
            <Link 
              to="/login" 
              className="inline-flex items-center justify-center gap-2 w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-black rounded-xl py-2.5 border border-slate-200 transition-all text-xs sm:text-sm cursor-pointer"
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
    <div className="h-screen w-full bg-[#F8FAFC] flex flex-col lg:flex-row overflow-hidden font-sans select-none">
      
      {/* ================= LEFT COLUMN: Executive Dark Showcase (42% on Desktop) ================= */}
      <div className="hidden lg:flex lg:w-[42%] xl:w-[40%] bg-gradient-to-br from-[#0A0E1A] via-[#0F172A] to-[#1E1B4B] p-8 xl:p-11 text-white flex-col justify-between relative overflow-hidden border-r border-slate-800/80 shrink-0 select-none">
        
        {/* Ambient Background Grid Pattern */}
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
                Dukaan360
              </h1>
              <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                {txt.right_badge}
              </span>
            </div>
            <p className="text-[11px] font-semibold text-slate-400 mt-1">
              Cloud POS & Retail Suite
            </p>
          </div>
        </div>

        {/* Middle: Trial Pitch, 4 Feature Bento Pills, 3-Point Guarantee */}
        <div className="relative z-10 my-auto py-4 space-y-4">
          
          {/* Header & ₹0 Badge */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-lg xl:text-xl font-black text-white tracking-tight">
                  {txt.right_title}
                </h3>
                <span className="text-xs font-black text-[#FF5722] bg-[#FF5722]/15 border border-[#FF5722]/30 px-2.5 py-0.5 rounded-full">
                  ₹0 शुल्क
                </span>
              </div>
              <span className="text-[11px] font-bold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Sparkle weight="fill" className="text-xs" />
                <span>ऑल-इन-वन ॲक्सेस</span>
              </span>
            </div>
            <p className="text-slate-300 font-medium text-xs leading-relaxed">
              {txt.right_desc}
            </p>
          </div>

          {/* 4 Feature Pills Grid */}
          <div className="space-y-2">
            <p className="text-[11px] font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Lightning weight="fill" className="text-xs" />
              <span>{txt.trial_features_title}</span>
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              {txt.features?.map((f, idx) => (
                <div key={idx} className="bg-white/[0.05] hover:bg-white/[0.08] border border-white/10 rounded-xl p-2.5 transition-all shadow-xs group backdrop-blur-xs">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-base group-hover:scale-110 transition-transform">{f.icon}</span>
                    <span className="text-xs font-bold text-slate-200 truncate">{f.title}</span>
                  </div>
                  <p className="text-[10.5px] text-slate-400 leading-snug">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 3-Point Guarantee (After Trial) */}
          <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-3.5 space-y-2 backdrop-blur-xs">
            <div className="flex items-center gap-1.5 text-orange-400 font-black text-xs">
              <Sparkle weight="fill" className="text-xs shrink-0" />
              <span>{txt.after_trial_title}</span>
            </div>

            <div className="space-y-1.5 text-[11px]">
              <div className="flex items-start gap-2">
                <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">
                  ✓
                </div>
                <div className="leading-tight">
                  <span className="font-bold text-slate-200">{txt.step1_title} — </span>
                  <span className="text-slate-400">{txt.step1_desc}</span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <div className="w-4 h-4 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">
                  ✓
                </div>
                <div className="leading-tight">
                  <span className="font-bold text-slate-200">{txt.step2_title} — </span>
                  <span className="text-slate-400">{txt.step2_desc}</span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <div className="w-4 h-4 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">
                  ✓
                </div>
                <div className="leading-tight">
                  <span className="font-bold text-slate-200">{txt.step3_title} — </span>
                  <span className="text-slate-400">{txt.step3_desc}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Direct WhatsApp Founder Support */}
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-2.5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-200">
              <WhatsappLogo weight="fill" className="text-emerald-400 text-lg shrink-0" />
              <span className="font-medium text-[11px]">{txt.support_text}</span>
            </div>
            <a 
              href={`https://wa.me/91${txt.support_phone}?text=Hello%20Dukaan360%20Support`}
              target="_blank"
              rel="noreferrer"
              className="font-bold text-emerald-400 hover:text-emerald-300 bg-emerald-500/15 hover:bg-emerald-500/25 px-2.5 py-1 rounded-lg border border-emerald-500/30 transition-all text-xs shadow-2xs"
            >
              +{txt.support_phone} ↗
            </a>
          </div>

        </div>

        {/* Bottom: Trust Badges */}
        <div className="relative z-10 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400 font-medium">
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

      {/* ================= RIGHT COLUMN: Modern Registration Canvas (58% on Desktop) ================= */}
      <div className="flex-1 bg-[#F8FAFC] flex flex-col justify-between p-5 sm:p-8 lg:p-10 xl:p-12 overflow-y-auto relative">
        
        {/* Top Bar: Mobile Brand Header & Language Switcher / Login Link */}
        <div className="w-full flex items-center justify-between shrink-0 mb-auto pb-3">
          {/* Mobile Only Brand */}
          <div className="lg:hidden flex items-center gap-2">
            <div className="w-8.5 h-8.5 rounded-xl bg-gradient-to-tr from-[#FF5722] to-[#FFA726] flex items-center justify-center text-white shadow-md shadow-orange-500/25">
              <Storefront weight="fill" className="text-lg" />
            </div>
            <span className="text-lg font-black tracking-tight text-slate-900">Dukaan360</span>
          </div>

          {/* Action Controls: 3-Language Selector & Back to Login */}
          <div className="flex items-center gap-2.5 ml-auto">
            <LanguageControl variant="auth" />

            <Link 
              to="/login"
              className="text-xs font-bold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 px-3.5 py-1.5 rounded-xl transition flex items-center gap-1.5 border border-slate-200/80 shadow-2xs shrink-0 whitespace-nowrap"
            >
              <ArrowLeft weight="bold" className="text-xs" />
              <span className="hidden sm:inline">{txt.return_to_login}</span>
              <span className="sm:hidden font-bold">लॉगिन</span>
            </Link>
          </div>
        </div>

        {/* Center: Focused Registration Form Canvas */}
        <div className="w-full max-w-[500px] mx-auto my-auto py-3 sm:py-5 space-y-3.5">
          
          {/* Header Title */}
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200/70 text-xs font-black text-[#FF5722] mb-1.5 shadow-2xs">
              <Sparkle weight="fill" className="text-xs text-[#FF5722]" />
              <span>३० दिवस मोफत Pro ॲक्सेस • ₹० शुल्क</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight flex items-center gap-2">
              {txt.create_account} <span className="text-2xl sm:text-3xl">🚀</span>
            </h2>
            <div className="h-1 w-12 bg-gradient-to-r from-[#FF5722] via-[#FF8A65] to-amber-400 rounded-full mt-2"></div>
            <p className="text-slate-500 font-medium mt-2 text-xs sm:text-sm leading-relaxed">
              {txt.right_desc}
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl text-xs font-bold flex items-start gap-2 shadow-xs animate-in fade-in">
              <WarningCircle weight="fill" className="text-base shrink-0 mt-0.5" />
              <p className="leading-snug">{error}</p>
            </div>
          )}

          {/* The Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            
            {/* Row 1: Store & Owner Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {txt.store_name}
                </label>
                <div className="relative group">
                  <Buildings className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg group-focus-within:text-[#FF5722] transition-colors duration-200 pointer-events-none" />
                  <input 
                    required 
                    type="text" 
                    value={formData.store_name} 
                    onChange={e => setFormData({...formData, store_name: e.target.value})}
                    className="w-full h-11 bg-white border border-slate-250 hover:border-slate-350 rounded-xl pl-10.5 pr-3 text-xs sm:text-sm font-semibold text-slate-800 outline-none focus:border-[#FF5722] focus:ring-4 focus:ring-[#FF5722]/10 transition-all placeholder:font-normal placeholder:text-slate-400 shadow-2xs"
                    placeholder={txt.store_name_placeholder}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {txt.owner_name}
                </label>
                <div className="relative group">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg group-focus-within:text-[#FF5722] transition-colors duration-200 pointer-events-none" />
                  <input 
                    required 
                    type="text" 
                    value={formData.owner_name} 
                    onChange={e => setFormData({...formData, owner_name: e.target.value})}
                    className="w-full h-11 bg-white border border-slate-250 hover:border-slate-350 rounded-xl pl-10.5 pr-3 text-xs sm:text-sm font-semibold text-slate-800 outline-none focus:border-[#FF5722] focus:ring-4 focus:ring-[#FF5722]/10 transition-all placeholder:font-normal placeholder:text-slate-400 shadow-2xs"
                    placeholder={txt.owner_name_placeholder}
                  />
                </div>
              </div>
            </div>

            {/* Row 2: Mobile & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {txt.mobile}
                </label>
                <div className="relative group">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg group-focus-within:text-[#FF5722] transition-colors duration-200 pointer-events-none" />
                  <input 
                    required 
                    type="tel" 
                    maxLength="10" 
                    value={formData.mobile} 
                    onChange={e => setFormData({...formData, mobile: e.target.value.replace(/\D/g, '')})}
                    className="w-full h-11 bg-white border border-slate-250 hover:border-slate-350 rounded-xl pl-10.5 pr-3 text-xs sm:text-sm font-semibold text-slate-800 outline-none focus:border-[#FF5722] focus:ring-4 focus:ring-[#FF5722]/10 transition-all placeholder:font-normal placeholder:text-slate-400 shadow-2xs"
                    placeholder={txt.mobile_placeholder}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    {txt.email}
                  </label>
                  <span className="text-[10px] text-[#FF5722] font-black">{txt.email_otp_badge}</span>
                </div>
                <div className="relative group">
                  <EnvelopeSimple className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg group-focus-within:text-[#FF5722] transition-colors duration-200 pointer-events-none" />
                  <input 
                    required 
                    type="email" 
                    value={formData.email} 
                    onChange={e => setFormData({...formData, email: e.target.value.toLowerCase().trim()})}
                    className="w-full h-11 bg-white border border-slate-250 hover:border-slate-350 rounded-xl pl-10.5 pr-3 text-xs sm:text-sm font-semibold text-slate-800 outline-none focus:border-[#FF5722] focus:ring-4 focus:ring-[#FF5722]/10 transition-all placeholder:font-normal placeholder:text-slate-400 shadow-2xs"
                    placeholder={txt.email_placeholder}
                  />
                </div>
              </div>
            </div>

            {/* Row 3: Password & Shop Address */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {txt.password}
                </label>
                <div className="relative group">
                  <LockKey className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg group-focus-within:text-[#FF5722] transition-colors duration-200 pointer-events-none" />
                  <input 
                    required 
                    type="password" 
                    value={formData.password} 
                    onChange={e => setFormData({...formData, password: e.target.value})}
                    className="w-full h-11 bg-white border border-slate-250 hover:border-slate-350 rounded-xl pl-10.5 pr-3 text-xs sm:text-sm font-semibold text-slate-800 outline-none focus:border-[#FF5722] focus:ring-4 focus:ring-[#FF5722]/10 transition-all placeholder:font-normal placeholder:text-slate-400 shadow-2xs"
                    placeholder={txt.password_placeholder}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {txt.address}
                </label>
                <div className="relative group">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg group-focus-within:text-[#FF5722] transition-colors duration-200 pointer-events-none" />
                  <input 
                    required 
                    type="text" 
                    value={formData.address} 
                    onChange={e => setFormData({...formData, address: e.target.value})}
                    className="w-full h-11 bg-white border border-slate-250 hover:border-slate-350 rounded-xl pl-10.5 pr-3 text-xs sm:text-sm font-semibold text-slate-800 outline-none focus:border-[#FF5722] focus:ring-4 focus:ring-[#FF5722]/10 transition-all placeholder:font-normal placeholder:text-slate-400 shadow-2xs"
                    placeholder={txt.address_placeholder}
                  />
                </div>
              </div>
            </div>

            {/* Free Trial Guarantee Pill */}
            <div className="bg-gradient-to-r from-orange-50/90 via-amber-50/60 to-orange-50/90 border border-orange-200/80 rounded-xl px-4 py-2.5 flex items-center justify-between shadow-2xs">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
                <span className="text-xs font-bold text-slate-800 truncate">
                  {txt.free_plan_display}
                </span>
              </div>
              <span className="text-xs font-black text-[#FF5722] bg-white px-2.5 py-0.5 rounded-lg border border-orange-200/80 shadow-2xs shrink-0">
                {txt.free_price}
              </span>
              <input type="hidden" name="plan_type" value="1 Month" />
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full h-11.5 bg-gradient-to-r from-[#FF5722] via-[#FF6E40] to-[#FF8A65] hover:from-[#E64A19] hover:to-[#FF5722] text-white font-black rounded-xl transition-all duration-200 shadow-[0_6px_20px_rgba(255,87,34,0.3)] hover:shadow-[0_8px_25px_rgba(255,87,34,0.42)] active:scale-[0.99] disabled:opacity-70 flex justify-center items-center gap-2 text-sm cursor-pointer mt-1"
            >
              {loading ? (
                <>
                  <CircleNotch className="animate-spin text-lg" />
                  <span>{txt.submitting}</span>
                </>
              ) : (
                <>
                  <span>{txt.register_btn.replace('→', '').trim()}</span>
                  <ArrowRight weight="bold" className="text-base" />
                </>
              )}
            </button>
          </form>

          {/* Bottom Footer & Login Link */}
          <div className="pt-2 text-center text-xs sm:text-sm">
            <p className="text-slate-600 font-medium">
              {txt.already_registered}{' '}
              <Link to="/login" className="text-[#FF5722] font-black hover:text-[#E64A19] hover:underline underline-offset-4 ml-1 transition">
                {txt.sign_in_instead}
              </Link>
            </p>
          </div>

        </div>

        {/* Bottom Security Footer */}
        <div className="w-full max-w-[500px] mx-auto pt-4 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-400 font-medium shrink-0 mt-auto">
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

    </div>
  );
};

export default Register;
