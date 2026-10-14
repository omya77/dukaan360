import re

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/pages/Admin.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Add WhatsappLogo to imports
if "WhatsappLogo" not in text:
    text = text.replace("import { Storefront, ShieldStar, CheckCircle, XCircle, Phone, Calendar } from '@phosphor-icons/react';", "import { Storefront, ShieldStar, CheckCircle, XCircle, Phone, Calendar, WhatsappLogo } from '@phosphor-icons/react';")

# Add handleRequestPayment function
if "handleRequestPayment" not in text:
    func_text = """  const handleApprove = async (id) => {"""
    new_func = """  const handleRequestPayment = (store) => {
    let amount = 'Free';
    if (store.plan_type === '3 Months') amount = '₹999';
    if (store.plan_type === '6 Months') amount = '₹1799';
    if (store.plan_type === '1 Year') amount = '₹2999';

    const msg = `Namaskar *${store.owner_name}*! 🙏

Welcome to *RetailX* (SaaS).
Your registration for *${store.name}* is received.

You have selected the *${store.plan_type}* plan.
To activate your software account, please pay *${amount}* via UPI.

Once you pay, reply to this message with a screenshot, and I will activate your account instantly! 🚀`;

    const encodedMsg = encodeURIComponent(msg);
    window.open(`https://wa.me/91${store.mobile}?text=${encodedMsg}`, '_blank');
  };

  const handleApprove = async (id) => {"""
    text = text.replace(func_text, new_func)

# Replace buttons in Pending status
old_buttons = """                {store.status === 'Pending' && (
                  <div className="flex gap-2 border-t border-slate-100 pt-4">
                    <button onClick={() => handleReject(store.id)} className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl transition text-sm">
                      <XCircle weight="fill" className="text-lg" /> Reject
                    </button>
                    <button onClick={() => handleApprove(store.id)} className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl transition shadow-[0_4px_10px_rgba(34,197,94,0.3)] text-sm">
                      <CheckCircle weight="fill" className="text-lg" /> Approve
                    </button>
                  </div>
                )}"""

new_buttons = """                {store.status === 'Pending' && (
                  <div className="flex flex-col gap-2 border-t border-slate-100 pt-4">
                    <button onClick={() => handleRequestPayment(store)} className="w-full flex items-center justify-center gap-2 py-2 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] font-bold rounded-xl transition text-sm">
                      <WhatsappLogo weight="fill" className="text-xl" /> Ask for Payment (WhatsApp)
                    </button>
                    <div className="flex gap-2">
                      <button onClick={() => handleReject(store.id)} className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl transition text-sm">
                        <XCircle weight="fill" className="text-lg" /> Reject
                      </button>
                      <button onClick={() => handleApprove(store.id)} className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-brand hover:bg-brandHover text-white font-bold rounded-xl transition shadow-[0_4px_10px_rgba(255,87,34,0.3)] text-sm">
                        <CheckCircle weight="fill" className="text-lg" /> Approve
                      </button>
                    </div>
                  </div>
                )}"""

text = text.replace(old_buttons, new_buttons)

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/pages/Admin.jsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Admin.jsx patched with WhatsApp Payment request.")
