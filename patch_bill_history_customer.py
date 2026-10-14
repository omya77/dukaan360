import re

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/pages/BillHistory.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Add customers state
text = text.replace("const [products, setProducts] = useState([]);", "const [products, setProducts] = useState([]);\n  const [customers, setCustomers] = useState([]);")

# 2. Update useEffect to fetch customers as well
old_effect = """  useEffect(() => {
    // Fetch products so we can map product_id to name for the receipt
    axios.get('http://localhost:8000/products/')
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
      
    axios.get('http://localhost:8000/pos/bills/')
      .then(res => {
        setBills(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);"""

new_effect = """  useEffect(() => {
    Promise.all([
      axios.get('http://localhost:8000/pos/bills/'),
      axios.get('http://localhost:8000/products/'),
      axios.get('http://localhost:8000/customers/')
    ]).then(([billsRes, prodRes, custRes]) => {
      setBills(billsRes.data);
      setProducts(prodRes.data);
      setCustomers(custRes.data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);"""

text = text.replace(old_effect, new_effect)

# 3. Add customer name helper function
helper_func = """  const filteredBills = bills.filter(b => b.invoice_number.toLowerCase().includes(search.toLowerCase()));

  const getCustomerName = (customerId) => {
    if (!customerId) return 'Walk-in / Cash';
    const c = customers.find(x => x.id === customerId);
    return c ? c.name : 'Unknown';
  };
"""
text = text.replace("  const filteredBills = bills.filter(b => b.invoice_number.toLowerCase().includes(search.toLowerCase()));", helper_func)

# 4. Modify Mobile Cards to show Customer Name
old_card_amount = """                    <div className="text-right">
                      <p className="text-lg font-black text-slate-800">{"\u20B9"}{bill.grand_total.toFixed(2)}</p>
                      <p className="text-[10px] font-bold text-slate-400 mt-0.5">{bill.items.length} Items</p>
                    </div>"""
new_card_amount = """                    <div className="text-right">
                      <p className="text-lg font-black text-slate-800">{"\u20B9"}{bill.grand_total.toFixed(2)}</p>
                      <p className="text-[10px] font-bold text-slate-400 mt-0.5">{bill.items.length} Items</p>
                    </div>
                  </div>
                  {bill.customer_id && (
                    <div className="mt-3 text-xs font-bold text-brand bg-brand/10 px-3 py-1.5 rounded-lg inline-block">
                      Customer: {getCustomerName(bill.customer_id)}
                    </div>
                  )}"""
text = text.replace(old_card_amount + "\n                  </div>", new_card_amount)

# 5. Modify Desktop Table to show Customer Name
# Find the headers
text = text.replace("""<th className="px-6 py-4">Total Amount</th>""", """<th className="px-6 py-4">Customer</th>\n                      <th className="px-6 py-4">Total Amount</th>""")

# Find the rows
old_table_row = """                      <td className="px-6 py-4">
                        <span className="font-black text-slate-800">{"\u20B9"}{bill.grand_total.toFixed(2)}</span>
                        <p className="text-[11px] font-bold text-slate-400">{bill.items.length} items</p>
                      </td>"""
new_table_row = """                      <td className="px-6 py-4 text-xs font-bold text-slate-600">
                        {getCustomerName(bill.customer_id)}
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-black text-slate-800">{"\u20B9"}{bill.grand_total.toFixed(2)}</span>
                        <p className="text-[11px] font-bold text-slate-400">{bill.items.length} items</p>
                      </td>"""
text = text.replace(old_table_row, new_table_row)

# 6. Pass Customer Name into ReceiptModal if needed!
# Actually, ReceiptModal currently expects `invoice` object but doesn't print customer name.
# Wait, ReceiptModal does NOT print customer name in its template! It just prints "Bill No", "Date", "Cashier", "Payment Mode".
# If I want to print it on the receipt too, I should pass it. Let's pass `customer_name` in the invoice object.
old_invoice = """            payment_method: selectedBill.payments?.[0]?.method || 'CASH',"""
new_invoice = """            payment_method: selectedBill.payments?.[0]?.method || 'CASH',
            customer_name: getCustomerName(selectedBill.customer_id),"""
text = text.replace(old_invoice, new_invoice)

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/pages/BillHistory.jsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Done")
