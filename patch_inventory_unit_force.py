import re

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/pages/Inventory.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace using string split around value={addQty}
target = """                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Quantity Received</label>
                  <input 
                    type="number" required min="1"
                    value={addQty} onChange={e => setAddQty(e.target.value)}
                    className="w-full h-10 border border-slate-200 rounded-xl px-4 font-bold focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition" 
                    placeholder="e.g. 50"
                  />
                </div>"""

# Let's just find the index of "Quantity Received</label>"
idx = text.find("Quantity Received</label>")
if idx != -1:
    # find the end of the div
    end_idx = text.find("</div>", idx) + 6
    
    # find the start of the div
    start_idx = text.rfind("<div>", 0, idx)
    
    if start_idx != -1 and end_idx != -1:
        new_block = """<div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1 flex justify-between">
                    <span>Quantity Received</span>
                    <span className="text-brand bg-orange-100 px-1.5 rounded">{selectedProduct?.unit || 'Unit'}</span>
                  </label>
                  <div className="relative">
                    <input 
                      type="number" required min="1" step="0.01"
                      value={addQty} onChange={e => setAddQty(e.target.value)}
                      className="w-full h-10 border border-slate-200 rounded-xl pl-4 pr-16 font-bold focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition" 
                      placeholder="e.g. 50"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                      <span className="text-xs font-bold text-slate-400">
                        {selectedProduct?.unit?.includes('(') ? selectedProduct.unit.split('(')[1].replace(')', '') : selectedProduct?.unit}
                      </span>
                    </div>
                  </div>
                </div>"""
        text = text[:start_idx] + new_block + text[end_idx:]
        with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/pages/Inventory.jsx', 'w', encoding='utf-8') as f:
            f.write(text)
        print("Patched using index logic.")
else:
    print("Could not find Quantity Received label")
