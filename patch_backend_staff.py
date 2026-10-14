import re

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Backend/main.py', 'r', encoding='utf-8') as f:
    text = f.read()

# Add a route to create a cashier
new_route = """
@api.post("/staff/")
def create_staff(user: schemas.UserCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_active_user)):
    if current_user.role != models.RoleEnum.OWNER:
        raise HTTPException(status_code=403, detail="Only Owners can create staff accounts")
        
    db_user = db.query(models.User).filter(models.User.mobile == user.mobile).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Mobile already registered")
        
    hashed_password = get_password_hash(user.password)
    new_staff = models.User(
        name=user.name,
        mobile=user.mobile,
        password_hash=hashed_password,
        role=models.RoleEnum.CASHIER,
        store_id=current_user.store_id
    )
    db.add(new_staff)
    db.commit()
    return {"message": "Staff account created successfully"}
"""

if "@api.post(\"/staff/\")" not in text:
    text = text.replace("@api.get(\"/dashboard/summary\")", new_route + "\n@api.get(\"/dashboard/summary\")")

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Backend/main.py', 'w', encoding='utf-8') as f:
    f.write(text)

print("Backend patched with /staff/ creation endpoint")
