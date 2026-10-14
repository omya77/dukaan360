import sqlite3

def set_category_unsplash_images():
    # Map category names to high-quality generic Unsplash images
    cat_img_map = {
        "Grains & Pulses": "https://images.unsplash.com/photo-1586201375761-83865001e8ac?auto=format&fit=crop&w=300&q=80",
        "Spices & Masala": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=300&q=80",
        "Edible Oils & Ghee": "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=300&q=80",
        "Snacks & Biscuits": "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=300&q=80",
        "Beverages": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=300&q=80",
        "Personal Care": "https://images.unsplash.com/photo-1600857062241-98e5dba7f214?auto=format&fit=crop&w=300&q=80",
        "Cleaning Supplies": "https://images.unsplash.com/photo-1584820927498-cafe5c152918?auto=format&fit=crop&w=300&q=80",
        "Dry Fruits": "https://images.unsplash.com/photo-1599576822237-775e54d8ec68?auto=format&fit=crop&w=300&q=80",
        "Dairy Products": "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=300&q=80"
    }

    try:
        conn = sqlite3.connect('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Backend/dukaan.db')
        cursor = conn.cursor()
        
        # Get category IDs
        cursor.execute("SELECT id, name FROM categories WHERE store_id = 1")
        categories = cursor.fetchall()
        
        cat_id_map = {name: cid for cid, name in categories}
        
        for cat_name, img_url in cat_img_map.items():
            if cat_name in cat_id_map:
                cid = cat_id_map[cat_name]
                cursor.execute("UPDATE products SET image_url = ? WHERE category_id = ?", (img_url, cid))
                
        conn.commit()
        print("Updated all products with category-specific Unsplash images!")
        
    except Exception as e:
        print(f"Error: {e}")
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    set_category_unsplash_images()
