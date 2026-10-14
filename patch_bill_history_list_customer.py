import re

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/pages/BillHistory.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

old_code = """                          <div>
                            <p className="font-black text-sm text-slate-800">{bill.invoice_number}</p>
                            <p className="text-[9px] lg:text-[10px] font-bold text-slate-500 uppercase mt-0.5">ID: {bill.id}</p>
                          </div>"""

new_code = """                          <div>
                            <p className="font-black text-sm text-slate-800">{bill.invoice_number}</p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <p className="text-[9px] lg:text-[10px] font-bold text-slate-500 uppercase">ID: {bill.id}</p>
                              <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                              <p className="text-[9px] lg:text-[10px] font-bold text-brand uppercase truncate max-w-[100px] lg:max-w-[150px]">{getCustomerName(bill.customer_id)}</p>
                            </div>
                          </div>"""

text = text.replace(old_code, new_code)

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/pages/BillHistory.jsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Done")
