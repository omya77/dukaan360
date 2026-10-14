import re

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Backend/main.py', 'r', encoding='utf-8') as f:
    text = f.read()

old_profit = """    # simplified profit: 15% margin assumption since we aren't tracking COGS perfectly per item here
    profit = total_sales * 0.15"""

new_profit = """    # Calculate REAL exact profit based on actual purchase rates (COGS)
    real_profit = 0
    for s in sales_today:
        if s.timestamp.date() == today:
            for item in s.items:
                batch = db.query(models.StockBatch).filter(models.StockBatch.id == item.batch_id).first()
                if batch:
                    profit_per_unit = item.rate - batch.purchase_rate
                    real_profit += (profit_per_unit * item.quantity)
    
    profit = real_profit"""

text = text.replace(old_profit, new_profit)

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Backend/main.py', 'w', encoding='utf-8') as f:
    f.write(text)

print("Profit calculation is now REAL and exact.")
