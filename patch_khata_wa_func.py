import re

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/pages/Khata.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

wa_func = """
  const handleWhatsAppReminder = () => {
    if (!selectedCustomer) return;
    if (!selectedCustomer.mobile || selectedCustomer.mobile.length < 10) {
      alert("Invalid mobile number for WhatsApp");
      return;
    }
    const amount = selectedCustomer.current_due.toFixed(2);
    if (amount <= 0) {
      alert("No pending dues for this customer.");
      return;
    }
    
    let msg = `नमस्कार *${selectedCustomer.name}* जी,\\n\\n`;
    msg += `तुमच्या दुकानाच्या खात्यावरील *₹${amount}* उधारी बाकी आहे.\\n`;
    msg += `कृपया लवकरात लवकर रक्कम जमा करावी ही विनंती.\\n\\n`;
    msg += `धन्यवाद!\\n- *DUKAAN360*`;

    const encodedMsg = encodeURIComponent(msg);
    // Assuming Indian numbers, prefix 91 if length is exactly 10
    const phone = selectedCustomer.mobile.length === 10 ? `91${selectedCustomer.mobile}` : selectedCustomer.mobile;
    const url = `https://wa.me/${phone}?text=${encodedMsg}`;
    window.open(url, '_blank');
  };
"""

text = text.replace("  const handlePayment = async () => {", wa_func + "\n  const handlePayment = async () => {")

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/pages/Khata.jsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Done")
