import re

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/pages/Khata.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Add Receipt to Phosphor imports if not present
if 'Receipt' not in text.split("from '@phosphor-icons/react'")[0]:
    # find the line starting with import { ... } from '@phosphor-icons/react';
    pattern = re.compile(r"import \{(.*?)\} from '@phosphor-icons/react';")
    match = pattern.search(text)
    if match:
        old_imports = match.group(1)
        if 'Receipt' not in old_imports:
            new_imports = old_imports + ", Receipt"
            text = text.replace(f"import {{{old_imports}}} from '@phosphor-icons/react';", f"import {{{new_imports}}} from '@phosphor-icons/react';")

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/pages/Khata.jsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Done")
