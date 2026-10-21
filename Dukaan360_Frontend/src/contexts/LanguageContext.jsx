import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const SUPPORTED_LANGUAGES = [
  { code: 'mr', label: 'मराठी', flag: '🚩', nativeName: 'मराठी' },
  { code: 'hi', label: 'हिंदी', flag: '🇮🇳', nativeName: 'हिंदी' },
  { code: 'en', label: 'English', flag: '🇬🇧', nativeName: 'English' },
];

export const translations = {
  // ===================== ENGLISH =====================
  en: {
    // Navigation & App Header
    pos: "POS Billing",
    stock: "Stock & Inventory",
    khata: "Customer Ledger",
    history: "Bill History",
    dashboard: "Dashboard",
    language: "Language",
    search_items: "Search items...",
    search_products: "Search items or scan barcode...",
    notifications: "Notifications",
    new_badge: "New",
    no_notifications: "No new notifications",
    online: "Online",
    offline: "Offline",
    owner: "Owner",
    cashier: "Cashier",
    add_staff: "Add Staff",
    add_staff_subtitle: "Create cashier login account",
    logout: "Logout",
    logout_subtitle: "Exit your store session",
    create_cashier_login: "Create Cashier Login",
    staff_name: "Staff Name",
    mobile_login_id: "Mobile Number (Login ID)",
    staff_username: "Login Username",
    staff_username_placeholder: "Enter cashier username",
    staff_username_hint: "Letters, numbers & _ only (min. 3 characters)",
    staff_mobile_optional: "Mobile Number (Optional)",
    mobile_or_username: "Mobile Number or Username",
    mobile_or_username_placeholder: "Enter 10-digit mobile or @username",
    password: "Password",
    create_account: "Create Account",

    // Common Categories
    all: "All",
    cat_grocery: "Grocery",
    cat_dairy: "Dairy",
    cat_snacks: "Snacks",
    cat_cleaning: "Cleaning",
    cat_general: "General",

    // Payment Methods
    pmt_cash: "Cash",
    pmt_upi: "UPI",
    pmt_credit: "Credit",
    pmt_khata: "Khata",

    // POS & Cart
    products: "Products",
    current_order: "Current Order",
    cart_empty: "Cart is empty",
    add_products_to_start: "Add products to start billing",
    items: "items",
    subtotal: "Subtotal",
    tax: "Tax",
    total: "Total",
    walk_in_customer: "Walk-in Customer",
    click_to_link_customer: "Click to link customer...",
    linked_customer: "Linked Customer",
    checkout_cash: "Checkout with Cash",
    checkout_upi: "Checkout with UPI",
    checkout_khata: "Checkout with Credit",
    checkout_with: "Checkout with",
    select_add_customer: "Select or Add Customer",
    add_new_customer: "+ Add New Customer",
    customer_name: "Customer Name",
    mobile_number: "Mobile Number",
    save_customer: "Save Customer",
    due: "Due",
    cancel: "Cancel",
    back: "Back",
    save_and_link: "Save & Link",
    no_customers_found: "No customers found",

    // Product Card
    out_of_stock_badge: "OUT OF STOCK",
    in_stock_badge: "IN STOCK",

    // Inventory
    inventory_title: "Stock & Inventory Management",
    inventory_subtitle: "Track real inventory, purchase rates and stock levels",
    total_catalog: "Total Catalog",
    stock_capital: "Stock Capital",
    low_stock: "Low Stock",
    out_of_stock: "Out of Stock",
    in_stock: "In Stock",
    all_items: "All Items",
    all_categories: "All Categories",
    new_product: "New Product",
    add_category: "+ Category",
    selling_price: "Selling Price",
    purchase_rate: "Purchase Rate",
    available_stock: "Available Stock",
    receive_stock: "Receive Stock",
    edit: "Edit",
    delete: "Delete",
    history_action: "History",
    barcode: "Barcode",
    unit: "Unit",
    rate_mrp: "Price / MRP",
    quick_actions: "Quick Actions",
    receive_stock_btn: "Receive Stock",
    category: "Category",
    product_name: "Product Name",
    no_barcode: "NO-BARCODE",
    units_remaining: "units remaining",
    qty_less_than_10: "Qty <= 10 units",
    inventory_valuation: "Inventory Valuation",

    // Khata
    khata_title: "Khata Ledger",
    market_outstanding: "Market Outstanding",
    bulk_remind: "Bulk Remind",
    festive_greeting: "Festival Greetings",
    search_customers: "Search customers...",
    remind_whatsapp: "Remind on WhatsApp",
    receive_payment_btn: "Receive Payment",
    customer_ledger: "Customer Ledger",
    select_customer_to_view: "Select a customer to view ledger",
    total_due: "Total Due Amount",
    give_credit: "Give Credit (+)",
    record_payment: "Record Payment (-)",
    remind: "Remind",
    new_customer_btn: "+ New Customer",

    // Bill History
    bill_history_title: "Bill History & Invoices",
    bill_history_subtitle: "View, search, reprint or share invoices",
    total_invoiced: "Total Invoiced",
    bills_count: "bills generated",
    all_bills: "All Bills",
    cash_pill: "Cash",
    upi_pill: "UPI",
    khata_pill: "Credit",
    today_pill: "Today",
    bill_total: "Bill Total",
    print_action: "Print Receipt",
    search_invoices: "Search by Invoice, Customer...",
    no_invoices_found: "No Invoices Found",
    reset_filters: "Reset Filters",
    col_invoice_customer: "Invoice & Customer",
    col_date_time: "Date & Time",
    col_payment_method: "Payment Method",
    col_bill_total: "Bill Total",
    col_quick_action: "Action",

    // Receipt Modal / Thermal Print
    receipt_title: "Receipt",
    print_receipt: "Print Receipt",
    tax_invoice: "TAX INVOICE",
    bill_no: "Bill No",
    date_time: "Date & Time",
    payment_mode: "Payment Mode",
    table_item: "ITEM",
    table_qty: "QTY",
    table_amt: "AMT",
    thank_you: "*** THANK YOU ***",
    visit_again: "Please visit again!",
    new_bill: "New Bill",
    direct_send: "Direct Send",
    whatsapp: "WhatsApp",
    print_bill: "Print Bill",

    // General / Feedback
    loading: "Loading...",
    remove_customer: "Remove Customer",
    staff_created_success: "Staff account created successfully!",

    // POS & Scan UPI
    scan_and_pay: "Scan & Pay",
    upi_apps_hint: "Use PhonePe, GPay, or any UPI App",
    waiting_for_payment: "Waiting for payment...",
    confirm_payment: "Confirm Payment",

    // Khata Ledger Details
    transaction_history: "Transaction History",
    opening_balance: "Opening Balance",
    initial_record: "Initial record",
    total_khata_bills: "Total Khata Bills",
    unpaid_invoices: "Unpaid invoices",
    amount_received: "Amount Received",
    save_payment: "Save Payment",
    full_name: "Full Name",
    monthly_reminders: "Monthly Reminders",
    send_to_customers: "Send to customers",
    no_pending_dues: "No Pending Dues!",
    everyone_cleared_khata: "Everyone has cleared their Khata.",
    close: "Close",
    sending_x_of_y: "Sending",
    of: "of",
    pending_amount: "Pending Amount",
    send_and_next: "Send & Next",
    all_done: "All Done!",
    reminders_sent_to_all: "Reminders sent to all customers.",
    festival_wishes: "Festival Wishes",
    send_to_all_customers: "Send to all customers",
    wishes_sent_to_all: "Wishes sent to all customers.",

    // Inventory Modals & Actions
    stock_batch_history: "Stock Batch History",
    no_stock_batches: "No stock batches recorded yet.",
    batch: "Batch",
    current_quantity: "Current Qty",
    purchase_cost: "Purchase Cost",
    quantity_received: "Quantity Received",
    purchase_rate_per_unit: "Purchase Rate per unit",
    confirm_stock_entry: "Confirm Stock Entry",
    edit_item_details: "Edit Item Details",
    add_new_product_title: "Add New Product",
    unit_type: "Unit / Type",
    mrp: "MRP",
    product_image: "Product Image",
    uploaded: "Uploaded!",
    barcode_optional: "Barcode (Optional)",
    barcode_hint: "Leave empty to auto-generate",
    save_changes: "Save Changes",
    create_product: "Create Product",
    enter_new_cat_prompt: "Enter new category name:",
    cat_added_success: "Category added successfully and is now available in dropdown!",
    cat_add_failed: "Failed to add category. It may already exist.",
    delete_product_confirm: "Are you sure you want to delete this product? This action cannot be undone.",
    product_created_success: "Product created successfully!",
    product_deleted_success: "Product deleted successfully!",
    product_save_failed: "Failed to save product. Check if Barcode is unique.",
    product_delete_failed: "Failed to delete product. It might be used in previous bills."
  },

  // ===================== MARATHI =====================
  mr: {
    // Navigation & App Header
    pos: "बिलिंग",
    stock: "माल साठा",
    khata: "खातेवही",
    history: "बिल इतिहास",
    dashboard: "डॅशबोर्ड",
    language: "भाषा",
    search_items: "वस्तू शोधा...",
    search_products: "वस्तू शोधा किंवा बारकोड स्कॅन करा...",
    notifications: "सूचना",
    new_badge: "नवीन",
    no_notifications: "कोणतीही नवीन सूचना नाही",
    online: "सक्रिय",
    offline: "बंद",
    owner: "दुकानदार",
    cashier: "कॅशियर",
    add_staff: "कर्मचारी जोडा",
    add_staff_subtitle: "कर्मचारी लॉगिन खाते तयार करा",
    logout: "लॉगआउट करा",
    logout_subtitle: "खात्यातून बाहेर पडा",
    create_cashier_login: "कॅशियर लॉगिन तयार करा",
    staff_name: "कर्मचाऱ्याचे नाव",
    mobile_login_id: "मोबाईल नंबर (लॉगिन आयडी)",
    staff_username: "लॉगिन युझरनेम (Username)",
    staff_username_placeholder: "कॅशियर युझरनेम टाका",
    staff_username_hint: "फक्त लहान अक्षरे, आकडे व _ (किमान ३ अक्षरे)",
    staff_mobile_optional: "मोबाईल नंबर (ऐच्छिक)",
    mobile_or_username: "मोबाईल नंबर किंवा युझरनेम",
    mobile_or_username_placeholder: "10-अंकी मोबाईल किंवा @युझरनेम टाका",
    password: "पासवर्ड",
    create_account: "खाते तयार करा",

    // Common Categories
    all: "सर्व",
    cat_grocery: "किराणा",
    cat_dairy: "दुग्धजन्य",
    cat_snacks: "नाश्ता",
    cat_cleaning: "स्वच्छता साहित्य",
    cat_general: "इतर",

    // Payment Methods
    pmt_cash: "रोख",
    pmt_upi: "ऑनलाइन",
    pmt_credit: "उधारी",
    pmt_khata: "उधारी",

    // POS & Cart
    products: "दुकानातील वस्तू",
    current_order: "चालू बिल",
    cart_empty: "कार्ट रिकामी आहे",
    add_products_to_start: "बिलिंग सुरू करण्यासाठी वस्तू निवडा",
    items: "वस्तू",
    subtotal: "उपएकूण",
    tax: "कर",
    total: "एकूण रक्कम",
    walk_in_customer: "नेहमीचा ग्राहक",
    click_to_link_customer: "ग्राहक जोडण्यासाठी क्लिक करा...",
    linked_customer: "जोडलेला ग्राहक",
    checkout_cash: "रोख रकमेने बिल बनवा",
    checkout_upi: "ऑनलाइन बिल बनवा",
    checkout_khata: "उधारीवर बिल बनवा",
    checkout_with: "बिल बनवा:",
    select_add_customer: "ग्राहक निवडा किंवा नवीन जोडा",
    add_new_customer: "+ नवीन ग्राहक जोडा",
    customer_name: "ग्राहकाचे नाव",
    mobile_number: "मोबाईल नंबर",
    save_customer: "ग्राहक जतन करा",
    due: "बाकी",
    cancel: "रद्द करा",
    back: "मागे",
    save_and_link: "जतन करा व जोडा",
    no_customers_found: "ग्राहक सापडले नाहीत",

    // Product Card
    out_of_stock_badge: "संपला",
    in_stock_badge: "शिल्लक",

    // Inventory
    inventory_title: "माल साठा व्यवस्थापन",
    inventory_subtitle: "दुकानातील साठा, खरेदी किंमत आणि शिल्लक मालाचा थेट हिशोब",
    total_catalog: "एकूण वस्तू",
    stock_capital: "माल भांडवल",
    low_stock: "कमी शिल्लक माल",
    out_of_stock: "संपलेला माल",
    in_stock: "शिल्लक माल",
    all_items: "सर्व वस्तू",
    all_categories: "सर्व कॅटेगरीज",
    new_product: "नवीन उत्पादन",
    add_category: "+ कॅटेगरी",
    selling_price: "विक्री किंमत",
    purchase_rate: "खरेदी दर",
    available_stock: "शिल्लक साठा",
    receive_stock: "माल भरा",
    edit: "बदला",
    delete: "काढून टाका",
    history_action: "इतिहास",
    barcode: "बारकोड",
    unit: "युनिट",
    rate_mrp: "विक्री किंमत",
    quick_actions: "कृती",
    receive_stock_btn: "साठा भरा",
    category: "कॅटेगरी",
    product_name: "उत्पादनाचे नाव",
    no_barcode: "बारकोड नाही",
    units_remaining: "नग शिल्लक",
    qty_less_than_10: "१० पेक्षा कमी शिल्लक",
    inventory_valuation: "मालाचे एकूण मूल्य",

    // Khata
    khata_title: "उधारी खातेवही",
    market_outstanding: "बाजारात बाकी उधारी",
    bulk_remind: "सर्वांना तगादा मेसेज",
    festive_greeting: "दिवाळी शुभेच्छा संदेश",
    search_customers: "ग्राहक शोधा...",
    remind_whatsapp: "तगादा पाठवा",
    receive_payment_btn: "जमा पावती",
    customer_ledger: "ग्राहकाचे खाते",
    select_customer_to_view: "तपशील पाहण्यासाठी ग्राहक निवडा",
    total_due: "एकूण बाकी रक्कम",
    give_credit: "उधारी द्या (+)",
    record_payment: "जमा पावती (-)",
    remind: "तगादा",
    new_customer_btn: "+ नवीन ग्राहक",

    // Bill History
    bill_history_title: "बिल इतिहास व पावत्या",
    bill_history_subtitle: "सर्व पावत्या पहा, पुनर्प्रिंट करा व शेअर करा",
    total_invoiced: "एकूण विक्री गल्ला",
    bills_count: "बिले तयार झाली",
    all_bills: "सर्व बिले",
    cash_pill: "रोख",
    upi_pill: "ऑनलाइन",
    khata_pill: "उधारी",
    today_pill: "आजची बिले",
    bill_total: "एकूण बिल",
    print_action: "पावती प्रिंट करा",
    search_invoices: "बिल नंबर, ग्राहकाचे नाव शोधा...",
    no_invoices_found: "पावती सापडली नाही",
    reset_filters: "फिल्टर्स पूर्ववत करा",
    col_invoice_customer: "पावती व ग्राहक",
    col_date_time: "दिनांक व वेळ",
    col_payment_method: "पद्धत",
    col_bill_total: "एकूण बिल",
    col_quick_action: "कृती",

    // Receipt Modal / Thermal Print
    receipt_title: "पावती",
    print_receipt: "पावती प्रिंट करा",
    tax_invoice: "विक्री पावती",
    bill_no: "बिल क्र.",
    date_time: "दिनांक व वेळ",
    payment_mode: "पद्धत",
    table_item: "वस्तू",
    table_qty: "नग",
    table_amt: "रक्कम",
    thank_you: "*** आपले खूप खूप धन्यवाद ***",
    visit_again: "पुन्हा नक्की भेट द्या!",
    new_bill: "नवीन बिल",
    direct_send: "थेट पाठवा",
    whatsapp: "व्हॉट्सॲप",
    print_bill: "पावती प्रिंट करा",

    // General / Feedback
    loading: "लोड होत आहे...",
    remove_customer: "ग्राहक काढा",
    staff_created_success: "कर्मचारी खाते यशस्वीरित्या तयार झाले!",

    // POS & Scan UPI
    scan_and_pay: "स्कॅन करून पैसे भरा",
    upi_apps_hint: "PhonePe, Google Pay किंवा कोणतेही UPI ॲप वापरा",
    waiting_for_payment: "पेमेंटची वाट पाहत आहे...",
    confirm_payment: "पेमेंट निश्चित करा",

    // Khata Ledger Details
    transaction_history: "व्यवहार इतिहास",
    opening_balance: "आरंभीची बाकी",
    initial_record: "सुरुवातीची नोंद",
    total_khata_bills: "एकूण उधारी बिले",
    unpaid_invoices: "न भरलेली बिले",
    amount_received: "जमा झालेली रक्कम",
    save_payment: "पेमेंट जतन करा",
    full_name: "पूर्ण नाव",
    monthly_reminders: "मासिक उधारी तगादा",
    send_to_customers: "ग्राहकांना पाठवा",
    no_pending_dues: "कोणतीही उधारी बाकी नाही!",
    everyone_cleared_khata: "सर्व ग्राहकांचे खाते पूर्ण भरलेले आहे.",
    close: "बंद करा",
    sending_x_of_y: "पाठवत आहे",
    of: "पैकी",
    pending_amount: "बाकी रक्कम",
    send_and_next: "पाठवा व पुढील",
    all_done: "सर्व काम पूर्ण झाले!",
    reminders_sent_to_all: "सर्व ग्राहकांना तगादा संदेश पाठवले गेले.",
    festival_wishes: "सणाच्या शुभेच्छा",
    send_to_all_customers: "सर्व ग्राहकांना शुभेच्छा पाठवा",
    wishes_sent_to_all: "सर्व ग्राहकांना शुभेच्छा संदेश पाठवले गेले.",

    // Inventory Modals & Actions
    stock_batch_history: "माल साठा इतिहास",
    no_stock_batches: "अद्याप कोणताही साठा इतिहास नोंदवला गेला नाही.",
    batch: "बॅच",
    current_quantity: "सध्याचा साठा",
    purchase_cost: "खरेदी किंमत",
    quantity_received: "आलेला साठा",
    purchase_rate_per_unit: "प्रति नग खरेदी दर",
    confirm_stock_entry: "साठा नोंद निश्चित करा",
    edit_item_details: "वस्तूची माहिती बदला",
    add_new_product_title: "नवीन वस्तू जोडा",
    unit_type: "प्रकार / युनिट",
    mrp: "छापील किंमत (MRP)",
    product_image: "वस्तूचा फोटो",
    uploaded: "फोटो अपलोड झाला!",
    barcode_optional: "बारकोड (ऐच्छिक)",
    barcode_hint: "आपोआप तयार करण्यासाठी रिकामे ठेवा",
    save_changes: "बदल जतन करा",
    create_product: "वस्तू जोडा",
    enter_new_cat_prompt: "नवीन कॅटेगरीचे नाव टाका:",
    cat_added_success: "कॅटेगरी यशस्वीरित्या जोडली गेली!",
    cat_add_failed: "कॅटेगरी जोडता आली नाही. ती आधीच असू शकते.",
    delete_product_confirm: "तुम्हाला खात्री आहे का की हे उत्पादन काढून टाकायचे आहे? ही कृती पूर्ववत केली जाऊ शकत नाही.",
    product_created_success: "उत्पादन यशस्वीरित्या जोडले गेले!",
    product_deleted_success: "उत्पादन यशस्वीरित्या हटवले गेले!",
    product_save_failed: "उत्पादन जतन करण्यात अयशस्वी. बारकोड वेगळा असल्याची खात्री करा.",
    product_delete_failed: "उत्पादन काढून टाकण्यात अयशस्वी. ते जुन्या बिलांमध्ये वापरलेले असू शकते."
  },

  // ===================== HINDI =====================
  hi: {
    // Navigation & App Header
    pos: "बिलिंग",
    stock: "स्टॉक",
    khata: "खाता बही",
    history: "बिल इतिहास",
    dashboard: "डैशबोर्ड",
    language: "भाषा",
    search_items: "सामान खोजें...",
    search_products: "सामान खोजें या बारकोड स्कैन करें...",
    notifications: "सूचनाएं",
    new_badge: "नई",
    no_notifications: "कोई नई सूचना नहीं है",
    online: "सक्रिय",
    offline: "बंद",
    owner: "दुकानदार",
    cashier: "कैशियर",
    add_staff: "कर्मचारी जोड़ें",
    add_staff_subtitle: "कर्मचारी लॉगिन खाता बनाएं",
    logout: "लॉगआउट करें",
    logout_subtitle: "खाते से बाहर निकलें",
    create_cashier_login: "कैशियर लॉगिन बनाएं",
    staff_name: "कर्मचारी का नाम",
    mobile_login_id: "मोबाइल नंबर (लॉगिन आईडी)",
    staff_username: "लॉगिन यूजरनेम (Username)",
    staff_username_placeholder: "कैशियर यूजरनेम दर्ज करें",
    staff_username_hint: "केवल छोटे अक्षर, संख्या और _ (कम से कम 3 अक्षर)",
    staff_mobile_optional: "मोबाइल नंबर (वैकल्पिक)",
    mobile_or_username: "मोबाइल नंबर या यूजरनेम",
    mobile_or_username_placeholder: "10-अंकों का मोबाइल या @यूजरनेम दर्ज करें",
    password: "पासवर्ड",
    create_account: "खाता बनाएं",

    // Common Categories
    all: "सभी",
    cat_grocery: "किराना",
    cat_dairy: "डेयरी",
    cat_snacks: "नाश्ता",
    cat_cleaning: "सफाई सामग्री",
    cat_general: "सामान्य",

    // Payment Methods
    pmt_cash: "नकद",
    pmt_upi: "ऑनलाइन",
    pmt_credit: "उधार",
    pmt_khata: "उधार",

    // POS & Cart
    products: "दुकान का सामान",
    current_order: "चालू बिल",
    cart_empty: "कार्ट खाली है",
    add_products_to_start: "बिलिंग शुरू करने के लिए सामान जोड़ें",
    items: "सामान",
    subtotal: "उप-कुल",
    tax: "टैक्स",
    total: "कुल राशि",
    walk_in_customer: "सामान्य ग्राहक",
    click_to_link_customer: "ग्राहक जोड़ने के लिए क्लिक करें...",
    linked_customer: "जुड़ा हुआ ग्राहक",
    checkout_cash: "नकद से बिल बनाएं",
    checkout_upi: "ऑनलाइन बिल बनाएं",
    checkout_khata: "उधार पर बिल बनाएं",
    checkout_with: "बिल बनाएं:",
    select_add_customer: "ग्राहक चुनें या नया जोड़ें",
    add_new_customer: "+ नया ग्राहक जोड़ें",
    customer_name: "ग्राहक का नाम",
    mobile_number: "मोबाइल नंबर",
    save_customer: "ग्राहक सुरक्षित करें",
    due: "बाकी",
    cancel: "रद्द करें",
    back: "पीछे",
    save_and_link: "सुरक्षित करें व जोड़ें",
    no_customers_found: "ग्राहक नहीं मिले",

    // Product Card
    out_of_stock_badge: "स्टॉक खत्म",
    in_stock_badge: "उपलब्ध",

    // Inventory
    inventory_title: "स्टॉक और इन्वेंटरी प्रबंधन",
    inventory_subtitle: "दुकान का सामान, खरीद मूल्य और स्टॉक का लाइव हिसाब",
    total_catalog: "कुल सामान",
    stock_capital: "स्टॉक लागत (पूंजी)",
    low_stock: "कम स्टॉक",
    out_of_stock: "स्टॉक खत्म",
    in_stock: "उपलब्ध स्टॉक",
    all_items: "सभी सामान",
    all_categories: "सभी श्रेणियां",
    new_product: "नया सामान",
    add_category: "+ श्रेणी",
    selling_price: "बिक्री मूल्य",
    purchase_rate: "खरीद दर",
    available_stock: "उपलब्ध स्टॉक",
    receive_stock: "माल भरें",
    edit: "संशोधित करें",
    delete: "हटाएं",
    history_action: "इतिहास",
    barcode: "बारकोड",
    unit: "इकाई",
    rate_mrp: "बिक्री मूल्य",
    quick_actions: "क्रियाएं",
    receive_stock_btn: "स्टॉक बढ़ाएं",
    category: "श्रेणी",
    product_name: "उत्पाद का नाम",
    no_barcode: "बारकोड नहीं",
    units_remaining: "इकाई शेष",
    qty_less_than_10: "१० से कम स्टॉक",
    inventory_valuation: "स्टॉक का कुल मूल्य",

    // Khata
    khata_title: "उधार खाता बही",
    market_outstanding: "बाजार में बाकी उधार",
    bulk_remind: "सभी को तगादा भेजें",
    festive_greeting: "त्योहार शुभकामना संदेश",
    search_customers: "ग्राहक खोजें...",
    remind_whatsapp: "तगादा भेजें",
    receive_payment_btn: "उधार जमा रसीद",
    customer_ledger: "ग्राहक का खाता",
    select_customer_to_view: "विवरण देखने के लिए ग्राहक चुनें",
    total_due: "कुल बाकी राशि",
    give_credit: "उधार दें (+)",
    record_payment: "जमा रसीद (-)",
    remind: "तगादा",
    new_customer_btn: "+ नया ग्राहक",

    // Bill History
    bill_history_title: "बिल इतिहास और रसीदें",
    bill_history_subtitle: "सभी रसीदें देखें, प्रिंट करें और साझा करें",
    total_invoiced: "कुल बिक्री गल्ला",
    bills_count: "बिल बनाए गए",
    all_bills: "सभी बिल",
    cash_pill: "नकद",
    upi_pill: "ऑनलाइन",
    khata_pill: "उधार",
    today_pill: "आज के बिल",
    bill_total: "कुल बिल",
    print_action: "रसीद प्रिंट करें",
    search_invoices: "बिल नंबर, ग्राहक का नाम खोजें...",
    no_invoices_found: "रसीद नहीं मिली",
    reset_filters: "फ़िल्टर रीसेट करें",
    col_invoice_customer: "रसीद व ग्राहक",
    col_date_time: "दिनांक व समय",
    col_payment_method: "भुगतान विधि",
    col_bill_total: "कुल बिल",
    col_quick_action: "क्रियाएं",

    // Receipt Modal / Thermal Print
    receipt_title: "रसीद",
    print_receipt: "रसीद प्रिंट करें",
    tax_invoice: "बिक्री रसीद",
    bill_no: "बिल नं.",
    date_time: "दिनांक व समय",
    payment_mode: "भुगतान प्रकार",
    table_item: "सामान",
    table_qty: "मात्रा",
    table_amt: "रुपये",
    thank_you: "*** बहुत-बहुत धन्यवाद ***",
    new_bill: "नया बिल",
    direct_send: "सीधे भेजें",
    whatsapp: "व्हाट्सएप",
    print_bill: "रसीद प्रिंट करें",

    // General / Feedback
    loading: "लोड हो रहा है...",
    remove_customer: "ग्राहक हटाएं",
    staff_created_success: "कर्मचारी खाता सफलतापूर्वक बनाया गया!",

    // POS & Scan UPI
    scan_and_pay: "स्कैन करें और भुगतान करें",
    upi_apps_hint: "PhonePe, Google Pay या कोई भी UPI ऐप उपयोग करें",
    waiting_for_payment: "भुगतान की प्रतीक्षा है...",
    confirm_payment: "भुगतान की पुष्टि करें",

    // Khata Ledger Details
    transaction_history: "लेनदेन इतिहास",
    opening_balance: "प्रारंभिक शेष",
    initial_record: "आरंभिक विवरण",
    total_khata_bills: "कुल उधार बिल",
    unpaid_invoices: "बकाया बिल",
    amount_received: "प्राप्त राशि",
    save_payment: "भुगतान सुरक्षित करें",
    full_name: "पूरा नाम",
    monthly_reminders: "मासिक उधार तगादा",
    send_to_customers: "ग्राहकों को भेजें",
    no_pending_dues: "कोई बकाया उधार नहीं है!",
    everyone_cleared_khata: "सभी ग्राहकों का खाता चुकता है।",
    close: "बंद करें",
    sending_x_of_y: "भेज रहे हैं",
    of: "में से",
    pending_amount: "बाकी राशि",
    send_and_next: "भेजें और अगला",
    all_done: "सब पूरा हुआ!",
    reminders_sent_to_all: "सभी ग्राहकों को तगादा संदेश भेज दिए गए हैं।",
    festival_wishes: "त्योहार की शुभकामनाएं",
    send_to_all_customers: "सभी ग्राहकों को शुभकामनाएं भेजें",
    wishes_sent_to_all: "सभी ग्राहकों को शुभकामनाएं भेज दी गई हैं।",

    // Inventory Modals & Actions
    stock_batch_history: "स्टॉक बैच इतिहास",
    no_stock_batches: "अभी तक कोई स्टॉक बैच दर्ज नहीं है।",
    batch: "बैच",
    current_quantity: "वर्तमान मात्रा",
    purchase_cost: "खरीद लागत",
    quantity_received: "प्राप्त मात्रा",
    purchase_rate_per_unit: "प्रति इकाई खरीद दर",
    confirm_stock_entry: "स्टॉक प्रविष्टि दर्ज करें",
    edit_item_details: "सामान विवरण संशोधित करें",
    add_new_product_title: "नया सामान जोड़ें",
    unit_type: "प्रकार / इकाई",
    mrp: "अधिकतम खुदरा मूल्य (MRP)",
    product_image: "सामान की फोटो",
    uploaded: "फोटो अपलोड हो गई!",
    barcode_optional: "बारकोड (वैकल्पिक)",
    barcode_hint: "स्वतः बनने के लिए खाली छोड़ें",
    save_changes: "बदलाव सुरक्षित करें",
    create_product: "सामान जोड़ें",
    enter_new_cat_prompt: "नई श्रेणी का नाम दर्ज करें:",
    cat_added_success: "श्रेणी सफलतापूर्वक जोड़ी गई!",
    cat_add_failed: "श्रेणी जोड़ने में विफल। यह पहले से मौजूद हो सकती है।",
    delete_product_confirm: "क्या आप वाकई इस सामान को हटाना चाहते हैं? यह क्रिया पूर्ववत नहीं की जा सकती।",
    product_created_success: "सामान सफलतापूर्वक जोड़ा गया!",
    product_deleted_success: "सामान सफलतापूर्वक हटाया गया!",
    product_save_failed: "सामान सुरक्षित करने में विफल। जांचें कि बारकोड अद्वितीय है।",
    product_delete_failed: "सामान हटाने में विफल। यह पिछले बिलों में उपयोग किया गया हो सकता है।"
  }
};

// ===================== PRODUCT TRANSLATIONS (CATALOG) =====================
export const PRODUCT_TRANSLATIONS = {
  "Aashirvaad Atta (5kg)": {
    mr: "आशीर्वाद गव्हाचे पीठ (५ किग्रॅ)",
    hi: "आशीर्वाद गेहूं आटा (5 किग्रा)",
    en: "Aashirvaad Atta (5kg)"
  },
  "India Gate Basmati Rice (1kg)": {
    mr: "इंडिया गेट बासमती तांदूळ (१ किग्रॅ)",
    hi: "इंडिया गेट बासमती चावल (1 किग्रा)",
    en: "India Gate Basmati Rice (1kg)"
  },
  "Toor Dal (Unpolished) 1kg": {
    mr: "तूर डाळ (अनपॉलिश) १ किग्रॅ",
    hi: "तूर दाल (अनपॉलिश) 1 किग्रा",
    en: "Toor Dal (Unpolished) 1kg"
  },
  "Moong Dal 1kg": {
    mr: "मूग डाळ १ किग्रॅ",
    hi: "मूंग दाल 1 किग्रा",
    en: "Moong Dal 1kg"
  },
  "Chana Dal 1kg": {
    mr: "चणा डाळ १ किग्रॅ",
    hi: "चना दाल 1 किग्रा",
    en: "Chana Dal 1kg"
  },
  "Fortune Besan 500g": {
    mr: "फॉर्च्यून बेसन ५०० ग्रॅ",
    hi: "फॉर्च्यून बेसन 500 ग्रा",
    en: "Fortune Besan 500g"
  },
  "Everest Garam Masala 100g": {
    mr: "एव्हरेस्ट गरम मसाला १०० ग्रॅ",
    hi: "एवरेस्ट गरम मसाला 100 ग्रा",
    en: "Everest Garam Masala 100g"
  },
  "MDH Chana Masala 100g": {
    mr: "एमडीएच चणा मसाला १०० ग्रॅ",
    hi: "एमडीएच चना मसाला 100 ग्रा",
    en: "MDH Chana Masala 100g"
  },
  "Suhana Chicken Masala 50g": {
    mr: "सुहाना चिकन मसाला ५० ग्रॅ",
    hi: "सुहाना चिकन मसाला 50 ग्रा",
    en: "Suhana Chicken Masala 50g"
  },
  "Turmeric Powder (Haldi) 200g": {
    mr: "हळद पावडर २०० ग्रॅ",
    hi: "हल्दी पाउडर 200 ग्रा",
    en: "Turmeric Powder (Haldi) 200g"
  },
  "Red Chilli Powder 200g": {
    mr: "लाल तिखट मिरची पावडर २०० ग्रॅ",
    hi: "लाल मिर्च पाउडर 200 ग्रा",
    en: "Red Chilli Powder 200g"
  },
  "Coriander Powder (Dhania) 200g": {
    mr: "धने पावडर २०० ग्रॅ",
    hi: "धनिया पाउडर 200 ग्रा",
    en: "Coriander Powder (Dhania) 200g"
  },
  "Fortune Sunlite Refined Sunflower Oil 1L": {
    mr: "फॉर्च्यून रिफाइंड सूर्यफूल तेल १ लि",
    hi: "फॉर्च्यून रिफाइंड सूरजमुखी तेल 1 ली",
    en: "Fortune Sunlite Refined Sunflower Oil 1L"
  },
  "Gemini Refined Soybean Oil 1L": {
    mr: "जेमिनी रिफाइंड सोयाबीन तेल १ लि",
    hi: "जेमिनी रिफाइंड सोयाबीन तेल 1 ली",
    en: "Gemini Refined Soybean Oil 1L"
  },
  "Amul Pure Ghee 500ml": {
    mr: "अमूल शुद्ध साजूक तूप ५०० मिली",
    hi: "अमूल शुद्ध देशी घी 500 मिली",
    en: "Amul Pure Ghee 500ml"
  },
  "Gowardhan Ghee 500ml": {
    mr: "गोवर्धन गायीचे तूप ५०० मिली",
    hi: "गोवर्धन गाय का घी 500 मिली",
    en: "Gowardhan Ghee 500ml"
  },
  "Saffola Gold Cooking Oil 1L": {
    mr: "सॅफोला गोल्ड कुकिंग तेल १ लि",
    hi: "सफोला गोल्ड कुकिंग तेल 1 ली",
    en: "Saffola Gold Cooking Oil 1L"
  },
  "Patanjali Mustard Oil 1L": {
    mr: "पतंजली मोहरी / सरसो तेल १ लि",
    hi: "पतंजलि सरसों का तेल 1 ली",
    en: "Patanjali Mustard Oil 1L"
  },
  "Parle-G Gold Biscuits 1kg": {
    mr: "पारले-जी गोल्ड बिस्किटे १ किग्रॅ",
    hi: "पारले-जी गोल्ड बिस्कुट 1 किग्रा",
    en: "Parle-G Gold Biscuits 1kg"
  },
  "Britannia Good Day Cashew 600g": {
    mr: "ब्रिटानिया गुड डे काजू बिस्किट ६०० ग्रॅ",
    hi: "ब्रिटानिया गुड डे काजू बिस्कुट 600 ग्रा",
    en: "Britannia Good Day Cashew 600g"
  },
  "Haldiram's Bhujia Sev 400g": {
    mr: "हल्दीराम भुजिया शेव ४०० ग्रॅ",
    hi: "हल्दीराम भुजिया सेव 400 ग्रा",
    en: "Haldiram's Bhujia Sev 400g"
  },
  "Lays Classic Salted (Large)": {
    mr: "लेज क्लासिक सॉल्टेड वेफर्स (मोठे)",
    hi: "लेज क्लासिक साल्टेड चिप्स (बड़ा)",
    en: "Lays Classic Salted (Large)"
  },
  "Kurkure Masala Munch (Large)": {
    mr: "कुरकुरे मसाला मंच (मोठे)",
    hi: "कुरकुरे मसाला मंच (बड़ा)",
    en: "Kurkure Masala Munch (Large)"
  },
  "Balaji Wafers (Tomato) 100g": {
    mr: "बालाजी वेफर्स (टोमॅटो) १०० ग्रॅ",
    hi: "बालाजी वेफर्स (टमाटर) 100 ग्रा",
    en: "Balaji Wafers (Tomato) 100g"
  },
  "Coca-Cola 2L": {
    mr: "कोका-कोला २ लिटर",
    hi: "कोका-कोला 2 लीटर",
    en: "Coca-Cola 2L"
  },
  "Sprite 2L": {
    mr: "स्प्राइट २ लिटर",
    hi: "स्प्राइट 2 लीटर",
    en: "Sprite 2L"
  },
  "Maaza Mango Drink 1.2L": {
    mr: "माझा मँगो ज्यूस १.२ लि",
    hi: "माज़ा मैंगो जूस 1.2 ली",
    en: "Maaza Mango Drink 1.2L"
  },
  "Red Label Tea 500g": {
    mr: "रेड लेबल चहा पावडर ५०० ग्रॅ",
    hi: "रेड लेबल चाय पत्ती 500 ग्रा",
    en: "Red Label Tea 500g"
  },
  "Wagh Bakri Premium Tea 500g": {
    mr: "वाघ बकरी प्रीमियम चहा ५०० ग्रॅ",
    hi: "वाघ बकरी प्रीमियम चाय 500 ग्रा",
    en: "Wagh Bakri Premium Tea 500g"
  },
  "Nescafe Classic Coffee 50g": {
    mr: "नेस्कॅफे क्लासिक कॉफी ५० ग्रॅ",
    hi: "नेस्कैफे क्लासिक कॉफी 50 ग्रा",
    en: "Nescafe Classic Coffee 50g"
  },
  "Lux Soap (Pack of 4)": {
    mr: "लक्स साबण (४ चा पॅक)",
    hi: "लक्स साबुन (4 का पैक)",
    en: "Lux Soap (Pack of 4)"
  },
  "Lifebuoy Total Soap (Pack of 4)": {
    mr: "लाईफबॉय साबण (४ चा पॅक)",
    hi: "लाइफ़बॉय साबुन (4 का पैक)",
    en: "Lifebuoy Total Soap (Pack of 4)"
  },
  "Colgate MaxFresh 150g": {
    mr: "कोलगेट मॅक्सफ्रेश टूथपेस्ट १५० ग्रॅ",
    hi: "कोलगेट मैक्सफ्रेश टूथपेस्ट 150 ग्रा",
    en: "Colgate MaxFresh 150g"
  },
  "Sunsilk Black Shine Shampoo 340ml": {
    mr: "सनसिल्क ब्लॅक शाइन शाम्पू ३४० मिली",
    hi: "सनसिल्क ब्लैक शाइन शैम्पू 340 मिली",
    en: "Sunsilk Black Shine Shampoo 340ml"
  },
  "Dove Hair Fall Rescue Shampoo 340ml": {
    mr: "डव्ह हेअर फॉल रेस्क्यू शाम्पू ३४० मिली",
    hi: "डव हेयर फॉल रेस्क्यू शैम्पू 340 मिली",
    en: "Dove Hair Fall Rescue Shampoo 340ml"
  },
  "Ponds Dreamflower Talc 100g": {
    mr: "पॉन्ड्स ड्रीमफ्लॉवर टॅल्क १०० ग्रॅ",
    hi: "पॉन्ड्स ड्रीमफ्लावर टैल्क 100 ग्रा",
    en: "Ponds Dreamflower Talc 100g"
  },
  "Surf Excel Easy Wash Detergent 1kg": {
    mr: "सर्फ एक्सेल ईझी वॉश डिटर्जंट पावडर १ किग्रॅ",
    hi: "सर्फ एक्सेल इजी वॉश डिटर्जेंट 1 किग्रा",
    en: "Surf Excel Easy Wash Detergent 1kg"
  },
  "Tide Plus Jasmine & Rose 1kg": {
    mr: "टाईड प्लस जास्मिन आणि रोझ डिटर्जंट १ किग्रॅ",
    hi: "टाइड प्लस जैस्मीन और रोज 1 किग्रा",
    en: "Tide Plus Jasmine & Rose 1kg"
  },
  "Vim Dishwash Bar (Pack of 3)": {
    mr: "व्हिम भांडी घासण्याचा साबण (३ चा पॅक)",
    hi: "विम बर्तन धोने का साबुन (3 का पैक)",
    en: "Vim Dishwash Bar (Pack of 3)"
  },
  "Lizol Surface Cleaner (Citrus) 1L": {
    mr: "लायझोल फरशी क्लिनर (सिट्रस) १ लि",
    hi: "लाइज़ोल फ्लोर क्लीनर (सिट्रस) 1 ली",
    en: "Lizol Surface Cleaner (Citrus) 1L"
  },
  "Harpic Power Plus Toilet Cleaner 1L": {
    mr: "हार्पिक पॉवर प्लस टॉयलेट क्लिनर १ लि",
    hi: "हार्पिक पावर प्लस टॉयलेट क्लीनर 1 ली",
    en: "Harpic Power Plus Toilet Cleaner 1L"
  },
  "Scotch-Brite Scrub Pad (Pack of 3)": {
    mr: "स्कॉच-ब्राईट स्क्रब पॅड (३ चा पॅक)",
    hi: "स्कॉच-ब्राइट स्क्रब पैड (3 का पैक)",
    en: "Scotch-Brite Scrub Pad (Pack of 3)"
  }
};

// ===================== CATEGORY TRANSLATIONS =====================
export const CATEGORY_TRANSLATIONS = {
  "Grains & Pulses": { mr: "धान्य आणि डाळी", hi: "अनाज और दालें", en: "Grains & Pulses" },
  "Spices & Masala": { mr: "मसाले", hi: "मसाले", en: "Spices & Masala" },
  "Edible Oils & Ghee": { mr: "खाद्यतेल आणि तूप", hi: "खाद्य तेल और घी", en: "Edible Oils & Ghee" },
  "Snacks & Biscuits": { mr: "स्नॅक्स आणि बिस्किटे", hi: "नाश्ता और बिस्कुट", en: "Snacks & Biscuits" },
  "Beverages": { mr: "पेये आणि चहा-कॉफी", hi: "पेय पदार्थ", en: "Beverages" },
  "Personal Care": { mr: "पर्सनल केअर", hi: "पर्सनल केयर", en: "Personal Care" },
  "Cleaning Supplies": { mr: "स्वच्छता साहित्य", hi: "सफाई सामग्री", en: "Cleaning Supplies" },
  "Dry Fruits": { mr: "सुका मेवा", hi: "सूखे मेवे", en: "Dry Fruits" },
  "Dairy Products": { mr: "दुग्धजन्य पदार्थ", hi: "डेयरी उत्पाद", en: "Dairy Products" },
  "Grocery": { mr: "किराणा", hi: "किराना", en: "Grocery" },
  "Dairy": { mr: "डेअरी", hi: "डेयरी", en: "Dairy" },
  "Snacks": { mr: "स्नॅक्स", hi: "नाश्ता", en: "Snacks" },
  "Cleaning": { mr: "स्वच्छता", hi: "सफाई", en: "Cleaning" },
  "General": { mr: "इतर", hi: "सामान्य", en: "General" },
  "All": { mr: "सर्व", hi: "सभी", en: "All" }
};

// ===================== UNIT TRANSLATIONS =====================
export const UNIT_TRANSLATIONS = {
  "Kilogram (kg)": { mr: "किलोग्रॅम (किग्रॅ)", hi: "किलोग्राम (किग्रा)", en: "Kilogram (kg)" },
  "kg": { mr: "किग्रॅ", hi: "किग्रा", en: "kg" },
  "KG": { mr: "किग्रॅ", hi: "किग्रा", en: "KG" },
  "Gram (g)": { mr: "ग्रॅम (ग्रॅ)", hi: "ग्राम (ग्रा)", en: "Gram (g)" },
  "g": { mr: "ग्रॅ", hi: "ग्रा", en: "g" },
  "gm": { mr: "ग्रॅ", hi: "ग्रा", en: "gm" },
  "GM": { mr: "ग्रॅ", hi: "ग्रा", en: "GM" },
  "Liter (L)": { mr: "लिटर (लि)", hi: "लीटर (ली)", en: "Liter (L)" },
  "L": { mr: "लि", hi: "ली", en: "L" },
  "LTR": { mr: "लि", hi: "ली", en: "LTR" },
  "ml": { mr: "मिली", hi: "मिली", en: "ml" },
  "ML": { mr: "मिली", hi: "मिली", en: "ML" },
  "Piece (pc)": { mr: "नग", hi: "पीस", en: "Piece (pc)" },
  "pc": { mr: "नग", hi: "पीस", en: "pc" },
  "PC": { mr: "नग", hi: "पीस", en: "PC" },
  "1 PC": { mr: "१ नग", hi: "1 पीस", en: "1 PC" },
  "Pack": { mr: "पॅक", hi: "पैक", en: "Pack" },
  "Box": { mr: "खोका", hi: "डिब्बा", en: "Box" }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('app_language') || 'mr'; // Default Marathi
  });

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('app_language', lang);
  };

  const t = (key) => {
    if (!key) return '';
    const langDict = translations[language] || translations.en;
    if (langDict && langDict[key] !== undefined) {
      return langDict[key];
    }
    // Fallback to English
    if (translations.en && translations.en[key] !== undefined) {
      return translations.en[key];
    }
    return key;
  };

  // Helper for pure product translation across the app
  const tProduct = (name) => {
    if (!name) return '';
    if (language === 'en') return name;

    // 1. Direct match
    if (PRODUCT_TRANSLATIONS[name] && PRODUCT_TRANSLATIONS[name][language]) {
      return PRODUCT_TRANSLATIONS[name][language];
    }

    // 2. Normalized trim match
    const clean = name.trim();
    for (const [key, val] of Object.entries(PRODUCT_TRANSLATIONS)) {
      if (key.toLowerCase() === clean.toLowerCase() && val[language]) {
        return val[language];
      }
    }

    // 3. Fallback: replace common unit phrases if present
    let translated = name;
    if (language === 'mr') {
      translated = translated
        .replace(/\b(\d+)\s*kg\b/gi, '$1 किग्रॅ')
        .replace(/\b(\d+)\s*g\b/gi, '$1 ग्रॅ')
        .replace(/\b(\d+)\s*gm\b/gi, '$1 ग्रॅ')
        .replace(/\b(\d+)\s*L\b/gi, '$1 लि')
        .replace(/\b(\d+)\s*ml\b/gi, '$1 मिली')
        .replace(/Pack of (\d+)/gi, '$1 चा पॅक')
        .replace(/\(Large\)/gi, '(मोठे)')
        .replace(/\(Small\)/gi, '(लहान)');
    } else if (language === 'hi') {
      translated = translated
        .replace(/\b(\d+)\s*kg\b/gi, '$1 किग्रा')
        .replace(/\b(\d+)\s*g\b/gi, '$1 ग्रा')
        .replace(/\b(\d+)\s*gm\b/gi, '$1 ग्रा')
        .replace(/\b(\d+)\s*L\b/gi, '$1 ली')
        .replace(/\b(\d+)\s*ml\b/gi, '$1 मिली')
        .replace(/Pack of (\d+)/gi, '$1 का पैक')
        .replace(/\(Large\)/gi, '(बड़ा)')
        .replace(/\(Small\)/gi, '(छोटा)');
    }

    return translated;
  };

  // Helper for category translation
  const tCategory = (name) => {
    if (!name) return '';
    if (CATEGORY_TRANSLATIONS[name] && CATEGORY_TRANSLATIONS[name][language]) {
      return CATEGORY_TRANSLATIONS[name][language];
    }
    const key = `cat_${name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
    const directT = t(key);
    if (directT && directT !== key) return directT;
    return name;
  };

  // Helper for unit translation
  const tUnit = (unit) => {
    if (!unit) return '';
    if (UNIT_TRANSLATIONS[unit] && UNIT_TRANSLATIONS[unit][language]) {
      return UNIT_TRANSLATIONS[unit][language];
    }
    const clean = unit.trim();
    if (UNIT_TRANSLATIONS[clean] && UNIT_TRANSLATIONS[clean][language]) {
      return UNIT_TRANSLATIONS[clean][language];
    }
    return unit;
  };

  // Helper for notification translation (translates title, message & product names dynamically)
  const tNotification = (notif) => {
    if (!notif) return { title: '', message: '' };
    if (language === 'en') return { title: notif.title, message: notif.message };

    let title = notif.title;
    let message = notif.message;

    // Title mapping
    const TITLE_MAP = {
      'Low Stock Alert': { mr: 'कमी साठा सूचना', hi: 'कम स्टॉक अलर्ट' },
      'Out of Stock!': { mr: 'साठा संपला!', hi: 'स्टॉक समाप्त!' },
      'High Khata Due': { mr: 'मोठी उधारी बाकी', hi: 'बड़ी उधारी बकाया' },
      'Plan Expiring Soon': { mr: 'प्लॅन लवकरच संपत आहे', hi: 'प्लान जल्द समाप्त होगा' }
    };

    if (TITLE_MAP[notif.title] && TITLE_MAP[notif.title][language]) {
      title = TITLE_MAP[notif.title][language];
    }

    // Message pattern 1: Low stock
    // e.g. "'Product' has only 5 units left in batch B-1." or "'Product' has only 5 units left."
    const lowMatch = message.match(/'([^']+)'\s+has only\s+(\d+(?:\.\d+)?)\s+units left(?:\s+in batch\s+([^.]+))?\.?/i);
    if (lowMatch) {
      const pName = tProduct(lowMatch[1]);
      const qty = lowMatch[2];
      const batch = lowMatch[3];
      if (language === 'mr') {
        message = batch 
          ? `'${pName}' चा साठा बॅच ${batch} मध्ये फक्त ${qty} शिल्लक आहे.`
          : `'${pName}' चा साठा फक्त ${qty} शिल्लक आहे.`;
      } else if (language === 'hi') {
        message = batch 
          ? `'${pName}' का स्टॉक बैच ${batch} में केवल ${qty} यूनिट बचा है।`
          : `'${pName}' का स्टॉक केवल ${qty} यूनिट बचा है।`;
      }
      return { title, message };
    }

    // Message pattern 2: Out of stock
    // e.g. "'Aashirvaad Atta (5kg)' is completely out of stock (0 remaining)."
    const outMatch = message.match(/'([^']+)'\s+is completely out of stock/i);
    if (outMatch) {
      const pName = tProduct(outMatch[1]);
      if (language === 'mr') {
        message = `'${pName}' चा पूर्ण साठा संपला आहे (० शिल्लक).`;
      } else if (language === 'hi') {
        message = `'${pName}' का पूरा स्टॉक समाप्त हो चुका है (0 शेष)।`;
      }
      return { title, message };
    }

    // Message pattern 3: Khata Due
    // e.g. "Customer 'Ramesh' has pending due of ₹5000. Please collect payment."
    const dueMatch = message.match(/Customer\s+'([^']+)'\s+has pending due of\s+₹?(\d+)/i);
    if (dueMatch) {
      const cName = dueMatch[1];
      const amt = dueMatch[2];
      if (language === 'mr') {
        message = `ग्राहक '${cName}' यांची ₹${amt} उधारी बाकी आहे. कृपया वसुली करा.`;
      } else if (language === 'hi') {
        message = `ग्राहक '${cName}' की ₹${amt} उधारी बकाया है। कृपया भुगतान प्राप्त करें।`;
      }
      return { title, message };
    }

    // Message pattern 4: Subscription expiry
    // e.g. "Your Dukaan360 subscription will expire in 3 day(s). Renew to avoid disruption."
    const subMatch = message.match(/subscription will expire in\s+(\d+)\s+day/i);
    if (subMatch) {
      const days = subMatch[1];
      if (language === 'mr') {
        message = `तुमचा Dukaan360 सबस्क्रिप्शन प्लॅन ${days} दिवसांत संपणार आहे. कृपया रिन्यू करा.`;
      } else if (language === 'hi') {
        message = `आपका Dukaan360 सब्सक्रिप्शन ${days} दिनों में समाप्त होगा। कृपया रीन्यू करें।`;
      }
      return { title, message };
    }

    // Fallback: translate any product name in quotes if present
    message = message.replace(/'([^']+)'/g, (match, pName) => `'${tProduct(pName)}'`);

    return { title, message };
  };

  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage: changeLanguage, 
      t, 
      tProduct, 
      tCategory, 
      tUnit, 
      tNotification,
      supportedLanguages: SUPPORTED_LANGUAGES 
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

