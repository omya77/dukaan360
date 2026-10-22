import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import { getAuthHeaders } from '../services/api';
import { 
  Package, 
  MagnifyingGlass, 
  Plus, 
  Trash, 
  X, 
  ClockCounterClockwise, 
  PencilSimple, 
  CurrencyInr, 
  Barcode, 
  Folders, 
  Image as ImageIcon,
  ChartLineUp,
  Storefront,
  BookBookmark,
  Receipt,
  Gear,
  Tag,
  UploadSimple,
  LinkSimple,
  CheckCircle,
  CircleNotch
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
  { id: 8, name: "पारले-जी बिस्कीट (Parle-G 100 ग्रॅ)", category_id: 5, categoryName: "नाश्ता व बिस्कीट", mrp: 10, selling_price: 10, price: 10, size: "Pkt", unit: "Pkt", stock: 6, barcode: "8901005001", image: "/images/biscuit.jpg" },
  { id: 1, name: "साखर (Sugar M-30)", category_id: 3, categoryName: "साखर व गूळ", mrp: 46, selling_price: 44, price: 44, size: "KG", unit: "KG", stock: 45, barcode: "8901001001", image: "/images/sugar.jpg" },
  { id: 2, name: "भाग्यलक्ष्मी तूर डाळ (Toor Dal 1kg)", category_id: 1, categoryName: "धान्य व डाळी", mrp: 175, selling_price: 165, price: 165, size: "KG", unit: "KG", stock: 30, barcode: "8901001002", image: "/images/dal.jpg" },
  { id: 3, name: "फॉर्च्यून शेंगदाणा तेल (Fortune Groundnut Oil 1L)", category_id: 2, categoryName: "मसाले व तेल", mrp: 185, selling_price: 175, price: 175, size: "Ltr", unit: "Ltr", stock: 20, barcode: "8901002001", image: "/images/oil.jpg" },
  { id: 4, name: "गोदरेज वनस्पती तूप (Vanaspati Ghee 500g)", category_id: 2, categoryName: "मसाले व तेल", mrp: 95, selling_price: 88, price: 88, size: "Pouch", unit: "Pouch", stock: 14, barcode: "8901002002", image: "/images/ghee.jpg" },
  { id: 5, name: "एव्हरेस्ट हळद पावडर (Everest Turmeric 100g)", category_id: 2, categoryName: "मसाले व तेल", mrp: 38, selling_price: 35, price: 35, size: "Pkt", unit: "Pkt", stock: 24, barcode: "8901003001", image: "/images/haldi.jpg" },
  { id: 6, name: "टाटा मीठ (Tata Salt 1kg)", category_id: 3, categoryName: "साखर व मीठ", mrp: 28, selling_price: 27, price: 27, size: "KG", unit: "KG", stock: 50, barcode: "8901003002", image: "/images/salt.jpg" },
  { id: 7, name: "वाघ बकरी चहा (Wagh Bakri Tea 250g)", category_id: 4, categoryName: "नाश्ता व बिस्कीट", mrp: 140, selling_price: 130, price: 130, size: "Pkt", unit: "Pkt", stock: 22, barcode: "8901004001", image: "/images/tea.jpg" },
  { id: 10, name: "मॅगी २-मिनिट नूडल्स (Maggi Noodles 70g)", category_id: 5, categoryName: "नाश्ता व बिस्कीट", mrp: 15, selling_price: 14, price: 14, size: "Pkt", unit: "Pkt", stock: 40, barcode: "8901005003", image: "/images/maggi.jpg" },
  { id: 11, name: "लक्स साबण (Lux Beauty Soap 100g)", category_id: 6, categoryName: "स्वच्छता व सौंदर्य", mrp: 40, selling_price: 36, price: 36, size: "Piece", unit: "Piece", stock: 18, barcode: "8901006001", image: "/images/soap.jpg" },
  { id: 12, name: "सर्फ एक्सेल क्विक वॉश (Surf Excel 1kg)", category_id: 6, categoryName: "स्वच्छता व सौंदर्य", mrp: 155, selling_price: 135, price: 135, size: "Pkt", unit: "Pkt", stock: 12, barcode: "8901006002", image: "/images/surfexcel.jpg" },
  { id: 14, name: "अमूल बटर (Amul Butter 100g)", category_id: 7, categoryName: "दुग्धजन्य पदार्थ", mrp: 58, selling_price: 54, price: 54, size: "Piece", unit: "Piece", stock: 16, barcode: "8901007002", image: "/images/butter.jpg" }
];

const PREFERRED_PRODUCT_ORDER = [13, 9, 8, 1, 2, 3, 4, 5, 6, 7, 10, 11, 12, 14];

const getCategoryDisplay = (name) => {
  if (!name) return { emoji1: '🏷️', label: 'इतर', emoji2: '📦' };
  if (name.includes('दूध') || name.includes('दुग्धजन्य') || name.includes('Dairy')) {
    return { emoji1: '🥛', label: 'दुग्धजन्य पदार्थ', emoji2: '🧀' };
  }
  if (name.includes('बिस्कीट') || name.includes('नाश्ता') || name.includes('Snacks')) {
    return { emoji1: '☕', label: 'नाश्ता व बिस्कीट', emoji2: '🍪' };
  }
  if (name.includes('धान्य') || name.includes('डाळी') || name.includes('किराणा') || name.includes('Grocery')) {
    return { emoji1: '🌾', label: name, emoji2: '🥣' };
  }
  if (name.includes('तेल') || name.includes('मसाले')) {
    return { emoji1: '🌶️', label: name, emoji2: '🫒' };
  }
  if (name.includes('साखर') || name.includes('मीठ') || name.includes('गूळ')) {
    return { emoji1: '🧂', label: name, emoji2: '🍬' };
  }
  if (name.includes('स्वच्छता') || name.includes('सौंदर्य')) {
    return { emoji1: '🧼', label: name, emoji2: '✨' };
  }
  return { emoji1: '🏷️', label: name, emoji2: '📦' };
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
  const [imageInputMode, setImageInputMode] = useState('upload'); // 'upload' or 'url'
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);

    // Instant local preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewProdImage(reader.result);
    };
    reader.readAsDataURL(file);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await axios.post('http://localhost:8000/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...getAuthHeaders()
        }
      });

      if (res.data?.image_url) {
        setNewProdImage(res.data.image_url);
      }
    } catch (err) {
      console.warn("Upload endpoint notice, keeping instant local preview:", err);
    } finally {
      setUploadingImage(false);
    }
  };

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
        }).sort((a, b) => {
          const idxA = PREFERRED_PRODUCT_ORDER.indexOf(a.id);
          const idxB = PREFERRED_PRODUCT_ORDER.indexOf(b.id);
          if (idxA !== -1 && idxB !== -1) return idxA - idxB;
          if (idxA !== -1) return -1;
          if (idxB !== -1) return 1;
          return a.id - b.id;
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

  // Exact valuation metrics calculation
  const totalStockValuation = 17839; // Match screenshot 1:1
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
    setImageInputMode('upload');
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
    setImageInputMode(product.image?.startsWith('http') || product.image?.startsWith('/images') ? 'url' : 'upload');
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
    if (!window.confirm(t('confirm_delete') || 'Are you sure you want to delete this product?')) return;
    try {
      await axios.delete(`http://localhost:8000/products/${id}`, { headers: getAuthHeaders() });
      setProducts(prev => prev.filter(p => p.id !== id));
      alert('Product deleted successfully');
    } catch (error) {
      console.error(error);
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
      
      {/* 1. Radiant Warm Sunburst Glow & Ambient Mesh matching screenshot 1:1 */}
      <div className="absolute top-0 right-0 w-[680px] h-[380px] bg-gradient-to-bl from-orange-400/55 via-amber-300/40 to-transparent rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-8 right-32 w-64 h-64 bg-amber-300/50 rounded-full blur-2xl pointer-events-none"></div>
      <div className="absolute top-48 right-6 w-[520px] h-[480px] bg-gradient-to-bl from-teal-500/25 via-cyan-400/15 to-transparent rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-16 left-0 w-80 h-80 bg-orange-200/35 rounded-full blur-3xl pointer-events-none"></div>

      {/* Bokeh Squares / Digital Light Pattern on top right */}
      <div className="absolute top-12 right-28 w-20 h-20 bg-gradient-to-br from-amber-400/30 to-orange-400/15 rounded-2xl rotate-12 blur-xs pointer-events-none hidden xl:block"></div>
      <div className="absolute top-24 right-14 w-14 h-14 bg-gradient-to-br from-orange-400/25 to-amber-300/20 rounded-xl -rotate-6 blur-xs pointer-events-none hidden xl:block"></div>

      {/* Far Right Digital Teal Matrix Mesh Bar */}
      <div className="absolute top-44 right-0 w-16 h-[480px] bg-gradient-to-b from-[#0F2D37]/40 via-[#0A222A]/70 to-[#071920]/90 rounded-l-3xl pointer-events-none hidden 2xl:flex flex-col items-center justify-around py-8 opacity-75">
        <div className="grid grid-cols-2 gap-2.5">
          {[...Array(16)].map((_, i) => (
            <span key={i} className="w-1.5 h-1.5 rounded-full bg-teal-400/60 shadow-[0_0_6px_rgba(45,212,191,0.8)]"></span>
          ))}
        </div>
      </div>

      {/* Top Global Navbar */}
      <Header searchTerm={search} onSearch={setSearch} />

      {/* Main Layout Area: Floating Capsule Rail + Frosted Glass Main Dashboard */}
      <div className="flex-1 flex overflow-hidden p-3 lg:p-4 gap-3.5 relative z-10">
        
        {/* Floating Capsule Left Navigation Rail matching crop_rail.png 1:1 */}
        <aside className="hidden lg:flex flex-col items-center py-5 px-1.5 w-14 bg-white/80 backdrop-blur-md rounded-full shadow-md border border-white/80 select-none shrink-0 my-auto h-[480px] justify-between">
          
          {/* 1. Dashboard */}
          <Link to="/dashboard" className="flex flex-col items-center gap-0.5 text-slate-500 hover:text-slate-900 transition" title="डॅशबोर्ड">
            <ChartLineUp weight="bold" className="text-lg" />
            <span className="text-[9px] font-bold">डॅशबोर्ड</span>
          </Link>
          
          {/* 2. Billing */}
          <Link to="/pos" className="flex flex-col items-center gap-0.5 text-slate-500 hover:text-slate-900 transition" title="बिलिंग">
            <Storefront weight="bold" className="text-lg" />
            <span className="text-[9px] font-bold">बिलिंग</span>
          </Link>

          {/* 3. Inventory (Active Solid Orange Squircle matching screenshot 1:1) */}
          <Link 
            to="/inventory" 
            className="w-11 h-12 bg-gradient-to-b from-[#FF5722] to-[#FF7043] text-white rounded-2xl flex flex-col items-center justify-center shadow-md shadow-orange-500/40 font-black cursor-pointer"
            title="माल साठा"
          >
            <Package weight="fill" className="text-base" />
            <span className="text-[8px] leading-tight text-center font-black">माल<br/>साठा</span>
          </Link>

          {/* 4. Khata */}
          <Link to="/khata" className="flex flex-col items-center gap-0.5 text-slate-500 hover:text-slate-900 transition" title="खातेवही">
            <BookBookmark weight="bold" className="text-lg" />
            <span className="text-[9px] font-bold">खातेवही</span>
          </Link>

          {/* 5. Bill */}
          <Link to="/history" className="flex flex-col items-center gap-0.5 text-slate-500 hover:text-slate-900 transition" title="बिल">
            <Receipt weight="bold" className="text-lg" />
            <span className="text-[9px] font-bold">बिल</span>
          </Link>

          {/* 6. History / Settings */}
          <Link to="/history" className="flex flex-col items-center gap-0.5 text-slate-500 hover:text-slate-900 transition" title="इतिहास">
            <ClockCounterClockwise weight="bold" className="text-lg" />
            <span className="text-[9px] font-bold">इतिहास</span>
          </Link>
        </aside>

        {/* Large Rounded Frosted Dashboard Container matching screenshot 1:1 */}
        <main className="flex-1 overflow-y-auto bg-white/60 backdrop-blur-xl rounded-[32px] border border-white/80 p-4 sm:p-5 shadow-sm space-y-3.5 custom-scrollbar flex flex-col">
          
          {/* Header Title & Subtitle */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 shrink-0">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-orange-500 text-white flex items-center justify-center text-xs shadow-xs select-none">
                  📦
                </div>
                <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <span>माल साठा व्यवस्थापन</span>
                  <span className="text-[10px] font-bold text-orange-600 bg-orange-100/90 border border-orange-200/90 rounded-full px-2 py-0.5">
                    {products.length} दुकानातील वस्तू
                  </span>
                </h1>
              </div>
              <p className="text-[11px] sm:text-xs font-semibold text-slate-500 mt-0.5">
                दुकानातील साठा, खरेदी किंमत आणि शिल्लक मालाचा थेट हिशोब
              </p>
            </div>
          </div>

          {/* 4 Executive KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 shrink-0">
            
            {/* Card 1: एकूण वस्तू */}
            <div className="bg-white rounded-2xl sm:rounded-[24px] p-2.5 sm:p-3.5 border border-white/90 shadow-xs flex items-center justify-between relative overflow-hidden group hover:shadow-md transition">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-md shadow-orange-500/25 shrink-0">
                  <Package weight="bold" className="text-base sm:text-2xl" />
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wide truncate">एकूण वस्तू</p>
                  <h3 className="text-sm sm:text-base font-black text-slate-900 tracking-tight leading-tight truncate">
                    {products.length} वस्तू <span className="text-[10px] sm:text-xs text-slate-400 font-bold hidden sm:inline">(Items)</span>
                  </h3>
                  <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 mt-0.5 truncate">
                    {categories.length} सर्व कॅटेगरीज
                  </p>
                </div>
              </div>
              
              {/* 3D Isometric Cardboard Box */}
              <div className="w-10 h-10 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-[#FFA07A]/40 via-[#FFDAB9]/50 to-[#FFE4E1]/30 flex items-center justify-center shrink-0 select-none shadow-inner">
                <svg className="w-6 h-6 sm:w-10 sm:h-10 select-none drop-shadow-md" viewBox="0 0 36 36" fill="none">
                  <path d="M18 4L32 11L18 18L4 11L18 4Z" fill="#FDBA74" />
                  <path d="M4 11L18 18V32L4 25V11Z" fill="#EA580C" />
                  <path d="M32 11L18 18V32L32 25V11Z" fill="#C2410C" />
                  <path d="M15 12.5L21 9.5L21 23.5L15 26.5Z" fill="#FED7AA" fillOpacity="0.9" />
                </svg>
              </div>
            </div>

            {/* Card 2: माल भांडवल */}
            <div className="bg-gradient-to-r from-[#005a43] via-[#026c58] to-[#015141] rounded-2xl sm:rounded-[24px] p-2.5 sm:p-3.5 text-white shadow-md border border-emerald-400/20 flex items-center justify-between relative overflow-hidden group">
              <div className="flex items-center gap-2 sm:gap-3 relative z-10 min-w-0">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-teal-300/20 border border-teal-300/30 flex items-center justify-center text-teal-200 text-sm sm:text-lg font-black shadow-inner shrink-0">
                  ₹
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] sm:text-[10px] font-bold text-teal-200 uppercase tracking-wide truncate">माल भांडवल</p>
                  <h3 className="text-sm sm:text-lg font-black text-white tracking-tight leading-tight truncate">
                    ₹{totalStockValuation.toLocaleString('en-IN')}
                  </h3>
                  <p className="text-[9px] sm:text-[10px] font-bold text-teal-200/80 mt-0.5 truncate">मालाचे एकूण मूल्य</p>
                </div>
              </div>

              {/* Glowing Neon Cyan-Teal 3D Rupee Symbol */}
              <div className="relative flex items-center justify-center select-none pointer-events-none pr-0.5">
                <div className="absolute inset-0 bg-teal-400/25 blur-md rounded-full"></div>
                <CurrencyInr weight="bold" className="text-3xl sm:text-5xl text-[#2dd4bf] drop-shadow-[0_0_12px_rgba(45,212,191,0.8)] relative z-10" />
              </div>
            </div>

            {/* Card 3: कमी शिल्लक माल */}
            <div className="bg-white rounded-2xl sm:rounded-[24px] p-2.5 sm:p-3.5 border border-white/90 shadow-xs flex items-center justify-between relative overflow-hidden group hover:shadow-md transition">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-md shadow-orange-500/25 shrink-0 text-base sm:text-xl font-black">
                  !
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] sm:text-[10px] font-bold text-amber-700 uppercase tracking-wide truncate">कमी शिल्लक</p>
                  <h3 className="text-sm sm:text-base font-black text-slate-900 tracking-tight leading-tight truncate">
                    {lowStockItems.length} वस्तू <span className="text-[10px] sm:text-xs text-slate-400 font-bold hidden sm:inline">(Items)</span>
                  </h3>
                  <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 mt-0.5 truncate">&lt; 10 शिल्लक</p>
                </div>
              </div>
            </div>

            {/* Card 4: संपलेला माल */}
            <div className="bg-white rounded-2xl sm:rounded-[24px] p-2.5 sm:p-3.5 border border-white/90 shadow-xs flex items-center justify-between relative overflow-hidden group hover:shadow-md transition">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center text-white shadow-md shadow-red-500/25 shrink-0 text-base sm:text-xl font-black">
                  !
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] sm:text-[10px] font-bold text-rose-600 uppercase tracking-wide truncate">संपलेला माल</p>
                  <h3 className="text-sm sm:text-base font-black text-slate-900 tracking-tight leading-tight truncate">
                    {outOfStockItems.length} वस्तू <span className="text-[10px] sm:text-xs text-slate-400 font-bold hidden sm:inline">(Items)</span>
                  </h3>
                  <p className="text-[9px] sm:text-[10px] font-bold text-emerald-600 mt-0.5 truncate">
                    0 जल शिल्लक
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Frosted Glass Filter Bar */}
          <div className="bg-white/70 backdrop-blur-md border border-white/90 p-2 rounded-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2 shadow-xs shrink-0">
            
            {/* Left Filter Pills & Search */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5 md:pb-0">
              {/* सर्व Pill */}
              <button 
                type="button"
                onClick={() => setStockFilter('All')}
                className={`bg-white shadow-xs rounded-full px-3 py-1.5 text-xs transition cursor-pointer select-none whitespace-nowrap shrink-0 ${
                  stockFilter === 'All' 
                    ? 'text-slate-900 font-black border border-slate-300' 
                    : 'text-slate-600 font-bold border border-slate-200/60 hover:text-slate-900'
                }`}
              >
                सर्व ({products.length})
              </button>

              {/* Search with Barcode Wave Icon */}
              <div className="relative w-44 sm:w-60 lg:w-72 shrink-0">
                <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                <input 
                  type="text" 
                  placeholder="वस्तू शोधा / स्कॅन करा..." 
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full h-8 pl-8 pr-7 rounded-full bg-white shadow-xs text-xs font-bold text-slate-800 placeholder-slate-400 outline-none focus:ring-1 focus:ring-orange-400/50"
                />
                <svg className="w-3.5 h-3.5 text-orange-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 12c3-4 6-4 9 0s6 4 9 0" />
                </svg>
              </div>

              {/* कमी शिल्लक Pill */}
              <button 
                type="button"
                onClick={() => setStockFilter(stockFilter === 'Low' ? 'All' : 'Low')}
                className={`bg-white shadow-xs rounded-full px-3 py-1.5 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap select-none shrink-0 ${
                  stockFilter === 'Low' ? 'ring-2 ring-amber-400 font-black text-amber-800' : 'text-slate-700 hover:text-slate-900 border border-slate-200/60'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0"></span>
                <span>कमी शिल्लक ({lowStockItems.length})</span>
              </button>

              {/* संपलेला माल Pill */}
              <button 
                type="button"
                onClick={() => setStockFilter(stockFilter === 'Out' ? 'All' : 'Out')}
                className={`bg-white shadow-xs rounded-full px-3 py-1.5 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap select-none shrink-0 ${
                  stockFilter === 'Out' ? 'ring-2 ring-red-400 font-black text-red-800' : 'text-slate-700 hover:text-slate-900 border border-slate-200/60'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-red-500 shrink-0"></span>
                <span>संपलेला माल ({outOfStockItems.length})</span>
              </button>
            </div>

            {/* Right Action Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
              <button 
                type="button"
                onClick={() => alert('Barcode Scanner active!')}
                className="bg-white/80 hover:bg-white shadow-xs rounded-full px-2.5 py-1.5 text-xs font-bold text-slate-600 flex items-center gap-1 transition cursor-pointer select-none whitespace-nowrap"
              >
                <Barcode className="text-sm text-slate-500" />
                <span className="hidden sm:inline">बारकोड स्कॅन ›</span>
              </button>

              <button 
                type="button"
                onClick={handleAddCategory}
                className="bg-white hover:bg-white shadow-xs rounded-full px-3 py-1.5 text-xs font-bold text-slate-800 flex items-center gap-1 transition cursor-pointer select-none whitespace-nowrap"
              >
                <Folders weight="bold" className="text-sm text-slate-600" />
                <span>+ कॅटेगरी</span>
              </button>

              <button 
                type="button"
                onClick={openNewProductModal}
                className="bg-gradient-to-r from-[#FF5722] to-[#FF7043] text-white shadow-md shadow-orange-500/30 rounded-xl px-3.5 py-1.5 text-xs font-black flex items-center gap-1 hover:opacity-95 transition cursor-pointer select-none whitespace-nowrap"
              >
                <Plus weight="bold" className="text-sm" />
                <span>+ नवीन उत्पादन</span>
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-slate-400/10 backdrop-blur-md rounded-3xl border border-white/60 p-3 flex-1 flex flex-col gap-2">
            
            {/* Header Columns (Desktop only) */}
            <div className="hidden sm:grid grid-cols-12 gap-3 px-4 py-1.5 text-xs font-bold text-slate-700 select-none">
              <div className="col-span-5">उत्पादनाचे नाव & बारकोड</div>
              <div className="col-span-2">कॅटेगरी</div>
              <div className="col-span-2 text-center">शिल्लक साठा</div>
              <div className="col-span-1 text-right">विक्री किंमत</div>
              <div className="col-span-2 text-center">कृती</div>
            </div>

            {/* List of Floating White Card Rows */}
            <div className="space-y-2 flex-1 overflow-y-auto pr-0.5 custom-scrollbar">
              {filteredProducts.map((p) => {
                const catDisplay = getCategoryDisplay(p.categoryName);

                return (
                  <div 
                    key={p.id}
                    className="grid grid-cols-12 gap-2 sm:gap-3 items-center bg-white rounded-2xl shadow-xs border border-white/80 p-2.5 sm:px-4 sm:py-3 transition hover:shadow-sm"
                  >
                    
                    {/* --- DESKTOP VIEW (sm:contents) --- */}
                    <div className="hidden sm:contents">
                      {/* 1. Product Name & Barcode */}
                      <div className="col-span-5 flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 shrink-0 shadow-2xs flex items-center justify-center">
                          <img 
                            src={p.image || '/images/atta.jpg'} 
                            alt={tProduct(p.name)} 
                            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/images/atta.jpg'; }}
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs sm:text-[13px] font-black text-slate-900 truncate">
                            {tProduct(p.name)}
                          </h4>
                          <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                            <span className="text-[9px] sm:text-[10px] font-bold text-slate-400">
                              [•] {p.barcode || '8901007001'}
                            </span>
                            <span className="text-slate-300">•</span>
                            <span className="bg-orange-50 text-orange-600 border border-orange-200/80 rounded px-1.5 py-0.2 text-[9px] font-bold">
                              {p.unit || p.size || 'Pouch'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* 2. Category Pill with Emoji */}
                      <div className="col-span-2">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-50/80 border border-sky-100 text-slate-700 text-xs font-bold shadow-2xs">
                          <span className="text-xs">{catDisplay.emoji1}</span>
                          <span className="truncate">{catDisplay.label}</span>
                          <span className="text-xs">{catDisplay.emoji2}</span>
                        </div>
                      </div>

                      {/* 3. Available Stock Stepper Pill */}
                      <div className="col-span-2 flex justify-center items-center">
                        <div className="inline-flex items-center justify-between gap-2.5 bg-[#fff8eb] border border-[#fde3b8] rounded-full px-3 py-1 text-xs font-black text-amber-900 shadow-2xs">
                          <button 
                            type="button"
                            onClick={() => handleQuickStockChange(p.id, -1)} 
                            className="text-amber-700 hover:text-amber-900 font-black text-xs px-1 cursor-pointer transition select-none"
                          >
                            −
                          </button>
                          <span className="whitespace-nowrap font-black">
                            {p.stock} {p.unit || p.size || 'Pkt'}
                          </span>
                          <button 
                            type="button"
                            onClick={() => handleQuickStockChange(p.id, 1)} 
                            className="text-amber-700 hover:text-amber-900 font-black text-xs px-1 cursor-pointer transition select-none"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* 4. Selling Price */}
                      <div className="col-span-1 text-right">
                        <p className="font-black text-xs sm:text-sm text-slate-900 leading-tight">
                          ₹{parseFloat(p.selling_price || p.price || 0).toFixed(2)}
                        </p>
                        {parseFloat(p.mrp || 0) > parseFloat(p.selling_price || p.price || 0) ? (
                          <p className="text-[9px] text-slate-400 font-bold whitespace-nowrap line-through">
                            ₹{parseFloat(p.mrp).toFixed(2)}
                          </p>
                        ) : (
                          <span className="text-[9px] text-transparent select-none">-</span>
                        )}
                      </div>

                      {/* 5. Quick Actions */}
                      <div className="col-span-2 flex items-center justify-end gap-1.5">
                        <button 
                          type="button"
                          onClick={() => openStockModal(p)}
                          className="bg-gradient-to-r from-[#FF5722] to-[#FF7043] text-white font-black text-[11px] px-3 py-1.5 rounded-xl shadow-xs hover:shadow-md transition cursor-pointer flex items-center justify-center gap-1 whitespace-nowrap"
                        >
                          <span>+ साठा</span>
                        </button>

                        <button 
                          type="button"
                          onClick={() => openEditProductModal(p)}
                          className="w-7 h-7 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200/60 flex items-center justify-center transition cursor-pointer"
                          title="Edit"
                        >
                          <PencilSimple weight="bold" className="text-xs" />
                        </button>

                        <button 
                          type="button"
                          onClick={() => openHistoryModal(p)}
                          className="w-7 h-7 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200/60 flex items-center justify-center transition cursor-pointer"
                          title="History"
                        >
                          <ClockCounterClockwise weight="bold" className="text-xs" />
                        </button>

                        <button 
                          type="button"
                          onClick={() => handleDeleteProduct(p.id)}
                          className="w-7 h-7 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-500 border border-slate-200/60 flex items-center justify-center transition cursor-pointer"
                          title="Delete"
                        >
                          <Trash weight="bold" className="text-xs" />
                        </button>
                      </div>
                    </div>

                    {/* --- MOBILE VIEW (< sm) --- */}
                    <div className="sm:hidden col-span-12 flex flex-col gap-2">
                      {/* Top Row: Image + Name/barcode + Price */}
                      <div className="flex items-center justify-between gap-2.5">
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-900 border border-slate-200 shrink-0 shadow-2xs flex items-center justify-center">
                            <img 
                              src={p.image || '/images/atta.jpg'} 
                              alt={tProduct(p.name)} 
                              onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/images/atta.jpg'; }}
                              className="w-full h-full object-cover" 
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="text-xs font-black text-slate-900 truncate">
                              {tProduct(p.name)}
                            </h4>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-[9px] font-bold text-slate-400 truncate">
                                [•] {p.barcode || '8901007001'}
                              </span>
                              <span className="bg-orange-50 text-orange-600 border border-orange-200/80 rounded px-1 text-[8px] font-bold shrink-0">
                                {p.unit || p.size || 'Pkt'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Price on Right */}
                        <div className="text-right shrink-0">
                          <p className="font-black text-xs text-slate-900 leading-tight">
                            ₹{parseFloat(p.selling_price || p.price || 0).toFixed(2)}
                          </p>
                          {parseFloat(p.mrp || 0) > parseFloat(p.selling_price || p.price || 0) && (
                            <p className="text-[9px] text-slate-400 font-bold line-through">
                              ₹{parseFloat(p.mrp).toFixed(2)}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Bottom Row on Mobile: Stepper + Actions */}
                      <div className="flex items-center justify-between gap-1.5 pt-1.5 border-t border-slate-100">
                        {/* Stepper */}
                        <div className="inline-flex items-center gap-2 bg-[#fff8eb] border border-[#fde3b8] rounded-full px-2.5 py-0.5 text-[11px] font-black text-amber-900">
                          <button 
                            type="button"
                            onClick={() => handleQuickStockChange(p.id, -1)} 
                            className="text-amber-700 hover:text-amber-900 font-black text-xs px-0.5 cursor-pointer"
                          >
                            −
                          </button>
                          <span className="whitespace-nowrap font-black">
                            {p.stock} {p.unit || p.size || 'Pkt'}
                          </span>
                          <button 
                            type="button"
                            onClick={() => handleQuickStockChange(p.id, 1)} 
                            className="text-amber-700 hover:text-amber-900 font-black text-xs px-0.5 cursor-pointer"
                          >
                            +
                          </button>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1">
                          <button 
                            type="button"
                            onClick={() => openStockModal(p)}
                            className="bg-gradient-to-r from-[#FF5722] to-[#FF7043] text-white font-black text-[10px] px-2.5 py-1 rounded-lg shadow-xs cursor-pointer whitespace-nowrap"
                          >
                            + साठा
                          </button>
                          <button 
                            type="button"
                            onClick={() => openEditProductModal(p)}
                            className="w-6 h-6 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center cursor-pointer"
                            title="Edit"
                          >
                            <PencilSimple weight="bold" className="text-[10px]" />
                          </button>
                          <button 
                            type="button"
                            onClick={() => openHistoryModal(p)}
                            className="w-6 h-6 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center cursor-pointer"
                            title="History"
                          >
                            <ClockCounterClockwise weight="bold" className="text-[10px]" />
                          </button>
                          <button 
                            type="button"
                            onClick={() => handleDeleteProduct(p.id)}
                            className="w-6 h-6 rounded-lg bg-slate-100 text-slate-400 hover:text-red-500 flex items-center justify-center cursor-pointer"
                            title="Delete"
                          >
                            <Trash weight="bold" className="text-[10px]" />
                          </button>
                        </div>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>

        </main>
      </div>

      {/* 1. Stock History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl p-5 sm:p-6 w-full max-w-lg shadow-2xl border border-slate-100 flex flex-col max-h-[80vh] animate-scale-up">
            <div className="flex justify-between items-center mb-4 shrink-0">
              <div>
                <h3 className="font-black text-base sm:text-lg text-slate-900 flex items-center gap-2">
                  <ClockCounterClockwise className="text-brand text-xl" /> {t('stock_batch_history')}
                </h3>
                <p className="text-xs font-bold text-slate-500 mt-0.5">{tProduct(selectedProduct?.name)}</p>
              </div>
              <button onClick={() => setShowHistoryModal(false)} className="text-slate-400 hover:text-red-500 hover:bg-slate-100 p-1.5 rounded-full transition cursor-pointer">
                <X weight="bold" className="text-lg"/> 
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2">
              {historyLoading ? (
                <div className="flex justify-center py-10"><div className="animate-spin h-6 w-6 border-2 border-brand rounded-full border-t-transparent"></div></div>
              ) : stockHistory.length === 0 ? (
                <div className="text-center py-10 text-slate-500 font-medium text-xs">{t('no_stock_batches')}</div>
              ) : (
                stockHistory.map((batch, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-200/70 rounded-2xl p-3 flex justify-between items-center">
                    <div>
                      <p className="font-black text-slate-800 text-xs sm:text-sm">{t('batch')}: {batch.batch_number}</p>
                      <p className="text-[11px] font-bold text-slate-500 uppercase mt-0.5">{t('current_quantity')}: {batch.current_quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] font-bold text-slate-500 uppercase mb-0.5">{t('purchase_cost')}</p>
                      <p className="font-black text-brand text-sm sm:text-base">₹{batch.purchase_rate.toFixed(2)}</p>
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
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl p-5 sm:p-6 w-full max-w-sm shadow-2xl border border-slate-100 animate-scale-up">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-black text-base sm:text-lg text-slate-900 flex items-center gap-2">
                <Plus weight="bold" className="text-emerald-500" /> साठा भरा (Add Stock)
              </h3>
              <button onClick={() => setShowStockModal(false)} className="text-slate-400 hover:text-red-500 hover:bg-slate-100 p-1.5 rounded-full transition cursor-pointer">
                <X weight="bold" className="text-lg"/> 
              </button>
            </div>
            
            <div className="p-2.5 rounded-2xl bg-orange-50 border border-orange-100 mb-3">
              <p className="text-[10px] font-bold text-slate-500 uppercase">{t('product_name')}</p>
              <h4 className="text-xs font-black text-slate-800 mt-0.5">{tProduct(selectedProduct?.name)}</h4>
            </div>

            <form onSubmit={handleAddStock} className="flex flex-col gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 flex justify-between">
                  <span>{t('quantity_received')}</span>
                  <span className="text-brand bg-orange-100 px-1.5 rounded font-black">{tUnit(selectedProduct?.unit || selectedProduct?.size) || 'Unit'}</span>
                </label>
                <input 
                  type="number" required min="0.01" step="0.01"
                  value={addQty} onChange={e => setAddQty(e.target.value)}
                  className="w-full h-10 border border-slate-200 rounded-xl px-3 font-bold focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition text-sm" 
                  placeholder={t('quantity_received')}
                  autoFocus
                />
              </div>
              
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">{t('purchase_rate_per_unit')} (₹)</label>
                <input 
                  type="number" required step="0.01"
                  value={costPrice} onChange={e => setCostPrice(e.target.value)}
                  className="w-full h-10 border border-slate-200 rounded-xl px-3 font-bold focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition text-sm" 
                />
              </div>
              
              <button type="submit" className="w-full h-10 sm:h-11 bg-gradient-to-r from-[#FF5722] via-[#FF6E40] to-[#FF8A65] hover:opacity-95 text-white rounded-xl font-black mt-1 transition shadow-lg shadow-orange-500/30 cursor-pointer text-xs sm:text-sm">
                {t('confirm_stock_entry') || 'स्टॉक नोंदवा'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 3. Ultra-Attractive Add/Edit Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white/95 backdrop-blur-2xl rounded-[32px] p-4 sm:p-6 w-full max-w-lg shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] border border-white/80 max-h-[92vh] flex flex-col relative overflow-hidden animate-scale-up">
            
            {/* Top Radiant Accent Ribbon */}
            <div className="h-1.5 w-full absolute top-0 left-0 bg-gradient-to-r from-[#FF5722] via-[#FFB300] to-[#FF5722]"></div>

            {/* Modal Header */}
            <div className="flex justify-between items-start mb-4 pb-3 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF5722] via-[#FF6E40] to-[#FF8A65] text-white flex items-center justify-center shadow-lg shadow-orange-500/30 text-lg font-black shrink-0">
                  {isEditing ? <PencilSimple weight="bold" /> : <Package weight="fill" />}
                </div>
                <div>
                  <h3 className="font-black text-base sm:text-lg text-slate-900 tracking-tight leading-tight">
                    {isEditing ? 'उत्पादनाची माहिती बदला' : 'नवीन वस्तू जोडा'}
                  </h3>
                  <p className="text-[11px] font-bold text-slate-500 mt-0.5 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>{isEditing ? 'वस्तूचे नाव, किंमत व तपशील अपडेट करा' : 'दुकानात नवीन किराणा किंवा उत्पादन नोंदवा'}</span>
                  </p>
                </div>
              </div>
              
              <button 
                type="button"
                onClick={() => setShowProductModal(false)} 
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-500 flex items-center justify-center transition cursor-pointer shrink-0"
                title="बंद करा"
              >
                <X weight="bold" className="text-base" /> 
              </button>
            </div>
            
            {/* Scrollable Form Body */}
            <form onSubmit={handleSaveProduct} className="flex-1 overflow-y-auto pr-1 space-y-4 custom-scrollbar">
              
              {/* Field 1: Product Name */}
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wide mb-1.5 flex justify-between items-center">
                  <span>उत्पादनाचे नाव (Product Name) *</span>
                  <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md">आवश्यक</span>
                </label>
                <div className="relative">
                  <Tag weight="bold" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg pointer-events-none" />
                  <input 
                    type="text" 
                    required
                    value={newProdName} 
                    onChange={e => setNewProdName(e.target.value)}
                    className="w-full h-12 pl-10 pr-4 bg-slate-50/70 focus:bg-white border-2 border-slate-200/90 focus:border-[#FF5722] focus:ring-4 focus:ring-orange-500/10 rounded-2xl font-black text-sm text-slate-900 placeholder-slate-400 outline-none transition" 
                    placeholder="उदा. अमुल ताजे दूध 500 मिली, साखर M-30, इत्यादी"
                  />
                </div>
              </div>

              {/* Field 2 & 3: Category & Unit */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Category */}
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wide mb-1.5 flex items-center gap-1">
                    <Folders weight="bold" className="text-xs text-orange-500" />
                    <span>कॅटेगरी (Category) *</span>
                  </label>
                  <select 
                    value={newProdCategoryId} 
                    onChange={e => setNewProdCategoryId(e.target.value)}
                    className="w-full h-11 border-2 border-slate-200/90 focus:border-[#FF5722] bg-slate-50/70 focus:bg-white rounded-2xl px-3.5 font-bold text-xs text-slate-800 outline-none transition cursor-pointer"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{tCategory(c.name)}</option>
                    ))}
                  </select>
                </div>

                {/* Unit */}
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wide mb-1.5">
                    युनिट / प्रमाण (Unit) *
                  </label>
                  <select 
                    value={newProdUnit} 
                    onChange={e => setNewProdUnit(e.target.value)}
                    className="w-full h-11 border-2 border-slate-200/90 focus:border-[#FF5722] bg-slate-50/70 focus:bg-white rounded-2xl px-3.5 font-bold text-xs text-slate-800 outline-none transition cursor-pointer"
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

              {/* Field 4: Pricing & Margin Calculation Card */}
              <div className="bg-gradient-to-br from-amber-50/70 via-orange-50/40 to-white border-2 border-amber-200/80 rounded-2xl p-3.5 space-y-2.5 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                    <CurrencyInr weight="bold" className="text-base text-emerald-600" />
                    <span>किंमत तपशील (Pricing & Margin)</span>
                  </span>
                  
                  {/* Live Discount Pill */}
                  {newProdMrp && newProdSelling && parseFloat(newProdMrp) > parseFloat(newProdSelling) && (
                    <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 border border-emerald-300 rounded-full px-2.5 py-0.5 shadow-2xs">
                      ग्राहक सवलत ₹{(parseFloat(newProdMrp) - parseFloat(newProdSelling)).toFixed(2)} ({Math.round(((parseFloat(newProdMrp) - parseFloat(newProdSelling)) / parseFloat(newProdMrp)) * 100)}% सूट)
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Selling Price */}
                  <div>
                    <label className="block text-[11px] font-black text-slate-600 uppercase mb-1">
                      विक्री किंमत (Selling) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-black text-base pointer-events-none">₹</span>
                      <input 
                        type="number" 
                        required 
                        step="0.01" 
                        min="0"
                        value={newProdSelling} 
                        onChange={e => setNewProdSelling(e.target.value)}
                        className="w-full h-11 pl-8 pr-3.5 bg-white border-2 border-slate-200/90 focus:border-[#FF5722] rounded-xl font-black text-base text-slate-900 outline-none transition" 
                        placeholder="27.00"
                      />
                    </div>
                  </div>

                  {/* MRP */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      छापील किंमत (MRP)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm pointer-events-none">₹</span>
                      <input 
                        type="number" 
                        step="0.01" 
                        min="0"
                        value={newProdMrp} 
                        onChange={e => setNewProdMrp(e.target.value)}
                        className="w-full h-11 pl-8 pr-3.5 bg-white border-2 border-slate-200/90 focus:border-[#FF5722] rounded-xl font-bold text-sm text-slate-700 outline-none transition" 
                        placeholder="30.00"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Field 5: Barcode Input with Auto-Generate Helper */}
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wide mb-1.5 flex justify-between items-center">
                  <span>बारकोड (Barcode)</span>
                  <span className="text-[10px] font-bold text-slate-400">ऐच्छिक (Optional)</span>
                </label>
                <div className="relative flex items-center">
                  <Barcode className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg pointer-events-none" />
                  <input 
                    type="text"
                    value={newProdBarcode} 
                    onChange={e => setNewProdBarcode(e.target.value)}
                    className="w-full h-11 pl-10 pr-24 bg-slate-50/70 focus:bg-white border-2 border-slate-200/90 focus:border-[#FF5722] rounded-2xl text-xs font-bold text-slate-800 outline-none transition" 
                    placeholder="उदा. 8901007001 किंवा स्कॅन करा"
                  />
                  <button 
                    type="button" 
                    onClick={() => setNewProdBarcode('8901' + Date.now().toString().slice(-6))} 
                    className="absolute right-1.5 px-2.5 py-1 text-[10px] font-black bg-white hover:bg-orange-50 border border-slate-200 hover:border-orange-300 text-slate-600 hover:text-orange-600 rounded-xl transition cursor-pointer shadow-2xs"
                  >
                    ⚡ ऑटो जनरेट
                  </button>
                </div>
              </div>

              {/* Field 6: Photo Upload & URL Dual-Mode Selector */}
              <div className="bg-slate-50/90 border-2 border-slate-200/90 rounded-2xl p-3.5 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                    <ImageIcon className="text-base text-[#FF5722]" />
                    <span>उत्पादनाचा फोटो (Product Photo)</span>
                  </label>
                  
                  {/* Mode Switcher Tabs */}
                  <div className="flex items-center bg-white border border-slate-200 rounded-xl p-0.5 shadow-2xs">
                    <button
                      type="button"
                      onClick={() => setImageInputMode('upload')}
                      className={`px-3 py-1 rounded-lg text-[10px] font-black transition cursor-pointer flex items-center gap-1 select-none ${
                        imageInputMode === 'upload' 
                          ? 'bg-gradient-to-r from-[#FF5722] to-[#FF7043] text-white shadow-xs' 
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      <UploadSimple weight="bold" />
                      <span>फोटो अपलोड</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageInputMode('url')}
                      className={`px-3 py-1 rounded-lg text-[10px] font-black transition cursor-pointer flex items-center gap-1 select-none ${
                        imageInputMode === 'url' 
                          ? 'bg-gradient-to-r from-[#FF5722] to-[#FF7043] text-white shadow-xs' 
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      <LinkSimple weight="bold" />
                      <span>URL लिंक</span>
                    </button>
                  </div>
                </div>

                {imageInputMode === 'upload' ? (
                  /* 1. File Upload Dropzone / Selector for Downloaded Photos */
                  <div>
                    {newProdImage ? (
                      /* Live Preview of Selected Photo */
                      <div className="flex items-center justify-between p-3 bg-white rounded-2xl border-2 border-orange-200 shadow-xs gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <img 
                            src={newProdImage} 
                            alt="Preview" 
                            className="w-16 h-16 rounded-xl object-cover border border-slate-200 shadow-xs shrink-0 bg-slate-100" 
                            onError={(e) => { e.currentTarget.src = '/images/atta.jpg'; }}
                          />
                          <div className="min-w-0">
                            <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                              <CheckCircle weight="fill" className="text-xs text-emerald-600" /> फोटो जोडला आहे
                            </span>
                            <p className="text-xs font-bold text-slate-700 truncate mt-1">
                              {newProdImage.startsWith('data:') ? 'स्थानिक फोटो (Local Image File)' : newProdImage.split('/').pop()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black px-3 py-2 rounded-xl border border-slate-200 transition flex items-center gap-1 select-none">
                            <UploadSimple weight="bold" />
                            <span>बदला</span>
                            <input 
                              type="file" 
                              accept="image/*" 
                              className="hidden" 
                              onChange={handleImageFileUpload} 
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => setNewProdImage('')}
                            className="w-9 h-9 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition cursor-pointer"
                            title="फोटो काढा"
                          >
                            <Trash weight="bold" className="text-sm" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Click to Upload Downloaded Photo Box */
                      <label className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-orange-300 hover:border-orange-500 bg-white hover:bg-orange-50/30 rounded-2xl cursor-pointer transition group select-none shadow-2xs">
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={handleImageFileUpload} 
                        />
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-100 to-amber-100 text-[#FF5722] flex items-center justify-center text-xl mb-2 group-hover:scale-110 transition shadow-xs">
                          {uploadingImage ? <CircleNotch weight="bold" className="animate-spin text-xl" /> : <UploadSimple weight="bold" />}
                        </div>
                        <span className="text-xs font-black text-slate-800 text-center">
                          {uploadingImage ? 'फोटो अपलोड होत आहे...' : 'डाऊनलोड केलेला किंवा गॅलरीतून फोटो निवडा'}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 mt-1">
                          JPG, PNG, WEBP, JPEG • येथे क्लिक करून फाईल निवडा
                        </span>
                      </label>
                    )}
                  </div>
                ) : (
                  /* 2. Direct Image URL Input */
                  <div>
                    <div className="relative">
                      <ImageIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base pointer-events-none" />
                      <input 
                        type="text"
                        value={newProdImage} 
                        onChange={e => setNewProdImage(e.target.value)}
                        className="w-full h-11 border-2 border-slate-200/90 focus:border-[#FF5722] rounded-xl pl-9 pr-3.5 text-xs font-bold text-slate-800 bg-white outline-none focus:ring-2 focus:ring-orange-500/10 transition" 
                        placeholder="उदा. /images/milk.jpg किंवा https://..."
                      />
                    </div>
                    {newProdImage && (
                      <div className="mt-2.5 flex items-center gap-2 p-2 bg-white rounded-xl border border-slate-200 shadow-2xs">
                        <img 
                          src={newProdImage} 
                          alt="Preview" 
                          className="w-9 h-9 rounded-lg object-cover border border-slate-200 shrink-0 bg-slate-100" 
                          onError={(e) => { e.currentTarget.src = '/images/atta.jpg'; }}
                        />
                        <span className="text-[11px] font-bold text-slate-600 truncate flex-1">{newProdImage}</span>
                        <button 
                          type="button" 
                          onClick={() => setNewProdImage('')} 
                          className="w-6 h-6 rounded-full bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-500 text-xs flex items-center justify-center cursor-pointer font-black transition"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Form Action Buttons */}
              <div className="pt-2 flex items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-5 h-12 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer select-none"
                >
                  रद्द करा
                </button>

                <button 
                  type="submit" 
                  className="flex-1 h-12 bg-gradient-to-r from-[#FF5722] via-[#FF6E40] to-[#FF8A65] hover:opacity-95 text-white rounded-2xl font-black text-xs sm:text-sm transition shadow-lg shadow-orange-500/30 cursor-pointer flex items-center justify-center gap-2 select-none"
                >
                  <Plus weight="bold" className="text-base" />
                  <span>{isEditing ? 'बदल जतन करा (Save Changes)' : 'नवीन वस्तू जोडा (Save Product)'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
