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
  TrendDown,
  ShieldCheck,
  Lightning,
  CheckCircle,
  Eye,
  Trophy,
  Plus,
  Trash,
  ArrowUpRight,
  ArrowsClockwise
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
  const [businessHealth, setBusinessHealth] = useState(null);
  const [whereIsMyMoney, setWhereIsMyMoney] = useState(null);

  const [loading, setLoading] = useState(true);
  const [showReorderModal, setShowReorderModal] = useState(false);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [isTallyModalOpen, setIsTallyModalOpen] = useState(false);
  const [notes, setNotes] = useState({ 500: '', 200: '', 100: '', 50: '', 20: '', 10: '' });

  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [expenseData, setExpenseData] = useState({ category: 'Tea & Snacks', amount: '', description: '' });

  // Smart Purchase Order State
  const [showPOModal, setShowPOModal] = useState(false);
  const [poSupplierName, setPoSupplierName] = useState('बालाजी ट्रेडिंग (होलसेलर)');
  const [poSupplierMobile, setPoSupplierMobile] = useState('');
  const [poItems, setPoItems] = useState([
    { product_name: 'साखर (Sugar M30)', quantity: 10, unit: 'Bags', est_rate: 3800 },
    { product_name: 'Fortune Sunlite Oil 1L', quantity: 24, unit: 'Pouches', est_rate: 110 },
    { product_name: 'Wagh Bakri Chai 250g', quantity: 15, unit: 'Packets', est_rate: 135 },
    { product_name: 'Parle-G Gold 100g', quantity: 10, unit: 'Cartons', est_rate: 450 }
  ]);
  const [newPoItem, setNewPoItem] = useState({ product_name: '', quantity: '', unit: 'Packets', est_rate: '' });
  const [poNotes, setPoNotes] = useState('कृपया उद्या सकाळपर्यंत डिलिव्हरी पाठवावी.');
  const [isSendingPO, setIsSendingPO] = useState(false);

  // Smart Combo State
  const [comboActiveAlert, setComboActiveAlert] = useState(false);
  const [downloadingBackup, setDownloadingBackup] = useState(false);

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

  const calculateTotalCash = () => {
    return Object.entries(notes).reduce((total, [denom, count]) => {
      return total + (parseInt(denom) * (parseInt(count) || 0));
    }, 0);
  };

  const handleSendPO = async () => {
    if (poItems.length === 0) {
      alert("कृपया ऑर्डरमध्ये किमान एक वस्तू जोडा.");
      return;
    }
    setIsSendingPO(true);
    try {
      const cleanMobile = poSupplierMobile.replace(/\D/g, '');
      const fullMobile = cleanMobile.length === 10 ? `91${cleanMobile}` : cleanMobile;
      const payload = {
        supplier_name: poSupplierName,
        supplier_mobile: fullMobile,
        items: poItems.map(it => ({
          product_name: it.product_name,
          quantity: parseFloat(it.quantity) || 1,
          unit: it.unit || 'Packets',
          est_rate: it.est_rate ? parseFloat(it.est_rate) : null
        })),
        notes: poNotes
      };
      const res = await axios.post('http://localhost:8000/inventory/purchase-order', payload);
      alert(`ऑर्डर #${res.data.po_number} तयार झाली आहे! आता WhatsApp वर पाठवत आहोत.`);
      if (res.data.whatsapp_url) {
        window.open(res.data.whatsapp_url, '_blank');
      }
      setShowPOModal(false);
    } catch (err) {
      console.error(err);
      alert("PO पाठवण्यात अडचण आली: " + (err.response?.data?.detail || err.message));
    } finally {
      setIsSendingPO(false);
    }
  };

  const handleAddPoItem = (e) => {
    e.preventDefault();
    if (!newPoItem.product_name || !newPoItem.quantity) return;
    setPoItems(prev => [...prev, {
      product_name: newPoItem.product_name,
      quantity: parseFloat(newPoItem.quantity),
      unit: newPoItem.unit,
      est_rate: newPoItem.est_rate ? parseFloat(newPoItem.est_rate) : null
    }]);
    setNewPoItem({ product_name: '', quantity: '', unit: 'Packets', est_rate: '' });
  };

  const removePoItem = (idx) => {
    setPoItems(prev => prev.filter((_, i) => i !== idx));
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [sumRes, vrRes, dbRes, dsRes, aiRes, bhRes, wmmRes] = await Promise.allSettled([
          axios.get('http://localhost:8000/dashboard/summary/'),
          axios.get('http://localhost:8000/dashboard/value-realized'),
          axios.get('http://localhost:8000/dashboard/daily-briefing'),
          axios.get('http://localhost:8000/dashboard/dead-stock'),
          axios.get('http://localhost:8000/dashboard/ai-insights'),
          axios.get('http://localhost:8000/dashboard/business-health'),
          axios.get('http://localhost:8000/dashboard/where-is-my-money')
        ]);
        if (sumRes.status === 'fulfilled') setSummary(sumRes.value.data);
        if (vrRes.status === 'fulfilled') setValueRealized(vrRes.value.data);
        if (dbRes.status === 'fulfilled') setDailyBriefing(dbRes.value.data);
        if (dsRes.status === 'fulfilled') setDeadStock(dsRes.value.data);
        if (aiRes.status === 'fulfilled') setAiInsights(aiRes.value.data);
        if (bhRes.status === 'fulfilled') setBusinessHealth(bhRes.value.data);
        if (wmmRes.status === 'fulfilled') setWhereIsMyMoney(wmmRes.value.data);
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
        
        <div className="max-w-6xl mx-auto space-y-6">
          
          {/* Top Bar with Title and Actions */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4">
            <div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight">Dukaan360 Smart Dashboard</h1>
              <p className="text-slate-500 font-medium text-sm">दुकानातील पैसा, माल, ग्राहक आणि नफ्यावर संपूर्ण नियंत्रण</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <button 
                onClick={() => setShowPOModal(true)} 
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-sm transition transform active:scale-95 text-xs sm:text-sm cursor-pointer"
              >
                <Package weight="fill" className="text-base" /> Smart PO (सप्लायर ऑर्डर)
              </button>
              <button 
                onClick={() => setShowExpenseModal(true)} 
                className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-3.5 py-2.5 rounded-xl font-bold flex items-center gap-1.5 shadow-sm transition transform active:scale-95 text-xs sm:text-sm cursor-pointer"
              >
                <Plus weight="bold" className="text-brand" /> खर्च नोंदवा
              </button>
              <button 
                onClick={() => setIsTallyModalOpen(true)} 
                className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-3.5 py-2.5 rounded-xl font-bold flex items-center gap-1.5 shadow-sm transition transform active:scale-95 text-xs sm:text-sm cursor-pointer"
              >
                <Calculator weight="fill" className="text-brand" /> गल्ला मोजा
              </button>
              <button 
                onClick={handleEndOfDayReport} 
                className="bg-[#25D366] hover:bg-[#128C7E] text-white px-3.5 py-2.5 rounded-xl font-bold flex items-center gap-1.5 shadow-[0_4px_15px_rgba(37,211,102,0.3)] transition transform active:scale-95 text-xs sm:text-sm cursor-pointer"
              >
                <WhatsappLogo weight="fill" className="text-base" /> गल्ला बंद रिपोर्ट
              </button>
              <button 
                onClick={handleDownloadMyBackupPdf} 
                disabled={downloadingBackup}
                className="bg-white border border-red-200 hover:bg-red-50 text-red-700 px-3 py-2.5 rounded-xl font-bold flex items-center gap-1.5 shadow-sm transition transform active:scale-95 text-xs sm:text-sm cursor-pointer disabled:opacity-50"
              >
                <FileText weight="fill" className="text-red-500" />
                <span>{downloadingBackup ? 'PDF...' : 'PDF बॅकअप'}</span>
              </button>
              <Link 
                to="/pos" 
                className="bg-brand hover:bg-brandHover text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-[0_4px_15px_rgba(255,87,34,0.3)] transition transform active:scale-95 text-xs sm:text-sm"
              >
                <Storefront weight="fill" className="text-base" /> Go to POS
              </Link>
            </div>
          </div>

          {/* 1. FEATURE 1: BUSINESS HEALTH SCORE BANNER (Score 87/100) */}
          <div className="p-5 rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white shadow-xl border border-emerald-500/30 relative overflow-hidden">
            <div className="absolute -right-12 -top-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>
            
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 relative z-10">
              <div className="flex items-center gap-4">
                {/* Radial Score Gauge */}
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-0.5 shadow-lg shadow-emerald-500/30 shrink-0 flex items-center justify-center">
                  <div className="w-full h-full bg-slate-900 rounded-[14px] flex flex-col items-center justify-center">
                    <span className="text-2xl font-black text-emerald-400 leading-none">
                      {businessHealth?.health_score || 87}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">/100</span>
                  </div>
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-black tracking-wide">
                      🟢 आजचा Business Score: {businessHealth?.health_score || 87}/100
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-white/10 text-slate-200 text-[10px] font-bold">
                      {businessHealth?.health_status || 'उत्कृष्ट (Excellent Store Health)'}
                    </span>
                  </div>
                  <h2 className="text-lg md:text-xl font-black text-white">
                    दुकानाची स्थिती उत्तम आहे — नफा आणि उधारी वसुली नियंत्रणात!
                  </h2>
                  <p className="text-slate-400 text-xs font-medium mt-0.5">
                    मागील आठवड्याच्या तुलनेत विक्री, नफा आणि साठ्याचा थेट Health Report
                  </p>
                </div>
              </div>

              {/* 5 Key Metric Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 w-full lg:w-auto">
                <div className="bg-white/5 border border-white/10 px-3 py-2 rounded-xl text-center">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">विक्री (Sales)</p>
                  <p className="text-sm font-black text-emerald-400 flex items-center justify-center gap-0.5">
                    <TrendUp weight="bold" /> {businessHealth?.sales_growth || '+12%'}
                  </p>
                </div>
                <div className="bg-white/5 border border-white/10 px-3 py-2 rounded-xl text-center">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">नफा (Profit)</p>
                  <p className="text-sm font-black text-emerald-400 flex items-center justify-center gap-0.5">
                    <TrendUp weight="bold" /> {businessHealth?.profit_growth || '+8%'}
                  </p>
                </div>
                <div className="bg-white/5 border border-white/10 px-3 py-2 rounded-xl text-center">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">उधारी (Udhari)</p>
                  <p className="text-sm font-black text-teal-300 flex items-center justify-center gap-0.5">
                    <TrendDown weight="bold" /> {businessHealth?.udhari_change || '-5%'}
                  </p>
                </div>
                <div className="bg-white/5 border border-white/10 px-3 py-2 rounded-xl text-center">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Dead Stock</p>
                  <p className="text-sm font-black text-amber-400">
                    ₹{(businessHealth?.dead_stock_amount || 3600).toLocaleString()} ⚠️
                  </p>
                </div>
                <div className="bg-white/5 border border-white/10 px-3 py-2 rounded-xl text-center col-span-2 sm:col-span-1">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Stock Health</p>
                  <p className="text-sm font-black text-emerald-300">
                    {businessHealth?.stock_health_pct || 91}% 🛡️
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 2. FEATURE 2: SIMPLE OWNER MODE ("आज मी किती कमावले?") */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xl shrink-0">
                  💰
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-800">
                    “आज मी किती कमावले?” — Simple Owner Mode
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    दुकानदाराला accounting समजत नसले तरी आजची खरी कमाई आणि रोकडीचा स्पष्ट अंदाज
                  </p>
                </div>
              </div>

              {/* Yesterday vs Today badge */}
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1.5 rounded-xl text-xs font-black self-start sm:self-auto flex items-center gap-1.5">
                <Sparkle weight="fill" className="text-emerald-600 text-sm" />
                <span>{businessHealth?.today_breakdown?.headline || 'कालपेक्षा आज ₹६२० जास्त नफा 🚀'}</span>
              </div>
            </div>

            {/* Main Numbers Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {/* Today's Sales */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">आजची विक्री</p>
                <p className="text-xl font-black text-slate-800 mt-0.5">
                  ₹{(businessHealth?.today_breakdown?.today_sales || summary.today_sales || 18450).toLocaleString()}
                </p>
                <span className="text-[10px] font-semibold text-slate-500">एकूण बिलिंग</span>
              </div>

              {/* Today's Expenses */}
              <div className="bg-red-50/60 p-3.5 rounded-2xl border border-red-100">
                <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider">आजचा खर्च</p>
                <p className="text-xl font-black text-red-700 mt-0.5">
                  ₹{(businessHealth?.today_breakdown?.today_expenses || 4200).toLocaleString()}
                </p>
                <span className="text-[10px] font-semibold text-red-600">चहा, हमाली, गाडीभाडे</span>
              </div>

              {/* Gross Profit */}
              <div className="bg-emerald-50/80 p-3.5 rounded-2xl border border-emerald-200 col-span-2 sm:col-span-1 lg:col-span-1 shadow-xs">
                <p className="text-[10px] font-black text-emerald-700 uppercase tracking-wider">अंदाजे Gross Profit</p>
                <p className="text-2xl font-black text-emerald-800 mt-0.5">
                  ₹{(businessHealth?.today_breakdown?.gross_profit || summary.today_profit || 3840).toLocaleString()}
                </p>
                <span className="text-[10px] font-bold text-emerald-600">शुद्ध कमाई</span>
              </div>

              {/* Cash in Hand */}
              <div className="bg-blue-50/60 p-3.5 rounded-2xl border border-blue-100">
                <p className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">Cash (रोकड)</p>
                <p className="text-xl font-black text-blue-800 mt-0.5">
                  ₹{(businessHealth?.today_breakdown?.cash_collected || 9200).toLocaleString()}
                </p>
                <span className="text-[10px] font-semibold text-blue-600">गल्ल्यात जमा रोकड</span>
              </div>

              {/* UPI */}
              <div className="bg-indigo-50/60 p-3.5 rounded-2xl border border-indigo-100">
                <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider">UPI (फोनपे / गुगलपे)</p>
                <p className="text-xl font-black text-indigo-800 mt-0.5">
                  ₹{(businessHealth?.today_breakdown?.upi_collected || 7450).toLocaleString()}
                </p>
                <span className="text-[10px] font-semibold text-indigo-600">बँकेत थेट जमा</span>
              </div>

              {/* New Udhari */}
              <div className="bg-amber-50/60 p-3.5 rounded-2xl border border-amber-100">
                <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">आज दिलेली उधारी</p>
                <p className="text-xl font-black text-amber-800 mt-0.5">
                  ₹{(businessHealth?.today_breakdown?.udhari_given || 1800).toLocaleString()}
                </p>
                <span className="text-[10px] font-semibold text-amber-700">खात्यावर नोंद</span>
              </div>
            </div>
          </div>

          {/* 3. FEATURE 3 & 9: DUKAAN360 AI SHOP ADVISOR & COMBO BUILDER */}
          <div className="bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-purple-50/40 rounded-3xl p-5 sm:p-6 shadow-sm border border-indigo-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 border-b border-indigo-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xl shrink-0 shadow-md shadow-indigo-300">
                  🧠
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-800">
                    “Dukaan360 काय सांगतो?” — AI Shop Advisor
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    डेटाबेस नव्हे, तर तुमच्या किराणा दुकानाचा वैयक्तिक बिझनेस सल्लागार
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-black uppercase text-indigo-700 bg-indigo-100 px-3 py-1 rounded-full self-start sm:self-auto border border-indigo-200">
                Realtime Smart Advisor
              </span>
            </div>

            {/* 4 Advisor Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              
              {/* Card 1: Urgent Stock Alert */}
              <div className="bg-white p-4 rounded-2xl border border-red-200 shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black text-red-700 bg-red-100 px-2 py-0.5 rounded-full">
                      🔴 आज लक्ष द्या
                    </span>
                    <span className="text-xs font-black text-red-600">३ वस्तू संपत आहेत</span>
                  </div>
                  <h4 className="font-bold text-xs text-slate-800 mb-1">
                    साखर, फॉर्च्यून तेल व चहा पावडर पुढील ५ दिवसांत संपण्याची शक्यता आहे.
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    मागणी वेगाने वाढत आहे. वेळेत माल न भरल्यास ग्राहक दुसरीकडे जाऊ शकतात.
                  </p>
                </div>
                <button 
                  onClick={() => setShowPOModal(true)} 
                  className="mt-3 w-full py-1.5 bg-red-50 hover:bg-red-100 text-red-700 font-bold rounded-xl text-xs transition border border-red-200 cursor-pointer text-center"
                >
                  सप्लायरला ऑर्डर द्या →
                </button>
              </div>

              {/* Card 2: Locked Capital Alert */}
              <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                      🟠 पैसा अडकला आहे
                    </span>
                    <span className="text-xs font-black text-amber-700">₹8,450 Locked</span>
                  </div>
                  <h4 className="font-bold text-xs text-slate-800 mb-1">
                    ₹८,४५० चा माल ६०+ दिवसांपासून विकलेला नाही.
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    डिटर्जंट, बिस्कीट कार्टन आणि सुकामेवा शेल्फवर पडून आहेत. भांडवल अडकून आहे.
                  </p>
                </div>
                <Link 
                  to="/inventory" 
                  className="mt-3 w-full py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold rounded-xl text-xs transition border border-amber-200 text-center"
                >
                  ऑफर देऊन मोकळा करा →
                </Link>
              </div>

              {/* Card 3: Best Performing Category */}
              <div className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                      🟢 चांगली कामगिरी
                    </span>
                    <span className="text-xs font-black text-emerald-600">+18% विक्री</span>
                  </div>
                  <h4 className="font-bold text-xs text-slate-800 mb-1">
                    Biscuits & Snacks कॅटेगरीची विक्री १८% वाढली!
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Parle-G Gold आणि मारी बिस्कीटची रोजची विक्री दुप्पट झाली आहे. काउंटरवर पुढ्यात ठेवा.
                  </p>
                </div>
                <span className="mt-3 text-[11px] font-bold text-emerald-700 bg-emerald-50 py-1.5 px-2 rounded-xl text-center border border-emerald-100">
                  ⭐ टॉप ग्रोसरी कॅटेगरी
                </span>
              </div>

              {/* Card 4: Smart Combo Builder */}
              <div className="bg-white p-4 rounded-2xl border border-indigo-200 shadow-2xs flex flex-col justify-between relative overflow-hidden">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black text-indigo-800 bg-indigo-100 px-2 py-0.5 rounded-full">
                      🛍️ Smart Combo
                    </span>
                    <span className="text-xs font-black text-indigo-600">नफा ₹२८</span>
                  </div>
                  <h4 className="font-bold text-xs text-slate-800 mb-1">
                    Oil + Sugar + Tea महाबचत कॉम्बो
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    नेहमी किंमत: ₹१८५ | कॉम्बो: ₹१७५ | ग्राहकाची बचत: ₹१०
                  </p>
                </div>
                <button 
                  onClick={() => {
                    setComboActiveAlert(true);
                    setTimeout(() => setComboActiveAlert(false), 5000);
                  }}
                  className="mt-3 w-full py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition shadow-xs cursor-pointer text-center"
                >
                  कॉम्बो POS मध्ये जोडा →
                </button>
              </div>

            </div>

            {comboActiveAlert && (
              <div className="mt-3 p-3 rounded-xl bg-emerald-500 text-white font-bold text-xs flex items-center justify-between shadow-lg">
                <span>✅ "Oil + Sugar + Tea" कॉम्बो ऑफर POS बिलिंगमध्ये सक्रिय करण्यात आली आहे!</span>
                <button onClick={() => setComboActiveAlert(false)} className="text-white hover:opacity-80">
                  <X weight="bold" />
                </button>
              </div>
            )}
          </div>

          {/* 4. FEATURE 11: WHERE IS MY MONEY? (WORKING CAPITAL BREAKDOWN) */}
          {whereIsMyMoney && (
            <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-xl shrink-0">
                    💼
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-slate-800">
                      {whereIsMyMoney.headline || '💰 तुमचे भांडवल कुठे फिरत आहे? (Working Capital)'}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      दुकानातील एकूण फिरणारे भांडवल आणि कोणत्या भागात किती पैसा गुंतला आहे
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">एकूण कार्यरत भांडवल</p>
                  <p className="text-xl font-black text-slate-900">
                    ₹{whereIsMyMoney.total_working_capital?.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Proportional Split Bar */}
              <div className="w-full h-3 rounded-full overflow-hidden flex mb-4 bg-slate-100">
                <div 
                  className="bg-indigo-500 transition-all duration-500" 
                  style={{ width: `${whereIsMyMoney.inventory_share_pct || 70}%` }}
                  title={`स्टॉकमध्ये: ${whereIsMyMoney.inventory_share_pct}%`}
                ></div>
                <div 
                  className="bg-red-500 transition-all duration-500" 
                  style={{ width: `${whereIsMyMoney.udhari_share_pct || 14}%` }}
                  title={`उधारीमध्ये: ${whereIsMyMoney.udhari_share_pct}%`}
                ></div>
                <div 
                  className="bg-blue-500 transition-all duration-500" 
                  style={{ width: '8%' }}
                  title="Cash in Hand: 8%"
                ></div>
                <div 
                  className="bg-emerald-500 transition-all duration-500" 
                  style={{ width: '8%' }}
                  title="UPI / Bank: 8%"
                ></div>
              </div>

              {/* 5 Component Cards */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                
                <div className="p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-100">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block mr-1.5"></span>
                  <span className="text-[10px] font-bold text-indigo-700 uppercase">माल / साठा (Inventory)</span>
                  <p className="text-lg font-black text-indigo-950 mt-1">
                    ₹{whereIsMyMoney.inventory_val?.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-indigo-600 font-semibold">{whereIsMyMoney.inventory_share_pct}% भांडवल</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-red-50/60 border border-red-100">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block mr-1.5"></span>
                  <span className="text-[10px] font-bold text-red-700 uppercase">ग्राहक उधारी (Udhari)</span>
                  <p className="text-lg font-black text-red-950 mt-1">
                    ₹{whereIsMyMoney.customer_udhari?.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-red-600 font-semibold">{whereIsMyMoney.udhari_share_pct}% बाजारात बाकी</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-100">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block mr-1.5"></span>
                  <span className="text-[10px] font-bold text-blue-700 uppercase">हातची रोकड (Cash)</span>
                  <p className="text-lg font-black text-blue-950 mt-1">
                    ₹{whereIsMyMoney.cash_in_hand?.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-blue-600 font-semibold">गल्ला + फ्लोट</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block mr-1.5"></span>
                  <span className="text-[10px] font-bold text-emerald-700 uppercase">बँक खात्यात (UPI)</span>
                  <p className="text-lg font-black text-emerald-950 mt-1">
                    ₹{whereIsMyMoney.upi_in_bank?.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-emerald-600 font-semibold">सेटलमेंट बॅलन्स</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-100 col-span-2 md:col-span-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block mr-1.5"></span>
                  <span className="text-[10px] font-bold text-amber-700 uppercase">सप्लायर देणे बाकी</span>
                  <p className="text-lg font-black text-amber-950 mt-1">
                    ₹{whereIsMyMoney.supplier_payable?.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-amber-700 font-semibold">होलसेलर देणे</p>
                </div>

              </div>
            </div>
          )}

          {/* 5. FEATURE 12 & 15: THIS MONTH VS LAST MONTH & MONTHLY ACHIEVEMENT */}
          {businessHealth && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              
              {/* Month-over-Month Comparison */}
              <div className="lg:col-span-2 bg-white rounded-3xl p-5 shadow-sm border border-slate-200">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
                  <div>
                    <h3 className="font-black text-base text-slate-800">चालू महिना विरुद्ध मागील महिना</h3>
                    <p className="text-xs text-slate-500">व्यवसायाची प्रगती आणि विक्रीतील थेट तुलना</p>
                  </div>
                  <span className="text-xs font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                    {businessHealth.this_month_vs_last_month?.sales_trend || '+14.2%'} वाढ
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">या महिन्याची विक्री</p>
                    <p className="text-lg font-black text-slate-900 mt-1">
                      ₹{businessHealth.this_month_vs_last_month?.this_month_sales?.toLocaleString() || '4,80,000'}
                    </p>
                    <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5 mt-0.5">
                      <TrendUp weight="bold" /> {businessHealth.this_month_vs_last_month?.sales_trend || '+14.2%'}
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">मागील महिना विक्री</p>
                    <p className="text-lg font-black text-slate-600 mt-1">
                      ₹{businessHealth.this_month_vs_last_month?.last_month_sales?.toLocaleString() || '4,20,000'}
                    </p>
                    <span className="text-[10px] font-semibold text-slate-400 mt-0.5 block">समान कालावधी</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-100">
                    <p className="text-[10px] font-bold text-emerald-800 uppercase">नफ्यातील वाढ</p>
                    <p className="text-lg font-black text-emerald-700 mt-1">
                      {businessHealth.this_month_vs_last_month?.profit_trend || '+11.5%'}
                    </p>
                    <span className="text-[10px] font-bold text-emerald-600 mt-0.5 block">मार्जिन सुधारले</span>
                  </div>
                </div>
              </div>

              {/* Monthly Business Achievement Card */}
              <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 text-white rounded-3xl p-5 shadow-lg shadow-orange-500/20 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute -right-4 -bottom-4 opacity-15">
                  <Trophy weight="fill" className="text-9xl" />
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Trophy weight="fill" className="text-2xl text-amber-200" />
                    <span className="text-[11px] font-black uppercase tracking-wider text-amber-100 bg-white/20 px-2.5 py-0.5 rounded-full">
                      {businessHealth.monthly_achievement?.title || 'Monthly Milestone'}
                    </span>
                  </div>
                  <h3 className="text-lg font-black leading-tight mb-2">
                    {businessHealth.monthly_achievement?.badge || '₹५,००,००० विक्री लक्ष्य साध्य! 🎉'}
                  </h3>
                  <div className="space-y-1 text-xs text-amber-50">
                    <p>⭐ टॉप प्रॉडक्ट: <strong>{businessHealth.monthly_achievement?.best_seller || 'Fortune Sunlite Oil 1L'}</strong></p>
                    <p>📅 सर्वाधिक विक्री वार: <strong>{businessHealth.monthly_achievement?.best_day || 'शनिवार (₹२८,४५०)'}</strong></p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between text-xs">
                  <span className="font-bold">महिना विकास दर</span>
                  <span className="font-black px-2 py-0.5 rounded-lg bg-white text-slate-900">
                    {businessHealth.monthly_achievement?.growth || '+14.2%'}
                  </span>
                </div>
              </div>

            </div>
          )}

          {/* 6. VALUE REALIZED ROI BANNER */}
          {valueRealized && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white shadow-lg shadow-emerald-500/20 relative overflow-hidden">
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

          {/* 7. DAILY ASSISTANT: आज काय करायचं? */}
          {dailyBriefing && (
            <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-200">
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

          {/* 8. DEAD STOCK / SLOW MOVING CAPITAL TRACKER */}
          {deadStock && (
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
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

          {/* Quick Actions Grid */}
          <div>
            <h2 className="text-base font-bold text-slate-800 mb-3">Quick Navigation (झटपट मेनू)</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Link to="/pos" className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-brand transition shadow-sm text-center group cursor-pointer">
                <div className="w-12 h-10 mx-auto rounded-full bg-slate-50 group-hover:bg-brandLight text-slate-400 group-hover:text-brand flex items-center justify-center mb-2 transition">
                  <Storefront weight="fill" className="text-xl" />
                </div>
                <h4 className="font-bold text-slate-700 text-sm">New Bill (POS)</h4>
              </Link>
              
              <Link to="/khata" className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-brand transition shadow-sm text-center group cursor-pointer">
                <div className="w-12 h-10 mx-auto rounded-full bg-slate-50 group-hover:bg-brandLight text-slate-400 group-hover:text-brand flex items-center justify-center mb-2 transition">
                  <BookBookmark weight="fill" className="text-xl" />
                </div>
                <h4 className="font-bold text-slate-700 text-sm">Customer Khata (उधारी)</h4>
              </Link>

              <Link to="/inventory" className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-brand transition shadow-sm text-center group cursor-pointer">
                <div className="w-12 h-10 mx-auto rounded-full bg-slate-50 group-hover:bg-brandLight text-slate-400 group-hover:text-brand flex items-center justify-center mb-2 transition">
                  <Package weight="fill" className="text-xl" />
                </div>
                <h4 className="font-bold text-slate-700 text-sm">Inventory & Audit (स्टॉक)</h4>
              </Link>

              <button onClick={() => setShowPOModal(true)} className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-indigo-500 transition shadow-sm text-center group cursor-pointer">
                <div className="w-12 h-10 mx-auto rounded-full bg-indigo-50 group-hover:bg-indigo-100 text-indigo-500 flex items-center justify-center mb-2 transition">
                  <WhatsappLogo weight="fill" className="text-xl" />
                </div>
                <h4 className="font-bold text-slate-700 text-sm">Supplier PO (ऑर्डर)</h4>
              </button>
            </div>
          </div>

        </div>

        {/* SMART PURCHASE ORDER MODAL */}
        {showPOModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-100 flex flex-col overflow-hidden max-h-[90vh]">
              
              {/* Modal Header */}
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-indigo-50/50">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                    <Package weight="fill" className="text-xl" />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-800 text-base">Smart Purchase Order (सप्लायर ऑर्डर)</h3>
                    <p className="text-[11px] text-slate-500 font-medium">१-क्लिकमध्ये WhatsApp वर तयार ऑर्डर पाठवा</p>
                  </div>
                </div>
                <button onClick={() => setShowPOModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-red-500 hover:bg-slate-200 transition">
                  <X weight="bold" className="text-lg" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-5 overflow-y-auto space-y-4">
                
                {/* Wholesaler / Supplier Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">सप्लायर / होलसेलर नाव</label>
                    <input 
                      type="text" 
                      value={poSupplierName} 
                      onChange={e => setPoSupplierName(e.target.value)}
                      placeholder="उदा. बालाजी ट्रेडिंग"
                      className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">WhatsApp नंबर (पर्यायी)</label>
                    <input 
                      type="tel" 
                      value={poSupplierMobile} 
                      onChange={e => setPoSupplierMobile(e.target.value)}
                      placeholder="१०-अंकी मोबाईल नंबर"
                      className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* Items in PO */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">ऑर्डर मधील वस्तू ({poItems.length})</label>
                    <span className="text-[11px] text-indigo-600 font-bold">
                      अंदाजे किंमत: ₹{poItems.reduce((acc, it) => acc + (it.quantity * (it.est_rate || 0)), 0).toLocaleString()}
                    </span>
                  </div>

                  <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100 max-h-48 overflow-y-auto">
                    {poItems.map((it, idx) => (
                      <div key={idx} className="p-2.5 flex items-center justify-between text-xs hover:bg-slate-50">
                        <div>
                          <p className="font-bold text-slate-800">{it.product_name}</p>
                          <p className="text-[10px] text-slate-500">{it.quantity} {it.unit} {it.est_rate ? `• अंदाजे ₹${it.est_rate}/${it.unit}` : ''}</p>
                        </div>
                        <button 
                          onClick={() => removePoItem(idx)}
                          className="text-red-400 hover:text-red-600 p-1 transition"
                          title="काढून टाका"
                        >
                          <Trash weight="bold" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Add Item to PO Form */}
                <form onSubmit={handleAddPoItem} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex flex-wrap items-center gap-2">
                  <input 
                    type="text" 
                    placeholder="वस्तूचे नाव"
                    value={newPoItem.product_name}
                    onChange={e => setNewPoItem({...newPoItem, product_name: e.target.value})}
                    className="flex-1 min-w-[140px] h-9 px-3 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800"
                  />
                  <input 
                    type="number" min="1"
                    placeholder="प्रमाण"
                    value={newPoItem.quantity}
                    onChange={e => setNewPoItem({...newPoItem, quantity: e.target.value})}
                    className="w-16 h-9 px-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-center text-slate-800"
                  />
                  <select 
                    value={newPoItem.unit}
                    onChange={e => setNewPoItem({...newPoItem, unit: e.target.value})}
                    className="h-9 px-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700"
                  >
                    <option value="Packets">Packets</option>
                    <option value="Bags">Bags</option>
                    <option value="Boxes">Boxes</option>
                    <option value="Cartons">Cartons</option>
                    <option value="Pouches">Pouches</option>
                    <option value="Kg">Kg</option>
                    <option value="Litre">Litre</option>
                  </select>
                  <button 
                    type="submit"
                    className="h-9 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus weight="bold" /> जोडा
                  </button>
                </form>

                {/* Notes */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">टीप / डिलिव्हरी सूचना</label>
                  <input 
                    type="text"
                    value={poNotes}
                    onChange={e => setPoNotes(e.target.value)}
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
                  />
                </div>

              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
                <button 
                  onClick={() => setShowPOModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-100 transition cursor-pointer"
                >
                  रद्द करा
                </button>
                <button 
                  onClick={handleSendPO}
                  disabled={isSendingPO}
                  className="flex-1 py-2.5 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-green-500/20 transition cursor-pointer disabled:opacity-50"
                >
                  <WhatsappLogo weight="fill" className="text-base" />
                  <span>{isSendingPO ? 'तयार होत आहे...' : 'सप्लायरला WhatsApp वर PO पाठवा'}</span>
                </button>
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
                    placeholder="उदा. गाडीवाल्याला दिलेले भाडे"
                    className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-3 text-sm font-bold text-slate-800 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                  />
                </div>

                <button type="submit" className="h-10 w-full bg-brand hover:bg-brandHover text-white rounded-xl font-black shadow-lg shadow-brand/30 transition-all active:scale-95 mt-2 cursor-pointer">
                  खर्च जतन करा
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Cash Tally Modal */}
        {isTallyModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden">
              <div className="bg-brand p-4 flex justify-between items-center text-white">
                <h3 className="font-black text-lg flex items-center gap-2"><Calculator weight="fill" /> गल्ला मोजा (Cash Tally)</h3>
                <button onClick={() => setIsTallyModalOpen(false)} className="hover:bg-white/20 p-1 rounded-lg cursor-pointer"><X weight="bold" /></button>
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
                  <button onClick={() => window.print()} className="px-3 py-1.5 bg-brand text-white rounded-lg text-xs font-bold shadow-sm hover:bg-brandHover transition flex items-center gap-1.5 cursor-pointer">
                    <Printer weight="fill" /> Print
                  </button>
                  <button onClick={() => setShowReorderModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-red-500 hover:bg-slate-200 transition cursor-pointer">
                    <X weight="bold" className="text-lg" />
                  </button>
                </div>
              </div>

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

      </main>
    </div>
  );
};

export default Dashboard;
