import re

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/components/Cart.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('bg-white shadow-2xl', 'glass-panel shadow-2xl')
text = text.replace('border-l border-slate-200', 'border-l border-white/50')
text = text.replace('bg-white rounded-t-2xl', 'glass-panel rounded-t-2xl border-b border-white/40')

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/components/Cart.jsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Cart.jsx updated with Glass UI")
