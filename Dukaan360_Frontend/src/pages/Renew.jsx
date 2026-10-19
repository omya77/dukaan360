import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageControl } from '../components/LanguageControl';
import { getAuthTranslations } from '../utils/authTranslations';
import { 
  Storefront, 
  CheckCircle, 
  WhatsappLogo, 
  Copy, 
  ShieldCheck, 
  Sparkle, 
  ArrowLeft, 
  CircleNotch, 
  Check, 
  Phone, 
  MagnifyingGlass, 
  X, 
  WarningCircle, 
  Clock, 
  Question,
  SealCheck
} from '@phosphor-icons/react';

const ADMIN_PHONE = '8262802961';
const ADMIN_UPI = '8262802961@upi';

const Renew = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const usernameParam = searchParams.get('username') || '';

  const { language } = useLanguage();
  const txt = getAuthTranslations(language).renew;
  const currentPlans = txt.plans;

  // Store & Search states
  const [searchQuery, setSearchQuery] = useState(usernameParam || '');
  const [storeInfo, setStoreInfo] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [searchError, setSearchError] = useState('');
  
  // Selected Plan state (Default to Business)
  const [selectedPlanId, setSelectedPlanId] = useState('Business');
  const selectedPlan = currentPlans.find(p => p.id === selectedPlanId) || currentPlans[1];

  const [copiedUpi, setCopiedUpi] = useState(false);
  const [showFaqModal, setShowFaqModal] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  const searchBoxRef = useRef(null);

  // If redirected with usernameParam, load that store immediately
  useEffect(() => {
    if (usernameParam) {
      handleSelectStore(usernameParam);
    }
  }, [usernameParam]);

  // Click outside listener for suggestions dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Live Auto-suggest on typing
  useEffect(() => {
    const trimmed = searchQuery.trim();
    if (!trimmed || storeInfo) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await axios.get(`http://localhost:8000/auth/store-search?q=${encodeURIComponent(trimmed)}`);
        setSuggestions(res.data || []);
        setShowSuggestions((res.data || []).length > 0);
      } catch (err) {
        setSuggestions([]);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery, storeInfo]);

  // Select store & fetch full renewal details
  const handleSelectStore = async (ident) => {
    if (!ident || !ident.trim()) return;
    setLoadingSearch(true);
    setSearchError('');
    setShowSuggestions(false);

    try {
      const res = await axios.get(`http://localhost:8000/auth/store-renewal-info/${encodeURIComponent(ident.trim())}`);
      if (res.data) {
        setStoreInfo(res.data);
        setSearchQuery(res.data.store_name);
      }
    } catch (err) {
      setSearchError(txt.search_error);
      setStoreInfo(null);
    } finally {
      setLoadingSearch(false);
    }
  };

  // Reset store selection
  const handleResetSearch = () => {
    setStoreInfo(null);
    setSearchQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    setSearchError('');
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(ADMIN_UPI);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  // Generate dynamic WhatsApp message matching current language
  const handleOpenWhatsApp = () => {
    if (!storeInfo) {
      setSearchError(txt.select_store_warning);
      if (searchBoxRef.current) {
        searchBoxRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    let lines = [];
    if (language === 'hi') {
      lines = [
        "*Dukaan360 POS - सब्सक्रिप्शन पेमेंट रसीद*",
        "",
        `*दुकान ID:* #${storeInfo.store_id}`,
        `*दुकान:* ${storeInfo.store_name}`,
        `*मालिक:* ${storeInfo.owner_name}`,
        `*यूज़रनेम:* @${storeInfo.username}`,
        `*पंजीकृत मोबाइल:* ${storeInfo.mobile}`,
        `*प्लान:* ${selectedPlan.name} (${selectedPlan.sub})`,
        `*राशि:* ₹${selectedPlan.price}`,
        "",
        `मैंने साथ में PhonePe / GPay पेमेंट का स्क्रीनशॉट संलग्न किया है। कृपया जांच कर मेरा खाता तुरंत पुनः शुरू करें!`
      ];
    } else if (language === 'en') {
      lines = [
        "*Dukaan360 POS - Subscription Payment Receipt*",
        "",
        `*Store ID:* #${storeInfo.store_id}`,
        `*Store:* ${storeInfo.store_name}`,
        `*Owner:* ${storeInfo.owner_name}`,
        `*Username:* @${storeInfo.username}`,
        `*Registered Mobile:* ${storeInfo.mobile}`,
        `*Plan:* ${selectedPlan.name} (${selectedPlan.sub})`,
        `*Amount:* ₹${selectedPlan.price}`,
        "",
        `I have attached the PhonePe / GPay payment screenshot. Kindly verify and reactivate my account promptly!`
      ];
    } else {
      // Default Marathi
      lines = [
        "*Dukaan360 POS - सबस्क्रिप्शन पेमेंट पावती*",
        "",
        `*दुकान ID:* #${storeInfo.store_id}`,
        `*दुकान:* ${storeInfo.store_name}`,
        `*मालक:* ${storeInfo.owner_name}`,
        `*युझरनेम:* @${storeInfo.username}`,
        `*नोंदणीकृत मोबाईल:* ${storeInfo.mobile}`,
        `*प्लॅन:* ${selectedPlan.name} (${selectedPlan.sub})`,
        `*रक्कम:* ₹${selectedPlan.price}`,
        "",
        `मी सोबत PhonePe / GPay पेमेंटचा स्क्रीनशॉट जोडला आहे. कृपया तपासून माझे खाते त्वरित पुन्हा सुरू करा!`
      ];
    }

    const encoded = encodeURIComponent(lines.join("\n"));
    window.open(`https://wa.me/91${ADMIN_PHONE}?text=${encoded}`, '_blank');
  };

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
        {/* Brand & Subtitle */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-[#FF5722] to-[#FFA726] flex items-center justify-center text-white shadow-md shadow-orange-500/25 shrink-0">
            <Storefront weight="fill" className="text-xl sm:text-2xl" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-900 leading-none">
                {txt.brand_title}
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-black text-[#FF5722] bg-orange-50 border border-orange-200/80 px-2 py-0.5 rounded-full">
                <Sparkle weight="fill" className="text-xs" />
                <span>{txt.brand_sub}</span>
              </span>
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5 sm:hidden">
              {txt.brand_sub}
            </p>
          </div>
        </div>

        {/* Action Controls: 3-Language Selector, FAQ Help, Back to Login */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <LanguageControl variant="auth" />

          <button 
            type="button"
            onClick={() => setShowFaqModal(true)}
            className="text-xs sm:text-sm font-bold text-slate-700 hover:text-[#FF5722] bg-slate-100 hover:bg-orange-50 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer border border-slate-200/60 shadow-2xs"
            title={txt.help_btn}
          >
            <Question weight="bold" className="text-sm text-[#FF5722]" />
            <span className="hidden sm:inline">{txt.help_btn}</span>
          </button>

          <Link 
            to="/login"
            className="text-xs sm:text-sm font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl transition flex items-center gap-1.5 border border-slate-200/60 shadow-2xs shrink-0 whitespace-nowrap"
          >
            <ArrowLeft weight="bold" className="text-sm" />
            <span className="hidden sm:inline">{txt.login_btn}</span>
            <span className="sm:hidden font-bold">लॉगिन</span>
          </Link>
        </div>
      </header>

      {/* ================= FULL-PAGE WORKSPACE ================= */}
      <main className="relative z-10 flex-1 w-full max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-6 flex flex-col lg:flex-row gap-6 items-center lg:items-stretch overflow-visible lg:overflow-hidden">
        
        {/* LEFT COLUMN: Store Verification, Plans & Do's/Don'ts (58% Width) */}
        <div className="w-full lg:w-[58%] bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-200/50 p-5 sm:p-7 flex flex-col justify-between my-auto lg:my-0 lg:h-full relative">
          
          <div className="space-y-2.5">
            {/* Trial Ended Alert Bar */}
            <div className="p-2.5 rounded-xl bg-gradient-to-r from-orange-50 via-amber-50/60 to-orange-50 border border-orange-200/80 text-orange-950 flex items-center gap-2.5 shadow-2xs">
              <div className="w-7 h-7 rounded-lg bg-orange-500/10 text-[#FF5722] flex items-center justify-center shrink-0">
                <Sparkle weight="fill" className="text-sm animate-pulse" />
              </div>
              <div className="text-[11px] leading-tight flex-1">
                <span className="font-black text-orange-950">{txt.trial_ended_title} </span>
                <span className="text-orange-800 font-medium">{txt.trial_ended_desc}</span>
              </div>
            </div>

            {/* STEP 1: Search Store or Verified Store Hero Card */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider flex items-center gap-1">
                  <span>{txt.step1_title}</span>
                </label>
                {storeInfo && (
                  <span className="text-[10px] text-emerald-600 font-black flex items-center gap-0.5">
                    <SealCheck weight="fill" /> {txt.step1_verified}
                  </span>
                )}
              </div>

              {!storeInfo ? (
                <div ref={searchBoxRef} className="relative">
                  <div className="relative flex items-center bg-slate-50 border-2 border-slate-200 focus-within:border-[#FF5722] focus-within:bg-white rounded-xl transition">
                    <div className="pl-3 text-slate-400">
                      <MagnifyingGlass weight="bold" className="text-base text-[#FF5722]" />
                    </div>
                    <input 
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSelectStore(searchQuery);
                      }}
                      placeholder={txt.search_placeholder}
                      className="w-full px-2.5 py-1.5 text-xs font-bold text-slate-800 placeholder:text-slate-400 placeholder:font-normal outline-none bg-transparent"
                    />
                    {searchQuery && (
                      <button 
                        type="button" 
                        onClick={handleResetSearch}
                        className="p-1 text-slate-400 hover:text-slate-700 transition mr-1 cursor-pointer"
                      >
                        <X weight="bold" className="text-xs" />
                      </button>
                    )}
                    <button 
                      type="button" 
                      onClick={() => handleSelectStore(searchQuery)}
                      disabled={loadingSearch || !searchQuery.trim()}
                      className="mr-1.5 px-3 py-1 bg-[#FF5722] hover:bg-[#E64A19] active:scale-95 text-white font-bold text-xs rounded-lg transition disabled:opacity-50 flex items-center gap-1 shrink-0 cursor-pointer"
                    >
                      {loadingSearch ? <CircleNotch className="animate-spin text-xs" /> : txt.search_btn}
                    </button>
                  </div>

                  {/* Auto-suggestions Dropdown */}
                  {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute top-[calc(100%+4px)] left-0 right-0 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in duration-150 max-h-44 overflow-y-auto">
                      <div className="p-1.5 bg-slate-50 border-b border-slate-100 text-[9px] font-black uppercase text-slate-400 px-3">
                        {txt.found_stores}
                      </div>
                      <div className="divide-y divide-slate-100">
                        {suggestions.map((item) => (
                          <div 
                            key={item.store_id}
                            onClick={() => handleSelectStore(item.store_name)}
                            className="p-2.5 hover:bg-orange-50/80 transition cursor-pointer flex items-center justify-between gap-2 text-left group"
                          >
                            <div>
                              <p className="font-black text-xs text-slate-900 group-hover:text-[#FF5722] transition leading-tight">
                                {item.store_name}
                              </p>
                              <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                                👤 {item.owner_name} • 📱 {item.mobile}
                              </p>
                            </div>
                            <span className="text-[10px] font-black text-[#FF5722] bg-orange-50 px-2 py-0.5 rounded-md shrink-0">
                              {txt.select_btn}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {searchError && (
                    <p className="text-red-500 text-[11px] font-bold mt-1">⚠️ {searchError}</p>
                  )}
                </div>
              ) : (
                /* Verified Store Card (Compact Hero Pill) */
                <div className="p-2.5 rounded-xl bg-orange-50/70 border-2 border-orange-200 flex items-center justify-between gap-3 animate-in fade-in duration-150 shadow-2xs">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#FF5722] to-[#FFA726] text-white flex items-center justify-center text-lg font-bold shrink-0 shadow-sm shadow-orange-500/25">
                      <Storefront weight="fill" />
                    </div>
                    <div className="truncate">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-slate-900 truncate">
                          {storeInfo.store_name}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-black border border-emerald-300 shrink-0">
                          {txt.verified_tag}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black shrink-0 ${storeInfo.status?.toLowerCase() === 'active' ? 'bg-green-100 text-green-700' : storeInfo.status?.toLowerCase() === 'pending' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'}`}>
                          {storeInfo.status?.toLowerCase() === 'active' ? 'सुरू आहे (Active)' : storeInfo.status?.toLowerCase() === 'pending' ? 'मंजुरी बाकी (Pending)' : 'प्लॅन संपला (Expired)'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 font-medium truncate mt-0.5">
                        👤 {storeInfo.owner_name} • 📱 {storeInfo.mobile} • @{storeInfo.username}
                      </p>
                      {storeInfo.end_date && (
                        <p className="text-[10px] text-slate-500 font-bold mt-0.5">
                          📅 मुदत: {new Date(storeInfo.end_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                          {storeInfo.days_left > 0 ? ` (${storeInfo.days_left} दिवस शिल्लक)` : ' (मुदत संपली)'}
                        </p>
                      )}
                    </div>
                  </div>

                  <button 
                    type="button" 
                    onClick={handleResetSearch}
                    className="text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-xl transition shrink-0 active:scale-95 shadow-xs hover:shadow-sm cursor-pointer"
                  >
                    {txt.change_store}
                  </button>
                </div>
              )}
            </div>

            {/* STEP 2: Subscription Plans Selector (Wide 4-Card Grid) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs sm:text-sm font-black text-slate-700 uppercase tracking-wider">
                  {txt.step2_title}
                </label>
                <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  ⚡ 10x+ ROI Investment
                </span>
              </div>

              {/* ROI Callout */}
              <div className="mb-3 p-2.5 rounded-xl bg-gradient-to-r from-emerald-50 via-amber-50 to-orange-50 border border-emerald-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 shadow-2xs">
                <div className="flex items-center gap-2">
                  <span className="text-lg">💰</span>
                  <div>
                    <p className="text-xs font-black text-slate-800 leading-tight">हा खर्च नाही, तर थेट दुकानाची गुंतवणूक (Investment) आहे!</p>
                    <p className="text-[10px] text-slate-600 font-medium mt-0.5">महिन्याला फक्त ₹७९९ च्या बदल्यात उधारी वसुली, Expiry नुकसान व चोरी/गळती थांबवून ₹८,३५०+ ची बचत होते.</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white font-black text-[9px] tracking-wider shrink-0 shadow-2xs">
                  १०x+ परतावा
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {currentPlans.map(plan => {
                  const isSelected = selectedPlanId === plan.id;
                  return (
                    <div 
                      key={plan.id}
                      onClick={() => setSelectedPlanId(plan.id)}
                      className={`relative p-3 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                        isSelected 
                          ? 'border-[#FF5722] bg-gradient-to-b from-orange-50/80 to-white shadow-md ring-2 ring-orange-500/20 scale-[1.02]' 
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60 shadow-2xs hover:shadow-xs'
                      }`}
                    >
                      {/* Top Badges */}
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-black text-slate-400">
                          {plan.duration.split(' ')[0]}
                        </span>
                        {plan.popular ? (
                          <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-[#FF5722] to-amber-500 text-white text-[9px] font-black tracking-wider uppercase shadow-2xs">
                            {plan.tag}
                          </span>
                        ) : plan.bestValue ? (
                          <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-900 text-[9px] font-black tracking-wider uppercase shadow-2xs">
                            {plan.tag}
                          </span>
                        ) : (
                          <span className="text-[10px] text-emerald-700 font-extrabold">{plan.discount}</span>
                        )}
                      </div>

                      {/* Name & Pricing */}
                      <div>
                        <h4 className="font-black text-xs sm:text-sm text-slate-900 leading-tight">
                          {plan.name}
                        </h4>
                        <div className="flex items-baseline gap-1 my-1">
                          <span className="text-xl sm:text-2xl font-black text-slate-900">₹{plan.price}</span>
                          {plan.original && (
                            <span className="text-xs text-slate-400 font-bold line-through">₹{plan.original}</span>
                          )}
                        </div>
                        {plan.features && (
                          <p className="text-[9px] font-medium text-slate-500 line-clamp-2 leading-tight mb-2">
                            {plan.features}
                          </p>
                        )}
                      </div>

                      {/* Daily cost & selection indicator */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] sm:text-xs">
                        <span className="text-slate-500 font-semibold">{plan.perDay.split(' ')[0]}</span>
                        <span 
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center font-black ${
                            isSelected ? 'border-[#FF5722] bg-[#FF5722] text-white shadow-2xs' : 'border-slate-300'
                          }`}
                        >
                          {isSelected && '✓'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* STEP 3 INFO: Payment Guide & Instructions (Do's & Don'ts) */}
            <div className="bg-slate-50/90 border border-slate-200/90 rounded-xl p-2.5">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck weight="fill" className="text-emerald-600 text-base shrink-0" />
                  <h3 className="text-xs font-black text-slate-800 tracking-tight">
                    {txt.guide_title}
                  </h3>
                </div>
                <span className="text-[9px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Clock weight="fill" className="text-emerald-600 text-xs" />
                  <span>{txt.activation_time}</span>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                {/* DO's */}
                <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-lg p-2">
                  <p className="font-black text-emerald-950 mb-0.5 flex items-center gap-1 text-[11px]">
                    <CheckCircle weight="fill" className="text-emerald-600 text-xs shrink-0" />
                    <span>{txt.dos_title}</span>
                  </p>
                  <ul className="text-emerald-900 font-medium space-y-0.5 pl-1 leading-snug text-[10px]">
                    <li>• {txt.dos_item1}</li>
                    <li>• {txt.dos_item2}</li>
                    <li>• {txt.dos_item3}</li>
                  </ul>
                </div>

                {/* DON'Ts */}
                <div className="bg-rose-50/80 border border-rose-200/80 rounded-lg p-2">
                  <p className="font-black text-rose-950 mb-0.5 flex items-center gap-1 text-[11px]">
                    <WarningCircle weight="fill" className="text-rose-600 text-xs shrink-0" />
                    <span>{txt.donts_title}</span>
                  </p>
                  <ul className="text-rose-900 font-medium space-y-0.5 pl-1 leading-snug text-[10px]">
                    <li>• {txt.donts_item1}</li>
                    <li>• {txt.donts_item2}</li>
                    <li>• {txt.donts_item3}</li>
                  </ul>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Trust Strip */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-semibold">
            <span className="flex items-center gap-1">⚡ {txt.trust_activation}</span>
            <span className="flex items-center gap-1">🔒 {txt.trust_cloud}</span>
            <span className="flex items-center gap-1">🖨️ {txt.trust_printer}</span>
            <span className="flex items-center gap-1">📞 {txt.trust_support}</span>
          </div>
        </div>

        {/* RIGHT COLUMN: Official PhonePe QR & WhatsApp Action (42% Width, Slate 900) */}
        <div className="w-full lg:w-[42%] bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 p-5 sm:p-6 text-white flex flex-col justify-between my-auto lg:my-0 lg:h-full relative overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-800 shadow-xl">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_2px_2px,white_1px,transparent_0)] bg-[length:20px_20px] pointer-events-none"></div>

          <div className="relative z-10 flex flex-col justify-between h-full space-y-3">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2 shrink-0">
              <div>
                <span className="text-[10px] font-black text-orange-400 uppercase tracking-wider block">
                  {txt.step3_title}
                </span>
                <h3 className="font-black text-sm sm:text-base text-white mt-0.5 leading-none">
                  {selectedPlan.name} • ₹{selectedPlan.price}
                </h3>
              </div>
              <div className="text-right">
                <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                  {txt.total_label} ₹{selectedPlan.price}
                </span>
              </div>
            </div>

            {/* Official PhonePe QR Box */}
            <div className="bg-slate-800/80 p-3 rounded-2xl shadow-xl border border-slate-700/80 text-center max-w-[240px] mx-auto mb-2">
              <div className="flex items-center justify-between mb-1.5 px-0.5">
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-full bg-[#5f259f] flex items-center justify-center text-white text-[10px] font-black">
                    पे
                  </div>
                  <span className="text-white text-xs sm:text-sm font-black tracking-wide">PhonePe</span>
                </div>
                <span className="text-[9px] bg-purple-500/20 text-purple-300 font-bold px-2 py-0.5 rounded border border-purple-500/30">
                  {txt.accepted_here}
                </span>
              </div>

              {/* Scannable PhonePe QR */}
              <div 
                onClick={() => setShowQrModal(true)}
                className="relative group rounded-xl overflow-hidden bg-black p-1.5 cursor-pointer border border-white/10 hover:border-purple-400/50 transition-all duration-200"
                title={txt.click_to_enlarge}
              >
                <img 
                  src="/phonepe-qr-square.png" 
                  alt="PhonePe UPI QR Code - Mr Omkar bandu Misal" 
                  className="w-36 h-36 sm:w-40 sm:h-40 rounded-lg object-contain mx-auto transition-transform duration-200 group-hover:scale-102"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1 rounded-lg">
                  <MagnifyingGlass weight="bold" />
                  <span>{txt.click_to_enlarge}</span>
                </div>
              </div>

              {/* Merchant Name & Supported Apps */}
              <div className="mt-1.5">
                <p className="text-xs font-black text-slate-200 leading-tight">{txt.merchant_name}</p>
                <div className="mt-1.5 flex items-center justify-center gap-1.5">
                  <span className="text-[9px] font-black text-slate-300 bg-white/10 px-1.5 py-0.5 rounded">PhonePe</span>
                  <span className="text-[9px] font-black text-slate-300 bg-white/10 px-1.5 py-0.5 rounded">GPay</span>
                  <span className="text-[9px] font-black text-slate-300 bg-white/10 px-1.5 py-0.5 rounded">Paytm</span>
                  <span className="text-[9px] font-black text-slate-300 bg-white/10 px-1.5 py-0.5 rounded">BHIM</span>
                </div>
              </div>
            </div>

            {/* UPI ID Copy Bar */}
            <div className="w-full h-12 bg-slate-800/90 border border-slate-700/80 rounded-xl px-3.5 flex items-center justify-between text-xs sm:text-sm mb-2">
              <div className="text-left font-mono">
                <span className="text-[9px] text-slate-400 block font-sans font-bold">{txt.official_upi_label}</span>
                <span className="font-black text-white text-xs sm:text-sm">{ADMIN_UPI}</span>
              </div>
              <button 
                type="button"
                onClick={handleCopyUpi}
                className="flex items-center gap-1 bg-white/10 hover:bg-white/20 active:scale-95 text-[#FF8A65] px-3 py-1.5 rounded-lg font-bold text-xs transition cursor-pointer"
              >
                {copiedUpi ? <Check weight="bold" className="text-emerald-400 text-sm" /> : <Copy weight="bold" className="text-sm" />}
                <span>{copiedUpi ? txt.copied_btn : txt.copy_btn}</span>
              </button>
            </div>

            {/* Verified Store Summary Badge */}
            {storeInfo ? (
              <div className="bg-slate-800/70 border border-slate-700/60 rounded-xl px-3 py-2 text-xs mb-2 space-y-1">
                <div className="flex justify-between items-center text-slate-300">
                  <span>{txt.store_name_lbl}</span>
                  <span className="font-bold text-white">{storeInfo.store_name} (#{storeInfo.store_id})</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>{txt.owner_mobile_lbl}</span>
                  <span className="font-bold text-white">{storeInfo.owner_name} • {storeInfo.mobile}</span>
                </div>
              </div>
            ) : (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-2 text-xs text-amber-200 mb-2 text-center font-bold">
                {txt.select_store_warning}
              </div>
            )}

            {/* Big WhatsApp CTA Button */}
            <div>
              <button
                type="button"
                onClick={handleOpenWhatsApp}
                className="w-full h-12 sm:h-13 bg-gradient-to-r from-[#25D366] to-[#20bd5a] hover:from-[#20bd5a] hover:to-[#1da850] active:scale-98 text-white font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-green-500/25 transition flex items-center justify-center gap-2 cursor-pointer mb-1"
              >
                <WhatsappLogo weight="fill" className="text-2xl" />
                <span>{txt.whatsapp_btn}</span>
              </button>

              <p className="text-[10px] text-slate-400 text-center leading-tight mt-1">
                {txt.whatsapp_note}
              </p>
            </div>

            {/* Footer Call Support Bar */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 mt-2">
              <span>{txt.support_query}</span>
              <a 
                href={`tel:${ADMIN_PHONE}`} 
                className="text-white hover:text-[#FF8A65] font-bold flex items-center gap-1 transition"
              >
                <Phone weight="fill" className="text-xs text-[#FF5722]" />
                <span>{txt.call_btn} +91 {ADMIN_PHONE}</span>
              </a>
            </div>

          </div>

        </div>

      </main>

      {/* Helpful FAQ / Help Modal */}
      {showFaqModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-orange-100 text-[#FF5722] flex items-center justify-center text-base">
                  <Question weight="fill" />
                </div>
                <h3 className="font-black text-sm text-slate-900">{txt.faq_title}</h3>
              </div>
              <button 
                type="button" 
                onClick={() => setShowFaqModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition cursor-pointer"
              >
                <X weight="bold" />
              </button>
            </div>

            <div className="py-3 space-y-2.5 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <p className="font-black text-slate-800">{txt.faq1_q}</p>
                <p className="text-slate-600 mt-1 leading-snug">{txt.faq1_a}</p>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <p className="font-black text-slate-800">{txt.faq2_q}</p>
                <p className="text-slate-600 mt-1 leading-snug">{txt.faq2_a}</p>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <p className="font-black text-slate-800">{txt.faq3_q}</p>
                <p className="text-slate-600 mt-1 leading-snug">{txt.faq3_a}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowFaqModal(false)}
              className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition cursor-pointer"
            >
              {txt.modal_close}
            </button>
          </div>
        </div>
      )}

      {/* Full PhonePe QR Modal (Click to Enlarge) */}
      {showQrModal && (
        <div 
          className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-150"
          onClick={() => setShowQrModal(false)}
        >
          <div 
            className="bg-black border border-purple-500/40 rounded-2xl max-w-sm w-full p-4 shadow-2xl relative animate-in zoom-in-95 duration-150 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              type="button" 
              onClick={() => setShowQrModal(false)}
              className="absolute right-3 top-3 p-1.5 text-slate-400 hover:text-white rounded-lg bg-white/10 hover:bg-white/20 transition cursor-pointer"
            >
              <X weight="bold" className="text-base" />
            </button>

            <div className="flex items-center justify-center gap-1.5 mb-2">
              <div className="w-5 h-5 rounded-full bg-[#5f259f] flex items-center justify-center text-white text-[10px] font-black">
                पे
              </div>
              <span className="text-white text-sm font-black tracking-wide">{txt.qr_modal_title}</span>
            </div>

            <img 
              src="/phonepe-qr-full.jpg" 
              alt="PhonePe Full QR - Mr Omkar bandu Misal" 
              className="w-full max-h-[70vh] rounded-xl object-contain mx-auto border border-white/10"
            />

            <div className="mt-3 flex items-center justify-between text-xs text-slate-300 px-1 font-sans">
              <span>{txt.qr_name_lbl} <strong className="text-white">{txt.merchant_name}</strong></span>
              <span className="font-mono text-purple-300 font-bold">{ADMIN_UPI}</span>
            </div>

            <button
              type="button"
              onClick={() => setShowQrModal(false)}
              className="w-full mt-3 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl transition cursor-pointer"
            >
              {txt.qr_close}
            </button>
          </div>
        </div>
      )}

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

        /* Glowing Pulse behind Main Container */
        @keyframes pulse-subtle {
          0%, 100% { opacity: 0.55; transform: scale(1); }
          50% { opacity: 0.85; transform: scale(1.015); }
        }
        .animate-pulse-subtle { animation: pulse-subtle 4.5s ease-in-out infinite; }
      `}</style>

    </div>
  );
};

export default Renew;
