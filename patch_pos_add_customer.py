import re

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/pages/POS.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Add states for new customer
state_insert = """  const [pendingCheckoutMethod, setPendingCheckoutMethod] = useState(null);
  const [showAddNewCustomer, setShowAddNewCustomer] = useState(false);
  const [newCustName, setNewCustName] = useState('');
  const [newCustMobile, setNewCustMobile] = useState('');"""
text = text.replace("  const [pendingCheckoutMethod, setPendingCheckoutMethod] = useState(null);", state_insert)

# 2. Add handleCreateCustomer function
func_insert = """  const handleCreateCustomer = async (e) => {
    e.preventDefault();
    if (!newCustName || !newCustMobile) return;
    try {
      const res = await axios.post('http://localhost:8000/customers/', {
        name: newCustName,
        mobile: newCustMobile,
        opening_balance: 0
      });
      setCustomers(prev => [...prev, res.data]);
      if (pendingCheckoutMethod) {
        processCheckout(pendingCheckoutMethod, res.data.id);
      } else {
        setSelectedCustomerId(res.data.id);
        setIsCustomerModalOpen(false);
      }
      setShowAddNewCustomer(false);
      setNewCustName('');
      setNewCustMobile('');
    } catch (err) {
      alert("Failed to add customer");
      console.error(err);
    }
  };
"""
# Insert right before processCheckout
text = text.replace("  const processCheckout = async (paymentMethod, customerId) => {", func_insert + "\n  const processCheckout = async (paymentMethod, customerId) => {")

# 3. Modify the Customer Modal to include the Add New button and Form
old_modal_content = """            <h3 className="font-bold text-lg text-slate-800 mb-4">Select Customer for Khata</h3>
              
              <div className="flex-1 overflow-y-auto cart-scroll pr-2 mb-4 space-y-2">
                {customers.length === 0 ? (
                  <p className="text-slate-500 text-center text-sm mt-4">No customers found. Add them in the Khata tab first.</p>
                ) : (
                  customers.map(cust => ("""

new_modal_content = """            <h3 className="font-bold text-lg text-slate-800 mb-4">Select or Add Customer</h3>
              
              {!showAddNewCustomer ? (
                <>
                  <div className="flex-1 overflow-y-auto cart-scroll pr-2 mb-4 space-y-2">
                    {customers.length === 0 ? (
                      <p className="text-slate-500 text-center text-sm mt-4">No customers found.</p>
                    ) : (
                      customers.map(cust => ("""
text = text.replace(old_modal_content, new_modal_content)


old_modal_footer = """                  ))
                )}
              </div>

              <button 
                onClick={() => { setIsCustomerModalOpen(false); setPendingCheckoutMethod(null); }}
                className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold transition"
              >
                Cancel
              </button>
            </div>"""

new_modal_footer = """                  ))
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setShowAddNewCustomer(true)}
                      className="flex-1 py-3 bg-brand/10 hover:bg-brand/20 text-brand rounded-xl font-bold transition text-sm"
                    >
                      + Add New
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
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Name</label>
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
                    <button type="submit" className="flex-2 py-3 px-6 bg-brand hover:bg-brandHover text-white rounded-xl font-bold shadow-lg shadow-brand/30">Save & Link</button>
                  </div>
                </form>
              )}
            </div>"""

text = text.replace(old_modal_footer, new_modal_footer)

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/pages/POS.jsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Done")
