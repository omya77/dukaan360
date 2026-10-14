import re

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/components/ReceiptModal.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

pattern = re.compile(r'\{showWaInput \? \(\s*<div className="flex gap-2 w-full">.*?<div className="grid grid-cols-3 gap-2">.*?</div>\s*\)\}', re.MULTILINE | re.DOTALL)

new_ui = """{showWaInput ? (
            <div className="flex gap-2 w-full">
              <input 
                type="tel" 
                maxLength={10}
                placeholder="Enter 10-digit mobile..." 
                value={waNumber} 
                onChange={e => setWaNumber(e.target.value)}
                className="flex-1 h-12 border-2 border-green-500 rounded-xl px-4 focus:outline-none focus:ring-4 focus:ring-green-500/20 text-sm font-bold bg-green-50/30"
              />
              <button 
                onClick={handleWhatsAppShare}
                className="h-12 px-6 bg-green-500 text-white font-bold text-sm rounded-xl hover:bg-green-600 shadow-[0_4px_15px_rgba(34,197,94,0.3)] transition-transform active:scale-95"
              >
                Send
              </button>
              <button 
                onClick={() => setShowWaInput(false)}
                className="h-12 w-12 flex items-center justify-center bg-slate-100 text-slate-500 font-bold text-lg rounded-xl hover:bg-slate-200 transition-transform active:scale-95 shrink-0"
              >
                <X weight="bold" />
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              <button onClick={onClose} className="py-3 bg-slate-100 text-slate-700 rounded-xl text-[11px] sm:text-xs font-bold hover:bg-slate-200 transition flex flex-col items-center justify-center gap-1 active:scale-95">
                <X weight="bold" className="text-xl" /> New Bill
              </button>
              
              {invoice.customer_mobile ? (
                <button onClick={handleWhatsAppShare} className="py-3 bg-[#25D366] text-white rounded-xl text-[11px] sm:text-xs font-bold shadow-[0_2px_15px_rgba(37,211,102,0.3)] hover:bg-[#128C7E] transition flex flex-col items-center justify-center gap-1 active:scale-95">
                  <WhatsappLogo weight="fill" className="text-xl" /> Direct Send
                </button>
              ) : (
                <button onClick={() => setShowWaInput(true)} className="py-3 bg-[#25D366] text-white rounded-xl text-[11px] sm:text-xs font-bold shadow-[0_2px_15px_rgba(37,211,102,0.3)] hover:bg-[#128C7E] transition flex flex-col items-center justify-center gap-1 active:scale-95">
                  <WhatsappLogo weight="fill" className="text-xl" /> WhatsApp
                </button>
              )}
              
              <button onClick={handlePrint} className="py-3 bg-brand text-white rounded-xl text-[11px] sm:text-xs font-bold shadow-[0_2px_15px_rgba(255,87,34,0.3)] hover:bg-brandHover transition flex flex-col items-center justify-center gap-1 active:scale-95">
                <Printer weight="fill" className="text-xl" /> Print Bill
              </button>
            </div>
          )}"""

new_text = pattern.sub(new_ui, text)

if new_text != text:
    with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/components/ReceiptModal.jsx', 'w', encoding='utf-8') as f:
        f.write(new_text)
    print("Done")
else:
    print("WARNING: Regex failed to match!")
