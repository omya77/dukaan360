import sqlite3
import urllib.parse

def set_final_images():
    # Direct reliable links
    img_map = {
        "Aashirvaad Atta (5kg)": "https://www.bbassets.com/media/uploads/p/s/30006887_9-aashirvaad-atta-whole-wheat.jpg",
        "India Gate Basmati Rice (1kg)": "https://www.bbassets.com/media/uploads/p/s/40072462_12-india-gate-basmati-rice-feast-rozzana.jpg",
        "Toor Dal (Unpolished) 1kg": "https://www.bbassets.com/media/uploads/p/s/40000291_10-bb-popular-toor-dalarhar-dal.jpg",
        "Moong Dal 1kg": "https://www.bbassets.com/media/uploads/p/s/10000434_15-bb-popular-moong-dal.jpg",
        "Fortune Besan 500g": "https://www.bbassets.com/media/uploads/p/s/40113165_3-fortune-besan.jpg",
        
        "Parle-G Gold Biscuits 1kg": "https://upload.wikimedia.org/wikipedia/commons/a/a1/Parle-G_Biscuit.jpg",
        "Lays Classic Salted (Large)": "https://www.bbassets.com/media/uploads/p/s/40194723_3-lays-potato-chips-classic-salted.jpg",
        "Kurkure Masala Munch (Large)": "https://www.bbassets.com/media/uploads/p/s/264227_10-kurkure-namkeen-masala-munch.jpg",
        
        "Lux Soap (Pack of 4)": "https://www.bbassets.com/media/uploads/p/xl/40234008-3_1-lux-international-moisturising-bathing-soap-creamy-perfection-for-glowing-skin.jpg",
        "Colgate MaxFresh 150g": "https://www.bbassets.com/media/uploads/p/s/40220371_1-colgate-maxfresh-toothpaste-blue-peppermint-ice.jpg",
        "Surf Excel Easy Wash Detergent 1kg": "https://www.bbassets.com/media/uploads/p/s/266946_16-surf-excel-easy-wash-detergent-powder.jpg",
        
        "Coca-Cola 2L": "https://www.bbassets.com/media/uploads/p/s/251025_9-coca-cola-diet-coke.jpg",
        "Red Label Tea 500g": "https://www.bbassets.com/media/uploads/p/s/267026_11-brooke-bond-red-label-tea.jpg",
    }

    try:
        conn = sqlite3.connect('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Backend/dukaan.db')
        cursor = conn.cursor()
        
        cursor.execute("SELECT id, name FROM products WHERE store_id = 1")
        products = cursor.fetchall()
        
        for p_id, p_name in products:
            if p_name in img_map:
                url = img_map[p_name]
            else:
                # Generate a cool placeholder with the EXACT product name
                # E.g. "Toor Dal"
                encoded_name = urllib.parse.quote(p_name.replace(" ", "\n"))
                url = f"https://placehold.co/400x400/FFF7ED/EA580C?text={encoded_name}"
                
            cursor.execute("UPDATE products SET image_url = ? WHERE id = ?", (url, p_id))
                
        conn.commit()
        print("Final exact/placeholder images updated!")
        
    except Exception as e:
        print(f"Error: {e}")
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    set_final_images()
