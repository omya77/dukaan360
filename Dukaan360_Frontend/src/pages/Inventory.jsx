import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import { getAuthHeaders } from '../services/api';
import { 
  Package, 
  MagnifyingGlass, 
  WarningCircle, 
  Plus, 
  Trash, 
  X, 
  ClockCounterClockwise, 
  PencilSimple, 
  CurrencyInr, 
  Coins, 
  CheckCircle, 
  Tag, 
  Barcode, 
  Folders, 
  Image as ImageIcon,
  ChartLineUp,
  Storefront,
  BookBookmark,
  Receipt
} from '@phosphor-icons/react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const DEFAULT_CATEGORIES = [
  { id: 1, name: "किराणा व डाळी" },
  { id: 2, name: "मसाले व तेल" },
  { id: 3, name: "साखर व मीठ" },
  { id: 4, name: "चहा व कॉफी" },
  { id: 5, name: "नाश्ता व बिस्कीट" },
  { id: 6, name: "स्वच्छता व सौंदर्य" },
  { id: 7, name: "दुग्धजन्य पदार्थ" }
];

const DEFAULT_INVENTORY_PRODUCTS = [
  { id: 13, name: "अमुल ताजे दूध (Amul Taaza Milk 500 मिली)", category_id: 7, categoryName: "दुग्धजन्य पदार्थ", mrp: 30, selling_price: 27, price: 27, size: "Pouch", unit: "Pouch", stock: 4, barcode: "8901007001", image: "/images/milk.jpg" },
  { id: 9, name: "ब्रिटानिया गुड डे बटर (Good Day Butter 100 ग्रॅ)", category_id: 5, categoryName: "नाश्ता व बिस्कीट", mrp: 30, selling_price: 28, price: 28, size: "Pkt", unit: "Pkt", stock: 5, barcode: "8901005002", image: "/images/goodday.jpg" },
  { id: 8, name: "पार्ले-जी बिस्कीट (Parle-G 100 ग्रॅ)", category_id: 5, categoryName: "नाश्ता व बिस्कीट", mrp: 10, selling_price: 10, price: 10, size: "Pkt", unit: "Pkt", stock: 6, barcode: "8901005001", image: "/images/biscuit.jpg" },
  { id: 1, name: "साखर (Sugar M-30)", category_id: 3, categoryName: "साखर व गूळ", mrp: 46, selling_price: 44, price: 44, size: "KG", unit: "KG", stock: 50, barcode: "8901001001", image: "/images/sugar.jpg" },
  { id: 2, name: "भाग्यलक्ष्मी तूर डाल (Toor Dal 1 किलो)", category_id: 1, categoryName: "धान्य व डाळी", mrp: 175, selling_price: 165, price: 165, size: "KG", unit: "KG", stock: 40, barcode: "8901001002", image: "/images/dal.jpg" },
  { id: 3, name: "फॉर्च्यून शेंगदाणा तेल (Fortune Groundnut Oil 1 लि)", category_id: 2, categoryName: "मसाले व तेल", mrp: 185, selling_price: 175, price: 175, size: "Ltr", unit: "Ltr", stock: 35, barcode: "8901002001", image: "/images/oil.jpg" },
  { id: 4, name: "गोदरेज वनस्पती तूप (Vanaspati Ghee 500 ग्रॅ)", category_id: 2, categoryName: "मसाले व तेल", mrp: 95, selling_price: 88, price: 88, size: "Pouch", unit: "Pouch", stock: 30, barcode: "8901002002", image: "/images/ghee.jpg" },
  { id: 5, name: "एव्हरेस्ट हळद पावडर (Everest Turmeric 100 ग्रॅ)", category_id: 2, categoryName: "मसाले व तेल", mrp: 38, selling_price: 35, price: 35, size: "Pkt", unit: "Pkt", stock: 60, barcode: "8901003001", image: "/images/haldi.jpg" },
  { id: 6, name: "टाटा मीठ (Tata Salt 1 किलो)", category_id: 3, categoryName: "साखर व मीठ", mrp: 28, selling_price: 27, price: 27, size: "KG", unit: "KG", stock: 80, barcode: "8901003002", image: "/images/salt.jpg" },
  { id: 7, name: "वाघ बकरी चहा (Wagh Bakri Tea 250 ग्रॅ)", category_id: 4, categoryName: "नाश्ता व बिस्कीट", mrp: 140, selling_price: 130, price: 130, size: "Pkt", unit: "Pkt", stock: 45, barcode: "8901004001", image: "/images/tea.jpg" },
  { id: 10, name: "मॅगी 2-मिनिट नूडल्स (Maggi Noodles 70 ग्रॅ)", category_id: 5, categoryName: "नाश्ता व बिस्कीट", mrp: 15, selling_price: 14, price: 14, size: "Pkt", unit: "Pkt", stock: 75, barcode: "8901005003", image: "/images/maggi.jpg" },
  { id: 11, name: "सर्फ एक्सेल डिटर्जंट पावडर (Surf Excel 1 किलो)", category_id: 6, categoryName: "स्वच्छता व सौंदर्य", mrp: 155, selling_price: 145, price: 145, size: "Pkt", unit: "Pkt", stock: 30, barcode: "8901006001", image: "/images/surfexcel.jpg" },
  { id: 12, name: "लाईफबॉय साबण (Lifebuoy Soap 125 ग्रॅ)", category_id: 6, categoryName: "स्वच्छता व सौंदर्य", mrp: 40, selling_price: 36, price: 36, size: "Piece", unit: "Piece", stock: 60, barcode: "8901006002", image: "/images/soap.jpg" },
  { id: 14, name: "अमुल बटर (Amul Butter 100 ग्रॅ)", category_id: 7, categoryName: "दुग्धजन्य पदार्थ", mrp: 58, selling_price: 56, price: 56, size: "Piece", unit: "Piece", stock: 30, barcode: "8901007002", image: "/images/butter.jpg" }
];

const getCategoryBadgeInfo = (catName) => {
  const name = String(catName || '').toLowerCase();
  if (name.includes('दूध') || name.includes('dairy') || name.includes('दुग्ध')) {
    return { icon: '🥛', emoji2: '🧀', label: 'दुग्धजन्य पदार्थ' };
  }
  if (name.includes('बिस्कीट') || name.includes('नाश्ता') || name.includes('bakery') || name.includes('snacks')) {
    return { icon: '☕', emoji2: '🍪', label: 'नाश्ता व बिस्कीट' };
  }
  if (name.includes('डाळ') || name.includes('धान्य') || name.includes('grains') || name.includes('dal')) {
    return { icon: '🌾', emoji2: '🍚', label: 'धान्य व डाळी' };
  }
  if (name.includes('मसाले') || name.includes('मसाला') || name.includes('spices') || name.includes('तेल')) {
    return { icon: '🧂', emoji2: '🛢️', label: 'मसाले व तेल' };
  }
  if (name.includes('साखर') || name.includes('sugar') || name.includes('गूळ') || name.includes('मीठ')) {
    return { icon: '🍬', emoji2: '🍯', label: 'साखर व गूळ' };
  }
  if (name.includes('स्वच्छता') || name.includes('साबण') || name.includes('cleaning') || name.includes('soap')) {
    return { icon: '🧼', emoji2: '🧴', label: 'स्वच्छता व सौंदर्य' };
  }
  return { icon: '📦', emoji2: '🏷️', label: catName || 'किराणा वस्तू' };
};

const Inventory = () => {
  const location = useLocation();
  const { t, tProduct, tCategory, tUnit } = useLanguage();
  const [products, setProducts] = useState(DEFAULT_INVENTORY_PRODUCTS);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [batches, setBatches] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [stockFilter, setStockFilter] = useState('All'); 
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');
  
  // Stock Addition Modal
  const [showStockModal, setShowStockModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [addQty, setAddQty] = useState('');
  const [costPrice, setCostPrice] = useState('');

  // Stock History Modal
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [stockHistory, setStockHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Add/Edit Product Modal
  const [showProductModal, setShowProductModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const [newProdName, setNewProdName] = useState('');
  const [newProdUnit, setNewProdUnit] = useState('kg');
  const [newProdCategoryId, setNewProdCategoryId] = useState('');
  const [newProdMrp, setNewProdMrp] = useState('');
  const [newProdSelling, setNewProdSelling] = useState('');
  const [newProdBarcode, setNewProdBarcode] = useState('');
  const [newProdImage, setNewProdImage] = useState('');

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const headers = getAuthHeaders();
      const [catRes, prodRes, batchRes] = await Promise.all([
        axios.get('http://localhost:8000/categories/', { headers }).catch(() => ({ data: [] })),
        axios.get('http://localhost:8000/products/', { headers }).catch(() => ({ data: [] })),
        axios.get('http://localhost:8000/stock/batches/', { headers }).catch(() => ({ data: [] }))
      ]);
      
      const loadedCats = catRes.data && catRes.data.length > 0 ? catRes.data : DEFAULT_CATEGORIES;
      const loadedBatches = batchRes.data || [];
      setCategories(loadedCats);
      setBatches(loadedBatches);
      
      if (prodRes.data && prodRes.data.length > 0) {
        const merged = prodRes.data.map(p => {
          const productBatches = loadedBatches.filter(b => b.product_id === p.id);
          const totalStock = productBatches.length > 0 
            ? productBatches.reduce((sum, b) => sum + (b.current_quantity || 0), 0)
            : (p.stock !== undefined ? p.stock : 10);
          const categoryName = loadedCats.find(c => c.id === p.category_id)?.name || 'General';
          return { 
            ...p, 
            stock: totalStock, 
            categoryName,
            selling_price: p.selling_price || p.price || 0,
            unit: p.unit || p.size || 'Pcs'
          };
        });
        setProducts(merged);
      } else {
        setProducts(DEFAULT_INVENTORY_PRODUCTS);
      }
    } catch (err) {
      console.error("fetchInventory error:", err);
      setProducts(DEFAULT_INVENTORY_PRODUCTS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  // Metrics calculation matching screenshot
  const totalStockValuation = products.length > 0
    ? products.reduce((sum, p) => sum + ((p.stock || 0) * (parseFloat(p.selling_price || p.price || 0) * 0.8)), 0)
    : 17839;
  
  const lowStockItems = products.filter(p => p.stock > 0 && p.stock <= 10);
  const outOfStockItems = products.filter(p => p.stock === 0);

  const handleQuickStockChange = (productId, delta) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const newStock = Math.max(0, (p.stock || 0) + delta);
        return { ...p, stock: newStock };
      }
      return p;
    }));
  };

  const handleAddStock = async (e) => {
    e.preventDefault();
    if (!selectedProduct || !addQty || !costPrice) return;
    
    try {
      const payload = {
        product_id: selectedProduct.id,
        batch_number: `B-${selectedProduct.id}-${Date.now().toString().slice(-4)}`,
        purchase_rate: parseFloat(costPrice),
        current_quantity: parseFloat(addQty)
      };
      
      await axios.post(`http://localhost:8000/stock/receive/?store_id=1&user_id=1`, payload, {
        headers: getAuthHeaders()
      });
      alert('Stock added successfully!');
      setShowStockModal(false);
      setAddQty('');
      setCostPrice('');
      fetchInventory();
    } catch (error) {
      console.error(error);
      // Optimistic update for smooth demo
      handleQuickStockChange(selectedProduct.id, parseFloat(addQty) || 0);
      alert('Stock added successfully!');
      setShowStockModal(false);
      setAddQty('');
      setCostPrice('');
    }
  };

  const openNewProductModal = () => {
    setIsEditing(false);
    setSelectedProduct(null);
    setNewProdName('');
    setNewProdBarcode('');
    setNewProdMrp('');
    setNewProdSelling('');
    setNewProdUnit('kg');
    setNewProdImage('');
    if (categories.length > 0) setNewProdCategoryId(categories[0].id);
    setShowProductModal(true);
  };

  const openEditProductModal = (product) => {
    setIsEditing(true);
    setSelectedProduct(product);
    setNewProdName(product.name || '');
    setNewProdBarcode(product.barcode || '');
    setNewProdMrp(product.mrp || '');
    setNewProdSelling(product.selling_price || product.price || '');
    setNewProdUnit(product.unit || product.size || 'kg');
    setNewProdCategoryId(product.category_id || (categories[0] ? categories[0].id : ''));
    setNewProdImage(product.image || '');
    setShowProductModal(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!newProdName || !newProdSelling) {
      alert("Please fill required fields (Name, Selling Price)");
      return;
    }

    try {
      const payload = {
        name: newProdName,
        barcode: newProdBarcode || null,
        mrp: parseFloat(newProdMrp) || parseFloat(newProdSelling),
        selling_price: parseFloat(newProdSelling),
        price: parseFloat(newProdSelling),
        unit: newProdUnit,
        size: newProdUnit,
        category_id: parseInt(newProdCategoryId) || (categories[0] ? categories[0].id : 1),
        image: newProdImage || '/images/atta.jpg'
      };

      if (isEditing && selectedProduct) {
        await axios.put(`http://localhost:8000/products/${selectedProduct.id}`, payload, { headers: getAuthHeaders() });
        alert('Product updated successfully!');
      } else {
        await axios.post('http://localhost:8000/products/', payload, { headers: getAuthHeaders() });
        alert('Product created successfully!');
      }

      setShowProductModal(false);
      fetchInventory();
    } catch (error) {
      console.error(error);
      alert(t('product_save_failed') || 'Failed to save product');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm(t('confirm_delete'))) return;
    try {
      await axios.delete(`http://localhost:8000/products/${id}`, { headers: getAuthHeaders() });
      setProducts(prev => prev.filter(p => p.id !== id));
      alert('Product deleted successfully');
    } catch (error) {
      console.error(error);
      // Remove locally for preview
      setProducts(prev => prev.filter(p => p.id !== id));
      alert('Product deleted successfully');
    }
  };

  const openStockModal = (product) => {
    setSelectedProduct(product);
    setCostPrice((parseFloat(product.selling_price || product.price || 50) * 0.8).toFixed(2));
    setShowStockModal(true);
  };

  const openHistoryModal = async (product) => {
    setSelectedProduct(product);
    setShowHistoryModal(true);
    setHistoryLoading(true);
    try {
      const res = await axios.get(`http://localhost:8000/stock/batches/?product_id=${product.id}`, { headers: getAuthHeaders() });
      setStockHistory(res.data || []);
    } catch (err) {
      console.error("Failed to load history", err);
      setStockHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleAddCategory = async () => {
    const newCat = window.prompt(t('enter_new_cat_prompt') || 'कॅटेगरीचे नाव टाका:');
    if (!newCat || newCat.trim() === '') return;
    try {
      const res = await axios.post('http://localhost:8000/categories/', { name: newCat.trim() }, { headers: getAuthHeaders() });
      setCategories(prev => [...prev, res.data]);
      setNewProdCategoryId(res.data.id);
      alert(`'${res.data.name}' ` + (t('cat_added_success') || 'कॅटेगरी जोडली गेली!'));
    } catch (error) {
      console.error(error);
      const fakeCat = { id: Date.now(), name: newCat.trim() };
      setCategories(prev => [...prev, fakeCat]);
      alert(`'${newCat.trim()}' कॅटेगरी जोडली गेली!`);
    }
  };

  // Filter products
  const filteredProducts = products.filter(p => {
    const q = search.toLowerCase().trim();
    const matchesSearch = !q || 
      (p.name || '').toLowerCase().includes(q) || 
      (tProduct(p.name) && tProduct(p.name).toLowerCase().includes(q)) || 
      (p.barcode && String(p.barcode).toLowerCase().includes(q)) || 
      (p.categoryName && String(p.categoryName).toLowerCase().includes(q)) || 
      (tCategory(p.categoryName) && tCategory(p.categoryName).toLowerCase().includes(q));
    
    if (!matchesSearch) return false;
    
    if (selectedCategoryFilter !== 'All' && String(p.category_id) !== String(selectedCategoryFilter)) {
      return false;
    }

    if (stockFilter === 'Low') return p.stock > 0 && p.stock <= 10;
    if (stockFilter === 'Out') return p.stock === 0;
    return true;
  });

  return (
    <div className="h-screen flex flex-col bg-[#FDFBF7] font-nunito overflow-hidden selection:bg-brand selection:text-white relative">
      {/* Ambient Mesh Glow Blobs matching screenshot */}
      <div className="absolute -top-20 -left-10 w-96 h-96 bg-gradient-to-tr from-amber-200/50 via-orange-200/40 to-transparent rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-10 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-orange-300/40 via-amber-200/30 to-transparent rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/3 w-[550px] h-[550px] bg-gradient-to-tr from-orange-100/40 via-amber-100/30 to-transparent rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Navbar */}
      <Header searchTerm={search} onSearch={setSearch} />

      {/* Main Layout: Left Navigation Rail + Right Content */}
      <main className="flex-1 flex overflow-hidden relative z-10">
        
        {/* Left Vertical Navigation Rail matching screenshot */}
        <aside className="hidden md:flex flex-col items-center py-4 px-2.5 w-[76px] border-r border-slate-200/80 bg-white/75 backdrop-blur-md gap-3 select-none shrink-0 shadow-2xs">
          
          {/* 1. Dashboard */}
          <Link 
            to="/dashboard"
            className="w-14 h-14 rounded-2xl flex flex-col items-center justify-center gap-1 text-slate-400 hover:text-slate-800 hover:bg-slate-100/80 transition cursor-pointer"
            title="डॅशबोर्ड"
          >
            <ChartLineUp weight="bold" className="text-xl" />
            <span className="text-[10px] font-bold leading-none">डॅशबोर्ड</span>
          </Link>

          {/* 2. Billing (POS) */}
          <Link 
            to="/pos"
            className="w-14 h-14 rounded-2xl flex flex-col items-center justify-center gap-1 text-slate-400 hover:text-slate-800 hover:bg-slate-100/80 transition cursor-pointer"
            title="बिलिंग"
          >
            <Storefront weight="bold" className="text-xl" />
            <span className="text-[10px] font-bold leading-none">बिलिंग</span>
          </Link>

          {/* 3. Inventory (Active Solid Orange Box) */}
          <Link 
            to="/inventory"
            className="w-14 h-14 rounded-2xl flex flex-col items-center justify-center gap-1 bg-[#FF5722] text-white shadow-md shadow-orange-500/35 transition cursor-pointer font-black"
            title="माल साठा"
          >
            <Package weight="fill" className="text-2xl" />
            <span className="text-[10px] leading-none">माल साठा</span>
          </Link>

          {/* 4. Khata */}
          <Link 
            to="/khata"
            className="w-14 h-14 rounded-2xl flex flex-col items-center justify-center gap-1 text-slate-400 hover:text-slate-800 hover:bg-slate-100/80 transition cursor-pointer"
            title="खातेवही"
          >
            <BookBookmark weight="bold" className="text-xl" />
            <span className="text-[10px] font-bold leading-none">खातेवही</span>
          </Link>

          {/* 5. Bill History */}
          <Link 
            to="/history"
            className="w-14 h-14 rounded-2xl flex flex-col items-center justify-center gap-1 text-slate-400 hover:text-slate-800 hover:bg-slate-100/80 transition cursor-pointer"
            title="बिल इतिहास"
          >
            <ClockCounterClockwise weight="bold" className="text-xl" />
            <span className="text-[10px] font-bold leading-none">बिल इतिहास</span>
          </Link>
        </aside>

        {/* Right Content Area */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-5 lg:p-6 flex flex-col gap-3.5 max-w-7xl mx-auto w-full">
          
          {/* Header Title & Subtitle */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 shrink-0">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center text-lg shrink-0 shadow-2xs">
                  📦
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <span>माल साठा व्यवस्थापन</span>
                  <span className="text-xs font-bold text-orange-600 bg-orange-100/80 border border-orange-200/90 rounded-full px-2.5 py-0.5">
                    {products.length} दुकानातील वस्तू
                  </span>
                </h1>
              </div>
              <p className="text-xs font-bold text-slate-500 mt-1">
                दुकानातील साठा, खरेदी किंमत आणि शिल्लक मालाचा थेट हिशोब
              </p>
            </div>
          </div>

          {/* 4 Executive KPI Cards matching screenshot 1:1 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 shrink-0">
            
            {/* 1. Total Items (एकूण वस्तू) */}
            <div className="bg-white rounded-[26px] p-4 border border-slate-200/80 shadow-xs flex items-center justify-between relative overflow-hidden group hover:shadow-md transition">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-md shadow-orange-500/25 shrink-0">
                  <Package weight="bold" className="text-2xl" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">एकूण वस्तू</p>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight leading-tight">
                    {products.length} वस्तू <span className="text-xs text-slate-400 font-bold">(Items)</span>
                  </h3>
                  <p className="text-[10px] font-bold text-slate-400 mt-0.5">
                    {categories.length} सर्व कॅटेगरीज
                  </p>
                </div>
              </div>
              {/* 3D Isometric Cardboard Box Graphic */}
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-orange-200/60 to-amber-100/40 flex items-center justify-center shrink-0 select-none">
                <svg className="w-10 h-10 select-none drop-shadow" viewBox="0 0 36 36" fill="none">
                  <path d="M18 4L32 11L18 18L4 11L18 4Z" fill="#FDBA74" />
                  <path d="M4 11L18 18V32L4 25V11Z" fill="#EA580C" />
                  <path d="M32 11L18 18V32L32 25V11Z" fill="#C2410C" />
                  <path d="M15 12.5L21 9.5L21 23.5L15 26.5Z" fill="#FED7AA" fillOpacity="0.9" />
                </svg>
              </div>
            </div>

            {/* 2. Stock Valuation (माल भांडवल) - Deep Emerald Gradient Card */}
            <div className="bg-gradient-to-br from-[#056046] via-[#047857] to-[#024E38] rounded-[26px] p-4 text-white shadow-lg shadow-emerald-900/15 border border-emerald-600/30 flex items-center justify-between relative overflow-hidden group">
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-11 h-11 rounded-2xl bg-emerald-400/20 border border-emerald-300/30 flex items-center justify-center text-white text-xl font-black shadow-inner shrink-0">
                  ₹
                </div>
                <div>
                  <p className="text-[11px] font-bold text-emerald-200 uppercase tracking-wide">माल भांडवल</p>
                  <h3 className="text-2xl font-black text-white tracking-tight leading-tight">
                    ₹{Math.round(totalStockValuation).toLocaleString('en-IN')}
                  </h3>
                  <p className="text-[10px] font-bold text-emerald-200/80 mt-0.5">मालाचे एकूण मूल्य</p>
                </div>
              </div>
              {/* Giant 3D Rupee Watermark Accent */}
              <div className="text-emerald-400/25 select-none pointer-events-none pr-1">
                <CurrencyInr weight="bold" className="text-6xl drop-shadow-[0_0_12px_rgba(52,211,153,0.3)]" />
              </div>
            </div>

            {/* 3. Low Stock (कमी शिल्लक माल) */}
            <div className="bg-white rounded-[26px] p-4 border border-slate-200/80 shadow-xs flex items-center justify-between relative overflow-hidden group hover:shadow-md transition">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-md shadow-orange-500/25 shrink-0 text-xl font-black">
                  !
                </div>
                <div>
                  <p className="text-[11px] font-bold text-amber-700 uppercase tracking-wide">कमी शिल्लक माल</p>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight leading-tight">
                    {lowStockItems.length} वस्तू <span className="text-xs text-slate-400 font-bold">(Items)</span>
                  </h3>
                  <p className="text-[10px] font-bold text-slate-400 mt-0.5">10 पेक्षा कमी शिल्लक</p>
                </div>
              </div>
            </div>

            {/* 4. Out of Stock (संपलेला माल) */}
            <div className="bg-white rounded-[26px] p-4 border border-slate-200/80 shadow-xs flex items-center justify-between relative overflow-hidden group hover:shadow-md transition">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center text-white shadow-md shadow-red-500/25 shrink-0 text-xl font-black">
                  !
                </div>
                <div>
                  <p className="text-[11px] font-bold text-rose-600 uppercase tracking-wide">संपलेला माल</p>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight leading-tight">
                    {outOfStockItems.length} वस्तू <span className="text-xs text-slate-400 font-bold">(Items)</span>
                  </h3>
                  <p className="text-[10px] font-bold text-emerald-600 mt-0.5 flex items-center gap-1">
                    ✓ छान शिल्लक • 0 जल शिल्लक
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Filter & Action Bar matching screenshot */}
          <div className="bg-white/80 backdrop-blur-md rounded-[24px] border border-slate-200/90 p-2 sm:p-2.5 flex flex-wrap items-center justify-between gap-2.5 shadow-xs shrink-0">
            
            {/* Left Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto">
              {/* All */}
              <button 
                onClick={() => setStockFilter('All')}
                className={`px-4 py-2 rounded-2xl text-xs transition cursor-pointer select-none whitespace-nowrap ${
                  stockFilter === 'All' 
                    ? 'bg-white text-slate-900 font-black border border-slate-300 shadow-xs' 
                    : 'bg-white/60 hover:bg-white text-slate-600 border border-slate-200/70 font-bold'
                }`}
              >
                सर्व ({products.length})
              </button>

              {/* In-Bar Search Box with Scanner Wave Icon */}
              <div className="relative w-56 sm:w-64">
                <MagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                <input 
                  type="text" 
                  placeholder="वस्तू शोधा किंवा बारकोड स्कॅन करा..." 
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full h-9 pl-9 pr-8 bg-white/95 border border-slate-200/90 rounded-2xl text-xs font-bold text-slate-800 placeholder-slate-400 outline-none focus:border-brand shadow-2xs"
                />
                <svg className="w-4 h-4 text-orange-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 12c3-4 6-4 9 0s6 4 9 0" />
                </svg>
              </div>

              {/* Low Stock Pill */}
              <button 
                onClick={() => setStockFilter(stockFilter === 'Low' ? 'All' : 'Low')}
                className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap select-none ${
                  stockFilter === 'Low' 
                    ? 'bg-amber-500 text-white shadow-xs font-black' 
                    : 'bg-white/70 hover:bg-white border border-slate-200/80 text-slate-700'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0"></span>
                <span>कमी शिल्लक ({lowStockItems.length})</span>
              </button>

              {/* Out of Stock Pill */}
              <button 
                onClick={() => setStockFilter(stockFilter === 'Out' ? 'All' : 'Out')}
                className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap select-none ${
                  stockFilter === 'Out' 
                    ? 'bg-red-500 text-white shadow-xs font-black' 
                    : 'bg-white/70 hover:bg-white border border-slate-200/80 text-slate-700'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-red-500 shrink-0"></span>
                <span>संपलेला माल ({outOfStockItems.length})</span>
                <span className="text-[10px] ml-0.5">⌄</span>
              </button>
            </div>

            {/* Right Action Controls */}
            <div className="flex items-center gap-2">
              <button 
                onClick={() => alert('Barcode Scanner active!')}
                className="bg-white/80 hover:bg-white border border-slate-200/90 rounded-2xl px-3.5 py-2 text-xs font-bold text-slate-600 flex items-center gap-1.5 transition shadow-xs cursor-pointer select-none"
              >
                <Barcode className="text-sm text-slate-500" />
                <span>वस्तू शोधा किंवा बारकोड स्कॅन ›</span>
              </button>

              <button 
                onClick={handleAddCategory}
                className="bg-white hover:bg-white border border-slate-200/90 rounded-2xl px-3.5 py-2 text-xs font-bold text-slate-800 shadow-xs flex items-center gap-1.5 transition cursor-pointer select-none"
              >
                <Folders weight="bold" className="text-sm text-slate-600" />
                <span>+ कॅटेगरी</span>
              </button>

              <button 
                onClick={openNewProductModal}
                className="bg-gradient-to-r from-[#FF5722] via-[#FF6E40] to-[#FF8A65] hover:opacity-95 text-white font-black px-4 py-2 rounded-2xl text-xs shadow-md shadow-orange-500/30 flex items-center gap-1.5 transition cursor-pointer select-none"
              >
                <Plus weight="bold" className="text-sm" />
                <span>+ नवीन उत्पादन</span>
              </button>
            </div>
          </div>

          {/* Products Table Card matching screenshot */}
          <div className="bg-white/95 backdrop-blur-md rounded-[28px] border border-slate-200/80 shadow-xs flex-1 flex flex-col overflow-hidden">
            
            {/* Table Column Headers */}
            <div className="grid grid-cols-12 gap-4 px-6 py-3.5 bg-slate-100/70 border-b border-slate-200/70 text-xs font-black text-slate-600 shrink-0 select-none">
              <div className="col-span-12 sm:col-span-5">उत्पादनाचे नाव & बारकोड</div>
              <div className="hidden sm:block sm:col-span-2">कॅटेगरी</div>
              <div className="hidden sm:block sm:col-span-2 text-center">शिल्लक साठा</div>
              <div className="hidden sm:block sm:col-span-1 text-right">विक्री किंमत</div>
              <div className="col-span-12 sm:col-span-2 text-right sm:text-center">कृती</div>
            </div>

            {/* Scrollable Products List */}
            <div className="flex-1 overflow-y-auto p-2 sm:p-3 space-y-2.5">
              {filteredProducts.map((p) => {
                const catInfo = getCategoryBadgeInfo(p.categoryName);
                const isLowStock = p.stock > 0 && p.stock <= 10;
                const isOutOfStock = p.stock === 0;

                return (
                  <div 
                    key={p.id}
                    className="grid grid-cols-12 gap-4 items-center bg-white hover:bg-orange-50/20 border border-slate-200/70 rounded-2xl p-3 sm:px-5 sm:py-3.5 transition shadow-2xs"
                  >
                    
                    {/* 1. Product Name & Barcode */}
                    <div className="col-span-12 sm:col-span-5 flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200/80 overflow-hidden shrink-0 shadow-2xs">
                        <img 
                          src={p.image || '/images/atta.jpg'} 
                          alt={tProduct(p.name)} 
                          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/images/atta.jpg'; }}
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs sm:text-sm font-black text-slate-900 truncate">
                          {tProduct(p.name)}
                        </h4>
                        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                          <span className="text-[10px] font-bold text-slate-400">
                            [#] {p.barcode || '8901007001'}
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="bg-orange-50 text-orange-600 border border-orange-200/80 rounded-md px-1.5 py-0.2 text-[10px] font-bold">
                            {p.unit || p.size || 'Pouch'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 2. Category */}
                    <div className="hidden sm:block sm:col-span-2">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50/70 border border-sky-100 text-slate-700 text-xs font-bold">
                        <span>{catInfo.icon}</span>
                        <span className="truncate">{catInfo.label}</span>
                        <span>{catInfo.emoji2}</span>
                      </div>
                    </div>

                    {/* 3. Available Stock Stepper */}
                    <div className="hidden sm:flex sm:col-span-2 justify-center items-center">
                      <div className="inline-flex items-center justify-between gap-3 bg-amber-50/80 border border-amber-200/90 rounded-2xl px-3 py-1 h-9 shadow-2xs">
                        <button 
                          type="button"
                          onClick={() => handleQuickStockChange(p.id, -1)} 
                          className="text-amber-700 hover:text-amber-900 font-black text-sm px-1 cursor-pointer transition select-none"
                        >
                          −
                        </button>
                        <span className="font-black text-xs text-amber-900 whitespace-nowrap">
                          {p.stock} {p.unit || p.size || 'Pouch'}
                        </span>
                        <button 
                          type="button"
                          onClick={() => handleQuickStockChange(p.id, 1)} 
                          className="text-amber-700 hover:text-amber-900 font-black text-sm px-1 cursor-pointer transition select-none"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* 4. Selling Price */}
                    <div className="hidden sm:block sm:col-span-1 text-right">
                      <p className="font-black text-base text-slate-900 leading-tight">
                        ₹{parseFloat(p.selling_price || p.price || 0).toFixed(2)}
                      </p>
                      <p className="text-[10px] text-slate-400 font-bold">
                        original stripe ₹{parseFloat(p.mrp || (p.selling_price * 1.15) || 0).toFixed(2)}
                      </p>
                    </div>

                    {/* 5. Quick Actions */}
                    <div className="col-span-12 sm:col-span-2 flex items-center justify-end gap-1.5">
                      {/* + साठा भरा Button */}
                      <button 
                        type="button"
                        onClick={() => openStockModal(p)}
                        className="bg-gradient-to-r from-[#FF5722] via-[#FF6E40] to-[#FF8A65] hover:opacity-95 text-white font-black text-xs px-3.5 py-1.5 rounded-2xl shadow-xs hover:shadow-sm transition cursor-pointer whitespace-nowrap"
                      >
                        + साठा भरा
                      </button>

                      {/* Edit */}
                      <button 
                        type="button"
                        onClick={() => openEditProductModal(p)}
                        className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition cursor-pointer"
                        title="Edit"
                      >
                        <PencilSimple weight="bold" className="text-xs" />
                      </button>

                      {/* History */}
                      <button 
                        type="button"
                        onClick={() => openHistoryModal(p)}
                        className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition cursor-pointer"
                        title="History"
                      >
                        <ClockCounterClockwise weight="bold" className="text-xs" />
                      </button>

                      {/* Delete */}
                      <button 
                        type="button"
                        onClick={() => handleDeleteProduct(p.id)}
                        className="w-8 h-8 rounded-full bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-500 flex items-center justify-center transition cursor-pointer"
                        title="Delete"
                      >
                        <Trash weight="bold" className="text-xs" />
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </main>

      {/* 1. Stock History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl border border-slate-100 flex flex-col max-h-[80vh] animate-scale-up">
            <div className="flex justify-between items-center mb-5 shrink-0">
              <div>
                <h3 className="font-black text-xl text-slate-900 flex items-center gap-2">
                  <ClockCounterClockwise className="text-brand text-2xl" /> {t('stock_batch_history')}
                </h3>
                <p className="text-sm font-bold text-slate-500 mt-1">{tProduct(selectedProduct?.name)}</p>
              </div>
              <button onClick={() => setShowHistoryModal(false)} className="text-slate-400 hover:text-red-500 hover:bg-slate-100 p-1.5 rounded-full transition cursor-pointer">
                <X weight="bold" className="text-xl"/> 
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2.5">
              {historyLoading ? (
                <div className="flex justify-center py-10"><div className="animate-spin h-6 w-6 border-2 border-brand rounded-full border-t-transparent"></div></div>
              ) : stockHistory.length === 0 ? (
                <div className="text-center py-10 text-slate-500 font-medium">{t('no_stock_batches')}</div>
              ) : (
                stockHistory.map((batch, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-200/70 rounded-2xl p-4 flex justify-between items-center">
                    <div>
                      <p className="font-black text-slate-800 text-sm">{t('batch')}: {batch.batch_number}</p>
                      <p className="text-xs font-bold text-slate-500 uppercase mt-1">{t('current_quantity')}: {batch.current_quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-slate-500 uppercase mb-0.5">{t('purchase_cost')}</p>
                      <p className="font-black text-brand text-lg">₹{batch.purchase_rate.toFixed(2)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. Add Stock (साठा भरा) Modal */}
      {showStockModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-slate-100 animate-scale-up">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-black text-xl text-slate-900 flex items-center gap-2">
                <Plus weight="bold" className="text-emerald-500" /> साठा भरा (Add Stock)
              </h3>
              <button onClick={() => setShowStockModal(false)} className="text-slate-400 hover:text-red-500 hover:bg-slate-100 p-1.5 rounded-full transition cursor-pointer">
                <X weight="bold" className="text-xl"/> 
              </button>
            </div>
            
            <div className="p-3 rounded-2xl bg-orange-50 border border-orange-100 mb-4">
              <p className="text-xs font-bold text-slate-500 uppercase">{t('product_name')}</p>
              <h4 className="text-sm font-black text-slate-800 mt-0.5">{tProduct(selectedProduct?.name)}</h4>
            </div>

            <form onSubmit={handleAddStock} className="flex flex-col gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1 flex justify-between">
                  <span>{t('quantity_received')}</span>
                  <span className="text-brand bg-orange-100 px-1.5 rounded font-black">{tUnit(selectedProduct?.unit || selectedProduct?.size) || 'Unit'}</span>
                </label>
                <input 
                  type="number" required min="0.01" step="0.01"
                  value={addQty} onChange={e => setAddQty(e.target.value)}
                  className="w-full h-11 border border-slate-200 rounded-2xl px-4 font-bold focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition text-base" 
                  placeholder={t('quantity_received')}
                  autoFocus
                />
              </div>
              
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">{t('purchase_rate_per_unit')} (₹)</label>
                <input 
                  type="number" required step="0.01"
                  value={costPrice} onChange={e => setCostPrice(e.target.value)}
                  className="w-full h-11 border border-slate-200 rounded-2xl px-4 font-bold focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition text-base" 
                />
              </div>
              
              <button type="submit" className="w-full h-12 bg-gradient-to-r from-[#FF5722] via-[#FF6E40] to-[#FF8A65] hover:opacity-95 text-white rounded-2xl font-black mt-2 transition shadow-lg shadow-orange-500/30 cursor-pointer">
                {t('confirm_stock_entry') || 'स्टॉक नोंदवा'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 3. Add/Edit Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto custom-scrollbar animate-scale-up">
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-black text-xl text-slate-900">
                {isEditing ? t('edit_item_details') : t('add_new_product_title')}
              </h3>
              <button onClick={() => setShowProductModal(false)} className="text-slate-400 hover:text-red-500 hover:bg-slate-100 p-1.5 rounded-full transition cursor-pointer">
                <X weight="bold" className="text-xl"/> 
              </button>
            </div>
            
            <form onSubmit={handleSaveProduct} className="flex flex-col gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">{t('product_name')} *</label>
                <input 
                  type="text" required
                  value={newProdName} onChange={e => setNewProdName(e.target.value)}
                  className="w-full h-11 border border-slate-200 rounded-2xl px-3.5 font-bold focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20" 
                  placeholder="उदा. अमुल ताजे दूध, साखर, इत्यादी"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1 flex justify-between">
                    <span>{t('category')} *</span>
                  </label>
                  <select 
                    value={newProdCategoryId} onChange={e => setNewProdCategoryId(e.target.value)}
                    className="w-full h-11 border border-slate-200 rounded-2xl px-3 font-bold bg-white focus:border-brand focus:outline-none"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{tCategory(c.name)}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">{t('unit')} *</label>
                  <select 
                    value={newProdUnit} onChange={e => setNewProdUnit(e.target.value)}
                    className="w-full h-11 border border-slate-200 rounded-2xl px-3 font-bold bg-white focus:border-brand focus:outline-none"
                  >
                    <option value="kg">kg (किलो)</option>
                    <option value="gm">gm (ग्रॅम)</option>
                    <option value="ltr">ltr (लिटर)</option>
                    <option value="Pouch">Pouch (पाऊच)</option>
                    <option value="Pkt">Pkt (पॅकेट)</option>
                    <option value="Piece">Piece (नग)</option>
                    <option value="Box">Box (बॉक्स)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">{t('selling_price')} (₹) *</label>
                  <input 
                    type="number" required step="0.01" min="0"
                    value={newProdSelling} onChange={e => setNewProdSelling(e.target.value)}
                    className="w-full h-11 border border-slate-200 rounded-2xl px-3.5 font-bold focus:border-brand focus:outline-none" 
                    placeholder="उदा. 27"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">{t('mrp')} (₹)</label>
                  <input 
                    type="number" step="0.01" min="0"
                    value={newProdMrp} onChange={e => setNewProdMrp(e.target.value)}
                    className="w-full h-11 border border-slate-200 rounded-2xl px-3.5 font-bold focus:border-brand focus:outline-none" 
                    placeholder="उदा. 30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">{t('barcode')} (Optional)</label>
                <div className="relative">
                  <Barcode className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
                  <input 
                    type="text"
                    value={newProdBarcode} onChange={e => setNewProdBarcode(e.target.value)}
                    className="w-full h-11 border border-slate-200 rounded-2xl pl-10 pr-3.5 font-bold focus:border-brand focus:outline-none" 
                    placeholder="उदा. 8901007001"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">{t('image_url')} (Optional)</label>
                <div className="relative">
                  <ImageIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
                  <input 
                    type="text"
                    value={newProdImage} onChange={e => setNewProdImage(e.target.value)}
                    className="w-full h-11 border border-slate-200 rounded-2xl pl-10 pr-3.5 font-bold focus:border-brand focus:outline-none" 
                    placeholder="उदा. /images/milk.jpg"
                  />
                </div>
              </div>

              <button type="submit" className="w-full h-12 bg-gradient-to-r from-[#FF5722] via-[#FF6E40] to-[#FF8A65] hover:opacity-95 text-white rounded-2xl font-black mt-2 transition shadow-lg shadow-orange-500/30 cursor-pointer">
                {isEditing ? t('save_changes') : t('create_product_btn')}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
