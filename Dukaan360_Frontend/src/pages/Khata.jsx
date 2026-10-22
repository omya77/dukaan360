import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import { BookBookmark, User, Phone, Money, ClockCounterClockwise as History, ArrowRight, UserCircle, X, MagnifyingGlass, WhatsappLogo, CheckCircle , Receipt} from '@phosphor-icons/react';
import { useLanguage } from '../contexts/LanguageContext';

const Khata = () => {
  const { t } = useLanguage();
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Payment Modal States
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [payAmount, setPayAmount] = useState('');
  const [payMethod, setPayMethod] = useState('Cash');
  
  // Add Customer States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCustName, setNewCustName] = useState('');
  const [newCustMobile, setNewCustMobile] = useState('');
  
  // Bulk Remind States
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [isFestModalOpen, setIsFestModalOpen] = useState(false);
  const [festIndex, setFestIndex] = useState(0);
  const [festMsg, setFestMsg] = useState('🙏 सस्नेह नमस्कार!\n\nदिवाळीच्या तुम्हाला आणि तुमच्या परिवाराला हार्दिक शुभेच्छा! ✨\n\nआपले नम्र,\n*Dukaan360 Retail*');
  const [bulkIndex, setBulkIndex] = useState(0);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get('http://localhost:8000/customers/');
      setCustomers(response.data);
      if (selectedCustomer) {
        const updated = response.data.find(c => c.id === selectedCustomer.id);
        if (updated) setSelectedCustomer(updated);
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleAddCustomer = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/customers/', {
        name: newCustName,
        mobile: newCustMobile,
        opening_balance: 0
      });
      alert(`Customer ${newCustName} added successfully!`);
      setIsAddModalOpen(false);
      setNewCustName('');
      setNewCustMobile('');
      fetchCustomers();
    } catch (err) {
      alert("Failed to add customer: " + (err.response?.data?.detail || err.message));
      console.error(err);
    }
  };

  const handleReceivePayment = async (e) => {
    e.preventDefault();
    if (!selectedCustomer) return;
    try {
      await axios.post(`http://localhost:8000/customers/${selectedCustomer.id}/pay/`, {
        amount: parseFloat(payAmount),
        payment_method: payMethod
      });
      alert("Payment received successfully!");
      setIsPayModalOpen(false);
      setPayAmount('');
      fetchCustomers();
    } catch (err) {
      alert("Payment failed: " + (err.response?.data?.detail || err.message));
    }
  };

  const handleWhatsAppReminder = () => {
    if (!selectedCustomer) return;
    const dateStr = new Date().toLocaleDateString('mr-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    let msg = `📅 *DUKAAN360 Reminder*\n\n`;
    msg += `नमस्कार *${selectedCustomer.name}* दादा/ताई,\n`;
    msg += `आज ${dateStr} तारीख आहे. तुमच्या खात्यावर *₹${selectedCustomer.current_due.toFixed(2)}* बाकी आहेत.\n\n`;
    msg += `कृपया लवकर दुकानात येऊन पैसे जमा करावेत. 🙏\n\n`;
    msg += `धन्यवाद!\n*Dukaan360 Retail*`;
    
    const encodedMsg = encodeURIComponent(msg);
    const waUrl = `https://wa.me/91${selectedCustomer.mobile}?text=${encodedMsg}`;
    window.open(waUrl, '_blank');
  };

  const filteredCustomers = customers.filter(c => 
    c.is_khata && (c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.mobile.includes(searchTerm))
  );

  const totalMarketOutstanding = customers.reduce((sum, cust) => sum + (cust.current_due || 0), 0);
  const pendingCustomers = customers.filter(c => (c.current_due || 0) > 0);

  return (
    <div className="h-screen flex flex-col bg-slate-50 overflow-hidden ">
      <Header />

      <main className="flex-1 flex overflow-hidden p-3 lg:p-6 max-w-7xl mx-auto w-full gap-4">
        
        {/* Left Column: Customer List */}
        <section className={`${selectedCustomer ? 'hidden lg:flex' : 'flex'} w-full lg:w-1/3 bg-white rounded-2xl shadow-sm border border-slate-200 flex-col overflow-hidden`}>
          <div className="p-4 border-b border-slate-100 bg-slate-50">
            <div className="flex justify-between items-center mb-2.5">
              <h2 className="font-black text-base text-slate-800 flex items-center gap-2">
                <BookBookmark weight="fill" className="text-brand text-lg" /> {t('khata_title')}
              </h2>
              <div className="flex gap-1.5">
                <button 
                  onClick={() => { setBulkIndex(0); setIsBulkModalOpen(true); }}
                  className="bg-[#25D366] text-white text-[11px] font-bold px-2.5 py-1.5 rounded-lg hover:bg-[#128C7E] transition shadow-xs flex items-center gap-1 cursor-pointer"
                  title="Send reminders"
                >
                  <WhatsappLogo weight="fill" className="text-xs" /> {t('bulk_remind')}
                </button>
                <button 
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-brand text-white text-[11px] font-bold px-2.5 py-1.5 rounded-lg hover:bg-brandHover transition shadow-xs cursor-pointer"
                >
                  {t('new_customer_btn')}
                </button>
              </div>
            </div>
            
            <div className="bg-orange-50 rounded-xl p-3 mb-3 border border-orange-100 flex justify-between items-center">
              <div>
                <p className="text-[10px] font-bold text-orange-600 uppercase tracking-wide">{t('market_outstanding')}</p>
                <h3 className="text-base font-black text-orange-700 mt-0.5">₹{totalMarketOutstanding.toFixed(2)}</h3>
              </div>
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-500">
                <Money weight="fill" className="text-base" />
              </div>
            </div>

            <div className="relative">
              <MagnifyingGlass weight="bold" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
              <input 
                type="text"
                placeholder={t('search_customers')}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full h-9 pl-8 pr-3 rounded-xl border border-slate-200 bg-white text-xs font-bold focus:border-brand focus:ring-1 focus:ring-brand/20 outline-none transition"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {loading ? (
              <div className="flex justify-center items-center h-20">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand"></div>
              </div>
            ) : filteredCustomers.length === 0 ? (
              <p className="text-center text-slate-400 text-sm mt-4">{t('no_customers_found')}</p>
            ) : (
              filteredCustomers.map(cust => (
                <button
                  key={cust.id}
                  onClick={() => setSelectedCustomer(cust)}
                  className={`w-full text-left px-4 py-2 rounded-xl transition flex justify-between items-center ${selectedCustomer?.id === cust.id ? 'bg-brand text-white shadow-md shadow-brand/20' : 'hover:bg-slate-50 border border-transparent hover:border-slate-200'}`}
                >
                  <div>
                    <h4 className={`font-bold text-[13px] break-words leading-snug ${selectedCustomer?.id === cust.id ? 'text-white' : 'text-slate-700'}`}>{cust.name}</h4>
                    <p className={`text-[10px] ${selectedCustomer?.id === cust.id ? 'text-brandLight' : 'text-slate-400'}`}>{cust.mobile}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold text-[13px] ${selectedCustomer?.id === cust.id ? 'text-white' : cust.current_due > 0 ? 'text-red-500' : 'text-green-500'}`}>
                      ₹{cust.current_due.toFixed(2)}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </section>

        {/* Right Column: Customer Details */}
        <section className={`${!selectedCustomer ? 'hidden lg:flex' : 'flex'} w-full lg:w-2/3 bg-white rounded-2xl shadow-sm border border-slate-200 flex-col overflow-hidden relative`}>
          {!selectedCustomer ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
              <UserCircle weight="fill" className="text-3xl mb-4 text-slate-200" />
              <p className="font-bold">{t('select_customer_to_view')}</p>
            </div>
          ) : (
            <>
              {/* Ledger Header */}
              <div className="p-4 lg:p-5 border-b border-slate-100 bg-white flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 shadow-sm z-10 relative">
                <div className="flex items-center gap-3 w-full lg:w-auto">
                  <button onClick={() => setSelectedCustomer(null)} className="lg:hidden p-2 -ml-2 text-slate-400 hover:text-slate-700">
                    <X weight="bold" className="text-xl" />
                  </button>
                  <div className="w-12 h-10 bg-orange-50 rounded-full flex items-center justify-center text-brand border border-orange-100 shrink-0">
                    <User weight="fill" className="text-2xl" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-slate-800">{selectedCustomer.name}</h2>
                    <p className="text-xs font-bold text-slate-500 flex items-center gap-1 mt-0.5">
                      <Phone weight="fill" className="text-slate-400" /> {selectedCustomer.mobile}
                      <span className="mx-1.5 text-slate-300">|</span>
                      <span className="uppercase text-[10px] tracking-wider text-slate-400">ID: {selectedCustomer.id}</span>
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 w-full lg:w-auto">
                  <button 
                    onClick={handleWhatsAppReminder}
                    className="flex-1 lg:flex-none px-3.5 py-2 bg-green-50 hover:bg-green-100 text-green-600 rounded-xl font-bold transition flex items-center justify-center gap-1.5 border border-green-200 text-xs active:scale-95 cursor-pointer"
                  >
                    <WhatsappLogo weight="fill" className="text-base" /> {t('remind')}
                  </button>
                  <button 
                    onClick={() => setIsPayModalOpen(true)}
                    className="flex-1 lg:flex-none px-3.5 py-2 bg-brand text-white rounded-xl font-bold shadow-xs hover:bg-brandHover transition flex items-center justify-center gap-1.5 text-xs active:scale-95 cursor-pointer"
                  >
                    <Money weight="fill" className="text-base" /> {t('receive_payment_btn')}
                  </button>
                </div>
              </div>

              {/* Ledger Content */}
              <div className="flex-1 overflow-y-auto p-3 lg:p-5 bg-slate-50/50">
                <div className="max-w-2xl mx-auto space-y-4">
                  
                  {/* Total Due Card */}
                  <div className={`p-4 lg:p-5 rounded-2xl shadow-xs border flex items-center justify-between ${selectedCustomer.current_due > 0 ? 'bg-white border-red-100' : 'bg-white border-green-100'}`}>
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">{t('total_due')}</p>
                      <h1 className={`text-lg sm:text-xl font-black ${selectedCustomer.current_due > 0 ? 'text-red-500' : 'text-green-500'}`}>
                        ₹{selectedCustomer.current_due.toFixed(2)}
                      </h1>
                    </div>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedCustomer.current_due > 0 ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'}`}>
                      <Money weight="fill" className="text-xl" />
                    </div>
                  </div>

                  {/* Transaction History */}
                  <div>
                    <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2 text-sm">
                      <History weight="bold" className="text-brand text-lg" /> {t('transaction_history')}
                    </h3>
                    
                    <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 shadow-sm">
                      <div className="p-4 flex justify-between items-center hover:bg-slate-50 transition">
                         <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                             <BookBookmark weight="fill" className="text-sm" />
                           </div>
                           <div>
                             <p className="font-bold text-sm text-slate-800">{t('opening_balance')}</p>
                             <p className="text-[11px] font-bold text-slate-400 mt-0.5">{t('initial_record')}</p>
                           </div>
                         </div>
                         <p className="font-black text-sm text-slate-800">₹0.00</p>
                      </div>

                      {selectedCustomer.current_due > 0 && (
                        <div className="p-4 flex justify-between items-center bg-red-50/30">
                           <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-500">
                               <Receipt weight="fill" className="text-sm" />
                             </div>
                             <div>
                               <p className="font-bold text-sm text-red-600">{t('total_khata_bills')}</p>
                               <p className="text-[11px] font-bold text-red-400 mt-0.5">{t('unpaid_invoices')}</p>
                             </div>
                           </div>
                           <p className="font-black text-sm text-red-600">+ ₹{selectedCustomer.current_due.toFixed(2)}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                </div>
              </div>
            </>
          )}
        </section>
      </main>

      {/* Receive Payment Modal */}
      {isPayModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6">
            <h3 className="font-black text-xl text-slate-800 mb-1">{t('receive_payment_btn')}</h3>
            <p className="text-sm font-bold text-slate-500 mb-6">{selectedCustomer?.name}</p>
            
            <form onSubmit={handleReceivePayment}>
              <div className="mb-4">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">{t('amount_received')} (₹)</label>
                <input 
                  type="number" required min="1" step="0.01" max={selectedCustomer?.current_due}
                  value={payAmount} onChange={e => setPayAmount(e.target.value)}
                  placeholder={t('amount_received')}
                  className="w-full h-10 border-2 border-slate-200 rounded-xl px-4 focus:border-brand outline-none text-lg font-black text-slate-800"
                />
              </div>
              <div className="mb-6">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">{t('col_payment_method')}</label>
                <div className="grid grid-cols-2 gap-2">
                  <button type="button" onClick={() => setPayMethod('Cash')} className={`py-2 rounded-xl font-bold border-2 transition ${payMethod === 'Cash' ? 'border-brand bg-brand/5 text-brand' : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200'}`}>{t('pmt_cash')}</button>
                  <button type="button" onClick={() => setPayMethod('UPI')} className={`py-2 rounded-xl font-bold border-2 transition ${payMethod === 'UPI' ? 'border-brand bg-brand/5 text-brand' : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200'}`}>{t('pmt_upi')}</button>
                </div>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => setIsPayModalOpen(false)} className="flex-1 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition">{t('cancel')}</button>
                <button type="submit" className="flex-[2] py-2 bg-brand text-white rounded-xl font-bold hover:bg-brandHover shadow-[0_4px_15px_rgba(255,87,34,0.3)] transition">{t('save_payment')}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Customer Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6">
            <h3 className="font-black text-xl text-slate-800 mb-6">{t('new_customer_btn')}</h3>
            
            <form onSubmit={handleAddCustomer} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">{t('full_name')}</label>
                <input 
                  type="text" required autoFocus
                  value={newCustName} onChange={e => setNewCustName(e.target.value)}
                  placeholder="ग्राहकाचे पूर्ण नाव"
                  className="w-full h-11 border-2 border-slate-200 rounded-xl px-4 focus:border-brand outline-none font-bold text-slate-800"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">{t('mobile_number')}</label>
                <input 
                  type="tel" required pattern="[0-9]{10}"
                  value={newCustMobile} onChange={e => setNewCustMobile(e.target.value)}
                  placeholder="१०-अंकी मोबाईल नंबर"
                  className="w-full h-11 border-2 border-slate-200 rounded-xl px-4 focus:border-brand outline-none font-bold text-slate-800"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition">{t('cancel')}</button>
                <button type="submit" className="flex-[2] py-2 bg-brand text-white rounded-xl font-bold hover:bg-brandHover shadow-[0_4px_15px_rgba(255,87,34,0.3)] transition">{t('save_customer')}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Reminder Modal */}
      {isBulkModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl p-6 relative overflow-hidden text-center">
            {/* Header Area */}
            <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-br from-[#25D366] to-[#128C7E] z-0 rounded-t-3xl"></div>
            
            <div className="relative z-10 mt-2">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-xl mb-4 border-4 border-white">
                <WhatsappLogo weight="fill" className="text-3xl text-[#25D366]" />
              </div>
              
              <h3 className="font-black text-xl text-slate-800 mb-1">{t('monthly_reminders')}</h3>
              <p className="text-slate-500 text-sm font-bold mb-6">{t('send_to_customers')}: {pendingCustomers.length}</p>

              {pendingCustomers.length === 0 ? (
                <div className="py-8">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle weight="fill" className="text-2xl" />
                  </div>
                  <h4 className="font-bold text-slate-800">{t('no_pending_dues')}</h4>
                  <p className="text-sm text-slate-500 mt-1">{t('everyone_cleared_khata')}</p>
                  <button 
                    onClick={() => setIsBulkModalOpen(false)}
                    className="w-full mt-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition"
                  >
                    {t('close')}
                  </button>
                </div>
              ) : bulkIndex < pendingCustomers.length ? (
                <div className="text-left bg-slate-50 border border-slate-100 rounded-2xl p-5 shadow-inner mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('sending_x_of_y')} {bulkIndex + 1} {t('of')} {pendingCustomers.length}</span>
                    <span className="text-xs font-black text-[#25D366] bg-green-100 px-2 py-0.5 rounded-full">{Math.round(((bulkIndex)/pendingCustomers.length)*100)}%</span>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm font-bold text-slate-500">{t('customer_name')}</p>
                    <p className="text-xl font-black text-slate-800 truncate">{pendingCustomers[bulkIndex].name}</p>
                    <p className="text-xs font-bold text-slate-400 mt-0.5">{pendingCustomers[bulkIndex].mobile}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-bold text-slate-500">{t('pending_amount')}</p>
                    <p className="text-2xl font-black text-red-500">{"\u20B9"}{pendingCustomers[bulkIndex].current_due.toFixed(2)}</p>
                  </div>

                  <div className="mt-6 flex gap-2">
                    <button 
                      onClick={() => setIsBulkModalOpen(false)}
                      className="flex-1 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition"
                    >
                      {t('cancel')}
                    </button>
                    <button 
                      onClick={() => {
                        const cust = pendingCustomers[bulkIndex];
                        const dateStr = new Date().toLocaleDateString('mr-IN', { day: '2-digit', month: 'short', year: 'numeric' });
                        let msg = `📅 *DUKAAN360 Monthly Reminder*\n\n`;
                        msg += `नमस्कार *${cust.name}* दादा/ताई,\n`;
                        msg += `आज ${dateStr} तारीख आहे. तुमच्या खात्यावर *₹${cust.current_due.toFixed(2)}* बाकी आहेत.\n\n`;
                        msg += `कृपया लवकरात लवकर दुकानात येऊन खात्याचे पैसे जमा करावेत ही विनंती. 🙏\n\n`;
                        msg += `धन्यवाद!\n*Dukaan360 Retail*`;
                        
                        const encodedMsg = encodeURIComponent(msg);
                        const waUrl = `https://wa.me/91${cust.mobile}?text=${encodedMsg}`;
                        window.open(waUrl, '_blank');
                        
                        setBulkIndex(prev => prev + 1);
                      }}
                      className="flex-[2] py-2 bg-[#25D366] text-white rounded-xl font-bold shadow-[0_4px_15px_rgba(37,211,102,0.3)] hover:bg-[#128C7E] transition flex items-center justify-center gap-1.5"
                    >
                      <WhatsappLogo weight="fill" className="text-lg" /> {t('send_and_next')}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="py-8">
                  <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                    <CheckCircle weight="fill" className="text-3xl" />
                  </div>
                  <h4 className="font-black text-2xl text-slate-800">{t('all_done')}</h4>
                  <p className="text-sm font-bold text-slate-500 mt-2">{t('reminders_sent_to_all')}</p>
                  <button 
                    onClick={() => setIsBulkModalOpen(false)}
                    className="w-full mt-8 py-2.5 bg-brand text-white font-bold rounded-xl hover:bg-brandHover shadow-lg shadow-brand/30 transition"
                  >
                    {t('close')}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}


      {/* Festival Wishes Modal */}
      {isFestModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl p-6 relative overflow-hidden text-center">
            <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-br from-orange-400 to-orange-600 z-0 rounded-t-3xl"></div>
            
            <div className="relative z-10 mt-2">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-xl mb-4 border-4 border-white">
                <WhatsappLogo weight="fill" className="text-4xl text-orange-500" />
              </div>
              
              <h3 className="font-black text-xl text-slate-800 mb-1">{t('festival_wishes')}</h3>
              <p className="text-slate-500 text-sm font-bold mb-4">{t('send_to_all_customers')} ({customers.length})</p>

              {festIndex < customers.length ? (
                <div className="text-left bg-slate-50 border border-slate-100 rounded-2xl p-4 shadow-inner mb-4">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('sending_x_of_y')} {festIndex + 1} {t('of')} {customers.length}</span>
                    <span className="text-xs font-black text-orange-500 bg-orange-100 px-2 py-0.5 rounded-full">{Math.round(((festIndex)/customers.length)*100)}%</span>
                  </div>
                  
                  <div className="mb-3">
                    <p className="text-sm font-bold text-slate-500">{t('customer_name')}</p>
                    <p className="text-lg font-black text-slate-800 truncate">{customers[festIndex].name}</p>
                  </div>
                  
                  <div>
                    <p className="text-xs font-bold text-slate-500 mb-1">Message:</p>
                    <textarea 
                      value={festMsg}
                      onChange={e => setFestMsg(e.target.value)}
                      className="w-full h-24 bg-white border border-slate-200 rounded-xl p-2 text-sm text-slate-700 outline-none focus:border-brand resize-none"
                    />
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button 
                      onClick={() => setIsFestModalOpen(false)}
                      className="flex-1 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition"
                    >
                      {t('cancel')}
                    </button>
                    <button 
                      onClick={() => {
                        const cust = customers[festIndex];
                        let msg = festMsg.replace('{name}', cust.name);
                        const encodedMsg = encodeURIComponent(msg);
                        const waUrl = `https://wa.me/91${cust.mobile}?text=${encodedMsg}`;
                        window.open(waUrl, '_blank');
                        setFestIndex(prev => prev + 1);
                      }}
                      className="flex-[2] py-2.5 bg-orange-500 text-white rounded-xl font-bold shadow-[0_4px_15px_rgba(249,115,22,0.3)] hover:bg-orange-600 transition flex items-center justify-center gap-1.5"
                    >
                      <WhatsappLogo weight="fill" className="text-lg" /> {t('send_and_next')}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="py-8">
                  <div className="w-20 h-20 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                    <CheckCircle weight="fill" className="text-4xl" />
                  </div>
                  <h4 className="font-black text-2xl text-slate-800">{t('all_done')}</h4>
                  <p className="text-sm font-bold text-slate-500 mt-2">{t('wishes_sent_to_all')}</p>
                  <button 
                    onClick={() => setIsFestModalOpen(false)}
                    className="w-full mt-6 py-3 bg-brand text-white font-bold rounded-xl hover:bg-brandHover shadow-lg shadow-brand/30 transition"
                  >
                    {t('close')}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Khata;
