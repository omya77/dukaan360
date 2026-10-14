import re

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/components/Header.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace the navigation block with Role-based rendering
pattern = re.compile(r'<div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">.*?</Link>\s*</div>', re.DOTALL)

replacement = """<div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
           <Link to="/pos" className={`px-4 py-1.5 rounded-md text-xs font-black transition flex items-center gap-2 ${location.pathname === '/pos' ? 'bg-white text-brand shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
             <Storefront weight={location.pathname === '/pos' ? "fill" : "bold"} /> POS
           </Link>
           
           {user?.role === 'Owner' && (
             <>
               <Link to="/inventory" className={`px-4 py-1.5 rounded-md text-xs font-black transition flex items-center gap-2 ${location.pathname === '/inventory' ? 'bg-white text-brand shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                 <span className="text-base leading-none">📦</span> Stock
               </Link>
               <Link to="/khata" className={`px-4 py-1.5 rounded-md text-xs font-black transition flex items-center gap-2 ${location.pathname === '/khata' ? 'bg-white text-brand shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                 <span className="text-base leading-none">📘</span> Khata
               </Link>
             </>
           )}

           <Link to="/history" className={`px-4 py-1.5 rounded-md text-xs font-black transition flex items-center gap-2 ${location.pathname === '/history' ? 'bg-white text-brand shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
             <ClockCounterClockwise weight={location.pathname === '/history' ? "bold" : "bold"} /> Bill History
           </Link>
        </div>"""

if pattern.search(text):
    text = pattern.sub(replacement, text)
    print("Match found and replaced.")
else:
    print("WARNING: Could not find the navigation block to replace.")

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/components/Header.jsx', 'w', encoding='utf-8') as f:
    f.write(text)
