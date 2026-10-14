with open('C:/Users/Omkar/Desktop/Dukaan360_Backend/main.py', 'r', encoding='utf-8') as f:
    text = f.read()

import re

old_str = "return {'today_sales': today_sales, 'total_due': total_due, 'low_stock_alerts': low_stock, 'total_customers': total_customers}"

new_str = """
    total_inventory_value = db.query(func.sum(models.StockBatch.current_quantity * models.StockBatch.purchase_rate)).scalar() or 0.0
    
    today_profit = db.query(
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
    }
"""

text = text.replace(old_str, new_str)
with open('C:/Users/Omkar/Desktop/Dukaan360_Backend/main.py', 'w', encoding='utf-8') as f:
    f.write(text)

print("Patched successfully!")
