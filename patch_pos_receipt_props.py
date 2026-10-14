import re

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/pages/POS.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

old_set = """      setCompletedInvoice({
        invoice_number: response.data.invoice_number,
        subtotal: subtotal,
        tax: tax,
        grand_total: grand_total,
        payment_method: paymentMethod,
        items: [...cartItems]
      });"""

new_set = """      const cust = selectedCustomerId ? customers.find(c => c.id === selectedCustomerId) : null;
      setCompletedInvoice({
        invoice_number: response.data.invoice_number,
        subtotal: subtotal,
        tax: tax,
        grand_total: grand_total,
        payment_method: paymentMethod,
        items: [...cartItems],
        customer_name: cust ? cust.name : null,
        customer_mobile: cust ? cust.mobile : null
      });"""

text = text.replace(old_set, new_set)

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/pages/POS.jsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Done")
