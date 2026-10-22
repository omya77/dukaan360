import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import ProductCard from '../components/ProductCard';
import Cart from '../components/Cart';
import ReceiptModal from '../components/ReceiptModal';
import { Faders, MagnifyingGlass, X } from '@phosphor-icons/react';
import { useLanguage } from '../contexts/LanguageContext';
import { getAuthHeaders } from '../services/api';

// Fallback images matching category logic
const fallbackImages = {
  "Grocery": "/images/atta.jpg",
  "Dairy": "/images/milk.jpg",
  "Snacks": "/images/biscuit.jpg",
  "Cleaning": "/images/soap.jpg",
  "किराणा व धान्य": "/images/atta.jpg",
  "तेल व तूप": "/images/oil.jpg",
  "मसाले व मीठ": "/images/haldi.jpg",
  "चहा, साखर व पेये": "/images/tea.jpg",
  "नाश्ता व बिस्कीट": "/images/biscuit.jpg",
  "साबण व स्वच्छता": "/images/soap.jpg",
  "दुग्धजन्य पदार्थ": "/images/milk.jpg"
};

// Default high-fidelity store products matching reference POS screenshot exactly
const DEFAULT_PRODUCTS = [
  { id: 1, name: "साखर (Sugar M-30)", category_id: 1, mrp: 46, price: 44, size: "KG", stock: 50, image: "/images/sugar.jpg", batch_id: 1 },
  { id: 2, name: "भाग्यलक्ष्मी तूर डाल (Toor Dal 1 किलो)", category_id: 1, mrp: 175, price: 165, size: "KG", stock: 40, image: "/images/dal.jpg", batch_id: 2 },
  { id: 3, name: "फॉर्च्यून शेंगदाणा तेल (Fortune Groundnut Oil 1 लि)", category_id: 2, mrp: 185, price: 175, size: "Ltr", stock: 35, image: "/images/oil.jpg", batch_id: 3 },
  { id: 4, name: "गोदरेज वनस्पती तूप (Vanaspati Ghee 500 ग्रॅ)", category_id: 2, mrp: 95, price: 88, size: "Pouch", stock: 30, image: "/images/ghee.jpg", batch_id: 4 },
  { id: 5, name: "एव्हरेस्ट हळद पावडर (Everest Turmeric 100 ग्रॅ)", category_id: 3, mrp: 38, price: 35, size: "Pkt", stock: 60, image: "/images/haldi.jpg", batch_id: 5 },
  { id: 6, name: "टाटा मीठ (Tata Salt 1 किलो)", category_id: 3, mrp: 28, price: 27, size: "KG", stock: 80, image: "/images/salt.jpg", batch_id: 6 },
  { id: 7, name: "वाघ बकरी चहा (Wagh Bakri Tea 250 ग्रॅ)", category_id: 4, mrp: 140, price: 130, size: "Pkt", stock: 45, image: "/images/tea.jpg", batch_id: 7 },
  { id: 8, name: "पार्ले-जी बिस्कीट (Parle-G 100 ग्रॅ)", category_id: 5, mrp: 10, price: 10, size: "Pkt", stock: 120, image: "/images/biscuit.jpg", batch_id: 8 },
  { id: 9, name: "ब्रिटानिया गुड डे बटर (Good Day Butter 100 ग्रॅ)", category_id: 5, mrp: 95, price: 88, size: "Pkt", stock: 50, image: "/images/goodday.jpg", batch_id: 9 },
  { id: 10, name: "मॅगी 2-मिनिट नूडल्स (Maggi Noodles 70 ग्रॅ)", category_id: 5, mrp: 15, price: 14, size: "Pkt", stock: 75, image: "/images/maggi.jpg", batch_id: 10 },
  { id: 11, name: "सर्फ एक्सेल डिटर्जंट पावडर (Surf Excel 1 किलो)", category_id: 6, mrp: 155, price: 145, size: "Pkt", stock: 30, image: "/images/surfexcel.jpg", batch_id: 11 },
  { id: 12, name: "लाईफबॉय साबण (Lifebuoy Soap 125 ग्रॅ)", category_id: 6, mrp: 40, price: 36, size: "Piece", stock: 60, image: "/images/soap.jpg", batch_id: 12 },
  { id: 13, name: "अमुल ताजा दूध (Amul Taaza Milk 500 मिली)", category_id: 7, mrp: 28, price: 28, size: "Pouch", stock: 25, image: "/images/milk.jpg", batch_id: 13 },
  { id: 14, name: "अमुल बटर (Amul Butter 100 ग्रॅ)", category_id: 7, mrp: 58, price: 56, size: "Piece", stock: 30, image: "/images/butter.jpg", batch_id: 14 }
];

const DEFAULT_CATEGORIES = [
  { id: 1, name: "किराणा व धान्य" },
  { id: 2, name: "तेल व तूप" },
  { id: 3, name: "मसाले व मीठ" },
  { id: 4, name: "चहा, साखर व पेये" },
  { id: 5, name: "नाश्ता व बिस्कीट" },
  { id: 6, name: "साबण व स्वच्छता" },
  { id: 7, name: "दुग्धजन्य पदार्थ" }
];

function POS() {
  const { t, tProduct, tCategory, tUnit } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [cartItems, setCartItems] = useState([
    {
      id: 4,
      name: "गोदरेज वनस्पती तूप (Vanaspati Ghee 500 ग्रॅ)",
      price: 88,
      mrp: 95,
      size: "Pouch",
      stock: 30,
      batch_id: 4,
      image: "/images/ghee.jpg",
      category_id: 2,
      quantity: 1
    }
  ]);
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);
  
  const [products, setProducts] = useState(DEFAULT_PRODUCTS);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [loading, setLoading] = useState(false);
  
  const [completedInvoice, setCompletedInvoice] = useState(null);
  const [customers, setCustomers] = useState([
    { id: 1, name: "रमेश पाटील", mobile: "9822011223", current_due: 450.0 },
    { id: 2, name: "सचिन देशमुख", mobile: "9890123456", current_due: 1200.0 },
    { id: 3, name: "अनिता शिंदे", mobile: "9765432109", current_due: 0.0 }
  ]);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [pendingCheckoutMethod, setPendingCheckoutMethod] = useState(null);
  const [showAddNewCustomer, setShowAddNewCustomer] = useState(false);
  const [newCustName, setNewCustName] = useState('');
  const [newCustMobile, setNewCustMobile] = useState('');
  const [isUpiModalOpen, setIsUpiModalOpen] = useState(false);

  // Fetch from Backend API
  const fetchData = async () => {
    try {
      const authHeaders = getAuthHeaders();
      const [catRes, prodRes, batchRes, custRes] = await Promise.all([
        axios.get('http://localhost:8000/categories/', { headers: authHeaders }).catch(() => null),
        axios.get('http://localhost:8000/products/', { headers: authHeaders }).catch(() => null),
        axios.get('http://localhost:8000/stock/batches/', { headers: authHeaders }).catch(() => null),
        axios.get('http://localhost:8000/customers/', { headers: authHeaders }).catch(() => null)
      ]);

      if (catRes && Array.isArray(catRes.data) && catRes.data.length > 0) {
        setCategories(catRes.data);
      }
      if (custRes && Array.isArray(custRes.data) && custRes.data.length > 0) {
        setCustomers(custRes.data);
      }

      if (prodRes && Array.isArray(prodRes.data) && prodRes.data.length > 0) {
        const batches = (batchRes && Array.isArray(batchRes.data)) ? batchRes.data : [];
        const formattedProducts = prodRes.data.map(p => {
          const productBatches = batches.filter(b => b.product_id === p.id);
          const totalStock = productBatches.reduce((sum, b) => sum + b.current_quantity, 0);
          const availableBatch = productBatches.find(b => b.current_quantity > 0);
          
          return {
            id: p.id,
            name: p.name,
            price: p.selling_price,
            mrp: p.mrp || (p.selling_price + 5),
            size: p.unit || 'Piece',
            stock: totalStock > 0 ? totalStock : 50,
            batch_id: availableBatch ? availableBatch.id : p.id,
            image: p.image_url ? p.image_url : (fallbackImages[p.category?.name] || "/images/atta.jpg"),
            category_id: p.category_id,
            barcode: p.barcode
          };
        });
        setProducts(formattedProducts);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- BARCODE SCANNER INTEGRATION ---
  useEffect(() => {
    let barcodeBuffer = '';
    let lastKeyTime = Date.now();

    const handleKeyDown = (e) => {
      // Ignore if user is typing in a search box or input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      const currentTime = Date.now();
      
      // Barcode scanners type very fast (usually < 30ms per char). Reset if slow.
      if (currentTime - lastKeyTime > 50) {
        barcodeBuffer = '';
      }
      
      lastKeyTime = currentTime;

      if (e.key === 'Enter') {
        if (barcodeBuffer.length > 2) {
          // Find product by barcode
          const product = products.find(p => p.barcode === barcodeBuffer);
          if (product) {
            handleAddToCart(product);
            // We could add a beep sound here if we wanted!
          } else {
            console.log("Barcode not found:", barcodeBuffer);
          }
          barcodeBuffer = '';
        }
      } else if (e.key.length === 1) {
        barcodeBuffer += e.key;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [products]); // Re-bind when products update


  // Filter products by category and search term (checks both original and translated name, plus barcode)
  const filteredProducts = products.filter(p => {
    const matchCat = activeCategory === 'all' ? true : p.category_id === activeCategory;
    const term = searchTerm.toLowerCase().trim();
    if (!term) return matchCat;

    const origName = (p.name || '').toLowerCase();
    const transName = (tProduct(p.name) || '').toLowerCase();
    const barcode = (p.barcode || '').toLowerCase();

    const matchSearch = origName.includes(term) || transName.includes(term) || barcode.includes(term);
    return matchCat && matchSearch;
  });

  const handleAddToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        const currentQ = parseFloat(existing.quantity) || 0;
        const step = (currentQ < 1 && (String(existing.size || '').toLowerCase().includes('kg') || String(existing.size || '').toLowerCase().includes('किलो') || String(existing.name || '').includes('साखर') || String(existing.name || '').includes('डाळ'))) ? 0.25 : 1;
        const newQ = Math.round((currentQ + step) * 1000) / 1000;
        return prev.map(item => item.id === product.id ? { ...item, quantity: newQ } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id, delta) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        if (delta === 'remove') return null;
        const currentQ = parseFloat(item.quantity) || 0;
        const newQ = Math.round((currentQ + delta) * 1000) / 1000;
        if (newQ <= 0) return null;
        return { ...item, quantity: newQ };
      }
      return item;
    }).filter(Boolean));
  };

  const setExactQuantity = (id, value) => {
    if (value === "") {
      setCartItems(prev => prev.map(item => item.id === id ? { ...item, quantity: "" } : item));
      return;
    }
    
    // Allow ending with a dot (e.g. "0.", "-0.")
    if (String(value).endsWith('.') || value === "-") {
      setCartItems(prev => prev.map(item => item.id === id ? { ...item, quantity: value } : item));
      return;
    }

    const val = parseFloat(value);
    if (isNaN(val)) return;
    if (val <= 0) {
      setCartItems(prev => prev.filter(item => item.id !== id));
      return;
    }
    setCartItems(prev => prev.map(item => item.id === id ? { ...item, quantity: val } : item));
  };

  const handleCheckoutInitiate = (paymentMethod) => {
    if (cartItems.length === 0) {
      alert(t('cart_empty'));
      return;
    }

    if (paymentMethod === 'Credit') {
      if (selectedCustomerId) {
        processCheckout('Credit', selectedCustomerId);
      } else {
        setPendingCheckoutMethod('Credit');
        setIsCustomerModalOpen(true);
      }
    } else if (paymentMethod === 'UPI') {
      setIsUpiModalOpen(true);
    } else {
      processCheckout(paymentMethod, selectedCustomerId);
    }
  };

  const handleCreateCustomer = async (e) => {
    e.preventDefault();
    if (!newCustName || !newCustMobile) return;
    try {
      const res = await axios.post('http://localhost:8000/customers/', {
        name: newCustName,
        mobile: newCustMobile,
        opening_balance: 0
      }, { headers: getAuthHeaders() });
      setCustomers(prev => [...prev, res.data]);
      if (pendingCheckoutMethod) {
        processCheckout(pendingCheckoutMethod, res.data.id);
      } else {
        setSelectedCustomerId(res.data.id);
        setIsCustomerModalOpen(false);
      }
      setShowAddNewCustomer(false);
      setNewCustName('');
      setNewCustMobile('');
    } catch (err) {
      alert("Failed to add customer");
      console.error(err);
    }
  };

  const processCheckout = async (paymentMethod, customerId) => {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = 0; // 0% tax for now
    const grand_total = subtotal + tax;

    const payload = {
      store_id: 1,
      cashier_id: 1,
      customer_id: customerId, 
      discount: 0,
      tax: tax,
      items: cartItems.map(item => ({
        product_id: item.id,
        batch_id: item.batch_id || item.id, 
        quantity: item.quantity,
        rate: item.price
      })),
      payments: [
        {
          method: paymentMethod,
          amount: grand_total
        }
      ]
    };

    try {
      const response = await axios.post('http://localhost:8000/pos/bill/', payload, { headers: getAuthHeaders() });
      
      const cust = selectedCustomerId ? customers.find(c => c.id === selectedCustomerId) : null;
      setCompletedInvoice({
        invoice_number: response.data.invoice_number,
        subtotal: subtotal,
        tax: tax,
        grand_total: grand_total,
        payment_method: paymentMethod,
        items: [...cartItems],
        customer_name: cust ? cust.name : null,
        customer_mobile: cust ? cust.mobile : null
      });
      
      setCartItems([]);
      setIsMobileCartOpen(false);
      setIsCustomerModalOpen(false);
      fetchData();
    } catch (error) {
      console.error("Checkout Failed:", error);
      const detail = error.response?.data?.detail;
      const errorMsg = typeof detail === 'object' ? JSON.stringify(detail) : (detail || error.message);
      alert("Checkout failed: " + errorMsg);
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden selection:bg-brand selection:text-white bg-[#FDFBF7] relative">
      {/* Ambient Mesh Glow Blobs matching screenshot */}
      <div className="absolute -top-24 -left-20 w-96 h-96 bg-gradient-to-tr from-amber-200/50 via-orange-200/40 to-transparent rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-20 right-0 w-[450px] h-[450px] bg-gradient-to-bl from-teal-200/40 via-cyan-100/30 to-transparent rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 left-1/3 w-[500px] h-[500px] bg-gradient-to-tr from-orange-100/40 via-amber-100/30 to-transparent rounded-full blur-3xl pointer-events-none"></div>

      <Header onMenuClick={() => alert('Mobile menu clicked')} />

      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative z-10">
        <Sidebar activeCategory={activeCategory} setActiveCategory={setActiveCategory} dynamicCategories={categories} />

        <section className="flex-1 p-3 lg:p-4 overflow-y-auto pb-20 lg:pb-4 relative">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black text-slate-800 tracking-tight">
                {t('products') || 'दुकानातील वस्तू'}
              </h2>
              <span className="text-xs font-bold text-slate-600 bg-slate-200/70 px-2.5 py-0.5 rounded-full select-none">
                {filteredProducts.length}
              </span>
            </div>

            {/* Dedicated In-Page Search Bar with Scanner Wave */}
            <div className="relative w-full sm:w-80 lg:w-96">
              <MagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t('search_products') || "वस्तू शोधा किंवा बारकोड स्कॅन करा..."} 
                className="w-full h-9 rounded-2xl text-xs font-bold pl-10 pr-10 outline-none bg-white/80 backdrop-blur-sm border border-slate-200/80 shadow-xs focus:border-brand focus:bg-white transition text-slate-800"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none">
                <svg className="w-5 h-5 text-orange-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 7V5a2 2 0 012-2h2M17 3h2a2 2 0 012 2v2M21 17v2a2 2 0 01-2 2h-2M7 21H5a2 2 0 01-2-2v-2" />
                  <line x1="7" y1="8" x2="7" y2="16" />
                  <line x1="10" y1="8" x2="10" y2="16" />
                  <line x1="14" y1="8" x2="14" y2="16" />
                  <line x1="17" y1="8" x2="17" y2="16" />
                </svg>
              </div>
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')} 
                  className="absolute right-9 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                >
                  <X weight="bold" className="text-xs" />
                </button>
              )}
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {filteredProducts.map(product => {
                const cartItem = cartItems.find(i => i.id === product.id);
                return (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onAddToCart={handleAddToCart}
                    cartQuantity={cartItem ? cartItem.quantity : 0}
                  />
                );
              })}
            </div>
          )}
        </section>

        <Cart 
          cartItems={cartItems} 
          isMobileOpen={isMobileCartOpen} 
          toggleMobileCart={() => setIsMobileCartOpen(!isMobileCartOpen)}
          updateQuantity={updateQuantity}
          setExactQuantity={setExactQuantity}
          onCheckout={handleCheckoutInitiate}
          customers={customers}
          selectedCustomerId={selectedCustomerId}
          setSelectedCustomerId={setSelectedCustomerId}
          openCustomerModal={() => { setPendingCheckoutMethod(null); setIsCustomerModalOpen(true); }}
        />
      </main>

      {/* Customer Selection Modal for Khata */}
      {isCustomerModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-4 flex flex-col max-h-[90vh]">
            <h3 className="font-bold text-lg text-slate-800 mb-4">{t('select_add_customer')}</h3>
            
            {!showAddNewCustomer ? (
              <>
                <div className="flex-1 overflow-y-auto cart-scroll pr-2 mb-4 space-y-2">
                  {customers.length === 0 ? (
                    <p className="text-slate-500 text-center text-sm mt-4">{t('no_customers_found')}</p>
                  ) : (
                    customers.map(cust => (
                      <button
                        key={cust.id}
                        onClick={() => {
                          if (pendingCheckoutMethod) {
                            processCheckout(pendingCheckoutMethod, cust.id);
                          } else {
                            setSelectedCustomerId(cust.id);
                            setIsCustomerModalOpen(false);
                          }
                        }}
                        className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-brand hover:bg-brandLight transition flex justify-between items-center bg-slate-50"
                      >
                        <div>
                          <p className="font-bold text-slate-800 text-sm">{cust.name}</p>
                          <p className="text-[10px] text-slate-500">{cust.mobile}</p>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold text-xs ${cust.current_due > 0 ? 'text-red-500' : 'text-green-600'}`}>
                            {t('due')}: {"\u20B9"}{cust.current_due.toFixed(2)}
                          </p>
                        </div>
                      </button>
                    ))
                  )}
                </div>
                
                <div className="flex gap-2">
                  <button 
                    onClick={() => setShowAddNewCustomer(true)}
                    className="flex-[2] py-2 bg-brand/10 hover:bg-brand/20 text-brand rounded-xl font-bold transition text-sm"
                  >
                    {t('add_new_customer')}
                  </button>
                  <button 
                    onClick={() => { setIsCustomerModalOpen(false); setPendingCheckoutMethod(null); }}
                    className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold transition text-sm"
                  >
                    {t('cancel')}
                  </button>
                </div>
              </>
            ) : (
              <form onSubmit={handleCreateCustomer} className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('customer_name')}</label>
                  <input 
                    type="text" required autoFocus
                    value={newCustName} onChange={e => setNewCustName(e.target.value)}
                    placeholder="ग्राहकाचे पूर्ण नाव"
                    className="w-full h-11 border border-slate-200 rounded-lg px-3 focus:border-brand outline-none text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('mobile_number')}</label>
                  <input 
                    type="tel" required
                    value={newCustMobile} onChange={e => setNewCustMobile(e.target.value)}
                    placeholder="१०-अंकी मोबाईल नंबर"
                    className="w-full h-11 border border-slate-200 rounded-lg px-3 focus:border-brand outline-none text-slate-800"
                  />
                </div>
                <div className="flex gap-2 mt-2">
                  <button type="button" onClick={() => setShowAddNewCustomer(false)} className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold transition">{t('back')}</button>
                  <button type="submit" className="flex-[2] py-2 px-6 bg-brand hover:bg-brandHover text-white rounded-xl font-bold shadow-lg shadow-brand/30 transition">{t('save_and_link')}</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* UPI QR Scanner Modal */}
      {isUpiModalOpen && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl p-4 text-center animate-fade-in relative overflow-hidden">
            {/* Fancy gradient background at top */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-blue-500 to-indigo-600 z-0 rounded-t-3xl"></div>
            
            <div className="relative z-10 mt-6">
              <h3 className="font-black text-lg text-white mb-1">{t('scan_and_pay')}</h3>
              <p className="text-blue-100 mb-6 text-xs font-medium">{t('upi_apps_hint')}</p>
              
              <div className="bg-white p-4 rounded-2xl shadow-xl flex justify-center mb-6 mx-auto w-56 h-56 border-4 border-slate-50">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`upi://pay?pa=9876543210@upi&pn=Dukaan360%20Retail&am=${cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}&cu=INR`)}`} 
                  alt="UPI QR Code" 
                  className="w-full h-full object-contain"
                />
              </div>
              
              <h2 className="text-4xl font-black text-slate-800 mb-2">
                ₹{cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
              </h2>
              <p className="text-xs text-slate-500 font-bold mb-8 flex items-center justify-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> {t('waiting_for_payment')}
              </p>

              <div className="flex gap-3">
                <button 
                  onClick={() => setIsUpiModalOpen(false)}
                  className="flex-1 py-2 bg-slate-100 text-slate-500 rounded-xl font-bold hover:bg-slate-200 transition text-sm"
                >
                  {t('cancel')}
                </button>
                <button 
                  onClick={() => {
                    setIsUpiModalOpen(false);
                    processCheckout('UPI', selectedCustomerId);
                  }}
                  className="flex-[2] py-2 bg-green-500 text-white rounded-xl font-black hover:bg-green-600 transition shadow-[0_4px_15px_rgba(34,197,94,0.3)] text-sm flex items-center justify-center gap-2"
                >
                  {t('confirm_payment')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {completedInvoice && (
        <ReceiptModal 
          invoice={completedInvoice} 
          onClose={() => setCompletedInvoice(null)} 
        />
      )}
    </div>
  );
}

export default POS;
