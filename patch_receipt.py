import re

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/components/ReceiptModal.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Add useAuth
if "useAuth" not in text:
    text = text.replace("import React, { useRef, useState } from 'react';", "import React, { useRef, useState } from 'react';\nimport { useAuth } from '../contexts/AuthContext';")

# Add user extraction
if "const { user } = useAuth();" not in text:
    text = text.replace("const [waNumber, setWaNumber] = useState('');", "const [waNumber, setWaNumber] = useState('');\n  const { user } = useAuth();\n  const storeName = user?.store_name || 'RetailX Store';\n  const storeAddress = user?.store_address || 'Address not provided';\n  const storeMobile = user?.store_mobile || '9999999999';\n  const cashierName = user?.name || 'Cashier';")

# Patch Print version
text = text.replace(">DUKAAN360</h2>", ">${storeName.toUpperCase()}</h2>")
text = text.replace(">PREMIUM RETAIL STORE</p>", "></p>")
text = text.replace(">Main Market Road, Pune</p>", ">${storeAddress}</p>")
text = text.replace(">Ph: 9876543210</p>", ">Ph: ${storeMobile}</p>")
text = text.replace("<strong>Omkar</strong>", "<strong>${cashierName}</strong>")

# Patch DOM version
text = text.replace("DUKAAN360", "{storeName.toUpperCase()}")
text = text.replace("PREMIUM RETAIL STORE", "")
text = text.replace("Main Market Road, Pune", "{storeAddress}")
text = text.replace("Ph: 9876543210", "Ph: {storeMobile}")
text = text.replace('<p className="font-bold">Omkar</p>', '<p className="font-bold">{cashierName}</p>')

# Also handle WhatsApp sharing message to use storeName
text = text.replace("Greetings from *DUKAAN360*", "Greetings from *{storeName}*")

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/components/ReceiptModal.jsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("ReceiptModal patched.")
