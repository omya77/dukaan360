import re

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/pages/Admin.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Remove the duplicate line
text = text.replace("const [loading, setLoading] = useState(true);\n  const { user } = useAuth();", "const [loading, setLoading] = useState(true);")

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/pages/Admin.jsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Admin.jsx duplicate user fixed.")
