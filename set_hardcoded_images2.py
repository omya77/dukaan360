import sqlite3

def set_hardcoded_images2():
    img_map = {
        "Red Chilli Powder 200g": "https://m.media-amazon.com/images/I/71X8kM2X5sL._SL1500_.jpg",
        "Coriander Powder (Dhania) 200g": "https://m.media-amazon.com/images/I/71R2c3W3p6L._SL1500_.jpg",
        "Gowardhan Ghee 500ml": "https://m.media-amazon.com/images/I/51r2XG5XQpL._SL1000_.jpg",
        "Saffola Gold Cooking Oil 1L": "https://m.media-amazon.com/images/I/61k4l9r4rLL._SL1500_.jpg",
        "Patanjali Mustard Oil 1L": "https://m.media-amazon.com/images/I/71f2b6m6q0L._SL1500_.jpg",
        
        "Balaji Wafers (Tomato) 100g": "https://m.media-amazon.com/images/I/71tX1L6H4hL._SL1500_.jpg",
        "Maaza Mango Drink 1.2L": "https://m.media-amazon.com/images/I/61H4D3m9aYL._SL1500_.jpg",
        "Wagh Bakri Premium Tea 500g": "https://m.media-amazon.com/images/I/71B9l9z7lXL._SL1500_.jpg",
        
        "Sunsilk Black Shine Shampoo 340ml": "https://m.media-amazon.com/images/I/51R8f0e5qFL._SL1000_.jpg",
        "Dove Hair Fall Rescue Shampoo 340ml": "https://m.media-amazon.com/images/I/51S4H1s8WdL._SL1000_.jpg",
        "Ponds Dreamflower Talc 100g": "https://m.media-amazon.com/images/I/61n1b8c6tLL._SL1500_.jpg",
        
        "Tide Plus Jasmine & Rose 1kg": "https://m.media-amazon.com/images/I/71Y7m9l4yTL._SL1500_.jpg",
        "Harpic Power Plus Toilet Cleaner 1L": "https://m.media-amazon.com/images/I/61L9p1w5c-L._SL1500_.jpg",
        "Scotch-Brite Scrub Pad (Pack of 3)": "https://m.media-amazon.com/images/I/71d3X3y2l6L._SL1500_.jpg"
    }

    try:
        conn = sqlite3.connect('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Backend/dukaan.db')
        cursor = conn.cursor()
        
        for name, url in img_map.items():
            cursor.execute("UPDATE products SET image_url = ? WHERE name = ? AND store_id = 1", (url, name))
                
        conn.commit()
        print("All remaining images updated!")
        
    except Exception as e:
        print(f"Error: {e}")
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    set_hardcoded_images2()
