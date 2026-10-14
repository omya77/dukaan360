import re

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/pages/POS.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Instead of regex, I will extract everything from `{/* Customer Selection Modal for Khata */}`
# up to `{/* UPI QR Scanner Modal */}`
start_marker = "{/* Customer Selection Modal for Khata */}"
end_marker = "{/* UPI QR Scanner Modal */}"

start_idx = text.find(start_marker)
end_idx = text.find(end_marker)

if start_idx != -1 and end_idx != -1:
    old_modal = text[start_idx:end_idx]
    
    correct_modal = """{/* Customer Selection Modal for Khata */}
      {isCustomerModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6 flex flex-col max-h-[90vh]">
            <h3 className="font-bold text-lg text-slate-800 mb-4">Select or Add Customer</h3>
            
            {!showAddNewCustomer ? (
              <>
                <div className="flex-1 overflow-y-auto cart-scroll pr-2 mb-4 space-y-2">
                  {customers.length === 0 ? (
                    <p className="text-slate-500 text-center text-sm mt-4">No customers found.</p>
                  ) : (
                    customers.map(cust => (
                      <button
                        key={cust.id}
                        onClick={() => {
                          if (pendingCheckoutMethod) {
                            processCheckout(pendingCheckoutMethod, cust.id);
                          } else {
                            setSelectedCustomerId(cust.id);
                            setIsCustomerModalOpen(false);
                          }
                        }}
                        className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-brand hover:bg-brandLight transition flex justify-between items-center bg-slate-50"
                      >
                        <div>
                          <p className="font-bold text-slate-800 text-sm">{cust.name}</p>
                          <p className="text-[10px] text-slate-500">{cust.mobile}</p>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold text-xs ${cust.current_due > 0 ? 'text-red-500' : 'text-green-600'}`}>
                            Due: {"\\u20B9"}{cust.current_due.toFixed(2)}
                          </p>
                        </div>
                      </button>
                    ))
                  )}
                </div>
                
                <div className="flex gap-2">
                  <button 
                    onClick={() => setShowAddNewCustomer(true)}
                    className="flex-[2] py-3 bg-brand/10 hover:bg-brand/20 text-brand rounded-xl font-bold transition text-sm"
                  >
                    + Add New Customer
                  </button>
                  <button 
                    onClick={() => { setIsCustomerModalOpen(false); setPendingCheckoutMethod(null); }}
                    className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold transition text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <form onSubmit={handleCreateCustomer} className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Customer Name</label>
                  <input 
                    type="text" required autoFocus
                    value={newCustName} onChange={e => setNewCustName(e.target.value)}
                    placeholder="e.g. Ramesh Bhai"
                    className="w-full h-11 border border-slate-200 rounded-lg px-3 focus:border-brand outline-none text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Mobile Number</label>
                  <input 
                    type="tel" required
                    value={newCustMobile} onChange={e => setNewCustMobile(e.target.value)}
                    placeholder="e.g. 9876543210"
                    className="w-full h-11 border border-slate-200 rounded-lg px-3 focus:border-brand outline-none text-slate-800"
                  />
                </div>
                <div className="flex gap-2 mt-2">
                  <button type="button" onClick={() => setShowAddNewCustomer(false)} className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold transition">Back</button>
                  <button type="submit" className="flex-[2] py-3 px-6 bg-brand hover:bg-brandHover text-white rounded-xl font-bold shadow-lg shadow-brand/30 transition">Save & Link</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      """
    
    text = text.replace(old_modal, correct_modal)
    
    with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/pages/POS.jsx', 'w', encoding='utf-8') as f:
        f.write(text)
    print("Done")
else:
    print("Failed to find markers")
