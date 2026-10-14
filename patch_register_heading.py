import re

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/pages/Register.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

old_heading = """            <div className="mb-6 text-center md:text-left">
              <h2 className="text-2xl font-black text-slate-800 mb-1">Create Account</h2>
              <p className="text-slate-500 font-medium text-sm">Join the fastest growing retail network.</p>
            </div>"""

new_heading = """            <div className="mb-6 text-center md:text-left">
              <div className="inline-block mb-1">
                <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-2 justify-center md:justify-start">
                  Create Account <span className="animate-bounce-slow inline-block">🚀</span>
                </h2>
                <div className="h-1.5 w-16 bg-gradient-to-r from-[#FF5722] to-[#FF8A65] rounded-full mt-1.5 mx-auto md:mx-0"></div>
              </div>
              <p className="text-slate-500 font-medium text-[13px] mt-1.5">Join the fastest growing retail network in India.</p>
              
              <style>{`
                @keyframes bounce-slow {
                  0%, 100% { transform: translateY(-5%); }
                  50% { transform: translateY(5%); }
                }
                .animate-bounce-slow {
                  animation: bounce-slow 2s infinite ease-in-out;
                }
              `}</style>
            </div>"""

text = text.replace(old_heading, new_heading)

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/pages/Register.jsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Register heading updated.")
