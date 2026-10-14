import re

with open('C:/Users/Omkar/Desktop/Dukaan360_Frontend/src/pages/Dashboard.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Add Printer to imports
text = text.replace(
    "import { ChartLineUp, Users, Warning, CurrencyInr, Storefront, BookBookmark, Package } from '@phosphor-icons/react';",
    "import { ChartLineUp, Users, Warning, CurrencyInr, Storefront, BookBookmark, Package, Printer, X } from '@phosphor-icons/react';"
)

# 2. Add state variables for the modal
state_text = """  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [showReorderModal, setShowReorderModal] = useState(false);
  const [lowStockItems, setLowStockItems] = useState([]);
"""
text = text.replace("""  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);""", state_text)


# 3. Function to open Reorder List
fetch_low_stock = """
  const handlePrintReorder = async () => {
    try {
      const [prodRes, batchRes] = await Promise.all([
        axios.get('http://localhost:8000/products/'),
        axios.get('http://localhost:8000/stock/batches/')
      ]);
      
      const stockMap = {};
      batchRes.data.forEach(b => {
        if (!stockMap[b.product_id]) stockMap[b.product_id] = 0;
        stockMap[b.product_id] += b.current_quantity;
      });

      const lowStock = prodRes.data.filter(p => (stockMap[p.id] || 0) < 10).map(p => ({
        ...p,
        stock: stockMap[p.id] || 0
      }));

      setLowStockItems(lowStock);
      setShowReorderModal(true);
    } catch (err) {
      console.error(err);
      alert("Failed to load low stock items");
    }
  };
"""

text = text.replace("  useEffect(() => {", fetch_low_stock + "\n  useEffect(() => {")

# 4. Modify the Low Stock Card
old_card = """              {/* Low Stock Alerts */}
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-red-50 text-red-500 flex items-center justify-center shrink-0">
                  <Warning weight="fill" className="text-2xl" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Low Stock Alerts (माल संपत आला आहे)</p>
                  <h3 className="text-2xl font-black text-slate-800">{(summary.low_stock_alerts || 0)} Items</h3>
                </div>
              </div>"""

new_card = """              {/* Low Stock Alerts */}
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-red-50 text-red-500 flex items-center justify-center shrink-0">
                    <Warning weight="fill" className="text-2xl" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Low Stock Alerts (माल संपत आला आहे)</p>
                    <h3 className="text-2xl font-black text-slate-800">{(summary.low_stock_alerts || 0)} Items</h3>
                  </div>
                </div>
                <button 
                  onClick={handlePrintReorder}
                  className="hidden md:flex flex-col items-center justify-center bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-xl transition w-16 h-16 shrink-0 border border-red-100"
                  title="Print Reorder List"
                >
                  <Printer weight="fill" className="text-xl mb-1" />
                  <span className="text-[9px] font-bold uppercase tracking-wider">Print</span>
                </button>
              </div>"""

text = text.replace(old_card, new_card)

# 5. Add Modal JSX at the end before </main>
modal_jsx = """
        {/* Reorder List Modal */}
        {showReorderModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-100 flex flex-col overflow-hidden max-h-[90vh]">
              
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 no-print">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center">
                    <Warning weight="fill" className="text-xl" />
                  </div>
                  <h3 className="font-bold text-slate-800 text-lg">Wholesale Reorder List</h3>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => window.print()} className="px-3 py-1.5 bg-brand text-white rounded-lg text-xs font-bold shadow-sm hover:bg-brandHover transition flex items-center gap-1.5">
                    <Printer weight="fill" /> Print
                  </button>
                  <button onClick={() => setShowReorderModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-red-500 hover:bg-slate-200 transition">
                    <X weight="bold" className="text-lg" />
                  </button>
                </div>
              </div>

              {/* Printable Content */}
              <div className="p-6 overflow-y-auto print-receipt bg-white">
                <div className="hidden print:block text-center mb-6 border-b-2 border-black border-dashed pb-4">
                  <h1 className="font-black text-2xl uppercase tracking-widest mb-1">DUKAAN360</h1>
                  <h2 className="font-bold text-lg mb-2">Reorder List / खरेदीची यादी</h2>
                  <p className="text-sm font-bold">Date: {new Date().toLocaleDateString('en-IN')}</p>
                </div>
                
                {lowStockItems.length === 0 ? (
                  <p className="text-center py-10 text-slate-500 font-bold">No items are low on stock!</p>
                ) : (
                  <table className="w-full text-left border-collapse print:text-sm">
                    <thead>
                      <tr className="bg-slate-100 print:bg-transparent print:border-b-2 print:border-black text-slate-600 print:text-black text-xs font-bold uppercase tracking-wider">
                        <th className="px-3 py-2">Item Name</th>
                        <th className="px-3 py-2">Category</th>
                        <th className="px-3 py-2 text-right">Current Stock</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 print:divide-black/20">
                      {lowStockItems.map(item => (
                        <tr key={item.id} className="hover:bg-slate-50">
                          <td className="px-3 py-3">
                            <p className="font-bold text-slate-800 print:text-black">{item.name}</p>
                            <p className="text-[10px] text-slate-500 print:text-black mt-0.5">Barcode: {item.barcode}</p>
                          </td>
                          <td className="px-3 py-3 text-xs font-medium text-slate-600 print:text-black">
                            {item.category?.name || '-'}
                          </td>
                          <td className="px-3 py-3 text-right">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${
                              item.stock <= 0 ? 'bg-red-100 text-red-700 print:bg-transparent print:text-black' : 'bg-orange-100 text-orange-700 print:bg-transparent print:text-black'
                            }`}>
                              {item.stock} {item.unit}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
                
                <div className="hidden print:block mt-8 pt-4 border-t-2 border-black border-dashed text-center">
                  <p className="font-bold">Total Items to Order: {lowStockItems.length}</p>
                  <p className="text-xs mt-2">Generated by Dukaan360 Retail POS</p>
                </div>
              </div>
            </div>
          </div>
        )}
"""

text = text.replace("      </main>\n    </div>", modal_jsx + "      </main>\n    </div>")

with open('C:/Users/Omkar/Desktop/Dukaan360_Frontend/src/pages/Dashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Done")
