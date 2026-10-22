import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import { getAuthHeaders } from '../services/api';
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
  Plus,
  Lightning,
  CheckCircle,
  CaretDown,
  Check
} from '@phosphor-icons/react';
import { Link } from 'react-router-dom';

const EXPENSE_CATEGORIES = [
  { value: 'Tea & Snacks', label: 'Tea & Snacks (चहापाणी)', icon: '☕' },
  { value: 'Transport', label: 'Transport (गाडी भाडे)', icon: '🚚' },
  { value: 'Wages', label: 'Wages (मजुरी)', icon: '👷' },
  { value: 'Supplier Payment', label: 'Supplier Payment (व्यापारी पेमेंट)', icon: '🏢' },
  { value: 'Electricity / Bills', label: 'Electricity / Bills (बिले)', icon: '⚡' },
  { value: 'Other', label: 'Other (इतर)', icon: '📦' }
];

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
  const [isExpenseCatOpen, setIsExpenseCatOpen] = useState(false);

  // Smart Purchase Order State
  const [showPOModal, setShowPOModal] = useState(false);
  const [poSupplierName, setPoSupplierName] = useState('');
  const [poSupplierMobile, setPoSupplierMobile] = useState('');
  const [poItems, setPoItems] = useState([]);
  const [newPoItem, setNewPoItem] = useState({ product_name: '', quantity: '', unit: 'Packets', est_rate: '' });
  const [poNotes, setPoNotes] = useState('');
  const [isSendingPO, setIsSendingPO] = useState(false);
  const [downloadingBackup, setDownloadingBackup] = useState(false);

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!expenseData.amount || expenseData.amount <= 0) return alert('Enter a valid amount');
    
    try {
      await axios.post('http://localhost:8000/expenses/', {
        category: expenseData.category,
        amount: parseFloat(expenseData.amount),
        description: expenseData.description
      }, { headers: getAuthHeaders() });
      alert('Expense added successfully!');
      setShowExpenseModal(false);
      setIsExpenseCatOpen(false);
      setExpenseData({ category: 'Tea & Snacks', amount: '', description: '' });
      // Re-fetch summary
      const res = await axios.get('http://localhost:8000/dashboard/summary/', { headers: getAuthHeaders() });
      setSummary(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to add expense');
    }
  };

  const handlePrintReorder = async () => {
    try {
      const [prodRes, batchRes] = await Promise.all([
        axios.get('http://localhost:8000/products/', { headers: getAuthHeaders() }),
        axios.get('http://localhost:8000/stock/batches/', { headers: getAuthHeaders() })
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
      const res = await axios.post('http://localhost:8000/inventory/purchase-order', payload, { headers: getAuthHeaders() });
      alert(`ऑर्डर तयार झाली आहे! आता WhatsApp वर पाठवत आहोत.`);
      if (res.data?.whatsapp_url) {
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
    const fetchSummary = async () => {
      try {
        const res = await axios.get('http://localhost:8000/dashboard/summary/', { headers: getAuthHeaders() });
        setSummary(res.data);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7] relative overflow-x-hidden selection:bg-brand selection:text-white">
      {/* Ambient Mesh Glow Blobs matching screenshot */}
      <div className="absolute -top-24 -left-20 w-96 h-96 bg-gradient-to-tr from-amber-200/50 via-orange-200/40 to-transparent rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-20 right-0 w-[450px] h-[450px] bg-gradient-to-bl from-teal-200/40 via-cyan-100/30 to-transparent rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 left-1/4 w-[500px] h-[500px] bg-gradient-to-tr from-orange-100/40 via-amber-100/30 to-transparent rounded-full blur-3xl pointer-events-none"></div>

      <Header onMenuClick={() => {}} />

      <main className="flex-1 overflow-y-auto p-4 lg:p-8 relative z-10">
        <div className="max-w-6xl mx-auto space-y-6">
          
          {/* Top Bar with Title and Actions */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3">
            <div>
              <h1 className="text-base sm:text-xl font-black text-slate-800 tracking-tight">Store Dashboard</h1>
              <p className="text-slate-500 font-semibold text-[11px] sm:text-xs mt-0.5">Overview of your retail business • व्यवसायाची सद्यस्थिती</p>
            </div>
            
            <div className="flex flex-col items-start lg:items-end gap-2 w-full lg:w-auto">
              {/* Row 1: Action pills */}
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <button 
                  onClick={() => setShowPOModal(true)} 
                  className="bg-white/95 backdrop-blur-sm border border-slate-200/90 hover:bg-white text-slate-700 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 shadow-xs transition hover:shadow-sm text-[11px] sm:text-xs cursor-pointer"
                >
                  <Package weight="fill" className="text-indigo-600 text-sm" />
                  <span>Smart PO</span>
                </button>
                <button 
                  onClick={() => { setShowExpenseModal(true); setIsExpenseCatOpen(false); }} 
                  className="bg-white/95 backdrop-blur-sm border border-slate-200/90 hover:bg-white text-slate-700 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 shadow-xs transition hover:shadow-sm text-[11px] sm:text-xs cursor-pointer"
                >
                  <Plus weight="bold" className="text-emerald-600 text-xs" />
                  <span>खर्च नोंदवा</span>
                </button>
                <button 
                  onClick={() => setIsTallyModalOpen(true)} 
                  className="bg-white/95 backdrop-blur-sm border border-slate-200/90 hover:bg-white text-slate-700 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 shadow-xs transition hover:shadow-sm text-[11px] sm:text-xs cursor-pointer"
                >
                  <Calculator weight="fill" className="text-orange-500 text-sm" />
                  <span>गल्ला मोजा</span>
                </button>
                <button 
                  onClick={handleEndOfDayReport} 
                  className="bg-[#FDECE2] border border-[#F8D2BD] hover:bg-orange-100 text-orange-950 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 shadow-xs transition hover:shadow-sm text-[11px] sm:text-xs cursor-pointer"
                >
                  <ChartLineUp weight="bold" className="text-orange-600 text-sm" />
                  <span>गल्ला बंद</span>
                </button>
                <button 
                  onClick={handleDownloadMyBackupPdf} 
                  disabled={downloadingBackup}
                  className="bg-[#EDF2F7] border border-slate-200/90 hover:bg-slate-100 text-slate-700 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 shadow-xs transition hover:shadow-sm text-[11px] sm:text-xs cursor-pointer disabled:opacity-50"
                  title="PDF बॅकअप डाऊनलोड करा"
                >
                  <FileText weight="fill" className="text-indigo-500 text-sm" />
                  <span>{downloadingBackup ? '...' : 'PDF बॅकअप'}</span>
                </button>
              </div>

              {/* Row 2: Prominent Glowing Go to POS Button */}
              <Link 
                to="/pos" 
                className="bg-gradient-to-r from-[#FF5722] via-[#FF6E40] to-[#FFA726] text-white px-4 py-2 rounded-xl font-black flex items-center gap-2 shadow-md shadow-orange-500/30 hover:scale-[1.01] active:scale-95 transition text-xs sm:text-sm"
              >
                <Storefront weight="fill" className="text-sm" />
                <span>Go to POS (नवीन बिल बनवा)</span>
                <Lightning weight="fill" className="text-amber-300 text-sm" />
              </Link>
            </div>
          </div>

          {loading ? (
            <p className="text-center text-slate-400 py-16 font-bold text-xs sm:text-sm">डॅशबोर्ड लोड होत आहे...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              
              {/* 1. Today's Sales (आजचा गल्ला) */}
              <div className="bg-gradient-to-br from-[#064E43] via-[#09574B] to-[#04332C] text-white p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl shadow-lg border border-emerald-400/20 relative overflow-hidden flex flex-col justify-between min-h-[120px] group transition-all">
                <div className="relative z-10">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 shrink-0 shadow-inner">
                      <ChartLineUp weight="bold" className="text-base" />
                    </div>
                    <div>
                      <p className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-200/80">TODAY'S SALES (आजचा गल्ला)</p>
                      <h3 className="text-base sm:text-lg font-black text-white tracking-tight mt-0.5">₹{(summary.today_sales || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
                    </div>
                  </div>
                </div>
                <div className="relative z-10 mt-2">
                  <span className="text-[11px] font-semibold text-emerald-200/70">आजची एकूण बिलिंग</span>
                </div>
                {/* Emerald Wave Sparkline */}
                <div className="absolute right-2 bottom-2 w-28 h-12 pointer-events-none select-none">
                  <svg viewBox="0 0 120 40" fill="none" className="w-full h-full text-emerald-400">
                    <path d="M0 32 Q 20 38, 35 18 T 70 24 T 95 8 T 120 28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
                    <path d="M0 32 Q 20 38, 35 18 T 70 24 T 95 8 T 120 28 L 120 40 L 0 40 Z" fill="currentColor" opacity="0.1" />
                  </svg>
                </div>
              </div>

              {/* 2. Today's Net Profit (आजचा नफा) */}
              <div className="bg-gradient-to-br from-[#F5D5C6] via-[#E8B49B] to-[#D99A82] text-stone-900 p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl shadow-lg border border-white/60 relative overflow-hidden flex flex-col justify-between min-h-[120px] group transition-all">
                <div className="relative z-10">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-white/40 border border-white/60 flex items-center justify-center text-[#9A3412] font-black text-base shrink-0 shadow-inner">
                      ₹
                    </div>
                    <div>
                      <p className="text-[10px] font-extrabold uppercase tracking-wider text-stone-800">TODAY'S NET PROFIT (आजचा नफा)</p>
                      <h3 className="text-base sm:text-lg font-black text-stone-900 tracking-tight mt-0.5">₹{(summary.today_profit || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
                    </div>
                  </div>
                </div>
                <div className="relative z-10 mt-2">
                  <span className="text-[11px] font-semibold text-stone-700">खर्च व खरेदी किंमत वजा जाता</span>
                </div>
                {/* Stylized Rupee Watermark */}
                <span className="absolute -right-1 top-1 text-6xl font-black text-white/50 select-none pointer-events-none">
                  ₹
                </span>
              </div>

              {/* 3. Market Due (बाजार उधारी) */}
              <div className="bg-white/95 backdrop-blur-md text-slate-800 p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl shadow-lg border border-slate-200/80 relative overflow-hidden flex flex-col justify-between min-h-[120px] group transition-all">
                <div className="relative z-10">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 shrink-0 shadow-inner">
                      <BookBookmark weight="fill" className="text-base" />
                    </div>
                    <div>
                      <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">MARKET DUE (बाजार उधारी)</p>
                      <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight mt-0.5">₹{(summary.total_due || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
                    </div>
                  </div>
                </div>
                <div className="relative z-10 mt-2">
                  <span className="text-[11px] font-medium text-slate-400">ग्राहकांकडून येणे बाकी रक्कम</span>
                </div>
              </div>

              {/* 4. Inventory Value (माल गुंतवणूक) */}
              <div className="bg-gradient-to-br from-[#2D1B69] via-[#351A7E] to-[#1C0D45] text-white p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl shadow-lg border border-purple-400/20 relative overflow-hidden flex flex-col justify-between min-h-[120px] group transition-all">
                <div className="relative z-10">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300 shrink-0 shadow-inner">
                      <Package weight="fill" className="text-base" />
                    </div>
                    <div>
                      <p className="text-[10px] font-extrabold uppercase tracking-wider text-purple-200/80">INVENTORY VALUE (माल गुंतवणूक)</p>
                      <h3 className="text-base sm:text-lg font-black text-white tracking-tight mt-0.5">₹{(summary.total_inventory_value || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
                    </div>
                  </div>
                </div>
                <div className="relative z-10 mt-2">
                  <span className="text-[11px] font-semibold text-purple-200/70">शिल्लक साठ्याची खरेदी किंमत</span>
                </div>
                {/* 3D Stacked Boxes Graphic */}
                <div className="absolute right-2 bottom-1 opacity-20 pointer-events-none select-none text-purple-300">
                  <svg width="60" height="60" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3">
                    <polygon points="50,15 88,34 50,53 12,34" fill="rgba(255,255,255,0.12)" />
                    <polygon points="12,34 50,53 50,92 12,73" fill="rgba(255,255,255,0.06)" />
                    <polygon points="88,34 50,53 50,92 88,73" fill="rgba(255,255,255,0.18)" />
                  </svg>
                </div>
              </div>

              {/* 5. Low Stock Alerts (माल संपत आला आहे) */}
              <div className="bg-gradient-to-br from-[#E2B777] via-[#D49E55] to-[#C4893F] text-stone-900 p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl shadow-lg border border-white/50 relative overflow-hidden flex flex-col justify-between min-h-[120px] group transition-all">
                <div className="relative z-10">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-white/40 border border-white/60 flex items-center justify-center text-red-600 shrink-0 shadow-inner">
                      <Warning weight="fill" className="text-base" />
                    </div>
                    <div>
                      <p className="text-[10px] font-extrabold uppercase tracking-wider text-stone-900">LOW STOCK ALERTS</p>
                      <h3 className="text-base sm:text-lg font-black text-stone-950 tracking-tight mt-0.5">{(summary.low_stock_alerts || 0)} Items</h3>
                    </div>
                  </div>
                </div>
                <div className="relative z-10 mt-2">
                  <span className="text-[11px] font-semibold text-stone-800">१० पेक्षा कमी शिल्लक आयटम</span>
                </div>
                {/* Print Button Pill on Right */}
                <button 
                  onClick={handlePrintReorder} 
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-white hover:bg-white/95 text-stone-800 rounded-xl p-2 px-2.5 flex flex-col items-center justify-center shadow-xs transition hover:scale-105 active:scale-95 border border-white/80 cursor-pointer"
                  title="Print Reorder List"
                >
                  <Printer weight="fill" className="text-red-500 text-base mb-0.5" />
                  <span className="text-[8px] font-black text-stone-800 tracking-wider">PRINT</span>
                </button>
              </div>

              {/* 6. Total Customers (एकूण ग्राहक) */}
              <div className="bg-gradient-to-br from-[#1E3A8A] via-[#1E293B] to-[#0F172A] text-white p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl shadow-lg border border-blue-400/20 relative overflow-hidden flex flex-col justify-between min-h-[120px] group transition-all">
                <div className="relative z-10">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300 shrink-0 shadow-inner">
                      <Users weight="fill" className="text-base" />
                    </div>
                    <div>
                      <p className="text-[10px] font-extrabold uppercase tracking-wider text-blue-200/80">TOTAL CUSTOMERS (एकूण ग्राहक)</p>
                      <h3 className="text-base sm:text-lg font-black text-white tracking-tight mt-0.5">{(summary.total_customers || 0)}</h3>
                    </div>
                  </div>
                </div>
                <div className="relative z-10 mt-2">
                  <span className="text-[11px] font-semibold text-blue-200/70">खातेवहीत नोंद असलेले ग्राहक</span>
                </div>
                {/* Checkmark Graphic */}
                <div className="absolute right-2 bottom-1 opacity-15 pointer-events-none select-none text-blue-300">
                  <CheckCircle weight="fill" className="text-5xl" />
                </div>
              </div>
              
            </div>
          )}

          {/* Quick Navigation (झटपट मेनू) */}
          <div className="pt-1">
            <h2 className="text-sm sm:text-base font-black text-slate-800 mb-2.5">Quick Navigation (झटपट मेनू)</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
              
              <Link to="/pos" className="bg-white/95 backdrop-blur-sm p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl border border-slate-200/80 hover:border-brand hover:shadow-lg transition shadow-2xs flex flex-col items-center text-center group cursor-pointer">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-[#FF5722] to-[#FF8A65] text-white flex items-center justify-center mb-2 shadow-md shadow-orange-500/25 group-hover:scale-105 transition">
                  <Storefront weight="fill" className="text-xl" />
                </div>
                <h4 className="font-black text-slate-800 text-xs sm:text-sm">New Bill (POS)</h4>
                <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium mt-0.5">नवीन बिल बनवा</p>
              </Link>
              
              <Link to="/khata" className="bg-white/95 backdrop-blur-sm p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl border border-slate-200/80 hover:border-blue-500 hover:shadow-lg transition shadow-2xs flex flex-col items-center text-center group cursor-pointer">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center mb-2 shadow-md shadow-blue-500/25 group-hover:scale-105 transition">
                  <BookBookmark weight="fill" className="text-xl" />
                </div>
                <h4 className="font-black text-slate-800 text-xs sm:text-sm">Customer Khata</h4>
                <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium mt-0.5">ग्राहक खातेवही व उधारी</p>
              </Link>

              <Link to="/inventory" className="bg-white/95 backdrop-blur-sm p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl border border-slate-200/80 hover:border-slate-800 hover:shadow-lg transition shadow-2xs flex flex-col items-center text-center group cursor-pointer">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-slate-700 to-slate-900 text-white flex items-center justify-center mb-2 shadow-md shadow-slate-700/25 group-hover:scale-105 transition">
                  <Package weight="fill" className="text-xl" />
                </div>
                <h4 className="font-black text-slate-800 text-xs sm:text-sm">Inventory Stock</h4>
                <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium mt-0.5">स्टॉक व्यवस्थापन</p>
              </Link>

              <button onClick={() => setShowPOModal(true)} className="bg-white/95 backdrop-blur-sm p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl border border-slate-200/80 hover:border-emerald-500 hover:shadow-lg transition shadow-2xs flex flex-col items-center text-center group cursor-pointer">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center mb-2 shadow-md shadow-emerald-500/25 group-hover:scale-105 transition">
                  <WhatsappLogo weight="fill" className="text-xl" />
                </div>
                <h4 className="font-black text-slate-800 text-xs sm:text-sm">Supplier PO</h4>
                <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium mt-0.5">WhatsApp सप्लायर ऑर्डर</p>
              </button>

            </div>
          </div>

          {/* Floating Online Badge matching bottom-left */}
          <div className="fixed bottom-4 left-4 z-20 hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-500/30 select-none">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
            <span>+ Online / सक्रिय</span>
          </div>

        </div>

        {/* Wholesale Reorder List Modal */}
        {showReorderModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-start justify-center p-4 pt-20 sm:pt-24 overflow-y-auto">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-100 flex flex-col overflow-hidden max-h-[calc(100vh-120px)]">
              
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 no-print">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center">
                    <Warning weight="fill" className="text-xl" />
                  </div>
                  <h3 className="font-bold text-slate-800 text-base">Wholesale Reorder List (खरेदीची यादी)</h3>
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

              {/* Printable Content */}
              <div className="p-6 overflow-y-auto print-receipt bg-white">
                <div className="hidden print:block text-center mb-6 border-b-2 border-black border-dashed pb-4">
                  <h1 className="font-black text-2xl uppercase tracking-widest mb-1">DUKAAN360</h1>
                  <h2 className="font-bold text-lg mb-2">Reorder List / खरेदीची यादी</h2>
                  <p className="text-sm font-bold">Date: {new Date().toLocaleDateString('en-IN')}</p>
                </div>
                
                {lowStockItems.length === 0 ? (
                  <p className="text-center py-10 text-slate-500 font-bold">कोणत्याही वस्तूचा साठा कमी नाही!</p>
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
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-start justify-center p-4 pt-24 sm:pt-28 overflow-y-auto">
            <div className="bg-white rounded-[32px] w-full max-w-sm sm:max-w-md shadow-2xl border border-slate-100 p-6 flex flex-col relative overflow-visible animate-scale-up">
              
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  {/* 3D Leather Wallet Graphic */}
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/25 shrink-0 select-none">
                    <svg className="w-8 h-8 select-none" viewBox="0 0 36 36" fill="none">
                      <rect x="10" y="6" width="16" height="10" rx="1.5" fill="#34D399" transform="rotate(-6 10 6)" />
                      <rect x="13" y="8" width="16" height="10" rx="1.5" fill="#10B981" />
                      <rect x="4" y="11" width="28" height="20" rx="4" fill="#9A3412" />
                      <rect x="4" y="14" width="28" height="17" rx="3.5" fill="#C2410C" />
                      <path d="M22 17H32V25H22C19.7909 25 18 23.2091 18 21C18 18.7909 19.7909 17 22 17Z" fill="#7C2D12" />
                      <circle cx="27" cy="21" r="2" fill="#FDE047" stroke="#CA8A04" strokeWidth="0.5" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-black text-xl text-slate-900 leading-tight">Add Expense</h3>
                    <p className="text-xs font-bold text-slate-500 mt-0.5">दुकानचा खर्च</p>
                  </div>
                </div>

                <button 
                  onClick={() => { setShowExpenseModal(false); setIsExpenseCatOpen(false); }}
                  className="w-8 h-8 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full flex items-center justify-center transition cursor-pointer"
                >
                  <X weight="bold" className="text-base" />
                </button>
              </div>
              
              <form onSubmit={handleAddExpense} className="flex flex-col gap-4">
                {/* Category Field */}
                <div className="relative">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1.5">
                    CATEGORY
                  </label>
                  
                  {/* Category Trigger Button */}
                  <button
                    type="button"
                    onClick={() => setIsExpenseCatOpen(!isExpenseCatOpen)}
                    className={`w-full flex items-center justify-between bg-slate-50/80 border ${
                      isExpenseCatOpen ? 'border-[#FF5722] ring-2 ring-[#FF5722]/15 bg-white' : 'border-slate-200/90 hover:border-slate-300'
                    } rounded-2xl h-12 px-3.5 transition text-left cursor-pointer select-none`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-xl select-none shrink-0 drop-shadow-sm">
                        {(EXPENSE_CATEGORIES.find(c => c.value === expenseData.category) || EXPENSE_CATEGORIES[0]).icon}
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-slate-800 truncate">
                        {(EXPENSE_CATEGORIES.find(c => c.value === expenseData.category) || EXPENSE_CATEGORIES[0]).label}
                      </span>
                    </div>
                    <div className={`transition-transform duration-200 text-slate-400 font-bold ${isExpenseCatOpen ? 'rotate-180 text-[#FF5722]' : ''}`}>
                      <CaretDown weight="bold" className="text-xs" />
                    </div>
                  </button>

                  {/* Backdrop for outside click */}
                  {isExpenseCatOpen && (
                    <div 
                      className="fixed inset-0 z-20" 
                      onClick={() => setIsExpenseCatOpen(false)} 
                    />
                  )}

                  {/* Centered / Aligned Custom Dropdown Menu */}
                  {isExpenseCatOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 z-30 bg-white/98 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-2xl p-1.5 flex flex-col gap-1 animate-scale-up">
                      {EXPENSE_CATEGORIES.map((cat) => {
                        const isSelected = expenseData.category === cat.value;
                        return (
                          <button
                            key={cat.value}
                            type="button"
                            onClick={() => {
                              setExpenseData({ ...expenseData, category: cat.value });
                              setIsExpenseCatOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer select-none ${
                              isSelected 
                                ? 'bg-orange-50 text-[#FF5722] font-black' 
                                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span className="w-8 h-8 rounded-xl bg-slate-100/80 flex items-center justify-center text-lg shrink-0">
                                {cat.icon}
                              </span>
                              <span>{cat.label}</span>
                            </div>
                            {isSelected && (
                              <Check weight="bold" className="text-[#FF5722] text-sm shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Amount Field */}
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1.5">
                    AMOUNT (₹)
                  </label>
                  <div className="relative flex items-center">
                    <input 
                      type="number" step="any" required min="1"
                      value={expenseData.amount}
                      onChange={(e) => setExpenseData({...expenseData, amount: e.target.value})}
                      placeholder="Enter amount"
                      className="w-full h-12 pl-4 pr-12 bg-slate-50/80 border border-slate-200/90 rounded-2xl text-sm font-black text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand focus:bg-white transition"
                    />
                    <div className="absolute right-3 w-7 h-7 rounded-xl bg-slate-200/70 text-slate-600 flex items-center justify-center text-xs font-black pointer-events-none select-none">
                      ₹
                    </div>
                  </div>
                </div>

                {/* Description Field */}
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1.5">
                    DESCRIPTION (OPTIONAL)
                  </label>
                  <div className="relative flex items-center">
                    <input 
                      type="text"
                      value={expenseData.description}
                      onChange={(e) => setExpenseData({...expenseData, description: e.target.value})}
                      placeholder="e.g. Paid to driver"
                      className="w-full h-12 pl-4 pr-12 bg-slate-50/80 border border-slate-200/90 rounded-2xl text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand focus:bg-white transition"
                    />
                    <div className="absolute right-3.5 select-none pointer-events-none text-slate-400">
                      <svg className="w-5 h-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Save Expense Button */}
                <button 
                  type="submit" 
                  className="w-full h-12 rounded-2xl bg-gradient-to-r from-[#FF5722] via-[#FF6E40] to-[#FF8A65] hover:opacity-95 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-orange-500/30 active:scale-98 transition cursor-pointer mt-2"
                >
                  <span>Save Expense</span>
                  <span className="text-base font-black tracking-tighter">»</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Cash Tally Modal */}
        {isTallyModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-start justify-center p-4 pt-24 sm:pt-28 overflow-y-auto">
            <div className="bg-white rounded-[32px] w-full max-w-sm sm:max-w-md shadow-2xl border border-slate-100 p-6 flex flex-col relative animate-scale-up">
              
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  {/* 3D Calculator Graphic */}
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600 flex items-center justify-center shadow-lg shadow-orange-500/25 shrink-0 select-none p-2.5">
                    <svg className="w-full h-full select-none" viewBox="0 0 28 28" fill="none">
                      <rect x="4" y="2" width="20" height="24" rx="4" fill="#C2410C" />
                      <rect x="4" y="2" width="20" height="22" rx="4" fill="#EA580C" />
                      <rect x="5" y="3" width="18" height="20" rx="3.5" fill="#FB923C" />
                      {/* Screen */}
                      <rect x="7" y="5" width="14" height="5" rx="1.5" fill="#FFF7ED" />
                      <rect x="8.5" y="6.8" width="5.5" height="1.4" rx="0.7" fill="#EA580C" />
                      {/* Buttons */}
                      <rect x="7" y="12" width="3.4" height="2.8" rx="0.8" fill="#FFF7ED" />
                      <rect x="12.3" y="12" width="3.4" height="2.8" rx="0.8" fill="#FFF7ED" />
                      <rect x="17.6" y="12" width="3.4" height="2.8" rx="0.8" fill="#FFF7ED" />
                      <rect x="7" y="16.5" width="3.4" height="2.8" rx="0.8" fill="#FFF7ED" />
                      <rect x="12.3" y="16.5" width="3.4" height="2.8" rx="0.8" fill="#FFF7ED" />
                      <rect x="17.6" y="16.5" width="3.4" height="2.8" rx="0.8" fill="#FDE047" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-black text-xl text-slate-900 leading-tight">गल्ला मोजा (Cash Tally)</h3>
                    <p className="text-xs font-bold text-slate-400 mt-0.5">कॅश नोटांची अचूक बेरीज</p>
                  </div>
                </div>

                <button 
                  onClick={() => setIsTallyModalOpen(false)}
                  className="w-8 h-8 bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-600 rounded-full flex items-center justify-center transition cursor-pointer"
                >
                  <X weight="bold" className="text-base" />
                </button>
              </div>

              <div className="flex flex-col gap-3.5">
                {/* 2-Column Denominations Grid */}
                <div className="grid grid-cols-2 gap-2.5">
                  {[500, 200, 100, 50, 20, 10].map(denom => (
                    <div 
                      key={denom} 
                      className="flex items-center justify-between bg-slate-50/80 border border-slate-200/90 rounded-2xl h-11 px-3 transition focus-within:border-brand focus-within:bg-white"
                    >
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="font-black text-xs sm:text-sm text-slate-800 tracking-tight">₹{denom}</span>
                        <span className="text-slate-400 font-bold text-xs">×</span>
                      </div>

                      <div className="flex items-center bg-white border border-slate-200/90 rounded-xl px-2.5 py-0.5 shadow-xs focus-within:border-[#FF5722] focus-within:ring-2 focus-within:ring-[#FF5722]/15 transition">
                        <input 
                          type="number" min="0" placeholder="0"
                          value={notes[denom]}
                          onChange={(e) => setNotes(prev => ({...prev, [denom]: e.target.value}))}
                          className="w-8 sm:w-10 text-center font-black text-xs sm:text-sm text-slate-900 outline-none bg-transparent"
                        />
                        <svg className="w-4 h-4 text-slate-400 shrink-0 select-none ml-1" viewBox="0 0 20 20" fill="none">
                          <rect x="1.5" y="4.5" width="17" height="11" rx="2" stroke="currentColor" strokeWidth="1.3" />
                          <circle cx="10" cy="10" r="2.2" stroke="currentColor" strokeWidth="1.3" />
                          <line x1="4.5" y1="8" x2="4.5" y2="8.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                          <line x1="15.5" y1="12" x2="15.5" y2="12.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total Cash Box */}
                <div className="bg-gradient-to-b from-[#FFF5E8] via-[#FFEED9] to-[#FFE6C7] border border-amber-200/90 rounded-2xl py-3 px-4 text-center shadow-xs">
                  <p className="text-[10px] font-black text-[#C2410C] uppercase tracking-wider mb-0.5">
                    एकूण कॅश रक्कम (TOTAL CASH)
                  </p>
                  <h2 className="text-3xl sm:text-4xl font-black text-[#C2410C] tracking-tight">
                    ₹{calculateTotalCash().toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </h2>
                </div>

                {/* Done Button */}
                <button 
                  type="button"
                  onClick={() => setIsTallyModalOpen(false)}
                  className="w-full h-12 rounded-2xl bg-gradient-to-r from-[#FF5722] via-[#FF6E40] to-[#FF5722] hover:opacity-95 text-white font-black text-sm flex items-center justify-center gap-1.5 shadow-lg shadow-orange-500/30 active:scale-98 transition cursor-pointer"
                >
                  <span>पूर्ण झाले (Done)</span>
                  <Check weight="bold" className="text-base" />
                </button>
              </div>

            </div>
          </div>
        )}

        {/* Smart Purchase Order Modal */}
        {showPOModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-start justify-center p-4 pt-24 sm:pt-28 overflow-y-auto">
            <div className="bg-white rounded-[28px] sm:rounded-[32px] w-full max-w-lg shadow-2xl border border-slate-200/80 flex flex-col overflow-hidden max-h-[calc(100vh-130px)] animate-scale-up">
              
              {/* Header */}
              <div className="p-4 sm:p-5 border-b border-slate-100 flex justify-between items-center bg-white relative">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/25 shrink-0">
                    <Package weight="fill" className="text-xl" />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 text-base sm:text-lg leading-tight">
                      Smart Purchase Order (सप्लायर ऑर्डर)
                    </h3>
                    <div className="flex items-center gap-1 mt-0.5 text-[11px] text-slate-500 font-bold">
                      <span>1-क्लिकमध्ये WhatsApp वर</span>
                      <span className="bg-[#FF7A00] text-white text-[10px] font-black px-1.5 py-0.2 rounded-sm shadow-2xs">
                        तयार
                      </span>
                      <span>ऑर्डर पाठवा</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* 3D Parcel Box graphic */}
                  <div className="relative w-11 h-10 flex items-center justify-center select-none pointer-events-none">
                    <svg className="w-11 h-10" viewBox="0 0 48 40" fill="none">
                      <path d="M24 4L38 11V26L24 33L10 26V11L24 4Z" fill="#6366F1" />
                      <path d="M24 4L38 11L24 18L10 11L24 4Z" fill="#818CF8" />
                      <path d="M24 18V33L38 26V11L24 18Z" fill="#4F46E5" />
                      <path d="M12 18L22 23V34L12 29V18Z" fill="#F97316" />
                      <path d="M12 18L22 23L30 19L20 14L12 18Z" fill="#FB923C" />
                      <path d="M22 23V34L30 30V19L22 23Z" fill="#EA580C" />
                      <path d="M20 22L22 23L22 34L20 33Z" fill="#FED7AA" opacity="0.6" />
                    </svg>
                  </div>

                  {/* Close button */}
                  <button 
                    onClick={() => setShowPOModal(false)} 
                    className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition cursor-pointer"
                  >
                    <X weight="bold" className="text-base" />
                  </button>
                </div>
              </div>

              {/* Form Body */}
              <div className="p-5 overflow-y-auto space-y-4">
                {/* Supplier Name and WhatsApp Number Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1.5">
                      सप्लायर / होलसेलर नाव
                    </label>
                    <input 
                      type="text" 
                      value={poSupplierName} 
                      onChange={e => setPoSupplierName(e.target.value)}
                      placeholder="उदा. साई सुपर मार्केट / व्यापाऱ्याचे नाव"
                      className="w-full h-11 px-3.5 bg-slate-50/80 border border-slate-200/90 rounded-2xl text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1.5">
                      WHATSAPP नंबर (पर्यायी)
                    </label>
                    <div className="relative flex items-center">
                      <div className="absolute left-3.5 flex items-center gap-1.5 pointer-events-none select-none text-xs font-bold text-slate-600">
                        <span>🇮🇳</span>
                        <span className="text-slate-700">+91</span>
                      </div>
                      <input 
                        type="tel" 
                        value={poSupplierMobile} 
                        onChange={e => setPoSupplierMobile(e.target.value)}
                        placeholder="10-अंकी मोबाईल नंबर"
                        className="w-full h-11 pl-16 pr-10 bg-slate-50/80 border border-slate-200/90 rounded-2xl text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
                      />
                      <div className="absolute right-3.5 text-slate-400 pointer-events-none">
                        <svg className="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items List */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-black text-slate-700">
                      ऑर्डर मधील वस्तू ({poItems.length})
                    </span>
                    <span className="bg-[#1E293B] text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-2xs">
                      अंदाजे किंमत: ₹{poItems.reduce((acc, it) => acc + (it.quantity * (it.est_rate || 0)), 0)}
                    </span>
                  </div>

                  {poItems.length === 0 ? (
                    /* Dashed Empty State Card with Clipboard and Notepad Illustrations */
                    <div className="border border-dashed border-slate-300 bg-slate-50/70 rounded-2xl p-4 flex items-center justify-between gap-3">
                      {/* Left: 3D Clipboard illustration */}
                      <div className="w-12 h-12 shrink-0 select-none flex items-center justify-center">
                        <svg className="w-11 h-11" viewBox="0 0 44 44" fill="none">
                          <rect x="8" y="10" width="28" height="30" rx="4" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1.5" />
                          <rect x="14" y="6" width="16" height="6" rx="2" fill="#64748B" />
                          <rect x="12" y="14" width="20" height="22" rx="2" fill="#FFFFFF" />
                          <line x1="16" y1="19" x2="28" y2="19" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
                          <line x1="16" y1="24" x2="28" y2="24" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
                          <line x1="16" y1="29" x2="24" y2="29" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
                          <circle cx="28" cy="28" r="6" fill="#F97316" />
                          <path d="M25.5 28L27 29.5L30.5 26" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>

                      <p className="text-xs font-bold text-slate-500 text-center flex-1">
                        अद्याप कोणतीही वस्तू जोडलेली नाही
                      </p>

                      {/* Right: 3D Notepad illustration */}
                      <div className="w-12 h-12 shrink-0 select-none flex items-center justify-center">
                        <svg className="w-11 h-11" viewBox="0 0 44 44" fill="none">
                          <rect x="10" y="8" width="24" height="28" rx="3" fill="#FFF7ED" stroke="#FDBA74" strokeWidth="1.5" />
                          <circle cx="14" cy="8" r="1.5" fill="#F97316" />
                          <circle cx="20" cy="8" r="1.5" fill="#F97316" />
                          <circle cx="26" cy="8" r="1.5" fill="#F97316" />
                          <circle cx="30" cy="8" r="1.5" fill="#F97316" />
                          <line x1="15" y1="16" x2="28" y2="16" stroke="#FDBA74" strokeWidth="1.5" strokeLinecap="round" />
                          <line x1="15" y1="21" x2="28" y2="21" stroke="#FDBA74" strokeWidth="1.5" strokeLinecap="round" />
                          <line x1="15" y1="26" x2="24" y2="26" stroke="#FDBA74" strokeWidth="1.5" strokeLinecap="round" />
                          <line x1="15" y1="31" x2="20" y2="31" stroke="#FDBA74" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      </div>
                    </div>
                  ) : (
                    <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100 max-h-48 overflow-y-auto bg-white">
                      {poItems.map((it, idx) => (
                        <div key={idx} className="p-3 flex items-center justify-between text-xs hover:bg-slate-50">
                          <div>
                            <p className="font-black text-slate-800">{it.product_name}</p>
                            <p className="text-[10px] text-slate-500 font-bold mt-0.5">{it.quantity} {it.unit}</p>
                          </div>
                          <button onClick={() => removePoItem(idx)} className="w-6 h-6 rounded-full bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center cursor-pointer">
                            <X weight="bold" className="text-xs" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Add New Item Form */}
                <form onSubmit={handleAddPoItem} className="space-y-2.5">
                  <label className="block text-xs font-black text-[#1E3A8A]">
                    नवीन वस्तू जोडा:
                  </label>

                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <input 
                        type="text" 
                        placeholder="वस्तूचे नाव"
                        value={newPoItem.product_name}
                        onChange={e => setNewPoItem(prev => ({...prev, product_name: e.target.value}))}
                        className="w-full h-11 pl-3.5 pr-9 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-slate-400 pointer-events-none">
                        <svg className="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="11" cy="11" r="8" />
                          <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                      </div>
                    </div>

                    <input 
                      type="number" 
                      placeholder="नग / प्रमाण"
                      value={newPoItem.quantity}
                      onChange={e => setNewPoItem(prev => ({...prev, quantity: e.target.value}))}
                      className="w-28 h-11 px-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 text-center"
                    />

                    <div className="relative">
                      <select 
                        value={newPoItem.unit}
                        onChange={e => setNewPoItem(prev => ({...prev, unit: e.target.value}))}
                        className="h-11 pl-3 pr-8 bg-sky-50/70 border border-sky-200/90 rounded-2xl text-xs font-bold text-slate-700 appearance-none focus:outline-none focus:border-sky-400 cursor-pointer"
                      >
                        <option value="Packets">Packets</option>
                        <option value="Boxes">Boxes</option>
                        <option value="Kg">Kg</option>
                        <option value="Litres">Litres</option>
                        <option value="Pcs">Pcs</option>
                      </select>
                      <span className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 text-xs font-bold">
                        ⌄
                      </span>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="w-full h-10 rounded-2xl bg-gradient-to-r from-[#3B82F6] via-[#4F46E5] to-[#6366F1] hover:opacity-95 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-indigo-500/20 active:scale-98 transition cursor-pointer"
                  >
                    + ऑर्डरमध्ये जोडा
                  </button>
                </form>

                {/* Notes Section with pencil on notepad graphic */}
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1.5">
                    टीप / सूचना (पर्यायी)
                  </label>
                  <div className="relative flex items-center">
                    <input 
                      type="text"
                      value={poNotes}
                      onChange={e => setPoNotes(e.target.value)}
                      placeholder="उदा. उद्या सकाळी डिलिव्हरी द्या"
                      className="w-full h-11 pl-3.5 pr-12 bg-slate-50/80 border border-slate-200/90 rounded-2xl text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
                    />
                    <div className="absolute right-3.5 select-none pointer-events-none">
                      <svg className="w-5 h-5 text-amber-500" viewBox="0 0 24 24" fill="none">
                        <rect x="4" y="3" width="14" height="18" rx="2" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1.5" />
                        <line x1="7" y1="7" x2="15" y2="7" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" />
                        <line x1="7" y1="11" x2="15" y2="11" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" />
                        <line x1="7" y1="15" x2="12" y2="15" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" />
                        <path d="M14 17L19 12L21 14L16 19L14 19L14 17Z" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="1" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between">
                <button 
                  onClick={() => setShowPOModal(false)}
                  className="px-5 py-2.5 bg-white border border-slate-200/90 text-slate-600 font-bold rounded-2xl text-xs hover:bg-slate-100 transition shadow-2xs cursor-pointer"
                >
                  रद्द करा
                </button>

                {/* Center Green Checkmark Badge */}
                <div className="w-8 h-8 rounded-full bg-[#10B981] text-white flex items-center justify-center font-black shadow-md shadow-emerald-500/30 select-none">
                  <svg className="w-4 h-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>

                {/* WhatsApp Button */}
                <button 
                  onClick={handleSendPO}
                  disabled={isSendingPO || poItems.length === 0}
                  className="px-5 py-2.5 bg-[#25D366] hover:bg-[#128C7E] text-white font-black rounded-2xl text-xs transition flex items-center gap-2 shadow-lg shadow-emerald-500/25 disabled:opacity-50 cursor-pointer"
                >
                  <WhatsappLogo weight="fill" className="text-lg" />
                  <span>{isSendingPO ? 'पाठवत आहे...' : 'WhatsApp वर पाठवा'}</span>
                </button>
              </div>

            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default Dashboard;
