import re

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/pages/Dashboard.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

pattern = re.compile(r"import \{(.*?)\} from '@phosphor-icons/react';")
match = pattern.search(text)
if match:
    imports = match.group(1)
    if "Calculator" not in imports:
        new_imports = imports + ", Calculator, WhatsappLogo"
        text = text.replace(f"import {{{imports}}} from '@phosphor-icons/react';", f"import {{{new_imports}}} from '@phosphor-icons/react';")

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/pages/Dashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Imports updated.")
