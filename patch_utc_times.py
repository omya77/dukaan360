import re

# 1. ReceiptModal.jsx
with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/components/ReceiptModal.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Fix for UTC parsing
text = text.replace("new Date(invoice.timestamp)", "new Date(invoice.timestamp + 'Z')")

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/components/ReceiptModal.jsx', 'w', encoding='utf-8') as f:
    f.write(text)

# 2. BillHistory.jsx
with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/pages/BillHistory.jsx', 'r', encoding='utf-8') as f:
    text2 = f.read()

text2 = text2.replace("new Date(bill.timestamp)", "new Date(bill.timestamp + 'Z')")

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/pages/BillHistory.jsx', 'w', encoding='utf-8') as f:
    f.write(text2)

# 3. Khata.jsx (if any)
with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/pages/Khata.jsx', 'r', encoding='utf-8') as f:
    text3 = f.read()

text3 = text3.replace("new Date(transaction.timestamp)", "new Date(transaction.timestamp + 'Z')") # future proofing

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/pages/Khata.jsx', 'w', encoding='utf-8') as f:
    f.write(text3)

print("Done")
