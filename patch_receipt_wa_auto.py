import re

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/components/ReceiptModal.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Update handleWhatsAppShare
old_wa_logic = """  const handleWhatsAppShare = () => {
    if (!waNumber || waNumber.length !== 10 || !/^\\d{10}$/.test(waNumber)) {
      alert("Please enter a valid 10-digit mobile number!");
      return;
    }"""

new_wa_logic = """  const handleWhatsAppShare = () => {
    let finalNumber = waNumber;
    
    // If we already have the customer's mobile and haven't opened the manual input
    if (invoice.customer_mobile && !showWaInput) {
      finalNumber = invoice.customer_mobile;
    } else {
      if (!waNumber || waNumber.length < 10) {
        alert("Please enter a valid 10-digit mobile number!");
        return;
      }
    }"""
text = text.replace(old_wa_logic, new_wa_logic)

old_wa_url = """    const waUrl = `https://wa.me/91${waNumber}?text=${encodedMsg}`;"""
new_wa_url = """    // Check if it's already a 91 prefixed number or 10 digits
    const formattedNumber = finalNumber.length === 10 ? `91${finalNumber}` : finalNumber;
    const waUrl = `https://wa.me/${formattedNumber}?text=${encodedMsg}`;"""
text = text.replace(old_wa_url, new_wa_url)

# Update UI Button
old_wa_btn_ui = """            {showWaInput ? (
              <div className="flex gap-2">
                <input 
                  type="tel" 
                  maxLength={10}
                  placeholder="Enter 10-digit mobile..." 
                  value={waNumber} 
                  onChange={e => setWaNumber(e.target.value)}
                  className="flex-1 h-12 border-2 border-green-500 rounded-xl px-4 focus:outline-none focus:ring-4 focus:ring-green-500/20 text-sm font-bold bg-green-50/30"
                />
                <button 
                  onClick={handleWhatsAppShare}
                  className="h-12 px-6 bg-green-500 text-white rounded-xl font-bold shadow-lg shadow-green-500/30 hover:bg-green-600 transition shrink-0"
                >
                  Send
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setShowWaInput(true)}
                className="flex-1 py-3 bg-green-50 text-green-600 hover:bg-green-100 rounded-xl font-bold transition flex items-center justify-center gap-2 border border-green-200"
              >
                <WhatsappLogo weight="fill" className="text-xl" /> WhatsApp
              </button>
            )}"""

new_wa_btn_ui = """            {showWaInput ? (
              <div className="flex gap-2">
                <input 
                  type="tel" 
                  maxLength={10}
                  placeholder="Enter 10-digit mobile..." 
                  value={waNumber} 
                  onChange={e => setWaNumber(e.target.value)}
                  className="flex-1 h-12 border-2 border-green-500 rounded-xl px-4 focus:outline-none focus:ring-4 focus:ring-green-500/20 text-sm font-bold bg-green-50/30"
                />
                <button 
                  onClick={handleWhatsAppShare}
                  className="h-12 px-6 bg-green-500 text-white rounded-xl font-bold shadow-lg shadow-green-500/30 hover:bg-green-600 transition shrink-0"
                >
                  Send
                </button>
              </div>
            ) : invoice.customer_mobile ? (
              <button 
                onClick={handleWhatsAppShare}
                className="flex-1 py-3 bg-green-500 text-white hover:bg-green-600 rounded-xl font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-green-500/30"
              >
                <WhatsappLogo weight="fill" className="text-xl" /> Send to {invoice.customer_name?.split(' ')[0]}
              </button>
            ) : (
              <button 
                onClick={() => setShowWaInput(true)}
                className="flex-1 py-3 bg-green-50 text-green-600 hover:bg-green-100 rounded-xl font-bold transition flex items-center justify-center gap-2 border border-green-200"
              >
                <WhatsappLogo weight="fill" className="text-xl" /> WhatsApp
              </button>
            )}"""
text = text.replace(old_wa_btn_ui, new_wa_btn_ui)

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/components/ReceiptModal.jsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Done")
