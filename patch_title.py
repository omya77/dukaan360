import re

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/contexts/AuthContext.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Add document.title effect
dynamic_title_code = """
  // Dynamically update document title based on store name
  useEffect(() => {
    if (user?.store_name) {
      document.title = `${user.store_name} | Dukaan360`;
    } else {
      document.title = 'Dukaan360 POS';
    }
  }, [user]);
"""

if "// Dynamically update document title" not in text:
    text = text.replace("export const AuthProvider = ({ children }) => {", "export const AuthProvider = ({ children }) => {" + dynamic_title_code)

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/contexts/AuthContext.jsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("AuthContext patched with dynamic document title")
