import re

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/pages/POS.jsx', 'r', encoding='utf-8') as f:
    pos_text = f.read()

# Replace isCustomerModalOpen with customerModalMode
# Wait, it's easier to just use `isCustomerModalOpen` and add `pendingCheckoutMethod`.
pos_text = pos_text.replace("const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);", "const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);\n  const [pendingCheckoutMethod, setPendingCheckoutMethod] = useState(null);")

old_checkout = """  const handleCheckoutInitiate = (paymentMethod) => {
    if (cartItems.length === 0) {
      alert("Cart is empty!");
      return;
    }

    if (paymentMethod === 'Credit') {
      if (selectedCustomerId) {
        processCheckout('Credit', selectedCustomerId);
      } else {
        setIsCustomerModalOpen(true);
      }
    } else if (paymentMethod === 'UPI') {
      setIsUpiModalOpen(true);
    } else {
      processCheckout(paymentMethod, selectedCustomerId);
    }
  };"""

new_checkout = """  const handleCheckoutInitiate = (paymentMethod) => {
    if (cartItems.length === 0) {
      alert("Cart is empty!");
      return;
    }

    if (paymentMethod === 'Credit') {
      if (selectedCustomerId) {
        processCheckout('Credit', selectedCustomerId);
      } else {
        setPendingCheckoutMethod('Credit');
        setIsCustomerModalOpen(true);
      }
    } else if (paymentMethod === 'UPI') {
      setIsUpiModalOpen(true);
    } else {
      processCheckout(paymentMethod, selectedCustomerId);
    }
  };"""
pos_text = pos_text.replace(old_checkout, new_checkout)

# Clear states on checkout
old_clear = """      setIsCustomerModalOpen(false);
      setSelectedCustomerId(null);
      fetchData();"""
new_clear = """      setIsCustomerModalOpen(false);
      setPendingCheckoutMethod(null);
      setSelectedCustomerId(null);
      fetchData();"""
pos_text = pos_text.replace(old_clear, new_clear)

# Modifying the modal behavior
old_modal_click = """onClick={() => processCheckout('Credit', cust.id)}"""
new_modal_click = """onClick={() => {
                        if (pendingCheckoutMethod) {
                          processCheckout(pendingCheckoutMethod, cust.id);
                        } else {
                          setSelectedCustomerId(cust.id);
                          setIsCustomerModalOpen(false);
                        }
                      }}"""
pos_text = pos_text.replace(old_modal_click, new_modal_click)

# Modifying the modal close behavior
old_modal_close = """onClick={() => setIsCustomerModalOpen(false)}"""
new_modal_close = """onClick={() => { setIsCustomerModalOpen(false); setPendingCheckoutMethod(null); }}"""
pos_text = pos_text.replace(old_modal_close, new_modal_close)

# Pass openCustomerModal to Cart
old_cart_props = """            customers={customers}
            selectedCustomerId={selectedCustomerId}
            setSelectedCustomerId={setSelectedCustomerId}
          />"""
new_cart_props = """            customers={customers}
            selectedCustomerId={selectedCustomerId}
            setSelectedCustomerId={setSelectedCustomerId}
            openCustomerModal={() => { setPendingCheckoutMethod(null); setIsCustomerModalOpen(true); }}
          />"""
pos_text = pos_text.replace(old_cart_props, new_cart_props)

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/pages/POS.jsx', 'w', encoding='utf-8') as f:
    f.write(pos_text)


# -----------------
# UPDATE Cart.jsx
# -----------------
with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/components/Cart.jsx', 'r', encoding='utf-8') as f:
    cart_text = f.read()

old_cart_decl = """const Cart = ({ cartItems, isMobileOpen, toggleMobileCart, updateQuantity, setExactQuantity, onCheckout, customers = [], selectedCustomerId, setSelectedCustomerId }) => {"""
new_cart_decl = """const Cart = ({ cartItems, isMobileOpen, toggleMobileCart, updateQuantity, setExactQuantity, onCheckout, customers = [], selectedCustomerId, setSelectedCustomerId, openCustomerModal }) => {"""
cart_text = cart_text.replace(old_cart_decl, new_cart_decl)

old_dropdown = """          <div className="mb-3">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-1">Link Customer (Optional)</label>
            <select 
              value={selectedCustomerId || ''} 
              onChange={(e) => setSelectedCustomerId(e.target.value ? parseInt(e.target.value) : null)}
              className="w-full h-9 px-2 text-xs border border-slate-200 rounded-lg bg-slate-50 font-bold text-slate-700 focus:border-brand outline-none truncate shadow-sm"
            >
              <option value="">-- Walk-in Customer (No Name) --</option>
              {customers.map(c => <option key={c.id} value={c.id}>{c.name} - {c.mobile}</option>)}
            </select>
          </div>"""

new_attractive_btn = """          {/* Attractive Customer Selector Button */}
          <div className="mb-3">
            <button 
              onClick={openCustomerModal}
              className={`w-full p-2.5 rounded-xl border-2 flex items-center justify-between transition-all shadow-sm ${selectedCustomerId ? 'border-brand bg-brand/5 hover:bg-brand/10' : 'border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-slate-100'}`}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-inner ${selectedCustomerId ? 'bg-gradient-to-br from-brand to-brandHover text-white' : 'bg-slate-200 text-slate-500'}`}>
                  <UserCircle weight={selectedCustomerId ? 'fill' : 'duotone'} className="text-2xl" />
                </div>
                <div className="text-left truncate">
                  {selectedCustomerId ? (
                    <>
                      <p className="text-[10px] font-black text-brand uppercase tracking-wider mb-0.5">Linked Customer</p>
                      <p className="text-sm font-black text-slate-800 truncate leading-none">{customers.find(c => c.id === selectedCustomerId)?.name}</p>
                    </>
                  ) : (
                    <>
                      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Walk-in Customer</p>
                      <p className="text-xs font-black text-slate-700 leading-none">Click to link name...</p>
                    </>
                  )}
                </div>
              </div>
              {selectedCustomerId && (
                <div 
                  onClick={(e) => { e.stopPropagation(); setSelectedCustomerId(null); }}
                  className="w-8 h-8 rounded-full bg-slate-200/60 text-slate-500 flex items-center justify-center hover:bg-red-100 hover:text-red-500 hover:shadow-sm shrink-0 transition-all"
                  title="Remove Customer"
                >
                  <X weight="bold" className="text-sm" />
                </div>
              )}
            </button>
          </div>"""
          
cart_text = cart_text.replace(old_dropdown, new_attractive_btn)

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/components/Cart.jsx', 'w', encoding='utf-8') as f:
    f.write(cart_text)

print("Done")
