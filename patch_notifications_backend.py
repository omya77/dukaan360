import re

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Backend/main.py', 'r', encoding='utf-8') as f:
    text = f.read()

# Add a Notification schema definition if we need one, or just return dicts.
# We'll just return a list of dicts for simplicity since it's a dynamic endpoint.

new_endpoint = """
@api.get("/notifications/")
def get_notifications(db: Session = Depends(get_db), user: models.User = Depends(get_current_active_user)):
    notifications = []
    
    # 1. Low Stock Alerts
    if user.store_id:
        # Calculate total stock per product for this store
        products = db.query(models.Product).filter(models.Product.store_id == user.store_id).all()
        for p in products:
            batches = db.query(models.StockBatch).filter(models.StockBatch.product_id == p.id).all()
            total_stock = sum(b.current_quantity for b in batches)
            if total_stock <= 10:
                notifications.append({
                    "id": f"stock-{p.id}",
                    "type": "WARNING",
                    "title": "Low Stock Alert",
                    "message": f"Only {total_stock} left in stock for '{p.name}'",
                    "timestamp": datetime.utcnow().isoformat() + "Z"
                })
    
    # 2. Subscription Alerts
    if user.store_id:
        store = db.query(models.Store).filter(models.Store.id == user.store_id).first()
        if store and store.subscription_end_date:
            days_left = (store.subscription_end_date - datetime.utcnow()).days
            if 0 <= days_left <= 7:
                notifications.append({
                    "id": "sub-expiry",
                    "type": "DANGER",
                    "title": "Subscription Expiring Soon",
                    "message": f"Your Dukaan360 subscription expires in {days_left} days. Please renew to avoid interruption.",
                    "timestamp": datetime.utcnow().isoformat() + "Z"
                })
                
    # Sort notifications so most critical are first
    return notifications

"""

# Insert it before the last line or before some known endpoint
if "@api.get(\"/notifications/\")" not in text:
    target = "@api.get(\"/dashboard/summary/\")"
    text = text.replace(target, new_endpoint + target)

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Backend/main.py', 'w', encoding='utf-8') as f:
    f.write(text)

print("Notifications endpoint added to main.py")
