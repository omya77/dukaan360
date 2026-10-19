import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import ProductCard from '../components/ProductCard';
import Cart from '../components/Cart';
import ReceiptModal from '../components/ReceiptModal';
import { Faders, MagnifyingGlass, X } from '@phosphor-icons/react';
import { useLanguage } from '../contexts/LanguageContext';

// Fallback images matching category logic
const fallbackImages = {
  "Grocery": "/images/atta.jpg",
  "Dairy": "/images/milk.jpg",
  "Snacks": "/images/sugar.jpg",
  "Cleaning": "/images/tea.jpg"
};

function POS() {
  const { t, tProduct, tCategory, tUnit } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);
  
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [completedInvoice, setCompletedInvoice] = useState(null);
  const [customers, setCustomers] = useState([]);
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
      const catRes = await axios.get('http://localhost:8000/categories/');
      setCategories(catRes.data);

      const prodRes = await axios.get('http://localhost:8000/products/');
      const batchRes = await axios.get('http://localhost:8000/stock/batches/');
      const custRes = await axios.get('http://localhost:8000/customers/');
      
      setCustomers(custRes.data);
      const batches = batchRes.data;

      // Transform backend fields to match UI expectations, calculating real stock
      const formattedProducts = prodRes.data.map(p => {
        const productBatches = batches.filter(b => b.product_id === p.id);
        const totalStock = productBatches.reduce((sum, b) => sum + b.current_quantity, 0);
        
        // Find first available batch for billing
        const availableBatch = productBatches.find(b => b.current_quantity > 0);
        
        return {
          id: p.id,
          name: p.name,
          price: p.selling_price,
          mrp: p.mrp,
          size: p.unit,
          stock: totalStock,
          batch_id: availableBatch ? availableBatch.id : p.id, // Better batch resolution
          image: p.image_url ? p.image_url : (fallbackImages[p.category?.name] || "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Wheat_flour.jpg/320px-Wheat_flour.jpg"),
          category_id: p.category_id
        };
      });
      setProducts(formattedProducts);
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
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id, delta) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        if (delta === 'remove') return null;
        const newQ = (parseFloat(item.quantity) || 0) + delta;
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
    if (value.endsWith('.') || value === "-") {
      setCartItems(prev => prev.map(item => item.id === id ? { ...item, quantity: value } : item));
      return;
    }

    const val = parseFloat(value);
    if (isNaN(val)) return;
    setCartItems(prev => prev.map(item => item.id === id ? { ...item, quantity: val } : item));
  };

  const [pendingLoyaltyInfo, setPendingLoyaltyInfo] = useState({ loyaltyPointsRedeemed: 0, loyaltyDiscount: 0 });

  const handleCheckoutInitiate = (paymentMethod, loyaltyInfo = {}) => {
    if (cartItems.length === 0) {
      alert(t('cart_empty'));
      return;
    }
    setPendingLoyaltyInfo(loyaltyInfo);

    if (paymentMethod === 'Credit') {
      if (selectedCustomerId) {
        processCheckout('Credit', selectedCustomerId, loyaltyInfo);
      } else {
        setPendingCheckoutMethod('Credit');
        setIsCustomerModalOpen(true);
      }
    } else if (paymentMethod === 'UPI') {
      setIsUpiModalOpen(true);
    } else {
      processCheckout(paymentMethod, selectedCustomerId, loyaltyInfo);
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
      });
      setCustomers(prev => [...prev, res.data]);
      if (pendingCheckoutMethod) {
        processCheckout(pendingCheckoutMethod, res.data.id, pendingLoyaltyInfo);
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

  const processCheckout = async (paymentMethod, customerId, loyaltyInfo = {}) => {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = 0; // 0% tax for now
    const discountAmount = loyaltyInfo.loyaltyDiscount || pendingLoyaltyInfo.loyaltyDiscount || 0;
    const pointsRedeemed = loyaltyInfo.loyaltyPointsRedeemed || pendingLoyaltyInfo.loyaltyPointsRedeemed || 0;
    const grand_total = Math.max(0, subtotal - discountAmount + tax);

    const payload = {
      store_id: 1,
      cashier_id: 1,
      customer_id: customerId, 
      discount: 0,
      tax: tax,
      loyalty_points_redeemed: pointsRedeemed,
      loyalty_discount_amount: discountAmount,
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
      const response = await axios.post('http://localhost:8000/pos/bill/', payload);
      
      const cust = selectedCustomerId ? customers.find(c => c.id === selectedCustomerId) : null;
      setCompletedInvoice({
        invoice_number: response.data.invoice_number,
        subtotal: subtotal,
        tax: tax,
        grand_total: grand_total,
        discount_amount: discountAmount,
        loyalty_points_earned: response.data.loyalty_points_earned || 0,
        payment_method: paymentMethod,
        items: [...cartItems],
        customer_name: cust ? cust.name : null,
        customer_mobile: cust ? cust.mobile : null
      });
      
      setCartItems([]);
      setPendingLoyaltyInfo({ loyaltyPointsRedeemed: 0, loyaltyDiscount: 0 });
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
    <div className="h-screen flex flex-col overflow-hidden selection:bg-brand selection:text-white bg-premium-app">
      <Header onMenuClick={() => alert('Mobile menu clicked')} />

      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        <Sidebar activeCategory={activeCategory} setActiveCategory={setActiveCategory} dynamicCategories={categories} />

        <section className="flex-1 p-3 lg:p-4 overflow-y-auto pb-20 lg:pb-4 relative bg-surface">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm lg:text-[15px] font-black text-slate-800 flex items-center gap-2">
                {t('products')} <span className="text-[10px] lg:text-xs font-bold text-slate-600 bg-slate-200/80 px-2.5 py-0.5 rounded-full">{filteredProducts.length}</span>
              </h2>
              <button className="sm:hidden text-slate-500"><Faders weight="bold" className="text-lg" /></button>
            </div>

            {/* Dedicated In-Page Search Bar */}
            <div className="relative w-full sm:w-72 lg:w-80">
              <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t('search_products')} 
                className="glass-input w-full h-8 sm:h-9 rounded-xl text-xs font-bold pl-8 sm:pl-9 pr-7 outline-none border border-slate-200/80 focus:border-brand"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')} 
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
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
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2.5 lg:gap-3.5">
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
