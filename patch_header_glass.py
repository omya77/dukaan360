import re

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/components/Header.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Make Header use glass-header
text = text.replace('className="bg-white border-b border-slate-100 flex items-center justify-between px-3 lg:px-6 h-14 shrink-0 z-20"',
                    'className="glass-header flex items-center justify-between px-3 lg:px-6 h-14 shrink-0 z-20"')

# Make search input use glass-input
text = text.replace('className="w-full h-9 bg-slate-100 border-transparent rounded-lg text-[13px] font-bold pl-9 pr-3 focus:bg-white focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all outline-none"',
                    'className="glass-input w-full h-9 rounded-lg text-[13px] font-bold pl-9 pr-3 outline-none"')

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/components/Header.jsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Header.jsx updated with Glass UI")
