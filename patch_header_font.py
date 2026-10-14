import re

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/components/Header.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

old_logo_ui = """        <Link to="/pos" className="flex items-center gap-2 text-brand">
          <Storefront weight="fill" className="text-2xl" />
          <h1 className="font-black text-lg hidden sm:block tracking-tight">{user?.store_name || "Dukaan360"}</h1>
        </Link>"""

new_logo_ui = """        <Link to="/pos" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand to-orange-400 flex items-center justify-center text-white shadow-lg shadow-brand/20 group-hover:scale-105 transition-transform">
            <Storefront weight="fill" className="text-[20px]" />
          </div>
          <h1 className="font-extrabold text-xl lg:text-2xl hidden sm:block tracking-tight bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent drop-shadow-sm group-hover:from-brand group-hover:to-orange-500 transition-all duration-300">
            {user?.store_name || "Store Name"}
          </h1>
        </Link>"""

text = text.replace(old_logo_ui, new_logo_ui)

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/components/Header.jsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Store name font style made highly attractive")
