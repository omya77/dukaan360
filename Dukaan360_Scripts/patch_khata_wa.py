import re

with open('C:/Users/Omkar/Desktop/Dukaan360_Frontend/src/pages/Khata.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Add WhatsappLogo to imports
text = text.replace(
    "import { User, Phone, Money, ArrowRight, BookBookmark, CaretLeft } from '@phosphor-icons/react';",
    "import { User, Phone, Money, ArrowRight, BookBookmark, CaretLeft, WhatsappLogo } from '@phosphor-icons/react';"
)

# 2. Add handleWhatsAppReminder function
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
    
    let msg = `नमस्कार *${selectedCustomer.name}* जी,\n\n`;
    msg += `तुमच्या दुकानाच्या खात्यावरील *₹${amount}* उधारी बाकी आहे.\n`;
    msg += `कृपया लवकरात लवकर रक्कम जमा करावी ही विनंती.\n\n`;
    msg += `धन्यवाद!\n- *DUKAAN360*`;

    const encodedMsg = encodeURIComponent(msg);
    // Assuming Indian numbers, prefix 91 if length is exactly 10
    const phone = selectedCustomer.mobile.length === 10 ? `91${selectedCustomer.mobile}` : selectedCustomer.mobile;
    const url = `https://wa.me/${phone}?text=${encodedMsg}`;
    window.open(url, '_blank');
  };
"""
text = text.replace("  const handleAddPayment = async (e) => {", wa_func + "\n  const handleAddPayment = async (e) => {")

# 3. Add the WhatsApp button to the Customer Details header
old_phone_row = """                    <div className="flex items-center gap-4 text-sm font-medium text-slate-500">
                      <span className="flex items-center gap-1"><Phone weight="fill" /> {selectedCustomer.mobile}</span>
                    </div>"""

new_phone_row = """                    <div className="flex items-center gap-4 text-sm font-medium text-slate-500">
                      <span className="flex items-center gap-1"><Phone weight="fill" /> {selectedCustomer.mobile}</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={handleWhatsAppReminder}
                  disabled={selectedCustomer.current_due <= 0}
                  className="flex items-center gap-2 bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700 px-3 py-1.5 lg:px-4 lg:py-2 rounded-xl text-xs lg:text-sm font-bold transition disabled:opacity-50 disabled:cursor-not-allowed border border-green-200 shadow-sm"
                >
                  <WhatsappLogo weight="fill" className="text-lg lg:text-xl" />
                  <span className="hidden sm:inline">Send Reminder</span>
                  <span className="sm:hidden">Remind</span>
                </button>
              </div>"""

# Wait, the structure in Khata is:
# <div className="flex items-start lg:items-center gap-3">
#   <button>Back</button>
#   <div>
#     <h2>Name</h2>
#     <div flex gap-4 text-sm>...Phone...</div>
#   </div>
# </div>
# I need to replace the entire wrapper to add the button correctly aligned to the right.

old_header_block = """                {/* Header Info */}
                <div className="p-4 lg:p-6 border-b border-slate-100 flex justify-between items-start">
                  <div className="flex items-start lg:items-center gap-3">
                    <button onClick={() => setSelectedCustomer(null)} className="lg:hidden mt-0.5 w-8 h-8 shrink-0 flex items-center justify-center bg-slate-100 rounded-full text-slate-600 hover:bg-slate-200">
                      <CaretLeft weight="bold" />
                    </button>
                  <div>
                    <h2 className="text-xl lg:text-2xl font-black text-slate-800 mb-1">{selectedCustomer.name}</h2>
                    <div className="flex items-center gap-4 text-sm font-medium text-slate-500">
                      <span className="flex items-center gap-1"><Phone weight="fill" /> {selectedCustomer.mobile}</span>
                    </div>
                  </div>"""
                  
new_header_block = """                {/* Header Info */}
                <div className="p-4 lg:p-6 border-b border-slate-100 flex justify-between items-start lg:items-center">
                  <div className="flex items-start lg:items-center gap-3">
                    <button onClick={() => setSelectedCustomer(null)} className="lg:hidden mt-0.5 w-8 h-8 shrink-0 flex items-center justify-center bg-slate-100 rounded-full text-slate-600 hover:bg-slate-200">
                      <CaretLeft weight="bold" />
                    </button>
                    <div>
                      <h2 className="text-xl lg:text-2xl font-black text-slate-800 mb-1">{selectedCustomer.name}</h2>
                      <div className="flex items-center gap-4 text-sm font-medium text-slate-500">
                        <span className="flex items-center gap-1"><Phone weight="fill" /> {selectedCustomer.mobile}</span>
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={handleWhatsAppReminder}
                    disabled={selectedCustomer.current_due <= 0}
                    className="flex items-center gap-1.5 lg:gap-2 bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700 px-3 py-1.5 lg:px-4 lg:py-2 rounded-xl text-xs lg:text-sm font-bold transition disabled:opacity-50 disabled:cursor-not-allowed border border-green-200 shadow-sm shrink-0"
                  >
                    <WhatsappLogo weight="fill" className="text-base lg:text-xl" />
                    <span className="hidden sm:inline">WhatsApp Remind</span>
                  </button>"""

text = text.replace(old_header_block, new_header_block)

with open('C:/Users/Omkar/Desktop/Dukaan360_Frontend/src/pages/Khata.jsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Done")
