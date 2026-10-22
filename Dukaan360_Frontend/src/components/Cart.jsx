import React, { useState } from 'react';
import { UserCircle, X, Minus, Plus, Money, QrCode, BookBookmark, ArrowRight, CaretUp } from '@phosphor-icons/react';
import { useLanguage } from '../contexts/LanguageContext';

const Cart = ({ cartItems, isMobileOpen, toggleMobileCart, updateQuantity, setExactQuantity, onCheckout, customers = [], selectedCustomerId, setSelectedCustomerId, openCustomerModal }) => {
  const { t, tProduct, tUnit } = useLanguage();
  const isWeightItem = (size, name = '') => {
    const s = String(size || '').toLowerCase();
    const n = String(name || '').toLowerCase();
    return (
      s.includes('kg') || s.includes('gm') || s.includes('gram') || s.includes('g') || 
      s.includes('litre') || s.includes('ltr') || s.includes('l') || s.includes('ml') ||
      s.includes('किलो') || s.includes('ग्रॅ') || s.includes('लिटर') || s.includes('मिली') ||
      n.includes('किलो') || n.includes('kg') || n.includes('ग्रॅ') || n.includes('gm') || 
      n.includes('लिटर') || n.includes('ltr') || n.includes('साखर') || n.includes('डाल') || 
      n.includes('डाळ') || n.includes('तेल') || n.includes('तूप') || n.includes('मीठ') || 
      n.includes('तांदूळ') || n.includes('गहू') || n.includes('रवा') || n.includes('पोहा') ||
      n.includes('पोहे') || n.includes('बेसन') || n.includes('शेंगदाणे') || n.includes('गूळ') ||
      n.includes('sugar') || n.includes('dal') || n.includes('oil') || n.includes('ghee') ||
      n.includes('salt') || n.includes('rice') || n.includes('wheat') || n.includes('atta') ||
      n.includes('flour')
    );
  };

  const getStep = (size, name = '') => {
    return isWeightItem(size, name) ? 0.25 : 1;
  };

  const getWeightLabel = (qty, size = '', name = '') => {
    const q = parseFloat(qty);
    if (!isWeightItem(size, name) || isNaN(q)) return null;
    if (q === 0.25) return 'पावशेर (250g)';
    if (q === 0.5) return 'अर्धा किलो (500g)';
    if (q === 0.75) return 'पाऊण किलो (750g)';
    if (q === 1) return '१ किलो';
    if (q === 1.25) return 'सव्वा किलो (1.25 kg)';
    if (q === 1.5) return 'दीड किलो (1.5 kg)';
    if (q === 1.75) return 'पावणे दोन किलो (1.75 kg)';
    if (q === 2) return '२ किलो';
    if (q > 0 && q < 1) return `${Math.round(q * 1000)}g`;
    return null;
  };

  const [selectedMethod, setSelectedMethod] = useState('Cash');
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * (parseFloat(item.quantity) || 0)), 0);
  const tax = 0; // 0% Tax
  const total = subtotal + tax;
  const totalItems = cartItems.reduce((sum, item) => sum + (parseFloat(item.quantity) || 0), 0);

  const selectedCust = customers.find(c => c.id === selectedCustomerId);

  return (
    <>
      {/* Mobile Floating Cart Bar */}
      <button 
        onClick={toggleMobileCart} 
        className="lg:hidden fixed bottom-3 left-3 right-3 bg-brand text-white rounded-2xl h-12 shadow-lg shadow-orange-500/40 flex items-center justify-between px-4 z-40 active:scale-95 transition-transform"
      >
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs">{totalItems}</div>
          <span className="font-semibold text-sm">{t('items')}</span>
        </div>
        <div className="flex items-center gap-1.5 font-bold text-base">
          ₹{total.toFixed(2)} <CaretUp weight="bold" className="text-sm" />
        </div>
      </button>

      {/* Mobile Backdrop */}
      <div 
        onClick={toggleMobileCart} 
        className={`lg:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isMobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      ></div>

      {/* Cart Container Panel */}
      <section className={`fixed bottom-0 left-0 right-0 h-[85vh] rounded-t-3xl bg-white/95 backdrop-blur-xl shadow-2xl z-50 flex flex-col lg:static lg:h-full lg:w-[350px] xl:w-[370px] lg:shadow-none lg:border-l border-white/60 lg:rounded-none transition-transform duration-300 lg:transform-none lg:transition-none lg:z-10 p-3 lg:p-4 justify-between ${
        isMobileOpen ? 'translate-y-0' : 'translate-y-full lg:translate-y-0'
      }`}>
        
        {/* Top Section: Header & Customer Quick Link */}
        <div className="shrink-0 space-y-2">
          {/* Mobile Handle Header */}
          <div className="lg:hidden flex items-center justify-between pb-2 border-b border-slate-100">
            <h2 className="font-bold text-base text-slate-800">{t('current_order')} ({totalItems})</h2>
            <button onClick={toggleMobileCart} className="w-7 h-7 bg-slate-100 rounded-full flex items-center justify-center text-slate-600">
              <X weight="bold" className="text-xs" />
            </button>
          </div>

          {/* Quick Customer Pill on top */}
          <button 
            onClick={openCustomerModal}
            className="w-full bg-white/90 hover:bg-white border border-slate-200/90 rounded-2xl px-3.5 py-2 flex items-center gap-2 text-left transition shadow-2xs group cursor-pointer"
          >
            <div className="w-5 h-5 rounded-full bg-orange-100 text-brand flex items-center justify-center shrink-0">
              <UserCircle weight="fill" className="text-base" />
            </div>
            <span className="text-xs font-bold text-slate-700 truncate group-hover:text-brand transition">
              {selectedCust ? selectedCust.name : (t('click_to_link_customer') || 'ग्राहक जोडण्यासाठी क्लिक करा...')}
            </span>
          </button>
        </div>

        {/* Middle Section: Scrollable Cart Items */}
        <div className="flex-1 overflow-y-auto cart-scroll py-2 space-y-2 my-1 pr-1">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 p-6 text-center">
              <span className="text-4xl mb-2">🛒</span>
              <p className="text-sm font-bold text-slate-600">{t('cart_empty') || 'कार्ट रिकामी आहे'}</p>
              <p className="text-xs text-slate-400 mt-0.5">{t('add_products_to_start') || 'बिलिंग सुरू करण्यासाठी वस्तू निवडा'}</p>
            </div>
          ) : (
            cartItems.map((item) => {
              const isWeight = isWeightItem(item.size, item.name);
              const weightBadge = getWeightLabel(item.quantity, item.size, item.name);
              const itemTotal = (item.price * (parseFloat(item.quantity) || 0));

              return (
                <div key={item.id} className="p-2.5 rounded-2xl bg-white/80 hover:bg-white border border-slate-200/70 hover:border-slate-300 flex flex-col gap-1.5 transition shadow-2xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200/80 overflow-hidden shrink-0 shadow-xs">
                      <img 
                        src={item.image || '/images/atta.jpg'} 
                        alt={tProduct(item.name)} 
                        onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/images/atta.jpg'; }}
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-1">
                        <h4 className="text-xs font-bold text-slate-900 truncate">{tProduct(item.name)}</h4>
                        <span className="text-xs font-black text-slate-900 shrink-0">
                          ₹{itemTotal.toFixed(2).replace(/\.00$/, '')}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center mt-1">
                        <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
                          <p className="text-[10px] text-slate-400 font-medium shrink-0">
                            {tUnit(item.size)} • ₹{item.price}
                          </p>
                          {weightBadge && (
                            <span className="text-[9px] font-black text-orange-600 bg-orange-50 px-1.5 py-0.2 rounded-md border border-orange-200/60 leading-tight">
                              {weightBadge}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button 
                            type="button"
                            onClick={() => updateQuantity(item.id, 'remove')} 
                            className="text-slate-400 hover:text-red-500 transition cursor-pointer p-0.5"
                            title="काढून टाका"
                          >
                            <X weight="bold" className="text-xs" />
                          </button>
                          <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 shadow-2xs">
                            <button 
                              type="button"
                              onClick={() => updateQuantity(item.id, -getStep(item.size, item.name))} 
                              className="w-5 h-5 flex items-center justify-center text-slate-600 hover:text-white hover:bg-brand rounded font-black text-xs cursor-pointer transition select-none active:scale-90"
                              title="कमी करा (अर्धा / पावशेर)"
                            >
                              −
                            </button>
                            <input 
                              type="number" 
                              step="any"
                              min="0"
                              value={item.quantity} 
                              onChange={(e) => setExactQuantity(item.id, e.target.value)} 
                              className="text-xs font-black w-10 text-center text-slate-900 bg-transparent outline-none focus:bg-orange-50/50 rounded"
                            />
                            <button 
                              type="button"
                              onClick={() => updateQuantity(item.id, getStep(item.size, item.name))} 
                              className="w-5 h-5 flex items-center justify-center text-slate-600 hover:text-white hover:bg-brand rounded font-black text-xs cursor-pointer transition select-none active:scale-90"
                              title="वाढवा"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Kirana Fraction Chips for Weight Items */}
                  {isWeight && (
                    <div className="flex items-center gap-1 pt-1.5 border-t border-slate-100/90">
                      {[
                        { label: 'पावशेर', qty: 0.25 },
                        { label: 'अर्धा किलो', qty: 0.5 },
                        { label: 'पाऊण किलो', qty: 0.75 },
                        { label: '१ किलो', qty: 1 }
                      ].map(preset => {
                        const isSelected = parseFloat(item.quantity) === preset.qty;
                        return (
                          <button
                            key={preset.label}
                            type="button"
                            onClick={() => setExactQuantity(item.id, preset.qty)}
                            className={`flex-1 py-0.5 px-1 rounded-md text-[9px] font-bold transition text-center cursor-pointer select-none ${
                              isSelected 
                                ? 'bg-[#FF5722] text-white font-black shadow-xs' 
                                : 'bg-slate-100/80 hover:bg-orange-50 text-slate-600 hover:text-[#FF5722]'
                            }`}
                          >
                            {preset.label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Section: Totals, Customer Card, Payment Methods & Checkout */}
        <div className="pt-2 shrink-0 space-y-2.5 border-t border-slate-200/70">
          
          {/* Subtotal & Tax */}
          <div className="space-y-1 text-xs text-slate-500 font-medium">
            <div className="flex justify-between">
              <span>{t('subtotal') || 'उपएकूण'}</span>
              <span className="font-bold text-slate-700">₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>{t('tax') || 'कर'} (0%)</span>
              <span className="font-bold text-slate-700">₹{tax.toFixed(2)}</span>
            </div>
          </div>

          {/* Grand Total */}
          <div className="flex justify-between items-center py-1">
            <span className="font-black text-sm text-slate-800">{t('total') || 'एकूण रक्कम'}</span>
            <span className="font-black text-2xl text-[#10B981]">₹{total.toFixed(2)}</span>
          </div>

          {/* Customer Selection Card */}
          <button 
            onClick={openCustomerModal}
            className="w-full bg-slate-50/90 hover:bg-slate-100 border border-slate-200/80 rounded-2xl p-2.5 flex items-center gap-2.5 transition text-left cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-full bg-slate-200/70 text-slate-500 flex items-center justify-center shrink-0 group-hover:bg-brand/10 group-hover:text-brand transition">
              <UserCircle weight="fill" className="text-lg" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase leading-none">
                {selectedCust ? (t('linked_customer') || 'ग्राहकाचे नाव') : (t('walk_in_customer') || 'नेहमीचा ग्राहक')}
              </p>
              <p className="text-xs font-black text-slate-800 truncate mt-1 leading-none group-hover:text-brand transition">
                {selectedCust ? selectedCust.name : (t('click_to_link_customer') || 'ग्राहक जोडण्यासाठी क्लिक करा...')}
              </p>
            </div>
            {selectedCust && (
              <div 
                onClick={(e) => { e.stopPropagation(); setSelectedCustomerId(null); }}
                className="text-slate-400 hover:text-red-500 p-1"
                title={t('remove_customer')}
              >
                <X weight="bold" className="text-xs" />
              </div>
            )}
          </button>

          {/* 3 Payment Options */}
          <div className="grid grid-cols-3 gap-2">
            <button 
              onClick={() => setSelectedMethod('Cash')}
              className={`py-2 rounded-xl text-xs font-bold transition flex flex-col items-center justify-center gap-1 cursor-pointer ${
                selectedMethod === 'Cash' 
                  ? 'border-2 border-emerald-500 bg-emerald-50/70 text-emerald-600 shadow-sm' 
                  : 'border border-slate-200 bg-white text-slate-500 hover:border-slate-300'
              }`}
            >
              <Money weight="fill" className="text-lg" />
              <span>{t('pmt_cash') || 'रोख'}</span>
            </button>
            <button 
              onClick={() => setSelectedMethod('UPI')}
              className={`py-2 rounded-xl text-xs font-bold transition flex flex-col items-center justify-center gap-1 cursor-pointer ${
                selectedMethod === 'UPI' 
                  ? 'border-2 border-emerald-500 bg-emerald-50/70 text-emerald-600 shadow-sm' 
                  : 'border border-slate-200 bg-white text-slate-500 hover:border-slate-300'
              }`}
            >
              <QrCode weight="fill" className="text-lg" />
              <span>{t('pmt_upi') || 'ऑनलाइन'}</span>
            </button>
            <button 
              onClick={() => setSelectedMethod('Credit')}
              className={`py-2 rounded-xl text-xs font-bold transition flex flex-col items-center justify-center gap-1 cursor-pointer ${
                selectedMethod === 'Credit' 
                  ? 'border-2 border-emerald-500 bg-emerald-50/70 text-emerald-600 shadow-sm' 
                  : 'border border-slate-200 bg-white text-slate-500 hover:border-slate-300'
              }`}
            >
              <BookBookmark weight="fill" className="text-lg" />
              <span>{t('pmt_credit') || 'उधारी'}</span>
            </button>
          </div>

          {/* Orange Checkout Button */}
          <button 
            onClick={() => onCheckout(selectedMethod)}
            disabled={cartItems.length === 0}
            className="w-full bg-gradient-to-r from-[#FF5722] via-[#FF6E40] to-[#FF8A65] hover:opacity-95 text-white font-black py-3 rounded-2xl shadow-lg shadow-orange-500/35 flex items-center justify-center gap-2 text-sm transition hover:scale-[1.01] active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
          >
            <span>
              {selectedMethod === 'Cash' ? 'रोख रकमेने बिल बनवा' : selectedMethod === 'UPI' ? 'ऑनलाइन पेमेंट बिल बनवा' : 'उधारी खाते बिल बनवा'}
            </span>
            <ArrowRight weight="bold" className="text-base" />
          </button>
        </div>

      </section>
    </>
  );
};

export default Cart;
