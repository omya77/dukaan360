import re

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/pages/Khata.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace("History,", "ClockCounterClockwise as History,")

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/pages/Khata.jsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Done")
