import re

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/components/Header.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

full_modal = """
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
      )}
"""

text = re.sub(r'</>\s*\);\s*\}\s*;\s*export default Header;', full_modal + '\n</>\n  );\n};\n\nexport default Header;', text)

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/components/Header.jsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Modal inserted successfully")
