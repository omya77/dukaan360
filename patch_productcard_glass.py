import re

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/components/ProductCard.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Make ProductCard use glass-card instead of bg-white card-shadow
text = re.sub(r'className={`bg-white rounded-xl p-2 lg:p-2\.5 card-shadow border cursor-pointer group transition-all flex flex-col h-\[180px\] lg:h-\[200px\] relative \$\{',
              r'className={`glass-card rounded-xl p-2 lg:p-2.5 cursor-pointer group flex flex-col h-[180px] lg:h-[200px] relative ${', text)

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/components/ProductCard.jsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("ProductCard.jsx updated with Glass UI")
