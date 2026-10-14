import re

with open('C:/Users/Omkar/Desktop/Dukaan360_Frontend/src/pages/POS.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Add barcode scanner useEffect
barcode_effect = """  useEffect(() => {
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
"""

text = text.replace("""  useEffect(() => {
    fetchData();
  }, []);""", barcode_effect)

with open('C:/Users/Omkar/Desktop/Dukaan360_Frontend/src/pages/POS.jsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Done")
