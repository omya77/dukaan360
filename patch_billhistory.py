import re

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/pages/BillHistory.jsx', 'r', encoding='utf-8', errors='ignore') as f:
    text = f.read()

# Fix the corrupted Marathi text
text = re.sub(r'<p className="text-xs lg:text-sm font-bold text-slate-500 mt-0\.5 lg:mt-1 uppercase tracking-wider">.*?</p>',
              '<p className="text-xs lg:text-sm font-bold text-slate-500 mt-0.5 lg:mt-1 uppercase tracking-wider">All Invoices</p>', text)

# Also fix the invoice_number null check just in case
text = text.replace("bill.invoice_number.toLowerCase().includes(searchTerm.toLowerCase())",
                    "(bill.invoice_number || '').toLowerCase().includes(searchTerm.toLowerCase())")

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/pages/BillHistory.jsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Fixed BillHistory.jsx")
