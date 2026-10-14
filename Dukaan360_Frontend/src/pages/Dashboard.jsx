import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import { ChartLineUp, Users, Warning, CurrencyInr, Storefront, BookBookmark, Package, Printer, X, Receipt , Calculator, WhatsappLogo, CloudArrowDown, FileText } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [summary, setSummary] = useState({
    today_sales: 0,
    total_due: 0,
    low_stock_alerts: 0,
    total_customers: 0,
    total_inventory_value: 0,
    today_profit: 0
  });
  const [loading, setLoading] = useState(true);
  const [showReorderModal, setShowReorderModal] = useState(false);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [isTallyModalOpen, setIsTallyModalOpen] = useState(false);
  const [notes, setNotes] = useState({ 500: '', 200: '', 100: '', 50: '', 20: '', 10: '' });

  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [expenseData, setExpenseData] = useState({ category: 'Tea & Snacks', amount: '', description: '' });





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

    const handleEndOfDayReport = () => {
    const dateStr = new Date().toLocaleDateString('mr-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    let msg = `📊 *DUKAAN360 - गल्ला बंद रिपोर्ट*
`;
    msg += `📅 तारीख: ${dateStr}

`;
    msg += `📈 आजची एकूण विक्री: ₹${(summary.today_sales || 0).toFixed(2)}
`;
    msg += `💰 आजचा नफा: ₹${(summary.today_profit || 0).toFixed(2)}
`;
    msg += `📒 बाजारात बाकी उधारी: ₹${(summary.total_due || 0).toFixed(2)}

`;
    msg += `📦 कमी साठा असलेले आयटम: ${summary.low_stock_alerts || 0}
`;
    msg += `👥 एकूण ग्राहक: ${summary.total_customers || 0}

`;
    msg += `धन्यवाद! 🙏
*Dukaan360 Retail*`;
    
    const waUrl = `https://wa.me/?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank');
  };

  const [downloadingBackup, setDownloadingBackup] = useState(false);

  const handleDownloadMyBackupPdf = async () => {
    setDownloadingBackup(true);
    try {
      const res = await axios.get('http://localhost:8000/dashboard/my-backup/pdf', {
        responseType: 'blob'
      });
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const downloadAnchor = document.createElement('a');
      const dateStr = new Date().toISOString().slice(0, 10);
      downloadAnchor.href = url;
      downloadAnchor.download = `Dukaan360_Store_Backup_${dateStr}.pdf`;
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      document.body.removeChild(downloadAnchor);
      URL.revokeObjectURL(url);
    } catch (err) {
      alert("PDF बॅकअप डाऊनलोड करण्यात अयशस्वी: " + (err.response?.data?.detail || err.message));
    } finally {
      setDownloadingBackup(false);
    }
  };

  const handleDownloadMyBackup = async () => {
    setDownloadingBackup(true);
    try {
      const res = await axios.get('http://localhost:8000/dashboard/my-backup');
      const storeName = res.data?.store?.name || 'My_Store';
      const jsonString = JSON.stringify(res.data, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const downloadAnchor = document.createElement('a');
      const dateStr = new Date().toISOString().slice(0, 10);
      downloadAnchor.href = url;
      downloadAnchor.download = `Dukaan360_${storeName.replace(/\s+/g, '_')}_Backup_${dateStr}.json`;
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      document.body.removeChild(downloadAnchor);
      URL.revokeObjectURL(url);
    } catch (err) {
      alert("बॅकअप डाऊनलोड करण्यात अयशस्वी: " + (err.response?.data?.detail || err.message));
    } finally {
      setDownloadingBackup(false);
    }
  };

  const calculateTotalCash = () => {
    return Object.entries(notes).reduce((total, [denom, count]) => {
      return total + (parseInt(denom) * (parseInt(count) || 0));
    }, 0);
  };

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await axios.get('http://localhost:8000/dashboard/summary/');
        setSummary(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  return (
    <div className="h-screen flex flex-col bg-surface overflow-hidden">
      <Header onMenuClick={() => {}} />

      <main className="flex-1 overflow-y-auto p-4 lg:p-8">
        
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-black text-slate-800">Store Dashboard</h1>
                <p className="text-slate-500 font-medium text-sm">Overview of your retail business</p>
              </div>
              
              <div className="flex flex-wrap items-center gap-2">
                <button onClick={() => setIsTallyModalOpen(true)} className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-sm transition transform active:scale-95 text-sm">
                  <Calculator weight="fill" className="text-brand text-lg" /> गल्ला मोजा
                </button>
                <button onClick={handleEndOfDayReport} className="bg-[#25D366] hover:bg-[#128C7E] text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-[0_4px_15px_rgba(37,211,102,0.3)] transition transform active:scale-95 text-sm">
                  <WhatsappLogo weight="fill" className="text-lg" /> गल्ला बंद रिपोर्ट
                </button>
                <button 
                  onClick={handleDownloadMyBackupPdf} 
                  disabled={downloadingBackup}
                  className="bg-white border border-red-200 hover:bg-red-50 text-red-700 px-3.5 py-2.5 rounded-xl font-bold flex items-center gap-1.5 shadow-sm transition transform active:scale-95 text-sm cursor-pointer disabled:opacity-50"
                  title="तुमच्या दुकानाचा संपूर्ण डेटा सोप्या व प्रिंट करण्यायोग्य PDF फाईलमध्ये डाऊनलोड करा"
                >
                  <FileText weight="fill" className="text-red-500 text-lg" />
                  <span>{downloadingBackup ? 'PDF तयार होत आहे...' : '📄 PDF बॅकअप'}</span>
                </button>
                <Link to="/pos" className="bg-brand hover:bg-brandHover text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-[0_4px_15px_rgba(255,87,34,0.3)] transition transform active:scale-95 text-sm">
                  <Storefront weight="fill" className="text-lg" /> Go to POS
                </Link>
              </div>
            </div>

          {loading ? (
            <p className="text-center text-slate-400 mt-10">Loading Dashboard...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
              
              {/* Today's Sales */}
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
                <div className="w-14 h-11 rounded-full bg-green-50 text-green-500 flex items-center justify-center shrink-0">
                  <ChartLineUp weight="fill" className="text-2xl" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Today's Sales (आजचा गल्ला)</p>
                  <h3 className="text-2xl font-black text-slate-800">{"\u20B9"}{(summary.today_sales || 0).toFixed(2)}</h3>
                </div>
              </div>

              {/* Today's Profit (New & Highlighted) */}
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-brand/20 flex items-center gap-4 relative overflow-hidden">
                <div className="absolute -right-4 -bottom-4 opacity-5">
                  <CurrencyInr weight="fill" className="text-9xl" />
                </div>
                <div className="w-14 h-11 rounded-full bg-brandLight text-brand flex items-center justify-center shrink-0 z-10">
                  <CurrencyInr weight="fill" className="text-2xl" />
                </div>
                <div className="z-10">
                  <p className="text-[10px] font-bold text-brand uppercase tracking-wide">Today's Net Profit (आजचा नफा)</p>
                  <h3 className="text-2xl font-black text-brand">{"\u20B9"}{(summary.today_profit || 0).toFixed(2)}</h3>
                </div>
              </div>

              {/* Total Market Due */}
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
                <div className="w-14 h-11 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
                  <BookBookmark weight="fill" className="text-2xl" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Market Due (बाजार उधारी)</p>
                  <h3 className="text-2xl font-black text-slate-800">{"\u20B9"}{(summary.total_due || 0).toFixed(2)}</h3>
                </div>
              </div>

              {/* Total Inventory Value (New) */}
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
                <div className="w-14 h-11 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                  <Package weight="fill" className="text-2xl" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Inventory Value (माल गुंतवणूक)</p>
                  <h3 className="text-2xl font-black text-slate-800">{"\u20B9"}{(summary.total_inventory_value || 0).toFixed(2)}</h3>
                </div>
              </div>

                            {/* Low Stock Alerts */}
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-11 rounded-full bg-red-50 text-red-500 flex items-center justify-center shrink-0">
                    <Warning weight="fill" className="text-2xl" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Low Stock Alerts (माल संपत आला आहे)</p>
                    <h3 className="text-2xl font-black text-slate-800">{(summary.low_stock_alerts || 0)} Items</h3>
                  </div>
                </div>
                <button 
                  onClick={handlePrintReorder}
                  className="flex flex-col items-center justify-center bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-xl transition w-16 h-16 shrink-0 border border-red-100 cursor-pointer"
                  title="Print Reorder List"
                >
                  <Printer weight="fill" className="text-xl mb-1" />
                  <span className="text-[9px] font-bold uppercase tracking-wider">Print</span>
                </button>
              </div>

              {/* Total Customers */}
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
                <div className="w-14 h-11 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center shrink-0">
                  <Users weight="fill" className="text-2xl" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Total Customers (ग्राहक)</p>
                  <h3 className="text-2xl font-black text-slate-800">{(summary.total_customers || 0)}</h3>
                </div>
              </div>
              
            </div>
          )}

          {/* Quick Actions */}
          <h2 className="text-lg font-bold text-slate-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/pos" className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-brand transition shadow-sm text-center group cursor-pointer">
              <div className="w-12 h-10 mx-auto rounded-full bg-slate-50 group-hover:bg-brandLight text-slate-400 group-hover:text-brand flex items-center justify-center mb-2 transition">
                <Storefront weight="fill" className="text-xl" />
              </div>
              <h4 className="font-bold text-slate-700 text-sm">New Bill</h4>
            </Link>
            
            <Link to="/khata" className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-brand transition shadow-sm text-center group cursor-pointer">
              <div className="w-12 h-10 mx-auto rounded-full bg-slate-50 group-hover:bg-brandLight text-slate-400 group-hover:text-brand flex items-center justify-center mb-2 transition">
                <BookBookmark weight="fill" className="text-xl" />
              </div>
              <h4 className="font-bold text-slate-700 text-sm">Khata Ledger</h4>
            </Link>

            <Link to="/inventory" className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-brand transition shadow-sm text-center group cursor-pointer">
              <div className="w-12 h-10 mx-auto rounded-full bg-slate-50 group-hover:bg-brandLight text-slate-400 group-hover:text-brand flex items-center justify-center mb-2 transition">
                <Package weight="fill" className="text-xl" />
              </div>
              <h4 className="font-bold text-slate-700 text-sm">Manage Stock</h4>
            </Link>
          </div>

        </div>

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
                          <td className="px-3 py-2">
                            <p className="font-bold text-slate-800 print:text-black">{item.name}</p>
                            <p className="text-[10px] text-slate-500 print:text-black mt-0.5">Barcode: {item.barcode}</p>
                          </td>
                          <td className="px-3 py-2 text-xs font-medium text-slate-600 print:text-black">
                            {item.category?.name || '-'}
                          </td>
                          <td className="px-3 py-2 text-right">
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

                <button type="submit" className="h-10 w-full bg-brand hover:bg-brandHover text-white rounded-xl font-black shadow-lg shadow-brand/30 transition-all active:scale-95 mt-2">
                  Save Expense
                </button>
              </form>
            </div>
          </div>
        )}
      </main>

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

