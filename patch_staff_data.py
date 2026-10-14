import re

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/components/Header.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Add role to the initial state and reset state
text = text.replace("const [staffData, setStaffData] = useState({ name: '', mobile: '', password: '' });", 
                    "const [staffData, setStaffData] = useState({ name: '', mobile: '', password: '', role: 'Cashier' });")

text = text.replace("setStaffData({ name: '', mobile: '', password: '' });", 
                    "setStaffData({ name: '', mobile: '', password: '', role: 'Cashier' });")

# Also fix the alert to stringify objects so we can actually read future errors!
text = text.replace("alert(err.response?.data?.detail || 'Failed to create staff');", 
                    "alert(typeof err.response?.data?.detail === 'string' ? err.response.data.detail : JSON.stringify(err.response?.data?.detail) || 'Failed to create staff');")

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/components/Header.jsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Header.jsx staffData updated with role")
