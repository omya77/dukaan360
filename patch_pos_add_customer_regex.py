import re

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/pages/POS.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace the modal header and opening
pattern_header = re.compile(r'<h3 className="font-bold text-lg text-slate-800 mb-4">Select Customer for Khata</h3>\s*<div className="flex-1 overflow-y-auto cart-scroll pr-2 mb-4 space-y-2">\s*\{customers\.length === 0 \? \(\s*<p.*?>.*?</p>\s*\) : \(\s*customers\.map\(cust => \(', re.MULTILINE | re.DOTALL)

new_header = """<h3 className="font-bold text-lg text-slate-800 mb-4">Select or Add Customer</h3>
              {!showAddNewCustomer ? (
                <>
                  <div className="flex-1 overflow-y-auto cart-scroll pr-2 mb-4 space-y-2">
                    {customers.length === 0 ? (
                      <p className="text-slate-500 text-center text-sm mt-4">No customers found.</p>
                    ) : (
                      customers.map(cust => ("""

text = pattern_header.sub(new_header, text)

# Replace the modal footer
pattern_footer = re.compile(r'\)\)\s*\)\}\s*</div>\s*<button\s*onClick=\{\(\) => \{\s*setIsCustomerModalOpen\(false\);\s*setPendingCheckoutMethod\(null\);\s*\}\}\s*className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold transition"\s*>\s*Cancel\s*</button>\s*</div>', re.MULTILINE | re.DOTALL)

new_footer = """                  ))
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
                      className="w-full h-11 border border-slate-200 rounded-lg px-3 focus:border-brand outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Mobile Number</label>
                    <input 
                      type="tel" required
                      value={newCustMobile} onChange={e => setNewCustMobile(e.target.value)}
                      placeholder="e.g. 9876543210"
                      className="w-full h-11 border border-slate-200 rounded-lg px-3 focus:border-brand outline-none"
                    />
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button type="button" onClick={() => setShowAddNewCustomer(false)} className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold">Back</button>
                    <button type="submit" className="flex-[2] py-3 px-6 bg-brand hover:bg-brandHover text-white rounded-xl font-bold shadow-lg shadow-brand/30">Save & Link</button>
                  </div>
                </form>
              )}
            </div>"""

text = pattern_footer.sub(new_footer, text)

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/pages/POS.jsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Done")
