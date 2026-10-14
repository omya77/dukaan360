import re

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Backend/main.py', 'r', encoding='utf-8') as f:
    text = f.read()

old_admin_seed = """    # SuperAdmin Seed check
    if form_data.username == "admin" and form_data.password == "admin123":
        admin = db.query(models.User).filter(models.User.role == models.RoleEnum.SUPERADMIN).first()
        if not admin:
            admin = models.User(name="Omkar Admin", mobile="admin", password_hash=get_password_hash("admin123"), role=models.RoleEnum.SUPERADMIN)"""

new_admin_seed = """    # SuperAdmin Seed check
    if form_data.username == "9999999999" and form_data.password == "admin123":
        admin = db.query(models.User).filter(models.User.role == models.RoleEnum.SUPERADMIN).first()
        if not admin:
            admin = models.User(name="Omkar Admin", mobile="9999999999", password_hash=get_password_hash("admin123"), role=models.RoleEnum.SUPERADMIN)"""

text = text.replace(old_admin_seed, new_admin_seed)

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Backend/main.py', 'w', encoding='utf-8') as f:
    f.write(text)

print("SuperAdmin mobile number changed to 9999999999.")
