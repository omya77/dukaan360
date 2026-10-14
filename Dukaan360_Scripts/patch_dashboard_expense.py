import re

with open('C:/Users/Omkar/Desktop/Dukaan360_Frontend/src/pages/Dashboard.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Update imports to include Receipt icon for Expense
text = text.replace(
    "import { ChartLineUp, Users, Warning, CurrencyInr, Storefront, BookBookmark, Package, Printer, X } from '@phosphor-icons/react';",
    "import { ChartLineUp, Users, Warning, CurrencyInr, Storefront, BookBookmark, Package, Printer, X, Receipt } from '@phosphor-icons/react';"
)

# 2. Add Expense Modal State
state_to_add = """
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [expenseData, setExpenseData] = useState({ category: 'Tea & Snacks', amount: '', description: '' });
"""
text = text.replace("const [lowStockItems, setLowStockItems] = useState([]);", "const [lowStockItems, setLowStockItems] = useState([]);\n" + state_to_add)

# 3. Add handleAddExpense function inside Dashboard component
expense_handler = """
  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!expenseData.amount || expenseData.amount <= 0) return alert('Enter a valid amount');
    
    try {
      await axios.post('http://localhost:8000/expenses/', {
        category: expenseData.category,
        amount: parseFloat(expenseData.amount),
        description: expenseData.description
      });
      alert('Expense added successfully!');
      setShowExpenseModal(false);
      setExpenseData({ category: 'Tea & Snacks', amount: '', description: '' });
      // Re-fetch summary
      const res = await axios.get('http://localhost:8000/dashboard/summary/');
      setSummary(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to add expense');
    }
  };
"""
text = text.replace("  const handlePrintReorder = async () => {", expense_handler + "\n  const handlePrintReorder = async () => {")

# 4. Modify the Profit Card to show Gross and Expense breakdown
old_profit_card = """              {/* Today's Profit (New & Highlighted) */}
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-brand/20 flex items-center gap-4 relative overflow-hidden">
                <div className="absolute -right-4 -bottom-4 opacity-5">
                  <CurrencyInr weight="fill" className="text-9xl" />
                </div>
                <div className="w-14 h-14 rounded-full bg-brandLight text-brand flex items-center justify-center shrink-0 z-10">
                  <CurrencyInr weight="fill" className="text-2xl" />
                </div>
                <div className="z-10">
                  <p className="text-[10px] font-bold text-brand uppercase tracking-wide">Today's Net Profit (आजचा नफा)</p>
                  <h3 className="text-2xl font-black text-brand">{"\u20B9"}{(summary.today_profit || 0).toFixed(2)}</h3>
                </div>
              </div>"""

new_profit_card = """              {/* Today's Profit (New & Highlighted) */}
              <div className="bg-white p-4 lg:p-5 rounded-2xl shadow-sm border border-brand/20 flex items-center gap-4 relative overflow-hidden">
                <div className="absolute -right-4 -bottom-4 opacity-5">
                  <CurrencyInr weight="fill" className="text-9xl" />
                </div>
                <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-brandLight text-brand flex items-center justify-center shrink-0 z-10">
                  <CurrencyInr weight="fill" className="text-xl lg:text-2xl" />
                </div>
                <div className="z-10 w-full pr-2">
                  <p className="text-[9px] lg:text-[10px] font-bold text-brand uppercase tracking-wide">Today's Net Profit (आजचा नफा)</p>
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-xl lg:text-2xl font-black text-brand">{"\u20B9"}{(summary.today_profit || 0).toFixed(2)}</h3>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-[9px] lg:text-[10px] font-bold text-slate-500 bg-white/60 p-1 rounded">
                    <span className="text-green-600">+{"\u20B9"}{(summary.today_gross_profit || 0).toFixed(2)}</span>
                    <span>-</span>
                    <span className="text-red-500">{"\u20B9"}{(summary.today_expenses || 0).toFixed(2)} Exp</span>
                  </div>
                </div>
              </div>"""
text = text.replace(old_profit_card, new_profit_card)

# 5. Add "+ Add Expense" to Quick Actions
quick_action_add = """            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button onClick={() => setShowExpenseModal(true)} className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-red-500 transition shadow-sm text-center group cursor-pointer flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Receipt weight="fill" className="text-xl" />
                </div>
                <h3 className="font-bold text-slate-800 text-sm">Add Expense</h3>
                <p className="text-[10px] text-slate-500">Track daily karcha</p>
              </button>"""
text = text.replace("""            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">""", quick_action_add)

# 6. Add Expense Modal at the bottom
expense_modal = """
        {/* Add Expense Modal */}
        {showExpenseModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl p-6 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="font-black text-xl text-slate-800">Add Expense</h3>
                  <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-wide">दुकानचा खर्च</p>
                </div>
                <button 
                  onClick={() => setShowExpenseModal(false)}
                  className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-200 transition"
                >
                  <X weight="bold" />
                </button>
              </div>
              
              <form onSubmit={handleAddExpense} className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Category</label>
                  <select 
                    value={expenseData.category}
                    onChange={(e) => setExpenseData({...expenseData, category: e.target.value})}
                    className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-3 text-sm font-bold text-slate-800 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                  >
                    <option value="Tea & Snacks">Tea & Snacks (चहापाणी)</option>
                    <option value="Transport">Transport (गाडी भाडे)</option>
                    <option value="Wages">Wages (मजुरी)</option>
                    <option value="Supplier Payment">Supplier Payment (व्यापारी पेमेंट)</option>
                    <option value="Electricity / Bills">Electricity / Bills (बिले)</option>
                    <option value="Other">Other (इतर)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Amount (₹)</label>
                  <input 
                    type="number" step="any" required min="1"
                    value={expenseData.amount}
                    onChange={(e) => setExpenseData({...expenseData, amount: e.target.value})}
                    placeholder="Enter amount"
                    className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-3 text-sm font-black text-slate-800 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Description (Optional)</label>
                  <input 
                    type="text"
                    value={expenseData.description}
                    onChange={(e) => setExpenseData({...expenseData, description: e.target.value})}
                    placeholder="e.g. Paid to driver"
                    className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-3 text-sm font-bold text-slate-800 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                  />
                </div>

                <button type="submit" className="h-12 w-full bg-brand hover:bg-brandHover text-white rounded-xl font-black shadow-lg shadow-brand/30 transition-all active:scale-95 mt-2">
                  Save Expense
                </button>
              </form>
            </div>
          </div>
        )}
"""
text = text.replace("      </main>\n    </div>", expense_modal + "      </main>\n    </div>")

with open('C:/Users/Omkar/Desktop/Dukaan360_Frontend/src/pages/Dashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Done")
