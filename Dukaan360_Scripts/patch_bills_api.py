# We will append this to schemas.py
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

# Assuming PaymentMethodEnum is in models but we just use str here for simplicity or refer to models
# Wait, we already have SaleItemCreate. Let's append Response models.
append_schemas = """

class SaleItemResponse(BaseModel):
    id: int
    product_id: int
    batch_id: Optional[int] = None
    quantity: float
    rate: float
    total: float
    
    class Config:
        from_attributes = True

class SalePaymentResponse(BaseModel):
    id: int
    method: str
    amount: float
    timestamp: datetime
    
    class Config:
        from_attributes = True

class SaleInvoiceResponse(BaseModel):
    id: int
    invoice_number: str
    store_id: int
    cashier_id: int
    customer_id: Optional[int] = None
    subtotal: float
    discount: float
    tax: float
    grand_total: float
    is_void: bool
    timestamp: datetime
    items: List[SaleItemResponse] = []
    payments: List[SalePaymentResponse] = []
    
    class Config:
        from_attributes = True
"""

with open('C:/Users/Omkar/Desktop/Dukaan360_Backend/schemas.py', 'a', encoding='utf-8') as f:
    f.write(append_schemas)

with open('C:/Users/Omkar/Desktop/Dukaan360_Backend/main.py', 'r', encoding='utf-8') as f:
    main_text = f.read()

import re
old_get_bills = """@app.get("/pos/bills/", tags=["POS & Billing"])
def get_bills(db: Session = Depends(get_db), limit: int = 50):
    return db.query(models.SaleInvoice).order_by(models.SaleInvoice.timestamp.desc()).limit(limit).all()"""

new_get_bills = """@app.get("/pos/bills/", response_model=list[schemas.SaleInvoiceResponse], tags=["POS & Billing"])
def get_bills(db: Session = Depends(get_db), limit: int = 50):
    # Eager load items and payments to prevent N+1 queries and lazy load errors
    from sqlalchemy.orm import joinedload
    return db.query(models.SaleInvoice).options(joinedload(models.SaleInvoice.items), joinedload(models.SaleInvoice.payments)).order_by(models.SaleInvoice.timestamp.desc()).limit(limit).all()"""

main_text = main_text.replace(old_get_bills, new_get_bills)

with open('C:/Users/Omkar/Desktop/Dukaan360_Backend/main.py', 'w', encoding='utf-8') as f:
    f.write(main_text)

print('Done')
