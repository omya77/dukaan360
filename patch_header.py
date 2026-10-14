import re

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/components/Header.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Ensure imports
if "useAuth" not in text:
    text = text.replace("import { Link } from 'react-router-dom';", "import { Link } from 'react-router-dom';\nimport { useAuth } from '../contexts/AuthContext';\nimport { SignOut } from '@phosphor-icons/react';")

# Ensure user variable
if "const { user, logout } = useAuth();" not in text:
    text = text.replace("const Header = ({ onMenuClick }) => {\n  const [isRecentBillsOpen, setIsRecentBillsOpen] = useState(false);", "const Header = ({ onMenuClick }) => {\n  const [isRecentBillsOpen, setIsRecentBillsOpen] = useState(false);\n  const { user, logout } = useAuth();\n  const userName = user?.name || 'User';\n  const avatarLetter = userName.charAt(0).toUpperCase();\n  const storeName = user?.store_name || 'RetailX';")

# Find the user info section to replace
old_user_section = """      {/* User Info */}
      <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 pl-3 pr-1.5 py-1.5 rounded-full shadow-sm hover:shadow-md transition cursor-pointer">
        <div className="text-right hidden sm:block">
          <p className="font-black text-slate-800 text-sm leading-tight">Omkar</p>
          <div className="flex items-center justify-end gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00C853] shadow-[0_0_5px_#00C853]"></span>
            <span className="text-[10px] font-bold text-slate-500 uppercase">Online</span>
          </div>
        </div>
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand to-brandHover flex items-center justify-center shadow-inner">
          <span className="text-white font-black text-lg">O</span>
        </div>
      </div>"""

new_user_section = """      {/* User Info & Logout */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 pl-3 pr-1.5 py-1.5 rounded-full shadow-sm hover:shadow-md transition cursor-pointer">
          <div className="text-right hidden sm:block">
            <p className="font-black text-slate-800 text-sm leading-tight truncate max-w-[100px]">{userName}</p>
            <div className="flex items-center justify-end gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00C853] shadow-[0_0_5px_#00C853]"></span>
              <span className="text-[10px] font-bold text-slate-500 uppercase">Online</span>
            </div>
          </div>
          {user?.profile_picture ? (
            <img src={user.profile_picture} alt="Profile" className="w-9 h-9 rounded-full object-cover border border-slate-200 shadow-inner" />
          ) : (
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand to-brandHover flex items-center justify-center shadow-inner">
              <span className="text-white font-black text-lg">{avatarLetter}</span>
            </div>
          )}
        </div>
        <button onClick={logout} className="w-9 h-9 flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-500 border border-red-100 rounded-full transition shadow-sm" title="Logout">
          <SignOut weight="bold" className="text-xl" />
        </button>
      </div>"""

# Replace the DUKAAN360 logo with RetailX / StoreName
text = text.replace('<span className="hidden sm:inline">DUKAAN<span className="text-slate-800">360</span></span>', '<span className="hidden sm:inline">{storeName}</span>')

if old_user_section in text:
    text = text.replace(old_user_section, new_user_section)
else:
    # try regex
    pattern = re.compile(r"{/\* User Info \*/}.*?</div>\s*</div>", re.DOTALL)
    text = pattern.sub(new_user_section, text)

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/components/Header.jsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Header.jsx updated.")
