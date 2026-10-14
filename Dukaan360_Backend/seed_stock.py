import requests
import time

BASE_URL = "http://127.0.0.1:8000"

def seed_users_and_stores():
    # 1. Create a Store
    print("Assuming Store and User exist or bypassing...")
    
def seed():
    print("Fetching existing products...")
    prods = requests.get(f"{BASE_URL}/products/").json()
    
    # Let's see if we need to create a dummy user
    try:
        user_resp = requests.post(f"{BASE_URL}/users/", json={"name": "Admin", "mobile": "9999999999", "role": "admin", "password": "admin"})
        user_id = user_resp.json().get('id', 1)
    except:
        user_id = 1
        
    for p in prods:
        product_id = p['id']
        stock = {
            "product_id": product_id,
            "batch_number": f"BATCH-{product_id}-001",
            "quantity": 100,
            "cost_price": p['selling_price'] * 0.8
        }
        # Assuming store 1 and user 1
        s_resp = requests.post(f"{BASE_URL}/stock/receive/?store_id=1&user_id={user_id}", json=stock)
        if s_resp.status_code == 200:
            print(f"Added 100 stock for {p['name']} (Batch ID: {s_resp.json()['id']})")
        else:
            print(f"Failed stock for {p['name']}: {s_resp.text}")

if __name__ == "__main__":
    seed()
