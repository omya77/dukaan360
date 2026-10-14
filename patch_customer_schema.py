import re

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Backend/schemas.py', 'r', encoding='utf-8') as f:
    text = f.read()

old_resp = """class CustomerResponse(CustomerBase):
    id: int
    current_due: float

    class Config:"""
new_resp = """from typing import Optional\nclass CustomerResponse(CustomerBase):
    id: int
    current_due: float
    is_khata: Optional[bool] = False

    class Config:"""
if "is_khata" not in text:
    text = text.replace(old_resp, new_resp)
    with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Backend/schemas.py', 'w', encoding='utf-8') as f:
        f.write(text)

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Backend/main.py', 'r', encoding='utf-8') as f:
    text = f.read()

old_endpoint = """@app.get("/customers/", response_model=list[schemas.CustomerResponse], tags=["Customers & Khata"])
def get_customers(db: Session = Depends(get_db)):
    return db.query(models.Customer).all()"""
new_endpoint = """@app.get("/customers/", response_model=list[schemas.CustomerResponse], tags=["Customers & Khata"])
def get_customers(db: Session = Depends(get_db)):
    customers = db.query(models.Customer).all()
    for c in customers:
        has_ledger = db.query(models.CustomerLedger).filter(models.CustomerLedger.customer_id == c.id).first()
        c.is_khata = bool(has_ledger) or c.current_due != 0 or c.opening_balance != 0
    return customers"""
if "c.is_khata" not in text:
    text = text.replace(old_endpoint, new_endpoint)
    with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Backend/main.py', 'w', encoding='utf-8') as f:
        f.write(text)

print("Done")
