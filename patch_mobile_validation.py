import re

# PATCH LOGIN
with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/pages/Login.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

old_login_input = """                  <input 
                    type="text" 
                    value={mobile}
                    onChange={e => setMobile(e.target.value)}
                    required"""

new_login_input = """                  <input 
                    type="tel" 
                    maxLength="10"
                    value={mobile}
                    onChange={e => setMobile(e.target.value.replace(/\\D/g, ''))}
                    required"""

text = text.replace(old_login_input, new_login_input)

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/pages/Login.jsx', 'w', encoding='utf-8') as f:
    f.write(text)

# PATCH REGISTER
with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/pages/Register.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

old_reg_input = """                    <input 
                      required type="tel" pattern="[0-9]{10}" value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})}"""

new_reg_input = """                    <input 
                      required type="tel" maxLength="10" value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value.replace(/\\D/g, '')})}"""

text = text.replace(old_reg_input, new_reg_input)

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/pages/Register.jsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Mobile number inputs restricted.")
