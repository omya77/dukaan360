import re

with open('C:/Users/Omkar/Desktop/Dukaan360_Frontend/src/pages/Khata.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace the specific Header block
header_pattern = re.compile(
    r'\{\/\*\s*Header Info\s*\*\/\}\s*<div className=".*?flex justify-between items-start.*?">\s*<div.*?>\s*<h2.*?>\{selectedCustomer\.name\}<\/h2>\s*<div.*?>\s*<span.*?>.*?\{selectedCustomer\.mobile\}<\/span>\s*<\/div>\s*<\/div>',
    re.DOTALL
)

new_header = """                {/* Header Info */}
                <div className="p-4 lg:p-6 border-b border-slate-100 flex justify-between items-start lg:items-center gap-2">
                  <div className="flex items-start lg:items-center gap-3">
                    <button onClick={() => setSelectedCustomer(null)} className="lg:hidden mt-0.5 w-8 h-8 shrink-0 flex items-center justify-center bg-slate-100 rounded-full text-slate-600 hover:bg-slate-200">
                      <CaretLeft weight="bold" />
                    </button>
                    <div>
                      <h2 className="text-xl lg:text-2xl font-black text-slate-800 mb-1">{selectedCustomer.name}</h2>
                      <div className="flex items-center gap-4 text-sm font-medium text-slate-500">
                        <span className="flex items-center gap-1"><Phone weight="fill" /> {selectedCustomer.mobile}</span>
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={handleWhatsAppReminder}
                    disabled={selectedCustomer.current_due <= 0}
                    className="flex items-center gap-1.5 lg:gap-2 bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700 px-3 py-1.5 lg:px-4 lg:py-2 rounded-xl text-xs lg:text-sm font-bold transition disabled:opacity-50 disabled:cursor-not-allowed border border-green-200 shadow-sm shrink-0"
                  >
                    <WhatsappLogo weight="fill" className="text-base lg:text-xl" />
                    <span className="hidden sm:inline">WhatsApp Remind</span>
                  </button>
                </div>"""

# Ensure the block is replaced, but not nested divs outside the pattern
text = header_pattern.sub(new_header, text)

with open('C:/Users/Omkar/Desktop/Dukaan360_Frontend/src/pages/Khata.jsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Done")
