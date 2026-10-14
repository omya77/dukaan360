import sqlite3

def set_hardcoded_images():
    img_map = {
        "Aashirvaad Atta (5kg)": "https://m.media-amazon.com/images/I/71qJjGfF01L._SL1500_.jpg",
        "India Gate Basmati Rice (1kg)": "https://m.media-amazon.com/images/I/61F2Kx3L5xL._SL1000_.jpg",
        "Toor Dal (Unpolished) 1kg": "https://m.media-amazon.com/images/I/71rT4lZ4nFL._SL1500_.jpg",
        "Moong Dal 1kg": "https://m.media-amazon.com/images/I/61j7h8K5t5L._SL1500_.jpg",
        "Chana Dal 1kg": "https://m.media-amazon.com/images/I/61z+HhC3HmL._SL1500_.jpg",
        "Fortune Besan 500g": "https://m.media-amazon.com/images/I/61mN5n8Z2FL._SL1500_.jpg",
        
        "Everest Garam Masala 100g": "https://m.media-amazon.com/images/I/81xU21P1D7L._SL1500_.jpg",
        "MDH Chana Masala 100g": "https://m.media-amazon.com/images/I/71tQeJ0xOLL._SL1500_.jpg",
        "Suhana Chicken Masala 50g": "https://m.media-amazon.com/images/I/71lU5kHn3fL._SL1500_.jpg",
        "Turmeric Powder (Haldi) 200g": "https://m.media-amazon.com/images/I/71g0u1lO-qL._SL1500_.jpg",
        
        "Fortune Sunlite Refined Sunflower Oil 1L": "https://m.media-amazon.com/images/I/61o4m+D3UBL._SL1000_.jpg",
        "Gemini Refined Soybean Oil 1L": "https://m.media-amazon.com/images/I/51r2XG5XQpL._SL1000_.jpg",
        "Amul Pure Ghee 500ml": "https://m.media-amazon.com/images/I/61d2wN6MhTL._SL1500_.jpg",
        
        "Parle-G Gold Biscuits 1kg": "https://m.media-amazon.com/images/I/61vYpX+k-wL._SL1500_.jpg",
        "Britannia Good Day Cashew 600g": "https://m.media-amazon.com/images/I/61t-X3tD5QL._SL1500_.jpg",
        "Haldiram's Bhujia Sev 400g": "https://m.media-amazon.com/images/I/71tV2Mv03FL._SL1500_.jpg",
        "Lays Classic Salted (Large)": "https://m.media-amazon.com/images/I/71tX1L6H4hL._SL1500_.jpg",
        "Kurkure Masala Munch (Large)": "https://m.media-amazon.com/images/I/71a6P+U0a8L._SL1500_.jpg",
        
        "Coca-Cola 2L": "https://m.media-amazon.com/images/I/61p8Fw9z8BL._SL1500_.jpg",
        "Sprite 2L": "https://m.media-amazon.com/images/I/51+Z1r0Hk0L._SL1000_.jpg",
        "Red Label Tea 500g": "https://m.media-amazon.com/images/I/61xX4x-x0LL._SL1000_.jpg",
        "Nescafe Classic Coffee 50g": "https://m.media-amazon.com/images/I/71U1o8d5VML._SL1500_.jpg",
        
        "Lux Soap (Pack of 4)": "https://m.media-amazon.com/images/I/51j1-Q0N6jL._SL1000_.jpg",
        "Lifebuoy Total Soap (Pack of 4)": "https://m.media-amazon.com/images/I/61lXz2f2nML._SL1000_.jpg",
        "Colgate MaxFresh 150g": "https://m.media-amazon.com/images/I/61r5f6k1pZL._SL1500_.jpg",
        
        "Surf Excel Easy Wash Detergent 1kg": "https://m.media-amazon.com/images/I/61c8rJ0aKcL._SL1000_.jpg",
        "Vim Dishwash Bar (Pack of 3)": "https://m.media-amazon.com/images/I/61vY-sR8DkL._SL1500_.jpg",
        "Lizol Surface Cleaner (Citrus) 1L": "https://m.media-amazon.com/images/I/71e-qjGqKML._SL1500_.jpg"
    }

    try:
        conn = sqlite3.connect('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Backend/dukaan.db')
        cursor = conn.cursor()
        
        for name, url in img_map.items():
            cursor.execute("UPDATE products SET image_url = ? WHERE name = ? AND store_id = 1", (url, name))
                
        conn.commit()
        print("Real Amazon images updated for major products!")
        
    except Exception as e:
        print(f"Error: {e}")
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    set_hardcoded_images()
