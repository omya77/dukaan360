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
  CheckCircle
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
  const [loading, setLoading] = useState(true);
  const [showReorderModal, setShowReorderModal] = useState(false);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [isTallyModalOpen, setIsTallyModalOpen] = useState(false);
  const [notes, setNotes] = useState({ 500: '', 200: '', 100: '', 50: '', 20: '', 10: '' });

  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [expenseData, setExpenseData] = useState({ category: 'Tea & Snacks', amount: '', description: '' });

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
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">Store Dashboard</h1>
              <p className="text-slate-500 font-semibold text-xs sm:text-sm mt-0.5">Overview of your retail business • व्यवसायाची सद्यस्थिती</p>
            </div>
            
            <div className="flex flex-col items-start lg:items-end gap-2.5 w-full lg:w-auto">
              {/* Row 1: Action pills */}
              <div className="flex flex-wrap items-center gap-2">
                <button 
                  onClick={() => setShowPOModal(true)} 
                  className="bg-white/95 backdrop-blur-sm border border-slate-200/90 hover:bg-white text-slate-700 px-3.5 py-2 rounded-xl font-bold flex items-center gap-2 shadow-xs transition hover:shadow-sm text-xs cursor-pointer"
                >
                  <Package weight="fill" className="text-indigo-600 text-base" />
                  <span>Smart PO (सप्लायर ऑर्डर)</span>
                </button>
                <button 
                  onClick={() => setShowExpenseModal(true)} 
                  className="bg-white/95 backdrop-blur-sm border border-slate-200/90 hover:bg-white text-slate-700 px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 shadow-xs transition hover:shadow-sm text-xs cursor-pointer"
                >
                  <Plus weight="bold" className="text-emerald-600 text-sm" />
                  <span>खर्च नोंदवा</span>
                </button>
                <button 
                  onClick={() => setIsTallyModalOpen(true)} 
                  className="bg-white/95 backdrop-blur-sm border border-slate-200/90 hover:bg-white text-slate-700 px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 shadow-xs transition hover:shadow-sm text-xs cursor-pointer"
                >
                  <Calculator weight="fill" className="text-orange-500 text-base" />
                  <span>गल्ला मोजा</span>
                </button>
                <button 
                  onClick={handleEndOfDayReport} 
                  className="bg-[#FDECE2] border border-[#F8D2BD] hover:bg-orange-100 text-orange-950 px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 shadow-xs transition hover:shadow-sm text-xs cursor-pointer"
                >
                  <ChartLineUp weight="bold" className="text-orange-600 text-base" />
                  <span>गल्ला बंद रिपोर्ट</span>
                </button>
                <button 
                  onClick={handleDownloadMyBackupPdf} 
                  disabled={downloadingBackup}
                  className="bg-[#EDF2F7] border border-slate-200/90 hover:bg-slate-100 text-slate-700 px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 shadow-xs transition hover:shadow-sm text-xs cursor-pointer disabled:opacity-50"
                  title="PDF बॅकअप डाऊनलोड करा"
                >
                  <FileText weight="fill" className="text-indigo-500 text-base" />
                  <span>{downloadingBackup ? 'तयार होत आहे...' : 'PDF बॅकअप'}</span>
                </button>
              </div>

              {/* Row 2: Prominent Glowing Go to POS Button */}
              <Link 
                to="/pos" 
                className="bg-gradient-to-r from-[#FF5722] via-[#FF6E40] to-[#FFA726] text-white px-5 py-2.5 rounded-2xl font-black flex items-center gap-2 shadow-lg shadow-orange-500/35 hover:shadow-orange-500/50 hover:scale-[1.02] active:scale-95 transition text-xs sm:text-sm"
              >
                <Storefront weight="fill" className="text-base" />
                <span>Go to POS (नवीन बिल बनवा)</span>
                <Lightning weight="fill" className="text-amber-300 text-base" />
              </Link>
            </div>
          </div>

          {loading ? (
            <p className="text-center text-slate-400 py-16 font-bold">डॅशबोर्ड लोड होत आहे...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              
              {/* 1. Today's Sales (आजचा गल्ला) - Deep Emerald Gradient with Wave */}
              <div className="bg-gradient-to-br from-[#064E43] via-[#09574B] to-[#04332C] text-white p-5 rounded-3xl shadow-xl shadow-emerald-950/20 border border-emerald-400/20 relative overflow-hidden flex flex-col justify-between min-h-[145px] group hover:scale-[1.01] transition-all duration-300">
                <div className="relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 shrink-0 shadow-inner">
                      <ChartLineUp weight="bold" className="text-xl" />
                    </div>
                    <div>
                      <p className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-200/80">TODAY'S SALES (आजचा गल्ला)</p>
                      <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-0.5">₹{(summary.today_sales || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
                    </div>
                  </div>
                </div>
                <div className="relative z-10 mt-3">
                  <span className="text-xs font-semibold text-emerald-200/70">आजची एकूण बिलिंग</span>
                </div>
                {/* Emerald Wave Sparkline */}
                <div className="absolute right-3 bottom-3 w-32 h-14 pointer-events-none select-none">
                  <svg viewBox="0 0 120 40" fill="none" className="w-full h-full text-emerald-400">
                    <path d="M0 32 Q 20 38, 35 18 T 70 24 T 95 8 T 120 28" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
                    <path d="M0 32 Q 20 38, 35 18 T 70 24 T 95 8 T 120 28 L 120 40 L 0 40 Z" fill="currentColor" opacity="0.1" />
                  </svg>
                </div>
              </div>

              {/* 2. Today's Net Profit (आजचा नफा) - Warm Rose-Gold / Peach Gradient with Rupee symbol */}
              <div className="bg-gradient-to-br from-[#F5D5C6] via-[#E8B49B] to-[#D99A82] text-stone-900 p-5 rounded-3xl shadow-xl shadow-orange-950/10 border border-white/60 relative overflow-hidden flex flex-col justify-between min-h-[145px] group hover:scale-[1.01] transition-all duration-300">
                <div className="relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-white/40 border border-white/60 flex items-center justify-center text-[#9A3412] font-black text-lg shrink-0 shadow-inner">
                      ₹
                    </div>
                    <div>
                      <p className="text-[11px] font-extrabold uppercase tracking-wider text-stone-800">TODAY'S NET PROFIT (आजचा नफा)</p>
                      <h3 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight mt-0.5">₹{(summary.today_profit || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
                    </div>
                  </div>
                </div>
                <div className="relative z-10 mt-3">
                  <span className="text-xs font-semibold text-stone-700">खर्च व खरेदी किंमत वजा जाता</span>
                </div>
                {/* Large Stylized Glowing Rupee Watermark */}
                <span className="absolute -right-1 top-1 text-7xl sm:text-8xl font-black text-white/55 select-none pointer-events-none drop-shadow-[0_4px_12px_rgba(255,255,255,0.6)]">
                  ₹
                </span>
              </div>

              {/* 3. Market Due (बाजार उधारी) - Clean White Card */}
              <div className="bg-white/95 backdrop-blur-md text-slate-800 p-5 rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-200/80 relative overflow-hidden flex flex-col justify-between min-h-[145px] group hover:scale-[1.01] transition-all duration-300">
                <div className="relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 shrink-0 shadow-inner">
                      <BookBookmark weight="fill" className="text-xl" />
                    </div>
                    <div>
                      <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">MARKET DUE (बाजार उधारी)</p>
                      <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-0.5">₹{(summary.total_due || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
                    </div>
                  </div>
                </div>
                <div className="relative z-10 mt-3">
                  <span className="text-xs font-medium text-slate-400">ग्राहकांकडून येणे बाकी रक्कम</span>
                </div>
              </div>

              {/* 4. Inventory Value (माल गुंतवणूक) - Deep Royal Purple Gradient with 3D Boxes */}
              <div className="bg-gradient-to-br from-[#2D1B69] via-[#351A7E] to-[#1C0D45] text-white p-5 rounded-3xl shadow-xl shadow-purple-950/30 border border-purple-400/20 relative overflow-hidden flex flex-col justify-between min-h-[145px] group hover:scale-[1.01] transition-all duration-300">
                <div className="relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300 shrink-0 shadow-inner">
                      <Package weight="fill" className="text-xl" />
                    </div>
                    <div>
                      <p className="text-[11px] font-extrabold uppercase tracking-wider text-purple-200/80">INVENTORY VALUE (माल गुंतवणूक)</p>
                      <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-0.5">₹{(summary.total_inventory_value || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
                    </div>
                  </div>
                </div>
                <div className="relative z-10 mt-3">
                  <span className="text-xs font-semibold text-purple-200/70">सध्याच्या शिल्लक साठ्याची खरेदी किंमत</span>
                </div>
                {/* 3D Stacked Boxes Graphic */}
                <div className="absolute right-3 bottom-2 opacity-25 pointer-events-none select-none text-purple-300">
                  <svg width="75" height="75" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3.5">
                    <polygon points="50,15 88,34 50,53 12,34" fill="rgba(255,255,255,0.12)" />
                    <polygon points="12,34 50,53 50,92 12,73" fill="rgba(255,255,255,0.06)" />
                    <polygon points="88,34 50,53 50,92 88,73" fill="rgba(255,255,255,0.18)" />
                  </svg>
                </div>
              </div>

              {/* 5. Low Stock Alerts (माल संपत आला आहे) - Warm Amber Gradient with Print Pill */}
              <div className="bg-gradient-to-br from-[#E2B777] via-[#D49E55] to-[#C4893F] text-stone-900 p-5 rounded-3xl shadow-xl shadow-amber-950/15 border border-white/50 relative overflow-hidden flex flex-col justify-between min-h-[145px] group hover:scale-[1.01] transition-all duration-300">
                <div className="relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-white/40 border border-white/60 flex items-center justify-center text-red-600 shrink-0 shadow-inner">
                      <Warning weight="fill" className="text-xl" />
                    </div>
                    <div>
                      <p className="text-[11px] font-extrabold uppercase tracking-wider text-stone-900">LOW STOCK ALERTS (माल संपत आला आहे)</p>
                      <h3 className="text-2xl sm:text-3xl font-black text-stone-950 tracking-tight mt-0.5">{(summary.low_stock_alerts || 0)} Items</h3>
                    </div>
                  </div>
                </div>
                <div className="relative z-10 mt-3">
                  <span className="text-xs font-semibold text-stone-800">१० पेक्षा कमी शिल्लक आयटम</span>
                </div>
                {/* Print Button Pill on Right */}
                <button 
                  onClick={handlePrintReorder} 
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white hover:bg-white/95 text-stone-800 rounded-2xl p-2.5 px-3.5 flex flex-col items-center justify-center shadow-md transition hover:scale-105 active:scale-95 border border-white/80 cursor-pointer"
                  title="Print Reorder List"
                >
                  <Printer weight="fill" className="text-red-500 text-lg mb-0.5" />
                  <span className="text-[9px] font-black text-stone-800 tracking-wider">PRINT</span>
                </button>
              </div>

              {/* 6. Total Customers (एकूण ग्राहक) - Midnight Blue Gradient with Checkmark */}
              <div className="bg-gradient-to-br from-[#1E3A8A] via-[#1E293B] to-[#0F172A] text-white p-5 rounded-3xl shadow-xl shadow-blue-950/30 border border-blue-400/20 relative overflow-hidden flex flex-col justify-between min-h-[145px] group hover:scale-[1.01] transition-all duration-300">
                <div className="relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300 shrink-0 shadow-inner">
                      <Users weight="fill" className="text-xl" />
                    </div>
                    <div>
                      <p className="text-[11px] font-extrabold uppercase tracking-wider text-blue-200/80">TOTAL CUSTOMERS (एकूण ग्राहक)</p>
                      <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-0.5">{(summary.total_customers || 0)}</h3>
                    </div>
                  </div>
                </div>
                <div className="relative z-10 mt-3">
                  <span className="text-xs font-semibold text-blue-200/70">खातेवहीत नोंद असलेले ग्राहक</span>
                </div>
                {/* Checkmark Shield Graphic */}
                <div className="absolute right-3 bottom-2 opacity-15 pointer-events-none select-none text-blue-300">
                  <CheckCircle weight="fill" className="text-7xl" />
                </div>
              </div>
              
            </div>
          )}

          {/* Quick Navigation (झटपट मेनू) */}
          <div className="pt-2">
            <h2 className="text-base sm:text-lg font-black text-slate-800 mb-3">Quick Navigation (झटपट मेनू)</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              
              <Link to="/pos" className="bg-white/95 backdrop-blur-sm p-5 rounded-3xl border border-slate-200/80 hover:border-brand hover:shadow-xl hover:-translate-y-0.5 transition shadow-sm flex flex-col items-center text-center group cursor-pointer">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF5722] to-[#FF8A65] text-white flex items-center justify-center mb-2.5 shadow-md shadow-orange-500/25 group-hover:scale-110 transition">
                  <Storefront weight="fill" className="text-2xl" />
                </div>
                <h4 className="font-black text-slate-800 text-sm">New Bill (POS)</h4>
                <p className="text-[11px] text-slate-400 font-medium mt-0.5">नवीन बिल बनवा</p>
              </Link>
              
              <Link to="/khata" className="bg-white/95 backdrop-blur-sm p-5 rounded-3xl border border-slate-200/80 hover:border-blue-500 hover:shadow-xl hover:-translate-y-0.5 transition shadow-sm flex flex-col items-center text-center group cursor-pointer">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center mb-2.5 shadow-md shadow-blue-500/25 group-hover:scale-110 transition">
                  <BookBookmark weight="fill" className="text-2xl" />
                </div>
                <h4 className="font-black text-slate-800 text-sm">Customer Khata</h4>
                <p className="text-[11px] text-slate-400 font-medium mt-0.5">ग्राहक खातेवही व उधारी</p>
              </Link>

              <Link to="/inventory" className="bg-white/95 backdrop-blur-sm p-5 rounded-3xl border border-slate-200/80 hover:border-slate-800 hover:shadow-xl hover:-translate-y-0.5 transition shadow-sm flex flex-col items-center text-center group cursor-pointer">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-700 to-slate-900 text-white flex items-center justify-center mb-2.5 shadow-md shadow-slate-700/25 group-hover:scale-110 transition">
                  <Package weight="fill" className="text-2xl" />
                </div>
                <h4 className="font-black text-slate-800 text-sm">Inventory Stock</h4>
                <p className="text-[11px] text-slate-400 font-medium mt-0.5">स्टॉक व बॅच मॅनेजमेंट</p>
              </Link>

              <button onClick={() => setShowPOModal(true)} className="bg-white/95 backdrop-blur-sm p-5 rounded-3xl border border-slate-200/80 hover:border-emerald-500 hover:shadow-xl hover:-translate-y-0.5 transition shadow-sm flex flex-col items-center text-center group cursor-pointer">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center mb-2.5 shadow-md shadow-emerald-500/25 group-hover:scale-110 transition">
                  <WhatsappLogo weight="fill" className="text-2xl" />
                </div>
                <h4 className="font-black text-slate-800 text-sm">Supplier PO</h4>
                <p className="text-[11px] text-slate-400 font-medium mt-0.5">WhatsApp सप्लायर ऑर्डर</p>
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
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-start justify-center p-4 pt-20 sm:pt-24 overflow-y-auto">
            <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl p-6 flex flex-col max-h-[calc(100vh-120px)]">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="font-black text-xl text-slate-800">Add Expense</h3>
                  <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-wide">दुकानचा खर्च</p>
                </div>
                <button 
                  onClick={() => setShowExpenseModal(false)}
                  className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-200 transition cursor-pointer"
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

                <button type="submit" className="h-10 w-full bg-brand hover:bg-brandHover text-white rounded-xl font-black shadow-lg shadow-brand/30 transition-all active:scale-95 mt-2 cursor-pointer">
                  Save Expense
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Cash Tally Modal */}
        {isTallyModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-start justify-center p-4 pt-20 sm:pt-24 overflow-y-auto">
            <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden max-h-[calc(100vh-120px)]">
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

        {/* Smart Purchase Order Modal */}
        {showPOModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-start justify-center p-4 pt-20 sm:pt-24 overflow-y-auto">
            <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-100 flex flex-col overflow-hidden max-h-[calc(100vh-120px)]">
              
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
                <button onClick={() => setShowPOModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-red-500 hover:bg-slate-200 transition cursor-pointer">
                  <X weight="bold" className="text-lg" />
                </button>
              </div>

              <div className="p-5 overflow-y-auto space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">सप्लायर / होलसेलर नाव</label>
                    <input 
                      type="text" 
                      value={poSupplierName} 
                      onChange={e => setPoSupplierName(e.target.value)}
                      placeholder="सप्लायर / व्यापाऱ्याचे नाव"
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
                        <button onClick={() => removePoItem(idx)} className="text-red-500 hover:text-red-700 p-1 cursor-pointer">
                          <X weight="bold" />
                        </button>
                      </div>
                    ))}
                    {poItems.length === 0 && (
                      <p className="p-4 text-center text-xs text-slate-400 font-bold">अद्याप कोणतीही वस्तू जोडलेली नाही</p>
                    )}
                  </div>
                </div>

                <form onSubmit={handleAddPoItem} className="bg-indigo-50/40 border border-indigo-100 p-3 rounded-2xl space-y-2">
                  <p className="text-[11px] font-bold text-indigo-900">नवीन वस्तू जोडा:</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <input 
                      type="text" 
                      placeholder="वस्तूचे नाव"
                      value={newPoItem.product_name}
                      onChange={e => setNewPoItem(prev => ({...prev, product_name: e.target.value}))}
                      className="col-span-2 h-9 px-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500"
                    />
                    <input 
                      type="number" 
                      placeholder="नग / प्रमाण"
                      value={newPoItem.quantity}
                      onChange={e => setNewPoItem(prev => ({...prev, quantity: e.target.value}))}
                      className="h-9 px-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500"
                    />
                    <select 
                      value={newPoItem.unit}
                      onChange={e => setNewPoItem(prev => ({...prev, unit: e.target.value}))}
                      className="h-9 px-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500"
                    >
                      <option value="Packets">Packets</option>
                      <option value="Boxes">Boxes</option>
                      <option value="Kg">Kg</option>
                      <option value="Litres">Litres</option>
                      <option value="Pcs">Pcs</option>
                    </select>
                  </div>
                  <button type="submit" className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition shadow-xs cursor-pointer">
                    + ऑर्डरमध्ये जोडा
                  </button>
                </form>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">टीप / सूचना (पर्यायी)</label>
                  <input 
                    type="text"
                    value={poNotes}
                    onChange={e => setPoNotes(e.target.value)}
                    placeholder="उदा. उद्या सकाळी डिलिव्हरी द्या"
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
                <button 
                  onClick={() => setShowPOModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 font-bold rounded-xl text-xs hover:bg-slate-100 transition cursor-pointer"
                >
                  रद्द करा
                </button>
                <button 
                  onClick={handleSendPO}
                  disabled={isSendingPO || poItems.length === 0}
                  className="px-4 py-2 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold rounded-xl text-xs transition flex items-center gap-1.5 shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  <WhatsappLogo weight="fill" className="text-base" />
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
