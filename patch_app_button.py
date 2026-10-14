import re

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/App.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace("if (user?.role !== 'Owner')", "if (user?.role === 'Cashier')")

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/App.jsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Changed App.jsx OwnerRoute to check === Cashier")
