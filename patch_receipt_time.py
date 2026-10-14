import re

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/components/ReceiptModal.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Fix WhatsApp message date and time
old_wa_date = """    const dateStr = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    const timeStr = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });"""

new_wa_date = """    const invoiceDate = invoice.timestamp ? new Date(invoice.timestamp) : new Date();
    const dateStr = invoiceDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    const timeStr = invoiceDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });"""
text = text.replace(old_wa_date, new_wa_date)

# 2. Fix Printed Receipt date and time
old_print_date = """                <div className="flex justify-between"><span>Date:</span><span>{new Date().toLocaleDateString()} {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span></div>"""

new_print_date = """                <div className="flex justify-between">
                  <span>Date:</span>
                  <span>
                    {(invoice.timestamp ? new Date(invoice.timestamp) : new Date()).toLocaleDateString('en-IN', {day: '2-digit', month:'2-digit', year:'numeric'})} 
                    {' '}
                    {(invoice.timestamp ? new Date(invoice.timestamp) : new Date()).toLocaleTimeString('en-IN', {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>"""
text = text.replace(old_print_date, new_print_date)

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/components/ReceiptModal.jsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Done")
