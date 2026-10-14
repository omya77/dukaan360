import React, { useRef, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Printer, X, DownloadSimple, WhatsappLogo } from '@phosphor-icons/react';

const ReceiptModal = ({ invoice, onClose }) => {
  const receiptRef = useRef();
  const [showWaInput, setShowWaInput] = useState(false);
  const [waNumber, setWaNumber] = useState('');
  const { user } = useAuth();
  const { t, tProduct } = useLanguage();

  const storeName = user?.store_name || 'RetailX Store';
  const storeAddress = user?.store_address || '';
  const storeMobile = user?.store_mobile || '';
  const cashierName = user?.name || t('cashier');

  const pmtName = (invoice.payment_method || '').toUpperCase() === 'CASH' 
    ? t('pmt_cash') 
    : (invoice.payment_method || '').toUpperCase() === 'UPI' 
    ? t('pmt_upi') 
    : t('pmt_credit');

  const handlePrint = () => {
    const printContent = receiptRef.current;
    const windowPrint = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');
    windowPrint.document.write(`
      <html>
        <head>
          <title>${t('print_receipt')} - ${invoice.invoice_number}</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@500;800&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
          <style>
            body { font-family: 'Space Mono', monospace; font-size: 13px; color: #000; }
            .brand-font { font-family: 'Inter', sans-serif; }
            @media print {
              body { margin: 0; padding: 0; background: #fff; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body onload="setTimeout(() => { window.print(); window.close(); }, 800);" class="p-4 flex justify-center bg-gray-100">
          <div class="w-[80mm] bg-white text-black p-4 pb-8" style="box-shadow: 0 10px 30px rgba(0,0,0,0.15);">
            
            <!-- Header -->
            <div class="text-center mb-4">
              <svg class="w-10 h-10 mx-auto mb-2 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
              <h2 class="text-3xl font-black tracking-tight brand-font">${storeName.toUpperCase()}</h2>
              <p class="text-xs mt-1.5">${storeAddress}</p>
              ${storeMobile ? `<p class="text-xs font-bold">Ph: ${storeMobile}</p>` : ''}
            </div>

            <!-- Tax Invoice Badge -->
            <div class="text-center mb-5">
              <span class="border border-black px-4 py-1.5 text-xs font-bold tracking-widest bg-black text-white rounded-sm">${t('tax_invoice')}</span>
            </div>

            <!-- Meta Data Grid -->
            <div class="border-y-2 border-dashed border-gray-300 py-2 mb-4 text-xs grid grid-cols-2 gap-y-2">
              <div><span class="text-gray-500 text-[10px] uppercase">${t('bill_no')}</span><br/><strong class="text-[13px]">${invoice.invoice_number}</strong></div>
              <div class="text-right"><span class="text-gray-500 text-[10px] uppercase">${t('date_time')}</span><br/><strong class="text-[11px]">${(invoice.timestamp ? new Date(invoice.timestamp + 'Z') : new Date()).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} ${(invoice.timestamp ? new Date(invoice.timestamp + 'Z') : new Date()).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</strong></div>
              <div><span class="text-gray-500 text-[10px] uppercase">${t('cashier')}</span><br/><strong>${cashierName}</strong></div>
              <div class="text-right"><span class="text-gray-500 text-[10px] uppercase">${t('payment_mode')}</span><br/><strong class="uppercase text-[13px] border-b border-black pb-0.5">${pmtName}</strong></div>
            </div>

            <!-- Items -->
            <table class="w-full mb-4 text-sm">
              <tr class="border-b-2 border-black">
                <th class="text-left pb-1 pt-1 font-bold">${t('table_item')}</th>
                <th class="text-center pb-1 pt-1 font-bold w-12">${t('table_qty')}</th>
                <th class="text-right pb-1 pt-1 font-bold w-16">${t('table_amt')}</th>
              </tr>
              ${invoice.items.map(item => `
                <tr class="border-b border-gray-200 border-dotted">
                  <td class="py-2.5 pr-2 text-xs uppercase leading-tight">${tProduct(item.name)}</td>
                  <td class="text-center py-2.5 text-xs">${item.quantity}</td>
                  <td class="text-right py-2.5 text-xs font-bold">\u20B9${item.quantity * item.price}</td>
                </tr>
              `).join('')}
            </table>

            <!-- Totals -->
            <div class="pt-2 text-sm">
              <div class="flex justify-between mb-1 text-xs text-gray-600"><span>${t('subtotal')}</span> <span>\u20B9${invoice.subtotal.toFixed(2)}</span></div>
              <div class="flex justify-between mb-1 text-xs text-gray-600"><span>${t('tax')} (0%)</span> <span>\u20B90.00</span></div>
              
              <div class="flex justify-between items-center mt-3 pt-3 border-t-2 border-black border-dashed text-[22px] brand-font font-black bg-gray-50 -mx-4 px-4 pb-2">
                <span>${t('total')}</span>
                <span>\u20B9${invoice.grand_total.toFixed(2)}</span>
              </div>
            </div>

            <!-- Footer & Barcode -->
            <div class="mt-8 text-center flex flex-col items-center">
              <svg class="w-[60%] h-10 mb-3 opacity-90" viewBox="0 0 100 30" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="0" y="0" width="2" height="30" fill="#000"/><rect x="4" y="0" width="4" height="30" fill="#000"/><rect x="10" y="0" width="2" height="30" fill="#000"/><rect x="14" y="0" width="6" height="30" fill="#000"/><rect x="22" y="0" width="2" height="30" fill="#000"/><rect x="26" y="0" width="8" height="30" fill="#000"/><rect x="36" y="0" width="4" height="30" fill="#000"/><rect x="42" y="0" width="2" height="30" fill="#000"/><rect x="46" y="0" width="6" height="30" fill="#000"/><rect x="54" y="0" width="2" height="30" fill="#000"/><rect x="58" y="0" width="8" height="30" fill="#000"/><rect x="68" y="0" width="4" height="30" fill="#000"/><rect x="74" y="0" width="2" height="30" fill="#000"/><rect x="78" y="0" width="6" height="30" fill="#000"/><rect x="86" y="0" width="2" height="30" fill="#000"/><rect x="90" y="0" width="8" height="30" fill="#000"/><rect x="100" y="0" width="2" height="30" fill="#000"/>
              </svg>
              <p class="font-bold mb-1 text-sm brand-font">${t('thank_you')}</p>
              <p class="text-[10px] text-gray-500 font-bold uppercase tracking-widest">${t('visit_again')}</p>
            </div>
          </div>
        </body>
      </html>
    `);
    windowPrint.document.close();
  };

  const handleWhatsAppShare = () => {
    const custNumber = invoice.customer_mobile || waNumber;
    if (!custNumber || custNumber.length < 10) {
      alert("Please enter a valid 10-digit mobile number");
      return;
    }

    const itemsSummary = invoice.items
      .map((it, idx) => `${idx + 1}. ${tProduct(it.name)} - ${it.quantity} x ₹${it.price} = ₹${it.quantity * it.price}`)
      .join('\n');

    const msg = `🧾 *${storeName.toUpperCase()}*\n📍 ${storeAddress}\n----------------------------\n*${t('tax_invoice')}*: #${invoice.invoice_number}\n${t('date_time')}: ${(invoice.timestamp ? new Date(invoice.timestamp + 'Z') : new Date()).toLocaleString('en-IN')}\n\n*${t('products')}:*\n${itemsSummary}\n\n----------------------------\n*${t('total')}: ₹${invoice.grand_total.toFixed(2)}*\n${t('payment_mode')}: ${pmtName}\n----------------------------\n${t('thank_you')}\n${t('visit_again')}`;

    const cleanNum = custNumber.replace(/[^0-9]/g, '');
    const fullNum = cleanNum.length === 10 ? `91${cleanNum}` : cleanNum;
    const waUrl = `https://wa.me/${fullNum}?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank');
    setShowWaInput(false);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-100 flex flex-col overflow-hidden max-h-[90vh]">
        
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-slate-800">{t('print_receipt')}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-red-500 transition">
            <X weight="bold" className="text-lg" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto bg-slate-200 flex-1 flex justify-center items-start">
          <div className="bg-white p-4 sm:p-6 pb-8 shadow-xl w-full max-w-[80mm] h-fit shrink-0 text-slate-800 relative">
            <div ref={receiptRef} className="text-[12px] leading-tight" style={{ fontFamily: "'Space Mono', 'Courier New', monospace" }}>
              <div className="text-center mb-4">
                <h2 className="text-2xl font-black mb-1 tracking-tight">{storeName.toUpperCase()}</h2>
                {storeAddress && <p className="text-xs mb-1">{storeAddress}</p>}
                {storeMobile && <p className="text-xs mb-1">Ph: {storeMobile}</p>}
                <p className="text-xs font-bold">GSTIN: 27AAAAA1234A1Z5</p>
              </div>

              <div className="border-t-2 border-dashed border-slate-300 py-2 mb-3 flex flex-col gap-1.5 text-xs">
                <div className="flex justify-between"><span>{t('bill_no')}:</span><span className="font-bold">{invoice.invoice_number}</span></div>
                <div className="flex justify-between">
                  <span>{t('date_time')}:</span>
                  <span>
                    {(invoice.timestamp ? new Date(invoice.timestamp + 'Z') : new Date()).toLocaleDateString('en-IN', {day: '2-digit', month:'2-digit', year:'numeric'})} 
                    {' '}
                    {(invoice.timestamp ? new Date(invoice.timestamp + 'Z') : new Date()).toLocaleTimeString('en-IN', {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>
                <div className="flex justify-between"><span>{t('cashier')}:</span><span>{cashierName}</span></div>
              </div>

              <table className="w-full mb-2">
                <thead>
                  <tr className="border-b-2 border-dashed border-slate-300">
                    <th className="pb-2 pt-1 font-bold text-left">{t('table_item')}</th>
                    <th className="pb-2 pt-1 font-bold text-center w-8">{t('table_qty')}</th>
                    <th className="pb-2 pt-1 font-bold text-right w-16">{t('table_amt')}</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-2 pr-2 text-left align-top max-w-[45mm] truncate">{tProduct(item.name)}</td>
                      <td className="py-2 text-center align-top">{item.quantity}</td>
                      <td className="py-2 text-right align-top">{item.quantity * item.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-4 pt-3 border-t-2 border-solid border-slate-800">
                <div className="flex justify-between mb-1.5 text-xs"><span>{t('subtotal')}</span><span>₹{invoice.subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between mb-1.5 text-xs"><span>{t('tax')} (0%)</span><span>₹0.00</span></div>
                <div className="flex justify-between items-center mt-3 pt-3 border-t-2 border-dashed border-slate-300 text-lg font-black">
                  <span>{t('total')}</span>
                  <span>₹{invoice.grand_total.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-6 text-center text-xs">
                <p className="mb-2">{t('payment_mode')}: <span className="font-bold uppercase px-2 py-0.5 border border-slate-800 rounded">{pmtName}</span></p>
                <div className="my-4 font-mono text-2xl tracking-widest">*{storeName.toUpperCase()}*</div>
                <p className="font-bold mb-1">{t('thank_you')}</p>
                <p>{t('visit_again')}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-3 bg-white border-t border-slate-100 flex flex-col gap-2 shrink-0">
          {showWaInput ? (
            <div className="flex gap-2 w-full">
              <input 
                type="tel" 
                maxLength={10}
                placeholder="Enter 10-digit mobile..." 
                value={waNumber} 
                onChange={e => setWaNumber(e.target.value)}
                className="flex-1 h-10 border-2 border-green-500 rounded-xl px-4 focus:outline-none focus:ring-4 focus:ring-green-500/20 text-sm font-bold bg-green-50/30"
              />
              <button 
                onClick={handleWhatsAppShare}
                className="h-10 px-6 bg-green-500 text-white font-bold text-sm rounded-xl hover:bg-green-600 shadow-[0_4px_15px_rgba(34,197,94,0.3)] transition-transform active:scale-95"
              >
                {t('direct_send')}
              </button>
              <button 
                onClick={() => setShowWaInput(false)}
                className="h-10 w-12 flex items-center justify-center bg-slate-100 text-slate-500 font-bold text-lg rounded-xl hover:bg-slate-200 transition-transform active:scale-95 shrink-0"
              >
                <X weight="bold" />
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              <button onClick={onClose} className="py-2 bg-slate-100 text-slate-700 rounded-xl text-[11px] sm:text-xs font-bold hover:bg-slate-200 transition flex flex-col items-center justify-center gap-1 active:scale-95">
                <X weight="bold" className="text-xl" /> {t('new_bill')}
              </button>
              
              {invoice.customer_mobile ? (
                <button onClick={handleWhatsAppShare} className="py-2 bg-[#25D366] text-white rounded-xl text-[11px] sm:text-xs font-bold shadow-[0_2px_15px_rgba(37,211,102,0.3)] hover:bg-[#128C7E] transition flex flex-col items-center justify-center gap-1 active:scale-95">
                  <WhatsappLogo weight="fill" className="text-xl" /> {t('direct_send')}
                </button>
              ) : (
                <button onClick={() => setShowWaInput(true)} className="py-2 bg-[#25D366] text-white rounded-xl text-[11px] sm:text-xs font-bold shadow-[0_2px_15px_rgba(37,211,102,0.3)] hover:bg-[#128C7E] transition flex flex-col items-center justify-center gap-1 active:scale-95">
                  <WhatsappLogo weight="fill" className="text-xl" /> {t('whatsapp')}
                </button>
              )}
              
              <button onClick={handlePrint} className="py-2 bg-brand text-white rounded-xl text-[11px] sm:text-xs font-bold shadow-[0_2px_15px_rgba(255,87,34,0.3)] hover:bg-brandHover transition flex flex-col items-center justify-center gap-1 active:scale-95">
                <Printer weight="fill" className="text-xl" /> {t('print_bill')}
              </button>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
};

export default ReceiptModal;
