import React from 'react';
import { Plus, Check } from '@phosphor-icons/react';
import { useLanguage } from '../contexts/LanguageContext';

const ProductCard = ({ product, onAddToCart, cartQuantity = 0 }) => {
  const { t, tProduct, tUnit } = useLanguage();
  const isOutOfStock = product.stock <= 0;
  const inCart = cartQuantity > 0;

  return (
    <div 
      onClick={() => !isOutOfStock && onAddToCart(product)}
      className={`bg-white/95 backdrop-blur-xs rounded-2xl p-2.5 cursor-pointer group flex flex-col justify-between relative transition-all duration-200 min-h-[205px] h-auto ${
        isOutOfStock 
          ? 'opacity-60 cursor-not-allowed border border-slate-200/60' 
          : inCart 
            ? 'ring-2 ring-[#FF5722] border-[#FF5722] shadow-sm' 
            : 'border border-slate-200/80 shadow-xs hover:border-orange-300 hover:shadow-md'
      }`}
    >
      
      {/* Top-Right Quantity Badge when in cart */}
      {inCart && !isOutOfStock && (
        <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#FF5722] text-white rounded-full flex items-center justify-center text-xs font-black shadow-md shadow-orange-500/30 z-10 select-none">
          {cartQuantity}
        </div>
      )}

      {/* Product Image Box */}
      <div className="w-full h-24 rounded-xl overflow-hidden relative mb-2 bg-slate-50 border border-slate-100">
        <img 
          src={product.image || '/images/atta.jpg'} 
          alt={tProduct(product.name)}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = '/images/atta.jpg';
          }}
          className={`object-cover w-full h-full rounded-xl transition-transform duration-300 ${
            isOutOfStock ? 'grayscale' : 'group-hover:scale-105'
          }`}
        />
        
        {isOutOfStock ? (
          <div className="absolute inset-0 bg-white/40 flex items-center justify-center backdrop-blur-[1px]">
            <span className="bg-red-500 text-white text-[8px] font-bold px-2 py-0.5 rounded shadow-sm">{t('out_of_stock_badge')}</span>
          </div>
        ) : (
          <div className="absolute top-1.5 left-1.5 bg-black/75 backdrop-blur-xs text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-md shadow-xs select-none">
            {tUnit(product.size) || '1 PC'}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex-1 flex flex-col justify-between">
        <h3 className="font-bold text-xs text-slate-900 leading-snug line-clamp-2 min-h-[30px]">
          {tProduct(product.name)}
        </h3>

        {/* Price & Action Button */}
        <div className="flex justify-between items-end mt-2">
          <div>
            {product.mrp && product.mrp > product.price && (
              <span className="text-[10px] text-slate-400 line-through leading-none block">₹{product.mrp}</span>
            )}
            <p className="text-sm font-black text-slate-900 leading-tight">₹{product.price}</p>
          </div>
          
          {!isOutOfStock && (
            <button 
              onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
              className={`w-7 h-7 rounded-full flex items-center justify-center transition shadow-xs cursor-pointer ${
                inCart 
                  ? 'bg-[#FF5722] text-white shadow-md shadow-orange-500/30' 
                  : 'bg-orange-50/80 hover:bg-orange-100 text-[#FF5722] border border-orange-200/60'
              }`}
            >
              {inCart ? <Check weight="bold" className="text-sm" /> : <Plus weight="bold" className="text-sm" />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
