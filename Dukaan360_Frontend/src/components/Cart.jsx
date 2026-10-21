import React, { useState } from 'react';
import { UserCircle, X, Minus, Plus, Money, QrCode, BookBookmark, ArrowRight, CaretUp, WarningCircle } from '@phosphor-icons/react';
import { useLanguage } from '../contexts/LanguageContext';

const Cart = ({ cartItems, isMobileOpen, toggleMobileCart, updateQuantity, setExactQuantity, onCheckout, customers = [], selectedCustomerId, setSelectedCustomerId, openCustomerModal }) => {
  const { t, tProduct, tUnit } = useLanguage();
  const getStep = (size) => {
    const s = String(size || '').toLowerCase();
    const isWeight = s.includes('kg') || s.includes('gm') || s.includes('g') || s.includes('litre') || s.includes('l') || s.includes('ml');
    return isWeight ? 0.25 : 1;
  };

  const [selectedMethod, setSelectedMethod] = useState('Cash');
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * (parseFloat(item.quantity) || 0)), 0);
  const tax = 0; // 0% Tax for now
  const total = subtotal + tax;
  const totalItems = cartItems.reduce((sum, item) => sum + (parseFloat(item.quantity) || 0), 0);

  const selectedCust = customers.find(c => c.id === selectedCustomerId);
  const isLimitExceeded = selectedCust && (selectedCust.current_due + total > 5000);

  return (
    <>
      {/* Mobile Floating Cart Button */}
      <button 
        onClick={toggleMobileCart} 
        className="lg:hidden fixed bottom-3 left-3 right-3 bg-brand text-white rounded-xl h-10 shadow-[0_4px_15px_rgba(255,87,34,0.4)] flex items-center justify-between px-4 z-40 active:scale-95 transition-transform"
      >
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs">{totalItems}</div>
          <span className="font-semibold text-sm">{t('items')}</span>
        </div>
        <div className="flex items-center gap-1.5 font-bold text-base">
          ₹{total.toFixed(2)} <CaretUp weight="bold" className="text-sm" />
        </div>
      </button>

      {/* Mobile Overlay */}
      <div 
        onClick={toggleMobileCart} 
        className={`lg:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isMobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      ></div>

      {/* Cart Container */}
      <section className={`fixed bottom-0 left-0 right-0 h-[80vh] rounded-t-2xl glass-panel shadow-2xl z-50 flex flex-col lg:static lg:h-full lg:w-[320px] xl:w-[340px] lg:shadow-none lg:border-l border-white/50 lg:rounded-none transition-transform duration-300 lg:transform-none lg:transition-none lg:z-10 ${
        isMobileOpen ? 'translate-y-0' : 'translate-y-full lg:translate-y-0'
      }`}>
        
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-3 border-b border-slate-100 glass-panel rounded-t-2xl border-b border-white/40 shrink-0">
          <h2 className="font-bold text-base text-slate-800">{t('current_order')} ({totalItems})</h2>
          <button onClick={toggleMobileCart} className="w-7 h-7 bg-slate-100 rounded-full flex items-center justify-center text-slate-600">
            <X weight="bold" className="text-xs" />
          </button>
        </div>

        {/* Customer Input */}
        <div className="p-2.5 lg:p-3 border-b border-slate-100 shrink-0">
          <div className="bg-slate-50 rounded-lg border border-slate-200 p-1 flex items-center focus-within:bg-white focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20 transition-all">
            <div className="pl-2 pr-1.5 text-brand"><UserCircle weight="fill" className="text-lg lg:text-lg" /></div>
            <input 
              type="text" 
              placeholder={t('click_to_link_customer')} 
              onClick={openCustomerModal}
              readOnly
              value={selectedCust ? selectedCust.name : ''}
              className="flex-1 h-8 bg-transparent text-[13px] font-bold cursor-pointer focus:outline-none text-slate-700 placeholder-slate-400" 
            />
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto cart-scroll p-1.5 lg:p-2 flex flex-col gap-0.5">
          {cartItems.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-4 text-center">
              <span className="text-4xl mb-2">🛒</span>
              <p className="text-sm font-bold text-slate-600">{t('cart_empty')}</p>
              <p className="text-xs text-slate-400 mt-0.5">{t('add_products_to_start')}</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="p-2 lg:p-2.5 rounded-lg hover:bg-slate-50 flex gap-2 group transition">
                <div className="w-10 h-10 lg:w-11 lg:h-11 bg-slate-100 rounded-md p-0 shrink-0 border border-slate-200 flex items-center justify-center overflow-hidden">
                  <img src={item.image} alt={tProduct(item.name)} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <h4 className="text-[11px] lg:text-xs font-bold text-slate-800 line-clamp-1 pr-1">{tProduct(item.name)}</h4>
                    <span className="font-bold text-xs lg:text-[13px] text-slate-900">₹{item.price * item.quantity}</span>
                  </div>
                  <div className="flex justify-between items-center mt-0.5">
                    <p className="text-[9px] lg:text-[10px] font-medium text-slate-500">{tUnit(item.size)} • ₹{item.price}</p>
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => updateQuantity(item.id, 'remove')} className="text-red-400 hover:text-red-500 transition mr-1">
                        <X weight="bold" />
                      </button>
                      <div className="flex items-center gap-0.5 bg-white border border-slate-200 rounded px-1 py-0.5 shadow-sm">
                      <button onClick={() => updateQuantity(item.id, -getStep(item.size))} className="text-brand hover:text-brandHover font-bold text-[10px] lg:text-xs px-1"><Minus weight="bold" /></button>
                      <input 
                        type="number" step="any"  
                        value={item.quantity} 
                        onChange={(e) => setExactQuantity(item.id, e.target.value)} 
                        className="text-[10px] lg:text-xs font-bold w-12 text-center text-slate-800 bg-transparent focus:outline-none focus:ring-1 focus:ring-brand rounded" 
                      />
                      <button onClick={() => updateQuantity(item.id, getStep(item.size))} className="text-brand hover:text-brandHover font-bold text-[10px] lg:text-xs px-1"><Plus weight="bold" /></button>
                    </div>
                    </div>
                  </div>
                  </div>
              </div>
            ))
          )}
        </div>

        {/* Bottom Payment Dashboard */}
        <div className="bg-slate-50 p-3 lg:p-4 rounded-t-2xl border-t border-slate-200 shrink-0">
          <div className="flex justify-between text-[11px] lg:text-xs mb-1 text-slate-500 font-medium">
            <span>{t('subtotal')}</span>
            <span className="text-slate-800">₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-[11px] lg:text-xs mb-2 text-slate-500 font-medium">
            <span>{t('tax')} (0%)</span>
            <span className="text-slate-800">₹{tax.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between items-end mb-3 py-2 border-t border-slate-200 border-dashed">
            <span className="text-[13px] lg:text-sm text-slate-700 font-bold">{t('total')}</span>
            <span className="text-lg lg:text-lg font-black text-green-600 leading-none">₹{total.toFixed(2)}</span>
          </div>

          {/* Attractive Customer Selector Button */}
          <div className="mb-3">
            <button 
              onClick={openCustomerModal}
              className={`w-full p-2.5 rounded-xl border-2 flex items-center justify-between transition-all shadow-sm ${selectedCustomerId ? 'border-brand bg-brand/5 hover:bg-brand/10' : 'border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-slate-100'}`}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-inner ${selectedCustomerId ? 'bg-gradient-to-br from-brand to-brandHover text-white' : 'bg-slate-200 text-slate-500'}`}>
                  <UserCircle weight={selectedCustomerId ? 'fill' : 'duotone'} className="text-lg" />
                </div>
                <div className="text-left truncate">
                  {selectedCustomerId ? (
                    <>
                      <p className="text-[10px] font-black text-brand uppercase tracking-wider mb-0.5">{t('linked_customer')}</p>
                      <p className="text-sm font-black text-slate-800 truncate leading-none">{customers.find(c => c.id === selectedCustomerId)?.name}</p>
                    </>
                  ) : (
                    <>
                      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">{t('walk_in_customer')}</p>
                      <p className="text-xs font-black text-slate-700 leading-none">{t('click_to_link_customer')}</p>
                    </>
                  )}
                </div>
              </div>
              {selectedCustomerId && (
                <div 
                  onClick={(e) => { e.stopPropagation(); setSelectedCustomerId(null); }}
                  className="w-8 h-8 rounded-full bg-slate-200/60 text-slate-500 flex items-center justify-center hover:bg-red-100 hover:text-red-500 hover:shadow-sm shrink-0 transition-all"
                  title={t('remove_customer')}
                >
                  <X weight="bold" className="text-sm" />
                </div>
              )}
            </button>
          </div>
          <div className="grid grid-cols-3 gap-1.5 lg:gap-2 mb-3">
            <button 
              onClick={() => setSelectedMethod('Cash')} 
              className={`py-2 rounded-lg text-[9px] lg:text-[10px] font-bold transition flex flex-col items-center gap-0.5 shadow-sm border-2 ${selectedMethod === 'Cash' ? 'border-green-500 bg-green-50 text-green-700' : 'border-slate-200 bg-white text-slate-500 hover:border-green-300'}`}
            >
              <Money weight="fill" className={`text-lg lg:text-lg ${selectedMethod === 'Cash' ? 'text-green-500' : 'text-slate-400'}`} /> {t('pmt_cash')}
            </button>
            <button 
              onClick={() => setSelectedMethod('UPI')} 
              className={`py-2 rounded-lg text-[9px] lg:text-[10px] font-bold transition flex flex-col items-center gap-0.5 shadow-sm border-2 ${selectedMethod === 'UPI' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 bg-white text-slate-500 hover:border-blue-300'}`}
            >
              <QrCode weight="fill" className={`text-lg lg:text-lg ${selectedMethod === 'UPI' ? 'text-blue-500' : 'text-slate-400'}`} /> {t('pmt_upi')}
            </button>
            <button 
              onClick={() => setSelectedMethod('Credit')} 
              className={`py-2 rounded-lg text-[9px] lg:text-[10px] font-bold transition flex flex-col items-center gap-0.5 shadow-sm border-2 ${selectedMethod === 'Credit' ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-slate-200 bg-white text-slate-500 hover:border-orange-300'}`}
            >
              <BookBookmark weight="fill" className={`text-lg lg:text-lg ${selectedMethod === 'Credit' ? 'text-orange-500' : 'text-slate-400'}`} /> {t('pmt_credit')}
            </button>
          </div>
          
          <button 
            onClick={() => onCheckout(selectedMethod)} 
            className="w-full h-10 lg:h-10 bg-brand hover:bg-brandHover text-white rounded-lg font-bold text-[13px] lg:text-sm shadow-[0_2px_10px_rgba(255,87,34,0.3)] transition-all flex items-center justify-center gap-1.5 transform active:scale-95"
          >
            {selectedMethod === 'Cash' ? t('checkout_cash') : selectedMethod === 'UPI' ? t('checkout_upi') : t('checkout_khata')}
            <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center ml-1">
              <ArrowRight weight="bold" className="text-[10px]" />
            </div>
          </button>
        </div>
        
      </section>
    </>
  );
};

export default Cart;
