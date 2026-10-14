import re

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Backend/main.py', 'r', encoding='utf-8') as f:
    text = f.read()

old_func = """@api.post("/stock/receive/")
def receive_stock(movement: schemas.StockMovementCreate, db: Session = Depends(get_db), user: models.User = Depends(get_current_active_user)):
    batch = db.query(models.StockBatch).filter(models.StockBatch.id == movement.batch_id, models.StockBatch.store_id == user.store_id).first()
    if not batch:
        raise HTTPException(status_code=404, detail="Batch not found in this store")
    
    batch.current_quantity += movement.quantity
    mov = models.StockMovement(**movement.dict(), store_id=user.store_id, user_id=user.id)
    db.add(mov)
    db.commit()
    return {"message": "Stock received"}"""

new_func = """class ReceiveStockPayload(BaseModel):
    product_id: int
    batch_number: str
    purchase_rate: float
    current_quantity: float

@api.post("/stock/receive/")
def receive_stock(payload: ReceiveStockPayload, db: Session = Depends(get_db), user: models.User = Depends(get_current_active_user)):
    new_batch = models.StockBatch(
        product_id=payload.product_id,
        batch_number=payload.batch_number,
        purchase_rate=payload.purchase_rate,
        current_quantity=payload.current_quantity,
        store_id=user.store_id
    )
    db.add(new_batch)
    db.commit()
    db.refresh(new_batch)
    
    mov = models.StockMovement(
        product_id=payload.product_id,
        batch_id=new_batch.id,
        movement_type="Purchase",
        quantity=payload.current_quantity,
        store_id=user.store_id,
        user_id=user.id
    )
    db.add(mov)
    db.commit()
    return {"message": "Stock received"}"""

if old_func in text:
    text = text.replace(old_func, new_func)
else:
    print("WARNING: old_func not found exactly. Using regex.")
    pattern = re.compile(r'@api\.post\("/stock/receive/"\)\ndef receive_stock\(.*?\n    return \{"message": "Stock received"\}', re.DOTALL)
    text = pattern.sub(new_func, text)

# Ensure BaseModel is imported
if "from pydantic import BaseModel" not in text:
    text = text.replace("from sqlalchemy.orm import Session", "from sqlalchemy.orm import Session\nfrom pydantic import BaseModel")

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Backend/main.py', 'w', encoding='utf-8') as f:
    f.write(text)

print("Endpoint rewritten successfully.")
