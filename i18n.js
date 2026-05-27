(() => {
  const translations = {
    bn: {
      appName: "ই-বিল ক্যালকুলেটর",
      modernBilling: "আধুনিক ক্লাউড-ভিত্তিক বিলিং সিস্টেম",
      history: "ইতিহাস",
      historyPageTitle: "বিলিং ইতিহাস",
      calculator: "ক্যালকুলেটর",
      billingInformation: "বিলিং তথ্য",
      invoiceNumber: "ইনভয়েস নম্বর",
      billingDate: "বিলিং তারিখ",
      totalBill: "মোট বিল",
      shopReadings: "দোকানের রিডিং",
      addShop: "+ দোকান যোগ করুন",
      calculateBills: "বিল গণনা করুন",
      saveToCloud: "ক্লাউডে সেভ করুন",
      summary: "সারাংশ",
      totalConsumption: "মোট ব্যবহার",
      ratePerUnit: "প্রতি ইউনিট রেট",

      remove: "ডিলিট",
      previousReading: "আগের রিডিং",
      currentReading: "বর্তমান রিডিং",
      consumption: "ব্যবহার",



      invalidConsumptionValues: "অবৈধ ব্যবহার মান",
      calculateFirst: "প্রথমে ক্যালকুলেট করুন",
      savedSuccessfully: "সফলভাবে সেভ হয়েছে",
      failedToSave: "সেভ করতে ব্যর্থ",

      cloudSyncedRecords: "ক্লাউড সিঙ্কড রেকর্ড",
      exportCSV: "CSV এক্সপোর্ট",
      exportPDF: "PDF এক্সপোর্ট",
      delete: "ডিলিট",
      deleteThisRecord: "এই রেকর্ডটি ডিলিট করবেন?",

      totalBillLabel: "মোট বিল",
      totalConsumptionLabel: "মোট ব্যবহার",
      ratePerUnitLabel: "প্রতি ইউনিট রেট",

      consumptionUnits: "ইউনিট",
      billLabel: "বিল",
      previousLabel: "আগের",
      currentLabel: "বর্তমান",


      // Result / shop labels
      shopPrefix: "দোকান",

      // PDF
      electricityBillReport: "বিদ্যুৎ বিল রিপোর্ট",
      invoice: "ইনভয়েস",
      date: "তারিখ",
      totalConsumptionPDF: "মোট ব্যবহার",
      ratePerUnitPDF: "প্রতি ইউনিট রেট",

      // History load/export
      historyLoadFailed: "ইতিহাস লোড করতে ব্যর্থ",
      exportCSVFailed: "CSV এক্সপোর্টের জন্য ইতিহাস লোড করতে ব্যর্থ",
      noHistoryRecords: "কোনো ইতিহাস রেকর্ড নেই",

      // CSV headers
      csvInvoiceNumber: "Invoice Number",
      csvBillingDate: "Billing Date",
      csvTotalBill: "Total Bill",
      csvTotalConsumption: "Total Consumption",
      csvRatePerUnit: "Rate Per Unit",
      csvShop: "Shop",
      csvPrevious: "Previous",
      csvCurrent: "Current",
      csvConsumption: "Consumption",
      csvBill: "Bill",
    },
    en: {
      appName: "Electricity Bill Calculator",
      modernBilling: "Modern Cloud-Based Billing System",
      history: "History",
      calculator: "Calculator",
      historyPageTitle: "Billing History",
      billingInformation: "Billing Information",
      invoiceNumber: "Invoice Number",
      billingDate: "Billing Date",
      totalBill: "Total Bill",
      shopReadings: "Shop Readings",
      addShop: "+ Add Shop",
      calculateBills: "Calculate Bills",
      saveToCloud: "Save to Cloud",
      summary: "Summary",
      totalConsumption: "Total Consumption",
      ratePerUnit: "Rate Per Unit",

      remove: "Remove",
      previousReading: "Previous Reading",
      currentReading: "Current Reading",
      consumption: "Consumption",

      invalidConsumptionValues: "Invalid consumption values",
      calculateFirst: "Calculate first",
      savedSuccessfully: "Saved Successfully",
      failedToSave: "Failed to save",

      cloudSyncedRecords: "Cloud Synced Records",
      exportCSV: "Export CSV",
      exportPDF: "Export PDF",
      delete: "Delete",
      deleteThisRecord: "Delete this record?",

      totalBillLabel: "Total Bill",
      totalConsumptionLabel: "Total Consumption",
      ratePerUnitLabel: "Rate Per Unit",

      consumptionUnits: "Units",
      billLabel: "Bill",
      previousLabel: "Previous",
      currentLabel: "Current",

      // Result / shop labels
      shopPrefix: "Shop",

      // PDF
      electricityBillReport: "Electricity Bill Report",
      invoice: "Invoice",
      date: "Date",
      totalConsumptionPDF: "Total Consumption",
      ratePerUnitPDF: "Rate Per Unit",
    },
  };

  const STORAGE_KEYS = {
    lang: "ebill_lang",
    theme: "ebill_theme",
  };

  function getLang() {
    return localStorage.getItem(STORAGE_KEYS.lang) || "bn";
  }

  function getTheme() {
    return localStorage.getItem(STORAGE_KEYS.theme) || "light";
  }

  function setLang(lang) {
    localStorage.setItem(STORAGE_KEYS.lang, lang);
  }

  function setTheme(theme) {
    localStorage.setItem(STORAGE_KEYS.theme, theme);
  }

  function t(key, lang = getLang()) {
    return translations[lang]?.[key] ?? translations.bn[key] ?? key;
  }

  function applyLanguage(lang) {
    document.documentElement.lang = lang;

    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      el.textContent = t(key, lang);
    });

    // input placeholders
    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
      const key = el.getAttribute("data-i18n-placeholder");
      el.setAttribute("placeholder", t(key, lang));
    });

    // dynamic buttons if any were set in JS (optional future)
  }

  function applyTheme(theme) {
    const root = document.documentElement;
    root.classList.toggle("theme-dark", theme === "dark");
    root.classList.toggle("theme-light", theme !== "dark");

    // meta theme-color
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#09090b" : "#ffffff");
  }

  function initToggles() {
    const langBtn = document.getElementById("langToggle");
    const themeBtn = document.getElementById("themeToggle");

    if (langBtn) {
      const updateLangBtn = () => {
        const lang = getLang();
        langBtn.textContent = lang === "bn" ? "বাংলা" : "English";
      };

      langBtn.addEventListener("click", () => {
        const next = getLang() === "bn" ? "en" : "bn";
        setLang(next);
        applyLanguage(next);
        updateLangBtn();
      });

      updateLangBtn();
    }

    if (themeBtn) {
      const updateThemeBtn = () => {
        const theme = getTheme();
        themeBtn.textContent = theme === "dark" ? "Dark" : "Light";
      };

      themeBtn.addEventListener("click", () => {
        const next = getTheme() === "dark" ? "light" : "dark";
        setTheme(next);
        applyTheme(next);
        updateThemeBtn();
      });

      updateThemeBtn();
    }
  }

  window.EbillI18n = {
    t,
    applyLanguage,
    getLang,
    setLang,
    applyTheme,
    getTheme,
    setTheme,
    initToggles,
  };

  // Auto-init on DOM ready
  window.addEventListener("DOMContentLoaded", () => {
    const lang = getLang();
    const theme = getTheme();
    applyLanguage(lang);
    applyTheme(theme);
    initToggles();
  });
})();

