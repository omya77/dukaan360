import re

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/pages/POS.jsx', 'r', encoding='utf-8') as f:
    pos_text = f.read()

# 1. Add selectedCustomerId state in POS.jsx
state_insert = """  const [customers, setCustomers] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);"""
pos_text = pos_text.replace("  const [customers, setCustomers] = useState([]);", state_insert)

# 2. Modify handleCheckoutInitiate
old_checkout = """  const handleCheckoutInitiate = (paymentMethod) => {
    if (cartItems.length === 0) {
      alert("Cart is empty!");
      return;
    }

    if (paymentMethod === 'Credit') {
      setIsCustomerModalOpen(true);
    } else if (paymentMethod === 'UPI') {
      setIsUpiModalOpen(true);
    } else {
      processCheckout(paymentMethod, null);
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
        setIsCustomerModalOpen(true);
      }
    } else if (paymentMethod === 'UPI') {
      setIsUpiModalOpen(true);
    } else {
      processCheckout(paymentMethod, selectedCustomerId);
    }
  };"""
pos_text = pos_text.replace(old_checkout, new_checkout)

# 3. Modify processCheckout for UPI in the UPI modal to use selectedCustomerId instead of null
old_upi_btn = """                  <button 
                    onClick={() => {
                      setIsUpiModalOpen(false);
                      processCheckout('UPI', null);
                    }}"""
new_upi_btn = """                  <button 
                    onClick={() => {
                      setIsUpiModalOpen(false);
                      processCheckout('UPI', selectedCustomerId);
                    }}"""
pos_text = pos_text.replace(old_upi_btn, new_upi_btn)

# 4. Clear selectedCustomerId on successful checkout
old_clear = """      setCartItems([]);
      setIsUpiModalOpen(false);
      setIsCustomerModalOpen(false);
      fetchData();"""
new_clear = """      setCartItems([]);
      setIsUpiModalOpen(false);
      setIsCustomerModalOpen(false);
      setSelectedCustomerId(null);
      fetchData();"""
pos_text = pos_text.replace(old_clear, new_clear)

# 5. Pass props to Cart.jsx
old_cart_props = """          <Cart 
            cartItems={cartItems}
            isMobileOpen={isMobileCartOpen}
            toggleMobileCart={() => setIsMobileCartOpen(!isMobileCartOpen)}
            updateQuantity={updateQuantity}
            setExactQuantity={setExactQuantity}
            onCheckout={handleCheckoutInitiate}
          />"""
new_cart_props = """          <Cart 
            cartItems={cartItems}
            isMobileOpen={isMobileCartOpen}
            toggleMobileCart={() => setIsMobileCartOpen(!isMobileCartOpen)}
            updateQuantity={updateQuantity}
            setExactQuantity={setExactQuantity}
            onCheckout={handleCheckoutInitiate}
            customers={customers}
            selectedCustomerId={selectedCustomerId}
            setSelectedCustomerId={setSelectedCustomerId}
          />"""
pos_text = pos_text.replace(old_cart_props, new_cart_props)

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/pages/POS.jsx', 'w', encoding='utf-8') as f:
    f.write(pos_text)

# -----------------
# UPDATE Cart.jsx
# -----------------
with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/components/Cart.jsx', 'r', encoding='utf-8') as f:
    cart_text = f.read()

old_cart_decl = """const Cart = ({ cartItems, isMobileOpen, toggleMobileCart, updateQuantity, setExactQuantity, onCheckout }) => {"""
new_cart_decl = """const Cart = ({ cartItems, isMobileOpen, toggleMobileCart, updateQuantity, setExactQuantity, onCheckout, customers = [], selectedCustomerId, setSelectedCustomerId }) => {"""
cart_text = cart_text.replace(old_cart_decl, new_cart_decl)

customer_dropdown = """            <div className="mb-3">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-1">Link Customer (Optional)</label>
              <select 
                value={selectedCustomerId || ''} 
                onChange={(e) => setSelectedCustomerId(e.target.value ? parseInt(e.target.value) : null)}
                className="w-full h-8 px-2 text-xs border border-slate-200 rounded-md bg-slate-50 font-bold text-slate-700 focus:border-brand outline-none truncate"
              >
                <option value="">-- Walk-in Customer --</option>
                {customers.map(c => <option key={c.id} value={c.id}>{c.name} - {c.mobile}</option>)}
              </select>
            </div>"""

# Insert right above the grid of payment buttons
payment_buttons_grid = """            <div className="grid grid-cols-3 gap-1.5 lg:gap-2 mb-3">"""
cart_text = cart_text.replace(payment_buttons_grid, customer_dropdown + "\n\n" + payment_buttons_grid)

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/components/Cart.jsx', 'w', encoding='utf-8') as f:
    f.write(cart_text)

print("Done")
