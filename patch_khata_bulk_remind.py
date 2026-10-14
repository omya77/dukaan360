import re

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/pages/Khata.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Add states
state_insert = """  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [bulkIndex, setBulkIndex] = useState(0);"""
text = text.replace("  const [isAddModalOpen, setIsAddModalOpen] = useState(false);", state_insert)

# 2. Add pending customers memo
memo_insert = """  const totalMarketOutstanding = customers.reduce((sum, cust) => sum + (cust.current_due || 0), 0);
  const pendingCustomers = customers.filter(c => (c.current_due || 0) > 0);"""
text = text.replace("  const totalMarketOutstanding = customers.reduce((sum, cust) => sum + (cust.current_due || 0), 0);", memo_insert)

# 3. Add Bulk Reminder Button
old_header = """            <div className="p-4 border-b border-slate-100 bg-slate-50">
              <div className="flex justify-between items-center mb-3">
                <h2 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                  <BookBookmark weight="fill" className="text-brand text-xl" /> Khata
                </h2>
                <button 
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-brand text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-brandHover transition shadow-sm"
                >
                  + New Customer
                </button>
              </div>"""

new_header = """            <div className="p-4 border-b border-slate-100 bg-slate-50">
              <div className="flex justify-between items-center mb-3">
                <h2 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                  <BookBookmark weight="fill" className="text-brand text-xl" /> Khata
                </h2>
                <div className="flex gap-2">
                  <button 
                    onClick={() => { setBulkIndex(0); setIsBulkModalOpen(true); }}
                    className="bg-[#25D366] text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-[#128C7E] transition shadow-[0_2px_10px_rgba(37,211,102,0.3)] flex items-center gap-1"
                    title="Send monthly reminders to everyone"
                  >
                    <WhatsappLogo weight="fill" className="text-sm" /> Bulk Remind
                  </button>
                  <button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-brand text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-brandHover transition shadow-sm"
                  >
                    + New
                  </button>
                </div>
              </div>"""
text = text.replace(old_header, new_header)

# 4. Inject Bulk Modal at the bottom
bulk_modal = """
      {/* Bulk Reminder Modal */}
      {isBulkModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl p-6 relative overflow-hidden text-center">
            {/* Header Area */}
            <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-br from-[#25D366] to-[#128C7E] z-0 rounded-t-3xl"></div>
            
            <div className="relative z-10 mt-2">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-xl mb-4 border-4 border-white">
                <WhatsappLogo weight="fill" className="text-4xl text-[#25D366]" />
              </div>
              
              <h3 className="font-black text-xl text-slate-800 mb-1">Monthly Reminders</h3>
              <p className="text-slate-500 text-sm font-bold mb-6">Send to {pendingCustomers.length} customers</p>

              {pendingCustomers.length === 0 ? (
                <div className="py-8">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle weight="fill" className="text-3xl" />
                  </div>
                  <h4 className="font-bold text-slate-800">No Pending Dues!</h4>
                  <p className="text-sm text-slate-500 mt-1">Everyone has cleared their Khata.</p>
                  <button 
                    onClick={() => setIsBulkModalOpen(false)}
                    className="w-full mt-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition"
                  >
                    Close
                  </button>
                </div>
              ) : bulkIndex < pendingCustomers.length ? (
                <div className="text-left bg-slate-50 border border-slate-100 rounded-2xl p-5 shadow-inner mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sending {bulkIndex + 1} of {pendingCustomers.length}</span>
                    <span className="text-xs font-black text-[#25D366] bg-green-100 px-2 py-0.5 rounded-full">{Math.round(((bulkIndex)/pendingCustomers.length)*100)}%</span>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm font-bold text-slate-500">Customer Name</p>
                    <p className="text-xl font-black text-slate-800 truncate">{pendingCustomers[bulkIndex].name}</p>
                    <p className="text-xs font-bold text-slate-400 mt-0.5">{pendingCustomers[bulkIndex].mobile}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-bold text-slate-500">Pending Amount</p>
                    <p className="text-2xl font-black text-red-500">{"\\u20B9"}{pendingCustomers[bulkIndex].current_due.toFixed(2)}</p>
                  </div>

                  <div className="mt-6 flex gap-2">
                    <button 
                      onClick={() => setIsBulkModalOpen(false)}
                      className="flex-1 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={() => {
                        const cust = pendingCustomers[bulkIndex];
                        const dateStr = new Date().toLocaleDateString('mr-IN', { day: '2-digit', month: 'short', year: 'numeric' });
                        let msg = `\uD83D\uDCC6 *DUKAAN360 Monthly Reminder*\n\n`;
                        msg += `नमस्कार *${cust.name}* दादा/ताई,\n`;
                        msg += `आज ${dateStr} तारीख आहे. तुमच्या खात्यावर *{"\\u20B9"}${cust.current_due.toFixed(2)}* बाकी आहेत.\n\n`;
                        msg += `कृपया लवकरात लवकर दुकानात येऊन खात्याचे पैसे जमा करावेत ही विनंती. \uD83D\uDE4F\n\n`;
                        msg += `धन्यवाद!\n*Dukaan360 Retail*`;
                        
                        const encodedMsg = encodeURIComponent(msg);
                        const waUrl = `https://wa.me/91${cust.mobile}?text=${encodedMsg}`;
                        window.open(waUrl, '_blank');
                        
                        setBulkIndex(prev => prev + 1);
                      }}
                      className="flex-[2] py-3 bg-[#25D366] text-white rounded-xl font-bold shadow-[0_4px_15px_rgba(37,211,102,0.3)] hover:bg-[#128C7E] transition flex items-center justify-center gap-1.5"
                    >
                      <WhatsappLogo weight="fill" className="text-lg" /> Send & Next
                    </button>
                  </div>
                </div>
              ) : (
                <div className="py-8">
                  <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                    <CheckCircle weight="fill" className="text-4xl" />
                  </div>
                  <h4 className="font-black text-2xl text-slate-800">All Done!</h4>
                  <p className="text-sm font-bold text-slate-500 mt-2">Reminders sent to all {pendingCustomers.length} customers.</p>
                  <button 
                    onClick={() => setIsBulkModalOpen(false)}
                    className="w-full mt-8 py-3.5 bg-brand text-white font-bold rounded-xl hover:bg-brandHover shadow-lg shadow-brand/30 transition"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}"""

# Ensure CheckCircle is imported from phosphor icons
if 'CheckCircle' not in text:
    text = text.replace("import { BookBookmark, User, Phone, Money, History, ArrowRight, UserCircle, X, MagnifyingGlass, WhatsappLogo } from '@phosphor-icons/react';", "import { BookBookmark, User, Phone, Money, History, ArrowRight, UserCircle, X, MagnifyingGlass, WhatsappLogo, CheckCircle } from '@phosphor-icons/react';")

# Find the final return statement wrapper div
end_div = "    </div>\n  );\n};"
text = text.replace(end_div, bulk_modal + "\n" + end_div)

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/pages/Khata.jsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Done")
