import re

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/pages/Khata.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Define the old right column
old_right_column_pattern = re.compile(r'\{\/\* Right Column: Customer Details \*\/}.*?<\/section>', re.MULTILINE | re.DOTALL)

# Define the new beautifully redesigned right column
new_right_column = """{/* Right Column: Customer Details */}
        <section className={`${!selectedCustomer ? 'hidden lg:flex' : 'flex'} w-full lg:w-2/3 bg-white rounded-3xl shadow-sm border border-slate-200 flex-col overflow-hidden relative`}>
          {!selectedCustomer ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-slate-50/50">
              <UserCircle weight="fill" className="text-7xl mb-4 text-slate-200" />
              <p className="font-bold text-lg text-slate-500">Select a customer to view khata</p>
              <p className="text-xs text-slate-400 mt-1">Their ledger, balance, and transaction history will appear here.</p>
            </div>
          ) : (
            <div className="flex flex-col h-full bg-slate-50/30">
              {/* Premium Header Banner */}
              <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 p-6 lg:p-8 shrink-0 overflow-hidden">
                {/* Decorative background circle */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                
                <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                  <div className="flex items-center gap-4">
                    <button onClick={() => setSelectedCustomer(null)} className="lg:hidden p-2 -ml-2 text-white/70 hover:text-white bg-white/10 rounded-xl backdrop-blur-md">
                      <X weight="bold" className="text-xl" />
                    </button>
                    <div className="w-16 h-16 bg-gradient-to-br from-brand to-orange-400 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-brand/30 shrink-0 border-2 border-white/20">
                      <User weight="fill" className="text-3xl" />
                    </div>
                    <div>
                      <h2 className="text-2xl lg:text-3xl font-black text-white tracking-tight">{selectedCustomer.name}</h2>
                      <div className="flex items-center gap-3 mt-1.5 opacity-80">
                        <p className="text-sm font-bold text-white flex items-center gap-1.5 bg-white/10 px-2.5 py-0.5 rounded-lg backdrop-blur-sm">
                          <Phone weight="fill" className="text-brandLight" /> {selectedCustomer.mobile}
                        </p>
                        <p className="text-[10px] font-black text-white/60 uppercase tracking-widest">ID: {selectedCustomer.id}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 w-full lg:w-auto">
                    <button 
                      onClick={handleWhatsAppReminder}
                      className="flex-1 lg:flex-none px-5 py-2.5 bg-[#25D366] text-white rounded-xl font-bold transition flex items-center justify-center gap-2 shadow-[0_4px_15px_rgba(37,211,102,0.3)] hover:bg-[#128C7E] border border-[#25D366]/50 text-sm active:scale-95"
                    >
                      <WhatsappLogo weight="fill" className="text-xl" /> Remind
                    </button>
                    <button 
                      onClick={() => setIsPayModalOpen(true)}
                      className="flex-1 lg:flex-none px-6 py-2.5 bg-white text-slate-900 rounded-xl font-black shadow-lg shadow-black/10 hover:bg-slate-50 transition flex items-center justify-center gap-2 text-sm active:scale-95"
                    >
                      <Money weight="bold" className="text-brand text-xl" /> Receive
                    </button>
                  </div>
                </div>
              </div>

              {/* Ledger Content Area */}
              <div className="flex-1 overflow-y-auto p-4 lg:p-8">
                <div className="max-w-3xl mx-auto space-y-8">
                  
                  {/* Balance Summary Card */}
                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
                    <div className="absolute right-0 bottom-0 w-32 h-32 bg-slate-50 rounded-full blur-2xl translate-x-1/3 translate-y-1/3"></div>
                    
                    <div className="relative z-10 flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner ${selectedCustomer.current_due > 0 ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'}`}>
                        <Money weight="fill" className="text-3xl" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">Total Pending Due</p>
                        <h1 className={`text-4xl lg:text-5xl font-black tracking-tighter ${selectedCustomer.current_due > 0 ? 'text-red-500' : 'text-green-500'}`}>
                          ₹{selectedCustomer.current_due.toFixed(2)}
                        </h1>
                      </div>
                    </div>
                    
                    <div className="relative z-10 bg-slate-50 px-5 py-3 rounded-2xl border border-slate-100 flex flex-col items-center sm:items-end min-w-[140px]">
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status</p>
                       {selectedCustomer.current_due > 0 ? (
                         <span className="bg-red-100 text-red-600 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider">Unpaid Balance</span>
                       ) : (
                         <span className="bg-green-100 text-green-600 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider">All Clear</span>
                       )}
                    </div>
                  </div>

                  {/* Transaction Timeline */}
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <History weight="bold" className="text-brand text-lg" /> Transaction History
                      </h3>
                      <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">Recent</span>
                    </div>
                    
                    <div className="bg-white rounded-3xl border border-slate-100 p-2 shadow-sm">
                      <div className="divide-y divide-slate-50">
                        
                        <div className="p-4 flex gap-4 hover:bg-slate-50/50 transition rounded-2xl">
                           <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                             <BookBookmark weight="fill" className="text-slate-400 text-lg" />
                           </div>
                           <div className="flex-1 flex justify-between items-center">
                             <div>
                               <p className="font-bold text-slate-700">Opening Balance</p>
                               <p className="text-[11px] font-bold text-slate-400 mt-0.5">Initial khata creation</p>
                             </div>
                             <p className="font-black text-slate-600">₹0.00</p>
                           </div>
                        </div>

                        {selectedCustomer.current_due > 0 && (
                          <div className="p-4 flex gap-4 hover:bg-slate-50/50 transition rounded-2xl">
                             <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                               <Receipt weight="fill" className="text-red-400 text-lg" />
                             </div>
                             <div className="flex-1 flex justify-between items-center">
                               <div>
                                 <p className="font-bold text-red-600">Total Khata Bills</p>
                                 <p className="text-[11px] font-bold text-red-400/70 mt-0.5">Cumulative unpaid invoices</p>
                               </div>
                               <div className="text-right">
                                 <p className="font-black text-red-600">+ ₹{selectedCustomer.current_due.toFixed(2)}</p>
                                 <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest mt-0.5">Due</p>
                               </div>
                             </div>
                          </div>
                        )}

                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}
        </section>"""

text = old_right_column_pattern.sub(new_right_column, text)

# Add Receipt to Phosphor imports if not present
if 'Receipt' not in text:
    text = text.replace("import { BookBookmark, User, Phone, Money, History, ArrowRight, UserCircle, X, MagnifyingGlass, WhatsappLogo, CheckCircle } from '@phosphor-icons/react';", "import { BookBookmark, User, Phone, Money, History, ArrowRight, UserCircle, X, MagnifyingGlass, WhatsappLogo, CheckCircle, Receipt } from '@phosphor-icons/react';")

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/pages/Khata.jsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Done")
