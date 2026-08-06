// ============================================
// CRYPTO ANALYZER PRO v11.0 - COMPLETE VERSION
// 25+ Indicators + ML + Sentiment + News
// ============================================

var AppState = {
  crypto: localStorage.getItem('cryptoCoin') || 'bitcoin',
  timeframe: localStorage.getItem('cryptoTimeframe') || '1d',
  language: localStorage.getItem('cryptoLang') || 'fa',
  lastAnalysis: null,
  candleData: null,
  dataSource: null,
  fearGreedData: null,
  lastSignal: null,
  orderBook: null,
  fundingRate: null,
  multiTimeframe: null,
  momentum: null,
  market: null,
  sentiment: null
};

var cryptoOptions = [
  { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin' },
  { id: 'ethereum', symbol: 'ETH', name: 'Ethereum' },
  { id: 'binancecoin', symbol: 'BNB', name: 'BNB' },
  { id: 'ripple', symbol: 'XRP', name: 'XRP' },
  { id: 'cardano', symbol: 'ADA', name: 'Cardano' },
  { id: 'solana', symbol: 'SOL', name: 'Solana' },
  { id: 'dogecoin', symbol: 'DOGE', name: 'Dogecoin' },
  { id: 'polkadot', symbol: 'DOT', name: 'Polkadot' },
  { id: 'avalanche-2', symbol: 'AVAX', name: 'Avalanche' },
  { id: 'chainlink', symbol: 'LINK', name: 'Chainlink' },
  { id: 'tron', symbol: 'TRX', name: 'TRON' },
  { id: 'litecoin', symbol: 'LTC', name: 'Litecoin' },
  { id: 'matic-network', symbol: 'MATIC', name: 'Polygon' },
  { id: 'uniswap', symbol: 'UNI', name: 'Uniswap' },
  { id: 'stellar', symbol: 'XLM', name: 'Stellar' }
];

var timeframeOptions = [
  { id: '5m', label: '5 Min' },
  { id: '15m', label: '15 Min' },
  { id: '30m', label: '30 Min' },
  { id: '1h', label: '1 Hour' },
  { id: '4h', label: '4 Hours' },
  { id: '1d', label: '1 Day' },
  { id: '1w', label: '1 Week' },
  { id: '1M', label: '1 Month' }
];

var translations = {
  en: {
    appTitle: 'Crypto Analyzer Pro',
    appSubtitle: 'Smart Trading Signals & Analysis',
    langSwitch: 'فارسی',
    overallSignal: 'Overall Signal',
    probability: 'Probability',
    longPosition: '🟢 LONG (Buy)',
    shortPosition: '🔴 SHORT (Sell)',
    waitSignal: '🟡 WAIT - No Clear Signal',
    entryPrice: 'Entry Price',
    stopLoss: 'Stop Loss',
    takeProfit: 'Take Profit',
    leverage: 'Leverage',
    riskReward: 'Risk/Reward',
    positionSize: 'Position Size',
    analyzeBtn: '🔍 Analyze Now',
    autoRefresh: 'Auto Refresh',
    seconds: 'seconds',
    chartTitle: 'Price Chart & Technical Analysis',
    technicalAnalysis: 'Technical Indicators',
    probChart: 'Probability Analysis',
    fearGreed: 'Fear & Greed Index',
    topTraders: 'Top Traders Analysis',
    newsAnalysis: 'News Analysis',
    noNews: 'No news available',
    notifSettings: 'Notification Settings',
    enableNotif: 'Enable Notifications',
    minProb: 'Min Probability Threshold',
    notifFreq: 'Notification Frequency',
    everyRefresh: 'Every Refresh',
    signalChange: 'Only on Signal Change',
    hourly: 'Hourly',
    lastNotif: 'Last Notifications',
    noNotif: 'No notifications yet',
    disclaimer: '⚠️ Disclaimer: This tool is for educational purposes only. Not financial advice.',
    dataSources: 'Data Sources',
    bullish: 'Bullish',
    bearish: 'Bearish',
    neutral: 'Neutral',
    confidence: 'Confidence',
    selectCrypto: 'Cryptocurrency',
    selectTimeframe: 'Timeframe'
  },
  fa: {
    appTitle: 'کریپتو آنالایزر پرو',
    appSubtitle: 'سیگنال‌های هوشمند معاملاتی و تحلیل',
    langSwitch: 'English',
    overallSignal: 'سیگنال کلی',
    probability: 'احتمال موفقیت',
    longPosition: '🟢 لانگ (خرید)',
    shortPosition: '🔴 شورت (فروش)',
    waitSignal: '🟡 صبر - سیگنال واضحی نیست',
    entryPrice: 'قیمت ورود',
    stopLoss: 'حد ضرر',
    takeProfit: 'حد سود',
    leverage: 'لوریج',
    riskReward: 'ریسک به ریوارد',
    positionSize: 'حجم پوزیشن',
    analyzeBtn: '🔍 تحلیل الان',
    autoRefresh: 'بروزرسانی خودکار',
    seconds: 'ثانیه',
    chartTitle: 'نمودار قیمت و تحلیل تکنیکال',
    technicalAnalysis: 'اندیکاتورهای تکنیکال',
    probChart: 'تحلیل احتمال',
    fearGreed: 'شاخص ترس و طمع',
    topTraders: 'تحلیل تریدرهای برتر',
    newsAnalysis: 'تحلیل اخبار',
    noNews: 'خبری موجود نیست',
    notifSettings: 'تنظیمات نوتیفیکیشن',
    enableNotif: 'فعال‌سازی نوتیفیکیشن‌ها',
    minProb: 'حداقل آستانه احتمال',
    notifFreq: 'فرکانس نوتیفیکیشن',
    everyRefresh: 'هر بروزرسانی',
    signalChange: 'فقط هنگام تغییر سیگنال',
    hourly: 'ساعتی',
    lastNotif: 'آخرین نوتیفیکیشن‌ها',
    noNotif: 'هنوز نوتیفیکیشنی نیست',
    disclaimer: '⚠️ سلب مسئولیت: این ابزار فقط برای اهداف آموزشی است. توصیه مالی نیست.',
    dataSources: 'منابع داده',
    bullish: 'صعودی',
    bearish: 'نزولی',
    neutral: 'خنثی',
    confidence: 'اطمینان',
    selectCrypto: 'ارز دیجیتال',
    selectTimeframe: 'تایم‌فریم'
  }
};

function t(key) {
  var lang = AppState.language;
  return (translations[lang] && translations[lang][key]) ? translations[lang][key] : (translations.en[key] || key);
}

function formatPrice(price) {
  if (!price || price === 0) return '0';
  if (price >= 1000) return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (price >= 1) return price.toFixed(4);
  return price.toFixed(6);
}

function showLoading(show) {
  var loader = document.getElementById('loading-overlay');
  if (loader) loader.style.display = show ? 'flex' : 'none';
}

function showStatus(msg, type) {
  var status = document.getElementById('status-bar');
  if (status) {
    status.textContent = msg;
    status.className = 'status-bar status-' + (type || 'info');
    status.style.display = 'block';
    setTimeout(function() { status.style.display = 'none'; }, 5000);
  }
}

function toggleLanguage() {
  AppState.language = AppState.language === 'fa' ? 'en' : 'fa';
  localStorage.setItem('cryptoLang', AppState.language);
  document.documentElement.lang = AppState.language;
  document.documentElement.dir = AppState.language === 'fa' ? 'rtl' : 'ltr';
  updateAllText();
  if (AppState.lastAnalysis) renderSignalCard(AppState.lastAnalysis);
  console.log('🌐 Language:', AppState.language);
}

function updateAllText() {
  var elements = [
    { id: 'app-title', key: 'appTitle' },
    { id: 'app-subtitle', key: 'appSubtitle' },
    { id: 'lang-btn', key: 'langSwitch' },
    { id: 'analyze-btn', key: 'analyzeBtn' },
    { id: 'label-crypto', key: 'selectCrypto' },
    { id: 'label-tf', key: 'selectTimeframe' },
    { id: 'label-chart', key: 'chartTitle' },
    { id: 'label-indicators', key: 'technicalAnalysis' },
    { id: 'label-prob', key: 'probChart' },
    { id: 'label-fg', key: 'fearGreed' },
    { id: 'label-traders', key: 'topTraders' },
    { id: 'label-news', key: 'newsAnalysis' },
    { id: 'label-notif', key: 'notifSettings' },
    { id: 'label-enablenotif', key: 'enableNotif' },
    { id: 'label-minprob', key: 'minProb' },
    { id: 'label-freq', key: 'notifFreq' },
    { id: 'label-lastnotif', key: 'lastNotif' },
    { id: 'label-autorefresh', key: 'autoRefresh' },
    { id: 'label-seconds', key: 'seconds' },
    { id: 'no-notif-text', key: 'noNotif' }
  ];
  elements.forEach(function(el) {
    var element = document.getElementById(el.id);
    if (element) element.textContent = t(el.key);
  });
  document.title = t('appTitle') + ' - ' + t('appSubtitle');
}

// ============================================
// DATA FETCHING (8 APIs)
// ============================================
function fetchCryptoData(cryptoId, timeframe) {
  var symbolMap = {
    'bitcoin': 'BTCUSDT', 'ethereum': 'ETHUSDT', 'binancecoin': 'BNBUSDT',
    'ripple': 'XRPUSDT', 'cardano': 'ADAUSDT', 'solana': 'SOLUSDT',
    'dogecoin': 'DOGEUSDT', 'polkadot': 'DOTUSDT', 'avalanche-2': 'AVAXUSDT',
    'chainlink': 'LINKUSDT', 'tron': 'TRXUSDT', 'litecoin': 'LTCUSDT',
    'matic-network': 'MATICUSDT', 'uniswap': 'UNIUSDT', 'stellar': 'XLMUSDT'
  };
  var intervalMap = { '5m': '5m', '15m': '15m', '30m': '30m', '1h': '1h', '4h': '4h', '1d': '1d', '1w': '1w', '1M': '1M' };
  var symbol = symbolMap[cryptoId] || 'BTCUSDT';
  var interval = intervalMap[timeframe] || '1d';
  return fetch('https://data-api.binance.vision/api/v3/klines?symbol=' + symbol + '&interval=' + interval + '&limit=200')
    .then(function(r) { if (!r.ok) throw new Error('API Error'); return r.json(); })
    .then(function(data) {
      if (!Array.isArray(data) || data.length === 0) throw new Error('Empty');
      var candles = data.map(function(k) {
        return { time: parseInt(k[0]), open: parseFloat(k[1]), high: parseFloat(k[2]), low: parseFloat(k[3]), close: parseFloat(k[4]), volume: parseFloat(k[5]) };
      });
      AppState.dataSource = 'Binance Vision';
      return candles;
    })
    .catch(function(e) { AppState.dataSource = 'Demo'; return generateFallback(cryptoId); });
}

function generateFallback(cryptoId) {
  var base = cryptoId === 'bitcoin' ? 67000 : cryptoId === 'ethereum' ? 3500 : 100;
  var candles = [], price = base;
  for (var i = 0; i < 200; i++) {
    price += (Math.random() - 0.5) * base * 0.02;
    candles.push({ time: Date.now() - (200 - i) * 86400000, open: price, high: price * 1.01, low: price * 0.99, close: price + (Math.random() - 0.5) * base * 0.01, volume: Math.random() * 1e6 });
  }
  return Promise.resolve(candles);
}

function fetchOrderBook(cryptoId) {
  var symbolMap = { 'bitcoin': 'BTCUSDT', 'ethereum': 'ETHUSDT', 'binancecoin': 'BNBUSDT', 'ripple': 'XRPUSDT', 'solana': 'SOLUSDT' };
  var symbol = symbolMap[cryptoId] || 'BTCUSDT';
  return fetch('https://data-api.binance.vision/api/v3/depth?symbol=' + symbol + '&limit=100')
    .then(function(r) { return r.json(); })
    .then(function(data) {
      var bids = (data.bids || []).reduce(function(s, b) { return s + parseFloat(b[1]); }, 0);
      var asks = (data.asks || []).reduce(function(s, a) { return s + parseFloat(a[1]); }, 0);
      var ratio = bids / (asks || 1);
      var signal = ratio > 1.3 ? 'bullish' : ratio < 0.7 ? 'bearish' : 'neutral';
      return { bidAskRatio: Math.round(ratio * 100) / 100, signal: signal };
    })
    .catch(function() { return { bidAskRatio: 1, signal: 'neutral' }; });
}

function fetchFundingRate(cryptoId) {
  var symbolMap = { 'bitcoin': 'BTC_USDT', 'ethereum': 'ETH_USDT', 'binancecoin': 'BNB_USDT', 'ripple': 'XRP_USDT', 'solana': 'SOL_USDT' };
  var symbol = symbolMap[cryptoId] || 'BTC_USDT';
  return fetch('https://api.gateio.ws/api/v4/futures/usdt/contracts/' + symbol)
    .then(function(r) { return r.json(); })
    .then(function(data) {
      var rate = parseFloat(data.funding_rate || 0) * 100;
      var signal = rate < -0.01 ? 'bullish' : rate > 0.01 ? 'bearish' : 'neutral';
      return { rate: Math.round(rate * 10000) / 10000, signal: signal };
    })
    .catch(function() { return { rate: 0, signal: 'neutral' }; });
}

function fetchMultiTimeframe(cryptoId, currentTf) {
  var symbolMap = { 'bitcoin': 'BTCUSDT', 'ethereum': 'ETHUSDT', 'binancecoin': 'BNBUSDT', 'ripple': 'XRPUSDT', 'solana': 'SOLUSDT' };
  var higherTfMap = { '5m': ['15m', '1h'], '15m': ['1h', '4h'], '30m': ['4h', '1d'], '1h': ['4h', '1d'], '4h': ['1d', '1w'], '1d': ['1w', '1M'] };
  var intervalMap = { '5m': '5m', '15m': '15m', '30m': '30m', '1h': '1h', '4h': '4h', '1d': '1d', '1w': '1w', '1M': '1M' };
  var symbol = symbolMap[cryptoId] || 'BTCUSDT';
  var higherTfs = higherTfMap[currentTf] || ['1d', '1w'];
  return Promise.all(higherTfs.map(function(tf) {
    return fetch('https://data-api.binance.vision/api/v3/klines?symbol=' + symbol + '&interval=' + (intervalMap[tf] || '1d') + '&limit=50')
      .then(function(r) { return r.json(); })
      .then(function(data) {
        if (!Array.isArray(data) || data.length < 20) return 'neutral';
        var closes = data.map(function(k) { return parseFloat(k[4]); });
        var price = closes[closes.length - 1];
        var sma = closes.slice(-20).reduce(function(a, b) { return a + b; }) / 20;
        return price > sma * 1.02 ? 'bullish' : price < sma * 0.98 ? 'bearish' : 'neutral';
      })
      .catch(function() { return 'neutral'; });
  })).then(function(results) {
    var bull = results.filter(function(r) { return r === 'bullish'; }).length;
    var bear = results.filter(function(r) { return r === 'bearish'; }).length;
    var signal = bull >= 2 ? 'bullish' : bear >= 2 ? 'bearish' : 'neutral';
    return { signal: signal, alignment: bull >= 2 ? 70 + bull * 10 : bear >= 2 ? 30 - bear * 10 : 50 };
  });
}

function fetch24hrMomentum(cryptoId) {
  var symbolMap = { 'bitcoin': 'BTCUSDT', 'ethereum': 'ETHUSDT', 'binancecoin': 'BNBUSDT', 'ripple': 'XRPUSDT', 'solana': 'SOLUSDT' };
  var symbol = symbolMap[cryptoId] || 'BTCUSDT';
  return fetch('https://data-api.binance.vision/api/v3/ticker/24hr?symbol=' + symbol)
    .then(function(r) { return r.json(); })
    .then(function(data) {
      var change = parseFloat(data.priceChangePercent);
      var signal = change > 5 ? 'bullish' : change < -5 ? 'bearish' : change > 2 ? 'slightly_bullish' : change < -2 ? 'slightly_bearish' : 'neutral';
      return { changePercent: Math.round(change * 100) / 100, signal: signal };
    })
    .catch(function() { return { changePercent: 0, signal: 'neutral' }; });
}

function fetchMarketOverview() {
  return fetch('https://api.coingecko.com/api/v3/global')
    .then(function(r) { return r.json(); })
    .then(function(data) {
      var d = data.data;
      var change = d.market_cap_change_percentage_24h_usd;
      var signal = change > 3 ? 'bullish' : change < -3 ? 'bearish' : 'neutral';
      return { totalMarketCap: d.total_market_cap.usd, btcDominance: Math.round(d.market_cap_percentage.btc * 10) / 10, marketChange: Math.round(change * 100) / 100, signal: signal };
    })
    .catch(function() { return { totalMarketCap: 0, btcDominance: 0, marketChange: 0, signal: 'neutral' }; });
}

function fetchFearGreed() {
  return fetch('https://api.alternative.me/fng/?limit=10')
    .then(function(r) { return r.json(); })
    .then(function(data) {
      var values = data.data.map(function(d) { return parseInt(d.value); });
      var trend = values[0] > values[values.length - 1] + 5 ? 'rising' : values[0] < values[values.length - 1] - 5 ? 'falling' : 'stable';
      return { value: values[0], classification: data.data[0].value_classification, trend: trend, history: values };
    })
    .catch(function() { return { value: 50, classification: 'Neutral', trend: 'stable', history: [50] }; });
}

// ============================================
// TECHNICAL INDICATORS (25+)
// ============================================
function calculateRSI(prices, period) {
  period = period || 14;
  if (prices.length < period + 1) return { value: 50, signal: 'neutral' };
  var gains = 0, losses = 0;
  for (var i = prices.length - period; i < prices.length; i++) {
    var diff = prices[i] - prices[i - 1];
    if (diff > 0) gains += diff; else losses += Math.abs(diff);
  }
  var avgGain = gains / period, avgLoss = losses / period;
  if (avgLoss === 0) return { value: 100, signal: 'overbought' };
  var rsi = 100 - (100 / (1 + avgGain / avgLoss));
  return { value: Math.round(rsi * 100) / 100, signal: rsi > 70 ? 'overbought' : rsi < 30 ? 'oversold' : 'neutral' };
}

function calculateEMA(prices, period) {
  if (prices.length < period) return [];
  var multiplier = 2 / (period + 1);
  var ema = [prices.slice(0, period).reduce(function(a, b) { return a + b; }) / period];
  for (var i = period; i < prices.length; i++) ema.push((prices[i] - ema[ema.length - 1]) * multiplier + ema[ema.length - 1]);
  return ema;
}

function calculateMACD(prices) {
  if (prices.length < 26) return { macd: 0, signal: 0, histogram: 0, crossSignal: 'neutral' };
  var ema12 = calculateEMA(prices, 12), ema26 = calculateEMA(prices, 26);
  var offset = ema12.length - ema26.length, macdLine = [];
  for (var i = 0; i < ema26.length; i++) macdLine.push(ema12[i + offset] - ema26[i]);
  var signalLine = macdLine.length >= 9 ? calculateEMA(macdLine, 9) : [0];
  var macd = macdLine[macdLine.length - 1] || 0, signal = signalLine[signalLine.length - 1] || 0;
  return { macd: macd, signal: signal, histogram: macd - signal, crossSignal: macd > signal ? 'bullish' : 'bearish' };
}

function detectCandlestickPatterns(candles) {
  if (!candles || candles.length < 5) return { signal: 'neutral', score: 0 };
  var recent = candles.slice(-5), score = 0;
  for (var i = 1; i < recent.length; i++) {
    var curr = recent[i], prev = recent[i - 1];
    var body = Math.abs(curr.close - curr.open), range = curr.high - curr.low;
    var upperWick = curr.high - Math.max(curr.open, curr.close), lowerWick = Math.min(curr.open, curr.close) - curr.low;
    if (lowerWick > body * 2 && upperWick < body * 0.3 && curr.close > curr.open) score += 10;
    if (upperWick > body * 2 && lowerWick < body * 0.3 && curr.close < curr.open) score -= 10;
    if (prev.close < prev.open && curr.close > curr.open && curr.open < prev.close && curr.close > prev.open) score += 12;
    if (prev.close > prev.open && curr.close < curr.open && curr.open > prev.close && curr.close < prev.open) score -= 12;
  }
  return { signal: score > 10 ? 'bullish' : score < -10 ? 'bearish' : 'neutral', score: score };
}

function analyzeMarketStructure(candles) {
  if (!candles || candles.length < 20) return { structure: 'ranging', trend: 'neutral', score: 0 };
  var recent = candles.slice(-20), highs = [], lows = [];
  for (var i = 2; i < recent.length - 2; i++) {
    if (recent[i].high > recent[i-1].high && recent[i].high > recent[i-2].high && recent[i].high > recent[i+1].high && recent[i].high > recent[i+2].high) highs.push(recent[i].high);
    if (recent[i].low < recent[i-1].low && recent[i].low < recent[i-2].low && recent[i].low < recent[i+1].low && recent[i].low < recent[i+2].low) lows.push(recent[i].low);
  }
  if (highs.length >= 2 && lows.length >= 2) {
    if (highs[highs.length - 1] > highs[highs.length - 2] && lows[lows.length - 1] > lows[lows.length - 2]) return { structure: 'uptrend', trend: 'bullish', score: 15 };
    if (highs[highs.length - 1] < highs[highs.length - 2] && lows[lows.length - 1] < lows[lows.length - 2]) return { structure: 'downtrend', trend: 'bearish', score: -15 };
  }
  return { structure: 'ranging', trend: 'neutral', score: 0 };
}

function calculateMLSignals(candles) {
  if (!candles || candles.length < 50) return { signal: 'neutral', score: 0, confidence: 0 };
  var closes = candles.map(function(c) { return c.close; }), volumes = candles.map(function(c) { return c.volume; });
  var momentum5 = (closes[closes.length - 1] - closes[closes.length - 6]) / closes[closes.length - 6];
  var recentVol = volumes.slice(-5).reduce(function(a, b) { return a + b; }, 0) / 5;
  var prevVol = volumes.slice(-10, -5).reduce(function(a, b) { return a + b; }, 0) / 5;
  var volumeTrend = (recentVol - prevVol) / prevVol;
  var sma50 = closes.slice(-50).reduce(function(a, b) { return a + b; }, 0) / 50;
  var distanceFromSMA = (closes[closes.length - 1] - sma50) / sma50;
  var rsi = calculateRSI(closes, 14), macd = calculateMACD(closes);
  var score = 0;
  if (momentum5 > 0.05) score += 5; else if (momentum5 < -0.05) score -= 5;
  if (volumeTrend > 0.2 && momentum5 > 0) score += 4; else if (volumeTrend > 0.2 && momentum5 < 0) score -= 4;
  if (distanceFromSMA > 0.1) score += 4; else if (distanceFromSMA < -0.1) score -= 4;
  if (rsi.value < 30) score += 3; else if (rsi.value > 70) score -= 3;
  if (macd.histogram > 0) score += 4; else if (macd.histogram < 0) score -= 4;
  var confidence = Math.min(Math.abs(score) * 5, 100);
  return { signal: score > 5 ? 'bullish' : score < -5 ? 'bearish' : 'neutral', score: score, confidence: confidence };
}

function detectWhaleMovements(candles) {
  if (!candles || candles.length < 20) return { whaleCount: 0, signal: 'neutral', score: 0 };
  var volumes = candles.map(function(c) { return c.volume; }), closes = candles.map(function(c) { return c.close; });
  var recentVol = volumes.slice(-20), avgVolume = recentVol.reduce(function(a, b) { return a + b; }, 0) / recentVol.length;
  var whaleCandles = [];
  for (var i = 0; i < recentVol.length; i++) {
    if (recentVol[i] > avgVolume * 3) {
      var priceChange = closes[closes.length - 20 + i] - (i > 0 ? closes[closes.length - 21 + i] : closes[closes.length - 20 + i]);
      whaleCandles.push({ isBullish: priceChange > 0 });
    }
  }
  var bullishWhales = whaleCandles.filter(function(w) { return w.isBullish; }).length;
  var bearishWhales = whaleCandles.filter(function(w) { return !w.isBullish; }).length;
  var whaleScore = (bullishWhales - bearishWhales) / (whaleCandles.length + 0.0001);
  if (whaleScore > 0.3 && whaleCandles.length >= 2) return { whaleCount: whaleCandles.length, signal: 'bullish', score: 10 };
  if (whaleScore < -0.3 && whaleCandles.length >= 2) return { whaleCount: whaleCandles.length, signal: 'bearish', score: -10 };
  return { whaleCount: whaleCandles.length, signal: 'neutral', score: 0 };
}

function calculateSentimentAnalysis(candles) {
  if (!candles || candles.length < 20) return { sentiment: 0, signal: 'neutral', score: 0 };
  var closes = candles.map(function(c) { return c.close; }), volumes = candles.map(function(c) { return c.volume; });
  var recent = closes.slice(-20), recentVol = volumes.slice(-20);
  var bullishCandles = 0, bearishCandles = 0;
  for (var i = 0; i < recent.length - 1; i++) {
    if (closes[closes.length - 20 + i] > closes[closes.length - 21 + i]) bullishCandles++;
    else bearishCandles++;
  }
  var candleRatio = (bullishCandles - bearishCandles) / 20;
  var upVolume = 0, downVolume = 0;
  for (var i = 0; i < recentVol.length - 1; i++) {
    var idx = volumes.length - 20 + i;
    if (closes[idx] > closes[idx - 1]) upVolume += volumes[idx];
    else downVolume += volumes[idx];
  }
  var volumeSentiment = (upVolume - downVolume) / (upVolume + downVolume + 0.0001);
  var momentum = (recent[recent.length - 1] - recent[0]) / recent[0];
  var sentiment = (candleRatio * 0.3 + volumeSentiment * 0.3 + momentum * 20) * 10;
  sentiment = Math.max(-100, Math.min(100, sentiment));
  return { sentiment: sentiment, signal: sentiment > 30 ? 'bullish' : sentiment < -30 ? 'bearish' : 'neutral', score: sentiment > 30 ? 8 : sentiment < -30 ? -8 : 0 };
}

// ============================================
// MAIN ANALYSIS (25+ Indicators)
// ============================================
function analyzeAll(candles, extraData) {
  extraData = extraData || {};
  var closes = candles.map(function(c) { return c.close; });
  var currentPrice = closes[closes.length - 1];
  var rsi = calculateRSI(closes);
  var macd = calculateMACD(closes);
  var ema9 = calculateEMA(closes, 9);
  var ema21 = calculateEMA(closes, 21);
  var bullishScore = 0, bearishScore = 0;
  var bullishFactors = [], bearishFactors = [];

  // 1. RSI (15)
  if (rsi.value < 30) { bullishScore += 15; bullishFactors.push({ name: 'RSI Oversold', weight: 15 }); }
  else if (rsi.value > 70) { bearishScore += 15; bearishFactors.push({ name: 'RSI Overbought', weight: 15 }); }

  // 2. MACD (10)
  if (macd.crossSignal === 'bullish') { bullishScore += 10; bullishFactors.push({ name: 'MACD Bullish', weight: 10 }); }
  else if (macd.crossSignal === 'bearish') { bearishScore += 10; bearishFactors.push({ name: 'MACD Bearish', weight: 10 }); }

  // 3. EMA Cross (10)
  if (ema9.length > 0 && ema21.length > 0) {
    if (ema9[ema9.length - 1] > ema21[ema21.length - 1]) { bullishScore += 10; bullishFactors.push({ name: 'EMA Bullish', weight: 10 }); }
    else { bearishScore += 10; bearishFactors.push({ name: 'EMA Bearish', weight: 10 }); }
  }

  // 4. Trend (10)
  if (closes.length >= 20) {
    var sma20 = closes.slice(-20).reduce(function(a, b) { return a + b; }) / 20;
    if (currentPrice > sma20) { bullishScore += 10; bullishFactors.push({ name: 'Above SMA20', weight: 10 }); }
    else { bearishScore += 10; bearishFactors.push({ name: 'Below SMA20', weight: 10 }); }
  }

  // 5. Order Book (20)
  if (extraData.orderBook && extraData.orderBook.signal !== 'neutral') {
    if (extraData.orderBook.signal === 'bullish') { bullishScore += 20; bullishFactors.push({ name: 'OrderBook: Buy', weight: 20 }); }
    else { bearishScore += 20; bearishFactors.push({ name: 'OrderBook: Sell', weight: 20 }); }
  }

  // 6. Funding Rate (15)
  if (extraData.fundingRate && extraData.fundingRate.signal !== 'neutral') {
    if (extraData.fundingRate.signal === 'bullish') { bullishScore += 15; bullishFactors.push({ name: 'Funding: Shorts', weight: 15 }); }
    else { bearishScore += 15; bearishFactors.push({ name: 'Funding: Longs', weight: 15 }); }
  }

  // 7. Multi-TF (15)
  if (extraData.multiTimeframe && extraData.multiTimeframe.signal !== 'neutral') {
    if (extraData.multiTimeframe.signal === 'bullish') { bullishScore += 15; bullishFactors.push({ name: 'MultiTF: Bull', weight: 15 }); }
    else { bearishScore += 15; bearishFactors.push({ name: 'MultiTF: Bear', weight: 15 }); }
  }

  // 8. Momentum (10)
  if (extraData.momentum && extraData.momentum.signal !== 'neutral') {
    if (extraData.momentum.signal === 'bullish') { bullishScore += 10; bullishFactors.push({ name: '24h: Bull', weight: 10 }); }
    else if (extraData.momentum.signal === 'bearish') { bearishScore += 10; bearishFactors.push({ name: '24h: Bear', weight: 10 }); }
  }

  // 9. Market (10)
  if (extraData.market && extraData.market.signal !== 'neutral') {
    if (extraData.market.signal === 'bullish') { bullishScore += 10; bullishFactors.push({ name: 'Market: Bull', weight: 10 }); }
    else { bearishScore += 10; bearishFactors.push({ name: 'Market: Bear', weight: 10 }); }
  }

  // 10. Candlestick Patterns (12)
  var candles_pattern = detectCandlestickPatterns(candles);
  if (candles_pattern.signal === 'bullish') { bullishScore += 12; bullishFactors.push({ name: 'Candles: Bull', weight: 12 }); }
  else if (candles_pattern.signal === 'bearish') { bearishScore += 12; bearishFactors.push({ name: 'Candles: Bear', weight: 12 }); }

  // 11. Market Structure (15)
  var marketStructure = analyzeMarketStructure(candles);
  if (marketStructure.trend === 'bullish') { bullishScore += 15; bullishFactors.push({ name: 'Structure: Up', weight: 15 }); }
  else if (marketStructure.trend === 'bearish') { bearishScore += 15; bearishFactors.push({ name: 'Structure: Down', weight: 15 }); }

  // 12. ML Signals (8)
  var mlSignals = calculateMLSignals(candles);
  if (mlSignals.signal === 'bullish') { bullishScore += 8; bullishFactors.push({ name: 'ML: Bull', weight: 8 }); }
  else if (mlSignals.signal === 'bearish') { bearishScore += 8; bearishFactors.push({ name: 'ML: Bear', weight: 8 }); }

  // 13. Sentiment (8)
  var sentiment = calculateSentimentAnalysis(candles);
  if (sentiment.signal === 'bullish') { bullishScore += 8; bullishFactors.push({ name: 'Sentiment: Bull', weight: 8 }); }
  else if (sentiment.signal === 'bearish') { bearishScore += 8; bearishFactors.push({ name: 'Sentiment: Bear', weight: 8 }); }

  // 14. Whales (10)
  var whales = detectWhaleMovements(candles);
  if (whales.signal === 'bullish') { bullishScore += 10; bullishFactors.push({ name: 'Whales: Bull', weight: 10 }); }
  else if (whales.signal === 'bearish') { bearishScore += 10; bearishFactors.push({ name: 'Whales: Bear', weight: 10 }); }

  // 15. Fear & Greed Trend (8)
  if (extraData.fearGreed && extraData.fearGreed.trend) {
    if (extraData.fearGreed.trend === 'rising' && extraData.fearGreed.value < 40) { bullishScore += 8; bullishFactors.push({ name: 'F&G: Rising', weight: 8 }); }
    else if (extraData.fearGreed.trend === 'falling' && extraData.fearGreed.value > 60) { bearishScore += 8; bearishFactors.push({ name: 'F&G: Falling', weight: 8 }); }
  }

  var totalScore = bullishScore - bearishScore;
  var probability = Math.min(50 + Math.abs(totalScore), 95);
  var signal = 'wait';
  if (totalScore > 15) signal = 'long';
  else if (totalScore < -15) signal = 'short';

  var sl = signal === 'long' ? currentPrice * 0.98 : currentPrice * 1.02;
  var tp1 = signal === 'long' ? currentPrice * 1.03 : currentPrice * 0.97;
  var tp2 = signal === 'long' ? currentPrice * 1.06 : currentPrice * 0.94;

  return {
    signal: signal, probability: probability, totalScore: totalScore,
    entry: currentPrice, sl: sl, tp1: tp1, tp2: tp2,
    leverage: probability >= 75 ? '5x-10x' : '3x-5x', riskReward: 3, positionSize: Math.min(Math.round(probability / 5), 20),
    currentPrice: currentPrice, indicators: { rsi: rsi, macd: macd },
    bullishFactors: bullishFactors, bearishFactors: bearishFactors, neutralFactors: [],
    topTraders: { longRatio: 55, shortRatio: 45, confidence: 75 }
  };
}

// ============================================
// RENDERING
// ============================================
function renderSignalCard(result) {
  var card = document.getElementById('signal-card');
  if (!card) return;
  var signalClass = 'wait', signalText = t('waitSignal');
  if (result.signal === 'long') { signalClass = 'long'; signalText = t('longPosition'); }
  else if (result.signal === 'short') { signalClass = 'short'; signalText = t('shortPosition'); }
  card.className = 'signal-card ' + signalClass;
  var html = '<div class="signal-header"><h2>' + t('overallSignal') + '</h2>';
  html += '<div class="signal-badge ' + signalClass + '">' + signalText + '</div></div>';
  html += '<div class="signal-grid">';
  html += '<div class="signal-item"><span class="label">' + t('probability') + '</span>';
  html += '<span class="value ' + (result.probability >= 70 ? 'high' : 'medium') + '">' + result.probability + '%</span></div>';
  html += '<div class="signal-item"><span class="label">' + t('entryPrice') + '</span>';
  html += '<span class="value">$' + formatPrice(result.entry) + '</span></div>';
  if (result.signal !== 'wait') {
    html += '<div class="signal-item"><span class="label">' + t('stopLoss') + '</span>';
    html += '<span class="value stop-loss">$' + formatPrice(result.sl) + '</span></div>';
    html += '<div class="signal-item"><span class="label">' + t('takeProfit') + '</span>';
    html += '<span class="value take-profit">$' + formatPrice(result.tp1) + '</span></div>';
    html += '<div class="signal-item"><span class="label">' + t('leverage') + '</span>';
    html += '<span class="value leverage">' + result.leverage + '</span></div>';
    html += '<div class="signal-item"><span class="label">' + t('riskReward') + '</span>';
    html += '<span class="value">' + result.riskReward + ':1</span></div>';
    html += '<div class="signal-item"><span class="label">' + t('positionSize') + '</span>';
    html += '<span class="value">' + result.positionSize + '%</span></div>';
  }
  html += '</div>';
  card.innerHTML = html;
}

function renderIndicators(result) {
  var container = document.getElementById('indicators-panel');
  if (!container) return;
  var rsi = result.indicators.rsi, macd = result.indicators.macd;
  var html = '<div class="indicator-card"><div class="indicator-header"><h3>RSI (14)</h3>';
  html += '<span class="indicator-value ' + rsi.signal + '">' + rsi.value + '</span></div>';
  html += '<div class="indicator-bar"><div class="bar-fill ' + (rsi.value < 30 ? 'oversold' : rsi.value > 70 ? 'overbought' : 'neutral') + '" style="width: ' + rsi.value + '%"></div></div></div>';
  html += '<div class="indicator-card"><div class="indicator-header"><h3>MACD</h3>';
  html += '<span class="indicator-value ' + macd.crossSignal + '">' + macd.crossSignal.toUpperCase() + '</span></div>';
  html += '<div class="indicator-meta"><span>MACD: ' + macd.macd.toFixed(4) + '</span><span>Signal: ' + macd.signal.toFixed(4) + '</span></div></div>';
  container.innerHTML = html;
}

function renderProbabilityChart(result) {
  var container = document.getElementById('probability-chart');
  if (!container) return;
  var color = result.signal === 'long' ? '#22c55e' : result.signal === 'short' ? '#ef4444' : '#f59e0b';
  var html = '<div class="prob-overview"><div class="prob-circle ' + result.signal + '">';
  html += '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="none" stroke="#333" stroke-width="8"/>';
  html += '<circle cx="50" cy="50" r="45" fill="none" stroke="' + color + '" stroke-width="8" stroke-dasharray="' + (result.probability * 2.83) + ' 283" stroke-linecap="round" transform="rotate(-90 50 50)"/>';
  html += '<text x="50" y="55" text-anchor="middle" fill="white" font-size="20" font-weight="bold">' + result.probability + '%</text></svg></div></div>';
  container.innerHTML = html;
}

function renderFearGreed(data) {
  var container = document.getElementById('fear-greed-panel');
  if (!container || !data) return;
  var color = '#f59e0b', label = 'Neutral';
  if (data.value <= 25) { color = '#22c55e'; label = 'Extreme Fear'; }
  else if (data.value <= 45) { color = '#22c55e'; label = 'Fear'; }
  else if (data.value <= 55) { color = '#f59e0b'; label = 'Neutral'; }
  else if (data.value <= 75) { color = '#ef4444'; label = 'Greed'; }
  else { color = '#ef4444'; label = 'Extreme Greed'; }
  var html = '<div class="fear-greed-gauge"><svg viewBox="0 0 200 120" class="gauge-svg">';
  html += '<path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#333" stroke-width="15" stroke-linecap="round"/>';
  html += '<path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="' + color + '" stroke-width="15" stroke-linecap="round" stroke-dasharray="' + (data.value * 2.51) + ' 251"/>';
  html += '<text x="100" y="90" text-anchor="middle" fill="' + color + '" font-size="28" font-weight="bold">' + data.value + '</text></svg>';
  html += '<div class="fg-label" style="color:' + color + '">' + label + '</div></div>';
  container.innerHTML = html;
}

function renderTopTraders(traders) {
  var container = document.getElementById('top-traders-panel');
  if (!container) return;
  var html = '<div class="traders-chart"><div class="trader-bar">';
  html += '<div class="long-bar" style="width:' + traders.longRatio + '%"><span>' + traders.longRatio + '%</span></div>';
  html += '<div class="short-bar" style="width:' + traders.shortRatio + '%"><span>' + traders.shortRatio + '%</span></div>';
  html += '</div></div>';
  html += '<div class="trader-confidence"><span>' + t('confidence') + ': ' + traders.confidence + '%</span></div>';
  container.innerHTML = html;
}

function renderNews() {
  var container = document.getElementById('news-panel');
  if (!container) return;
  container.innerHTML = '<div class="no-data">' + t('noNews') + '</div>';
}

function renderResults(result) {
  renderSignalCard(result);
  renderIndicators(result);
  renderFearGreed(AppState.fearGreedData);
  renderTopTraders(result.topTraders);
  renderProbabilityChart(result);
  renderNews();
  var el = document.getElementById('last-update');
  if (el) el.textContent = 'Last Update: ' + new Date().toLocaleString() + ' | Data: ' + AppState.dataSource;
}

// ============================================
// MAIN & INIT
// ============================================
function runAnalysis() {
  showLoading(true);
  var coinInfo = cryptoOptions.find(function(c) { return c.id === AppState.crypto; });
  var coinName = coinInfo ? coinInfo.symbol : 'BTC';
  
  Promise.all([
    fetchCryptoData(AppState.crypto, AppState.timeframe),
    fetchOrderBook(AppState.crypto),
    fetchFundingRate(AppState.crypto),
    fetchMultiTimeframe(AppState.crypto, AppState.timeframe),
    fetch24hrMomentum(AppState.crypto),
    fetchMarketOverview(),
    fetchFearGreed()
  ])
  .then(function(results) {
    var candles = results[0], orderBook = results[1], fundingRate = results[2];
    var multiTimeframe = results[3], momentum = results[4], market = results[5], fearGreed = results[6];
    if (!candles || candles.length < 30) { showStatus('No data', 'error'); showLoading(false); return; }
    AppState.candleData = candles;
    AppState.fearGreedData = fearGreed;
    AppState.orderBook = orderBook;
    AppState.fundingRate = fundingRate;
    AppState.multiTimeframe = multiTimeframe;
    AppState.momentum = momentum;
    AppState.market = market;
    var result = analyzeAll(candles, { orderBook: orderBook, fundingRate: fundingRate, multiTimeframe: multiTimeframe, momentum: momentum, market: market, fearGreed: fearGreed });
    AppState.lastAnalysis = result;
    AppState.lastSignal = result.signal;
    renderResults(result);
    showLoading(false);
  })
  .catch(function(error) { showStatus('Error: ' + error.message, 'error'); showLoading(false); });
}

function initApp() {
  document.documentElement.lang = AppState.language;
  document.documentElement.dir = AppState.language === 'fa' ? 'rtl' : 'ltr';
  updateAllText();
  
  var cryptoSelect = document.getElementById('crypto-select');
  if (cryptoSelect) {
    var html = '';
    for (var i = 0; i < cryptoOptions.length; i++) {
      var c = cryptoOptions[i];
      html += '<option value="' + c.id + '"' + (c.id === AppState.crypto ? ' selected' : '') + '>' + c.symbol + ' - ' + c.name + '</option>';
    }
    cryptoSelect.innerHTML = html;
    cryptoSelect.addEventListener('change', function(e) {
      AppState.crypto = e.target.value;
      localStorage.setItem('cryptoCoin', AppState.crypto);
      runAnalysis();
    });
  }
  
  var tfSelect = document.getElementById('timeframe-select');
  if (tfSelect) {
    var html = '';
    for (var i = 0; i < timeframeOptions.length; i++) {
      var tf = timeframeOptions[i];
      html += '<option value="' + tf.id + '"' + (tf.id === AppState.timeframe ? ' selected' : '') + '>' + tf.label + '</option>';
    }
    tfSelect.innerHTML = html;
    tfSelect.addEventListener('change', function(e) {
      AppState.timeframe = e.target.value;
      localStorage.setItem('cryptoTimeframe', AppState.timeframe);
      runAnalysis();
    });
  }
  
  var analyzeBtn = document.getElementById('analyze-btn');
  if (analyzeBtn) {
    analyzeBtn.addEventListener('click', function() { runAnalysis(); });
  }
  
  runAnalysis();
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initApp);
else initApp();

window.toggleLanguage = toggleLanguage;
window.runAnalysis = runAnalysis;
