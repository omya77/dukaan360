import sqlite3

def add_categories():
    categories = [
        "Grains & Pulses (धान्य आणि डाळी)",
        "Spices & Masala (मसाले)",
        "Edible Oils & Ghee (तेल आणि तूप)",
        "Snacks & Biscuits (खाऊ आणि बिस्किटे)",
        "Beverages (कोल्ड ड्रिंक्स)",
        "Personal Care (साबण, शाम्पू, पेस्ट)",
        "Cleaning Supplies (सर्फ, फिनाईल)",
        "Dry Fruits (सुका मेवा)",
        "Dairy Products (दूध, पनीर)"
    ]

    try:
        conn = sqlite3.connect('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Backend/dukaan.db')
        cursor = conn.cursor()
        
        # Check if store 1 exists
        cursor.execute("SELECT id FROM stores WHERE id = 1")
        store = cursor.fetchone()
        
        if not store:
            print("Store ID 1 not found. Make sure you registered a store.")
            return

        for cat in categories:
            # Insert if not exists
            cursor.execute("SELECT id FROM categories WHERE name = ? AND store_id = 1", (cat,))
            if not cursor.fetchone():
                cursor.execute("INSERT INTO categories (name, store_id) VALUES (?, 1)", (cat,))
                
        conn.commit()
        print("Categories added successfully!")
        
    except Exception as e:
        print(f"Error: {e}")
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    add_categories()
