import re

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/pages/POS.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Make POS wrapper use bg-premium-app
text = text.replace('className="h-screen flex flex-col overflow-hidden selection:bg-brand selection:text-white"',
                    'className="h-screen flex flex-col overflow-hidden selection:bg-brand selection:text-white bg-premium-app"')

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/pages/POS.jsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("POS.jsx updated with Premium App BG")
