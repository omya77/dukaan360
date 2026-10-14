import requests
import time

BASE_URL = "http://127.0.0.1:8000"

def seed():
    print("Seeding database...")
    
    # 1. Create Categories
    cats = [
        {"name": "Grocery"},
        {"name": "Dairy"},
        {"name": "Snacks"},
        {"name": "Cleaning"}
    ]
    
    cat_ids = {}
    for c in cats:
        resp = requests.post(f"{BASE_URL}/categories/", json=c)
        if resp.status_code == 200:
            cat_ids[c['name']] = resp.json()['id']
            print(f"Created category: {c['name']}")
    
    # 2. Create Products
    if not cat_ids:
        print("Failed to create categories, aborting.")
        return

    products = [
        {
            "name": "Aashirvaad Shudh Chakki Atta",
            "barcode": "8901234567890",
            "category_id": cat_ids["Grocery"],
            "unit": "5 KG",
            "mrp": 260.0,
            "selling_price": 240.0,
            "is_active": True
        },
        {
            "name": "Madhur Pure & Hygienic Sugar",
            "barcode": "8901234567891",
            "category_id": cat_ids["Grocery"],
            "unit": "1 KG",
            "mrp": 50.0,
            "selling_price": 45.0,
            "is_active": True
        },
        {
            "name": "Amul Taaza Toned Milk",
            "barcode": "8901234567892",
            "category_id": cat_ids["Dairy"],
            "unit": "500 ML",
            "mrp": 28.0,
            "selling_price": 28.0,
            "is_active": True
        },
        {
            "name": "Tata Tea Premium",
            "barcode": "8901234567893",
            "category_id": cat_ids["Grocery"],
            "unit": "250 G",
            "mrp": 150.0,
            "selling_price": 140.0,
            "is_active": True
        },
        {
            "name": "Britannia Good Day Cookies",
            "barcode": "8901234567894",
            "category_id": cat_ids["Snacks"],
            "unit": "1 PC",
            "mrp": 30.0,
            "selling_price": 28.0,
            "is_active": True
        },
        {
            "name": "Vim Dishwash Gel",
            "barcode": "8901234567895",
            "category_id": cat_ids["Cleaning"],
            "unit": "250 ML",
            "mrp": 60.0,
            "selling_price": 55.0,
            "is_active": True
        }
    ]

    for p in products:
        resp = requests.post(f"{BASE_URL}/products/", json=p)
        if resp.status_code == 200:
            print(f"Created product: {p['name']}")
            
            # Add Stock Batch for this product so stock > 0
            product_id = resp.json()['id']
            stock = {
                "product_id": product_id,
                "batch_number": f"BATCH-{product_id}-001",
                "quantity": 100,
                "cost_price": p['selling_price'] * 0.8
            }
            s_resp = requests.post(f"{BASE_URL}/stock/receive/", json=stock)
            if s_resp.status_code == 200:
                print(f"  Added 100 stock for {p['name']}")
        else:
            print(f"Failed to create {p['name']}: {resp.text}")

if __name__ == "__main__":
    seed()
