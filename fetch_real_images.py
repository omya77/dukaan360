import sqlite3
from duckduckgo_search import DDGS
import time

def get_real_images():
    try:
        conn = sqlite3.connect('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Backend/dukaan.db')
        cursor = conn.cursor()
        
        cursor.execute("SELECT id, name FROM products WHERE store_id = 1")
        products = cursor.fetchall()
        
        ddgs = DDGS()
        
        for p_id, p_name in products:
            try:
                # Search for product image on duckduckgo
                query = f"{p_name} bigbasket product"
                results = ddgs.images(query, max_results=1)
                
                if results and len(results) > 0:
                    img_url = results[0].get('image')
                    if img_url:
                        cursor.execute("UPDATE products SET image_url = ? WHERE id = ?", (img_url, p_id))
                        print(f"Updated {p_name} -> {img_url[:50]}...")
                
                # Sleep briefly to avoid rate limiting
                time.sleep(1.5)
            except Exception as inner_e:
                print(f"Failed to fetch for {p_name}: {inner_e}")
                
        conn.commit()
        print("All products updated with REAL images!")
        
    except Exception as e:
        print(f"Error: {e}")
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    get_real_images()
