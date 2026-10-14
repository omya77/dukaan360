import re

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/pages/Admin.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

old_button = """                  {store.status?.toLowerCase() === 'pending' && (
                    <div className="flex flex-col gap-2 border-t border-slate-100 pt-4">
                      <button onClick={() => handleRequestPayment(store)} className="w-full flex items-center justify-center gap-2 py-2 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] font-bold rounded-xl transition text-sm">
                        <WhatsappLogo weight="fill" className="text-xl" /> Ask for Payment (WhatsApp)
                      </button>"""

new_button = """                  {store.status?.toLowerCase() === 'pending' && (
                    <div className="flex flex-col gap-2 border-t border-slate-100 pt-4">
                      {store.plan_type !== '1 Month' && (
                        <button onClick={() => handleRequestPayment(store)} className="w-full flex items-center justify-center gap-2 py-2 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] font-bold rounded-xl transition text-sm">
                          <WhatsappLogo weight="fill" className="text-xl" /> Ask for Payment (WhatsApp)
                        </button>
                      )}"""

text = text.replace(old_button, new_button)

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/pages/Admin.jsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Admin.jsx patched for payment button.")
