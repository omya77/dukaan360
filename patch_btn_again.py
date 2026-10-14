import re

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/pages/Admin.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

# I will use regex to find the exact button block
pattern = re.compile(r'(<button onClick=\{\(\) => handleRequestPayment\(store\)\}.*?</button>)', re.DOTALL)

def replacement(match):
    return "{store.plan_type !== '1 Month' && store.plan_type !== 'MONTH_1' && (\n" + match.group(1) + "\n                      )}"

text = pattern.sub(replacement, text)

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/pages/Admin.jsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Admin.jsx button patched perfectly.")
