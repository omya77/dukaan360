import re

with open('C:/Users/Omkar/Desktop/Dukaan360_Frontend/src/pages/Dashboard.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace the specific div block containing Warning weight="fill"
old_card_pattern = re.compile(
    r'\{/\*\s*Low Stock Alerts\s*\*/\}\s*<div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">\s*<div className="w-14 h-14 rounded-full bg-red-50 text-red-500 flex items-center justify-center shrink-0">\s*<Warning weight="fill" className="text-2xl" />\s*</div>\s*<div>\s*<p className="text-\[10px\] font-bold text-slate-500 uppercase tracking-wide">.*?</p>\s*<h3 className="text-2xl font-black text-slate-800">\{\(summary\.low_stock_alerts \|\| 0\)\} Items</h3>\s*</div>\s*</div>',
    re.DOTALL
)

new_card = """              {/* Low Stock Alerts */}
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-red-50 text-red-500 flex items-center justify-center shrink-0">
                    <Warning weight="fill" className="text-2xl" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Low Stock Alerts (माल संपत आला आहे)</p>
                    <h3 className="text-2xl font-black text-slate-800">{(summary.low_stock_alerts || 0)} Items</h3>
                  </div>
                </div>
                <button 
                  onClick={handlePrintReorder}
                  className="flex flex-col items-center justify-center bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-xl transition w-16 h-16 shrink-0 border border-red-100 cursor-pointer"
                  title="Print Reorder List"
                >
                  <Printer weight="fill" className="text-xl mb-1" />
                  <span className="text-[9px] font-bold uppercase tracking-wider">Print</span>
                </button>
              </div>"""

text = old_card_pattern.sub(new_card, text)

with open('C:/Users/Omkar/Desktop/Dukaan360_Frontend/src/pages/Dashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Done")
