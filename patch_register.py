import re

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/pages/Register.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace("import { Storefront, Store, User, Phone, LockKey, CheckCircle }", "import { Storefront, User, Phone, LockKey, CheckCircle }")
text = text.replace("<Store className=", "<Storefront className=")

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/pages/Register.jsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Register updated.")
