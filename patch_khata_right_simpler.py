import re

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/pages/Khata.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Define the old heavy right column
old_right_column_pattern = re.compile(r'\{\/\* Right Column: Customer Details \*\/}.*?<\/section>', re.MULTILINE | re.DOTALL)

# Define the new matching, elegant, properly scaled right column
new_right_column = """{/* Right Column: Customer Details */}
        <section className={`${!selectedCustomer ? 'hidden lg:flex' : 'flex'} w-full lg:w-2/3 bg-white rounded-2xl shadow-sm border border-slate-200 flex-col overflow-hidden relative`}>
          {!selectedCustomer ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
              <UserCircle weight="fill" className="text-6xl mb-4 text-slate-200" />
              <p className="font-bold">Select a customer to view ledger</p>
            </div>
          ) : (
            <>
              {/* Ledger Header */}
              <div className="p-4 lg:p-5 border-b border-slate-100 bg-white flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 shadow-sm z-10 relative">
                <div className="flex items-center gap-3 w-full lg:w-auto">
                  <button onClick={() => setSelectedCustomer(null)} className="lg:hidden p-2 -ml-2 text-slate-400 hover:text-slate-700">
                    <X weight="bold" className="text-xl" />
                  </button>
                  <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-brand border border-orange-100 shrink-0">
                    <User weight="fill" className="text-2xl" />
                  </div>
                  <div>
                    <h2 className="text-lg lg:text-xl font-black text-slate-800">{selectedCustomer.name}</h2>
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
                    className="flex-1 lg:flex-none px-4 py-2.5 bg-green-50 hover:bg-green-100 text-green-600 rounded-xl font-bold transition flex items-center justify-center gap-2 border border-green-200 text-sm active:scale-95"
                  >
                    <WhatsappLogo weight="fill" className="text-lg" /> Remind
                  </button>
                  <button 
                    onClick={() => setIsPayModalOpen(true)}
                    className="flex-1 lg:flex-none px-5 py-2.5 bg-brand text-white rounded-xl font-bold shadow-[0_2px_10px_rgba(255,87,34,0.2)] hover:bg-brandHover transition flex items-center justify-center gap-2 text-sm active:scale-95"
                  >
                    <Money weight="fill" className="text-lg" /> Receive Payment
                  </button>
                </div>
              </div>

              {/* Ledger Content */}
              <div className="flex-1 overflow-y-auto p-4 lg:p-6 bg-slate-50/50">
                <div className="max-w-2xl mx-auto space-y-6">
                  
                  {/* Total Due Card */}
                  <div className={`p-5 lg:p-6 rounded-2xl shadow-sm border flex items-center justify-between ${selectedCustomer.current_due > 0 ? 'bg-white border-red-100' : 'bg-white border-green-100'}`}>
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Total Due Amount</p>
                      <h1 className={`text-3xl font-black ${selectedCustomer.current_due > 0 ? 'text-red-500' : 'text-green-500'}`}>
                        ₹{selectedCustomer.current_due.toFixed(2)}
                      </h1>
                    </div>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${selectedCustomer.current_due > 0 ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'}`}>
                      <Money weight="fill" className="text-2xl" />
                    </div>
                  </div>

                  {/* Transaction History */}
                  <div>
                    <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2 text-sm">
                      <ClockCounterClockwise weight="bold" className="text-brand text-lg" /> Transaction History
                    </h3>
                    
                    <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 shadow-sm">
                      <div className="p-4 flex justify-between items-center hover:bg-slate-50 transition">
                         <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                             <BookBookmark weight="fill" className="text-sm" />
                           </div>
                           <div>
                             <p className="font-bold text-sm text-slate-800">Opening Balance</p>
                             <p className="text-[11px] font-bold text-slate-400 mt-0.5">Initial record</p>
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
                               <p className="font-bold text-sm text-red-600">Total Khata Bills</p>
                               <p className="text-[11px] font-bold text-red-400 mt-0.5">Unpaid invoices</p>
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
        </section>"""

text = old_right_column_pattern.sub(new_right_column, text)

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/pages/Khata.jsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Done")
