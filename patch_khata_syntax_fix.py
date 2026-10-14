import re

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/pages/Khata.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

# We need to fix the extra </div>.
# The current code looks like:
#                   <span className="hidden sm:inline">WhatsApp Remind</span>
#                 </button>
#               </div>
#               
#               <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-right min-w-[200px]">

# We should remove that extra `</div>` right before the Total Due Balance div.

pattern = """                  <span className="hidden sm:inline">WhatsApp Remind</span>
                  </button>
                </div>
                
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-right min-w-[200px]">"""

replacement = """                  <span className="hidden sm:inline">WhatsApp Remind</span>
                  </button>
                
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-right min-w-[200px]">"""

text = text.replace(pattern, replacement)

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/pages/Khata.jsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Done")
