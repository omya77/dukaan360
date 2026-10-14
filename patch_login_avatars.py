import re

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/pages/Login.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

old_avatars = """            <div className="flex -space-x-3">
              <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-200"></div>
              <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-300"></div>
              <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-400"></div>
            </div>"""

new_avatars = """            <div className="flex -space-x-3">
              <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="User 1" className="w-10 h-10 rounded-full border-2 border-slate-900 object-cover" />
              <img src="https://randomuser.me/api/portraits/men/45.jpg" alt="User 2" className="w-10 h-10 rounded-full border-2 border-slate-900 object-cover" />
              <img src="https://randomuser.me/api/portraits/men/61.jpg" alt="User 3" className="w-10 h-10 rounded-full border-2 border-slate-900 object-cover" />
            </div>"""

text = text.replace(old_avatars, new_avatars)

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/pages/Login.jsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Login avatars updated.")
