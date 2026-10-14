import re

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/contexts/AuthContext.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Remove the ' | Dukaan360' part
text = text.replace("document.title = `${user.store_name} | Dukaan360`;", 
                    "document.title = user.store_name;")

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/contexts/AuthContext.jsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Removed Dukaan360 from the document title")
