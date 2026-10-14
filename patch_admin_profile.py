import re

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/pages/Admin.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Make sure useAuth is used
if "const { user" not in text:
    text = text.replace("const [loading, setLoading] = useState(true);", "const [loading, setLoading] = useState(true);\n  const { user } = useAuth();")

old_header = """      {/* Super Admin Navbar */}
      <header className="bg-slate-900 text-white p-4 px-6 flex justify-between items-center shadow-md z-10">
        <div className="flex items-center gap-3">
          <ShieldStar weight="fill" className="text-brand text-3xl" />
          <div>
            <h1 className="font-black tracking-widest text-lg leading-none uppercase">SuperAdmin</h1>
            <p className="text-[10px] font-bold text-slate-400">Dukaan360 SaaS Management</p>
          </div>
        </div>
        <button onClick={logout} className="text-xs font-bold text-slate-300 hover:text-white bg-slate-800 px-4 py-2 rounded-lg transition">Logout</button>
      </header>"""

new_header = """      {/* Super Admin Navbar */}
      <header className="bg-slate-900 text-white p-4 px-6 flex justify-between items-center shadow-md z-10">
        <div className="flex items-center gap-3">
          <ShieldStar weight="fill" className="text-brand text-3xl" />
          <div>
            <h1 className="font-black tracking-widest text-lg leading-none uppercase">RetailX Admin</h1>
            <p className="text-[10px] font-bold text-slate-400">SaaS Management Portal</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 bg-slate-800/50 border border-slate-700 pl-3 pr-1.5 py-1.5 rounded-full">
            <div className="text-right hidden sm:block">
              <p className="font-black text-white text-sm leading-tight">{user?.name || 'Omkar'}</p>
              <div className="flex items-center justify-end gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00C853] shadow-[0_0_5px_#00C853]"></span>
                <span className="text-[10px] font-bold text-slate-400 uppercase">SuperAdmin</span>
              </div>
            </div>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#FF5722] to-[#FF8A65] flex items-center justify-center shadow-inner border border-white/10">
              <span className="text-white font-black text-lg">O</span>
            </div>
          </div>
          <button onClick={logout} className="text-xs font-bold text-slate-300 hover:text-white bg-slate-800 px-4 py-2.5 rounded-xl transition border border-slate-700 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/50">Logout</button>
        </div>
      </header>"""

text = text.replace(old_header, new_header)

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/pages/Admin.jsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Admin.jsx header patched with user profile.")
