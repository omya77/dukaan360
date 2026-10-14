import re

# 1. Update models.py
with open('C:/Users/Omkar/Desktop/Dukaan360_Backend/models.py', 'r', encoding='utf-8') as f:
    models_text = f.read()

expense_model = """
# --- 7. EXPENSES ---
class Expense(Base):
    __tablename__ = 'expenses'
    id = Column(Integer, primary_key=True, index=True)
    category = Column(String, index=True) # e.g. 'Tea', 'Transport', 'Supplier'
    description = Column(String)
    amount = Column(Float, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
"""
models_text += expense_model

with open('C:/Users/Omkar/Desktop/Dukaan360_Backend/models.py', 'w', encoding='utf-8') as f:
    f.write(models_text)

# 2. Update schemas.py
with open('C:/Users/Omkar/Desktop/Dukaan360_Backend/schemas.py', 'r', encoding='utf-8') as f:
    schemas_text = f.read()

expense_schema = """
class ExpenseCreate(BaseModel):
    category: str
    description: str = ""
    amount: float

class ExpenseResponse(ExpenseCreate):
    id: int
    timestamp: datetime
    class Config:
        from_attributes = True
"""
schemas_text += expense_schema

with open('C:/Users/Omkar/Desktop/Dukaan360_Backend/schemas.py', 'w', encoding='utf-8') as f:
    f.write(schemas_text)

# 3. Update main.py
with open('C:/Users/Omkar/Desktop/Dukaan360_Backend/main.py', 'r', encoding='utf-8') as f:
    main_text = f.read()

expense_routes = """
# --- EXPENSE API ---
@app.post("/expenses/", response_model=schemas.ExpenseResponse, tags=["Expenses"])
def add_expense(expense: schemas.ExpenseCreate, db: Session = Depends(get_db)):
    db_exp = models.Expense(**expense.model_dump())
    db.add(db_exp)
    db.commit()
    db.refresh(db_exp)
    return db_exp

@app.get("/expenses/", response_model=list[schemas.ExpenseResponse], tags=["Expenses"])
def get_expenses(db: Session = Depends(get_db)):
    today = date.today()
    return db.query(models.Expense).filter(func.date(models.Expense.timestamp) == today).order_by(models.Expense.timestamp.desc()).all()
"""

# Insert routes before if __name__
idx = main_text.rfind('if __name__ == "__main__":')
if idx != -1:
    main_text = main_text[:idx] + expense_routes + "\n" + main_text[idx:]

# Update dashboard summary
old_summary = """    today_profit = db.query(
        func.sum((models.SaleItem.rate - models.StockBatch.purchase_rate) * models.SaleItem.quantity)
    ).join(
        models.SaleInvoice, models.SaleItem.invoice_id == models.SaleInvoice.id
    ).join(
        models.StockBatch, models.SaleItem.batch_id == models.StockBatch.id
    ).filter(
        func.date(models.SaleInvoice.timestamp) == today
    ).scalar() or 0.0

    return {
        'today_sales': today_sales, 
        'total_due': total_due, 
        'low_stock_alerts': low_stock,
        'total_customers': total_customers,
        'total_inventory_value': total_inventory_value,
        'today_profit': today_profit
    }"""

new_summary = """    today_gross_profit = db.query(
        func.sum((models.SaleItem.rate - models.StockBatch.purchase_rate) * models.SaleItem.quantity)
    ).join(
        models.SaleInvoice, models.SaleItem.invoice_id == models.SaleInvoice.id
    ).join(
        models.StockBatch, models.SaleItem.batch_id == models.StockBatch.id
    ).filter(
        func.date(models.SaleInvoice.timestamp) == today
    ).scalar() or 0.0

    today_expenses = db.query(func.sum(models.Expense.amount)).filter(func.date(models.Expense.timestamp) == today).scalar() or 0.0
    
    today_net_profit = today_gross_profit - today_expenses

    return {
        'today_sales': today_sales, 
        'total_due': total_due, 
        'low_stock_alerts': low_stock,
        'total_customers': total_customers,
        'total_inventory_value': total_inventory_value,
        'today_profit': today_net_profit,
        'today_expenses': today_expenses,
        'today_gross_profit': today_gross_profit
    }"""

main_text = main_text.replace(old_summary, new_summary)

with open('C:/Users/Omkar/Desktop/Dukaan360_Backend/main.py', 'w', encoding='utf-8') as f:
    f.write(main_text)

print("Done")
