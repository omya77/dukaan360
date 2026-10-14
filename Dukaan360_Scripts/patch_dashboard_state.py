import re

with open('C:/Users/Omkar/Desktop/Dukaan360_Frontend/src/pages/Dashboard.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Add the missing state variables right after setLoading
state_to_add = """
  const [showReorderModal, setShowReorderModal] = useState(false);
  const [lowStockItems, setLowStockItems] = useState([]);
"""

if "const [showReorderModal" not in text:
    text = text.replace("const [loading, setLoading] = useState(true);", "const [loading, setLoading] = useState(true);" + state_to_add)

with open('C:/Users/Omkar/Desktop/Dukaan360_Frontend/src/pages/Dashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Done")
