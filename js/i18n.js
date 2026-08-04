// Internationalization (i18n) module
const translations = {
  en: {
    // Header
    appTitle: "Crypto Analyzer Pro",
    appSubtitle: "Smart Trading Signals & Analysis",
    langSwitch: "فارسی",
    
    // Controls
    selectCrypto: "Cryptocurrency",
    selectTimeframe: "Timeframe",
    analyzeBtn: "🔍 Analyze Now",
    autoRefresh: "Auto Refresh",
    refreshInterval: "Refresh Interval",
    seconds: "seconds",
    
    // Chart
    chartTitle: "Price Chart & Technical Analysis",
    
    // Analysis
    overallSignal: "Overall Signal",
    longPosition: "🟢 LONG (Buy)",
    shortPosition: "🔴 SHORT (Sell)",
    waitSignal: "🟡 WAIT - No Clear Signal",
    confidence: "Confidence",
    probability: "Success Probability",
    
    // Entry/Exit
    entryPrice: "Entry Price",
    takeProfit1: "Take Profit 1 (TP1)",
    takeProfit2: "Take Profit 2 (TP2)",
    takeProfit3: "Take Profit 3 (TP3)",
    stopLoss: "Stop Loss (SL)",
    leverage: "Recommended Leverage",
    riskReward: "Risk/Reward Ratio",
    positionSize: "Position Size (% of portfolio)",
    
    // Technical Indicators
    technicalAnalysis: "Technical Indicators",
    advancedAnalysis: "Advanced Indicators (5 Extra Parameters)",
    rsi: "RSI (14)",
    macd: "MACD",
    ema: "EMA Crossover",
    bollinger: "Bollinger Bands",
    volume: "Volume Analysis",
    supportResist: "Support & Resistance",
    trendStrength: "Trend Strength",
    movingAvg: "Moving Averages",
    
    // Market Sentiment
    marketSentiment: "Market Sentiment",
    fearGreed: "Fear & Greed Index",
    fear: "Fear",
    greed: "Greed",
    neutral: "Neutral",
    extremeFear: "Extreme Fear",
    extremeGreed: "Extreme Greed",
    marketTrend: "Market Trend",
    bullTrend: "Bullish 📈",
    bearTrend: "Bearish 📉",
    sideTrend: "Sideways ➡️",
    
    // Top Traders
    topTraders: "Top Trader Analysis",
    traderPositions: "Trader Positions",
    longRatio: "Long Ratio",
    shortRatio: "Short Ratio",
    
    // Notifications
    notifSettings: "Notification Settings",
    enableNotif: "Enable Notifications",
    minProbability: "Min. Probability Threshold",
    notifFrequency: "Notification Frequency",
    everyRefresh: "Every Refresh",
    onlySignalChange: "Only on Signal Change",
    hourly: "Hourly",
    lastNotif: "Last Notifications",
    newsAnalysis: "News Analysis",
    noNews: "No news available",
    bullish: "Bullish",
    bearish: "Bearish",
    noNotif: "No notifications yet",
    
    // Probability Chart
    probChart: "Probability Analysis",
    bullishFactors: "Bullish Factors",
    bearishFactors: "Bearish Factors",
    neutralFactors: "Neutral Factors",
    
    // Status
    loading: "Loading data...",
    analyzing: "Analyzing...",
    lastUpdate: "Last Update",
    dataSource: "Data Sources",
    
    // Footer
    disclaimer: "⚠️ Disclaimer: This tool is for educational purposes only. Not financial advice. Always do your own research and manage risk carefully.",
    
    // Indicators detail
    overbought: "Overbought",
    oversold: "Oversold",
    bullish: "Bullish",
    bearish: "Bearish",
    buySignal: "Buy Signal",
    sellSignal: "Sell Signal",
    strongBuy: "Strong Buy",
    strongSell: "Strong Sell",
    
    // PWA
    installApp: "Install App",
    offline: "You are offline",
    online: "Back online",
  },
  
  fa: {
    // Header
    appTitle: "کریپتو آنالایزر پرو",
    appSubtitle: "سیگنال‌های هوشمند معاملاتی و تحلیل",
    langSwitch: "English",
    
    // Controls
    selectCrypto: "ارز دیجیتال",
    selectTimeframe: "تایم‌فریم",
    analyzeBtn: "🔍 تحلیل الان",
    autoRefresh: "بروزرسانی خودکار",
    refreshInterval: "فاصله بروزرسانی",
    seconds: "ثانیه",
    
    // Chart
    chartTitle: "نمودار قیمت و تحلیل تکنیکال",
    
    // Analysis
    overallSignal: "سیگنال کلی",
    longPosition: "🟢 لانگ (خرید)",
    shortPosition: "🔴 شورت (فروش)",
    waitSignal: "🟡 صبر - سیگنال واضحی نیست",
    confidence: "اطمینان",
    probability: "احتمال موفقیت",
    
    // Entry/Exit
    entryPrice: "قیمت ورود",
    takeProfit1: "حد سود ۱ (TP1)",
    takeProfit2: "حد سود ۲ (TP2)",
    takeProfit3: "حد سود ۳ (TP3)",
    stopLoss: "حد ضرر (SL)",
    leverage: "لوریج پیشنهادی",
    riskReward: "نسبت ریسک به ریوارد",
    positionSize: "حجم پوزیشن (٪ پرتفوی)",
    
    // Technical Indicators
    technicalAnalysis: "اندیکاتورهای تکنیکال",
    advancedAnalysis: "اندیکاتورهای پیشرفته (۵ پارامتر اضافی)",
    rsi: "RSI (14)",
    macd: "MACD",
    ema: "تقاطع EMA",
    bollinger: "باندهای بولینگر",
    volume: "تحلیل حجم",
    supportResist: "حمایت و مقاومت",
    trendStrength: "قدرت روند",
    movingAvg: "میانگین‌های متحرک",
    
    // Market Sentiment
    marketSentiment: "احساسات بازار",
    fearGreed: "شاخص ترس و طمع",
    fear: "ترس",
    greed: "طمع",
    neutral: "خنثی",
    extremeFear: "ترس شدید",
    extremeGreed: "طمع شدید",
    marketTrend: "روند بازار",
    bullTrend: "صعودی 📈",
    bearTrend: "نزولی 📉",
    sideTrend: "خنثی ➡️",
    
    // Top Traders
    topTraders: "تحلیل تریدرهای برتر",
    traderPositions: "پوزیشن تریدرها",
    longRatio: "نسبت لانگ",
    shortRatio: "نسبت شورت",
    
    // Notifications
    notifSettings: "تنظیمات نوتیفیکیشن",
    enableNotif: "فعال‌سازی نوتیفیکیشن‌ها",
    minProbability: "حداقل آستانه احتمال",
    notifFrequency: "فرکانس نوتیفیکیشن",
    everyRefresh: "هر بروزرسانی",
    onlySignalChange: "فقط هنگام تغییر سیگنال",
    hourly: "ساعتی",
    lastNotif: "آخرین نوتیفیکیشن‌ها",
    newsAnalysis: "تحلیل اخبار",
    noNews: "خبری موجود نیست",
    bullish: "صعودی",
    bearish: "نزولی",
    noNotif: "هنوز نوتیفیکیشنی نیست",
    
    // Probability Chart
    probChart: "تحلیل احتمال",
    bullishFactors: "عوامل صعودی",
    bearishFactors: "عوامل نزولی",
    neutralFactors: "عوامل خنثی",
    
    // Status
    loading: "در حال بارگذاری داده‌ها...",
    analyzing: "در حال تحلیل...",
    lastUpdate: "آخرین بروزرسانی",
    dataSource: "منابع داده",
    
    // Footer
    disclaimer: "⚠️ سلب مسئولیت: این ابزار فقط برای اهداف آموزشی است. توصیه مالی نیست. همیشه تحقیقات خود را انجام دهید و ریسک را مدیریت کنید.",
    
    // Indicators detail
    overbought: "اشباع خرید",
    oversold: "اشباع فروش",
    bullish: "صعودی",
    bearish: "نزولی",
    buySignal: "سیگنال خرید",
    sellSignal: "سیگنال فروش",
    strongBuy: "خرید قوی",
    strongSell: "فروش قوی",
    
    // PWA
    installApp: "نصب اپلیکیشن",
    offline: "آفلاین هستید",
    online: "آنلاین شدید",
  }
};

let currentLang = localStorage.getItem('cryptoLang') || 'fa';

// Make currentLang accessible globally for other modules
window.currentLang = currentLang;

function getCurrentLang() {
  return window.currentLang || currentLang;
}

function t(key) {
  return translations[getCurrentLang()]?.[key] || translations['en'][key] || key;
}

function setLanguage(lang) {
  currentLang = lang;
  window.currentLang = lang;
  localStorage.setItem('cryptoLang', lang);
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
  applyTranslations();
}

function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[currentLang]?.[key]) {
      el.textContent = translations[currentLang][key];
    }
  });
  
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (translations[currentLang]?.[key]) {
      el.placeholder = translations[currentLang][key];
    }
  });
  
  // Update page title
  document.title = t('appTitle') + ' - ' + t('appSubtitle');
}

function toggleLanguage() {
  setLanguage(currentLang === 'fa' ? 'en' : 'fa');
  // Trigger UI refresh if available
  if (typeof window !== 'undefined' && window._refreshUI) {
    window._refreshUI();
  }
}

export { t, setLanguage, toggleLanguage, applyTranslations, currentLang, getCurrentLang };
// Allow setting language from outside
window._setLanguage = setLanguage;
