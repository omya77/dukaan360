import glob
import re

files = glob.glob('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/**/*.jsx', recursive=True)
for f in files:
    content = open(f, 'r', encoding='utf-8').read()
    matches = re.findall(r'className=["\'][^"\']*\bhidden\b[^"\']*["\']', content)
    filtered = [m for m in matches if 'overflow-hidden' not in m]
    if filtered:
        print("FILE:", f)
        for m in filtered:
            print("  ", m)
