import re

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Backend/models.py', 'r', encoding='utf-8') as f:
    text = f.read()

old_user = """class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, index=True)
    store_id = Column(Integer, ForeignKey('stores.id'), nullable=True) # SuperAdmin has no store
    name = Column(String, nullable=False)
    mobile = Column(String, unique=True, index=True)
    password_hash = Column(String, nullable=False)
    role = Column(Enum(RoleEnum), default=RoleEnum.CASHIER)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)"""

new_user = """class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, index=True)
    store_id = Column(Integer, ForeignKey('stores.id'), nullable=True) # SuperAdmin has no store
    name = Column(String, nullable=False)
    mobile = Column(String, unique=True, index=True)
    password_hash = Column(String, nullable=False)
    profile_picture = Column(String, nullable=True) # BASE64 or URL
    role = Column(Enum(RoleEnum), default=RoleEnum.CASHIER)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)"""

text = text.replace(old_user, new_user)

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Backend/models.py', 'w', encoding='utf-8') as f:
    f.write(text)

print("models.py updated.")
