import React from 'react';
import { SquaresFour } from '@phosphor-icons/react';
import { useLanguage } from '../contexts/LanguageContext';

const Sidebar = ({ activeCategory, setActiveCategory, dynamicCategories = [] }) => {
  const { t, tCategory } = useLanguage();
  return (
    <aside className="w-full lg:w-[84px] bg-white/70 backdrop-blur-md lg:border-r border-b lg:border-b-0 border-slate-200/80 flex lg:flex-col items-center p-2 lg:py-3 gap-2 overflow-x-auto lg:overflow-y-auto hide-scroll shrink-0 z-10">
      
      {/* "सर्व" (All) Button */}
      <button 
        onClick={() => setActiveCategory('all')}
        className={`w-14 h-14 lg:w-16 lg:h-16 rounded-2xl flex flex-col items-center justify-center gap-1 shrink-0 transition cursor-pointer ${
          activeCategory === 'all' 
            ? 'bg-[#FCE8DC] text-[#FF5722] border border-[#F8D2BD] shadow-xs' 
            : 'bg-white/80 text-slate-500 border border-slate-200/70 hover:bg-white hover:text-slate-800'
        }`}
      >
        <SquaresFour weight="fill" className="text-xl lg:text-2xl text-[#FF5722]" />
        <span className="text-[10px] lg:text-[11px] font-black">{t('all') || 'सर्व'}</span>
      </button>

      {/* Dynamic Categories */}
      {dynamicCategories.map((cat) => {
        const isActive = activeCategory === cat.id;
        return (
          <button 
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`w-14 h-14 lg:w-16 lg:h-16 rounded-2xl flex flex-col items-center justify-center p-1 shrink-0 transition cursor-pointer ${
              isActive 
                ? 'bg-[#FCE8DC] text-[#FF5722] border border-[#F8D2BD] shadow-xs' 
                : 'bg-white/80 text-slate-600 border border-slate-200/70 hover:bg-white hover:text-slate-900 shadow-2xs'
            }`}
          >
            <span className="text-base lg:text-lg mb-0.5">📦</span>
            <span className="text-[9px] lg:text-[10px] font-bold text-center leading-tight line-clamp-2 px-0.5">
              {tCategory(cat.name)}
            </span>
          </button>
        );
      })}
    </aside>
  );
};

export default Sidebar;
