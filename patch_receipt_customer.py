import re

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/components/ReceiptModal.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Modify the HTML template inside `handlePrint`
# Add customer name below Cashier
old_html_grid = """                <div><span class="text-gray-500 text-[10px] uppercase">Cashier</span><br/><strong>Omkar</strong></div>
                <div class="text-right"><span class="text-gray-500 text-[10px] uppercase">Payment Mode</span><br/><strong class="uppercase text-[13px] border-b border-black pb-0.5">${invoice.payment_method}</strong></div>"""
                
new_html_grid = """                <div><span class="text-gray-500 text-[10px] uppercase">Cashier</span><br/><strong>Omkar</strong></div>
                <div class="text-right"><span class="text-gray-500 text-[10px] uppercase">Payment Mode</span><br/><strong class="uppercase text-[13px] border-b border-black pb-0.5">${invoice.payment_method}</strong></div>
                ${invoice.customer_name && invoice.customer_name !== 'Walk-in / Cash' ? `<div class="col-span-2 mt-1"><span class="text-gray-500 text-[10px] uppercase">Customer</span><br/><strong class="text-[12px] uppercase">${invoice.customer_name}</strong></div>` : ''}"""

text = text.replace(old_html_grid, new_html_grid)

# Also modify the UI version of the receipt
old_ui_grid = """                  <div className="flex justify-between"><span>Date:</span><span>{new Date().toLocaleDateString()} {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span></div>
                  <div className="flex justify-between"><span>Cashier:</span><span>Omkar</span></div>"""
                  
new_ui_grid = """                  <div className="flex justify-between"><span>Date:</span><span>{new Date().toLocaleDateString()} {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span></div>
                  <div className="flex justify-between"><span>Cashier:</span><span>Omkar</span></div>
                  {invoice.customer_name && invoice.customer_name !== 'Walk-in / Cash' && (
                    <div className="flex justify-between text-brand mt-1 pt-1 border-t border-slate-200 border-dashed"><span>Customer:</span><span className="font-bold uppercase">{invoice.customer_name}</span></div>
                  )}"""

text = text.replace(old_ui_grid, new_ui_grid)

# WhatsApp message update
old_wa = """    msg += `*Date:* ${dateStr} at ${timeStr}\\n`;
    msg += `*Mode:* ${invoice.payment_method.toUpperCase()}\\n`;"""
    
new_wa = """    msg += `*Date:* ${dateStr} at ${timeStr}\\n`;
    msg += `*Mode:* ${invoice.payment_method.toUpperCase()}\\n`;
    if (invoice.customer_name && invoice.customer_name !== 'Walk-in / Cash') {
      msg += `*Customer:* ${invoice.customer_name}\\n`;
    }"""

text = text.replace(old_wa, new_wa)

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/components/ReceiptModal.jsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Done")
