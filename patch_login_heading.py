import re

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/pages/Login.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

old_heading = """            <div className="mb-10 text-center md:text-left">
              <h2 className="text-3xl font-black text-slate-800 mb-2">Welcome Back</h2>
              <p className="text-slate-500 font-medium">Please enter your details to sign in.</p>
            </div>"""

new_heading = """            <div className="mb-10 text-center md:text-left">
              <div className="inline-block mb-2">
                <h2 className="text-4xl font-black text-slate-800 tracking-tight flex items-center gap-2 justify-center md:justify-start">
                  Welcome Back <span className="animate-waving-hand inline-block origin-bottom-right">👋</span>
                </h2>
                <div className="h-1.5 w-16 bg-gradient-to-r from-[#FF5722] to-[#FF8A65] rounded-full mt-2 mx-auto md:mx-0"></div>
              </div>
              <p className="text-slate-500 font-medium mt-2 text-[15px]">Please enter your details to access your store.</p>
              
              <style>{`
                @keyframes wave {
                  0% { transform: rotate(0.0deg) }
                  10% { transform: rotate(14.0deg) }
                  20% { transform: rotate(-8.0deg) }
                  30% { transform: rotate(14.0deg) }
                  40% { transform: rotate(-4.0deg) }
                  50% { transform: rotate(10.0deg) }
                  60% { transform: rotate(0.0deg) }
                  100% { transform: rotate(0.0deg) }
                }
                .animate-waving-hand {
                  animation: wave 2.5s infinite;
                }
              `}</style>
            </div>"""

text = text.replace(old_heading, new_heading)

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/pages/Login.jsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Login heading updated.")
