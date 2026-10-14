import re

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/pages/Dashboard.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Add new icons to import
if "Calculator" not in text:
    text = text.replace("import { ChartLineUp, CurrencyInr, Package, Users, Warning, BookBookmark, ArrowsLeftRight, CaretRight, Storefront } from '@phosphor-icons/react';", "import { ChartLineUp, CurrencyInr, Package, Users, Warning, BookBookmark, ArrowsLeftRight, CaretRight, Storefront, WhatsappLogo, Calculator, X } from '@phosphor-icons/react';")

# Add state for Cash Tally Modal
if "const [isTallyModalOpen" not in text:
    text = text.replace("const [recentMovements, setRecentMovements] = useState([]);", "const [recentMovements, setRecentMovements] = useState([]);\n  const [isTallyModalOpen, setIsTallyModalOpen] = useState(false);\n  const [notes, setNotes] = useState({ 500: '', 200: '', 100: '', 50: '', 20: '', 10: '' });")

# Add End of Day Report Handler
if "const handleEndOfDayReport" not in text:
    handler_code = """  const handleEndOfDayReport = () => {
    const dateStr = new Date().toLocaleDateString('mr-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    let msg = `📊 *DUKAAN360 - गल्ला बंद रिपोर्ट*\n`;
    msg += `📅 तारीख: ${dateStr}\n\n`;
    msg += `📈 आजची एकूण विक्री: ₹${(summary.today_sales || 0).toFixed(2)}\n`;
    msg += `💰 आजचा नफा: ₹${(summary.today_profit || 0).toFixed(2)}\n`;
    msg += `📒 बाजारात बाकी उधारी: ₹${(summary.total_due || 0).toFixed(2)}\n\n`;
    msg += `📦 कमी साठा असलेले आयटम: ${summary.low_stock_alerts || 0}\n`;
    msg += `👥 एकूण ग्राहक: ${summary.total_customers || 0}\n\n`;
    msg += `धन्यवाद! 🙏\n*Dukaan360 Retail*`;
    
    const waUrl = `https://wa.me/?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank');
  };

  const calculateTotalCash = () => {
    return Object.entries(notes).reduce((total, [denom, count]) => {
      return total + (parseInt(denom) * (parseInt(count) || 0));
    }, 0);
  };
"""
    text = text.replace("useEffect(() => {", handler_code + "\n  useEffect(() => {")

# Add Buttons in Header
old_header = """<div className="flex items-center gap-4">
                <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg border border-slate-200">"""
new_header = """<div className="flex flex-col lg:flex-row items-end lg:items-center gap-2 lg:gap-4">
                <div className="flex gap-2">
                  <button onClick={() => setIsTallyModalOpen(true)} className="flex items-center gap-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-3 py-1.5 rounded-lg text-sm font-bold transition shadow-sm">
                    <Calculator weight="fill" className="text-brand" /> गल्ला मोजा
                  </button>
                  <button onClick={handleEndOfDayReport} className="flex items-center gap-1.5 bg-[#25D366] hover:bg-[#128C7E] text-white px-3 py-1.5 rounded-lg text-sm font-bold transition shadow-sm shadow-[#25D366]/30">
                    <WhatsappLogo weight="fill" className="text-lg" /> गल्ला बंद रिपोर्ट
                  </button>
                </div>
                <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg border border-slate-200">"""
if "गल्ला बंद रिपोर्ट" not in text:
    text = text.replace(old_header, new_header)

# Add Cash Tally Modal at the end
modal_code = """
      {/* Cash Tally Modal */}
      {isTallyModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden">
            <div className="bg-brand p-4 flex justify-between items-center text-white">
              <h3 className="font-black text-lg flex items-center gap-2"><Calculator weight="fill" /> गल्ला मोजा (Cash Tally)</h3>
              <button onClick={() => setIsTallyModalOpen(false)} className="hover:bg-white/20 p-1 rounded-lg"><X weight="bold" /></button>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-2 gap-3 mb-4">
                {[500, 200, 100, 50, 20, 10].map(denom => (
                  <div key={denom} className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
                    <span className="w-12 text-right font-black text-slate-600">₹{denom}</span>
                    <span className="text-slate-400 font-bold">x</span>
                    <input 
                      type="number" min="0" placeholder="0"
                      value={notes[denom]}
                      onChange={(e) => setNotes(prev => ({...prev, [denom]: e.target.value}))}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-center font-bold outline-none focus:border-brand"
                    />
                  </div>
                ))}
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-center">
                <p className="text-xs font-bold text-orange-600 uppercase mb-1">Total Cash Calculated</p>
                <h2 className="text-3xl font-black text-orange-700">₹{calculateTotalCash()}</h2>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
"""
if "Cash Tally Modal" not in text:
    text = text.replace("    </div>\n  );\n};\n\nexport default Dashboard;", modal_code)

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/pages/Dashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Dashboard updated.")
