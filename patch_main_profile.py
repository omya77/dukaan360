import re

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Backend/main.py', 'r', encoding='utf-8') as f:
    text = f.read()

# Add the endpoint after the admin_router is defined
if "@admin_router.put(\"/profile\")" not in text:
    old_router = """admin_router = APIRouter(prefix="/admin", tags=["Admin"], dependencies=[Depends(get_super_admin)])"""
    new_router = """admin_router = APIRouter(prefix="/admin", tags=["Admin"], dependencies=[Depends(get_super_admin)])

@admin_router.put("/profile")
def update_admin_profile(req: schemas.ProfileUpdate, db: Session = Depends(get_db), current_admin: models.User = Depends(get_current_active_user)):
    # Verify it's actually the superadmin
    if current_admin.role != models.RoleEnum.SUPERADMIN:
        raise HTTPException(status_code=403, detail="Not a SuperAdmin")
    
    current_admin.name = req.name
    if req.profile_picture:
        current_admin.profile_picture = req.profile_picture
    
    db.commit()
    db.refresh(current_admin)
    return {"message": "Profile updated", "name": current_admin.name, "profile_picture": current_admin.profile_picture}"""

    text = text.replace(old_router, new_router)
    with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Backend/main.py', 'w', encoding='utf-8') as f:
        f.write(text)
    print("main.py patched with /profile endpoint.")
else:
    print("Already patched.")
