import re

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/pages/BillHistory.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

old_get_name = """  const getCustomerName = (customerId) => {
    if (!customerId) return 'Walk-in / Cash';
    const c = customers.find(x => x.id === customerId);
    return c ? c.name : 'Unknown';
  };"""

new_get_name = """  const getCustomerName = (customerId) => {
    if (!customerId) return 'Walk-in / Cash';
    const c = customers.find(x => x.id === customerId);
    return c ? c.name : 'Unknown';
  };

  const getCustomerMobile = (customerId) => {
    if (!customerId) return null;
    const c = customers.find(x => x.id === customerId);
    return c ? c.mobile : null;
  };"""

text = text.replace(old_get_name, new_get_name)

old_modal = """            customer_name: getCustomerName(selectedBill.customer_id),
            items: selectedBill.items.map(item => ({"""
new_modal = """            customer_name: getCustomerName(selectedBill.customer_id),
            customer_mobile: getCustomerMobile(selectedBill.customer_id),
            items: selectedBill.items.map(item => ({"""

text = text.replace(old_modal, new_modal)

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/pages/BillHistory.jsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Done")
