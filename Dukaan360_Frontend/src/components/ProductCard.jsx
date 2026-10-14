import React from 'react';
import { Plus, Check } from '@phosphor-icons/react';
import { useLanguage } from '../contexts/LanguageContext';

const ProductCard = ({ product, onAddToCart, cartQuantity = 0 }) => {
  const { t, tProduct, tUnit } = useLanguage();
  const isOutOfStock = product.stock <= 0;
  const inCart = cartQuantity > 0;

  return (
    <div className={`glass-card rounded-xl p-2 lg:p-2.5 cursor-pointer group flex flex-col min-h-[185px] lg:min-h-[205px] h-auto relative ${
      isOutOfStock ? 'opacity-60 cursor-not-allowed border-slate-100' : 
      inCart ? 'border-brand shadow-sm' : 'border-slate-100 hover:border-brand'
    }`}>
      
      {inCart && !isOutOfStock && (
        <div className="absolute -top-1.5 -right-1.5 w-5 h-5 lg:w-6 lg:h-6 bg-brand text-white rounded-full flex items-center justify-center text-[10px] lg:text-xs font-bold shadow-sm z-10">
          {cartQuantity}
        </div>
      )}

      <div className={`w-full h-20 lg:h-24 rounded-lg mb-2 overflow-hidden relative p-0 transition ${
        inCart ? 'bg-brandLight' : 'bg-slate-50 group-hover:bg-brandLight'
      }`}>
        <img 
          src={product.image || 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Wheat_flour.jpg/320px-Wheat_flour.jpg'} 
          alt={tProduct(product.name)}
          className={`object-cover w-full h-full rounded-lg transition-transform ${
            isOutOfStock ? 'grayscale' : 'group-hover:scale-105'
          }`}
        />
        
        {isOutOfStock ? (
          <div className="absolute inset-0 bg-white/40 flex items-center justify-center backdrop-blur-[1px]">
            <span className="bg-red-500 text-white text-[8px] lg:text-[10px] font-bold px-2 py-1 rounded shadow-sm">{t('out_of_stock_badge')}</span>
          </div>
        ) : (
          <div className="absolute top-1 left-1 bg-white/90 backdrop-blur-sm text-slate-800 text-[8px] lg:text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm border border-slate-200">
            {tUnit(product.size) || '1 PC'}
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col justify-between">
        <h3 className="font-bold text-[11px] lg:text-xs text-slate-800 leading-snug break-words">
          {tProduct(product.name)}
        </h3>
        <div className="flex justify-between items-end mt-1">
          <div>
            {product.mrp && product.mrp > product.price && (
              <span className="text-[9px] lg:text-[10px] text-slate-400 line-through">₹{product.mrp}</span>
            )}
            <p className="text-[13px] lg:text-[15px] font-extrabold text-slate-900 leading-none">₹{product.price}</p>
          </div>
          
          {!isOutOfStock && (
            <button 
              onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
              className={`w-7 h-7 lg:w-8 lg:h-8 rounded-full flex items-center justify-center transition shadow-sm ${
                inCart 
                  ? 'bg-brand text-white' 
                  : 'bg-slate-100 text-brand group-hover:bg-brand group-hover:text-white'
              }`}
            >
              {inCart ? <Check weight="bold" className="text-sm lg:text-base" /> : <Plus weight="bold" className="text-sm lg:text-base" />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
