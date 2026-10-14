import sqlite3
import urllib.request
import urllib.parse
import json
import time

def fix_all_broken_images():
    try:
        conn = sqlite3.connect('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Backend/dukaan.db')
        cursor = conn.cursor()
        
        # Get all products that have broken bbassets or amazon links
        cursor.execute("SELECT id, name FROM products WHERE (image_url LIKE '%bbassets%' OR image_url LIKE '%amazon%') AND store_id = 1")
        products = cursor.fetchall()
        
        for p_id, p_name in products:
            clean_name = p_name.split('(')[0].replace('1kg', '').replace('500g', '').replace('200g', '').replace('50g', '').replace('1L', '').replace('500ml', '').strip()
            
            encoded_name = urllib.parse.quote(clean_name)
            url = f"https://world.openfoodfacts.org/cgi/search.pl?search_terms={encoded_name}&search_simple=1&action=process&json=1"
            
            success = False
            try:
                req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
                response = urllib.request.urlopen(req, timeout=5)
                data = json.loads(response.read())
                
                if data.get('products') and len(data['products']) > 0:
                    for prod in data['products']:
                        if 'image_url' in prod:
                            img_url = prod['image_url']
                            cursor.execute("UPDATE products SET image_url = ? WHERE id = ?", (img_url, p_id))
                            conn.commit()
                            print(f"Success OFF: {clean_name}")
                            success = True
                            break
            except Exception as e:
                print(f"Failed OFF for {clean_name}: {e}")
            
            if not success:
                # Fallback to placehold.co
                ph_name = urllib.parse.quote(p_name.replace(" ", "\n"))
                ph_url = f"https://placehold.co/400x400/FFF7ED/EA580C?text={ph_name}"
                cursor.execute("UPDATE products SET image_url = ? WHERE id = ?", (ph_url, p_id))
                conn.commit()
                print(f"Fallback Placehold: {p_name}")
                
            time.sleep(1.5) # Be nice to their API
                
        print("Finished fixing all broken images!")
        
    except Exception as e:
        print(f"Error: {e}")
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    fix_all_broken_images()
