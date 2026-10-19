from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Boolean, Enum
from sqlalchemy.orm import declarative_base, relationship
from datetime import datetime
import enum

Base = declarative_base()

# --- ENUMS ---
class RoleEnum(enum.Enum):
    SUPERADMIN = "SuperAdmin" # App Owner (Omkar)
    OWNER = "Owner"           # Shop Owner
    MANAGER = "Manager"
    CASHIER = "Cashier"
    STOCK_MANAGER = "Stock Manager"

class StoreStatusEnum(enum.Enum):
    PENDING = "Pending"
    ACTIVE = "Active"
    REJECTED = "Rejected"
    EXPIRED = "Expired"

class PlanTypeEnum(enum.Enum):
    MONTH_1 = "1 Month"
    MONTH_3 = "3 Months"
    MONTH_6 = "6 Months"
    YEAR_1 = "1 Year"

class MovementTypeEnum(enum.Enum):
    PURCHASE = "Purchase"
    SALE = "Sale"
    SALE_RETURN = "Sale Return"
    PURCHASE_RETURN = "Purchase Return"
    DAMAGE = "Damage"
    ADJUSTMENT = "Adjustment"

class PaymentMethodEnum(enum.Enum):
    CASH = "Cash"
    UPI = "UPI"
    CARD = "Card"
    CREDIT = "Credit"

# --- 1. STORES & USERS (MULTI-TENANCY CORE) ---
class Store(Base):
    __tablename__ = 'stores'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    owner_name = Column(String, nullable=False)
    mobile = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, nullable=True)
    address = Column(String)
    gst_number = Column(String, nullable=True)
    
    # SaaS Fields
    status = Column(Enum(StoreStatusEnum), default=StoreStatusEnum.PENDING)
    plan_type = Column(Enum(PlanTypeEnum), default=PlanTypeEnum.MONTH_1)
    subscription_start_date = Column(DateTime, default=datetime.now)
    subscription_end_date = Column(DateTime, nullable=True)
    
    users = relationship("User", back_populates="store")

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, index=True)
    store_id = Column(Integer, ForeignKey('stores.id'), nullable=True) # SuperAdmin has no store
    name = Column(String, nullable=False)
    username = Column(String, unique=True, index=True, nullable=True) # Instagram-style username (e.g. ramesh_pos)
    mobile = Column(String, unique=True, index=True, nullable=True)
    email = Column(String, unique=True, index=True, nullable=True) # For password reset OTP & alerts
    password_hash = Column(String, nullable=False)
    profile_picture = Column(String, nullable=True) # BASE64 or URL
    role = Column(Enum(RoleEnum), default=RoleEnum.CASHIER)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.now)

    store = relationship("Store", back_populates="users")


# --- 2. MASTER DATA & PRODUCTS ---
class Category(Base):
    __tablename__ = 'categories'
    id = Column(Integer, primary_key=True, index=True)
    store_id = Column(Integer, ForeignKey('stores.id'), nullable=False)
    name = Column(String, nullable=False)

class Product(Base):
    __tablename__ = 'products'
    id = Column(Integer, primary_key=True, index=True)
    store_id = Column(Integer, ForeignKey('stores.id'), nullable=False)
    name = Column(String, nullable=False)
    barcode = Column(String, index=True) # Cannot be globally unique anymore, only unique per store!
    category_id = Column(Integer, ForeignKey('categories.id'))
    unit = Column(String) # e.g., KG, Piece
    mrp = Column(Float, nullable=False)
    selling_price = Column(Float, nullable=False)
    image_url = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    
    category = relationship("Category")
    batches = relationship("StockBatch", back_populates="product")

class StockBatch(Base):
    __tablename__ = 'stock_batches'
    id = Column(Integer, primary_key=True, index=True)
    store_id = Column(Integer, ForeignKey('stores.id'), nullable=False)
    product_id = Column(Integer, ForeignKey('products.id'))
    batch_number = Column(String, nullable=False)
    expiry_date = Column(DateTime, nullable=True)
    purchase_rate = Column(Float, nullable=False)
    current_quantity = Column(Float, default=0.0)
    
    product = relationship("Product", back_populates="batches")

# --- 3. CORE: STOCK MOVEMENT ENGINE ---
class StockMovement(Base):
    __tablename__ = 'stock_movements'
    id = Column(Integer, primary_key=True, index=True)
    store_id = Column(Integer, ForeignKey('stores.id'), nullable=False)
    product_id = Column(Integer, ForeignKey('products.id'))
    batch_id = Column(Integer, ForeignKey('stock_batches.id'))
    user_id = Column(Integer, ForeignKey('users.id'))
    
    movement_type = Column(Enum(MovementTypeEnum), nullable=False)
    quantity = Column(Float, nullable=False)
    reference_id = Column(String) 
    reason = Column(String, nullable=True)
    timestamp = Column(DateTime, default=datetime.now)

# --- 4. CUSTOMERS & SUPPLIERS ---
class Customer(Base):
    __tablename__ = 'customers'
    id = Column(Integer, primary_key=True, index=True)
    store_id = Column(Integer, ForeignKey('stores.id'), nullable=False)
    name = Column(String, nullable=False)
    mobile = Column(String, index=True) # Cannot be globally unique anymore!
    opening_balance = Column(Float, default=0.0)
    current_due = Column(Float, default=0.0)
    loyalty_points = Column(Float, default=0.0)
    last_reminder_sent = Column(DateTime, nullable=True)
    
    ledger = relationship("CustomerLedger", back_populates="customer")

class CustomerLedger(Base):
    __tablename__ = 'customer_ledger'
    id = Column(Integer, primary_key=True, index=True)
    store_id = Column(Integer, ForeignKey('stores.id'), nullable=False)
    customer_id = Column(Integer, ForeignKey('customers.id'))
    transaction_type = Column(String) 
    amount = Column(Float, nullable=False)
    description = Column(String)
    timestamp = Column(DateTime, default=datetime.now)
    
    customer = relationship("Customer", back_populates="ledger")

class Supplier(Base):
    __tablename__ = 'suppliers'
    id = Column(Integer, primary_key=True, index=True)
    store_id = Column(Integer, ForeignKey('stores.id'), nullable=False)
    name = Column(String, nullable=False)
    company = Column(String)
    current_due = Column(Float, default=0.0)

# --- 5. POS & BILLING ---
class SaleInvoice(Base):
    __tablename__ = 'sale_invoices'
    id = Column(Integer, primary_key=True, index=True)
    store_id = Column(Integer, ForeignKey('stores.id'), nullable=False)
    invoice_number = Column(String, index=True) # Not unique globally
    cashier_id = Column(Integer, ForeignKey('users.id'))
    customer_id = Column(Integer, ForeignKey('customers.id'), nullable=True)
    
    subtotal = Column(Float, default=0.0)
    discount = Column(Float, default=0.0)
    tax = Column(Float, default=0.0)
    grand_total = Column(Float, default=0.0)
    
    loyalty_points_earned = Column(Float, default=0.0)
    loyalty_points_redeemed = Column(Float, default=0.0)
    loyalty_discount_amount = Column(Float, default=0.0)
    
    is_void = Column(Boolean, default=False)
    timestamp = Column(DateTime, default=datetime.now)
    
    items = relationship("SaleItem", back_populates="invoice")
    payments = relationship("SalePayment", back_populates="invoice")

class SaleItem(Base):
    __tablename__ = 'sale_items'
    id = Column(Integer, primary_key=True, index=True)
    invoice_id = Column(Integer, ForeignKey('sale_invoices.id'))
    product_id = Column(Integer, ForeignKey('products.id'))
    batch_id = Column(Integer, ForeignKey('stock_batches.id'))
    
    quantity = Column(Float, nullable=False)
    rate = Column(Float, nullable=False)
    total = Column(Float, nullable=False)
    
    invoice = relationship("SaleInvoice", back_populates="items")

class SalePayment(Base):
    __tablename__ = 'sale_payments'
    id = Column(Integer, primary_key=True, index=True)
    invoice_id = Column(Integer, ForeignKey('sale_invoices.id'))
    method = Column(Enum(PaymentMethodEnum), nullable=False)
    amount = Column(Float, nullable=False)
    timestamp = Column(DateTime, default=datetime.now)
    
    invoice = relationship("SaleInvoice", back_populates="payments")

# --- 6. CASH SHIFT MANAGEMENT ---
class CashShift(Base):
    __tablename__ = 'cash_shifts'
    id = Column(Integer, primary_key=True, index=True)
    store_id = Column(Integer, ForeignKey('stores.id'), nullable=False)
    cashier_id = Column(Integer, ForeignKey('users.id'))
    
    opening_cash = Column(Float, nullable=False)
    expected_closing_cash = Column(Float, default=0.0)
    actual_closing_cash = Column(Float, nullable=True)
    
    opened_at = Column(DateTime, default=datetime.now)
    closed_at = Column(DateTime, nullable=True)

# --- 7. EXPENSES ---
class Expense(Base):
    __tablename__ = 'expenses'
    id = Column(Integer, primary_key=True, index=True)
    store_id = Column(Integer, ForeignKey('stores.id'), nullable=False)
    category = Column(String, index=True)
    description = Column(String)
    amount = Column(Float, nullable=False)
    timestamp = Column(DateTime, default=datetime.now)

# --- 8. AUDIT LOG (EMPLOYEE & STOCK THEFT/LEAKAGE TRACKING) ---
class AuditLog(Base):
    __tablename__ = 'audit_logs'
    id = Column(Integer, primary_key=True, index=True)
    store_id = Column(Integer, ForeignKey('stores.id'), nullable=False)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=True)
    user_name = Column(String, nullable=True)
    action_type = Column(String, nullable=False) # BILL_CREATED, BILL_VOIDED, STOCK_ADJUSTMENT, PRICE_CHANGE, PAYMENT_RECEIVED
    entity_name = Column(String, nullable=True)
    details = Column(String, nullable=True)
    timestamp = Column(DateTime, default=datetime.now)

