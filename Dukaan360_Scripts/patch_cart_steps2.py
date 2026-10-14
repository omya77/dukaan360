import re

with open('C:/Users/Omkar/Desktop/Dukaan360_Frontend/src/components/Cart.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

old_func = """  const getStep = (size) => {
    const s = String(size || '').toLowerCase().trim();
    return ['kg', 'litre', 'l', 'gm', 'g'].includes(s) ? 0.25 : 1;
  };"""

new_func = """  const getStep = (size) => {
    const s = String(size || '').toLowerCase();
    const isWeight = s.includes('kg') || s.includes('gm') || s.includes('g') || s.includes('litre') || s.includes('l') || s.includes('ml');
    return isWeight ? 0.25 : 1;
  };"""

text = text.replace(old_func, new_func)

with open('C:/Users/Omkar/Desktop/Dukaan360_Frontend/src/components/Cart.jsx', 'w', encoding='utf-8') as f:
    f.write(text)

print('Done')
