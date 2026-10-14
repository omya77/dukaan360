import re

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/components/ReceiptModal.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

# I will use a regex to replace everything from `{showWaInput ? (` to the end of the WhatsApp buttons block.
# Let's search for the block inside `<div className="p-3 bg-white border-t border-slate-100 flex flex-col gap-2 shrink-0">`
# Wait, it's easier to just match the specific block.
pattern = re.compile(r'\{showWaInput \? \(\s*<div className="flex gap-2 w-full">.*?</button>\s*</div>\s*\) : \(\s*<button.*?WhatsApp\s*</button>\s*\)\}', re.MULTILINE | re.DOTALL)

new_ui = """{showWaInput ? (
            <div className="flex gap-2 w-full">
              <input 
                type="tel" 
                maxLength={10}
                placeholder="Enter 10-digit mobile..." 
                value={waNumber} 
                onChange={e => setWaNumber(e.target.value)}
                className="flex-1 h-12 border-2 border-green-500 rounded-xl px-4 focus:outline-none focus:ring-4 focus:ring-green-500/20 text-sm font-bold bg-green-50/30 text-slate-800"
              />
              <button 
                onClick={handleWhatsAppShare}
                className="h-12 px-6 bg-green-500 text-white font-bold text-sm rounded-xl hover:bg-green-600 shadow-[0_4px_15px_rgba(34,197,94,0.3)] transition-transform active:scale-95 shrink-0"
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
          ) : invoice.customer_mobile ? (
            <button 
              onClick={handleWhatsAppShare}
              className="w-full py-3.5 bg-green-500 text-white hover:bg-green-600 rounded-xl font-bold transition flex items-center justify-center gap-2 shadow-[0_4px_15px_rgba(34,197,94,0.3)] text-sm"
            >
              <WhatsappLogo weight="fill" className="text-xl" /> Send to {invoice.customer_name?.split(' ')[0]}
            </button>
          ) : (
            <button 
              onClick={() => setShowWaInput(true)}
              className="w-full py-3.5 bg-green-50 text-green-600 hover:bg-green-100 rounded-xl font-bold transition flex items-center justify-center gap-2 border border-green-200 text-sm"
            >
              <WhatsappLogo weight="fill" className="text-xl" /> WhatsApp Receipt
            </button>
          )}"""

new_text = pattern.sub(new_ui, text)

if new_text != text:
    with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/components/ReceiptModal.jsx', 'w', encoding='utf-8') as f:
        f.write(new_text)
    print("Done")
else:
    print("WARNING: Regex failed to match!")
