with open('C:/Users/Omkar/Desktop/Dukaan360_Backend/main.py', 'r', encoding='utf-8') as f:
    text = f.read()

import re

upload_endpoint = """
from fastapi import UploadFile, File
import shutil
import os

@app.post("/upload/", tags=["Uploads"])
async def upload_image(file: UploadFile = File(...)):
    # Save the file to the frontend's public/uploads directory
    upload_dir = "C:/Users/Omkar/Desktop/Dukaan360_Frontend/public/uploads"
    os.makedirs(upload_dir, exist_ok=True)
    
    # Create a safe filename
    safe_filename = f"{uuid.uuid4().hex}_{file.filename.replace(' ', '_')}"
    file_path = os.path.join(upload_dir, safe_filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    # Return the public URL path
    return {"image_url": f"/uploads/{safe_filename}"}
"""

# Insert before DASHBOARD API
text = text.replace("# --- DASHBOARD API ---", upload_endpoint + "\n# --- DASHBOARD API ---")

with open('C:/Users/Omkar/Desktop/Dukaan360_Backend/main.py', 'w', encoding='utf-8') as f:
    f.write(text)

print("Upload endpoint added!")
