import re

with open('C:/Users/Omkar/Desktop/Dukaan360_Frontend/src/components/Cart.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Remove the Quick Weight Buttons
quick_btns_pattern = re.compile(r'\{\s*/\*\s*Quick Weight Buttons.*?\s*\}.*?</button>\s*</div>\s*\)\}\s*', re.DOTALL)
text = quick_btns_pattern.sub('', text)

# 2. Add the getStep function at the top of Cart component
get_step_func = """const Cart = ({ cartItems, isMobileOpen, toggleMobileCart, updateQuantity, setExactQuantity, onCheckout }) => {
  const getStep = (size) => {
    const s = String(size || '').toLowerCase().trim();
    return ['kg', 'litre', 'l', 'gm', 'g'].includes(s) ? 0.25 : 1;
  };
"""
text = text.replace('const Cart = ({ cartItems, isMobileOpen, toggleMobileCart, updateQuantity, setExactQuantity, onCheckout }) => {', get_step_func)

# 3. Replace updateQuantity(item.id, -1) and 1 with the dynamic step
text = text.replace('updateQuantity(item.id, -1)', 'updateQuantity(item.id, -getStep(item.size))')
text = text.replace('updateQuantity(item.id, 1)', 'updateQuantity(item.id, getStep(item.size))')

with open('C:/Users/Omkar/Desktop/Dukaan360_Frontend/src/components/Cart.jsx', 'w', encoding='utf-8') as f:
    f.write(text)

print('Done')
