import sqlite3
import os
import time
import urllib.request
from duckduckgo_search import DDGS

def download_exact_images():
    # Setup directory in frontend public folder
    frontend_dir = 'C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/public/products'
    os.makedirs(frontend_dir, exist_ok=True)
    
    try:
        conn = sqlite3.connect('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Backend/dukaan.db')
        cursor = conn.cursor()
        
        cursor.execute("SELECT id, name FROM products WHERE store_id = 1")
        products = cursor.fetchall()
        
        ddgs = DDGS()
        
        for p_id, p_name in products:
            img_path = f"/products/{p_id}.jpg"
            full_path = os.path.join(frontend_dir, f"{p_id}.jpg")
            
            # Skip if already downloaded
            if os.path.exists(full_path):
                cursor.execute("UPDATE products SET image_url = ? WHERE id = ?", (img_path, p_id))
                continue
                
            try:
                # Search exact product on duckduckgo
                query = f"{p_name} india grocery product"
                print(f"Searching for {query}...")
                
                results = ddgs.images(query, max_results=3)
                if results and len(results) > 0:
                    for res in results:
                        img_url = res.get('image')
                        if img_url:
                            try:
                                # Setup a user-agent to bypass basic blocks
                                req = urllib.request.Request(img_url, headers={'User-Agent': 'Mozilla/5.0'})
                                with urllib.request.urlopen(req, timeout=5) as response:
                                    with open(full_path, 'wb') as f:
                                        f.write(response.read())
                                cursor.execute("UPDATE products SET image_url = ? WHERE id = ?", (img_path, p_id))
                                conn.commit()
                                print(f"Saved exact image for {p_name}")
                                break # Success, stop trying alternative images
                            except Exception as dl_e:
                                print(f"  DL failed for {img_url}: {dl_e}")
                
                # Sleep briefly
                time.sleep(1)
            except Exception as inner_e:
                print(f"Failed to fetch for {p_name}: {inner_e}")
                
        print("Finished downloading exact images!")
        
    except Exception as e:
        print(f"Error: {e}")
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    download_exact_images()
