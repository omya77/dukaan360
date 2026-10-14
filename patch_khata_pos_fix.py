import re

# 1. Update Khata.jsx to filter by is_khata
with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/pages/Khata.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

old_filter = """  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.mobile.includes(searchTerm)
  );"""
new_filter = """  const filteredCustomers = customers.filter(c => 
    c.is_khata && (c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.mobile.includes(searchTerm))
  );"""
text = text.replace(old_filter, new_filter)

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/pages/Khata.jsx', 'w', encoding='utf-8') as f:
    f.write(text)

# 2. Update POS.jsx to re-fetch customers after checkout
with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/pages/POS.jsx', 'r', encoding='utf-8') as f:
    text_pos = f.read()

old_checkout = """        setCompletedInvoice({
          ...payload,
          invoice_number: response.data.invoice_number,
          customer_name: cust ? cust.name : null,
          customer_mobile: cust ? cust.mobile : null
        });
        
        setCartItems([]);
        setSelectedCustomerId(null);
        setIsCustomerModalOpen(false);
        setIsUpiModalOpen(false);
        setPendingCheckoutMethod(null);
      } catch (err) {"""

new_checkout = """        setCompletedInvoice({
          ...payload,
          invoice_number: response.data.invoice_number,
          customer_name: cust ? cust.name : null,
          customer_mobile: cust ? cust.mobile : null
        });
        
        setCartItems([]);
        setSelectedCustomerId(null);
        setIsCustomerModalOpen(false);
        setIsUpiModalOpen(false);
        setPendingCheckoutMethod(null);
        
        // Refresh customer data so their dues update immediately!
        axios.get('http://localhost:8000/customers/').then(res => setCustomers(res.data));
      } catch (err) {"""

text_pos = text_pos.replace(old_checkout, new_checkout)

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/pages/POS.jsx', 'w', encoding='utf-8') as f:
    f.write(text_pos)

print("Done")
