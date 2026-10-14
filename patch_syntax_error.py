import re

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/components/Header.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Fix the broken return
text = text.replace('return (\n    <> ) => clearInterval(interval);', 'return () => clearInterval(interval);')
text = text.replace('return (\n    <>) => clearInterval(interval);', 'return () => clearInterval(interval);')

# Wait, if there are other return statements?
# Let's just fix the specific broken line using regex
text = re.sub(r'return\s*\(\s*<>\s*\)\s*=>\s*clearInterval', r'return () => clearInterval', text)

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/components/Header.jsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Header.jsx syntax error fixed")
