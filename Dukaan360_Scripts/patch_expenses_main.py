import re

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

if "# --- EXPENSE API ---" not in main_text:
    main_text += "\n" + expense_routes

old_summary_pattern = re.compile(r'today_profit = db\.query\([\s\S]*?\'today_profit\': today_profit\n\s*\}', re.MULTILINE)

new_summary = """today_gross_profit = db.query(
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

main_text = old_summary_pattern.sub(new_summary, main_text)

with open('C:/Users/Omkar/Desktop/Dukaan360_Backend/main.py', 'w', encoding='utf-8') as f:
    f.write(main_text)

print("Done")
