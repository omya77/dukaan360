import re

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Backend/main.py', 'r', encoding='utf-8') as f:
    text = f.read()

old_login_check = """    user = db.query(models.User).filter(models.User.mobile == form_data.username).first()
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(status_code=400, detail="Incorrect mobile or password")
        
    store_status = user.store.status.value if user.store else "Active"
    if store_status == "Pending":
        raise HTTPException(status_code=403, detail="PENDING_APPROVAL")"""

new_login_check = """    user = db.query(models.User).filter(models.User.mobile == form_data.username).first()
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(status_code=400, detail="Incorrect mobile or password")
        
    if user.store:
        # Check Expiration before logging in
        if user.store.subscription_end_date and user.store.subscription_end_date < datetime.utcnow():
            if user.store.status != models.StoreStatusEnum.EXPIRED:
                user.store.status = models.StoreStatusEnum.EXPIRED
                db.commit()
        
        store_status = user.store.status.value
        
        if store_status == "Pending":
            raise HTTPException(status_code=403, detail="PENDING_APPROVAL")
        if store_status == "Expired":
            raise HTTPException(status_code=403, detail="SUBSCRIPTION_EXPIRED")
        if store_status == "Rejected":
            raise HTTPException(status_code=403, detail="ACCOUNT_REJECTED")
    else:
        store_status = "Active" """

text = text.replace(old_login_check, new_login_check)

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Backend/main.py', 'w', encoding='utf-8') as f:
    f.write(text)

print("main.py login check patched.")
