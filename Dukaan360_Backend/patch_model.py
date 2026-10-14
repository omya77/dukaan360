with open('C:/Users/Omkar/Desktop/Dukaan360_Backend/models.py', 'r', encoding='utf-8') as f:
    text = f.read()

# Add image_url to Product
if "image_url = Column(String" not in text:
    text = text.replace("selling_price = Column(Float, nullable=False)", "selling_price = Column(Float, nullable=False)\n    image_url = Column(String, nullable=True)")

with open('C:/Users/Omkar/Desktop/Dukaan360_Backend/models.py', 'w', encoding='utf-8') as f:
    f.write(text)

with open('C:/Users/Omkar/Desktop/Dukaan360_Backend/schemas.py', 'r', encoding='utf-8') as f:
    schema_text = f.read()

# Add image_url to ProductBase
if "image_url: Optional[str] = None" not in schema_text:
    schema_text = schema_text.replace("selling_price: float", "selling_price: float\n    image_url: Optional[str] = None")

with open('C:/Users/Omkar/Desktop/Dukaan360_Backend/schemas.py', 'w', encoding='utf-8') as f:
    f.write(schema_text)

import sqlite3
conn = sqlite3.connect('C:/Users/Omkar/Desktop/Dukaan360_Backend/dukaan.db')
cursor = conn.cursor()
try:
    cursor.execute("ALTER TABLE products ADD COLUMN image_url VARCHAR")
    conn.commit()
    print("Column added to DB")
except Exception as e:
    print("DB error:", e)

print("Models and Schemas updated!")
