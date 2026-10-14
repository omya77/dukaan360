import re

with open('C:/Users/Omkar/Desktop/Dukaan360_Frontend/src/pages/Khata.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

old_header = """                {/* Header Info */}
                <div className="p-6 border-b border-slate-100 flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-black text-slate-800 mb-1">{selectedCustomer.name}</h2>"""

new_header = """                {/* Header Info */}
                <div className="p-4 lg:p-6 border-b border-slate-100 flex justify-between items-start">
                  <div className="flex items-start lg:items-center gap-3">
                    <button onClick={() => setSelectedCustomer(null)} className="lg:hidden mt-0.5 w-8 h-8 shrink-0 flex items-center justify-center bg-slate-100 rounded-full text-slate-600 hover:bg-slate-200">
                      <CaretLeft weight="bold" />
                    </button>
                  <div>
                    <h2 className="text-xl lg:text-2xl font-black text-slate-800 mb-1">{selectedCustomer.name}</h2>"""

text = text.replace(old_header, new_header)

with open('C:/Users/Omkar/Desktop/Dukaan360_Frontend/src/pages/Khata.jsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Done")
