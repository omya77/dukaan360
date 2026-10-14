import re

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/contexts/AuthContext.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Extract the bad useEffect
bad_effect = """  // Dynamically update document title based on store name
  useEffect(() => {
    if (user?.store_name) {
      document.title = `${user.store_name} | Dukaan360`;
    } else {
      document.title = 'Dukaan360 POS';
    }
  }, [user]);"""

text = text.replace(bad_effect, "")

# Find where to insert it (after loading state)
target = "const [loading, setLoading] = useState(true);"
insertion = target + "\n" + bad_effect

text = text.replace(target, insertion)

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/contexts/AuthContext.jsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("AuthContext fixed: Moved useEffect below useState")
