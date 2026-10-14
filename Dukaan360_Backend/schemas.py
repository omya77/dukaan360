from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from models import RoleEnum, StoreStatusEnum, PlanTypeEnum

# --- AUTH & TENANT SCHEMAS ---
class Token(BaseModel):
    access_token: str
    token_type: str
    role: str
    name: str
    store_status: str

class TokenData(BaseModel):
    mobile: Optional[str] = None

class RegisterRequest(BaseModel):
    store_name: str
    owner_name: str
    mobile: str
    email: Optional[str] = None
    password: str
    plan_type: str # 1_MONTH, 3_MONTH, etc.
    address: str
    profile_picture: Optional[str] = None

class StoreResponse(BaseModel):
    id: int
    name: str
    owner_name: str
    mobile: str
    email: Optional[str] = None
    status: str
    plan_type: str
    subscription_start_date: datetime
    subscription_end_date: Optional[datetime] = None

    class Config:
        from_attributes = True

# --- USER SCHEMAS ---
class UserBase(BaseModel):
    name: str
    username: Optional[str] = None
    mobile: Optional[str] = None
    email: Optional[str] = None
    role: Optional[str] = "Cashier"

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    store_id: Optional[int]
    is_active: bool

    class Config:
        from_attributes = True

# --- CATEGORY SCHEMAS ---
class CategoryBase(BaseModel):
    name: str

class CategoryCreate(CategoryBase):
    pass

class CategoryResponse(CategoryBase):
    id: int

    class Config:
        from_attributes = True

# --- PRODUCT SCHEMAS ---
class ProductBase(BaseModel):
    name: str
    barcode: str
    category_id: int
    unit: str
    mrp: float
    selling_price: float
    image_url: Optional[str] = None
    is_active: bool = True

class ProductCreate(ProductBase):
    pass

class ProductResponse(ProductBase):
    id: int
    category: Optional[CategoryResponse] = None

    class Config:
        from_attributes = True


# --- STOCK SCHEMAS ---
class StockBatchBase(BaseModel):
    product_id: Optional[int] = None
    batch_number: str
    expiry_date: Optional[datetime] = None
    purchase_rate: float
    current_quantity: float = 0.0

class StockBatchResponse(StockBatchBase):
    id: int

    class Config:
        from_attributes = True

class StockMovementCreate(BaseModel):
    product_id: int
    batch_id: int
    movement_type: str # Purchase, Sale, Sale Return, etc.
    quantity: float
    reference_id: Optional[str] = None
    reason: Optional[str] = None

class StockMovementResponse(StockMovementCreate):
    id: int
    timestamp: datetime
    user_id: int

    class Config:
        from_attributes = True

# --- CUSTOMER & KHATA SCHEMAS ---
class CustomerBase(BaseModel):
    name: str
    mobile: str
    opening_balance: float = 0.0

class CustomerCreate(CustomerBase):
    pass

class CustomerResponse(CustomerBase):
    id: int
    current_due: float
    is_khata: Optional[bool] = False

    class Config:
        from_attributes = True

class CustomerPaymentCreate(BaseModel):
    amount: float
    method: str


# --- POS (BILLING) SCHEMAS ---
class SaleItemCreate(BaseModel):
    product_id: int
    batch_id: int
    quantity: float
    rate: float

class SalePaymentCreate(BaseModel):
    method: str
    amount: float

class SaleInvoiceCreate(BaseModel):
    customer_id: Optional[int] = None
    items: List[SaleItemCreate]
    payments: List[SalePaymentCreate]
    discount: float = 0.0
    tax: float = 0.0

class SaleItemResponse(BaseModel):
    id: int
    product_id: int
    batch_id: Optional[int] = None
    quantity: float
    rate: float
    total: float
    
    class Config:
        from_attributes = True

class SalePaymentResponse(BaseModel):
    id: int
    method: str
    amount: float
    timestamp: datetime
    
    class Config:
        from_attributes = True

class SaleInvoiceResponse(BaseModel):
    id: int
    invoice_number: str
    cashier_id: int
    customer_id: Optional[int] = None
    subtotal: float
    discount: float
    tax: float
    grand_total: float
    is_void: bool
    timestamp: datetime
    items: List[SaleItemResponse] = []
    payments: List[SalePaymentResponse] = []
    
    class Config:
        from_attributes = True

class ExpenseCreate(BaseModel):
    category: str
    description: str = ""
    amount: float

class ExpenseResponse(ExpenseCreate):
    id: int
    timestamp: datetime
    class Config:
        from_attributes = True

class ProfileUpdate(BaseModel):
    name: str
    profile_picture: Optional[str] = None
    new_password: Optional[str] = None
