import re

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/components/ReceiptModal.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Fix the handlePrint Date & Time
old_print_html_date = """<div class="text-right"><span class="text-gray-500 text-[10px] uppercase">Date & Time</span><br/><strong class="text-[11px]">${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} ${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</strong></div>"""

new_print_html_date = """<div class="text-right"><span class="text-gray-500 text-[10px] uppercase">Date & Time</span><br/><strong class="text-[11px]">${(invoice.timestamp ? new Date(invoice.timestamp + 'Z') : new Date()).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} ${(invoice.timestamp ? new Date(invoice.timestamp + 'Z') : new Date()).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</strong></div>"""

text = text.replace(old_print_html_date, new_print_html_date)

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/components/ReceiptModal.jsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Done")
