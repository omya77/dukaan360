import re

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/pages/POS.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Add searchTerm state
if "const [activeCategory, setActiveCategory] = useState('all');" in text and "const [searchTerm, setSearchTerm] = useState('');" not in text:
    text = text.replace(
        "const [activeCategory, setActiveCategory] = useState('all');",
        "const [activeCategory, setActiveCategory] = useState('all');\n  const [searchTerm, setSearchTerm] = useState('');"
    )

# Update filteredProducts logic
old_filter = """  // Filter products by category
  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter(p => p.category_id === activeCategory);"""

new_filter = """  // Filter products by category and search term
  const filteredProducts = products.filter(p => {
    const matchCat = activeCategory === 'all' ? true : p.category_id === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        (p.barcode && p.barcode.includes(searchTerm));
    return matchCat && matchSearch;
  });"""

text = text.replace(old_filter, new_filter)

# Pass props to Header
old_header = "<Header onMenuClick={() => alert('Mobile menu clicked')} />"
new_header = "<Header onMenuClick={() => alert('Mobile menu clicked')} searchTerm={searchTerm} onSearch={setSearchTerm} />"
text = text.replace(old_header, new_header)

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/pages/POS.jsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("POS.jsx patched with search functionality.")
