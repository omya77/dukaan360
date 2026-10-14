import re

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/pages/BillHistory.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

pattern = re.compile(r'<div>\s*<p className="font-black text-sm text-slate-800">\{bill\.invoice_number\}</p>\s*<p className="text-\[9px\] lg:text-\[10px\] font-bold text-slate-500 uppercase mt-0\.5">ID:\s*\{bill\.id\}</p>\s*</div>', re.MULTILINE | re.DOTALL)

new_code = """<div>
                            <p className="font-black text-sm text-slate-800">{bill.invoice_number}</p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <p className="text-[9px] lg:text-[10px] font-bold text-slate-500 uppercase whitespace-nowrap">ID: {bill.id}</p>
                              <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                              <p className="text-[9px] lg:text-[10px] font-bold text-brand uppercase truncate max-w-[120px]">{getCustomerName(bill.customer_id)}</p>
                            </div>
                          </div>"""

new_text = pattern.sub(new_code, text)

if new_text != text:
    with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/pages/BillHistory.jsx', 'w', encoding='utf-8') as f:
        f.write(new_text)
    print("Done")
else:
    print("WARNING: Regex failed to match!")
