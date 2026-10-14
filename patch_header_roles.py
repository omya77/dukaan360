import re

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/components/Header.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace the navigation links block
old_nav = """        <nav className="hidden lg:flex items-center gap-1.5 bg-slate-50 p-1.5 rounded-xl border border-slate-100">
          <Link to="/pos" className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition ${location.pathname === '/pos' ? 'bg-white text-brand shadow-sm' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'}`}>
            <Storefront weight="fill" /> POS
          </Link>
          <Link to="/inventory" className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition ${location.pathname === '/inventory' ? 'bg-white text-brand shadow-sm' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'}`}>
            <Package weight="fill" /> Stock
          </Link>
          <Link to="/khata" className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition ${location.pathname === '/khata' ? 'bg-white text-brand shadow-sm' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'}`}>
            <BookBookmark weight="fill" /> Khata
          </Link>
          <Link to="/history" className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition ${location.pathname === '/history' ? 'bg-white text-brand shadow-sm' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'}`}>
            <ClockCounterClockwise weight="fill" /> Bill History
          </Link>
        </nav>"""

new_nav = """        <nav className="hidden lg:flex items-center gap-1.5 bg-slate-50 p-1.5 rounded-xl border border-slate-100">
          <Link to="/pos" className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition ${location.pathname === '/pos' ? 'bg-white text-brand shadow-sm' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'}`}>
            <Storefront weight="fill" /> POS
          </Link>
          
          {user?.role === 'Owner' && (
            <>
              <Link to="/inventory" className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition ${location.pathname === '/inventory' ? 'bg-white text-brand shadow-sm' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'}`}>
                <Package weight="fill" /> Stock
              </Link>
              <Link to="/khata" className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition ${location.pathname === '/khata' ? 'bg-white text-brand shadow-sm' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'}`}>
                <BookBookmark weight="fill" /> Khata
              </Link>
            </>
          )}

          <Link to="/history" className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition ${location.pathname === '/history' ? 'bg-white text-brand shadow-sm' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'}`}>
            <ClockCounterClockwise weight="fill" /> Bill History
          </Link>
        </nav>"""

text = text.replace(old_nav, new_nav)

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/components/Header.jsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Header.jsx patched with Role-Based links")
