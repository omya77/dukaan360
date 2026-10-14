import os
import re

frontend_dir = r"C:\Users\Omkar\Desktop\Dukaan360_Project\Dukaan360_Frontend\src"

def refine_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Downscale overly large text
    content = content.replace("text-6xl", "text-5xl")
    content = content.replace("text-5xl", "text-4xl")
    
    # In table cells, reduce padding to make it compact
    if 'Inventory.jsx' in filepath or 'Stock.jsx' in filepath or 'BillHistory.jsx' in filepath:
        content = content.replace("py-4", "py-2.5")
        content = content.replace("px-6", "px-4")

    # In buttons and padding, reduce chunkiness
    content = content.replace("py-3", "py-2")
    content = content.replace("px-5", "px-4")
    content = content.replace("h-14", "h-11")
    content = content.replace("h-12", "h-10")

    # Specific POS tuning
    if 'POS.jsx' in filepath or 'Cart.jsx' in filepath:
        content = content.replace("text-2xl", "text-xl")
        content = content.replace("text-xl lg:text-2xl", "text-lg lg:text-xl")
        content = content.replace("text-xl", "text-lg")
        content = content.replace("h-16", "h-12") # empty state height
        content = content.replace("h-12", "h-10")
        content = content.replace("p-6", "p-4")
        content = content.replace("p-5", "p-4")
        content = content.replace("p-4 lg:p-6", "p-3 lg:p-4")

    # Khata adjustments
    if 'Khata.jsx' in filepath:
        content = content.replace("text-3xl", "text-2xl")
        content = content.replace("text-4xl", "text-3xl")
        content = content.replace("py-3", "py-2")

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

for root, _, files in os.walk(frontend_dir):
    for file in files:
        if file.endswith(".jsx"):
            refine_file(os.path.join(root, file))

print("Downscaling done.")
