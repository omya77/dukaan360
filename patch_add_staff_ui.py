import re

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/components/Header.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Add states for Profile Menu and Add Staff Modal
if "showProfileMenu" not in text:
    text = text.replace("const [showNotifications, setShowNotifications] = useState(false);", 
                        "const [showNotifications, setShowNotifications] = useState(false);\n  const [showProfileMenu, setShowProfileMenu] = useState(false);\n  const [showAddStaff, setShowAddStaff] = useState(false);\n  const [staffData, setStaffData] = useState({ name: '', mobile: '', password: '' });")

# Add function to handle staff creation
if "handleAddStaff" not in text:
    staff_func = """
  const handleAddStaff = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('saas_token');
      await axios.post('http://localhost:8000/staff/', staffData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Staff account created successfully!');
      setShowAddStaff(false);
      setStaffData({ name: '', mobile: '', password: '' });
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to create staff');
    }
  };
"""
    text = text.replace("return (", staff_func + "\n  return (")

# Replace onClick navigate('/admin') with profile menu toggle
old_profile = """<div className="flex items-center gap-2 cursor-pointer group" onClick={() => navigate('/admin')}>"""
new_profile = """<div className="relative">
          <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setShowProfileMenu(!showProfileMenu)}>"""
text = text.replace(old_profile, new_profile)

# Add the dropdown menu and modal HTML after the profile div
# The existing profile ends with:
#           <div className="w-8 h-8 ...">
#             {...}
#           </div>
#         </div>

dropdown_html = """
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden z-50 py-1">
              <div className="px-4 py-2 border-b border-slate-50 mb-1">
                <p className="text-xs font-bold text-slate-800">{user?.name}</p>
                <p className="text-[10px] text-slate-500">{user?.role}</p>
              </div>
              
              {user?.role === 'Owner' && (
                <button onClick={() => { setShowAddStaff(true); setShowProfileMenu(false); }} className="w-full text-left px-4 py-2 text-sm font-medium text-slate-700 hover:bg-brand hover:text-white transition">
                  👤 Add Staff (Cashier)
                </button>
              )}
              
              <button onClick={() => { logout(); navigate('/login'); }} className="w-full text-left px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition">
                🚪 Logout
              </button>
            </div>
          )}
        </div>

        {/* Add Staff Modal */}
        {showAddStaff && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-brand to-orange-400 p-4 flex justify-between items-center text-white">
                <h3 className="font-bold text-lg">Create Cashier Login</h3>
                <button onClick={() => setShowAddStaff(false)} className="text-white/80 hover:text-white"><X weight="bold" /></button>
              </div>
              <form onSubmit={handleAddStaff} className="p-5 flex flex-col gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1 block">Staff Name</label>
                  <input type="text" required value={staffData.name} onChange={e => setStaffData({...staffData, name: e.target.value})} className="w-full h-10 border border-slate-200 rounded-lg px-3 text-sm font-medium outline-none focus:border-brand" placeholder="e.g. Ramesh" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1 block">Mobile Number (Login ID)</label>
                  <input type="tel" required pattern="[0-9]{10}" value={staffData.mobile} onChange={e => setStaffData({...staffData, mobile: e.target.value})} className="w-full h-10 border border-slate-200 rounded-lg px-3 text-sm font-medium outline-none focus:border-brand" placeholder="10-digit number" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1 block">Password</label>
                  <input type="password" required value={staffData.password} onChange={e => setStaffData({...staffData, password: e.target.value})} className="w-full h-10 border border-slate-200 rounded-lg px-3 text-sm font-medium outline-none focus:border-brand" placeholder="Set a password" />
                </div>
                <button type="submit" className="w-full h-10 bg-brand hover:bg-brandHover text-white rounded-lg font-bold mt-2 transition">Create Account</button>
              </form>
            </div>
          </div>
        )}"""

text = re.sub(r'<div className="w-8 h-8 bg-gradient-to-tr.*?\n.*?\n\s*</div>\n\s*</div>', lambda m: m.group(0) + dropdown_html, text, count=1)

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/components/Header.jsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Header.jsx patched with Add Staff UI")
