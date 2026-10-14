import re

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/pages/Dashboard.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Add state for Cash Tally Modal
if "const [isTallyModalOpen" not in text:
    old_state = "const [lowStockItems, setLowStockItems] = useState([]);"
    new_state = "const [lowStockItems, setLowStockItems] = useState([]);\n  const [isTallyModalOpen, setIsTallyModalOpen] = useState(false);\n  const [notes, setNotes] = useState({ 500: '', 200: '', 100: '', 50: '', 20: '', 10: '' });"
    text = text.replace(old_state, new_state)

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/pages/Dashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Dashboard states updated.")
