with open('C:/Users/Omkar/Desktop/Dukaan360_Backend/main.py', 'r', encoding='utf-8') as f:
    text = f.read()

import re

# Find the end of delete_product function
delete_func = """@app.delete("/products/{product_id}", tags=["Products"])
def delete_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    db.delete(product)
    db.commit()
    return {"message": "Product deleted successfully"}"""

put_func = """

@app.put("/products/{product_id}", response_model=schemas.ProductResponse, tags=["Products"])
def update_product(product_id: int, product_update: schemas.ProductCreate, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Update fields
    for key, value in product_update.dict().items():
        setattr(product, key, value)
        
    db.commit()
    db.refresh(product)
    return product
"""

text = text.replace(delete_func, delete_func + put_func)
with open('C:/Users/Omkar/Desktop/Dukaan360_Backend/main.py', 'w', encoding='utf-8') as f:
    f.write(text)

print("PUT /products/ patched successfully!")
