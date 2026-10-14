import re

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/components/Header.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Make sure axios and useState/useEffect are imported
if "import axios from 'axios';" not in text:
    text = text.replace("import React from 'react';", "import React, { useState, useEffect } from 'react';\nimport axios from 'axios';")
elif "useState" not in text:
    text = text.replace("import React from 'react';", "import React, { useState, useEffect } from 'react';")

# Add the notifications state inside the Header component
state_code = """const Header = ({ onMenuClick, searchTerm, onSearch }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const res = await axios.get('http://localhost:8000/notifications/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setNotifications(res.data);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      }
    };
    
    // Initial fetch
    fetchNotifications();
    
    // Poll every 5 minutes for real-time updates
    const interval = setInterval(fetchNotifications, 300000);
    return () => clearInterval(interval);
  }, []);
"""

text = re.sub(r'const Header = \(\{.*?\) => \{[\s\n]*const location = useLocation\(\);[\s\n]*const navigate = useNavigate\(\);[\s\n]*const \{ user, logout \} = useAuth\(\);', state_code, text)

# Replace the bell icon with the dropdown UI
old_bell = """        <button onClick={() => alert('No new notifications')} className="relative w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 text-slate-500 hover:bg-slate-100 transition border border-slate-200">
          <Bell weight="bold" />
        </button>"""

new_bell = """        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)} 
            className="relative w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 text-slate-500 hover:bg-slate-100 transition border border-slate-200"
          >
            <Bell weight="bold" />
            {notifications.length > 0 && (
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full animate-pulse"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 lg:w-80 bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden z-50">
              <div className="p-3 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                <h3 className="text-sm font-black text-slate-800">Notifications</h3>
                <span className="text-[10px] font-bold bg-brand text-white px-2 py-0.5 rounded-full">{notifications.length} New</span>
              </div>
              <div className="max-h-80 overflow-y-auto custom-scrollbar">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-slate-400">
                    <Bell weight="fill" className="text-3xl mx-auto mb-2 opacity-50" />
                    <p className="text-xs font-bold">No new notifications</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-50">
                    {notifications.map(notif => (
                      <div key={notif.id} className="p-3 hover:bg-slate-50 transition cursor-pointer flex gap-3">
                        <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${notif.type === 'DANGER' ? 'bg-red-500' : 'bg-orange-500'}`}></div>
                        <div>
                          <p className="text-xs font-bold text-slate-800 leading-tight mb-0.5">{notif.title}</p>
                          <p className="text-[10px] text-slate-500 font-medium leading-snug">{notif.message}</p>
                          <p className="text-[9px] text-slate-400 mt-1">{new Date(notif.timestamp).toLocaleString('en-IN', {hour: '2-digit', minute:'2-digit', day:'2-digit', month:'short'})}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>"""

text = text.replace(old_bell, new_bell)

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/components/Header.jsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Header patched with real Notification UI")
