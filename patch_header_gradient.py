import re

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/components/Header.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace the text gradient with a permanent orange/red brand gradient
old_class = 'className="font-extrabold text-xl lg:text-2xl hidden sm:block tracking-tight bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent drop-shadow-sm group-hover:from-brand group-hover:to-orange-500 transition-all duration-300"'

new_class = 'className="font-black text-xl lg:text-[22px] hidden sm:block tracking-tight bg-gradient-to-r from-[#FF5722] to-[#FF8A65] bg-clip-text text-transparent drop-shadow-sm transition-all"'

text = text.replace(old_class, new_class)

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/components/Header.jsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Font made permanent brand gradient")
