import re

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Backend/main.py', 'r', encoding='utf-8') as f:
    text = f.read()

old_receive = """@api.post("/stock/receive/")
def receive_stock(movement: schemas.StockMovementCreate, db: Session = Depends(get_db), user: models.User = Depends(get_current_active_user)):
    batch = db.query(models.StockBatch).filter(models.StockBatch.id == movement.batch_id, models.StockBatch.store_id == user.store_id).first()
    if not batch:
        raise HTTPException(status_code=404, detail="Batch not found in this store")
    
    batch.current_quantity += movement.quantity
    mov = models.StockMovement(**movement.dict(), store_id=user.store_id, user_id=user.id)
    db.add(mov)
    db.commit()
    return {"message": "Stock updated"}"""

new_receive = """class ReceiveStockPayload(BaseModel):
    product_id: int
    batch_number: str
    purchase_rate: float
    current_quantity: float

@api.post("/stock/receive/")
def receive_stock(payload: ReceiveStockPayload, db: Session = Depends(get_db), user: models.User = Depends(get_current_active_user)):
    # Create the new stock batch
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
    
    # Record the movement
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
    return {"message": "Stock added successfully"}"""

text = text.replace(old_receive, new_receive)

# Also we need to import BaseModel from pydantic if not there, but schemas.py has it, we can just use pydantic in main.py
if "from pydantic import BaseModel" not in text:
    text = text.replace("from sqlalchemy.orm import Session", "from sqlalchemy.orm import Session\nfrom pydantic import BaseModel")

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Backend/main.py', 'w', encoding='utf-8') as f:
    f.write(text)

print("main.py stock receive patched.")
