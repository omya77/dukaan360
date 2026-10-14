import re

with open('C:/Users/Omkar/Desktop/Dukaan360_Frontend/src/pages/Khata.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Update imports
text = text.replace(
    "import { User, Phone, Money, ArrowRight, BookBookmark } from '@phosphor-icons/react';",
    "import { User, Phone, Money, ArrowRight, BookBookmark, CaretLeft } from '@phosphor-icons/react';"
)

# 2. Update Left Pane classes
text = text.replace(
    '<section className="w-full lg:w-1/3 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">',
    '<section className={`${selectedCustomer ? \'hidden lg:flex\' : \'flex\'} w-full lg:w-1/3 bg-white rounded-2xl shadow-sm border border-slate-200 flex-col overflow-hidden`}>'
)

# 3. Update Right Pane classes
text = text.replace(
    '<section className="hidden lg:flex flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 flex-col overflow-hidden relative">',
    '<section className={`${selectedCustomer ? \'flex\' : \'hidden lg:flex\'} flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 flex-col overflow-hidden relative`}>'
)

# 4. Add Back Button and adjust right pane header padding
old_header = """              <>
                {/* Header Info */}
                <div className="p-6 border-b border-slate-100 flex justify-between items-start">
                  <div>
                    <h2 className="font-black text-2xl text-slate-800">{selectedCustomer.name}</h2>"""

new_header = """              <>
                {/* Header Info */}
                <div className="p-4 lg:p-6 border-b border-slate-100 flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <button onClick={() => setSelectedCustomer(null)} className="lg:hidden w-8 h-8 flex items-center justify-center bg-slate-100 rounded-full text-slate-600 hover:bg-slate-200">
                      <CaretLeft weight="bold" />
                    </button>
                    <div>
                      <h2 className="font-black text-xl lg:text-2xl text-slate-800">{selectedCustomer.name}</h2>"""

text = text.replace(old_header, new_header)

with open('C:/Users/Omkar/Desktop/Dukaan360_Frontend/src/pages/Khata.jsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Done")
