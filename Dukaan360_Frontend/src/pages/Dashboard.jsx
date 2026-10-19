import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import { 
  ChartLineUp, 
  Users, 
  Warning, 
  CurrencyInr, 
  Storefront, 
  BookBookmark, 
  Package, 
  Printer, 
  X, 
  Receipt, 
  Calculator, 
  WhatsappLogo, 
  CloudArrowDown, 
  FileText,
  Sparkle,
  Hourglass,
  TrendUp,
  ShieldCheck,
  Lightning,
  CheckCircle,
  Eye
} from '@phosphor-icons/react';
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
  const [valueRealized, setValueRealized] = useState(null);
  const [dailyBriefing, setDailyBriefing] = useState(null);
  const [deadStock, setDeadStock] = useState(null);
  const [aiInsights, setAiInsights] = useState(null);

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
    const fetchDashboardData = async () => {
      try {
        const [sumRes, vrRes, dbRes, dsRes, aiRes] = await Promise.allSettled([
          axios.get('http://localhost:8000/dashboard/summary/'),
          axios.get('http://localhost:8000/dashboard/value-realized'),
          axios.get('http://localhost:8000/dashboard/daily-briefing'),
          axios.get('http://localhost:8000/dashboard/dead-stock'),
          axios.get('http://localhost:8000/dashboard/ai-insights')
        ]);
        if (sumRes.status === 'fulfilled') setSummary(sumRes.value.data);
        if (vrRes.status === 'fulfilled') setValueRealized(vrRes.value.data);
        if (dbRes.status === 'fulfilled') setDailyBriefing(dbRes.value.data);
        if (dsRes.status === 'fulfilled') setDeadStock(dsRes.value.data);
        if (aiRes.status === 'fulfilled') setAiInsights(aiRes.value.data);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
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

          {/* 1. VALUE REALIZED ROI BANNER */}
          {valueRealized && (
            <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white shadow-lg shadow-emerald-500/20 relative overflow-hidden">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-black uppercase tracking-wider backdrop-blur-sm">
                      💡 Dukaan360 व्हॅल्यू कॅल्क्युलेटर • {valueRealized.month_label}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-900 text-[10px] font-black tracking-wider uppercase shadow-xs">
                      {valueRealized.roi_multiplier}x थेट ROI
                    </span>
                  </div>
                  <h2 className="text-base md:text-lg font-black text-white leading-tight">
                    {valueRealized.headline}
                  </h2>
                  <p className="text-emerald-100 text-xs font-medium mt-0.5">
                    {valueRealized.pitch}
                  </p>
                </div>

                {/* 3 Value Pillars */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 px-3 py-2 rounded-xl text-center min-w-[100px]">
                    <p className="text-[10px] text-emerald-200 font-bold uppercase">उधारी वसुली</p>
                    <p className="text-sm font-black text-white">₹{valueRealized.udhari_recovered?.toLocaleString()}</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 px-3 py-2 rounded-xl text-center min-w-[100px]">
                    <p className="text-[10px] text-emerald-200 font-bold uppercase">Expiry नुकसान वाचले</p>
                    <p className="text-sm font-black text-white">₹{valueRealized.expiry_loss_avoided?.toLocaleString()}</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 px-3 py-2 rounded-xl text-center min-w-[100px]">
                    <p className="text-[10px] text-emerald-200 font-bold uppercase">Dead Stock वाचले</p>
                    <p className="text-sm font-black text-white">₹{valueRealized.dead_stock_prevented?.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. DAILY ASSISTANT: आज काय करायचं? */}
          {dailyBriefing && (
            <div className="mb-6 bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-orange-100 text-brand flex items-center justify-center font-bold text-lg shrink-0">
                    ☀️
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-black text-slate-800">आज काय करायचं? (Daily Action Assistant)</h3>
                    <p className="text-xs text-slate-500 font-medium">दुकान उघडल्यावर तातडीने करायची कामे आणि आजचा अंदाज</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="px-2.5 py-1 rounded-lg bg-green-50 text-green-700 font-bold border border-green-200">
                    अंदाजे विक्री: ₹{dailyBriefing.expected_today_sales?.toLocaleString()}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                    कालचा नफा: ₹{dailyBriefing.yesterday_profit?.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Action items grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Overdue Udhari Action */}
                <div className="p-3.5 rounded-xl bg-red-50/70 border border-red-200/80 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-black uppercase text-red-600 bg-red-100 px-2 py-0.5 rounded-full">
                        🔴 उधारी तातडीची वसुली
                      </span>
                      <span className="text-xs font-black text-red-700">{dailyBriefing.overdue_count} ग्राहक</span>
                    </div>
                    <p className="text-lg font-black text-red-800 my-1">
                      ₹{dailyBriefing.overdue_total_amount?.toLocaleString()} <span className="text-xs font-semibold text-red-600">थकीत</span>
                    </p>
                    <p className="text-[11px] text-red-700 font-medium line-clamp-2">
                      {dailyBriefing.overdue_top_customers?.slice(0, 2).map(c => `${c.name} (₹${c.amount})`).join(', ') || 'उधारी थकीत नाही'}
                    </p>
                  </div>
                  <Link to="/khata" className="mt-3 text-center text-xs font-bold text-white bg-red-600 hover:bg-red-700 py-1.5 rounded-lg transition active:scale-95 shadow-xs">
                    WhatsApp तगादा पाठवा →
                  </Link>
                </div>

                {/* Low Stock Action */}
                <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-black uppercase text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                        🟠 साठा संपत आला
                      </span>
                      <span className="text-xs font-black text-amber-800">{dailyBriefing.low_stock_count} वस्तू</span>
                    </div>
                    <p className="text-lg font-black text-amber-900 my-1">
                      {dailyBriefing.low_stock_count} वस्तू संपत आल्या
                    </p>
                    <p className="text-[11px] text-amber-800 font-medium line-clamp-2">
                      {dailyBriefing.low_stock_items?.slice(0, 3).map(i => i.product_name).join(', ') || 'साठा पुरेसा आहे'}
                    </p>
                  </div>
                  <button onClick={handlePrintReorder} className="mt-3 text-center text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 py-1.5 rounded-lg transition active:scale-95 shadow-xs cursor-pointer">
                    खरेदी यादी प्रिंट करा →
                  </button>
                </div>

                {/* Expiry Loss Action */}
                <div className="p-3.5 rounded-xl bg-orange-50/70 border border-orange-200/80 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-black uppercase text-orange-700 bg-orange-100 px-2 py-0.5 rounded-full">
                        🟡 Expiry जवळ आली
                      </span>
                      <span className="text-xs font-black text-orange-800">{dailyBriefing.near_expiry_count} वस्तू</span>
                    </div>
                    <p className="text-lg font-black text-orange-900 my-1">
                      ₹{dailyBriefing.near_expiry_capital_risk?.toLocaleString()} <span className="text-xs font-semibold text-orange-700">भांडवल धोक्यात</span>
                    </p>
                    <p className="text-[11px] text-orange-800 font-medium line-clamp-2">
                      पुढील ३० दिवसांत मुदत संपत आहे. ऑफर देऊन माल त्वरित मोकळा करा.
                    </p>
                  </div>
                  <Link to="/inventory" className="mt-3 text-center text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 py-1.5 rounded-lg transition active:scale-95 shadow-xs">
                    स्टॉक तपासा व डिस्काउंट द्या →
                  </Link>
                </div>
              </div>
            </div>
          )}

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

          {/* 3. DEAD STOCK / SLOW MOVING CAPITAL TRACKER ("माल कुठे पैसा अडकवतोय ते दाखव") */}
          {deadStock && (
            <div className="mb-8 bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-lg shrink-0">
                    ⚠️
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-800">माल कुठे पैसा अडकवतोय? (Dead Stock Tracker)</h3>
                    <p className="text-xs text-slate-500 font-medium">{deadStock.headline}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-purple-800 bg-purple-50 px-3 py-1.5 rounded-xl border border-purple-200">
                    अडकलेले भांडवल: ₹{deadStock.total_capital_locked?.toLocaleString()}
                  </span>
                </div>
              </div>

              {deadStock.items?.length === 0 ? (
                <p className="text-center py-6 text-slate-400 font-bold text-xs">कोणताही Dead Stock नाही. सर्व साठा उत्तम फिरतोय!</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                        <th className="py-2.5 px-3">वस्तूचे नाव</th>
                        <th className="py-2.5 px-3">बॅच</th>
                        <th className="py-2.5 px-3 text-center">शिल्लक स्टॉक</th>
                        <th className="py-2.5 px-3 text-right">खरेदी किंमत</th>
                        <th className="py-2.5 px-3 text-right">अडकलेले भांडवल</th>
                        <th className="py-2.5 px-3">सुचवलेली कृती (Action)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      {deadStock.items.slice(0, 6).map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/80 transition">
                          <td className="py-2.5 px-3 font-bold text-slate-800">{item.product_name}</td>
                          <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px]">{item.batch_number}</td>
                          <td className="py-2.5 px-3 text-center font-bold">{item.current_quantity} {item.unit}</td>
                          <td className="py-2.5 px-3 text-right">₹{item.purchase_rate}</td>
                          <td className="py-2.5 px-3 text-right font-black text-red-600">₹{item.capital_locked?.toLocaleString()}</td>
                          <td className="py-2.5 px-3">
                            <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold inline-block">
                              {item.suggested_action}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* 4. AI BUSINESS INSIGHTS & PURCHASE SUGGESTIONS */}
          {aiInsights && aiInsights.purchase_suggestions?.length > 0 && (
            <div className="mb-8 bg-gradient-to-r from-blue-50/60 via-indigo-50/40 to-white p-5 rounded-2xl shadow-sm border border-blue-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 border-b border-blue-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg shrink-0">
                    🧠
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-800">AI बिझनेस इनसाइट्स व खरेदी अंदाज (Purchase Suggestions)</h3>
                    <p className="text-xs text-slate-500 font-medium">मागील विक्रीचा वेग पाहून ७ दिवसांत संपणाऱ्या मालाची आगाऊ सूचना</p>
                  </div>
                </div>
                <span className="text-[10px] font-black uppercase text-blue-700 bg-blue-100 px-2.5 py-1 rounded-full self-start sm:self-auto">
                  AI Predictive Analytics
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {aiInsights.purchase_suggestions.slice(0, 3).map((item, idx) => (
                  <div key={idx} className="bg-white p-3.5 rounded-xl border border-blue-100 shadow-2xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="font-bold text-xs text-slate-800">{item.product_name}</h4>
                        <span className="text-[10px] font-black text-red-600 bg-red-50 px-2 py-0.5 rounded-md shrink-0 border border-red-100">
                          {item.days_left} दिवसांत संपेल!
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium">
                        रोजची विक्री: ~{item.daily_velocity} {item.unit} • शिल्लक: {item.current_stock} {item.unit}
                      </p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-700 font-bold">सुचवलेली ऑर्डर: <strong className="text-blue-600">{item.suggested_order_qty} {item.unit}</strong></span>
                      <span className="text-slate-500 text-[10px] font-semibold">खर्च: ~₹{item.est_cost}</span>
                    </div>
                  </div>
                ))}
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

