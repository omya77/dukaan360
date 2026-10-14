import re

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/pages/POS.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

pattern = re.compile(r'<Cart\s*cartItems=\{cartItems\}\s*isMobileOpen=\{isMobileCartOpen\}\s*toggleMobileCart=\{\(\) => setIsMobileCartOpen\(!isMobileCartOpen\)\}\s*updateQuantity=\{updateQuantity\}\s*setExactQuantity=\{setExactQuantity\}\s*onCheckout=\{handleCheckoutInitiate\}\s*/>')

new_cart = """<Cart 
          cartItems={cartItems} 
          isMobileOpen={isMobileCartOpen} 
          toggleMobileCart={() => setIsMobileCartOpen(!isMobileCartOpen)}
          updateQuantity={updateQuantity}
          setExactQuantity={setExactQuantity}
          onCheckout={handleCheckoutInitiate}
          customers={customers}
          selectedCustomerId={selectedCustomerId}
          setSelectedCustomerId={setSelectedCustomerId}
          openCustomerModal={() => { setPendingCheckoutMethod(null); setIsCustomerModalOpen(true); }}
        />"""

new_text = pattern.sub(new_cart, text)

if new_text != text:
    with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/pages/POS.jsx', 'w', encoding='utf-8') as f:
        f.write(new_text)
    print("Done")
else:
    print("WARNING: Regex failed to match!")
