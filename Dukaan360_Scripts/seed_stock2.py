import requests  
for p in requests.get('http://127.0.0.1:8000/products/').json():  
    r = requests.post('http://127.0.0.1:8000/stock/receive/?store_id=1&user_id=1', json={'product_id': p['id'], 'batch_number': 'B-'+str(p['id']), 'current_quantity': 100, 'purchase_rate': p['selling_price']*0.8})  
    print(r.status_code, r.text)  
