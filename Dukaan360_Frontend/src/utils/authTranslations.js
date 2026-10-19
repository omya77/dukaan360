// Complete 3-Language Dictionary for Login, Register, and Renew Pages
// Languages: 'mr' (मराठी), 'hi' (हिंदी), 'en' (English)

export const AUTH_TRANSLATIONS = {
  mr: {
    // ================= LOGIN PAGE =================
    login: {
      brand_title: "Dukaan360",
      brand_subtitle: "किराणा व रिटेल POS",
      brand_quote_1: "तुमचा व्यवसाय व्यवस्थापित करा",
      brand_quote_highlight: "सहज आणि स्मार्टपणे.",
      brand_subquote: "भारतातील सर्वात सोपा व जलद बिलिंग, स्टॉक आणि खातेवही प्लॅटफॉर्म.",
      trusted_stores: "५००+ पेक्षा जास्त दुकानांचा विश्वास",
      welcome_back: "पुन्हा स्वागत आहे",
      welcome_sub: "दुकानात प्रवेश करण्यासाठी युझरनेम किंवा मोबाईल नंबर टाका.",
      cloud_badge: "क्लाउड",
      username_label: "युझरनेम / मोबाईल नंबर",
      username_placeholder: "युझरनेम किंवा मोबाईल नंबर टाका...",
      password_label: "पासवर्ड (Password)",
      password_placeholder: "आपला गुप्त पासवर्ड टाका",
      forgot_password: "पासवर्ड विसरलात?",
      login_btn: "प्रवेश करा (Login Store) →",
      logging_in: "लॉगिन होत आहे...",
      new_store_prompt: "नवीन दुकान आहे का?",
      register_now: "नवीन दुकान नोंदणी करा (Register) →",
      
      // Alerts & Errors
      pending_approval: "तुमचे स्टोअर सध्या ॲडमिन मंजुरीच्या प्रतीक्षेत आहे.",
      trial_expired: "तुमचा १ महिन्याचा मोफत ट्रायल संपला आहे. नूतनीकरण (Renew) पेजवर नेत आहोत...",
      account_rejected: "तुमची स्टोअर नोंदणी ॲडमिनकडून नाकारली गेली आहे.",
      login_failed: "लॉगिन अयशस्वी. कृपया युझरनेम व पासवर्ड तपासा.",
      renew_btn_text: "💳 प्लॅन्स पहा व नूतनीकरण करा (Renew Now) →",
      
      // Forgot Password Modal
      forgot_modal_title: "पासवर्ड रीसेट करा",
      forgot_step1_sub: "ईमेलवर OTP मिळवण्यासाठी तुमचे युझरनेम टाका",
      send_otp_btn: "OTP पाठवा",
      sending_otp: "OTP पाठवत आहे...",
      otp_label: "६-अंकी OTP कोड",
      otp_placeholder: "• • • • • •",
      new_pass_label: "नवीन पासवर्ड (New Password)",
      new_pass_placeholder: "किमान ४ अक्षरे / आकडे",
      reset_pass_btn: "नवीन पासवर्ड सेट करा",
      resetting_pass: "बदलत आहे...",
      back_to_username: "← मागे जा (Change Username)",
      otp_sent_to: "नोंदणीकृत ईमेलवर OTP पाठवला आहे:",
      pass_reset_success: "पासवर्ड यशस्वीरीत्या बदलला आहे!",
      marquee_row1: [
        { icon: "⚡", text: "सुपरफास्ट १-क्लिक बिलिंग" },
        { icon: "📊", text: "दैनिक नफा व विक्री रिपोर्ट" },
        { icon: "📦", text: "बारकोड स्कॅनिंग व इन्व्हेंटरी" },
        { icon: "📱", text: "WhatsApp बिल शेअरिंग" }
      ],
      marquee_row2: [
        { icon: "☁️", text: "१००% ऑटो क्लाउड बॅकअप" },
        { icon: "👥", text: "ग्राहक खातेवही व उधारी अलर्ट" },
        { icon: "🖨️", text: "सर्व थर्मल प्रिंटर सपोर्ट" },
        { icon: "🔒", text: "बँक-ग्रेड डेटा सुरक्षा" }
      ],
      stat_stores: "५००+ दुकाने",
      stat_speed: "०.२ सेकंदात बिल",
      stat_rating: "४.९/५ रेटिंग"
    },

    // ================= REGISTER PAGE =================
    register: {
      create_account: "नवीन खाते तयार करा",
      photo: "फोटो",
      store_name: "दुकानाचे नाव (Store Name)",
      store_name_placeholder: "उदा. साई सुपर मार्केट",
      owner_name: "मालकाचे नाव (Owner Name)",
      owner_name_placeholder: "उदा. राहुल शर्मा",
      mobile: "मोबाईल नंबर (Mobile Number)",
      mobile_placeholder: "१०-अंकी मोबाईल",
      email: "ईमेल (Email)",
      email_placeholder: "उदा. store@gmail.com",
      email_otp_badge: "OTP साठी",
      password: "पासवर्ड (Password)",
      password_placeholder: "किमान ६ अक्षरे",
      plan_label: "सबस्क्रिप्शन प्लॅन (Subscription Plan)",
      free_tag: "१००% मोफत",
      free_plan_display: "१ महिना मोफत ट्रायल (Free Trial)",
      free_price: "₹० (मोफत)",
      address: "दुकानाचा संपूर्ण पत्ता (Shop Address)",
      address_placeholder: "दुकानाचा संपूर्ण पत्ता (पिनकोडसह)...",
      register_btn: "नोंदणी करा (Register Business) →",
      submitting: "नोंदणी होत आहे...",
      already_registered: "आधीच नोंदणी झाली आहे?",
      sign_in_instead: "येथे लॉगिन करा",

      // Right Side Box: Trial details
      right_brand_sub: "किराणा व रिटेल POS",
      right_title: "१ महिना मोफत ट्रायल",
      right_badge: "३० दिवस मोफत",
      right_desc: "नोंदणी करा आणि ३० दिवस Dukaan360 चे सर्व प्रगत फीचर्स विनामूल्य अनुभवा.",
      trial_features_title: "३० दिवसांच्या मोफत ट्रायलमध्ये काय काय मिळेल?",
      features: [
        { icon: "⚡", title: "सुपरफास्ट POS बिलिंग", desc: "बारकोड व थर्मल प्रिंट" },
        { icon: "📱", title: "WhatsApp बिलिंग", desc: "ग्राहकांना थेट बिल व उधारी अलर्ट" },
        { icon: "📦", title: "इन्व्हेंटरी मॅनेजमेंट", desc: "कमी स्टॉक व अलर्ट सूचना" },
        { icon: "📊", title: "दैनिक नफा अहवाल", desc: "एकूण विक्री व नफा विश्लेषण" }
      ],
      after_trial_title: "३० दिवसांनंतर काय?",
      step1_title: "डेटा १००% सुरक्षित",
      step1_desc: "सर्व बिले, स्टॉक व उधारी रेकॉर्ड्स कायम सुरक्षित राहतील.",
      step2_title: "परवडणारे प्लॅन्स",
      step2_desc: "फक्त ₹१३/दिवस (₹३९९/महिना) पासून, कधीही सुरू करा.",
      step3_title: "झटपट UPI ॲक्टिव्हेशन",
      step3_desc: "QR कोड स्कॅन करून ५ मिनिटांत सेवा सुरू.",
      support_text: "मदत हवी असल्यास संपर्क:",
      support_phone: "8262802961",
      badge_no_setup: "कोणतीही सेटअप फी नाही",
      badge_no_cc: "क्रेडिट कार्ड लागत नाही",
      badge_cloud_safe: "१००% ऑटो क्लाउड बॅकअप",

      // Success View
      success_title: "नोंदणी अर्ज यशस्वीरीत्या पाठवला!",
      success_desc: "तुमची स्टोअर नोंदणी ॲडमिन मंजुरीच्या प्रतीक्षेत आहे. पडताळणी पूर्ण होताच तुमचे खाते लवकरच सक्रिय केले जाईल.",
      return_to_login: "लॉगिन वर परत जा"
    },

    // ================= RENEW PAGE =================
    renew: {
      brand_title: "Dukaan360",
      brand_sub: "सबस्क्रिप्शन नूतनीकरण (Renewal)",
      help_btn: "मदत / प्रश्न",
      login_btn: "लॉगिन",
      trial_ended_title: "ट्रायल कालावधी समाप्त:",
      trial_ended_desc: "तुमचा जुना डेटा (बिले, स्टॉक, उधारी) १००% सुरक्षित आहे. अखंड बिलिंग सुरू ठेवण्यासाठी खाली दुकान निवडून प्लॅन निवडा.",
      
      step1_title: "पायरी १: दुकान शोधा (Search Store)",
      step1_verified: "दुकान सत्यापित",
      search_placeholder: "दुकानाचे नाव किंवा मोबाईल नंबर टाका (उदा. Matoshree)...",
      search_btn: "शोधा",
      searching: "शोधत आहे...",
      found_stores: "सापडलेली दुकाने (निवडण्यासाठी क्लिक करा):",
      select_btn: "निवडा →",
      verified_tag: "सत्यापित ✓",
      change_store: "बदला ✕",
      search_error: "या नावाने दुकान सापडले नाही. अचूक नाव किंवा मोबाईल नंबर टाका.",

      step2_title: "पायरी २: व्हॅल्यू सबस्क्रिप्शन प्लॅन निवडा (Choose Plan)",
      plans: [
        { 
          id: 'Starter', 
          name: '🥉 Starter', 
          sub: 'Billing + Stock + Udhari', 
          tag: 'सुरुवात', 
          price: 399, 
          original: 499, 
          discount: '२०% सूट', 
          duration: '३० दिवस वैधता', 
          perDay: '₹१३ / दिवस',
          features: 'बारकोड बिलिंग + स्टॉक + बेसिक उधारी'
        },
        { 
          id: 'Business', 
          name: '🥈 Business', 
          sub: 'नफा व उधारी वसुली', 
          tag: 'सर्वात लोकप्रिय 🔥', 
          price: 799, 
          original: 999, 
          discount: '₹२०० बचत', 
          duration: '३० दिवस वैधता', 
          perDay: '₹२६ / दिवस', 
          popular: true,
          features: 'सर्व Starter + WhatsApp बिल + खर्च व नफा + Expiry अलर्ट + रिपोर्ट्स'
        },
        { 
          id: 'Pro', 
          name: '🥇 Dukaan360 Pro', 
          sub: 'Smart Assistant', 
          tag: 'संपूर्ण नियंत्रण 👑', 
          price: 1299, 
          original: 1699, 
          discount: '₹४०० बचत', 
          duration: '३० दिवस वैधता', 
          perDay: '₹४३ / दिवस',
          features: 'सर्व Business + कर्मचारी ट्रॅकिंग + लॉयल्टी सिस्टीम + AI इनसाइट्स + क्लाउड बॅकअप'
        },
        { 
          id: 'Business Annual', 
          name: '🌟 Business वार्षिक', 
          sub: '२ महिने मोफत!', 
          tag: '२ महिने मोफत 🎁', 
          price: 7990, 
          original: 9588, 
          discount: '₹१,६०० बचत', 
          duration: '३६५ दिवस अखंड', 
          perDay: '₹२१ / दिवस (₹६६५/महिना)', 
          bestValue: true,
          features: 'सर्व Business फीचर्स वर्षभर + २ महिने मोफत'
        }
      ],

      guide_title: "पेमेंट मार्गदर्शक: काय करावे व काय करू नये (Do's & Don'ts)",
      activation_time: "५ मिनिटांत सक्रिय",
      dos_title: "✅ पेमेंट झाल्यावर काय करावे:",
      dos_item1: "पेमेंट झाल्यावर UTR / Ref No. असलेला स्पष्ट स्क्रीनशॉट घ्या.",
      dos_item2: "उजव्या बाजूच्या 'WhatsApp वर पाठवा' बटणावर क्लिक करा.",
      dos_item3: "स्क्रीनशॉट पाठवताच ॲडमिन ५ मिनिटांत खाते पुन्हा सुरू करेल.",

      donts_title: "❌ काय करू नये (महत्त्वाची काळजी):",
      donts_item1: "घाबरू नका! तुमचा जुना डेटा (बिले, स्टॉक, उधारी) १००% सुरक्षित आहे.",
      donts_item2: "फक्त स्क्रीनवरील QR किंवा अधिकृत UPI वरच पे करा.",
      donts_item3: "पेमेंट झाल्यावर पुन्हा पैसे पाठवू नका; अडचण असल्यास कॉल करा.",

      trust_activation: "५ मिनिटांत ॲक्टिव्हेशन",
      trust_cloud: "सुरक्षित क्लाउड डेटा",
      trust_printer: "सर्व प्रिंटर सपोर्ट",
      trust_support: "थेट ग्राहक सपोर्ट",

      step3_title: "पायरी ३: थेट UPI पेमेंट",
      total_label: "एकूण:",
      accepted_here: "Accepted Here",
      click_to_enlarge: "मोठे पहा",
      merchant_name: "Mr Omkar bandu Misal",
      official_upi_label: "अधिकृत UPI ID:",
      copy_btn: "Copy",
      copied_btn: "कॉपी झाले!",
      store_name_lbl: "दुकान नाव:",
      owner_mobile_lbl: "मालक / मोबाईल:",
      select_store_warning: "⚠️ डाव्या बाजूला तुमचे दुकान शोधा व निवडा.",
      whatsapp_btn: "WhatsApp वर स्क्रीनशॉट पाठवा",
      whatsapp_note: "⚡ पेमेंट स्क्रीनशॉट पाठवताच ॲडमिन ५ मिनिटांत तुमचे सर्व फीचर्स अनलॉक करेल!",
      support_query: "काही अडचण किंवा शंका?",
      call_btn: "कॉल:",

      // Modals
      faq_title: "नेहमी विचारले जाणारे प्रश्न (FAQs)",
      faq1_q: "१. माझा जुना डेटा सुरक्षित राहील का?",
      faq1_a: "हो! तुमचा सर्व जुना डेटा (बिले, ग्राहक यादी, उधारी व स्टॉक) सुरक्षित क्लाउडवर सेव्ह आहे. खाते नूतनीकरण होताच सर्व काही पूर्वीसारखे सुरू होईल.",
      faq2_q: "२. पेमेंट केल्यानंतर खाते किती वेळात सुरू होते?",
      faq2_a: "PhonePe / GPay वरून पेमेंट करून WhatsApp वर स्क्रीनशॉट पाठवताच ॲडमिन ५ मिनिटांत तुमचे खाते पुन्हा सक्रिय करेल.",
      faq3_q: "३. दुसऱ्या कोणत्याही UPI ॲपवरून पेमेंट करू शकतो का?",
      faq3_a: "हो, PhonePe, Google Pay, Paytm, BHIM किंवा कोणत्याही बँकेच्या UPI ॲपवरून स्क्रीनवरील QR कोड स्कॅन करून पैसे पाठवू शकता.",
      modal_close: "समजले (Close)",

      qr_modal_title: "PhonePe Merchant QR",
      qr_name_lbl: "नाव:",
      qr_close: "बंद करा (Close)"
    }
  },

  // ===================== HINDI =====================
  hi: {
    // ================= LOGIN PAGE =================
    login: {
      brand_title: "Dukaan360",
      brand_subtitle: "किराना और रिटेल POS",
      brand_quote_1: "अपना रिटेल व्यापार संभालें",
      brand_quote_highlight: "आसानी और स्मार्ट तरीके से.",
      brand_subquote: "भारत का सबसे सरल और तेज़ बिलिंग, स्टॉक और बहीखाता प्लेटफ़ॉर्म।",
      trusted_stores: "500+ से अधिक दुकानों का भरोसा",
      welcome_back: "वापसी पर स्वागत है",
      welcome_sub: "दुकान में प्रवेश करने के लिए यूज़रनेम या मोबाइल नंबर दर्ज करें।",
      cloud_badge: "क्लाउड",
      username_label: "यूज़रनेम / मोबाइल नंबर",
      username_placeholder: "यूज़रनेम या मोबाइल नंबर दर्ज करें...",
      password_label: "पासवर्ड (Password)",
      password_placeholder: "अपना गुप्त पासवर्ड दर्ज करें",
      forgot_password: "पासवर्ड भूल गए?",
      login_btn: "प्रवेश करें (Login Store) →",
      logging_in: "लॉगिन हो रहा है...",
      new_store_prompt: "नई दुकान है?",
      register_now: "नई दुकान रजिस्टर करें (Register) →",
      
      // Alerts & Errors
      pending_approval: "आपकी दुकान अभी एडमिन मंज़ूरी की प्रतीक्षा में है।",
      trial_expired: "आपका 1 महीने का मुफ़्त ट्रायल समाप्त हो चुका है। नवीनीकरण (Renew) पेज पर ले जाया जा रहा है...",
      account_rejected: "आपकी दुकान का पंजीकरण एडमिन द्वारा अस्वीकार कर दिया गया है।",
      login_failed: "लॉगिन असफल। कृपया यूज़रनेम और पासवर्ड जांचें।",
      renew_btn_text: "💳 प्लान्स देखें और नवीनीकरण करें (Renew Now) →",
      
      // Forgot Password Modal
      forgot_modal_title: "पासवर्ड रीसेट करें",
      forgot_step1_sub: "ईमेल पर OTP पाने के लिए अपना यूज़रनेम दर्ज करें",
      send_otp_btn: "OTP भेजें",
      sending_otp: "OTP भेजा जा रहा है...",
      otp_label: "6-अंकों का OTP कोड",
      otp_placeholder: "• • • • • •",
      new_pass_label: "नया पासवर्ड (New Password)",
      new_pass_placeholder: "कम से कम 4 अक्षर / अंक",
      reset_pass_btn: "नया पासवर्ड सेट करें",
      resetting_pass: "बदला जा रहा है...",
      back_to_username: "← पीछे जाएं (Change Username)",
      otp_sent_to: "पंजीकृत ईमेल पर OTP भेजा गया है:",
      pass_reset_success: "पासवर्ड सफलतापूर्वक बदल दिया गया है!",
      marquee_row1: [
        { icon: "⚡", text: "सुपरफास्ट 1-क्लिक बिलिंग" },
        { icon: "📊", text: "दैनिक बिक्री व मुनाफ़ा रिपोर्ट" },
        { icon: "📦", text: "बारकोड स्कैनिंग व इन्वेंट्री" },
        { icon: "📱", text: "WhatsApp बिल शेयरिंग" }
      ],
      marquee_row2: [
        { icon: "☁️", text: "100% ऑटो क्लाउड बैकअप" },
        { icon: "👥", text: "ग्राहक बहीखाता व उधारी अलर्ट" },
        { icon: "🖨️", text: "सभी थर्मल प्रिंटर सपोर्ट" },
        { icon: "🔒", text: "बैंक-ग्रेड डेटा सुरक्षा" }
      ],
      stat_stores: "500+ दुकानें",
      stat_speed: "0.2 सेकंड में बिल",
      stat_rating: "4.9/5 रेटिंग"
    },

    // ================= REGISTER PAGE =================
    register: {
      create_account: "नया खाता बनाएं",
      photo: "फ़ोटो",
      store_name: "दुकान का नाम (Store Name)",
      store_name_placeholder: "उदा. साई सुपर मार्केट",
      owner_name: "मालिक का नाम (Owner Name)",
      owner_name_placeholder: "उदा. राहुल शर्मा",
      mobile: "मोबाइल नंबर (Mobile Number)",
      mobile_placeholder: "10-अंकों का मोबाइल",
      email: "ईमेल (Email)",
      email_placeholder: "उदा. store@gmail.com",
      email_otp_badge: "OTP के लिए",
      password: "पासवर्ड (Password)",
      password_placeholder: "कम से कम 6 अक्षर",
      plan_label: "सब्सक्रिप्शन प्लान (Subscription Plan)",
      free_tag: "100% मुफ़्त",
      free_plan_display: "1 महीना मुफ़्त ट्रायल (Free Trial)",
      free_price: "₹0 (मुफ़्त)",
      address: "दुकान का पूरा पता (Shop Address)",
      address_placeholder: "दुकान का पूरा पता (पिनकोड सहित)...",
      register_btn: "पंजीकरण करें (Register Business) →",
      submitting: "पंजीकरण हो रहा है...",
      already_registered: "पहले से खाता है?",
      sign_in_instead: "यहाँ लॉगिन करें",

      // Right Side Box: Trial details
      right_brand_sub: "किराना और रिटेल POS",
      right_title: "1 महीना मुफ़्त ट्रायल",
      right_badge: "30 दिन मुफ़्त",
      right_desc: "रजिस्टर करें और 30 दिन Dukaan360 के सभी उन्नत फ़ीचर्स विनामूल्य अनुभव करें।",
      trial_features_title: "30 दिनों के मुफ़्त ट्रायल में क्या-क्या मिलेगा?",
      features: [
        { icon: "⚡", title: "सुपरफास्ट POS बिलिंग", desc: "बारकोड व थर्मल प्रिंट" },
        { icon: "📱", title: "WhatsApp बिलिंग", desc: "ग्राहकों को तुरंत बिल व उधारी अलर्ट" },
        { icon: "📦", title: "इन्वेंट्री मैनेजमेंट", desc: "कम स्टॉक व अलर्ट सूचना" },
        { icon: "📊", title: "दैनिक लाभ रिपोर्ट", desc: "कुल बिक्री व मुनाफा विश्लेषण" }
      ],
      after_trial_title: "30 दिनों के बाद क्या?",
      step1_title: "डेटा 100% सुरक्षित",
      step1_desc: "सभी बिल, स्टॉक और उधारी रिकॉर्ड हमेशा सुरक्षित रहेंगे।",
      step2_title: "किफायती प्लान्स",
      step2_desc: "सिर्फ ₹13/दिन (₹399/महीना) से, कभी भी शुरू करें।",
      step3_title: "त्वरित UPI एक्टिवेशन",
      step3_desc: "QR कोड स्कैन करके 5 मिनट में सर्विस अनलॉक।",
      support_text: "सहायता चाहिए तो संपर्क करें:",
      support_phone: "8262802961",
      badge_no_setup: "कोई सेटअप शुल्क नहीं",
      badge_no_cc: "क्रेडिट कार्ड की आवश्यकता नहीं",
      badge_cloud_safe: "100% ऑटो क्लाउड बैकअप",

      // Success View
      success_title: "पंजीकरण आवेदन सफलतापूर्वक भेजा गया!",
      success_desc: "आपकी दुकान का पंजीकरण एडमिन मंज़ूरी की प्रतीक्षा में है। सत्यापन पूर्ण होते ही खाता सक्रिय कर दिया जाएगा।",
      return_to_login: "लॉगिन पर वापस जाएं"
    },

    // ================= RENEW PAGE =================
    renew: {
      brand_title: "Dukaan360",
      brand_sub: "सब्सक्रिप्शन नवीनीकरण (Renewal)",
      help_btn: "मदद / प्रश्न",
      login_btn: "लॉगिन",
      trial_ended_title: "ट्रायल अवधि समाप्त:",
      trial_ended_desc: "आपका पुराना डेटा (बिल, स्टॉक, उधारी) 100% सुरक्षित है। निरंतर बिलिंग जारी रखने के लिए नीचे दुकान चुनकर प्लान चुनें।",
      
      step1_title: "चरण 1: दुकान खोजें (Search Store)",
      step1_verified: "दुकान सत्यापित",
      search_placeholder: "दुकान का नाम या मोबाइल नंबर दर्ज करें (उदा. Matoshree)...",
      search_btn: "खोजें",
      searching: "खोज रहे हैं...",
      found_stores: "मिली हुई दुकानें (चुनने के लिए क्लिक करें):",
      select_btn: "चुनें →",
      verified_tag: "सत्यापित ✓",
      change_store: "बदलें ✕",
      search_error: "इस नाम से दुकान नहीं मिली। कृपया सही नाम या मोबाइल नंबर दर्ज करें।",

      step2_title: "चरण 2: वैल्यू सब्सक्रिप्शन प्लान चुनें (Choose Plan)",
      plans: [
        { 
          id: 'Starter', 
          name: '🥉 Starter', 
          sub: 'Billing + Stock + Udhari', 
          tag: 'शुरुआत', 
          price: 399, 
          original: 499, 
          discount: '20% छूट', 
          duration: '30 दिन वैधता', 
          perDay: '₹13 / दिन',
          features: 'बारकोड बिलिंग + स्टॉक + बेसिक उधारी'
        },
        { 
          id: 'Business', 
          name: '🥈 Business', 
          sub: 'मुनाफा व उधारी वसूली', 
          tag: 'सबसे लोकप्रिय 🔥', 
          price: 799, 
          original: 999, 
          discount: '₹200 बचत', 
          duration: '30 दिन वैधता', 
          perDay: '₹26 / दिन', 
          popular: true,
          features: 'सभी Starter + WhatsApp बिल + खर्च व मुनाफा + Expiry अलर्ट + रिपोर्ट्स'
        },
        { 
          id: 'Pro', 
          name: '🥇 Dukaan360 Pro', 
          sub: 'Smart Assistant', 
          tag: 'संपूर्ण नियंत्रण 👑', 
          price: 1299, 
          original: 1699, 
          discount: '₹400 बचत', 
          duration: '30 दिन वैधता', 
          perDay: '₹43 / दिन',
          features: 'सभी Business + कर्मचारी ट्रैकिंग + लॉयल्टी सिस्टम + AI इनसाइट्स + क्लाउड बैकअप'
        },
        { 
          id: 'Business Annual', 
          name: '🌟 Business वार्षिक', 
          sub: '2 महीने मुफ्त!', 
          tag: '2 महीने मुफ्त 🎁', 
          price: 7990, 
          original: 9588, 
          discount: '₹1,600 बचत', 
          duration: '365 दिन अखंड', 
          perDay: '₹21 / दिन (₹665/महीना)', 
          bestValue: true,
          features: 'सभी Business फीचर्स पूरे साल + 2 महीने मुफ्त'
        }
      ],

      guide_title: "पेमेंट गाइड: क्या करें और क्या न करें (Do's & Don'ts)",
      activation_time: "5 मिनट में सक्रिय",
      dos_title: "✅ पेमेंट के बाद क्या करें:",
      dos_item1: "पेमेंट करने के बाद UTR / Ref No. दिखाई देने वाला स्पष्ट स्क्रीनशॉट लें।",
      dos_item2: "दाईं ओर दिए गए 'WhatsApp पर भेजें' बटन पर क्लिक करें।",
      dos_item3: "स्क्रीनशॉट भेजते ही एडमिन 5 मिनट में आपका खाता पुनः शुरू कर देगा।",

      donts_title: "❌ क्या न करें (सावधानी रखें):",
      donts_item1: "घबराएं नहीं! आपका पुराना डेटा (बिल, स्टॉक, उधारी) 100% सुरक्षित है।",
      donts_item2: "केवल स्क्रीन पर दिए गए QR या आधिकारिक UPI पर ही भुगतान करें।",
      donts_item3: "भुगतान होने के बाद दोबारा पैसे न भेजें; समस्या होने पर कॉल करें।",

      trust_activation: "5 मिनट में एक्टिवेशन",
      trust_cloud: "सुरक्षित क्लाउड डेटा",
      trust_printer: "सभी प्रिंटर सपोर्ट",
      trust_support: "सीधा ग्राहक सपोर्ट",

      step3_title: "चरण 3: सीधा UPI भुगतान",
      total_label: "कुल:",
      accepted_here: "Accepted Here",
      click_to_enlarge: "बड़ा देखें",
      merchant_name: "Mr Omkar bandu Misal",
      official_upi_label: "आधिकारिक UPI ID:",
      copy_btn: "Copy",
      copied_btn: "कॉपी हुआ!",
      store_name_lbl: "दुकान का नाम:",
      owner_mobile_lbl: "मालिक / मोबाइल:",
      select_store_warning: "⚠️ बाईं ओर अपनी दुकान खोजें और चुनें।",
      whatsapp_btn: "WhatsApp पर स्क्रीनशॉट भेजें",
      whatsapp_note: "⚡ पेमेंट स्क्रीनशॉट भेजते ही एडमिन 5 मिनट में आपके सभी फ़ीचर्स अनलॉक कर देगा!",
      support_query: "कोई समस्या या सवाल?",
      call_btn: "कॉल:",

      // Modals
      faq_title: "अक्सर पूछे जाने वाले सवाल (FAQs)",
      faq1_q: "1. क्या मेरा पुराना डेटा सुरक्षित रहेगा?",
      faq1_a: "हाँ! आपका सभी पुराना डेटा (बिल, ग्राहक सूची, उधारी और स्टॉक) सुरक्षित क्लाउड पर सुरक्षित है। खाता रीन्यू होते ही सब कुछ पहले जैसा शुरू हो जाएगा।",
      faq2_q: "2. पेमेंट करने के बाद खाता कितने समय में चालू होता है?",
      faq2_a: "PhonePe / GPay से पेमेंट करके WhatsApp पर स्क्रीनशॉट भेजते ही एडमिन 5 मिनट में आपका खाता पुनः सक्रिय कर देगा।",
      faq3_q: "3. क्या किसी अन्य UPI ऐप से पेमेंट कर सकते हैं?",
      faq3_a: "हाँ, PhonePe, Google Pay, Paytm, BHIM या किसी भी बैंक के UPI ऐप से स्क्रीन पर दिए गए QR कोड को स्कैन करके पैसे भेज सकते हैं।",
      modal_close: "समझ गया (Close)",

      qr_modal_title: "PhonePe Merchant QR",
      qr_name_lbl: "नाम:",
      qr_close: "बंद करें (Close)"
    }
  },

  // ===================== ENGLISH =====================
  en: {
    // ================= LOGIN PAGE =================
    login: {
      brand_title: "Dukaan360",
      brand_subtitle: "Kirana & Retail POS",
      brand_quote_1: "Manage your retail business",
      brand_quote_highlight: "effortlessly.",
      brand_subquote: "India's easiest and fastest billing, stock and ledger platform.",
      trusted_stores: "500+ stores trust Dukaan360",
      welcome_back: "Welcome Back",
      welcome_sub: "Enter your username or mobile number to access your store.",
      cloud_badge: "Cloud",
      username_label: "Username / Mobile Number",
      username_placeholder: "Enter username or mobile number...",
      password_label: "Password",
      password_placeholder: "Enter your secure password",
      forgot_password: "Forgot password?",
      login_btn: "Login Store →",
      logging_in: "Logging in...",
      new_store_prompt: "New store owner?",
      register_now: "Register New Store →",
      
      // Alerts & Errors
      pending_approval: "Your store registration is pending admin approval.",
      trial_expired: "Your 1-month free trial has ended. Redirecting to Renewal page...",
      account_rejected: "Your store registration was rejected by admin.",
      login_failed: "Login failed. Please check your username and password.",
      renew_btn_text: "💳 View Plans & Renew Now →",
      
      // Forgot Password Modal
      forgot_modal_title: "Reset Password",
      forgot_step1_sub: "Enter your username to receive OTP on email",
      send_otp_btn: "Send OTP",
      sending_otp: "Sending OTP...",
      otp_label: "6-Digit OTP Code",
      otp_placeholder: "• • • • • •",
      new_pass_label: "New Password",
      new_pass_placeholder: "At least 4 characters",
      reset_pass_btn: "Set New Password",
      resetting_pass: "Updating...",
      back_to_username: "← Go Back (Change Username)",
      otp_sent_to: "OTP sent to registered email:",
      pass_reset_success: "Password successfully updated!",
      marquee_row1: [
        { icon: "⚡", text: "Superfast 1-Click Billing" },
        { icon: "📊", text: "Daily Profit & Sales Reports" },
        { icon: "📦", text: "Barcode Scanning & Inventory" },
        { icon: "📱", text: "WhatsApp Bill Sharing" }
      ],
      marquee_row2: [
        { icon: "☁️", text: "100% Auto Cloud Backup" },
        { icon: "👥", text: "Customer Khata & Due Alerts" },
        { icon: "🖨️", text: "All Thermal Printers Supported" },
        { icon: "🔒", text: "Bank-Grade Cloud Security" }
      ],
      stat_stores: "500+ Stores",
      stat_speed: "0.2s Fast Billing",
      stat_rating: "4.9/5 Rating"
    },

    // ================= REGISTER PAGE =================
    register: {
      create_account: "Create Account",
      photo: "Photo",
      store_name: "Store Name",
      store_name_placeholder: "e.g. Sai Super Market",
      owner_name: "Owner Name",
      owner_name_placeholder: "e.g. Rahul Sharma",
      mobile: "Mobile Number",
      mobile_placeholder: "10-digit mobile number",
      email: "Email Address",
      email_placeholder: "e.g. store@gmail.com",
      email_otp_badge: "For OTP",
      password: "Password",
      password_placeholder: "At least 6 characters",
      plan_label: "Subscription Plan",
      free_tag: "100% Free",
      free_plan_display: "1 Month Free Trial",
      free_price: "₹0 (Free)",
      address: "Shop Address (For Billing)",
      address_placeholder: "Full shop address (with pincode)...",
      register_btn: "Register Business →",
      submitting: "Submitting...",
      already_registered: "Already registered?",
      sign_in_instead: "Sign In instead",

      // Right Side Box: Trial details
      right_brand_sub: "Kirana & Retail POS",
      right_title: "1 Month Free Trial",
      right_badge: "30 Days Free",
      right_desc: "Register now and experience all premium features of Dukaan360 completely free for 30 days.",
      trial_features_title: "What's Included in Your 30-Day Trial?",
      features: [
        { icon: "⚡", title: "Superfast POS Billing", desc: "Thermal print & barcode scan" },
        { icon: "📱", title: "WhatsApp Invoicing", desc: "Instant bills & credit ledger alerts" },
        { icon: "📦", title: "Inventory Management", desc: "Real-time stock & expiry alerts" },
        { icon: "📊", title: "Daily Profit Analytics", desc: "Complete sales & profit reports" }
      ],
      after_trial_title: "After Your 30-Day Trial:",
      step1_title: "100% Data Protection",
      step1_desc: "All invoices, stock & khata records stay safe forever.",
      step2_title: "Affordable Plans",
      step2_desc: "Starting from just ₹13/day (₹399/mo), no locked contracts.",
      step3_title: "Instant UPI Activation",
      step3_desc: "Scan QR code & unlock access within 5 minutes.",
      support_text: "Need setup help? Contact us:",
      support_phone: "8262802961",
      badge_no_setup: "No Setup Fees",
      badge_no_cc: "No Credit Card Required",
      badge_cloud_safe: "100% Cloud Auto-Backup",

      // Success View
      success_title: "Application Sent!",
      success_desc: "Your store registration is pending approval. Admin will verify your request and activate your account shortly.",
      return_to_login: "Return to Login"
    },

    // ================= RENEW PAGE =================
    renew: {
      brand_title: "Dukaan360",
      brand_sub: "Subscription Renewal",
      help_btn: "Help / FAQs",
      login_btn: "Login",
      trial_ended_title: "Trial Period Ended:",
      trial_ended_desc: "Your data (bills, stock, khata) is 100% safe. Select your store and choose a plan below to resume seamless billing.",
      
      step1_title: "Step 1: Search Store",
      step1_verified: "Store Verified",
      search_placeholder: "Enter store name or mobile number (e.g. Matoshree)...",
      search_btn: "Search",
      searching: "Searching...",
      found_stores: "Matching Stores (Click to select):",
      select_btn: "Select →",
      verified_tag: "Verified ✓",
      change_store: "Change ✕",
      search_error: "No store found with this name. Please enter exact store name or mobile.",

      step2_title: "Step 2: Choose Value Subscription Plan",
      plans: [
        { 
          id: 'Starter', 
          name: '🥉 Starter', 
          sub: 'Billing + Stock + Udhari', 
          tag: 'Starter', 
          price: 399, 
          original: 499, 
          discount: '20% OFF', 
          duration: '30 Days Validity', 
          perDay: '₹13 / day',
          features: 'Barcode Billing + Stock + Basic Khata'
        },
        { 
          id: 'Business', 
          name: '🥈 Business', 
          sub: 'Profit & Recovery', 
          tag: 'Most Popular 🔥', 
          price: 799, 
          original: 999, 
          discount: 'Save ₹200', 
          duration: '30 Days Validity', 
          perDay: '₹26 / day', 
          popular: true,
          features: 'All Starter + WhatsApp Bills + Expense & Profit + Expiry Alerts + Reports'
        },
        { 
          id: 'Pro', 
          name: '🥇 Dukaan360 Pro', 
          sub: 'Smart Assistant', 
          tag: 'Full Control 👑', 
          price: 1299, 
          original: 1699, 
          discount: 'Save ₹400', 
          duration: '30 Days Validity', 
          perDay: '₹43 / day',
          features: 'All Business + Staff Audit Logs + Loyalty System + AI Insights + Cloud Backup'
        },
        { 
          id: 'Business Annual', 
          name: '🌟 Business Annual', 
          sub: '2 Months Free!', 
          tag: '2 Months Free 🎁', 
          price: 7990, 
          original: 9588, 
          discount: 'Save ₹1,600', 
          duration: '365 Days Uninterrupted', 
          perDay: '₹21 / day (₹665/mo)', 
          bestValue: true,
          features: 'All Business features full year + 2 months free'
        }
      ],

      guide_title: "Payment Guide: Do's and Don'ts",
      activation_time: "Active in 5 mins",
      dos_title: "✅ What TO DO after payment:",
      dos_item1: "Take a clear screenshot showing UTR / Transaction Reference Number.",
      dos_item2: "Click the green 'Send on WhatsApp' button on the right.",
      dos_item3: "Admin will verify and reactivate your store account within 5 minutes.",

      donts_title: "❌ What NOT TO DO (Precautions):",
      donts_item1: "Don't panic! All your past records (bills, inventory, ledger) are 100% safe.",
      donts_item2: "Pay only to the official QR code or UPI shown on this screen.",
      donts_item3: "Do not make multiple duplicate payments; call support if in doubt.",

      trust_activation: "5 Min Activation",
      trust_cloud: "100% Safe Cloud Data",
      trust_printer: "All Printers Supported",
      trust_support: "Direct Phone Support",

      step3_title: "Step 3: Direct UPI Payment",
      total_label: "Total:",
      accepted_here: "Accepted Here",
      click_to_enlarge: "Click to Enlarge",
      merchant_name: "Mr Omkar bandu Misal",
      official_upi_label: "Official UPI ID:",
      copy_btn: "Copy",
      copied_btn: "Copied!",
      store_name_lbl: "Store Name:",
      owner_mobile_lbl: "Owner / Mobile:",
      select_store_warning: "⚠️ Please search and select your store on the left.",
      whatsapp_btn: "Send Screenshot on WhatsApp",
      whatsapp_note: "⚡ Upon receiving screenshot, admin unlocks all your POS features within 5 minutes!",
      support_query: "Need any help or have doubts?",
      call_btn: "Call:",

      // Modals
      faq_title: "Frequently Asked Questions (FAQs)",
      faq1_q: "1. Will my past data remain safe?",
      faq1_a: "Yes! All your past invoices, customer ledger, credit balances, and inventory remain 100% secure in the cloud. Everything resumes instantly upon renewal.",
      faq2_q: "2. How long does reactivation take after payment?",
      faq2_a: "After sending your payment screenshot with UTR on WhatsApp, our admin team verifies and reactivates your account within 5 minutes.",
      faq3_q: "3. Can I pay using any UPI app?",
      faq3_a: "Yes, you can scan and pay from PhonePe, Google Pay, Paytm, BHIM, CRED, or any banking UPI app.",
      modal_close: "Got it (Close)",

      qr_modal_title: "PhonePe Merchant QR",
      qr_name_lbl: "Name:",
      qr_close: "Close"
    }
  }
};

export const getAuthTranslations = (lang) => {
  return AUTH_TRANSLATIONS[lang] || AUTH_TRANSLATIONS.mr;
};
