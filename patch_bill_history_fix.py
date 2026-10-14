import re

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/pages/BillHistory.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Pattern to match everything between the customers state and the return statement
pattern = re.compile(r'const \[customers, setCustomers\] = useState\(\[\]\);([\s\S]*?)return \(', re.MULTILINE)

replacement = """const [customers, setCustomers] = useState([]);

  useEffect(() => {
    Promise.all([
      axios.get('http://localhost:8000/pos/bills/?limit=500'),
      axios.get('http://localhost:8000/products/'),
      axios.get('http://localhost:8000/customers/')
    ]).then(([billsRes, prodRes, custRes]) => {
      setBills(billsRes.data);
      setProducts(prodRes.data);
      setCustomers(custRes.data);
      setLoading(false);
    }).catch(err => {
      console.error("Error fetching data:", err);
      setLoading(false);
    });
  }, []);

  const filteredBills = bills.filter(bill => 
    bill.invoice_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCustomerName = (customerId) => {
    if (!customerId) return 'Walk-in / Cash';
    const c = customers.find(x => x.id === customerId);
    return c ? c.name : 'Unknown';
  };

  return ("""

text = pattern.sub(replacement, text)

# Also check if getCustomerName is accidentally used elsewhere without being replaced properly
# We replaced it correctly in the JSX in the previous step, so it should just work now!

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/pages/BillHistory.jsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Done")
