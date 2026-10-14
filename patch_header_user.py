import re

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/components/Header.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Fix the user name and avatar initial
old_user_ui = """        <div className="flex items-center gap-2 cursor-pointer group" onClick={() => navigate('/admin')}>
          <div className="text-right hidden xl:block">
            <p className="text-xs font-black text-slate-800 leading-none">{user?.username || "Admin"}</p>
            <p className="text-[10px] font-bold text-emerald-600 flex items-center justify-end gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Online
            </p>
          </div>
          <div className="w-8 h-8 bg-gradient-to-tr from-brand to-orange-400 rounded-full flex items-center justify-center text-white font-black shadow-sm group-hover:ring-2 ring-brand/30 transition">
            {user?.username ? user.username.charAt(0).toUpperCase() : "O"}
          </div>
        </div>"""

new_user_ui = """        <div className="flex items-center gap-2 cursor-pointer group" onClick={() => navigate('/admin')}>
          <div className="text-right hidden xl:block">
            <p className="text-xs font-black text-slate-800 leading-none">{user?.name || user?.owner_name || "User"}</p>
            <p className="text-[10px] font-bold text-emerald-600 flex items-center justify-end gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Online
            </p>
          </div>
          <div className="w-8 h-8 bg-gradient-to-tr from-brand to-orange-400 rounded-full flex items-center justify-center text-white font-black shadow-sm group-hover:ring-2 ring-brand/30 transition">
            {user?.name ? user.name.charAt(0).toUpperCase() : (user?.owner_name ? user.owner_name.charAt(0).toUpperCase() : "U")}
          </div>
        </div>"""

text = text.replace(old_user_ui, new_user_ui)

# Fix the bell (make it clickable and remove fake red dot)
old_bell = """        <button className="relative w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 text-slate-500 hover:bg-slate-100 transition border border-slate-200">
          <Bell weight="bold" />
          <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
        </button>"""

new_bell = """        <button onClick={() => alert('No new notifications')} className="relative w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 text-slate-500 hover:bg-slate-100 transition border border-slate-200">
          <Bell weight="bold" />
        </button>"""

text = text.replace(old_bell, new_bell)

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/components/Header.jsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Header.jsx user details and bell fixed.")
