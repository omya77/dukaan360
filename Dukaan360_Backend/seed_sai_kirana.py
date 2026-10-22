import os
import sys
from datetime import datetime, timedelta

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

import database
import models

def seed_sai_kirana():
    db = database.SessionLocal()
    try:
        # Find store 2 (Sai kirana)
        store = db.query(models.Store).filter(models.Store.id == 2).first()
        if not store:
            print("Store 2 not found!")
            return

        user = db.query(models.User).filter(models.User.store_id == 2).first()
        cashier_id = user.id if user else 1

        print(f"Seeding data for Store: '{store.name}' (ID: {store.id}), User: '{user.name if user else 'None'}'")

        # 1. Create Categories
        categories_data = [
            "किराणा व धान्य",
            "तेल व तूप",
            "मसाले व मीठ",
            "चहा, साखर व पेये",
            "नाश्ता व बिस्कीट",
            "साबण व स्वच्छता",
            "दुग्धजन्य पदार्थ"
        ]

        cat_map = {}
        for cat_name in categories_data:
            existing = db.query(models.Category).filter(
                models.Category.store_id == store.id,
                models.Category.name == cat_name
            ).first()
            if not existing:
                existing = models.Category(store_id=store.id, name=cat_name)
                db.add(existing)
                db.flush()
            cat_map[cat_name] = existing.id

        print(f"Created {len(cat_map)} categories.")

        # 2. Create Products & Batches
        products_data = [
            {
                "name": "साखर (Sugar M-30)",
                "category": "किराणा व धान्य",
                "unit": "KG",
                "barcode": "8901001001",
                "mrp": 46.0,
                "selling_price": 44.0,
                "purchase_rate": 39.0,
                "qty": 45.0,
                "batch": "SUG-2026-01"
            },
            {
                "name": "भाग्यलक्ष्मी तूर डाळ (Toor Dal 1kg)",
                "category": "किराणा व धान्य",
                "unit": "KG",
                "barcode": "8901001002",
                "mrp": 175.0,
                "selling_price": 165.0,
                "purchase_rate": 145.0,
                "qty": 30.0,
                "batch": "DAL-2026-01"
            },
            {
                "name": "फॉर्च्यून शेंगदाणा तेल (Fortune Groundnut Oil 1L)",
                "category": "तेल व तूप",
                "unit": "Ltr",
                "barcode": "8901002001",
                "mrp": 185.0,
                "selling_price": 175.0,
                "purchase_rate": 155.0,
                "qty": 20.0,
                "batch": "OIL-2026-01"
            },
            {
                "name": "गोदरेज वनस्पती तूप (Vanaspati Ghee 500g)",
                "category": "तेल व तूप",
                "unit": "Pouch",
                "barcode": "8901002002",
                "mrp": 95.0,
                "selling_price": 88.0,
                "purchase_rate": 76.0,
                "qty": 15.0,
                "batch": "GHE-2026-01"
            },
            {
                "name": "एव्हरेस्ट हळद पावडर (Everest Turmeric 100g)",
                "category": "मसाले व मीठ",
                "unit": "Pkt",
                "barcode": "8901003001",
                "mrp": 38.0,
                "selling_price": 35.0,
                "purchase_rate": 28.0,
                "qty": 25.0,
                "batch": "HAL-2026-01"
            },
            {
                "name": "टाटा मीठ (Tata Salt 1kg)",
                "category": "मसाले व मीठ",
                "unit": "Pkt",
                "barcode": "8901003002",
                "mrp": 28.0,
                "selling_price": 27.0,
                "purchase_rate": 22.0,
                "qty": 50.0,
                "batch": "SLT-2026-01"
            },
            {
                "name": "वाघ बकरी चहा (Wagh Bakri Tea 250g)",
                "category": "चहा, साखर व पेये",
                "unit": "Pkt",
                "barcode": "8901004001",
                "mrp": 140.0,
                "selling_price": 130.0,
                "purchase_rate": 110.0,
                "qty": 22.0,
                "batch": "TEA-2026-01"
            },
            {
                "name": "पारले-जी बिस्कीट (Parle-G 100g)",
                "category": "नाश्ता व बिस्कीट",
                "unit": "Pkt",
                "barcode": "8901005001",
                "mrp": 10.0,
                "selling_price": 10.0,
                "purchase_rate": 8.5,
                "qty": 6.0,  # LOW STOCK (<10)
                "batch": "PG-2026-01"
            },
            {
                "name": "ब्रिटानिया गुड डे बटर (Good Day Butter 100g)",
                "category": "नाश्ता व बिस्कीट",
                "unit": "Pkt",
                "barcode": "8901005002",
                "mrp": 30.0,
                "selling_price": 28.0,
                "purchase_rate": 23.0,
                "qty": 5.0,  # LOW STOCK (<10)
                "batch": "GD-2026-01"
            },
            {
                "name": "मॅगी २-मिनिट नूडल्स (Maggi Noodles 70g)",
                "category": "नाश्ता व बिस्कीट",
                "unit": "Pkt",
                "barcode": "8901005003",
                "mrp": 14.0,
                "selling_price": 14.0,
                "purchase_rate": 11.5,
                "qty": 40.0,
                "batch": "MAG-2026-01"
            },
            {
                "name": "लक्स साबण (Lux Beauty Soap 100g)",
                "category": "साबण व स्वच्छता",
                "unit": "Piece",
                "barcode": "8901006001",
                "mrp": 40.0,
                "selling_price": 36.0,
                "purchase_rate": 29.0,
                "qty": 18.0,
                "batch": "LUX-2026-01"
            },
            {
                "name": "सर्फ एक्सेल क्विक वॉश (Surf Excel 1kg)",
                "category": "साबण व स्वच्छता",
                "unit": "Pkt",
                "barcode": "8901006002",
                "mrp": 145.0,
                "selling_price": 135.0,
                "purchase_rate": 115.0,
                "qty": 12.0,
                "batch": "SRF-2026-01"
            },
            {
                "name": "अमूल ताजे दूध (Amul Taaza Milk 500ml)",
                "category": "दुग्धजन्य पदार्थ",
                "unit": "Pouch",
                "barcode": "8901007001",
                "mrp": 27.0,
                "selling_price": 27.0,
                "purchase_rate": 24.5,
                "qty": 4.0,  # LOW STOCK (<10)
                "batch": "MLK-2026-01"
            },
            {
                "name": "अमूल बटर (Amul Butter 100g)",
                "category": "दुग्धजन्य पदार्थ",
                "unit": "Piece",
                "barcode": "8901007002",
                "mrp": 56.0,
                "selling_price": 54.0,
                "purchase_rate": 47.0,
                "qty": 16.0,
                "batch": "BUT-2026-01"
            }
        ]

        prod_map = {}
        batch_map = {}

        for pinfo in products_data:
            prod = db.query(models.Product).filter(
                models.Product.store_id == store.id,
                models.Product.name == pinfo["name"]
            ).first()
            if not prod:
                prod = models.Product(
                    store_id=store.id,
                    name=pinfo["name"],
                    barcode=pinfo["barcode"],
                    category_id=cat_map[pinfo["category"]],
                    unit=pinfo["unit"],
                    mrp=pinfo["mrp"],
                    selling_price=pinfo["selling_price"],
                    is_active=True
                )
                db.add(prod)
                db.flush()

            prod_map[pinfo["name"]] = prod

            # Batch
            batch = db.query(models.StockBatch).filter(
                models.StockBatch.store_id == store.id,
                models.StockBatch.product_id == prod.id
            ).first()
            if not batch:
                batch = models.StockBatch(
                    store_id=store.id,
                    product_id=prod.id,
                    batch_number=pinfo["batch"],
                    purchase_rate=pinfo["purchase_rate"],
                    current_quantity=pinfo["qty"],
                    expiry_date=datetime.now() + timedelta(days=180)
                )
                db.add(batch)
                db.flush()

                # Stock Movement record
                sm = models.StockMovement(
                    store_id=store.id,
                    product_id=prod.id,
                    batch_id=batch.id,
                    user_id=cashier_id,
                    movement_type=models.MovementTypeEnum.PURCHASE,
                    quantity=pinfo["qty"],
                    reference_id="INIT-STOCK",
                    reason="Initial Stock Setup"
                )
                db.add(sm)

            batch_map[pinfo["name"]] = batch

        print(f"Created {len(prod_map)} products & batches.")

        # 3. Create Customers & Khata Ledger
        customers_data = [
            {
                "name": "राहुल पाटील (Rahul Patil)",
                "mobile": "9822114455",
                "due": 1450.0,
                "loyalty": 25.0,
                "ledger": [
                    ("DEBIT", 1000.0, "आरंभीची बाकी (Opening Balance)"),
                    ("DEBIT", 950.0, "किराणा माल खरेदी (Grocery Bill)"),
                    ("CREDIT", 500.0, "रोख जमा पावती (Cash Paid)")
                ]
            },
            {
                "name": "सचिन कदम (Sachin Kadam)",
                "mobile": "9890123456",
                "due": 850.0,
                "loyalty": 15.0,
                "ledger": [
                    ("DEBIT", 850.0, "किराणा माल खरेदी (Grocery Bill)")
                ]
            },
            {
                "name": "सुप्रिया शिंदे (Supriya Shinde)",
                "mobile": "9765432109",
                "due": 2100.0,
                "loyalty": 40.0,
                "ledger": [
                    ("DEBIT", 2100.0, "मासिक किराणा माल उधारी (Monthly Ration)")
                ]
            },
            {
                "name": "अमोल जगताप (Amol Jagtap)",
                "mobile": "9423001122",
                "due": 520.0,
                "loyalty": 10.0,
                "ledger": [
                    ("DEBIT", 520.0, "साखर व तेल खरेदी बाकी (Sugar & Oil)")
                ]
            },
            {
                "name": "विजय काळे (Vijay Kale)",
                "mobile": "9158334455",
                "due": 0.0,
                "loyalty": 50.0,
                "ledger": [
                    ("DEBIT", 1200.0, "किराणा खरेदी"),
                    ("CREDIT", 1200.0, "पूर्ण बिल भरणा (Full Payment Cleared)")
                ]
            }
        ]

        cust_map = {}
        for cinfo in customers_data:
            cust = db.query(models.Customer).filter(
                models.Customer.store_id == store.id,
                models.Customer.mobile == cinfo["mobile"]
            ).first()
            if not cust:
                cust = models.Customer(
                    store_id=store.id,
                    name=cinfo["name"],
                    mobile=cinfo["mobile"],
                    opening_balance=0.0,
                    current_due=cinfo["due"],
                    loyalty_points=cinfo["loyalty"]
                )
                db.add(cust)
                db.flush()

                for l_type, l_amt, l_desc in cinfo["ledger"]:
                    ledger = models.CustomerLedger(
                        store_id=store.id,
                        customer_id=cust.id,
                        transaction_type=l_type,
                        amount=l_amt,
                        description=l_desc,
                        timestamp=datetime.now() - timedelta(hours=2)
                    )
                    db.add(ledger)

            cust_map[cinfo["mobile"]] = cust

        print(f"Created {len(cust_map)} customers and ledger entries.")

        # 4. Create Sale Invoices for Today
        now = datetime.now()
        invoices_data = [
            {
                "inv_no": "INV-1001",
                "time_offset_min": 180,
                "cust": None,
                "method": models.PaymentMethodEnum.CASH,
                "items": [
                    ("साखर (Sugar M-30)", 2, 44.0),
                    ("वाघ बकरी चहा (Wagh Bakri Tea 250g)", 1, 130.0),
                    ("मॅगी २-मिनिट नूडल्स (Maggi Noodles 70g)", 2, 14.0)
                ]
            },
            {
                "inv_no": "INV-1002",
                "time_offset_min": 120,
                "cust": None,
                "method": models.PaymentMethodEnum.UPI,
                "items": [
                    ("फॉर्च्यून शेंगदाणा तेल (Fortune Groundnut Oil 1L)", 1, 175.0),
                    ("भाग्यलक्ष्मी तूर डाळ (Toor Dal 1kg)", 1, 165.0),
                    ("टाटा मीठ (Tata Salt 1kg)", 1, 27.0),
                    ("एव्हरेस्ट हळद पावडर (Everest Turmeric 100g)", 1, 35.0)
                ]
            },
            {
                "inv_no": "INV-1003",
                "time_offset_min": 75,
                "cust": cust_map.get("9822114455"),  # Rahul Patil
                "method": models.PaymentMethodEnum.CREDIT,
                "items": [
                    ("फॉर्च्यून शेंगदाणा तेल (Fortune Groundnut Oil 1L)", 2, 175.0),
                    ("भाग्यलक्ष्मी तूर डाळ (Toor Dal 1kg)", 2, 165.0),
                    ("साखर (Sugar M-30)", 3, 44.0),
                    ("सर्फ एक्सेल क्विक वॉश (Surf Excel 1kg)", 1, 135.0)
                ]
            },
            {
                "inv_no": "INV-1004",
                "time_offset_min": 45,
                "cust": cust_map.get("9423001122"),  # Amol Jagtap
                "method": models.PaymentMethodEnum.CASH,
                "items": [
                    ("अमूल बटर (Amul Butter 100g)", 2, 54.0),
                    ("लक्स साबण (Lux Beauty Soap 100g)", 2, 36.0),
                    ("मॅगी २-मिनिट नूडल्स (Maggi Noodles 70g)", 3, 14.0)
                ]
            },
            {
                "inv_no": "INV-1005",
                "time_offset_min": 15,
                "cust": None,
                "method": models.PaymentMethodEnum.UPI,
                "items": [
                    ("सर्फ एक्सेल क्विक वॉश (Surf Excel 1kg)", 1, 135.0),
                    ("लक्स साबण (Lux Beauty Soap 100g)", 2, 36.0),
                    ("वाघ बकरी चहा (Wagh Bakri Tea 250g)", 1, 130.0),
                    ("फॉर्च्यून शेंगदाणा तेल (Fortune Groundnut Oil 1L)", 1, 175.0)
                ]
            }
        ]

        for inv_info in invoices_data:
            existing_inv = db.query(models.SaleInvoice).filter(
                models.SaleInvoice.store_id == store.id,
                models.SaleInvoice.invoice_number == inv_info["inv_no"]
            ).first()

            if not existing_inv:
                inv_total = sum(q * rate for _, q, rate in inv_info["items"])
                inv_time = now - timedelta(minutes=inv_info["time_offset_min"])

                inv = models.SaleInvoice(
                    store_id=store.id,
                    invoice_number=inv_info["inv_no"],
                    cashier_id=cashier_id,
                    customer_id=inv_info["cust"].id if inv_info["cust"] else None,
                    subtotal=inv_total,
                    discount=0.0,
                    tax=0.0,
                    grand_total=inv_total,
                    loyalty_points_earned=round(inv_total * 0.01, 1),
                    timestamp=inv_time
                )
                db.add(inv)
                db.flush()

                for pname, qty, rate in inv_info["items"]:
                    prod = prod_map[pname]
                    batch = batch_map[pname]
                    s_item = models.SaleItem(
                        invoice_id=inv.id,
                        product_id=prod.id,
                        batch_id=batch.id,
                        quantity=qty,
                        rate=rate,
                        total=qty * rate
                    )
                    db.add(s_item)

                    sm = models.StockMovement(
                        store_id=store.id,
                        product_id=prod.id,
                        batch_id=batch.id,
                        user_id=cashier_id,
                        movement_type=models.MovementTypeEnum.SALE,
                        quantity=qty,
                        reference_id=inv_info["inv_no"],
                        reason="POS Sale",
                        timestamp=inv_time
                    )
                    db.add(sm)

                sp = models.SalePayment(
                    invoice_id=inv.id,
                    method=inv_info["method"],
                    amount=inv_total,
                    timestamp=inv_time
                )
                db.add(sp)

        print(f"Created {len(invoices_data)} sale invoices and payments for today.")

        # 5. Create Store Expenses
        expenses_data = [
            ("चहा / नाश्ता", "दुकान चहा व नाश्ता", 60.0),
            ("साफसफाई", "दुकान साफसफाई व झाडू", 150.0)
        ]
        for cat, desc, amt in expenses_data:
            exp = db.query(models.Expense).filter(
                models.Expense.store_id == store.id,
                models.Expense.description == desc
            ).first()
            if not exp:
                exp = models.Expense(
                    store_id=store.id,
                    category=cat,
                    description=desc,
                    amount=amt,
                    timestamp=datetime.now() - timedelta(hours=3)
                )
                db.add(exp)

        # 6. Create Suppliers for Smart PO
        suppliers_data = [
            ("राजेश किराणा होलसेल ट्रेडर्स", "Rajesh Trading Co. Pune", 12000.0),
            ("अमृता डेअरी व ऑईल एजन्सी", "Amruta Agencies Karjat", 5500.0)
        ]
        for sname, comp, due in suppliers_data:
            sup = db.query(models.Supplier).filter(
                models.Supplier.store_id == store.id,
                models.Supplier.name == sname
            ).first()
            if not sup:
                sup = models.Supplier(
                    store_id=store.id,
                    name=sname,
                    company=comp,
                    current_due=due
                )
                db.add(sup)

        db.commit()
        print("Successfully committed all data for Sai Kirana!")

    except Exception as e:
        db.rollback()
        print("Error seeding data:", e)
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_sai_kirana()
