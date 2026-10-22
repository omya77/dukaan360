import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
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
  Image as ImageIcon 
} from '@phosphor-icons/react';
import { useLanguage } from '../contexts/LanguageContext';

const Inventory = () => {
  const { t, tProduct, tCategory, tUnit } = useLanguage();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [batches, setBatches] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
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
      const [catRes, prodRes, batchRes] = await Promise.all([
        axios.get('http://localhost:8000/categories/'),
        axios.get('http://localhost:8000/products/'),
        axios.get('http://localhost:8000/stock/batches/')
      ]);
      
      setCategories(catRes.data);
      setBatches(batchRes.data);
      
      const merged = prodRes.data.map(p => {
        const productBatches = batchRes.data.filter(b => b.product_id === p.id);
        const totalStock = productBatches.reduce((sum, b) => sum + (b.current_quantity || 0), 0);
        const categoryName = catRes.data.find(c => c.id === p.category_id)?.name || 'General';
        return { ...p, stock: totalStock, categoryName };
      });
      
      setProducts(merged);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  // Metrics calculation
  const totalStockValuation = batches.reduce((sum, b) => sum + ((b.current_quantity || 0) * (b.purchase_rate || 0)), 0);
  const lowStockItems = products.filter(p => p.stock > 0 && p.stock <= 10);
  const outOfStockItems = products.filter(p => p.stock === 0);

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
      
      await axios.post(`http://localhost:8000/stock/receive/?store_id=1&user_id=1`, payload);
      alert('Stock added successfully!');
      setShowStockModal(false);
      setAddQty('');
      setCostPrice('');
      fetchInventory();
    } catch (error) {
      console.error(error);
      alert('Failed to add stock');
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
    setNewProdName(product.name);
    setNewProdBarcode(product.barcode);
    setNewProdMrp(product.mrp);
    setNewProdSelling(product.selling_price);
    setNewProdUnit(product.unit);
    setNewProdCategoryId(product.category_id);
    setNewProdImage(product.image_url || '');
    setShowProductModal(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await axios.post('http://localhost:8000/upload/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setNewProdImage(res.data.image_url);
    } catch (err) {
      console.error(err);
      alert('Failed to upload image');
    }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!newProdName || !newProdCategoryId || !newProdSelling) {
      alert("Please fill all required fields!");
      return;
    }
    
    const payload = {
      category_id: parseInt(newProdCategoryId),
      name: newProdName,
      barcode: newProdBarcode || `BC-${Date.now().toString().slice(-6)}`,
      unit: newProdUnit,
      mrp: newProdMrp ? parseFloat(newProdMrp) : parseFloat(newProdSelling),
      selling_price: parseFloat(newProdSelling),
      image_url: newProdImage
    };

    try {
      if (isEditing && selectedProduct) {
        await axios.put(`http://localhost:8000/products/${selectedProduct.id}`, payload);
        alert(t('product_created_success'));
      } else {
        await axios.post('http://localhost:8000/products/', payload);
        alert(t('product_created_success'));
      }
      setShowProductModal(false);
      fetchInventory();
    } catch (error) {
      console.error(error);
      alert(t('product_save_failed'));
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm(t('delete_product_confirm'))) return;
    try {
      await axios.delete(`http://localhost:8000/products/${productId}`);
      alert(t('product_deleted_success'));
      fetchInventory();
    } catch (error) {
      console.error(error);
      alert(t('product_delete_failed'));
    }
  };

  const openStockModal = (product) => {
    setSelectedProduct(product);
    setCostPrice((product.selling_price * 0.8).toFixed(2));
    setShowStockModal(true);
  };

  const openHistoryModal = async (product) => {
    setSelectedProduct(product);
    setShowHistoryModal(true);
    setHistoryLoading(true);
    try {
      const res = await axios.get(`http://localhost:8000/stock/batches/?product_id=${product.id}`);
      setStockHistory(res.data);
    } catch (err) {
      console.error("Failed to load history", err);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleAddCategory = async () => {
    const newCat = window.prompt(t('enter_new_cat_prompt'));
    if (!newCat || newCat.trim() === '') return;
    try {
      const res = await axios.post('http://localhost:8000/categories/', { name: newCat.trim() });
      setCategories(prev => [...prev, res.data]);
      setNewProdCategoryId(res.data.id);
      alert(`'${res.data.name}' ` + t('cat_added_success'));
    } catch (error) {
      console.error(error);
      alert(t('cat_add_failed'));
    }
  };

  // Filter products
  const filteredProducts = products.filter(p => {
    const q = search.toLowerCase().trim();
    const matchesSearch = !q || 
      p.name.toLowerCase().includes(q) || 
      (tProduct(p.name) && tProduct(p.name).toLowerCase().includes(q)) || 
      (p.barcode && p.barcode.toLowerCase().includes(q)) || 
      (p.categoryName && p.categoryName.toLowerCase().includes(q)) || 
      (tCategory(p.categoryName) && tCategory(p.categoryName).toLowerCase().includes(q));
    
    if (!matchesSearch) return false;
    
    if (selectedCategoryFilter !== 'All' && String(p.category_id) !== String(selectedCategoryFilter)) {
      return false;
    }

    if (stockFilter === 'Low') return p.stock > 0 && p.stock <= 10;
    if (stockFilter === 'Out') return p.stock === 0;
    return true;
  }).reverse();

  return (
    <div className="h-screen flex flex-col bg-premium-app font-nunito overflow-hidden selection:bg-brand selection:text-white">
      <Header searchTerm={search} onSearch={setSearch} />

      <main className="flex-1 overflow-hidden p-3 lg:p-6 max-w-7xl mx-auto w-full flex flex-col gap-3 lg:gap-4">
        
        {/* Top Header & 4 Executive KPI Glass Summary Cards */}
        <div className="flex flex-col gap-3 shrink-0">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <h1 className="text-xl lg:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                <Package weight="fill" className="text-brand text-2xl lg:text-3xl" />
                <span>{t('inventory_title')}</span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-brand/10 text-brand border border-brand/20">
                  {products.length} {t('products')}
                </span>
              </h1>
              <p className="text-xs lg:text-[13px] font-bold text-slate-500 mt-0.5">
                {t('inventory_subtitle')}
              </p>
            </div>
          </div>

          {/* 4 Summary Glass Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 lg:gap-3">
            {/* 1. Total Catalog */}
            <div className="glass-panel p-3 lg:p-4 rounded-2xl flex items-center gap-3 border border-white/60 shadow-sm relative overflow-hidden group hover:shadow-md transition">
              <div className="w-10 h-10 lg:w-11 lg:h-11 rounded-xl bg-gradient-to-tr from-brand to-orange-400 flex items-center justify-center text-white shadow-md shadow-brand/20 shrink-0">
                <Package weight="bold" className="text-xl lg:text-2xl" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] lg:text-[11px] font-extrabold text-slate-500 uppercase tracking-wide truncate">{t('total_catalog')}</p>
                <h3 className="text-base lg:text-xl font-black text-slate-800 tracking-tight">
                  {products.length} {t('items')}
                </h3>
                <span className="text-[9px] font-bold text-slate-400">{categories.length} {t('all_categories')}</span>
              </div>
            </div>

            {/* 2. Stock Valuation */}
            <div className="glass-panel p-3 lg:p-4 rounded-2xl flex items-center gap-3 border border-emerald-100/60 shadow-sm relative overflow-hidden group hover:shadow-md transition">
              <div className="w-10 h-10 lg:w-11 lg:h-11 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 shrink-0">
                <CurrencyInr weight="bold" className="text-xl lg:text-2xl" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] lg:text-[11px] font-extrabold text-emerald-600 uppercase tracking-wide truncate">{t('stock_capital')}</p>
                <h3 className="text-base lg:text-xl font-black text-slate-800 tracking-tight">
                  ₹{totalStockValuation.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </h3>
                <span className="text-[9px] font-bold text-emerald-700/70">{t('inventory_valuation')}</span>
              </div>
            </div>

            {/* 3. Low Stock */}
            <div className="glass-panel p-3 lg:p-4 rounded-2xl flex items-center gap-3 border border-amber-100/60 shadow-sm relative overflow-hidden group hover:shadow-md transition">
              <div className="w-10 h-10 lg:w-11 lg:h-11 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-md shadow-amber-500/20 shrink-0">
                <WarningCircle weight="fill" className="text-xl lg:text-2xl" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] lg:text-[11px] font-extrabold text-amber-600 uppercase tracking-wide truncate">{t('low_stock')}</p>
                <h3 className="text-base lg:text-xl font-black text-amber-700 tracking-tight">
                  {lowStockItems.length} {t('items')}
                </h3>
                <span className="text-[9px] font-bold text-amber-700/70">{t('qty_less_than_10')}</span>
              </div>
            </div>

            {/* 4. Out of Stock */}
            <div className="glass-panel p-3 lg:p-4 rounded-2xl flex items-center gap-3 border border-red-100/60 shadow-sm relative overflow-hidden group hover:shadow-md transition">
              <div className="w-10 h-10 lg:w-11 lg:h-11 rounded-xl bg-gradient-to-tr from-red-500 to-rose-500 flex items-center justify-center text-white shadow-md shadow-red-500/20 shrink-0">
                <X weight="bold" className="text-xl lg:text-2xl" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] lg:text-[11px] font-extrabold text-red-600 uppercase tracking-wide truncate">{t('out_of_stock')}</p>
                <h3 className="text-base lg:text-xl font-black text-red-700 tracking-tight">
                  {outOfStockItems.length} {t('items')}
                </h3>
                <span className="text-[9px] font-bold text-red-700/70">0 {t('units_remaining')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search, Filter & Action Bar */}
        <div className="glass-panel p-2.5 lg:p-3 rounded-2xl border border-white/60 shadow-sm flex flex-col md:flex-row justify-between items-center gap-2.5 shrink-0">
          
          {/* Quick Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 hide-scroll">
            <button 
              onClick={() => setStockFilter('All')} 
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 whitespace-nowrap ${
                stockFilter === 'All' 
                  ? 'bg-slate-800 text-white shadow-sm' 
                  : 'bg-white/80 hover:bg-white text-slate-600 border border-slate-200/60'
              }`}
            >
              <span>{t('all')} ({products.length})</span>
            </button>

            <button 
              onClick={() => setStockFilter('Low')} 
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 whitespace-nowrap ${
                stockFilter === 'Low' 
                  ? 'bg-amber-600 text-white shadow-sm' 
                  : 'bg-white/80 hover:bg-white text-slate-600 border border-slate-200/60'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <span>{t('low_stock')} ({lowStockItems.length})</span>
            </button>

            <button 
              onClick={() => setStockFilter('Out')} 
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 whitespace-nowrap ${
                stockFilter === 'Out' 
                  ? 'bg-red-600 text-white shadow-sm' 
                  : 'bg-white/80 hover:bg-white text-slate-600 border border-slate-200/60'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              <span>{t('out_of_stock')} ({outOfStockItems.length})</span>
            </button>

            {/* Category Dropdown Filter */}
            <div className="relative">
              <select 
                value={selectedCategoryFilter}
                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                className="bg-white/80 hover:bg-white border border-slate-200/60 text-slate-700 text-xs font-bold rounded-xl px-2.5 py-1.5 outline-none cursor-pointer"
              >
                <option value="All">{t('all_categories')}</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{tCategory(c.name)}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Right Controls: Search & Add Buttons */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <div className="relative w-full md:w-56">
              <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
              <input 
                type="text" 
                placeholder={t('search_products')} 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="glass-input w-full h-9 rounded-xl text-xs font-bold pl-9 pr-7 outline-none"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <X weight="bold" className="text-xs" />
                </button>
              )}
            </div>

            <button 
              onClick={handleAddCategory}
              className="bg-white/90 hover:bg-white border border-slate-200/80 text-slate-700 px-3 py-2 rounded-xl text-xs font-bold shadow-sm transition whitespace-nowrap flex items-center gap-1 shrink-0"
              title="Add Category"
            >
              <Folders weight="bold" />
              <span className="hidden sm:inline">{t('add_category')}</span>
            </button>

            <button 
              onClick={openNewProductModal}
              className="bg-gradient-to-r from-brand to-orange-500 hover:from-brandHover hover:to-orange-600 text-white px-3.5 py-2 rounded-xl text-xs font-black shadow-md shadow-brand/20 transition whitespace-nowrap flex items-center gap-1.5 shrink-0"
            >
              <Plus weight="bold" className="text-sm" />
              <span>{t('new_product')}</span>
            </button>
          </div>
        </div>

        {/* Products Table / Cards Glass Container */}
        <div className="flex-1 glass-panel rounded-2xl shadow-sm border border-white/60 overflow-hidden flex flex-col">
          
          {/* Desktop Table Header */}
          <div className="hidden lg:grid grid-cols-12 gap-4 px-5 py-3 bg-slate-100/70 border-b border-slate-200/60 text-[11px] font-black text-slate-500 uppercase tracking-wider shrink-0">
            <div className="col-span-4">{t('product_name')} & {t('barcode')}</div>
            <div className="col-span-2">{t('category')}</div>
            <div className="col-span-2 text-center">{t('available_stock')}</div>
            <div className="col-span-2 text-right">{t('rate_mrp')}</div>
            <div className="col-span-2 text-center">{t('quick_actions')}</div>
          </div>

          {/* Scrollable Products List */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-2 lg:p-3 space-y-2">
            {loading ? (
              <div className="flex flex-col justify-center items-center h-48 gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand"></div>
                <p className="text-xs font-bold text-slate-400">Loading catalog...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-slate-400 py-10">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-300 mb-3">
                  <Package weight="fill" className="text-3xl" />
                </div>
                <h3 className="font-extrabold text-base text-slate-700">No Products Found</h3>
                <p className="text-xs font-medium text-slate-400 mt-1 max-w-xs text-center">
                  {search ? `No items match "${search}".` : 'Add your first product to start tracking inventory!'}
                </p>
                <button 
                  onClick={openNewProductModal}
                  className="mt-4 px-4 py-2 rounded-xl bg-brand text-white text-xs font-bold shadow-sm hover:bg-brandHover transition flex items-center gap-1.5"
                >
                  <Plus weight="bold" /> Add First Product
                </button>
              </div>
            ) : (
              filteredProducts.map(p => {
                const isOutOfStock = p.stock <= 0;
                const isLowStock = p.stock > 0 && p.stock <= 10;

                return (
                  <div 
                    key={p.id}
                    className="glass-card rounded-xl p-3 lg:px-4 lg:py-3 transition flex flex-col lg:grid lg:grid-cols-12 gap-2.5 lg:gap-4 items-start lg:items-center group border border-slate-200/60 hover:border-brand/40 hover:shadow-md"
                  >
                    {/* 1. Product Thumbnail & Name */}
                    <div className="lg:col-span-4 flex items-center gap-3 w-full lg:w-auto">
                      <div className="w-11 h-11 rounded-xl bg-slate-100 border border-slate-200/80 overflow-hidden flex items-center justify-center shrink-0 shadow-sm relative">
                        <img 
                          src={p.image_url || '/images/atta.jpg'} 
                          alt={p.name} 
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = '/images/atta.jpg';
                          }}
                          className="w-full h-full object-cover" 
                        />
                        {isOutOfStock && (
                          <div className="absolute inset-0 bg-red-600/60 flex items-center justify-center text-white text-[8px] font-black">
                            {t('out_of_stock_badge')}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-black text-[13px] text-slate-800 tracking-tight leading-snug group-hover:text-brand transition">
                          {tProduct(p.name)}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                            <Barcode weight="bold" className="text-slate-400" />
                            <span>{p.barcode || t('no_barcode')}</span>
                          </span>
                          <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                          <span className="text-[10px] font-extrabold text-brand bg-brandLight px-1.5 py-0.2 rounded">
                            {tUnit(p.unit)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 2. Category */}
                    <div className="lg:col-span-2">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-bold border border-slate-200/60">
                        <Tag weight="fill" className="text-slate-400 text-xs" />
                        <span>{tCategory(p.categoryName)}</span>
                      </span>
                    </div>

                    {/* 3. Available Stock */}
                    <div className="lg:col-span-2 w-full lg:w-auto flex justify-between lg:justify-center items-center">
                      <span className="lg:hidden text-xs font-bold text-slate-400">{t('available_stock')}:</span>
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black shadow-sm ${
                        isOutOfStock 
                          ? 'bg-red-50 text-red-600 border border-red-200' 
                          : isLowStock 
                          ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>
                        {isOutOfStock ? (
                          <X weight="bold" />
                        ) : isLowStock ? (
                          <WarningCircle weight="fill" className="text-amber-500" />
                        ) : (
                          <CheckCircle weight="fill" className="text-emerald-500" />
                        )}
                        <span>{p.stock} {tUnit(p.unit)}</span>
                      </div>
                    </div>

                    {/* 4. Price & MRP */}
                    <div className="lg:col-span-2 w-full lg:w-auto flex justify-between lg:justify-end items-center">
                      <span className="lg:hidden text-xs font-bold text-slate-400">{t('rate_mrp')}:</span>
                      <div className="text-right">
                        <p className="font-black text-sm lg:text-[15px] text-slate-900 leading-none">
                          ₹{p.selling_price.toFixed(2)}
                        </p>
                        {p.mrp && p.mrp > p.selling_price && (
                          <span className="text-[10px] font-bold text-slate-400 line-through">
                            ₹{p.mrp.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* 5. Quick Actions */}
                    <div className="lg:col-span-2 w-full lg:w-auto flex justify-end items-center gap-1.5 border-t lg:border-t-0 pt-2 lg:pt-0 border-slate-100">
                      {/* Receive Stock */}
                      <button 
                        onClick={() => openStockModal(p)}
                        className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-700 text-xs font-bold transition flex items-center gap-1 border border-emerald-200"
                        title={t('receive_stock')}
                      >
                        <Plus weight="bold" />
                        <span>{t('receive_stock_btn')}</span>
                      </button>

                      {/* Edit */}
                      <button 
                        onClick={() => openEditProductModal(p)}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold transition flex items-center gap-1"
                        title={t('edit')}
                      >
                        <PencilSimple weight="bold" />
                      </button>

                      {/* History */}
                      <button 
                        onClick={() => openHistoryModal(p)}
                        className="px-2 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold transition flex items-center"
                        title={t('history_action')}
                      >
                        <ClockCounterClockwise weight="bold" />
                      </button>

                      {/* Delete */}
                      <button 
                        onClick={() => handleDeleteProduct(p.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition"
                        title={t('delete')}
                      >
                        <Trash weight="bold" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>

      {/* 1. Stock History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl border border-slate-100 flex flex-col max-h-[80vh]">
            <div className="flex justify-between items-center mb-5 shrink-0">
              <div>
                <h3 className="font-black text-xl text-slate-800 flex items-center gap-2">
                  <ClockCounterClockwise className="text-brand text-2xl" /> {t('stock_batch_history')}
                </h3>
                <p className="text-sm font-bold text-slate-500 mt-1">{tProduct(selectedProduct?.name)}</p>
              </div>
              <button onClick={() => setShowHistoryModal(false)} className="text-slate-400 hover:text-red-500 hover:bg-slate-100 p-1.5 rounded-full transition">
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

      {/* 2. Add Stock (GRN) Modal */}
      {showStockModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-slate-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-black text-xl text-slate-800 flex items-center gap-2">
                <Plus weight="bold" className="text-emerald-500" /> {t('receive_stock')}
              </h3>
              <button onClick={() => setShowStockModal(false)} className="text-slate-400 hover:text-red-500 hover:bg-slate-100 p-1.5 rounded-full transition">
                <X weight="bold" className="text-xl"/> 
              </button>
            </div>
            
            <div className="p-3 rounded-xl bg-orange-50 border border-orange-100 mb-4">
              <p className="text-xs font-bold text-slate-500 uppercase">{t('product_name')}</p>
              <h4 className="text-sm font-black text-slate-800 mt-0.5">{tProduct(selectedProduct?.name)}</h4>
            </div>

            <form onSubmit={handleAddStock} className="flex flex-col gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1 flex justify-between">
                  <span>{t('quantity_received')}</span>
                  <span className="text-brand bg-orange-100 px-1.5 rounded font-black">{tUnit(selectedProduct?.unit) || 'Unit'}</span>
                </label>
                <input 
                  type="number" required min="0.01" step="0.01"
                  value={addQty} onChange={e => setAddQty(e.target.value)}
                  className="w-full h-11 border border-slate-200 rounded-xl px-4 font-bold focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition text-base" 
                  placeholder={t('quantity_received')}
                  autoFocus
                />
              </div>
              
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">{t('purchase_rate_per_unit')} (₹)</label>
                <input 
                  type="number" required step="0.01"
                  value={costPrice} onChange={e => setCostPrice(e.target.value)}
                  className="w-full h-11 border border-slate-200 rounded-xl px-4 font-bold focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition text-base" 
                />
              </div>
              
              <button type="submit" className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold mt-2 transition shadow-lg shadow-emerald-600/30">
                {t('confirm_stock_entry')}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 3. Add/Edit Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-black text-xl text-slate-800">
                {isEditing ? t('edit_item_details') : t('add_new_product_title')}
              </h3>
              <button onClick={() => setShowProductModal(false)} className="text-slate-400 hover:text-red-500 hover:bg-slate-100 p-1.5 rounded-full transition">
                <X weight="bold" className="text-xl"/> 
              </button>
            </div>
            
            <form onSubmit={handleSaveProduct} className="flex flex-col gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">{t('product_name')} *</label>
                <input 
                  type="text" required
                  value={newProdName} onChange={e => setNewProdName(e.target.value)}
                  className="w-full h-11 border border-slate-200 rounded-xl px-3.5 font-bold focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20" 
                  placeholder="e.g., Tata Salt, Aashirvaad Atta"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1 flex justify-between">
                    <span>{t('category')} *</span>
                    <span onClick={handleAddCategory} className="text-brand cursor-pointer hover:underline flex items-center gap-0.5"><Plus weight="bold"/> {t('add_category')}</span>
                  </label>
                  <select 
                    required
                    value={newProdCategoryId} onChange={e => setNewProdCategoryId(e.target.value)}
                    className="w-full h-11 border border-slate-200 rounded-xl px-3 font-bold focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 bg-white" 
                  >
                    {categories.map(c => <option key={c.id} value={c.id}>{t('cat_' + c.name.toLowerCase()) || c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">{t('unit_type')} *</label>
                  <select 
                    required
                    value={newProdUnit} onChange={e => setNewProdUnit(e.target.value)}
                    className="w-full h-11 border border-slate-200 rounded-xl px-3 font-bold focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 bg-white" 
                  >
                    <option value="kg">kg</option>
                    <option value="gm">gm</option>
                    <option value="litre">L</option>
                    <option value="ml">ml</option>
                    <option value="packet">pkt</option>
                    <option value="piece">pc</option>
                    <option value="box">box</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">{t('selling_price')} (₹) *</label>
                  <input 
                    type="number" required step="0.01" min="0"
                    value={newProdSelling} onChange={e => setNewProdSelling(e.target.value)}
                    className="w-full h-11 border border-slate-200 rounded-xl px-3.5 font-black text-emerald-600 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20" 
                    placeholder="e.g. 100"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">{t('mrp')} (₹)</label>
                  <input 
                    type="number" step="0.01" min="0"
                    value={newProdMrp} onChange={e => setNewProdMrp(e.target.value)}
                    className="w-full h-11 border border-slate-200 rounded-xl px-3.5 font-bold focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20" 
                    placeholder="Same as Selling"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1 flex justify-between">
                  <span>{t('product_image')}</span>
                  {newProdImage && <span className="text-emerald-600 font-bold">{t('uploaded')}</span>}
                </label>
                <div className="flex gap-3 items-center">
                  {newProdImage && <img src={newProdImage} alt="preview" className="w-11 h-11 rounded-xl object-cover border border-slate-200" />}
                  <input 
                    type="file" accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full h-11 border border-slate-200 rounded-xl px-3 font-bold focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-brandLight file:text-brand hover:file:bg-brand hover:file:text-white transition" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">{t('barcode_optional')}</label>
                <input 
                  type="text" 
                  value={newProdBarcode} onChange={e => setNewProdBarcode(e.target.value)}
                  className="w-full h-11 border border-slate-200 rounded-xl px-3.5 font-bold focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20" 
                  placeholder={t('barcode_hint')}
                />
              </div>

              <button type="submit" className="w-full h-11 bg-gradient-to-r from-brand to-orange-500 hover:from-brandHover hover:to-orange-600 text-white rounded-xl font-bold mt-2 transition shadow-lg shadow-brand/30">
                {isEditing ? t('save_changes') : t('create_product')}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Inventory;
