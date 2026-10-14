import re

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Backend/schemas.py', 'r', encoding='utf-8') as f:
    text = f.read()

old_req = """class RegisterRequest(BaseModel):
    store_name: str
    owner_name: str
    mobile: str
    password: str
    plan_type: str # 1_MONTH, 3_MONTH, etc."""

new_req = """class RegisterRequest(BaseModel):
    store_name: str
    owner_name: str
    mobile: str
    password: str
    plan_type: str # 1_MONTH, 3_MONTH, etc.
    address: str
    profile_picture: Optional[str] = None"""

text = text.replace(old_req, new_req)

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Backend/schemas.py', 'w', encoding='utf-8') as f:
    f.write(text)

print("schemas.py updated.")
