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
  CircleNotch,
  Package,
  ChartLineUp
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
      <div className="h-screen w-full bg-[#FAF5F0] flex flex-col justify-between overflow-hidden font-sans select-none relative">
        <div className="absolute -top-[12%] -left-[8%] w-[480px] h-[480px] bg-gradient-to-tr from-[#FF5722]/15 to-amber-400/10 rounded-full blur-[90px] pointer-events-none"></div>

        <header className="relative z-20 w-full max-w-[1040px] mx-auto pt-3 px-4 shrink-0">
          <div className="w-full h-12 px-4 bg-white/80 backdrop-blur-xl border border-white/90 rounded-2xl flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FF5722] via-[#FF6E40] to-[#FFA726] flex items-center justify-center text-white shadow-sm shadow-orange-500/25">
                <Storefront weight="fill" className="text-lg" />
              </div>
              <h1 className="text-base font-black tracking-tight text-slate-900 leading-none">Dukaan360</h1>
            </div>
            <LanguageControl variant="auth" />
          </div>
        </header>

        <main className="relative z-10 flex-1 flex items-center justify-center p-4">
          <div className="bg-white/95 backdrop-blur-2xl rounded-3xl shadow-xl border border-orange-100 max-w-md w-full p-6 sm:p-7 text-center animate-in zoom-in-95 duration-200">
            <div className="w-13 h-13 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner border border-emerald-100">
              <CheckCircle weight="fill" className="text-3xl" />
            </div>
            <h2 className="text-lg sm:text-xl font-black text-slate-800 mb-1 tracking-tight">{txt.success_title}</h2>
            <p className="text-slate-500 font-medium mb-4 leading-relaxed text-xs">
              {txt.success_desc}
            </p>
            <a
              href={`https://wa.me/918262802961?text=${encodeURIComponent(`नमस्कार ओंकार सर, मी Dukaan360 वर नवीन दुकानाची नोंदणी केली आहे.\nदुकानाचे नाव: ${formData.store_name}\nमालकाचे नाव: ${formData.owner_name}\nमोबाईल: ${formData.mobile}\nपत्ता: ${formData.address || 'N/A'}\n\nकृपया माझे खाते ॲप्रूव्ह (Approve) करा. धन्यवाद!`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full mb-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl py-2.5 shadow-md shadow-emerald-600/20 transition-all text-xs cursor-pointer"
            >
              <WhatsappLogo weight="fill" className="text-base" />
              <span>सुपर ॲडमिनला WhatsApp वर सूचना पाठवा</span>
            </a>
            <Link 
              to="/login" 
              className="inline-flex items-center justify-center gap-2 w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-black rounded-xl py-2.5 border border-slate-200 transition-all text-xs cursor-pointer"
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
    <div className="h-screen w-full bg-[#FAF5F0] relative flex flex-col justify-between overflow-hidden font-sans select-none">
      
      {/* ================= SOFT AMBIENT GLOW ================= */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[12%] -left-[8%] w-[480px] h-[480px] bg-gradient-to-tr from-[#FF5722]/15 via-[#FFA726]/12 to-rose-400/8 rounded-full blur-[90px]"></div>
        <div className="absolute -bottom-[12%] -right-[8%] w-[500px] h-[500px] bg-gradient-to-tr from-amber-400/12 via-[#FF7043]/12 to-orange-500/8 rounded-full blur-[100px]"></div>
      </div>

      {/* Subtle Micro Dot Pattern */}
      <div 
        className="absolute inset-0 pointer-events-none z-0 opacity-15"
        style={{
          backgroundImage: 'radial-gradient(#EA580C 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,0.8) 30%, transparent 80%)'
        }}
      ></div>

      {/* ================= FLOATING CLEAN NAVBAR ================= */}
      <header className="relative z-20 w-full max-w-[1040px] mx-auto pt-3 px-4 shrink-0">
        <div className="w-full h-12 px-4 bg-white/80 backdrop-blur-xl border border-white/90 rounded-2xl flex items-center justify-between shadow-2xs">
          
          {/* Brand Logo & Pill */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FF5722] via-[#FF6E40] to-[#FFA726] flex items-center justify-center text-white shadow-sm shadow-orange-500/25">
              <Storefront weight="fill" className="text-lg" />
            </div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-black tracking-tight text-slate-900 leading-none">
                Dukaan<span className="text-[#FF5722]">360</span>
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 text-[9.5px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full">
                <Sparkle weight="fill" className="text-[9px]" />
                <span>{txt.right_badge}</span>
              </span>
            </div>
          </div>

          {/* Action Controls */}
          <div className="flex items-center gap-2.5">
            <LanguageControl variant="auth" />

            <Link 
              to="/login" 
              className="text-xs font-bold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 px-3.5 py-1.5 rounded-xl transition flex items-center gap-1.5 border border-slate-200/80 shadow-2xs shrink-0 whitespace-nowrap"
            >
              <ArrowLeft weight="bold" className="text-xs" />
              <span className="hidden sm:inline">{txt.return_to_login}</span>
              <span className="sm:hidden font-bold">{txt.nav_login_short || txt.return_to_login}</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ================= MAIN BALANCED WORKSPACE (ZERO SCROLLING, ZERO GARDI) ================= */}
      <main className="relative z-10 flex-1 w-full max-w-[1040px] mx-auto px-4 py-2 flex items-center justify-center overflow-hidden">
        
        {/* CLEAN 2-COLUMN SUITE (SPACIOUS & UNCLUTTERED) */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center my-auto max-h-[500px]">
          
          {/* ================= LEFT COLUMN: Clean Minimalist Showcase (5 Cols) ================= */}
          <div className="hidden lg:flex lg:col-span-5 flex-col justify-between py-2 space-y-4 select-none">
            
            {/* Headline */}
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-orange-200/80 text-[11px] font-black text-[#FF5722] shadow-2xs">
                <Sparkle weight="fill" className="text-xs text-[#FF5722]" />
                <span>{txt.side_badge}</span>
              </div>

              <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-snug">
                {txt.side_title_1} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5722] via-[#FF6E40] to-[#FFA726]">
                  {txt.side_title_highlight}
                </span>
              </h2>
              <p className="text-slate-500 text-xs font-medium leading-relaxed">
                {txt.side_desc}
              </p>
            </div>

            {/* 3 Spacious Feature Cards (No cluttered grid!) */}
            <div className="space-y-2.5">
              <div className="bg-white/80 hover:bg-white border border-emerald-100/90 rounded-2xl p-2.5 flex items-center gap-3 shadow-2xs transition">
                <div className="w-8.5 h-8.5 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-base font-black shrink-0 border border-emerald-200/60">
                  <WhatsappLogo weight="fill" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-800">{txt.side_card1_title}</h4>
                  <p className="text-[10.5px] text-slate-500 font-medium">{txt.side_card1_desc}</p>
                </div>
              </div>

              <div className="bg-white/80 hover:bg-white border border-blue-100/90 rounded-2xl p-2.5 flex items-center gap-3 shadow-2xs transition">
                <div className="w-8.5 h-8.5 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-base font-black shrink-0 border border-blue-200/60">
                  <Package weight="fill" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-800">{txt.side_card2_title}</h4>
                  <p className="text-[10.5px] text-slate-500 font-medium">{txt.side_card2_desc}</p>
                </div>
              </div>

              <div className="bg-white/80 hover:bg-white border border-orange-100/90 rounded-2xl p-2.5 flex items-center gap-3 shadow-2xs transition">
                <div className="w-8.5 h-8.5 rounded-xl bg-orange-50 text-[#FF5722] flex items-center justify-center text-base font-black shrink-0 border border-orange-200/60">
                  <Lightning weight="fill" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-800">{txt.side_card3_title}</h4>
                  <p className="text-[10.5px] text-slate-500 font-medium">{txt.side_card3_desc}</p>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp Founder Support Strip */}
            <div className="pt-2 flex items-center justify-between text-xs text-slate-600 border-t border-orange-200/50">
              <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                <WhatsappLogo weight="fill" className="text-emerald-600 text-base shrink-0" />
                <span>{txt.support_text}</span>
              </div>
              <a 
                href={`https://wa.me/91${txt.support_phone}?text=Hello%20Dukaan360%20Support`}
                target="_blank"
                rel="noreferrer"
                className="font-black text-emerald-600 hover:text-emerald-700 bg-white border border-emerald-200/80 px-2.5 py-1 rounded-xl shadow-2xs transition-all text-xs"
              >
                +{txt.support_phone} ↗
              </a>
            </div>

          </div>

          {/* ================= RIGHT COLUMN: Pristine 3-Row Registration Card (7 Cols) ================= */}
          <div className="col-span-1 lg:col-span-7 w-full max-w-[460px] mx-auto">
            
            <div className="bg-white/95 backdrop-blur-2xl rounded-3xl border border-white shadow-[0_15px_40px_-10px_rgba(255,87,34,0.12),0_0_0_1px_rgba(255,255,255,0.9)] p-5 sm:p-6 relative flex flex-col justify-between">
              
              {/* Header Title */}
              <div className="mb-2">
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-50 border border-orange-200/80 text-[10px] font-black text-[#FF5722] mb-1 shadow-2xs">
                  <Sparkle weight="fill" className="text-xs text-[#FF5722]" />
                  <span>{txt.form_badge || '३० दिवस मोफत Pro ॲक्सेस • ₹० शुल्क'}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight flex items-center gap-1.5">
                  {txt.create_account} <span className="text-xl">🚀</span>
                </h2>
                <p className="text-slate-500 font-medium text-xs mt-0.5 leading-tight">
                  {txt.right_desc}
                </p>
              </div>

              {/* Error Banner */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 p-2 rounded-xl text-xs font-bold mb-2 flex items-start gap-1.5 shadow-xs animate-in fade-in">
                  <WarningCircle weight="fill" className="text-sm shrink-0 mt-0.5" />
                  <p className="leading-snug">{error}</p>
                </div>
              )}

              {/* Form with Clean 3-Row Grid */}
              <form onSubmit={handleSubmit} className="space-y-2.5">
                
                {/* Row 1: Store & Owner Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[10.5px] font-bold text-slate-700 uppercase tracking-wider mb-0.5">
                      {txt.store_name}
                    </label>
                    <div className="relative group">
                      <Buildings className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm group-focus-within:text-[#FF5722] transition-colors pointer-events-none" />
                      <input 
                        required 
                        type="text" 
                        value={formData.store_name} 
                        onChange={e => setFormData({...formData, store_name: e.target.value})}
                        className="w-full h-9.5 bg-slate-50/80 hover:bg-slate-50 border border-slate-200 rounded-xl pl-8.5 pr-2.5 text-xs font-semibold text-slate-800 outline-none focus:bg-white focus:border-[#FF5722] focus:ring-4 focus:ring-orange-500/15 transition-all placeholder:font-normal placeholder:text-slate-400 shadow-2xs"
                        placeholder={txt.store_name_placeholder}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10.5px] font-bold text-slate-700 uppercase tracking-wider mb-0.5">
                      {txt.owner_name}
                    </label>
                    <div className="relative group">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm group-focus-within:text-[#FF5722] transition-colors pointer-events-none" />
                      <input 
                        required 
                        type="text" 
                        value={formData.owner_name} 
                        onChange={e => setFormData({...formData, owner_name: e.target.value})}
                        className="w-full h-9.5 bg-slate-50/80 hover:bg-slate-50 border border-slate-200 rounded-xl pl-8.5 pr-2.5 text-xs font-semibold text-slate-800 outline-none focus:bg-white focus:border-[#FF5722] focus:ring-4 focus:ring-orange-500/15 transition-all placeholder:font-normal placeholder:text-slate-400 shadow-2xs"
                        placeholder={txt.owner_name_placeholder}
                      />
                    </div>
                  </div>
                </div>

                {/* Row 2: Mobile & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[10.5px] font-bold text-slate-700 uppercase tracking-wider mb-0.5">
                      {txt.mobile}
                    </label>
                    <div className="relative group">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm group-focus-within:text-[#FF5722] transition-colors pointer-events-none" />
                      <input 
                        required 
                        type="tel" 
                        maxLength="10" 
                        value={formData.mobile} 
                        onChange={e => setFormData({...formData, mobile: e.target.value.replace(/\D/g, '')})}
                        className="w-full h-9.5 bg-slate-50/80 hover:bg-slate-50 border border-slate-200 rounded-xl pl-8.5 pr-2.5 text-xs font-semibold text-slate-800 outline-none focus:bg-white focus:border-[#FF5722] focus:ring-4 focus:ring-orange-500/15 transition-all placeholder:font-normal placeholder:text-slate-400 shadow-2xs"
                        placeholder={txt.mobile_placeholder}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-0.5">
                      <label className="block text-[10.5px] font-bold text-slate-700 uppercase tracking-wider">
                        {txt.email}
                      </label>
                      <span className="text-[9.5px] text-[#FF5722] font-black">{txt.email_otp_badge}</span>
                    </div>
                    <div className="relative group">
                      <EnvelopeSimple className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm group-focus-within:text-[#FF5722] transition-colors pointer-events-none" />
                      <input 
                        required 
                        type="email" 
                        value={formData.email} 
                        onChange={e => setFormData({...formData, email: e.target.value.toLowerCase().trim()})}
                        className="w-full h-9.5 bg-slate-50/80 hover:bg-slate-50 border border-slate-200 rounded-xl pl-8.5 pr-2.5 text-xs font-semibold text-slate-800 outline-none focus:bg-white focus:border-[#FF5722] focus:ring-4 focus:ring-orange-500/15 transition-all placeholder:font-normal placeholder:text-slate-400 shadow-2xs"
                        placeholder={txt.email_placeholder}
                      />
                    </div>
                  </div>
                </div>

                {/* Row 3: Password & Shop Address */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[10.5px] font-bold text-slate-700 uppercase tracking-wider mb-0.5">
                      {txt.password}
                    </label>
                    <div className="relative group">
                      <LockKey className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm group-focus-within:text-[#FF5722] transition-colors pointer-events-none" />
                      <input 
                        required 
                        type="password" 
                        value={formData.password} 
                        onChange={e => setFormData({...formData, password: e.target.value})}
                        className="w-full h-9.5 bg-slate-50/80 hover:bg-slate-50 border border-slate-200 rounded-xl pl-8.5 pr-2.5 text-xs font-semibold text-slate-800 outline-none focus:bg-white focus:border-[#FF5722] focus:ring-4 focus:ring-orange-500/15 transition-all placeholder:font-normal placeholder:text-slate-400 shadow-2xs"
                        placeholder={txt.password_placeholder}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10.5px] font-bold text-slate-700 uppercase tracking-wider mb-0.5">
                      {txt.address}
                    </label>
                    <div className="relative group">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm group-focus-within:text-[#FF5722] transition-colors pointer-events-none" />
                      <input 
                        required 
                        type="text" 
                        value={formData.address} 
                        onChange={e => setFormData({...formData, address: e.target.value})}
                        className="w-full h-9.5 bg-slate-50/80 hover:bg-slate-50 border border-slate-200 rounded-xl pl-8.5 pr-2.5 text-xs font-semibold text-slate-800 outline-none focus:bg-white focus:border-[#FF5722] focus:ring-4 focus:ring-orange-500/15 transition-all placeholder:font-normal placeholder:text-slate-400 shadow-2xs"
                        placeholder={txt.address_placeholder}
                      />
                    </div>
                  </div>
                </div>

                {/* Free Trial Guarantee Pill */}
                <div className="bg-gradient-to-r from-orange-50/90 via-amber-50/60 to-orange-50/90 border border-orange-200/80 rounded-xl px-3 py-1.5 flex items-center justify-between shadow-2xs">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
                    <span className="text-[10.5px] font-bold text-slate-800 truncate">
                      {txt.free_plan_display}
                    </span>
                  </div>
                  <span className="text-[10px] font-black text-[#FF5722] bg-white px-2 py-0.5 rounded-md border border-orange-200/80 shadow-2xs shrink-0">
                    {txt.free_price}
                  </span>
                  <input type="hidden" name="plan_type" value="1 Month" />
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
                      <span>{txt.submitting}</span>
                    </>
                  ) : (
                    <>
                      <span>{txt.register_btn.replace('→', '').trim()}</span>
                      <ArrowRight weight="bold" className="text-sm" />
                    </>
                  )}
                </button>
              </form>

              {/* Bottom Footer & Login Link */}
              <div className="pt-2 text-center text-xs">
                <p className="text-slate-600 font-medium">
                  {txt.already_registered}{' '}
                  <Link to="/login" className="text-[#FF5722] font-black hover:text-[#E64A19] hover:underline underline-offset-4 ml-1 transition">
                    {txt.sign_in_instead}
                  </Link>
                </p>
              </div>

              {/* Security Badges */}
              <div className="pt-2 mt-1 border-t border-slate-100 text-center text-[11px] text-slate-400 font-medium flex items-center justify-center gap-1.5">
                <ShieldCheck weight="fill" className="text-emerald-500 text-xs" />
                <span>२५६-बिट बँक-ग्रेड डेटा सुरक्षेसह १००% क्लाउड बॅकअप</span>
              </div>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
};

export default Register;
