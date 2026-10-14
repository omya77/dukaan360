import re

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/components/Header.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Change the strict 'Owner' check to a more lenient check
text = text.replace("{user?.role === 'Owner' && (", "{user?.role !== 'Cashier' && (")

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/components/Header.jsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Changed Add Staff button to check !== Cashier")
