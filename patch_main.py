import re

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Backend/main.py', 'r', encoding='utf-8') as f:
    text = f.read()

old_register = """    # Create Store (PENDING)
    new_store = models.Store(
        name=req.store_name,
        owner_name=req.owner_name,
        mobile=req.mobile,
        status=models.StoreStatusEnum.PENDING,
        plan_type=req.plan_type,
        subscription_end_date=end_date
    )
    db.add(new_store)
    db.commit()
    db.refresh(new_store)
    
    # Create User
    new_user = models.User(
        store_id=new_store.id,
        name=req.owner_name,
        mobile=req.mobile,
        password_hash=get_password_hash(req.password),
        role=models.RoleEnum.OWNER
    )"""

new_register = """    # Create Store (PENDING)
    new_store = models.Store(
        name=req.store_name,
        owner_name=req.owner_name,
        mobile=req.mobile,
        address=req.address,
        status=models.StoreStatusEnum.PENDING,
        plan_type=req.plan_type,
        subscription_end_date=end_date
    )
    db.add(new_store)
    db.commit()
    db.refresh(new_store)
    
    # Create User
    new_user = models.User(
        store_id=new_store.id,
        name=req.owner_name,
        mobile=req.mobile,
        password_hash=get_password_hash(req.password),
        profile_picture=req.profile_picture,
        role=models.RoleEnum.OWNER
    )"""

old_login = """    return {"access_token": access_token, "token_type": "bearer", "role": user.role.value, "name": user.name, "store_status": store_status}"""

new_login = """    return {
        "access_token": access_token, 
        "token_type": "bearer", 
        "role": user.role.value, 
        "name": user.name, 
        "store_status": store_status,
        "profile_picture": user.profile_picture,
        "store_name": user.store.name if user.store else "Admin Store",
        "store_mobile": user.store.mobile if user.store else "N/A",
        "store_address": user.store.address if user.store else "N/A"
    }"""

text = text.replace(old_register, new_register)
text = text.replace(old_login, new_login)

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Backend/main.py', 'w', encoding='utf-8') as f:
    f.write(text)

print("main.py updated.")
