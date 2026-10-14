import re

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/components/Cart.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

customer_dropdown = """          <div className="mb-3">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-1">Link Customer (Optional)</label>
            <select 
              value={selectedCustomerId || ''} 
              onChange={(e) => setSelectedCustomerId(e.target.value ? parseInt(e.target.value) : null)}
              className="w-full h-9 px-2 text-xs border border-slate-200 rounded-lg bg-slate-50 font-bold text-slate-700 focus:border-brand outline-none truncate shadow-sm"
            >
              <option value="">-- Walk-in Customer (No Name) --</option>
              {customers.map(c => <option key={c.id} value={c.id}>{c.name} - {c.mobile}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-3 gap-1.5 lg:gap-2 mb-3">"""

# Replace the grid opening tag
text = re.sub(r'^[ \t]*<div className="grid grid-cols-3 gap-1\.5 lg:gap-2 mb-3">', customer_dropdown, text, flags=re.MULTILINE)

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/components/Cart.jsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Done")
