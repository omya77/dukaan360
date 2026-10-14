import re

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/pages/Dashboard.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

old_header = """            <div className="flex justify-between items-end mb-6">
              <div>
                <h1 className="text-2xl font-black text-slate-800">Store Dashboard</h1>
                <p className="text-slate-500 font-medium text-sm">Overview of your retail business</p>
              </div>
              
              <Link to="/pos" className="bg-brand hover:bg-brandHover text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-[0_4px_15px_rgba(255,87,34,0.3)] transition transform active:scale-95">
                <Storefront weight="fill" className="text-lg" /> Go to POS
              </Link>
            </div>"""

new_header = """            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-black text-slate-800">Store Dashboard</h1>
                <p className="text-slate-500 font-medium text-sm">Overview of your retail business</p>
              </div>
              
              <div className="flex flex-wrap items-center gap-2">
                <button onClick={() => setIsTallyModalOpen(true)} className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-sm transition transform active:scale-95 text-sm">
                  <Calculator weight="fill" className="text-brand text-lg" /> गल्ला मोजा
                </button>
                <button onClick={handleEndOfDayReport} className="bg-[#25D366] hover:bg-[#128C7E] text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-[0_4px_15px_rgba(37,211,102,0.3)] transition transform active:scale-95 text-sm">
                  <WhatsappLogo weight="fill" className="text-lg" /> गल्ला बंद
                </button>
                <Link to="/pos" className="bg-brand hover:bg-brandHover text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-[0_4px_15px_rgba(255,87,34,0.3)] transition transform active:scale-95 text-sm">
                  <Storefront weight="fill" className="text-lg" /> Go to POS
                </Link>
              </div>
            </div>"""

text = text.replace(old_header, new_header)

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/pages/Dashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Dashboard header updated.")
