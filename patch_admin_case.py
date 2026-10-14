import re

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/pages/Admin.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace all store.status === 'Pending' with store.status?.toLowerCase() === 'pending'
text = text.replace("store.status === 'Pending'", "store.status?.toLowerCase() === 'pending'")
text = text.replace("store.status === 'Active'", "store.status?.toLowerCase() === 'active'")

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/pages/Admin.jsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Admin.jsx patched to be case-insensitive for status.")
