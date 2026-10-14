import re

with open('C:/Users/Omkar/Desktop/Dukaan360_Frontend/src/pages/BillHistory.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Add ReceiptModal import
text = text.replace("import Header from '../components/Header';", "import Header from '../components/Header';\nimport ReceiptModal from '../components/ReceiptModal';")

# 2. Add products state and fetch
state_logic = """  const [selectedBill, setSelectedBill] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch products so we can map product_id to name for the receipt
    axios.get('http://localhost:8000/products/')
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  }, []);"""

text = text.replace("  const [selectedBill, setSelectedBill] = useState(null);", state_logic)

# 3. Replace the entire modal with ReceiptModal
# We need to find the modal block and replace it
modal_start = "{/* Bill Detail Modal (Fully Responsive) */}"
idx = text.find(modal_start)
if idx != -1:
    new_modal = """      {/* Receipt Modal for Print & WhatsApp */}
      {selectedBill && (
        <ReceiptModal 
          invoice={{
            ...selectedBill,
            payment_method: selectedBill.payments?.[0]?.method || 'CASH',
            items: selectedBill.items.map(item => ({
              ...item,
              name: products.find(p => p.id === item.product_id)?.name || `Item #${item.product_id}`,
              price: item.rate
            }))
          }} 
          onClose={() => setSelectedBill(null)} 
        />
      )}
    </div>
  );
};

export default BillHistory;
"""
    text = text[:idx] + new_modal

with open('C:/Users/Omkar/Desktop/Dukaan360_Frontend/src/pages/BillHistory.jsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Done")
