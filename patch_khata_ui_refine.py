import re

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/pages/Khata.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Remove font-nunito
text = text.replace('font-nunito', '')

# Fix Total Market Outstanding styling
old_outstanding = """            <div className="bg-orange-50 rounded-xl p-3 mb-4 border border-orange-100">
              <p className="text-xs font-bold text-orange-600 mb-0.5">Total Market Outstanding</p>
              <h3 className="text-xl font-black text-orange-700">₹{totalMarketOutstanding.toFixed(2)}</h3>
            </div>"""
new_outstanding = """            <div className="bg-orange-50 rounded-xl p-3.5 mb-4 border border-orange-100 flex justify-between items-center">
              <div>
                <p className="text-[11px] font-bold text-orange-600 uppercase tracking-wide">Market Outstanding</p>
                <h3 className="text-lg font-black text-orange-700 mt-0.5">₹{totalMarketOutstanding.toFixed(2)}</h3>
              </div>
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-500">
                <Money weight="fill" className="text-xl" />
              </div>
            </div>"""
text = text.replace(old_outstanding, new_outstanding)

# Fix List Item Styling
old_list_item = """                  <div className="text-right">
                    <p className={`font-black text-sm ${selectedCustomer?.id === cust.id ? 'text-white' : cust.current_due > 0 ? 'text-red-500' : 'text-green-500'}`}>
                      ₹{cust.current_due.toFixed(2)}
                    </p>
                  </div>"""
new_list_item = """                  <div className="text-right">
                    <p className={`font-bold text-[13px] ${selectedCustomer?.id === cust.id ? 'text-white' : cust.current_due > 0 ? 'text-red-500' : 'text-green-500'}`}>
                      ₹{cust.current_due.toFixed(2)}
                    </p>
                  </div>"""
text = text.replace(old_list_item, new_list_item)

old_list_name = """<h4 className="font-bold text-sm truncate max-w-[150px]">{cust.name}</h4>"""
new_list_name = """<h4 className="font-bold text-[13px] text-slate-700 truncate max-w-[150px]">{cust.name}</h4>"""
text = text.replace(old_list_name, new_list_name)

# Make sure the selected state name color is white
old_button = """                  className={`w-full text-left p-3 rounded-xl transition flex justify-between items-center ${selectedCustomer?.id === cust.id ? 'bg-brand text-white shadow-md shadow-brand/20' : 'hover:bg-slate-50 text-slate-700 hover:border-slate-200 border border-transparent'}`}"""
new_button = """                  className={`w-full text-left px-4 py-3 rounded-xl transition flex justify-between items-center ${selectedCustomer?.id === cust.id ? 'bg-brand text-white shadow-md shadow-brand/20' : 'hover:bg-slate-50 border border-transparent hover:border-slate-200'}`}"""
text = text.replace(old_button, new_button)

old_name_2 = """<h4 className="font-bold text-[13px] text-slate-700 truncate max-w-[150px]">{cust.name}</h4>"""
new_name_2 = """<h4 className={`font-bold text-[13px] truncate max-w-[150px] ${selectedCustomer?.id === cust.id ? 'text-white' : 'text-slate-700'}`}>{cust.name}</h4>"""
text = text.replace(old_name_2, new_name_2)


with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/pages/Khata.jsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Done")
