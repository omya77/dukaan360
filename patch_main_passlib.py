import re

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Backend/main.py', 'r', encoding='utf-8') as f:
    text = f.read()

old_crypt = 'pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")'
new_crypt = 'pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")'

text = text.replace(old_crypt, new_crypt)

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Backend/main.py', 'w', encoding='utf-8') as f:
    f.write(text)

print("Swapped bcrypt for pbkdf2_sha256 in main.py to fix passlib/bcrypt incompatibility.")
