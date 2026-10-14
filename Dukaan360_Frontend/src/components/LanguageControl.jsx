import React, { useState, useEffect, useCallback } from 'react';
import { 
  Translate, 
  Keyboard,
  ArrowsLeftRight 
} from '@phosphor-icons/react';
import { useLanguage } from '../contexts/LanguageContext';

// Subtle tactile chime on language switch (synthesized via Web Audio API, 0 dependencies)
const playSoftChime = () => {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(520, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(780, ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.12);
  } catch {
    // Ignore audio errors if blocked by browser policy
  }
};

const LANGUAGE_DETAILS = {
  mr: {
    code: 'mr',
    label: 'मराठी',
    flag: '🚩',
    nativeName: 'मराठी',
    toastMsg: 'भाषा बदलली: मराठी 🚩'
  },
  hi: {
    code: 'hi',
    label: 'हिंदी',
    flag: '🇮🇳',
    nativeName: 'हिंदी',
    toastMsg: 'भाषा बदली गई: हिंदी 🇮🇳'
  },
  en: {
    code: 'en',
    label: 'English',
    flag: '🇬🇧',
    nativeName: 'English',
    toastMsg: 'Switched to English 🇬🇧'
  }
};

export const LanguageControl = ({ variant = 'desktop', onSelect }) => {
  const { language, setLanguage, supportedLanguages } = useLanguage();
  const [toast, setToast] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  const triggerLanguageChange = useCallback((code) => {
    if (code === language) return;
    playSoftChime();
    setLanguage(code);
    if (onSelect) onSelect(code);

    const detail = LANGUAGE_DETAILS[code] || { toastMsg: `Language: ${code}`, flag: '🌐' };
    setToast({ message: detail.toastMsg, flag: detail.flag });
  }, [language, setLanguage, onSelect]);

  const cycleToNextLanguage = useCallback(() => {
    const codes = supportedLanguages.map(l => l.code);
    const currentIndex = codes.indexOf(language);
    const nextIndex = (currentIndex + 1) % codes.length;
    triggerLanguageChange(codes[nextIndex]);
  }, [language, supportedLanguages, triggerLanguageChange]);

  // Toast auto-hide after 1.6 seconds
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setToast(null);
    }, 1600);
    return () => clearTimeout(timer);
  }, [toast]);

  // Global Alt + L keyboard shortcut to cycle through languages
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.altKey && (e.key === 'l' || e.key === 'L')) {
        e.preventDefault();
        cycleToNextLanguage();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cycleToNextLanguage]);

  // 0. Global variant: Invisible in DOM, handles Alt+L keyboard shortcut & shows floating toast
  if (variant === 'global') {
    return toast ? (
      <div className="fixed top-16 left-1/2 -translate-x-1/2 z-[100] pointer-events-none animate-in fade-in slide-in-from-top-3 duration-200">
        <div className="flex items-center gap-2.5 px-4 py-2 bg-slate-900/95 text-white backdrop-blur-md rounded-full shadow-2xl border border-slate-700/80 text-xs font-black">
          <span className="text-base">{toast.flag}</span>
          <span>{toast.message}</span>
          <span className="text-[10px] text-amber-400 font-mono bg-white/10 px-1.5 py-0.5 rounded-md ml-1 flex items-center gap-1">
            <Keyboard weight="bold" className="text-xs" />
            Alt+L
          </span>
        </div>
      </div>
    ) : null;
  }

  // 1. Mobile variant: Sleek micro segmented capsule (1-touch instant switch)
  if (variant === 'mobile') {
    return (
      <>
        <div className="flex items-center bg-orange-100/70 p-0.5 rounded-xl border border-orange-200/90 shadow-sm shrink-0">
          {supportedLanguages.map((item) => {
            const isSelected = language === item.code;
            return (
              <button
                key={item.code}
                onClick={() => triggerLanguageChange(item.code)}
                className={`px-2 py-1 rounded-lg text-[11px] font-black transition-all flex items-center gap-1 active:scale-95 ${
                  isSelected
                    ? 'bg-gradient-to-r from-brand to-orange-500 text-white shadow-sm'
                    : 'text-slate-600 hover:text-brand'
                }`}
                title={`Switch to ${item.nativeName}`}
              >
                <span className="text-xs leading-none">{item.flag}</span>
                <span className="uppercase text-[10px] font-extrabold tracking-tight">
                  {item.code === 'mr' ? 'मराठी' : item.code === 'hi' ? 'हिंदी' : 'ENG'}
                </span>
              </button>
            );
          })}
        </div>

        {/* Global Toast Notification */}
        {toast && (
          <div className="fixed top-16 left-1/2 -translate-x-1/2 z-[100] pointer-events-none animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-2 px-3.5 py-1.5 bg-slate-900/95 text-white backdrop-blur-md rounded-full shadow-2xl border border-slate-700/80 text-xs font-bold">
              <span className="text-base">{toast.flag}</span>
              <span>{toast.message}</span>
            </div>
          </div>
        )}
      </>
    );
  }

  // 2. Grid variant (for Mobile Drawer or Profile dropdown)
  if (variant === 'grid') {
    return (
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-[11px] font-black text-slate-500 px-0.5">
          <span className="flex items-center gap-1.5">
            <Translate weight="bold" className="text-brand text-xs" />
            <span>भाषा / Language</span>
          </span>
          <span className="text-[10px] font-bold text-brand uppercase tracking-wider">
            {LANGUAGE_DETAILS[language]?.nativeName || language}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {supportedLanguages.map((item) => {
            const isSelected = language === item.code;
            return (
              <button
                key={item.code}
                onClick={() => triggerLanguageChange(item.code)}
                className={`py-2 px-2 rounded-xl text-xs font-black flex flex-col items-center justify-center gap-1 transition-all active:scale-95 ${
                  isSelected
                    ? 'bg-gradient-to-r from-brand to-orange-500 text-white shadow-md shadow-brand/20 scale-[1.02]'
                    : 'bg-white hover:bg-orange-50 text-slate-700 border border-slate-200/80'
                }`}
              >
                <span className="text-base leading-none">{item.flag}</span>
                <span className="leading-tight text-[11px]">{item.nativeName}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // 2.5 Auth / Pills variant (Always visible 3-pill toggle for Login, Register, Renew)
  if (variant === 'auth' || variant === 'pills') {
    return (
      <div className="flex items-center bg-slate-100/90 p-0.5 rounded-xl border border-slate-200/80 shadow-xs shrink-0 select-none">
        {supportedLanguages.map((item) => {
          const isSelected = language === item.code;
          return (
            <button
              key={item.code}
              type="button"
              onClick={() => triggerLanguageChange(item.code)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer active:scale-95 ${
                isSelected
                  ? 'bg-white text-[#FF5722] shadow-xs font-black ring-1 ring-black/5'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
              }`}
              title={`Switch to ${item.nativeName}`}
            >
              <span className="text-xs leading-none">{item.flag}</span>
              <span>{item.nativeName}</span>
            </button>
          );
        })}
      </div>
    );
  }

  // 3. Desktop variant: Smart Dynamic Island Capsule (Compact ~80px resting state, expands on hover or 1-click cycle)
  const currentItem = supportedLanguages.find(l => l.code === language) || supportedLanguages[0];

  return (
    <>
      <div 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200/80 shadow-inner transition-all duration-300 ease-out shrink-0"
      >
        {!isHovered ? (
          // Compact Rest State (Takes only ~80px, completely solves the navbar crowding!)
          <button
            onClick={cycleToNextLanguage}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black bg-gradient-to-r from-brand to-orange-500 text-white shadow-md shadow-brand/20 active:scale-95 transition-all select-none group"
            title="Click to cycle language (Alt+L) • Hover to pick specific"
          >
            <span className="text-sm leading-none">{currentItem.flag}</span>
            <span className="tracking-tight">{currentItem.nativeName}</span>
            <ArrowsLeftRight weight="bold" className="text-[11px] opacity-75 group-hover:rotate-180 transition-transform duration-300 ml-0.5" />
          </button>
        ) : (
          // Smooth Expanded State on Hover (Pick any language directly)
          <div className="flex items-center gap-1 animate-in fade-in zoom-in-95 duration-150">
            {supportedLanguages.map((item) => {
              const isSelected = language === item.code;
              return (
                <button
                  key={item.code}
                  onClick={() => triggerLanguageChange(item.code)}
                  className={`relative flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-black transition-all select-none active:scale-95 ${
                    isSelected
                      ? 'bg-gradient-to-r from-brand to-orange-500 text-white shadow-md shadow-brand/25 scale-[1.02]'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                  }`}
                  title={`Switch to ${item.nativeName}`}
                >
                  <span className="text-sm leading-none">{item.flag}</span>
                  <span className="tracking-tight">{item.nativeName}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating Dynamic HUD Toast */}
      {toast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-[100] pointer-events-none animate-in fade-in slide-in-from-top-3 duration-200">
          <div className="flex items-center gap-2.5 px-4 py-2 bg-slate-900/95 text-white backdrop-blur-md rounded-full shadow-2xl border border-slate-700/80 text-xs font-black">
            <span className="text-base">{toast.flag}</span>
            <span>{toast.message}</span>
            <span className="text-[10px] text-amber-400 font-mono bg-white/10 px-1.5 py-0.5 rounded-md ml-1 flex items-center gap-1">
              <Keyboard weight="bold" className="text-xs" />
              Alt+L
            </span>
          </div>
        </div>
      )}
    </>
  );
};
