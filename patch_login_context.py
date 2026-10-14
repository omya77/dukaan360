import re

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/pages/Login.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

old_login_call = """      login(res.data.access_token, {
        name: res.data.name,
        role: res.data.role,
        store_status: res.data.store_status
      });"""

new_login_call = """      login(res.data.access_token, {
        name: res.data.name,
        role: res.data.role,
        store_status: res.data.store_status,
        profile_picture: res.data.profile_picture,
        store_name: res.data.store_name,
        store_mobile: res.data.store_mobile,
        store_address: res.data.store_address
      });"""

text = text.replace(old_login_call, new_login_call)

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/pages/Login.jsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Login.jsx updated to store extra fields.")
