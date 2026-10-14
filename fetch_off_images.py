import sqlite3
import urllib.request
import urllib.parse
import json
import time

def fetch_off_images():
    try:
        conn = sqlite3.connect('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Backend/dukaan.db')
        cursor = conn.cursor()
        
        # Get all products that have placeholders
        cursor.execute("SELECT id, name FROM products WHERE image_url LIKE '%placehold.co%' AND store_id = 1")
        products = cursor.fetchall()
        
        for p_id, p_name in products:
            # Simplify name for better search (e.g., "Aashirvaad Atta (5kg)" -> "Aashirvaad Atta")
            clean_name = p_name.split('(')[0].replace('1kg', '').replace('500g', '').replace('200g', '').replace('50g', '').replace('1L', '').replace('500ml', '').strip()
            
            encoded_name = urllib.parse.quote(clean_name)
            url = f"https://world.openfoodfacts.org/cgi/search.pl?search_terms={encoded_name}&search_simple=1&action=process&json=1"
            
            try:
                req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
                response = urllib.request.urlopen(req, timeout=5)
                data = json.loads(response.read())
                
                if data.get('products') and len(data['products']) > 0:
                    img_url = data['products'][0].get('image_url')
                    if img_url:
                        cursor.execute("UPDATE products SET image_url = ? WHERE id = ?", (img_url, p_id))
                        conn.commit()
                        print(f"Success OFF: {clean_name}")
                        continue
            except Exception as e:
                print(f"Failed OFF for {clean_name}: {e}")
            
            time.sleep(1) # Be nice to their API
                
        print("Finished scanning OpenFoodFacts!")
        
    except Exception as e:
        print(f"Error: {e}")
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    fetch_off_images()
