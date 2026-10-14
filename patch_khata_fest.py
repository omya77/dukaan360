import re

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/pages/Khata.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Add states
if "isFestModalOpen" not in text:
    text = text.replace("const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);", "const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);\n  const [isFestModalOpen, setIsFestModalOpen] = useState(false);\n  const [festIndex, setFestIndex] = useState(0);\n  const [festMsg, setFestMsg] = useState('🙏 सस्नेह नमस्कार!\\n\\nदिवाळीच्या तुम्हाला आणि तुमच्या परिवाराला हार्दिक शुभेच्छा! ✨\\n\\nआपले नम्र,\\n*Dukaan360 Retail*');")

# Add Button
old_btn_group = """                <div className="flex gap-2">
                  <button 
                    onClick={() => { setBulkIndex(0); setIsBulkModalOpen(true); }}
                    className="bg-[#25D366] text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-[#128C7E] transition shadow-[0_2px_10px_rgba(37,211,102,0.3)] flex items-center gap-1"
                    title="Send monthly reminders to everyone"
                  >
                    <WhatsappLogo weight="fill" className="text-sm" /> Bulk Remind
                  </button>
                  <button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-brand text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-brandHover transition shadow-sm"
                  >
                    + New
                  </button>
                </div>"""
new_btn_group = """                <div className="flex gap-1.5 flex-wrap justify-end">
                  <button 
                    onClick={() => { setFestIndex(0); setIsFestModalOpen(true); }}
                    className="bg-orange-500 text-white text-xs font-bold px-2.5 py-1.5 rounded-lg hover:bg-orange-600 transition shadow-[0_2px_10px_rgba(249,115,22,0.3)] flex items-center gap-1"
                    title="Send Festival Wishes to everyone"
                  >
                    <WhatsappLogo weight="fill" className="text-sm" /> Wishes
                  </button>
                  <button 
                    onClick={() => { setBulkIndex(0); setIsBulkModalOpen(true); }}
                    className="bg-[#25D366] text-white text-xs font-bold px-2.5 py-1.5 rounded-lg hover:bg-[#128C7E] transition shadow-[0_2px_10px_rgba(37,211,102,0.3)] flex items-center gap-1"
                    title="Send monthly reminders to everyone"
                  >
                    <WhatsappLogo weight="fill" className="text-sm" /> Remind
                  </button>
                  <button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-brand text-white text-xs font-bold px-2.5 py-1.5 rounded-lg hover:bg-brandHover transition shadow-sm"
                  >
                    + New
                  </button>
                </div>"""
text = text.replace(old_btn_group, new_btn_group)

# Add Fest Modal at the very end before last </div>
fest_modal = """
      {/* Festival Wishes Modal */}
      {isFestModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl p-6 relative overflow-hidden text-center">
            <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-br from-orange-400 to-orange-600 z-0 rounded-t-3xl"></div>
            
            <div className="relative z-10 mt-2">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-xl mb-4 border-4 border-white">
                <WhatsappLogo weight="fill" className="text-4xl text-orange-500" />
              </div>
              
              <h3 className="font-black text-xl text-slate-800 mb-1">Festival Wishes</h3>
              <p className="text-slate-500 text-sm font-bold mb-4">Send to all {customers.length} customers</p>

              {festIndex < customers.length ? (
                <div className="text-left bg-slate-50 border border-slate-100 rounded-2xl p-4 shadow-inner mb-4">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sending {festIndex + 1} of {customers.length}</span>
                    <span className="text-xs font-black text-orange-500 bg-orange-100 px-2 py-0.5 rounded-full">{Math.round(((festIndex)/customers.length)*100)}%</span>
                  </div>
                  
                  <div className="mb-3">
                    <p className="text-sm font-bold text-slate-500">Customer Name</p>
                    <p className="text-lg font-black text-slate-800 truncate">{customers[festIndex].name}</p>
                  </div>
                  
                  <div>
                    <p className="text-xs font-bold text-slate-500 mb-1">Message:</p>
                    <textarea 
                      value={festMsg}
                      onChange={e => setFestMsg(e.target.value)}
                      className="w-full h-24 bg-white border border-slate-200 rounded-xl p-2 text-sm text-slate-700 outline-none focus:border-brand resize-none"
                    />
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button 
                      onClick={() => setIsFestModalOpen(false)}
                      className="flex-1 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={() => {
                        const cust = customers[festIndex];
                        let msg = festMsg.replace('{name}', cust.name);
                        const encodedMsg = encodeURIComponent(msg);
                        const waUrl = `https://wa.me/91${cust.mobile}?text=${encodedMsg}`;
                        window.open(waUrl, '_blank');
                        setFestIndex(prev => prev + 1);
                      }}
                      className="flex-[2] py-2.5 bg-orange-500 text-white rounded-xl font-bold shadow-[0_4px_15px_rgba(249,115,22,0.3)] hover:bg-orange-600 transition flex items-center justify-center gap-1.5"
                    >
                      <WhatsappLogo weight="fill" className="text-lg" /> Send & Next
                    </button>
                  </div>
                </div>
              ) : (
                <div className="py-8">
                  <div className="w-20 h-20 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                    <CheckCircle weight="fill" className="text-4xl" />
                  </div>
                  <h4 className="font-black text-2xl text-slate-800">All Done!</h4>
                  <p className="text-sm font-bold text-slate-500 mt-2">Wishes sent to all {customers.length} customers.</p>
                  <button 
                    onClick={() => setIsFestModalOpen(false)}
                    className="w-full mt-6 py-3 bg-brand text-white font-bold rounded-xl hover:bg-brandHover shadow-lg shadow-brand/30 transition"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
"""
if "Festival Wishes Modal" not in text:
    text = text.replace("    </div>\n  );\n};\n\nexport default Khata;", fest_modal + "\n    </div>\n  );\n};\n\nexport default Khata;")

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/pages/Khata.jsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Khata updated.")
