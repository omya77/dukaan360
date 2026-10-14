import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import ReceiptModal from '../components/ReceiptModal';
import { 
  Receipt, 
  Calendar, 
  MagnifyingGlass, 
  FileText, 
  ArrowRight, 
  X, 
  Printer, 
  WhatsappLogo, 
  CurrencyInr, 
  CreditCard, 
  Coins, 
  BookBookmark,
  Sparkle,
  ClockCounterClockwise,
  User,
  CheckCircle,
  Funnel
} from '@phosphor-icons/react';
import { useLanguage } from '../contexts/LanguageContext';

const BillHistory = () => {
  const { t } = useLanguage();
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMethod, setFilterMethod] = useState("ALL");
  const [selectedBill, setSelectedBill] = useState(null);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    Promise.all([
      axios.get('http://localhost:8000/pos/bills/?limit=500'),
      axios.get('http://localhost:8000/products/'),
      axios.get('http://localhost:8000/customers/')
    ]).then(([billsRes, prodRes, custRes]) => {
      setBills(billsRes.data);
      setProducts(prodRes.data);
      setCustomers(custRes.data);
      setLoading(false);
    }).catch(err => {
      console.error("Error fetching data:", err);
      setLoading(false);
    });
  }, []);

  const getCustomerName = (customerId) => {
    if (!customerId) return t('walk_in_customer');
    const c = customers.find(x => x.id === customerId);
    return c ? c.name : t('walk_in_customer');
  };

  const getCustomerMobile = (customerId) => {
    if (!customerId) return null;
    const c = customers.find(x => x.id === customerId);
    return c ? c.mobile : null;
  };

  // Filter bills
  const filteredBills = bills.filter(b => {
    // 1. Method filter
    const billMethod = (b.payments?.[0]?.method || 'CASH').toUpperCase();
    if (filterMethod === 'CASH' && billMethod !== 'CASH') return false;
    if (filterMethod === 'UPI' && billMethod !== 'UPI') return false;
    if (filterMethod === 'Credit' && billMethod !== 'CREDIT' && billMethod !== 'KHATA') return false;
    if (filterMethod === 'TODAY') {
      const billDate = new Date(b.timestamp).toISOString().split('T')[0];
      const today = new Date().toISOString().split('T')[0];
      if (billDate !== today) return false;
    }

    // 2. Search filter
    if (searchTerm.trim() !== '') {
      const q = searchTerm.toLowerCase();
      const invoiceMatch = (b.invoice_number || '').toLowerCase().includes(q);
      const custName = getCustomerName(b.customer_id).toLowerCase();
      const custMobile = (getCustomerMobile(b.customer_id) || '').toLowerCase();
      return invoiceMatch || custName.includes(q) || custMobile.includes(q);
    }

    return true;
  });

  // Calculate high-level financial stats
  const totalRevenue = bills.reduce((acc, curr) => acc + (curr.grand_total || 0), 0);
  const cashBills = bills.filter(b => (b.payments?.[0]?.method || 'CASH').toUpperCase() === 'CASH');
  const cashTotal = cashBills.reduce((acc, curr) => acc + (curr.grand_total || 0), 0);
  
  const upiBills = bills.filter(b => (b.payments?.[0]?.method || '').toUpperCase() === 'UPI');
  const upiTotal = upiBills.reduce((acc, curr) => acc + (curr.grand_total || 0), 0);
  
  const creditBills = bills.filter(b => {
    const m = (b.payments?.[0]?.method || '').toUpperCase();
    return m === 'CREDIT' || m === 'KHATA';
  });
  const creditTotal = creditBills.reduce((acc, curr) => acc + (curr.grand_total || 0), 0);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-premium-app selection:bg-brand selection:text-white">
      <Header />
      
      <main className="flex-1 overflow-hidden p-3 lg:p-6 max-w-7xl mx-auto w-full flex flex-col gap-3 lg:gap-4">
        
        {/* Top Header & Stat Overview Cards */}
        <div className="flex flex-col gap-3 shrink-0">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <h1 className="text-xl lg:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                <ClockCounterClockwise weight="fill" className="text-brand text-2xl lg:text-3xl" />
                <span>{t('bill_history_title')}</span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-brand/10 text-brand border border-brand/20">
                  {bills.length} {t('bills_count')}
                </span>
              </h1>
              <p className="text-xs lg:text-[13px] font-bold text-slate-500 mt-0.5">
                {t('bill_history_subtitle')}
              </p>
            </div>
          </div>

          {/* 4 Summary Glass Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 lg:gap-3">
            {/* Total Revenue */}
            <div className="glass-panel p-3 lg:p-4 rounded-2xl flex items-center gap-3 border border-white/60 shadow-sm relative overflow-hidden group hover:shadow-md transition">
              <div className="w-10 h-10 lg:w-11 lg:h-11 rounded-xl bg-gradient-to-tr from-brand to-orange-400 flex items-center justify-center text-white shadow-md shadow-brand/20 shrink-0">
                <CurrencyInr weight="bold" className="text-xl lg:text-2xl" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] lg:text-[11px] font-extrabold text-slate-500 uppercase tracking-wide truncate">{t('total_invoiced')}</p>
                <h3 className="text-base lg:text-xl font-black text-slate-800 tracking-tight">
                  ₹{totalRevenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </h3>
                <span className="text-[9px] font-bold text-slate-400">{bills.length} {t('bills_count')}</span>
              </div>
            </div>

            {/* Cash Collected */}
            <div className="glass-panel p-3 lg:p-4 rounded-2xl flex items-center gap-3 border border-emerald-100/60 shadow-sm relative overflow-hidden group hover:shadow-md transition">
              <div className="w-10 h-10 lg:w-11 lg:h-11 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 shrink-0">
                <Coins weight="fill" className="text-xl lg:text-2xl" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] lg:text-[11px] font-extrabold text-emerald-600 uppercase tracking-wide truncate">{t('cash_pill')}</p>
                <h3 className="text-base lg:text-xl font-black text-slate-800 tracking-tight">
                  ₹{cashTotal.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </h3>
                <span className="text-[9px] font-bold text-emerald-700/70">{cashBills.length} {t('cash_pill')}</span>
              </div>
            </div>

            {/* UPI Online */}
            <div className="glass-panel p-3 lg:p-4 rounded-2xl flex items-center gap-3 border border-blue-100/60 shadow-sm relative overflow-hidden group hover:shadow-md transition">
              <div className="w-10 h-10 lg:w-11 lg:h-11 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0">
                <CreditCard weight="fill" className="text-xl lg:text-2xl" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] lg:text-[11px] font-extrabold text-blue-600 uppercase tracking-wide truncate">{t('upi_pill')}</p>
                <h3 className="text-base lg:text-xl font-black text-slate-800 tracking-tight">
                  ₹{upiTotal.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </h3>
                <span className="text-[9px] font-bold text-blue-700/70">{upiBills.length} {t('upi_pill')}</span>
              </div>
            </div>

            {/* Khata / Udhaar */}
            <div className="glass-panel p-3 lg:p-4 rounded-2xl flex items-center gap-3 border border-amber-100/60 shadow-sm relative overflow-hidden group hover:shadow-md transition">
              <div className="w-10 h-10 lg:w-11 lg:h-11 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-md shadow-amber-500/20 shrink-0">
                <BookBookmark weight="fill" className="text-xl lg:text-2xl" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] lg:text-[11px] font-extrabold text-amber-600 uppercase tracking-wide truncate">{t('khata_pill')}</p>
                <h3 className="text-base lg:text-xl font-black text-slate-800 tracking-tight">
                  ₹{creditTotal.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </h3>
                <span className="text-[9px] font-bold text-amber-700/70">{creditBills.length} {t('khata_pill')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="glass-panel p-2.5 lg:p-3 rounded-2xl border border-white/60 shadow-sm flex flex-col md:flex-row justify-between items-center gap-2.5 shrink-0">
          {/* Quick Filter Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 hide-scroll">
            <button 
              onClick={() => setFilterMethod('ALL')} 
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 whitespace-nowrap ${
                filterMethod === 'ALL' 
                  ? 'bg-slate-800 text-white shadow-sm' 
                  : 'bg-white/80 hover:bg-white text-slate-600 border border-slate-200/60'
              }`}
            >
              <span>{t('all_bills')}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${filterMethod === 'ALL' ? 'bg-white/20' : 'bg-slate-200'}`}>
                {bills.length}
              </span>
            </button>

            <button 
              onClick={() => setFilterMethod('TODAY')} 
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 whitespace-nowrap ${
                filterMethod === 'TODAY' 
                  ? 'bg-brand text-white shadow-sm' 
                  : 'bg-white/80 hover:bg-white text-slate-600 border border-slate-200/60'
              }`}
            >
              <span>{t('today_pill')}</span>
            </button>

            <button 
              onClick={() => setFilterMethod('CASH')} 
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 whitespace-nowrap ${
                filterMethod === 'CASH' 
                  ? 'bg-emerald-600 text-white shadow-sm' 
                  : 'bg-white/80 hover:bg-white text-slate-600 border border-slate-200/60'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>{t('cash_pill')} ({cashBills.length})</span>
            </button>

            <button 
              onClick={() => setFilterMethod('UPI')} 
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 whitespace-nowrap ${
                filterMethod === 'UPI' 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'bg-white/80 hover:bg-white text-slate-600 border border-slate-200/60'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              <span>{t('upi_pill')} ({upiBills.length})</span>
            </button>

            <button 
              onClick={() => setFilterMethod('Credit')} 
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 whitespace-nowrap ${
                filterMethod === 'Credit' 
                  ? 'bg-amber-600 text-white shadow-sm' 
                  : 'bg-white/80 hover:bg-white text-slate-600 border border-slate-200/60'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <span>{t('khata_pill')} ({creditBills.length})</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
            <input 
              type="text" 
              placeholder={t('search_invoices')} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="glass-input w-full h-9 rounded-xl text-xs lg:text-[13px] pl-9 pr-8 font-bold outline-none"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X weight="bold" className="text-xs" />
              </button>
            )}
          </div>
        </div>

        {/* Invoices List / Table Container */}
        <div className="flex-1 glass-panel rounded-2xl shadow-sm border border-white/60 overflow-hidden flex flex-col">
          
          {/* Desktop Table Header */}
          <div className="hidden lg:grid grid-cols-12 gap-4 px-5 py-3 bg-slate-100/70 border-b border-slate-200/60 text-[11px] font-black text-slate-500 uppercase tracking-wider shrink-0">
            <div className="col-span-3">{t('col_invoice_customer')}</div>
            <div className="col-span-3">{t('col_date_time')}</div>
            <div className="col-span-2">{t('col_payment_method')}</div>
            <div className="col-span-2 text-right">{t('bill_total')}</div>
            <div className="col-span-2 text-center">{t('col_quick_action')}</div>
          </div>

          {/* Scrollable Bill Rows */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-2 lg:p-3 space-y-2">
            {loading ? (
              <div className="flex flex-col justify-center items-center h-48 gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand"></div>
                <p className="text-xs font-bold text-slate-400">{t('loading')}</p>
              </div>
            ) : filteredBills.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-slate-400 py-10">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-300 mb-3">
                  <FileText weight="fill" className="text-3xl" />
                </div>
                <h3 className="font-extrabold text-base text-slate-700">{t('no_invoices_found')}</h3>
                <p className="text-xs font-medium text-slate-400 mt-1 max-w-xs text-center">
                  {searchTerm ? `No invoices match "${searchTerm}".` : 'No bills recorded in this filter yet.'}
                </p>
                {(searchTerm || filterMethod !== 'ALL') && (
                  <button 
                    onClick={() => { setSearchTerm(''); setFilterMethod('ALL'); }}
                    className="mt-4 px-4 py-1.5 rounded-xl bg-brand text-white text-xs font-bold shadow-sm hover:bg-brandHover transition"
                  >
                    {t('reset_filters')}
                  </button>
                )}
              </div>
            ) : (
              filteredBills.map(bill => {
                const pmtMethod = (bill.payments?.[0]?.method || 'CASH').toUpperCase();
                const custName = getCustomerName(bill.customer_id);
                const custMobile = getCustomerMobile(bill.customer_id);

                return (
                  <div 
                    key={bill.id}
                    onClick={() => setSelectedBill(bill)}
                    className="p-3 lg:px-5 lg:py-3.5 rounded-xl bg-white/70 hover:bg-white border border-slate-200/60 hover:border-brand/40 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col lg:grid lg:grid-cols-12 gap-2 lg:gap-4 items-start lg:items-center group"
                  >
                    {/* 1. Invoice & Customer */}
                    <div className="lg:col-span-3 flex items-center gap-3 w-full lg:w-auto">
                      <div className="w-9 h-9 rounded-xl bg-orange-100/70 text-brand flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <Receipt weight="bold" className="text-lg" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-black text-xs lg:text-sm text-slate-800 group-hover:text-brand transition-colors truncate">
                          #{bill.invoice_number}
                        </h4>
                        <p className="text-[11px] font-bold text-slate-500 truncate flex items-center gap-1">
                          <User weight="bold" className="text-[10px] text-slate-400 shrink-0" />
                          <span>{custName}</span>
                          {custMobile && <span className="text-[10px] text-slate-400">({custMobile})</span>}
                        </p>
                      </div>
                    </div>

                    {/* 2. Date & Time */}
                    <div className="lg:col-span-3 flex items-center gap-1.5 text-xs font-bold text-slate-600">
                      <Calendar weight="fill" className="text-slate-400 text-sm shrink-0" />
                      <span>
                        {new Date(bill.timestamp + 'Z').toLocaleString('en-IN', {
                          day: '2-digit', 
                          month: 'short', 
                          year: 'numeric', 
                          hour: '2-digit', 
                          minute: '2-digit'
                        })}
                      </span>
                    </div>

                    {/* 3. Payment Method Badge */}
                    <div className="lg:col-span-2">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                        pmtMethod === 'CASH' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        pmtMethod === 'UPI' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                        'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          pmtMethod === 'CASH' ? 'bg-emerald-500' :
                          pmtMethod === 'UPI' ? 'bg-blue-500' : 'bg-amber-500'
                        }`}></span>
                        <span>{pmtMethod === 'CASH' ? t('pmt_cash') : pmtMethod === 'UPI' ? t('pmt_upi') : t('pmt_credit')}</span>
                      </span>
                    </div>

                    {/* 4. Total Amount */}
                    <div className="lg:col-span-2 w-full lg:w-auto flex justify-between lg:justify-end items-center border-t lg:border-t-0 pt-2 lg:pt-0 border-slate-100">
                      <span className="lg:hidden text-xs font-bold text-slate-400">{t('total')}:</span>
                      <div className="text-right">
                        <p className="font-black text-base lg:text-[15px] text-slate-900 leading-none">
                          ₹{bill.grand_total.toFixed(2)}
                        </p>
                        <span className="text-[10px] font-bold text-slate-400">
                          {bill.items ? bill.items.length : 1} {t('items')}
                        </span>
                      </div>
                    </div>

                    {/* 5. Quick Action (Reprint / WhatsApp) */}
                    <div className="lg:col-span-2 w-full lg:w-auto flex justify-end items-center gap-2">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setSelectedBill(bill); }}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-brand hover:text-white text-slate-700 text-xs font-bold transition flex items-center gap-1.5 group-hover:bg-brand group-hover:text-white"
                        title={t('print_action')}
                      >
                        <Printer weight="bold" />
                        <span>{t('print_action')}</span>
                      </button>
                      <ArrowRight weight="bold" className="text-slate-300 group-hover:text-brand group-hover:translate-x-0.5 transition hidden lg:block" />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>

      {/* Full Thermal Receipt & WhatsApp Modal */}
      {selectedBill && (
        <ReceiptModal 
          invoice={{
            ...selectedBill,
            payment_method: selectedBill.payments?.[0]?.method || 'CASH',
            customer_name: getCustomerName(selectedBill.customer_id),
            customer_mobile: getCustomerMobile(selectedBill.customer_id),
            items: selectedBill.items.map(item => ({
              ...item,
              name: products.find(p => p.id === item.product_id)?.name || `Item #${item.product_id}`,
              price: item.rate
            }))
          }} 
          onClose={() => setSelectedBill(null)} 
        />
      )}
    </div>
  );
};

export default BillHistory;
