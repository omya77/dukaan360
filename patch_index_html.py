import re
import time

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/index.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Add cache buster to favicon
text = re.sub(r'href="/favicon\.svg(\?v=\d+)?"', f'href="/favicon.svg?v={int(time.time())}"', text)

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/index.html', 'w', encoding='utf-8') as f:
    f.write(text)

print("index.html patched with cache buster")
