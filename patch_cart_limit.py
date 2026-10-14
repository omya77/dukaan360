import re

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/components/Cart.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Add Warning Icons
if "WarningCircle" not in text:
    text = text.replace("UserCircle, X, Minus, Plus, Money, QrCode, BookBookmark, ArrowRight, CaretUp", "UserCircle, X, Minus, Plus, Money, QrCode, BookBookmark, ArrowRight, CaretUp, WarningCircle")

# Calculate if credit limit exceeded
if "const isLimitExceeded" not in text:
    text = text.replace("const totalItems = cartItems.reduce((sum, item) => sum + (parseFloat(item.quantity) || 0), 0);", "const totalItems = cartItems.reduce((sum, item) => sum + (parseFloat(item.quantity) || 0), 0);\n\n  const selectedCust = customers.find(c => c.id === selectedCustomerId);\n  const isLimitExceeded = selectedCust && (selectedCust.current_due + total > 5000);")

# Add the UI box
warning_ui = """              </button>
            </div>
            
            {isLimitExceeded && (
              <div className="mb-3 bg-red-50 border border-red-200 rounded-xl p-2.5 flex gap-2 animate-pulse">
                <WarningCircle weight="fill" className="text-red-500 text-2xl shrink-0" />
                <div>
                  <p className="text-[11px] font-black text-red-600 leading-tight">उधारीची मर्यादा (₹5000) संपली आहे!</p>
                  <p className="text-[9px] font-bold text-red-500/80 mt-0.5 leading-tight">बाकी: ₹{selectedCust.current_due.toFixed(2)} + हे बिल: ₹{total.toFixed(2)}</p>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-3 gap-1.5 lg:gap-2 mb-3">"""

text = text.replace("""              </button>
            </div>
            <div className="grid grid-cols-3 gap-1.5 lg:gap-2 mb-3">""", warning_ui)

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/components/Cart.jsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Cart updated.")
