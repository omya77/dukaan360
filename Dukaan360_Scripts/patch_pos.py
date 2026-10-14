with open('C:/Users/Omkar/Desktop/Dukaan360_Frontend/src/pages/POS.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

import re

# We need to replace the updateQuantity function
old_func = """  const updateQuantity = (id, delta) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQ = (parseFloat(item.quantity) || 0) + delta;
        return newQ > 0 ? { ...item, quantity: newQ } : null;
      }
      return item;
    }).filter(Boolean));
  };"""

new_func = """  const updateQuantity = (id, delta) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        if (delta === 'remove') return null;
        const newQ = (parseFloat(item.quantity) || 0) + delta;
        return { ...item, quantity: newQ };
      }
      return item;
    }).filter(Boolean));
  };"""

text = text.replace(old_func, new_func)

with open('C:/Users/Omkar/Desktop/Dukaan360_Frontend/src/pages/POS.jsx', 'w', encoding='utf-8') as f:
    f.write(text)

print('Done')
