import re

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/pages/Inventory.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

# We need to find the QUANTITY RECEIVED label and input
old_qty_field = """              <div className="mb-4">
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Quantity Received</label>
                <input 
                  required type="number" step="0.01" value={addQty} onChange={e => setAddQty(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold text-slate-800 outline-none focus:border-brand"
                  placeholder="e.g. 50"
                />
              </div>"""

new_qty_field = """              <div className="mb-4">
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1 flex justify-between">
                  <span>Quantity Received</span>
                  <span className="text-brand bg-orange-100 px-1.5 rounded">{selectedProduct?.unit || 'Unit'}</span>
                </label>
                <div className="relative">
                  <input 
                    required type="number" step="0.01" value={addQty} onChange={e => setAddQty(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-3 pr-16 py-2 text-sm font-bold text-slate-800 outline-none focus:border-brand"
                    placeholder="e.g. 50"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <span className="text-xs font-bold text-slate-400">
                      {selectedProduct?.unit?.includes('(') ? selectedProduct.unit.split('(')[1].replace(')', '') : selectedProduct?.unit}
                    </span>
                  </div>
                </div>
              </div>"""

text = text.replace(old_qty_field, new_qty_field)

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/pages/Inventory.jsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Inventory.jsx patched to show unit.")
