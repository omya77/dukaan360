import sqlite3
import urllib.parse

def use_bing_thumbnails():
    try:
        conn = sqlite3.connect('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Backend/dukaan.db')
        cursor = conn.cursor()
        
        # Get all products that have placehold.co images (the ones that failed)
        cursor.execute("SELECT id, name FROM products WHERE image_url LIKE '%placehold.co%' AND store_id = 1")
        products = cursor.fetchall()
        
        for p_id, p_name in products:
            # Create a good search query
            clean_name = p_name.replace(" (Large)", "").replace(" (Pack of 4)", "").replace(" (Pack of 3)", "")
            query = f"{clean_name} product india"
            encoded_query = urllib.parse.quote(query)
            
            url = f"https://tse1.mm.bing.net/th?q={encoded_query}"
            
            cursor.execute("UPDATE products SET image_url = ? WHERE id = ?", (url, p_id))
            print(f"Updated {p_name} to Bing Thumbnail")
                
        conn.commit()
        print("All missing images updated with Bing Thumbnails!")
        
    except Exception as e:
        print(f"Error: {e}")
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    use_bing_thumbnails()
