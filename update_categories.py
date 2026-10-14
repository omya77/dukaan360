import sqlite3

def update_categories():
    updates = {
        "Grains & Pulses (धान्य आणि डाळी)": "Grains & Pulses",
        "Spices & Masala (मसाले)": "Spices & Masala",
        "Edible Oils & Ghee (तेल आणि तूप)": "Edible Oils & Ghee",
        "Snacks & Biscuits (खाऊ आणि बिस्किटे)": "Snacks & Biscuits",
        "Beverages (कोल्ड ड्रिंक्स)": "Beverages",
        "Personal Care (साबण, शाम्पू, पेस्ट)": "Personal Care",
        "Cleaning Supplies (सर्फ, फिनाईल)": "Cleaning Supplies",
        "Dry Fruits (सुका मेवा)": "Dry Fruits",
        "Dairy Products (दूध, पनीर)": "Dairy Products"
    }

    try:
        conn = sqlite3.connect('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Backend/dukaan.db')
        cursor = conn.cursor()
        
        for old_name, new_name in updates.items():
            cursor.execute("UPDATE categories SET name = ? WHERE name = ? AND store_id = 1", (new_name, old_name))
                
        conn.commit()
        print("Categories updated to English only!")
        
    except Exception as e:
        print(f"Error: {e}")
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    update_categories()
