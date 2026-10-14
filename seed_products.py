import sqlite3
import random

def seed_products():
    # Define categories and their products
    products_data = {
        "Grains & Pulses": [
            ("Aashirvaad Atta (5kg)", "Kilogram (kg)", 250, 260),
            ("India Gate Basmati Rice (1kg)", "Kilogram (kg)", 120, 130),
            ("Toor Dal (Unpolished) 1kg", "Kilogram (kg)", 160, 175),
            ("Moong Dal 1kg", "Kilogram (kg)", 110, 120),
            ("Chana Dal 1kg", "Kilogram (kg)", 85, 95),
            ("Fortune Besan 500g", "Gram (g)", 45, 50)
        ],
        "Spices & Masala": [
            ("Everest Garam Masala 100g", "Piece (pc)", 75, 80),
            ("MDH Chana Masala 100g", "Piece (pc)", 65, 70),
            ("Suhana Chicken Masala 50g", "Piece (pc)", 40, 45),
            ("Turmeric Powder (Haldi) 200g", "Piece (pc)", 50, 55),
            ("Red Chilli Powder 200g", "Piece (pc)", 80, 90),
            ("Coriander Powder (Dhania) 200g", "Piece (pc)", 60, 65)
        ],
        "Edible Oils & Ghee": [
            ("Fortune Sunlite Refined Sunflower Oil 1L", "Liter (L)", 140, 150),
            ("Gemini Refined Soybean Oil 1L", "Liter (L)", 135, 145),
            ("Amul Pure Ghee 500ml", "Piece (pc)", 270, 285),
            ("Gowardhan Ghee 500ml", "Piece (pc)", 280, 295),
            ("Saffola Gold Cooking Oil 1L", "Liter (L)", 180, 195),
            ("Patanjali Mustard Oil 1L", "Liter (L)", 160, 175)
        ],
        "Snacks & Biscuits": [
            ("Parle-G Gold Biscuits 1kg", "Piece (pc)", 100, 110),
            ("Britannia Good Day Cashew 600g", "Piece (pc)", 120, 130),
            ("Haldiram's Bhujia Sev 400g", "Piece (pc)", 90, 100),
            ("Lays Classic Salted (Large)", "Piece (pc)", 20, 20),
            ("Kurkure Masala Munch (Large)", "Piece (pc)", 20, 20),
            ("Balaji Wafers (Tomato) 100g", "Piece (pc)", 45, 50)
        ],
        "Beverages": [
            ("Coca-Cola 2L", "Piece (pc)", 90, 95),
            ("Sprite 2L", "Piece (pc)", 90, 95),
            ("Maaza Mango Drink 1.2L", "Piece (pc)", 65, 70),
            ("Red Label Tea 500g", "Piece (pc)", 240, 250),
            ("Wagh Bakri Premium Tea 500g", "Piece (pc)", 260, 275),
            ("Nescafe Classic Coffee 50g", "Piece (pc)", 140, 150)
        ],
        "Personal Care": [
            ("Lux Soap (Pack of 4)", "Piece (pc)", 120, 130),
            ("Lifebuoy Total Soap (Pack of 4)", "Piece (pc)", 100, 110),
            ("Colgate MaxFresh 150g", "Piece (pc)", 95, 105),
            ("Sunsilk Black Shine Shampoo 340ml", "Piece (pc)", 220, 240),
            ("Dove Hair Fall Rescue Shampoo 340ml", "Piece (pc)", 280, 310),
            ("Ponds Dreamflower Talc 100g", "Piece (pc)", 85, 95)
        ],
        "Cleaning Supplies": [
            ("Surf Excel Easy Wash Detergent 1kg", "Piece (pc)", 130, 140),
            ("Tide Plus Jasmine & Rose 1kg", "Piece (pc)", 110, 120),
            ("Vim Dishwash Bar (Pack of 3)", "Piece (pc)", 45, 50),
            ("Lizol Surface Cleaner (Citrus) 1L", "Piece (pc)", 180, 195),
            ("Harpic Power Plus Toilet Cleaner 1L", "Piece (pc)", 175, 190),
            ("Scotch-Brite Scrub Pad (Pack of 3)", "Piece (pc)", 40, 45)
        ]
    }

    try:
        conn = sqlite3.connect('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Backend/dukaan.db')
        cursor = conn.cursor()
        
        for category_name, products in products_data.items():
            # Get category ID
            cursor.execute("SELECT id FROM categories WHERE name = ? AND store_id = 1", (category_name,))
            cat_row = cursor.fetchone()
            if not cat_row:
                continue
            cat_id = cat_row[0]
            
            for p in products:
                name, unit, sell, mrp = p
                barcode = str(random.randint(100000000000, 999999999999))
                # Check if product exists
                cursor.execute("SELECT id FROM products WHERE name = ? AND store_id = 1", (name,))
                if not cursor.fetchone():
                    cursor.execute(
                        "INSERT INTO products (name, category_id, unit, selling_price, mrp, barcode, store_id) VALUES (?, ?, ?, ?, ?, ?, 1)",
                        (name, cat_id, unit, sell, mrp, barcode)
                    )
                
        conn.commit()
        print("Test products added successfully!")
        
    except Exception as e:
        print(f"Error: {e}")
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    seed_products()
