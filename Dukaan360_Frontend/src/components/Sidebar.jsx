import React from 'react';
import { SquaresFour } from '@phosphor-icons/react';
import { useLanguage } from '../contexts/LanguageContext';

const iconMap = {
  "Grocery": "🍅",
  "Dairy": "🥛",
  "Snacks": "🍪",
  "Cleaning": "🧹"
};

const Sidebar = ({ activeCategory, setActiveCategory, dynamicCategories = [] }) => {
  const { t, tCategory } = useLanguage();
  return (
    <aside className="w-full lg:w-[80px] bg-white lg:border-r border-b lg:border-b-0 border-slate-200 flex lg:flex-col items-center p-2 lg:py-4 gap-2 overflow-x-auto lg:overflow-y-auto hide-scroll shrink-0 z-10 shadow-[0_2px_4px_-1px_rgba(0,0,0,0.03)] lg:shadow-none">
      
      <button 
        onClick={() => setActiveCategory('all')}
        className={`w-14 h-11 lg:w-16 lg:h-16 rounded-xl flex flex-col items-center justify-center gap-1 shrink-0 transition ${
          activeCategory === 'all' ? 'bg-brandLight text-brand border border-brand/20 shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
        }`}
      >
        <SquaresFour weight="fill" className="text-lg lg:text-xl" />
        <span className="text-[9px] lg:text-[10px] font-bold">{t('all')}</span>
      </button>

      {dynamicCategories.map((cat) => {
        const isActive = activeCategory === cat.id;
        return (
          <button 
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`w-14 h-11 lg:w-16 lg:h-16 rounded-xl flex flex-col items-center justify-center gap-1 shrink-0 transition ${
              isActive ? 'bg-brandLight text-brand border border-brand/20 shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
            }`}
          >
            <span className="text-lg lg:text-xl">{iconMap[cat.name] || '📦'}</span>
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
