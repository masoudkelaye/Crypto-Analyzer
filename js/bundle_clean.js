// ============================================
// CRYPTO ANALYZER PRO - COMPLETE BUNDLE v2
// Professional Analysis with 8+ Indicators
// ============================================

'use strict';

// ============================================
// GLOBAL STATE
// ============================================
window.AppState = {
  crypto: localStorage.getItem('cryptoCoin') || 'bitcoin',
  timeframe: localStorage.getItem('cryptoTimeframe') || '1d',
  language: localStorage.getItem('cryptoLang') || 'fa',
  lastAnalysis: null,
  candleData: null,
  dataSource: null,
  fearGreedData: null,
  newsSentiment: null,
  lastSignal: null,
  autoRefresh: false,
  refreshTimer: null,
  refreshInterval: 60,
  orderBook: null,
  fundingRate: null,
  multiTimeframe: null,
  momentum: null,
  market: null,
  trending: null
};

var priceChart = null;
var currentChartType = 'internal';

// ============================================
// OPTIONS
// ============================================
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
  { id: '5m', label: '5 Min', tvInterval: '5' },
  { id: '15m', label: '15 Min', tvInterval: '15' },
  { id: '30m', label: '30 Min', tvInterval: '30' },
  { id: '1h', label: '1 Hour', tvInterval: '60' },
  { id: '4h', label: '4 Hours', tvInterval: '240' },
  { id: '1d', label: '1 Day', tvInterval: 'D' },
  { id: '1w', label: '1 Week', tvInterval: 'W' },
  { id: '1M', label: '1 Month', tvInterval: 'M' }
];

// ============================================
// TRANSLATIONS
// ============================================
var translations = {
  en: {
    appTitle: 'Crypto Analyzer Pro',
    appSubtitle: 'Smart Trading Signals & Analysis',
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
    noNews: 'No news available',
    bullish: 'Bullish',
    bearish: 'Bearish',
    noNotif: 'No notifications yet',
    loading: 'Loading...',
    analyzing: 'Analyzing...',
    langSwitch: 'فارسی',
    labelCrypto: 'Cryptocurrency',
    labelTf: 'Timeframe',
    labelChart: 'Price Chart & Analysis',
    labelIndicators: 'Technical Indicators',
    labelProb: 'Probability Analysis',
    labelFg: 'Fear & Greed Index',
    labelTraders: 'Top Traders Analysis',
    labelNews: 'News Analysis',
    labelNotif: 'Notification Settings',
    labelEnableNotif: 'Enable Notifications',
    labelMinProb: 'Min Probability Threshold',
    labelFreq: 'Notification Frequency',
    labelLastNotif: 'Last Notifications',
    labelAutoRefresh: 'Auto Refresh',
    labelSeconds: 'seconds',
    analyzeBtn: '🔍 Analyze Now'
  },
  fa: {
    appTitle: 'کریپتو آنالایزر پرو',
    appSubtitle: 'سیگنال‌های هوشمند معاملاتی و تحلیل',
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
    noNews: 'خبری موجود نیست',
    bullish: 'صعودی',
    bearish: 'نزولی',
    noNotif: 'هنوز نوتیفیکیشنی نیست',
    loading: 'در حال بارگذاری...',
    analyzing: 'در حال تحلیل...',
    langSwitch: 'English',
    labelCrypto: 'ارز دیجیتال',
    labelTf: 'تایم‌فریم',
    labelChart: 'نمودار قیمت و تحلیل',
    labelIndicators: 'اندیکاتورهای تکنیکال',
    labelProb: 'تحلیل احتمال',
    labelFg: 'شاخص ترس و طمع',
    labelTraders: 'تحلیل تریدرهای برتر',
    labelNews: 'تحلیل اخبار',
    labelNotif: 'تنظیمات نوتیفیکیشن',
    labelEnableNotif: 'فعال‌سازی نوتیفیکیشن‌ها',
    labelMinProb: 'حداقل آستانه احتمال',
    labelFreq: 'فرکانس نوتیفیکیشن',
    labelLastNotif: 'آخرین نوتیفیکیشن‌ها',
    labelAutoRefresh: 'بروزرسانی خودکار',
    labelSeconds: 'ثانیه',
    analyzeBtn: '🔍 تحلیل الان'
  }
};

// ============================================
// UTILITY FUNCTIONS
// ============================================
function t(key) {
  var lang = window.AppState.language;
  return translations[lang] && translations[lang][key] ? translations[lang][key] : (translations.en[key] || key);
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

// ============================================
// LANGUAGE TOGGLE
// ============================================
function toggleLanguage() {
  window.AppState.language = window.AppState.language === 'fa' ? 'en' : 'fa';
  localStorage.setItem('cryptoLang', window.AppState.language);
  
  document.documentElement.lang = window.AppState.language;
  document.documentElement.dir = window.AppState.language === 'fa' ? 'rtl' : 'ltr';
  
  // Update UI text
  document.getElementById('app-title').textContent = t('appTitle');
  document.getElementById('app-subtitle').textContent = t('appSubtitle');
  document.getElementById('lang-btn').textContent = t('langSwitch');
  document.getElementById('label-crypto').textContent = t('labelCrypto');
  document.getElementById('label-tf').textContent = t('labelTf');
  document.getElementById('label-chart').textContent = t('labelChart');
  document.getElementById('label-indicators').textContent = t('labelIndicators');
  document.getElementById('label-prob').textContent = t('labelProb');
  document.getElementById('label-fg').textContent = t('labelFg');
  document.getElementById('label-traders').textContent = t('labelTraders');
  document.getElementById('label-news').textContent = t('labelNews');
  document.getElementById('label-notif').textContent = t('labelNotif');
  document.getElementById('label-enablenotif').textContent = t('labelEnableNotif');
  document.getElementById('label-minprob').textContent = t('labelMinProb');
  document.getElementById('label-freq').textContent = t('labelFreq');
  document.getElementById('label-lastnotif').textContent = t('labelLastNotif');
  document.getElementById('label-autorefresh').textContent = t('labelAutoRefresh');
  document.getElementById('label-seconds').textContent = t('labelSeconds');
  document.getElementById('analyze-btn').textContent = t('analyzeBtn');
  document.getElementById('no-notif-text').textContent = t('noNotif');
  
  document.title = t('appTitle');
  
  // Re-render if analysis exists
  if (window.AppState.lastAnalysis) {
    renderSignalCard(window.AppState.lastAnalysis);
  }
  
  console.log('🌐 Language changed to:', window.AppState.language);
}

// ============================================
// CANDLESTICK CHART
// ============================================
function CandlestickChart(canvasId) {
  this.canvas = document.getElementById(canvasId);
  this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
  this.data = [];
  this.indicators = {};
  
  if (this.canvas) {
    this.setupCanvas();
  }
}

CandlestickChart.prototype.setupCanvas = function() {
  var self = this;
  
  function resize() {
    var container = self.canvas.parentElement;
    var width = container.clientWidth;
    var height = 500;
    
    self.canvas.width = width * window.devicePixelRatio;
    self.canvas.height = height * window.devicePixelRatio;
    self.canvas.style.width = width + 'px';
    self.canvas.style.height = height + 'px';
    
    self.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    self.width = width;
    self.height = height;
    
    if (self.data.length > 0) self.render();
  }
  
  resize();
  window.addEventListener('resize', function() {
    self.ctx.setTransform(1, 0, 0, 1, 0, 0);
    resize();
  });
};

CandlestickChart.prototype.setData = function(candles, indicators) {
  this.data = candles || [];
  this.indicators = indicators || {};
  this.render();
};

CandlestickChart.prototype.render = function() {
  if (!this.ctx || !this.data || this.data.length === 0) return;
  
  var ctx = this.ctx;
  ctx.fillStyle = '#0a0a1a';
  ctx.fillRect(0, 0, this.width, this.height);
  
  var margin = { top: 20, right: 60, bottom: 30, left: 10 };
  var chartHeight = this.height - margin.top - margin.bottom;
  var chartWidth = this.width - margin.left - margin.right;
  
  var prices = [];
  for (var i = 0; i < this.data.length; i++) {
    prices.push(this.data[i].high);
    prices.push(this.data[i].low);
  }
  var minPrice = Math.min.apply(null, prices);
  var maxPrice = Math.max.apply(null, prices);
  var priceRange = maxPrice - minPrice;
  var pricePadding = priceRange * 0.05;
  
  var adjustedMin = minPrice - pricePadding;
  var adjustedMax = maxPrice + pricePadding;
  var adjustedRange = adjustedMax - adjustedMin;
  
  // Draw EMA lines if available
  if (this.indicators.ema9 && this.indicators.ema21) {
    this.drawLine(this.indicators.ema9, '#f59e0b', margin, chartWidth, chartHeight, adjustedMin, adjustedRange);
    this.drawLine(this.indicators.ema21, '#8b5cf6', margin, chartWidth, chartHeight, adjustedMin, adjustedRange);
  }
  
  // Draw candles
  var candleWidth = chartWidth / this.data.length;
  var bodyWidth = Math.max(candleWidth * 0.7, 2);
  
  for (var i = 0; i < this.data.length; i++) {
    var candle = this.data[i];
    var x = margin.left + i * candleWidth + candleWidth / 2;
    var isBullish = candle.close >= candle.open;
    var color = isBullish ? '#22c55e' : '#ef4444';
    
    var highY = margin.top + (adjustedMax - candle.high) / adjustedRange * chartHeight;
    var lowY = margin.top + (adjustedMax - candle.low) / adjustedRange * chartHeight;
    
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, highY);
    ctx.lineTo(x, lowY);
    ctx.stroke();
    
    var openY = margin.top + (adjustedMax - candle.open) / adjustedRange * chartHeight;
    var closeY = margin.top + (adjustedMax - candle.close) / adjustedRange * chartHeight;
    var bodyTop = Math.min(openY, closeY);
    var bodyHeight = Math.max(Math.abs(closeY - openY), 1);
    
    ctx.fillStyle = color;
    ctx.fillRect(x - bodyWidth / 2, bodyTop, bodyWidth, bodyHeight);
  }
};

CandlestickChart.prototype.drawLine = function(data, color, margin, chartWidth, chartHeight, adjustedMin, adjustedRange) {
  if (!data || data.length === 0) return;
  
  var ctx = this.ctx;
  var candleWidth = chartWidth / this.data.length;
  
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  
  for (var i = 0; i < data.length; i++) {
    var x = margin.left + (i + (this.data.length - data.length)) * candleWidth + candleWidth / 2;
    var y = margin.top + chartHeight - (data[i] - adjustedMin) / adjustedRange * chartHeight;
    
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  
  ctx.stroke();
};

// ============================================
// DATA FETCHING
// ============================================
function fetchCryptoData(cryptoId, timeframe) {
  var symbolMap = {
    'bitcoin': 'BTCUSDT', 'ethereum': 'ETHUSDT', 'binancecoin': 'BNBUSDT',
    'ripple': 'XRPUSDT', 'cardano': 'ADAUSDT', 'solana': 'SOLUSDT',
    'dogecoin': 'DOGEUSDT', 'polkadot': 'DOTUSDT', 'avalanche-2': 'AVAXUSDT',
    'chainlink': 'LINKUSDT', 'tron': 'TRXUSDT', 'litecoin': 'LTCUSDT',
    'matic-network': 'MATICUSDT', 'uniswap': 'UNIUSDT', 'stellar': 'XLMUSDT'
  };

  var intervalMap = {
    '5m': '5m', '15m': '15m', '30m': '30m',
    '1h': '1h', '4h': '4h', '1d': '1d', '1w': '1w', '1M': '1M'
  };

  var symbol = symbolMap[cryptoId] || 'BTCUSDT';
  var interval = intervalMap[timeframe] || '1d';

  return fetch('https://data-api.binance.vision/api/v3/klines?symbol=' + symbol + '&interval=' + interval + '&limit=200')
    .then(function(response) {
      if (!response.ok) throw new Error('API Error: ' + response.status);
      return response.json();
    })
    .then(function(data) {
      if (!Array.isArray(data) || data.length === 0) throw new Error('Empty data');

      var candles = data.map(function(k) {
        return {
          time: parseInt(k[0]),
          open: parseFloat(k[1]),
          high: parseFloat(k[2]),
          low: parseFloat(k[3]),
          close: parseFloat(k[4]),
          volume: parseFloat(k[5])
        };
      });

      console.log('✅ Binance: ' + candles.length + ' candles, Latest: $' + candles[candles.length - 1].close);
      window.AppState.dataSource = 'Binance Vision';
      return candles;
    })
    .catch(function(error) {
      console.error('❌ Binance failed:', error.message);
      window.AppState.dataSource = 'Demo';
      return generateFallbackData(cryptoId);
    });
}

function generateFallbackData(cryptoId) {
  var basePrice = cryptoId === 'bitcoin' ? 67000 : cryptoId === 'ethereum' ? 3500 : 100;
  var candles = [];
  var price = basePrice;

  for (var i = 0; i < 200; i++) {
    var change = (Math.random() - 0.5) * basePrice * 0.02;
    price += change;

    candles.push({
      time: Date.now() - (200 - i) * 86400000,
      open: price,
      high: price * 1.01,
      low: price * 0.99,
      close: price + (Math.random() - 0.5) * basePrice * 0.01,
      volume: Math.random() * 1000000
    });
  }

  console.warn('⚠️ Using demo data');
  return Promise.resolve(candles);
}

function fetchFearGreedIndex() {
  return fetch('https://api.alternative.me/fng/?limit=10')
    .then(function(response) { return response.json(); })
    .then(function(data) {
      var values = data.data.map(function(d) { return parseInt(d.value); });
      var value = values[0];
      var classification = data.data[0].value_classification;
      
      // Calculate trend
      var trend = 'stable';
      if (values[0] > values[values.length - 1] + 5) trend = 'rising';
      else if (values[0] < values[values.length - 1] - 5) trend = 'falling';
      
      var avg = values.reduce(function(a, b) { return a + b; }, 0) / values.length;
      
      return { 
        value: value, 
        classification: classification,
        trend: trend,
        history: values,
        average: Math.round(avg)
      };
    })
    .catch(function(error) {
      console.warn('Fear & Greed API failed');
      return { value: 50, classification: 'Neutral', trend: 'stable', history: [50], average: 50 };
    });
}

// ============================================
// NEW: 24H VOLUME & MOMENTUM
// ============================================
function fetch24hrMomentum(cryptoId) {
  var symbolMap = {
    'bitcoin': 'BTCUSDT', 'ethereum': 'ETHUSDT', 'binancecoin': 'BNBUSDT',
    'ripple': 'XRPUSDT', 'cardano': 'ADAUSDT', 'solana': 'SOLUSDT',
    'dogecoin': 'DOGEUSDT', 'polkadot': 'DOTUSDT', 'avalanche-2': 'AVAXUSDT',
    'chainlink': 'LINKUSDT', 'tron': 'TRXUSDT', 'litecoin': 'LTCUSDT',
    'matic-network': 'MATICUSDT', 'uniswap': 'UNIUSDT', 'stellar': 'XLMUSDT'
  };

  var symbol = symbolMap[cryptoId] || 'BTCUSDT';

  return fetch('https://data-api.binance.vision/api/v3/ticker/24hr?symbol=' + symbol)
    .then(function(response) {
      if (!response.ok) throw new Error('24hr API Error');
      return response.json();
    })
    .then(function(data) {
      var changePercent = parseFloat(data.priceChangePercent);
      var volume = parseFloat(data.quoteVolume);
      var high = parseFloat(data.highPrice);
      var low = parseFloat(data.lowPrice);
      
      var signal = 'neutral';
      if (changePercent > 5) signal = 'bullish';
      else if (changePercent < -5) signal = 'bearish';
      else if (changePercent > 2) signal = 'slightly_bullish';
      else if (changePercent < -2) signal = 'slightly_bearish';
      
      console.log('✅ 24h Momentum: ' + changePercent.toFixed(2) + '%, Volume: $' + (volume/1e9).toFixed(2) + 'B');
      
      return {
        changePercent: Math.round(changePercent * 100) / 100,
        volume: Math.round(volume),
        high: high,
        low: low,
        signal: signal
      };
    })
    .catch(function(error) {
      console.warn('⚠️ 24hr Momentum failed:', error.message);
      return { changePercent: 0, volume: 0, signal: 'neutral' };
    });
}

// ============================================
// NEW: MARKET OVERVIEW (CoinGecko Global)
// ============================================
function fetchMarketOverview() {
  return fetch('https://api.coingecko.com/api/v3/global')
    .then(function(response) {
      if (!response.ok) throw new Error('Market API Error');
      return response.json();
    })
    .then(function(data) {
      var d = data.data;
      var totalMarketCap = d.total_market_cap.usd;
      var totalVolume = d.total_volume.usd;
      var btcDominance = d.market_cap_percentage.btc;
      var marketChange = d.market_cap_change_percentage_24h_usd;
      
      var signal = 'neutral';
      if (marketChange > 3) signal = 'bullish';
      else if (marketChange < -3) signal = 'bearish';
      
      console.log('✅ Market: $' + (totalMarketCap/1e12).toFixed(2) + 'T, Change: ' + marketChange.toFixed(2) + '%');
      
      return {
        totalMarketCap: totalMarketCap,
        totalVolume: totalVolume,
        btcDominance: Math.round(btcDominance * 10) / 10,
        marketChange: Math.round(marketChange * 100) / 100,
        signal: signal
      };
    })
    .catch(function(error) {
      console.warn('⚠️ Market Overview failed:', error.message);
      return { totalMarketCap: 0, totalVolume: 0, btcDominance: 0, marketChange: 0, signal: 'neutral' };
    });
}

// ============================================
// NEW: TRENDING COINS
// ============================================
function fetchTrendingCoins() {
  return fetch('https://api.coingecko.com/api/v3/search/trending')
    .then(function(response) {
      if (!response.ok) throw new Error('Trending API Error');
      return response.json();
    })
    .then(function(data) {
      var coins = (data.coins || []).slice(0, 5).map(function(c) {
        var item = c.item || {};
        return {
          symbol: item.symbol,
          name: item.name,
          marketCapRank: item.market_cap_rank
        };
      });
      
      console.log('✅ Trending: ' + coins.map(function(c) { return c.symbol; }).join(', '));
      
      return { coins: coins };
    })
    .catch(function(error) {
      console.warn('⚠️ Trending failed:', error.message);
      return { coins: [] };
    });
}

// ============================================
// NEW: RSI DIVERGENCE DETECTION
// ============================================
function detectRSIDivergence(candles) {
  if (!candles || candles.length < 30) return { divergence: 'none', signal: 'neutral' };
  
  var closes = candles.map(function(c) { return c.close; });
  var rsiValues = [];
  
  // Calculate RSI for last 30 candles
  for (var i = 0; i < 30; i++) {
    var slice = closes.slice(0, closes.length - 29 + i);
    if (slice.length >= 15) {
      var rsi = calculateRSI(slice, 14);
      rsiValues.push({ price: slice[slice.length - 1], rsi: rsi.value, index: i });
    }
  }
  
  if (rsiValues.length < 20) return { divergence: 'none', signal: 'neutral' };
  
  // Find swing highs and lows
  var priceHighs = [];
  var priceLows = [];
  
  for (var i = 2; i < rsiValues.length - 2; i++) {
    if (rsiValues[i].price > rsiValues[i-1].price && rsiValues[i].price > rsiValues[i-2].price &&
        rsiValues[i].price > rsiValues[i+1].price && rsiValues[i].price > rsiValues[i+2].price) {
      priceHighs.push(rsiValues[i]);
    }
    if (rsiValues[i].price < rsiValues[i-1].price && rsiValues[i].price < rsiValues[i-2].price &&
        rsiValues[i].price < rsiValues[i+1].price && rsiValues[i].price < rsiValues[i+2].price) {
      priceLows.push(rsiValues[i]);
    }
  }
  
  // Detect bearish divergence: price higher high, RSI lower high
  if (priceHighs.length >= 2) {
    var lastHigh = priceHighs[priceHighs.length - 1];
    var prevHigh = priceHighs[priceHighs.length - 2];
    
    if (lastHigh.price > prevHigh.price && lastHigh.rsi < prevHigh.rsi) {
      console.log('✅ RSI Divergence: Bearish');
      return { divergence: 'bearish', signal: 'bearish' };
    }
  }
  
  // Detect bullish divergence: price lower low, RSI higher low
  if (priceLows.length >= 2) {
    var lastLow = priceLows[priceLows.length - 1];
    var prevLow = priceLows[priceLows.length - 2];
    
    if (lastLow.price < prevLow.price && lastLow.rsi > prevLow.rsi) {
      console.log('✅ RSI Divergence: Bullish');
      return { divergence: 'bullish', signal: 'bullish' };
    }
  }
  
  return { divergence: 'none', signal: 'neutral' };
}

// ============================================
// NEW: CANDLESTICK PATTERNS
// ============================================
function detectCandlestickPatterns(candles) {
  if (!candles || candles.length < 5) return { patterns: [], signal: 'neutral', score: 0 };
  
  var recent = candles.slice(-5);
  var patterns = [];
  var score = 0;
  
  for (var i = 1; i < recent.length; i++) {
    var curr = recent[i];
    var prev = recent[i - 1];
    
    var body = Math.abs(curr.close - curr.open);
    var range = curr.high - curr.low;
    var upperWick = curr.high - Math.max(curr.open, curr.close);
    var lowerWick = Math.min(curr.open, curr.close) - curr.low;
    
    // Hammer (Bullish reversal)
    if (lowerWick > body * 2 && upperWick < body * 0.3 && curr.close > curr.open) {
      patterns.push({ name: 'Hammer', type: 'bullish', weight: 10 });
      score += 10;
    }
    
    // Shooting Star (Bearish reversal)
    if (upperWick > body * 2 && lowerWick < body * 0.3 && curr.close < curr.open) {
      patterns.push({ name: 'Shooting Star', type: 'bearish', weight: 10 });
      score -= 10;
    }
    
    // Bullish Engulfing
    if (prev.close < prev.open && curr.close > curr.open &&
        curr.open < prev.close && curr.close > prev.open) {
      patterns.push({ name: 'Bullish Engulfing', type: 'bullish', weight: 12 });
      score += 12;
    }
    
    // Bearish Engulfing
    if (prev.close > prev.open && curr.close < curr.open &&
        curr.open > prev.close && curr.close < prev.open) {
      patterns.push({ name: 'Bearish Engulfing', type: 'bearish', weight: 12 });
      score -= 12;
    }
    
    // Doji (Indecision)
    if (body < range * 0.1 && range > 0) {
      patterns.push({ name: 'Doji', type: 'neutral', weight: 3 });
    }
  }
  
  var signal = 'neutral';
  if (score > 10) signal = 'bullish';
  else if (score < -10) signal = 'bearish';
  
  console.log('✅ Candlestick Patterns: ' + patterns.length + ' detected, Score: ' + score);
  
  return { patterns: patterns, signal: signal, score: score };
}

// ============================================
// NEW: MARKET STRUCTURE (HH/HL/LH/LL)
// ============================================
function analyzeMarketStructure(candles) {
  if (!candles || candles.length < 20) return { structure: 'ranging', trend: 'neutral', score: 0 };
  
  var recent = candles.slice(-20);
  var highs = [];
  var lows = [];
  
  // Find swing highs and lows
  for (var i = 2; i < recent.length - 2; i++) {
    if (recent[i].high > recent[i-1].high && recent[i].high > recent[i-2].high &&
        recent[i].high > recent[i+1].high && recent[i].high > recent[i+2].high) {
      highs.push(recent[i].high);
    }
    if (recent[i].low < recent[i-1].low && recent[i].low < recent[i-2].low &&
        recent[i].low < recent[i+1].low && recent[i].low < recent[i+2].low) {
      lows.push(recent[i].low);
    }
  }
  
  var structure = 'ranging';
  var trend = 'neutral';
  var score = 0;
  
  if (highs.length >= 2 && lows.length >= 2) {
    var lastHigh = highs[highs.length - 1];
    var prevHigh = highs[highs.length - 2];
    var lastLow = lows[lows.length - 1];
    var prevLow = lows[lows.length - 2];
    
    if (lastHigh > prevHigh && lastLow > prevLow) {
      structure = 'uptrend';
      trend = 'bullish';
      score = 15;
    } else if (lastHigh < prevHigh && lastLow < prevLow) {
      structure = 'downtrend';
      trend = 'bearish';
      score = -15;
    } else if (lastHigh > prevHigh && lastLow < prevLow) {
      structure = 'expanding';
      trend = 'neutral';
      score = 0;
    } else if (lastHigh < prevHigh && lastLow > prevLow) {
      structure = 'contracting';
      trend = 'neutral';
      score = 0;
    }
  }
  
  console.log('✅ Market Structure: ' + structure + ' (' + trend + ')');
  
  return { structure: structure, trend: trend, score: score };
}

// ============================================
// NEW: SMART MONEY CONCEPTS (Order Blocks & FVG)
// ============================================
function detectSmartMoneyConcepts(candles) {
  if (!candles || candles.length < 20) return { orderBlocks: [], fvg: [], signal: 'neutral', score: 0 };
  
  var recent = candles.slice(-20);
  var currentPrice = candles[candles.length - 1].close;
  var orderBlocks = [];
  var fvg = [];
  var score = 0;
  
  // Detect Order Blocks (strong institutional candles)
  for (var i = 2; i < recent.length - 1; i++) {
    var body = Math.abs(recent[i].close - recent[i].open);
    var range = recent[i].high - recent[i].low;
    
    // Strong bullish candle (potential bullish OB)
    if (body > range * 0.7 && recent[i].close > recent[i].open &&
        body > (recent[i-1].high - recent[i-1].low) * 1.5) {
      orderBlocks.push({
        type: 'bullish',
        high: recent[i].open,
        low: recent[i].close,
        strength: body / range
      });
    }
    
    // Strong bearish candle (potential bearish OB)
    if (body > range * 0.7 && recent[i].close < recent[i].open &&
        body > (recent[i-1].high - recent[i-1].low) * 1.5) {
      orderBlocks.push({
        type: 'bearish',
        high: recent[i].close,
        low: recent[i].open,
        strength: body / range
      });
    }
  }
  
  // Detect Fair Value Gaps (FVG)
  for (var i = 2; i < recent.length; i++) {
    // Bullish FVG
    if (recent[i].low > recent[i-2].high) {
      fvg.push({
        type: 'bullish',
        top: recent[i].low,
        bottom: recent[i-2].high,
        filled: currentPrice < recent[i-2].high
      });
    }
    // Bearish FVG
    if (recent[i].high < recent[i-2].low) {
      fvg.push({
        type: 'bearish',
        top: recent[i-2].low,
        bottom: recent[i].high,
        filled: currentPrice > recent[i-2].low
      });
    }
  }
  
  // Check if price is near order blocks
  var activeBullishOB = orderBlocks.find(function(ob) {
    return ob.type === 'bullish' &&
           currentPrice >= ob.low * 0.99 &&
           currentPrice <= ob.high * 1.01;
  });
  
  var activeBearishOB = orderBlocks.find(function(ob) {
    return ob.type === 'bearish' &&
           currentPrice <= ob.high * 1.01 &&
           currentPrice >= ob.low * 0.99;
  });
  
  if (activeBullishOB) {
    score += 12;
  }
  if (activeBearishOB) {
    score -= 12;
  }
  
  // Check unfilled FVGs
  var unfilledBullishFVG = fvg.filter(function(f) { return f.type === 'bullish' && !f.filled; });
  var unfilledBearishFVG = fvg.filter(function(f) { return f.type === 'bearish' && !f.filled; });
  
  if (unfilledBullishFVG.length > 0) score += 5;
  if (unfilledBearishFVG.length > 0) score -= 5;
  
  var signal = 'neutral';
  if (score > 10) signal = 'bullish';
  else if (score < -10) signal = 'bearish';
  
  console.log('✅ Smart Money: ' + orderBlocks.length + ' OBs, ' + fvg.length + ' FVGs, Score: ' + score);
  
  return {
    orderBlocks: orderBlocks,
    fvg: fvg,
    activeBullishOB: activeBullishOB,
    activeBearishOB: activeBearishOB,
    signal: signal,
    score: score
  };
}

// ============================================
// NEW: VOLUME PROFILE (POC, VAH, VAL)
// ============================================
function analyzeVolumeProfile(candles) {
  if (!candles || candles.length < 50) return { poc: 0, vah: 0, val: 0, signal: 'neutral', score: 0 };
  
  var recent = candles.slice(-50);
  var prices = [];
  var volumes = [];
  
  for (var i = 0; i < recent.length; i++) {
    prices.push(recent[i].close);
    volumes.push(recent[i].volume);
  }
  
  var minPrice = Math.min.apply(null, prices);
  var maxPrice = Math.max.apply(null, prices);
  var priceRange = maxPrice - minPrice;
  
  if (priceRange === 0) return { poc: 0, vah: 0, val: 0, signal: 'neutral', score: 0 };
  
  var binCount = 20;
  var binSize = priceRange / binCount;
  
  // Create volume profile
  var profile = {};
  for (var i = 0; i < recent.length; i++) {
    var bin = Math.floor((recent[i].close - minPrice) / binSize);
    if (bin >= binCount) bin = binCount - 1;
    profile[bin] = (profile[bin] || 0) + recent[i].volume;
  }
  
  // Find POC (Point of Control - highest volume)
  var maxVolume = 0;
  var pocBin = 0;
  for (var bin in profile) {
    if (profile[bin] > maxVolume) {
      maxVolume = profile[bin];
      pocBin = parseInt(bin);
    }
  }
  
  var poc = minPrice + (pocBin + 0.5) * binSize;
  
  // Calculate Value Area (70% of volume)
  var totalVolume = 0;
  for (var bin in profile) {
    totalVolume += profile[bin];
  }
  
  var valueAreaVolume = totalVolume * 0.7;
  var accumulated = 0;
  var binsSorted = Object.keys(profile).map(Number).sort(function(a, b) {
    return profile[b] - profile[a];
  });
  
  var valueAreaBins = [];
  for (var i = 0; i < binsSorted.length; i++) {
    var bin = binsSorted[i];
    accumulated += profile[bin];
    valueAreaBins.push(bin);
    if (accumulated >= valueAreaVolume) break;
  }
  
  var vah = minPrice + (Math.max.apply(null, valueAreaBins) + 1) * binSize;
  var val = minPrice + Math.min.apply(null, valueAreaBins) * binSize;
  
  var currentPrice = candles[candles.length - 1].close;
  var signal = 'neutral';
  var score = 0;
  
  if (currentPrice > vah) {
    signal = 'bullish';
    score = 10;
  } else if (currentPrice < val) {
    signal = 'bearish';
    score = -10;
  }
  
  console.log('✅ Volume Profile: POC=$' + poc.toFixed(2) + ', VAH=$' + vah.toFixed(2) + ', VAL=$' + val.toFixed(2));
  
  return { poc: poc, vah: vah, val: val, signal: signal, score: score };
}

// ============================================
// NEW: ADX TREND STRENGTH
// ============================================
function calculateADX(candles, period) {
  period = period || 14;
  if (!candles || candles.length < period * 2) return { value: 0, trendStrength: 'weak', signal: 'neutral', score: 0 };
  
  var plusDM = 0;
  var minusDM = 0;
  var trSum = 0;
  
  for (var i = candles.length - period; i < candles.length; i++) {
    var high = candles[i].high;
    var low = candles[i].low;
    var prevHigh = candles[i - 1].high;
    var prevLow = candles[i - 1].low;
    var prevClose = candles[i - 1].close;
    
    var upMove = high - prevHigh;
    var downMove = prevLow - low;
    
    if (upMove > downMove && upMove > 0) plusDM += upMove;
    if (downMove > upMove && downMove > 0) minusDM += downMove;
    
    var tr = Math.max(
      high - low,
      Math.abs(high - prevClose),
      Math.abs(low - prevClose)
    );
    trSum += tr;
  }
  
  var plusDI = (plusDM / trSum) * 100;
  var minusDI = (minusDM / trSum) * 100;
  var dx = (Math.abs(plusDI - minusDI) / (plusDI + minusDI)) * 100;
  
  var trendStrength = 'weak';
  if (dx > 50) trendStrength = 'very_strong';
  else if (dx > 25) trendStrength = 'strong';
  else if (dx > 20) trendStrength = 'moderate';
  
  var signal = 'neutral';
  var score = 0;
  
  if (dx > 25) {
    if (plusDI > minusDI) {
      signal = 'bullish';
      score = 10;
    } else {
      signal = 'bearish';
      score = -10;
    }
  }
  
  console.log('✅ ADX: ' + dx.toFixed(2) + ' (' + trendStrength + '), Signal: ' + signal);
  
  return {
    value: Math.round(dx * 100) / 100,
    trendStrength: trendStrength,
    plusDI: Math.round(plusDI * 100) / 100,
    minusDI: Math.round(minusDI * 100) / 100,
    signal: signal,
    score: score
  };
}

// ============================================
// NEW: ICHIMOKU CLOUD
// ============================================
function calculateIchimoku(candles) {
  if (!candles || candles.length < 52) return { signal: 'neutral', score: 0 };
  
  var closes = candles.map(function(c) { return c.close; });
  var highs = candles.map(function(c) { return c.high; });
  var lows = candles.map(function(c) { return c.low; });
  
  var tenkanHigh = Math.max.apply(null, highs.slice(-9));
  var tenkanLow = Math.min.apply(null, lows.slice(-9));
  var tenkan = (tenkanHigh + tenkanLow) / 2;
  
  var kijunHigh = Math.max.apply(null, highs.slice(-26));
  var kijunLow = Math.min.apply(null, lows.slice(-26));
  var kijun = (kijunHigh + kijunLow) / 2;
  
  var senkouA = (tenkan + kijun) / 2;
  
  var senkouBHigh = Math.max.apply(null, highs.slice(-52));
  var senkouBLow = Math.min.apply(null, lows.slice(-52));
  var senkouB = (senkouBHigh + senkouBLow) / 2;
  
  var currentPrice = closes[closes.length - 1];
  var signal = 'neutral';
  var score = 0;
  
  if (currentPrice > senkouA && currentPrice > senkouB) {
    signal = 'bullish';
    score = 10;
  } else if (currentPrice < senkouA && currentPrice < senkouB) {
    signal = 'bearish';
    score = -10;
  }
  
  if (tenkan > kijun && signal === 'neutral') {
    signal = 'bullish';
    score = 5;
  } else if (tenkan < kijun && signal === 'neutral') {
    signal = 'bearish';
    score = -5;
  }
  
  console.log('✅ Ichimoku: Signal=' + signal + ', Cloud=[' + senkouA.toFixed(2) + '-' + senkouB.toFixed(2) + ']');
  
  return { signal: signal, score: score };
}

// ============================================
// NEW: FIBONACCI RETRACEMENT
// ============================================
function calculateFibonacci(candles) {
  if (!candles || candles.length < 50) return { levels: {}, signal: 'neutral', score: 0 };
  
  var closes = candles.map(function(c) { return c.close; });
  var recent = closes.slice(-50);
  
  var high = Math.max.apply(null, recent);
  var low = Math.min.apply(null, recent);
  var diff = high - low;
  
  var currentPrice = closes[closes.length - 1];
  
  var levels = {
    level_0: high,
    level_236: high - (diff * 0.236),
    level_382: high - (diff * 0.382),
    level_500: high - (diff * 0.5),
    level_618: high - (diff * 0.618),
    level_786: high - (diff * 0.786),
    level_100: low
  };
  
  var signal = 'neutral';
  var score = 0;
  
  var tolerance = diff * 0.01;
  
  if (Math.abs(currentPrice - levels.level_618) < tolerance) {
    signal = 'bullish';
    score = 8;
  } else if (Math.abs(currentPrice - levels.level_382) < tolerance) {
    signal = 'bearish';
    score = -8;
  } else if (Math.abs(currentPrice - levels.level_500) < tolerance) {
    signal = 'neutral';
    score = 0;
  } else if (currentPrice < levels.level_618 && currentPrice > levels.level_786) {
    signal = 'bullish';
    score = 5;
  }
  
  console.log('✅ Fibonacci: Signal=' + signal + ', 0.618=' + levels.level_618.toFixed(2));
  
  return { levels: levels, signal: signal, score: score };
}

// ============================================
// NEW: CORRELATION ANALYSIS (with BTC)
// ============================================
function calculateCorrelation(candles) {
  if (!candles || candles.length < 30) return { correlation: 0, signal: 'neutral', score: 0 };
  
  var closes = candles.map(function(c) { return c.close; });
  
  var returns = [];
  for (var i = 1; i < closes.length; i++) {
    returns.push((closes[i] - closes[i-1]) / closes[i-1]);
  }
  
  var avgReturn = returns.reduce(function(a, b) { return a + b; }, 0) / returns.length;
  var variance = returns.reduce(function(sum, r) { return sum + Math.pow(r - avgReturn, 2); }, 0) / returns.length;
  var stdDev = Math.sqrt(variance);
  
  var correlation = stdDev > 0 ? avgReturn / stdDev : 0;
  
  var signal = 'neutral';
  var score = 0;
  
  if (correlation > 0.5) {
    signal = 'bullish';
    score = 5;
  } else if (correlation < -0.3) {
    signal = 'bearish';
    score = -5;
  }
  
  console.log('✅ Correlation: ' + correlation.toFixed(3) + ', Signal=' + signal);
  
  return { correlation: correlation, signal: signal, score: score };
}

// ============================================
// NEW: VOLATILITY INDEX
// ============================================
function calculateVolatilityIndex(candles, period) {
  period = period || 20;
  if (!candles || candles.length < period) return { volatility: 0, signal: 'neutral', score: 0 };
  
  var closes = candles.map(function(c) { return c.close; });
  var recent = closes.slice(-period);
  
  var mean = recent.reduce(function(a, b) { return a + b; }, 0) / recent.length;
  var variance = recent.reduce(function(sum, price) {
    return sum + Math.pow(price - mean, 2);
  }, 0) / recent.length;
  
  var stdDev = Math.sqrt(variance);
  var volatility = (stdDev / mean) * 100;
  
  var signal = 'neutral';
  var score = 0;
  
  if (volatility < 2) {
    signal = 'bullish';
    score = 5;
  } else if (volatility > 10) {
    signal = 'bearish';
    score = -5;
  }
  
  console.log('✅ Volatility: ' + volatility.toFixed(2) + '%, Signal=' + signal);
  
  return { volatility: volatility, signal: signal, score: score };
}

// ============================================
// NEW: MACHINE LEARNING SIGNALS (Weighted Ensemble)
// ============================================
function calculateMLSignals(candles) {
  if (!candles || candles.length < 50) return { signal: 'neutral', score: 0, confidence: 0 };
  
  var closes = candles.map(function(c) { return c.close; });
  var volumes = candles.map(function(c) { return c.volume; });
  
  var momentum5 = (closes[closes.length - 1] - closes[closes.length - 6]) / closes[closes.length - 6];
  
  var recentVol = volumes.slice(-5).reduce(function(a, b) { return a + b; }, 0) / 5;
  var prevVol = volumes.slice(-10, -5).reduce(function(a, b) { return a + b; }, 0) / 5;
  var volumeTrend = (recentVol - prevVol) / prevVol;
  
  var sma50 = closes.slice(-50).reduce(function(a, b) { return a + b; }, 0) / 50;
  var distanceFromSMA = (closes[closes.length - 1] - sma50) / sma50;
  
  var rsi = calculateRSI(closes, 14);
  var macd = calculateMACD(closes);
  
  var score = 0;
  
  if (momentum5 > 0.05) score += 5;
  else if (momentum5 < -0.05) score -= 5;
  
  if (volumeTrend > 0.2 && momentum5 > 0) score += 4;
  else if (volumeTrend > 0.2 && momentum5 < 0) score -= 4;
  
  if (distanceFromSMA > 0.1) score += 4;
  else if (distanceFromSMA < -0.1) score -= 4;
  
  if (rsi.value < 30) score += 3;
  else if (rsi.value > 70) score -= 3;
  
  if (macd.histogram > 0) score += 4;
  else if (macd.histogram < 0) score -= 4;
  
  var signal = 'neutral';
  var confidence = Math.min(Math.abs(score) * 5, 100);
  
  if (score > 5) signal = 'bullish';
  else if (score < -5) signal = 'bearish';
  
  console.log('✅ ML Signal: Signal=' + signal + ', Score=' + score + ', Confidence=' + confidence + '%');
  
  return { signal: signal, score: score, confidence: confidence };
}

// ============================================
// NEW: ICHIMOKU CLOUD
// ============================================
function calculateIchimoku(candles) {
  if (!candles || candles.length < 52) return { signal: 'neutral', score: 0 };
  
  var closes = candles.map(function(c) { return c.close; });
  var highs = candles.map(function(c) { return c.high; });
  var lows = candles.map(function(c) { return c.low; });
  
  // Tenkan-sen (Conversion Line): (9-period high + 9-period low) / 2
  var tenkanHigh = Math.max.apply(null, highs.slice(-9));
  var tenkanLow = Math.min.apply(null, lows.slice(-9));
  var tenkan = (tenkanHigh + tenkanLow) / 2;
  
  // Kijun-sen (Base Line): (26-period high + 26-period low) / 2
  var kijunHigh = Math.max.apply(null, highs.slice(-26));
  var kijunLow = Math.min.apply(null, lows.slice(-26));
  var kijun = (kijunHigh + kijunLow) / 2;
  
  // Senkou Span A (Leading Span A): (Tenkan + Kijun) / 2
  var senkouA = (tenkan + kijun) / 2;
  
  // Senkou Span B (Leading Span B): (52-period high + 52-period low) / 2
  var senkouBHigh = Math.max.apply(null, highs.slice(-52));
  var senkouBLow = Math.min.apply(null, lows.slice(-52));
  var senkouB = (senkouBHigh + senkouBLow) / 2;
  
  var currentPrice = closes[closes.length - 1];
  var signal = 'neutral';
  var score = 0;
  
  // Price above cloud = bullish
  if (currentPrice > senkouA && currentPrice > senkouB) {
    signal = 'bullish';
    score = 10;
  }
  // Price below cloud = bearish
  else if (currentPrice < senkouA && currentPrice < senkouB) {
    signal = 'bearish';
    score = -10;
  }
  
  // Tenkan > Kijun = bullish momentum
  if (tenkan > kijun && signal === 'neutral') {
    signal = 'bullish';
    score = 5;
  } else if (tenkan < kijun && signal === 'neutral') {
    signal = 'bearish';
    score = -5;
  }
  
  console.log('✅ Ichimoku: Signal=' + signal + ', Price=' + currentPrice.toFixed(2) + ', Cloud=[' + senkouA.toFixed(2) + '-' + senkouB.toFixed(2) + ']');
  
  return { signal: signal, score: score };
}

// ============================================
// NEW: FIBONACCI RETRACEMENT
// ============================================
function calculateFibonacci(candles) {
  if (!candles || candles.length < 50) return { levels: {}, signal: 'neutral', score: 0 };
  
  var closes = candles.map(function(c) { return c.close; });
  var recent = closes.slice(-50);
  
  var high = Math.max.apply(null, recent);
  var low = Math.min.apply(null, recent);
  var diff = high - low;
  
  var currentPrice = closes[closes.length - 1];
  
  // Fibonacci levels
  var levels = {
    level_0: high,
    level_236: high - (diff * 0.236),
    level_382: high - (diff * 0.382),
    level_500: high - (diff * 0.5),
    level_618: high - (diff * 0.618),
    level_786: high - (diff * 0.786),
    level_100: low
  };
  
  var signal = 'neutral';
  var score = 0;
  
  // Check which level price is near (within 1%)
  var tolerance = diff * 0.01;
  
  // Price at 0.618 or 0.382 retracement = strong support/resistance
  if (Math.abs(currentPrice - levels.level_618) < tolerance) {
    signal = 'bullish';
    score = 8;
  } else if (Math.abs(currentPrice - levels.level_382) < tolerance) {
    signal = 'bearish';
    score = -8;
  } else if (Math.abs(currentPrice - levels.level_500) < tolerance) {
    // Midpoint - could go either way
    signal = 'neutral';
    score = 0;
  } else if (currentPrice < levels.level_618 && currentPrice > levels.level_786) {
    // Deep retracement - potential reversal
    signal = 'bullish';
    score = 5;
  }
  
  console.log('✅ Fibonacci: Signal=' + signal + ', Price=' + currentPrice.toFixed(2) + ', Levels=[0.382:' + levels.level_382.toFixed(2) + ', 0.5:' + levels.level_500.toFixed(2) + ', 0.618:' + levels.level_618.toFixed(2) + ']');
  
  return { levels: levels, signal: signal, score: score };
}

// ============================================
// NEW: CORRELATION ANALYSIS
// ============================================
function calculateCorrelation(candles, benchmarkCandles) {
  if (!candles || !benchmarkCandles || candles.length < 30 || benchmarkCandles.length < 30) {
    return { correlation: 0, signal: 'neutral', score: 0 };
  }
  
  var closes = candles.map(function(c) { return c.close; });
  var benchmark = benchmarkCandles.map(function(c) { return c.close; });
  
  // Calculate returns
  var returns1 = [];
  var returns2 = [];
  
  for (var i = 1; i < Math.min(closes.length, benchmark.length); i++) {
    returns1.push((closes[i] - closes[i-1]) / closes[i-1]);
    returns2.push((benchmark[i] - benchmark[i-1]) / benchmark[i-1]);
  }
  
  // Calculate correlation coefficient
  var n = returns1.length;
  var sum1 = returns1.reduce(function(a, b) { return a + b; }, 0);
  var sum2 = returns2.reduce(function(a, b) { return a + b; }, 0);
  var sum1Sq = returns1.reduce(function(a, b) { return a + b * b; }, 0);
  var sum2Sq = returns2.reduce(function(a, b) { return a + b * b; }, 0);
  var pSum = returns1.reduce(function(sum, r1, i) { return sum + r1 * returns2[i]; }, 0);
  
  var numerator = pSum - (sum1 * sum2 / n);
  var denominator = Math.sqrt((sum1Sq - sum1 * sum1 / n) * (sum2Sq - sum2 * sum2 / n));
  
  var correlation = denominator === 0 ? 0 : numerator / denominator;
  
  var signal = 'neutral';
  var score = 0;
  
  // High positive correlation = follows market
  if (correlation > 0.8) {
    signal = 'bullish';
    score = 5;
  } else if (correlation < -0.5) {
    // Negative correlation = counter-trend
    signal = 'neutral';
    score = 0;
  }
  
  console.log('✅ Correlation: ' + correlation.toFixed(3) + ', Signal=' + signal);
  
  return { correlation: correlation, signal: signal, score: score };
}

// ============================================
// NEW: VOLATILITY INDEX
// ============================================
function calculateVolatility(candles, period) {
  period = period || 20;
  if (!candles || candles.length < period) return { volatility: 0, signal: 'neutral', score: 0 };
  
  var closes = candles.map(function(c) { return c.close; });
  var recent = closes.slice(-period);
  
  // Calculate standard deviation
  var mean = recent.reduce(function(a, b) { return a + b; }, 0) / recent.length;
  var variance = recent.reduce(function(sum, price) {
    return sum + Math.pow(price - mean, 2);
  }, 0) / recent.length;
  
  var stdDev = Math.sqrt(variance);
  var volatility = (stdDev / mean) * 100; // As percentage
  
  var signal = 'neutral';
  var score = 0;
  
  // Low volatility = potential breakout
  if (volatility < 2) {
    signal = 'bullish';
    score = 5;
  }
  // High volatility = potential reversal
  else if (volatility > 10) {
    signal = 'bearish';
    score = -5;
  }
  
  console.log('✅ Volatility: ' + volatility.toFixed(2) + '%, Signal=' + signal);
  
  return { volatility: volatility, signal: signal, score: score };
}

// ============================================
// NEW: MACHINE LEARNING SIGNALS
// ============================================
function calculateMLSignals(candles) {
  if (!candles || candles.length < 50) return { signal: 'neutral', score: 0, confidence: 0 };
  
  var closes = candles.map(function(c) { return c.close; });
  var volumes = candles.map(function(c) { return c.volume; });
  
  // Feature 1: Price momentum (5-period)
  var momentum5 = (closes[closes.length - 1] - closes[closes.length - 6]) / closes[closes.length - 6];
  
  // Feature 2: Volume trend
  var recentVol = volumes.slice(-5).reduce(function(a, b) { return a + b; }, 0) / 5;
  var prevVol = volumes.slice(-10, -5).reduce(function(a, b) { return a + b; }, 0) / 5;
  var volumeTrend = (recentVol - prevVol) / prevVol;
  
  // Feature 3: Price distance from SMA50
  var sma50 = closes.slice(-50).reduce(function(a, b) { return a + b; }, 0) / 50;
  var distanceFromSMA = (closes[closes.length - 1] - sma50) / sma50;
  
  // Feature 4: RSI momentum
  var rsi = calculateRSI(closes, 14);
  
  // Feature 5: MACD histogram
  var macd = calculateMACD(closes);
  
  // Simple weighted scoring (simulating ML model)
  var score = 0;
  
  // Momentum contribution (weight: 25%)
  if (momentum5 > 0.05) score += 5;
  else if (momentum5 < -0.05) score -= 5;
  
  // Volume trend contribution (weight: 20%)
  if (volumeTrend > 0.2 && momentum5 > 0) score += 4;
  else if (volumeTrend > 0.2 && momentum5 < 0) score -= 4;
  
  // Distance from SMA contribution (weight: 20%)
  if (distanceFromSMA > 0.1) score += 4;
  else if (distanceFromSMA < -0.1) score -= 4;
  
  // RSI contribution (weight: 15%)
  if (rsi.value < 30) score += 3;
  else if (rsi.value > 70) score -= 3;
  
  // MACD contribution (weight: 20%)
  if (macd.histogram > 0) score += 4;
  else if (macd.histogram < 0) score -= 4;
  
  var signal = 'neutral';
  var confidence = Math.min(Math.abs(score) * 5, 100);
  
  if (score > 5) signal = 'bullish';
  else if (score < -5) signal = 'bearish';
  
  console.log('✅ ML Signal: Signal=' + signal + ', Score=' + score + ', Confidence=' + confidence + '%');
  
  return { signal: signal, score: score, confidence: confidence };
}

// ============================================
// NEW: ICHIMOKU CLOUD
// ============================================
function calculateIchimoku(candles) {
  if (!candles || candles.length < 52) return { signal: 'neutral', score: 0 };
  
  var closes = candles.map(function(c) { return c.close; });
  var highs = candles.map(function(c) { return c.high; });
  var lows = candles.map(function(c) { return c.low; });
  
  // Tenkan-sen (Conversion Line): (9-period high + 9-period low) / 2
  var tenkanHigh = Math.max.apply(null, highs.slice(-9));
  var tenkanLow = Math.min.apply(null, lows.slice(-9));
  var tenkan = (tenkanHigh + tenkanLow) / 2;
  
  // Kijun-sen (Base Line): (26-period high + 26-period low) / 2
  var kijunHigh = Math.max.apply(null, highs.slice(-26));
  var kijunLow = Math.min.apply(null, lows.slice(-26));
  var kijun = (kijunHigh + kijunLow) / 2;
  
  // Senkou Span A (Leading Span A): (Tenkan + Kijun) / 2
  var senkouA = (tenkan + kijun) / 2;
  
  // Senkou Span B (Leading Span B): (52-period high + 52-period low) / 2
  var senkouBHigh = Math.max.apply(null, highs.slice(-52));
  var senkouBLow = Math.min.apply(null, lows.slice(-52));
  var senkouB = (senkouBHigh + senkouBLow) / 2;
  
  var currentPrice = closes[closes.length - 1];
  var signal = 'neutral';
  var score = 0;
  
  // Price above cloud = bullish
  if (currentPrice > senkouA && currentPrice > senkouB) {
    signal = 'bullish';
    score = 10;
  }
  // Price below cloud = bearish
  else if (currentPrice < senkouA && currentPrice < senkouB) {
    signal = 'bearish';
    score = -10;
  }
  
  // Tenkan > Kijun = bullish momentum
  if (tenkan > kijun && signal === 'neutral') {
    signal = 'bullish';
    score = 5;
  } else if (tenkan < kijun && signal === 'neutral') {
    signal = 'bearish';
    score = -5;
  }
  
  console.log('✅ Ichimoku: Signal=' + signal + ', Price=' + currentPrice.toFixed(2) + ', Cloud=[' + senkouA.toFixed(2) + '-' + senkouB.toFixed(2) + ']');
  
  return { signal: signal, score: score };
}

// ============================================
// NEW: FIBONACCI RETRACEMENT
// ============================================
function calculateFibonacci(candles) {
  if (!candles || candles.length < 50) return { levels: {}, signal: 'neutral', score: 0 };
  
  var closes = candles.map(function(c) { return c.close; });
  var recent = closes.slice(-50);
  
  var high = Math.max.apply(null, recent);
  var low = Math.min.apply(null, recent);
  var diff = high - low;
  
  var currentPrice = closes[closes.length - 1];
  
  // Fibonacci levels
  var levels = {
    level_0: high,
    level_236: high - (diff * 0.236),
    level_382: high - (diff * 0.382),
    level_500: high - (diff * 0.5),
    level_618: high - (diff * 0.618),
    level_786: high - (diff * 0.786),
    level_100: low
  };
  
  var signal = 'neutral';
  var score = 0;
  
  // Check which level price is near (within 1%)
  var tolerance = diff * 0.01;
  
  // Price at 0.618 or 0.382 retracement = strong support/resistance
  if (Math.abs(currentPrice - levels.level_618) < tolerance) {
    signal = 'bullish';
    score = 8;
  } else if (Math.abs(currentPrice - levels.level_382) < tolerance) {
    signal = 'bearish';
    score = -8;
  } else if (Math.abs(currentPrice - levels.level_500) < tolerance) {
    // Midpoint - could go either way
    signal = 'neutral';
    score = 0;
  } else if (currentPrice < levels.level_618 && currentPrice > levels.level_786) {
    // Deep retracement - potential reversal
    signal = 'bullish';
    score = 5;
  }
  
  console.log('✅ Fibonacci: Signal=' + signal + ', Price=' + currentPrice.toFixed(2) + ', Levels=[0.382:' + levels.level_382.toFixed(2) + ', 0.5:' + levels.level_500.toFixed(2) + ', 0.618:' + levels.level_618.toFixed(2) + ']');
  
  return { levels: levels, signal: signal, score: score };
}

// ============================================
// NEW: CORRELATION ANALYSIS
// ============================================
function calculateCorrelation(candles, benchmarkCandles) {
  if (!candles || !benchmarkCandles || candles.length < 30 || benchmarkCandles.length < 30) {
    return { correlation: 0, signal: 'neutral', score: 0 };
  }
  
  var closes = candles.map(function(c) { return c.close; });
  var benchmark = benchmarkCandles.map(function(c) { return c.close; });
  
  // Calculate returns
  var returns1 = [];
  var returns2 = [];
  
  for (var i = 1; i < Math.min(closes.length, benchmark.length); i++) {
    returns1.push((closes[i] - closes[i-1]) / closes[i-1]);
    returns2.push((benchmark[i] - benchmark[i-1]) / benchmark[i-1]);
  }
  
  // Calculate correlation coefficient
  var n = returns1.length;
  var sum1 = returns1.reduce(function(a, b) { return a + b; }, 0);
  var sum2 = returns2.reduce(function(a, b) { return a + b; }, 0);
  var sum1Sq = returns1.reduce(function(a, b) { return a + b * b; }, 0);
  var sum2Sq = returns2.reduce(function(a, b) { return a + b * b; }, 0);
  var pSum = returns1.reduce(function(sum, r1, i) { return sum + r1 * returns2[i]; }, 0);
  
  var numerator = pSum - (sum1 * sum2 / n);
  var denominator = Math.sqrt((sum1Sq - sum1 * sum1 / n) * (sum2Sq - sum2 * sum2 / n));
  
  var correlation = denominator === 0 ? 0 : numerator / denominator;
  
  var signal = 'neutral';
  var score = 0;
  
  // High positive correlation = follows market
  if (correlation > 0.8) {
    signal = 'bullish';
    score = 5;
  } else if (correlation < -0.5) {
    // Negative correlation = counter-trend
    signal = 'neutral';
    score = 0;
  }
  
  console.log('✅ Correlation: ' + correlation.toFixed(3) + ', Signal=' + signal);
  
  return { correlation: correlation, signal: signal, score: score };
}

// ============================================
// NEW: VOLATILITY INDEX
// ============================================
function calculateVolatility(candles, period) {
  period = period || 20;
  if (!candles || candles.length < period) return { volatility: 0, signal: 'neutral', score: 0 };
  
  var closes = candles.map(function(c) { return c.close; });
  var recent = closes.slice(-period);
  
  // Calculate standard deviation
  var mean = recent.reduce(function(a, b) { return a + b; }, 0) / recent.length;
  var variance = recent.reduce(function(sum, price) {
    return sum + Math.pow(price - mean, 2);
  }, 0) / recent.length;
  
  var stdDev = Math.sqrt(variance);
  var volatility = (stdDev / mean) * 100; // As percentage
  
  var signal = 'neutral';
  var score = 0;
  
  // Low volatility = potential breakout
  if (volatility < 2) {
    signal = 'bullish';
    score = 5;
  }
  // High volatility = potential reversal
  else if (volatility > 10) {
    signal = 'bearish';
    score = -5;
  }
  
  console.log('✅ Volatility: ' + volatility.toFixed(2) + '%, Signal=' + signal);
  
  return { volatility: volatility, signal: signal, score: score };
}

// ============================================
// NEW: MACHINE LEARNING SIGNALS
// ============================================
function calculateMLSignals(candles) {
  if (!candles || candles.length < 50) return { signal: 'neutral', score: 0, confidence: 0 };
  
  var closes = candles.map(function(c) { return c.close; });
  var volumes = candles.map(function(c) { return c.volume; });
  
  // Feature 1: Price momentum (5-period)
  var momentum5 = (closes[closes.length - 1] - closes[closes.length - 6]) / closes[closes.length - 6];
  
  // Feature 2: Volume trend
  var recentVol = volumes.slice(-5).reduce(function(a, b) { return a + b; }, 0) / 5;
  var prevVol = volumes.slice(-10, -5).reduce(function(a, b) { return a + b; }, 0) / 5;
  var volumeTrend = (recentVol - prevVol) / prevVol;
  
  // Feature 3: Price distance from SMA50
  var sma50 = closes.slice(-50).reduce(function(a, b) { return a + b; }, 0) / 50;
  var distanceFromSMA = (closes[closes.length - 1] - sma50) / sma50;
  
  // Feature 4: RSI momentum
  var rsi = calculateRSI(closes, 14);
  
  // Feature 5: MACD histogram
  var macd = calculateMACD(closes);
  
  // Simple weighted scoring (simulating ML model)
  var score = 0;
  
  // Momentum contribution (weight: 25%)
  if (momentum5 > 0.05) score += 5;
  else if (momentum5 < -0.05) score -= 5;
  
  // Volume trend contribution (weight: 20%)
  if (volumeTrend > 0.2 && momentum5 > 0) score += 4;
  else if (volumeTrend > 0.2 && momentum5 < 0) score -= 4;
  
  // Distance from SMA contribution (weight: 20%)
  if (distanceFromSMA > 0.1) score += 4;
  else if (distanceFromSMA < -0.1) score -= 4;
  
  // RSI contribution (weight: 15%)
  if (rsi.value < 30) score += 3;
  else if (rsi.value > 70) score -= 3;
  
  // MACD contribution (weight: 20%)
  if (macd.histogram > 0) score += 4;
  else if (macd.histogram < 0) score -= 4;
  
  var signal = 'neutral';
  var confidence = Math.min(Math.abs(score) * 5, 100);
  
  if (score > 5) signal = 'bullish';
  else if (score < -5) signal = 'bearish';
  
  console.log('✅ ML Signal: Signal=' + signal + ', Score=' + score + ', Confidence=' + confidence + '%');
  
  return { signal: signal, score: score, confidence: confidence };
}

// ============================================
// NEW: ICHIMOKU CLOUD
// ============================================
function calculateIchimoku(candles) {
  if (!candles || candles.length < 52) return { signal: 'neutral', score: 0 };
  
  var closes = candles.map(function(c) { return c.close; });
  var highs = candles.map(function(c) { return c.high; });
  var lows = candles.map(function(c) { return c.low; });
  
  // Tenkan-sen (Conversion Line): (9-period high + 9-period low) / 2
  var tenkanHigh = Math.max.apply(null, highs.slice(-9));
  var tenkanLow = Math.min.apply(null, lows.slice(-9));
  var tenkan = (tenkanHigh + tenkanLow) / 2;
  
  // Kijun-sen (Base Line): (26-period high + 26-period low) / 2
  var kijunHigh = Math.max.apply(null, highs.slice(-26));
  var kijunLow = Math.min.apply(null, lows.slice(-26));
  var kijun = (kijunHigh + kijunLow) / 2;
  
  // Senkou Span A (Leading Span A): (Tenkan + Kijun) / 2
  var senkouA = (tenkan + kijun) / 2;
  
  // Senkou Span B (Leading Span B): (52-period high + 52-period low) / 2
  var senkouBHigh = Math.max.apply(null, highs.slice(-52));
  var senkouBLow = Math.min.apply(null, lows.slice(-52));
  var senkouB = (senkouBHigh + senkouBLow) / 2;
  
  var currentPrice = closes[closes.length - 1];
  var signal = 'neutral';
  var score = 0;
  
  // Price above cloud = bullish
  if (currentPrice > senkouA && currentPrice > senkouB) {
    signal = 'bullish';
    score = 10;
  }
  // Price below cloud = bearish
  else if (currentPrice < senkouA && currentPrice < senkouB) {
    signal = 'bearish';
    score = -10;
  }
  
  // Tenkan > Kijun = bullish momentum
  if (tenkan > kijun && signal === 'neutral') {
    signal = 'bullish';
    score = 5;
  } else if (tenkan < kijun && signal === 'neutral') {
    signal = 'bearish';
    score = -5;
  }
  
  console.log('✅ Ichimoku: Signal=' + signal + ', Price=' + currentPrice.toFixed(2) + ', Cloud=[' + senkouA.toFixed(2) + '-' + senkouB.toFixed(2) + ']');
  
  return { signal: signal, score: score };
}

// ============================================
// NEW: FIBONACCI RETRACEMENT
// ============================================
function calculateFibonacci(candles) {
  if (!candles || candles.length < 50) return { levels: {}, signal: 'neutral', score: 0 };
  
  var closes = candles.map(function(c) { return c.close; });
  var recent = closes.slice(-50);
  
  var high = Math.max.apply(null, recent);
  var low = Math.min.apply(null, recent);
  var diff = high - low;
  
  var currentPrice = closes[closes.length - 1];
  
  // Fibonacci levels
  var levels = {
    level_0: high,
    level_236: high - (diff * 0.236),
    level_382: high - (diff * 0.382),
    level_500: high - (diff * 0.5),
    level_618: high - (diff * 0.618),
    level_786: high - (diff * 0.786),
    level_100: low
  };
  
  var signal = 'neutral';
  var score = 0;
  
  // Check which level price is near (within 1%)
  var tolerance = diff * 0.01;
  
  // Price at 0.618 or 0.382 retracement = strong support/resistance
  if (Math.abs(currentPrice - levels.level_618) < tolerance) {
    signal = 'bullish';
    score = 8;
  } else if (Math.abs(currentPrice - levels.level_382) < tolerance) {
    signal = 'bearish';
    score = -8;
  } else if (Math.abs(currentPrice - levels.level_500) < tolerance) {
    // Midpoint - could go either way
    signal = 'neutral';
    score = 0;
  } else if (currentPrice < levels.level_618 && currentPrice > levels.level_786) {
    // Deep retracement - potential reversal
    signal = 'bullish';
    score = 5;
  }
  
  console.log('✅ Fibonacci: Signal=' + signal + ', Price=' + currentPrice.toFixed(2) + ', Levels=[0.382:' + levels.level_382.toFixed(2) + ', 0.5:' + levels.level_500.toFixed(2) + ', 0.618:' + levels.level_618.toFixed(2) + ']');
  
  return { levels: levels, signal: signal, score: score };
}

// ============================================
// NEW: CORRELATION ANALYSIS
// ============================================
function calculateCorrelation(candles, benchmarkCandles) {
  if (!candles || !benchmarkCandles || candles.length < 30 || benchmarkCandles.length < 30) {
    return { correlation: 0, signal: 'neutral', score: 0 };
  }
  
  var closes = candles.map(function(c) { return c.close; });
  var benchmark = benchmarkCandles.map(function(c) { return c.close; });
  
  // Calculate returns
  var returns1 = [];
  var returns2 = [];
  
  for (var i = 1; i < Math.min(closes.length, benchmark.length); i++) {
    returns1.push((closes[i] - closes[i-1]) / closes[i-1]);
    returns2.push((benchmark[i] - benchmark[i-1]) / benchmark[i-1]);
  }
  
  // Calculate correlation coefficient
  var n = returns1.length;
  var sum1 = returns1.reduce(function(a, b) { return a + b; }, 0);
  var sum2 = returns2.reduce(function(a, b) { return a + b; }, 0);
  var sum1Sq = returns1.reduce(function(a, b) { return a + b * b; }, 0);
  var sum2Sq = returns2.reduce(function(a, b) { return a + b * b; }, 0);
  var pSum = returns1.reduce(function(sum, r1, i) { return sum + r1 * returns2[i]; }, 0);
  
  var numerator = pSum - (sum1 * sum2 / n);
  var denominator = Math.sqrt((sum1Sq - sum1 * sum1 / n) * (sum2Sq - sum2 * sum2 / n));
  
  var correlation = denominator === 0 ? 0 : numerator / denominator;
  
  var signal = 'neutral';
  var score = 0;
  
  // High positive correlation = follows market
  if (correlation > 0.8) {
    signal = 'bullish';
    score = 5;
  } else if (correlation < -0.5) {
    // Negative correlation = counter-trend
    signal = 'neutral';
    score = 0;
  }
  
  console.log('✅ Correlation: ' + correlation.toFixed(3) + ', Signal=' + signal);
  
  return { correlation: correlation, signal: signal, score: score };
}

// ============================================
// NEW: VOLATILITY INDEX
// ============================================
function calculateVolatility(candles, period) {
  period = period || 20;
  if (!candles || candles.length < period) return { volatility: 0, signal: 'neutral', score: 0 };
  
  var closes = candles.map(function(c) { return c.close; });
  var recent = closes.slice(-period);
  
  // Calculate standard deviation
  var mean = recent.reduce(function(a, b) { return a + b; }, 0) / recent.length;
  var variance = recent.reduce(function(sum, price) {
    return sum + Math.pow(price - mean, 2);
  }, 0) / recent.length;
  
  var stdDev = Math.sqrt(variance);
  var volatility = (stdDev / mean) * 100; // As percentage
  
  var signal = 'neutral';
  var score = 0;
  
  // Low volatility = potential breakout
  if (volatility < 2) {
    signal = 'bullish';
    score = 5;
  }
  // High volatility = potential reversal
  else if (volatility > 10) {
    signal = 'bearish';
    score = -5;
  }
  
  console.log('✅ Volatility: ' + volatility.toFixed(2) + '%, Signal=' + signal);
  
  return { volatility: volatility, signal: signal, score: score };
}

// ============================================
// NEW: MACHINE LEARNING SIGNALS
// ============================================
function calculateMLSignals(candles) {
  if (!candles || candles.length < 50) return { signal: 'neutral', score: 0, confidence: 0 };
  
  var closes = candles.map(function(c) { return c.close; });
  var volumes = candles.map(function(c) { return c.volume; });
  
  // Feature 1: Price momentum (5-period)
  var momentum5 = (closes[closes.length - 1] - closes[closes.length - 6]) / closes[closes.length - 6];
  
  // Feature 2: Volume trend
  var recentVol = volumes.slice(-5).reduce(function(a, b) { return a + b; }, 0) / 5;
  var prevVol = volumes.slice(-10, -5).reduce(function(a, b) { return a + b; }, 0) / 5;
  var volumeTrend = (recentVol - prevVol) / prevVol;
  
  // Feature 3: Price distance from SMA50
  var sma50 = closes.slice(-50).reduce(function(a, b) { return a + b; }, 0) / 50;
  var distanceFromSMA = (closes[closes.length - 1] - sma50) / sma50;
  
  // Feature 4: RSI momentum
  var rsi = calculateRSI(closes, 14);
  
  // Feature 5: MACD histogram
  var macd = calculateMACD(closes);
  
  // Simple weighted scoring (simulating ML model)
  var score = 0;
  
  // Momentum contribution (weight: 25%)
  if (momentum5 > 0.05) score += 5;
  else if (momentum5 < -0.05) score -= 5;
  
  // Volume trend contribution (weight: 20%)
  if (volumeTrend > 0.2 && momentum5 > 0) score += 4;
  else if (volumeTrend > 0.2 && momentum5 < 0) score -= 4;
  
  // Distance from SMA contribution (weight: 20%)
  if (distanceFromSMA > 0.1) score += 4;
  else if (distanceFromSMA < -0.1) score -= 4;
  
  // RSI contribution (weight: 15%)
  if (rsi.value < 30) score += 3;
  else if (rsi.value > 70) score -= 3;
  
  // MACD contribution (weight: 20%)
  if (macd.histogram > 0) score += 4;
  else if (macd.histogram < 0) score -= 4;
  
  var signal = 'neutral';
  var confidence = Math.min(Math.abs(score) * 5, 100);
  
  if (score > 5) signal = 'bullish';
  else if (score < -5) signal = 'bearish';
  
  console.log('✅ ML Signal: Signal=' + signal + ', Score=' + score + ', Confidence=' + confidence + '%');
  
  return { signal: signal, score: score, confidence: confidence };
}

// ============================================
// NEW: ICHIMOKU CLOUD
// ============================================
function calculateIchimoku(candles) {
  if (!candles || candles.length < 52) return { signal: 'neutral', score: 0 };
  
  var closes = candles.map(function(c) { return c.close; });
  var highs = candles.map(function(c) { return c.high; });
  var lows = candles.map(function(c) { return c.low; });
  
  // Tenkan-sen (Conversion Line): (9-period high + 9-period low) / 2
  var tenkanHigh = Math.max.apply(null, highs.slice(-9));
  var tenkanLow = Math.min.apply(null, lows.slice(-9));
  var tenkan = (tenkanHigh + tenkanLow) / 2;
  
  // Kijun-sen (Base Line): (26-period high + 26-period low) / 2
  var kijunHigh = Math.max.apply(null, highs.slice(-26));
  var kijunLow = Math.min.apply(null, lows.slice(-26));
  var kijun = (kijunHigh + kijunLow) / 2;
  
  // Senkou Span A (Leading Span A): (Tenkan + Kijun) / 2
  var senkouA = (tenkan + kijun) / 2;
  
  // Senkou Span B (Leading Span B): (52-period high + 52-period low) / 2
  var senkouBHigh = Math.max.apply(null, highs.slice(-52));
  var senkouBLow = Math.min.apply(null, lows.slice(-52));
  var senkouB = (senkouBHigh + senkouBLow) / 2;
  
  var currentPrice = closes[closes.length - 1];
  var signal = 'neutral';
  var score = 0;
  
  // Price above cloud = bullish
  if (currentPrice > senkouA && currentPrice > senkouB) {
    signal = 'bullish';
    score = 10;
  }
  // Price below cloud = bearish
  else if (currentPrice < senkouA && currentPrice < senkouB) {
    signal = 'bearish';
    score = -10;
  }
  
  // Tenkan > Kijun = bullish momentum
  if (tenkan > kijun && signal === 'neutral') {
    signal = 'bullish';
    score = 5;
  } else if (tenkan < kijun && signal === 'neutral') {
    signal = 'bearish';
    score = -5;
  }
  
  console.log('✅ Ichimoku: Signal=' + signal + ', Price=' + currentPrice.toFixed(2) + ', Cloud=[' + senkouA.toFixed(2) + '-' + senkouB.toFixed(2) + ']');
  
  return { signal: signal, score: score };
}

// ============================================
// NEW: FIBONACCI RETRACEMENT
// ============================================
function calculateFibonacci(candles) {
  if (!candles || candles.length < 50) return { levels: {}, signal: 'neutral', score: 0 };
  
  var closes = candles.map(function(c) { return c.close; });
  var recent = closes.slice(-50);
  
  var high = Math.max.apply(null, recent);
  var low = Math.min.apply(null, recent);
  var diff = high - low;
  
  var currentPrice = closes[closes.length - 1];
  
  // Fibonacci levels
  var levels = {
    level_0: high,
    level_236: high - (diff * 0.236),
    level_382: high - (diff * 0.382),
    level_500: high - (diff * 0.5),
    level_618: high - (diff * 0.618),
    level_786: high - (diff * 0.786),
    level_100: low
  };
  
  var signal = 'neutral';
  var score = 0;
  
  // Check which level price is near (within 1%)
  var tolerance = diff * 0.01;
  
  // Price at 0.618 or 0.382 retracement = strong support/resistance
  if (Math.abs(currentPrice - levels.level_618) < tolerance) {
    signal = 'bullish';
    score = 8;
  } else if (Math.abs(currentPrice - levels.level_382) < tolerance) {
    signal = 'bearish';
    score = -8;
  } else if (Math.abs(currentPrice - levels.level_500) < tolerance) {
    // Midpoint - could go either way
    signal = 'neutral';
    score = 0;
  } else if (currentPrice < levels.level_618 && currentPrice > levels.level_786) {
    // Deep retracement - potential reversal
    signal = 'bullish';
    score = 5;
  }
  
  console.log('✅ Fibonacci: Signal=' + signal + ', Price=' + currentPrice.toFixed(2) + ', Levels=[0.382:' + levels.level_382.toFixed(2) + ', 0.5:' + levels.level_500.toFixed(2) + ', 0.618:' + levels.level_618.toFixed(2) + ']');
  
  return { levels: levels, signal: signal, score: score };
}

// ============================================
// NEW: CORRELATION ANALYSIS
// ============================================
function calculateCorrelation(candles, benchmarkCandles) {
  if (!candles || !benchmarkCandles || candles.length < 30 || benchmarkCandles.length < 30) {
    return { correlation: 0, signal: 'neutral', score: 0 };
  }
  
  var closes = candles.map(function(c) { return c.close; });
  var benchmark = benchmarkCandles.map(function(c) { return c.close; });
  
  // Calculate returns
  var returns1 = [];
  var returns2 = [];
  
  for (var i = 1; i < Math.min(closes.length, benchmark.length); i++) {
    returns1.push((closes[i] - closes[i-1]) / closes[i-1]);
    returns2.push((benchmark[i] - benchmark[i-1]) / benchmark[i-1]);
  }
  
  // Calculate correlation coefficient
  var n = returns1.length;
  var sum1 = returns1.reduce(function(a, b) { return a + b; }, 0);
  var sum2 = returns2.reduce(function(a, b) { return a + b; }, 0);
  var sum1Sq = returns1.reduce(function(a, b) { return a + b * b; }, 0);
  var sum2Sq = returns2.reduce(function(a, b) { return a + b * b; }, 0);
  var pSum = returns1.reduce(function(sum, r1, i) { return sum + r1 * returns2[i]; }, 0);
  
  var numerator = pSum - (sum1 * sum2 / n);
  var denominator = Math.sqrt((sum1Sq - sum1 * sum1 / n) * (sum2Sq - sum2 * sum2 / n));
  
  var correlation = denominator === 0 ? 0 : numerator / denominator;
  
  var signal = 'neutral';
  var score = 0;
  
  // High positive correlation = follows market
  if (correlation > 0.8) {
    signal = 'bullish';
    score = 5;
  } else if (correlation < -0.5) {
    // Negative correlation = counter-trend
    signal = 'neutral';
    score = 0;
  }
  
  console.log('✅ Correlation: ' + correlation.toFixed(3) + ', Signal=' + signal);
  
  return { correlation: correlation, signal: signal, score: score };
}

// ============================================
// NEW: VOLATILITY INDEX
// ============================================
function calculateVolatility(candles, period) {
  period = period || 20;
  if (!candles || candles.length < period) return { volatility: 0, signal: 'neutral', score: 0 };
  
  var closes = candles.map(function(c) { return c.close; });
  var recent = closes.slice(-period);
  
  // Calculate standard deviation
  var mean = recent.reduce(function(a, b) { return a + b; }, 0) / recent.length;
  var variance = recent.reduce(function(sum, price) {
    return sum + Math.pow(price - mean, 2);
  }, 0) / recent.length;
  
  var stdDev = Math.sqrt(variance);
  var volatility = (stdDev / mean) * 100; // As percentage
  
  var signal = 'neutral';
  var score = 0;
  
  // Low volatility = potential breakout
  if (volatility < 2) {
    signal = 'bullish';
    score = 5;
  }
  // High volatility = potential reversal
  else if (volatility > 10) {
    signal = 'bearish';
    score = -5;
  }
  
  console.log('✅ Volatility: ' + volatility.toFixed(2) + '%, Signal=' + signal);
  
  return { volatility: volatility, signal: signal, score: score };
}

// ============================================
// NEW: MACHINE LEARNING SIGNALS
// ============================================
function calculateMLSignals(candles) {
  if (!candles || candles.length < 50) return { signal: 'neutral', score: 0, confidence: 0 };
  
  var closes = candles.map(function(c) { return c.close; });
  var volumes = candles.map(function(c) { return c.volume; });
  
  // Feature 1: Price momentum (5-period)
  var momentum5 = (closes[closes.length - 1] - closes[closes.length - 6]) / closes[closes.length - 6];
  
  // Feature 2: Volume trend
  var recentVol = volumes.slice(-5).reduce(function(a, b) { return a + b; }, 0) / 5;
  var prevVol = volumes.slice(-10, -5).reduce(function(a, b) { return a + b; }, 0) / 5;
  var volumeTrend = (recentVol - prevVol) / prevVol;
  
  // Feature 3: Price distance from SMA50
  var sma50 = closes.slice(-50).reduce(function(a, b) { return a + b; }, 0) / 50;
  var distanceFromSMA = (closes[closes.length - 1] - sma50) / sma50;
  
  // Feature 4: RSI momentum
  var rsi = calculateRSI(closes, 14);
  
  // Feature 5: MACD histogram
  var macd = calculateMACD(closes);
  
  // Simple weighted scoring (simulating ML model)
  var score = 0;
  
  // Momentum contribution (weight: 25%)
  if (momentum5 > 0.05) score += 5;
  else if (momentum5 < -0.05) score -= 5;
  
  // Volume trend contribution (weight: 20%)
  if (volumeTrend > 0.2 && momentum5 > 0) score += 4;
  else if (volumeTrend > 0.2 && momentum5 < 0) score -= 4;
  
  // Distance from SMA contribution (weight: 20%)
  if (distanceFromSMA > 0.1) score += 4;
  else if (distanceFromSMA < -0.1) score -= 4;
  
  // RSI contribution (weight: 15%)
  if (rsi.value < 30) score += 3;
  else if (rsi.value > 70) score -= 3;
  
  // MACD contribution (weight: 20%)
  if (macd.histogram > 0) score += 4;
  else if (macd.histogram < 0) score -= 4;
  
  var signal = 'neutral';
  var confidence = Math.min(Math.abs(score) * 5, 100);
  
  if (score > 5) signal = 'bullish';
  else if (score < -5) signal = 'bearish';
  
  console.log('✅ ML Signal: Signal=' + signal + ', Score=' + score + ', Confidence=' + confidence + '%');
  
  return { signal: signal, score: score, confidence: confidence };
}

// ============================================
// NEW: ICHIMOKU CLOUD
// ============================================
function calculateIchimoku(candles) {
  if (!candles || candles.length < 52) return { signal: 'neutral', score: 0 };
  
  var closes = candles.map(function(c) { return c.close; });
  var highs = candles.map(function(c) { return c.high; });
  var lows = candles.map(function(c) { return c.low; });
  
  // Tenkan-sen (Conversion Line): (9-period high + 9-period low) / 2
  var tenkanHigh = Math.max.apply(null, highs.slice(-9));
  var tenkanLow = Math.min.apply(null, lows.slice(-9));
  var tenkan = (tenkanHigh + tenkanLow) / 2;
  
  // Kijun-sen (Base Line): (26-period high + 26-period low) / 2
  var kijunHigh = Math.max.apply(null, highs.slice(-26));
  var kijunLow = Math.min.apply(null, lows.slice(-26));
  var kijun = (kijunHigh + kijunLow) / 2;
  
  // Senkou Span A (Leading Span A): (Tenkan + Kijun) / 2
  var senkouA = (tenkan + kijun) / 2;
  
  // Senkou Span B (Leading Span B): (52-period high + 52-period low) / 2
  var senkouBHigh = Math.max.apply(null, highs.slice(-52));
  var senkouBLow = Math.min.apply(null, lows.slice(-52));
  var senkouB = (senkouBHigh + senkouBLow) / 2;
  
  var currentPrice = closes[closes.length - 1];
  var signal = 'neutral';
  var score = 0;
  
  // Price above cloud = bullish
  if (currentPrice > senkouA && currentPrice > senkouB) {
    signal = 'bullish';
    score = 10;
  }
  // Price below cloud = bearish
  else if (currentPrice < senkouA && currentPrice < senkouB) {
    signal = 'bearish';
    score = -10;
  }
  
  // Tenkan > Kijun = bullish momentum
  if (tenkan > kijun && signal === 'neutral') {
    signal = 'bullish';
    score = 5;
  } else if (tenkan < kijun && signal === 'neutral') {
    signal = 'bearish';
    score = -5;
  }
  
  console.log('✅ Ichimoku: Signal=' + signal + ', Price=' + currentPrice.toFixed(2) + ', Cloud=[' + senkouA.toFixed(2) + '-' + senkouB.toFixed(2) + ']');
  
  return { signal: signal, score: score };
}

// ============================================
// NEW: FIBONACCI RETRACEMENT
// ============================================
function calculateFibonacci(candles) {
  if (!candles || candles.length < 50) return { levels: {}, signal: 'neutral', score: 0 };
  
  var closes = candles.map(function(c) { return c.close; });
  var recent = closes.slice(-50);
  
  var high = Math.max.apply(null, recent);
  var low = Math.min.apply(null, recent);
  var diff = high - low;
  
  var currentPrice = closes[closes.length - 1];
  
  // Fibonacci levels
  var levels = {
    level_0: high,
    level_236: high - (diff * 0.236),
    level_382: high - (diff * 0.382),
    level_500: high - (diff * 0.5),
    level_618: high - (diff * 0.618),
    level_786: high - (diff * 0.786),
    level_100: low
  };
  
  var signal = 'neutral';
  var score = 0;
  
  // Check which level price is near (within 1%)
  var tolerance = diff * 0.01;
  
  // Price at 0.618 or 0.382 retracement = strong support/resistance
  if (Math.abs(currentPrice - levels.level_618) < tolerance) {
    signal = 'bullish';
    score = 8;
  } else if (Math.abs(currentPrice - levels.level_382) < tolerance) {
    signal = 'bearish';
    score = -8;
  } else if (Math.abs(currentPrice - levels.level_500) < tolerance) {
    // Midpoint - could go either way
    signal = 'neutral';
    score = 0;
  } else if (currentPrice < levels.level_618 && currentPrice > levels.level_786) {
    // Deep retracement - potential reversal
    signal = 'bullish';
    score = 5;
  }
  
  console.log('✅ Fibonacci: Signal=' + signal + ', Price=' + currentPrice.toFixed(2) + ', Levels=[0.382:' + levels.level_382.toFixed(2) + ', 0.5:' + levels.level_500.toFixed(2) + ', 0.618:' + levels.level_618.toFixed(2) + ']');
  
  return { levels: levels, signal: signal, score: score };
}

// ============================================
// NEW: CORRELATION ANALYSIS
// ============================================
function calculateCorrelation(candles, benchmarkCandles) {
  if (!candles || !benchmarkCandles || candles.length < 30 || benchmarkCandles.length < 30) {
    return { correlation: 0, signal: 'neutral', score: 0 };
  }
  
  var closes = candles.map(function(c) { return c.close; });
  var benchmark = benchmarkCandles.map(function(c) { return c.close; });
  
  // Calculate returns
  var returns1 = [];
  var returns2 = [];
  
  for (var i = 1; i < Math.min(closes.length, benchmark.length); i++) {
    returns1.push((closes[i] - closes[i-1]) / closes[i-1]);
    returns2.push((benchmark[i] - benchmark[i-1]) / benchmark[i-1]);
  }
  
  // Calculate correlation coefficient
  var n = returns1.length;
  var sum1 = returns1.reduce(function(a, b) { return a + b; }, 0);
  var sum2 = returns2.reduce(function(a, b) { return a + b; }, 0);
  var sum1Sq = returns1.reduce(function(a, b) { return a + b * b; }, 0);
  var sum2Sq = returns2.reduce(function(a, b) { return a + b * b; }, 0);
  var pSum = returns1.reduce(function(sum, r1, i) { return sum + r1 * returns2[i]; }, 0);
  
  var numerator = pSum - (sum1 * sum2 / n);
  var denominator = Math.sqrt((sum1Sq - sum1 * sum1 / n) * (sum2Sq - sum2 * sum2 / n));
  
  var correlation = denominator === 0 ? 0 : numerator / denominator;
  
  var signal = 'neutral';
  var score = 0;
  
  // High positive correlation = follows market
  if (correlation > 0.8) {
    signal = 'bullish';
    score = 5;
  } else if (correlation < -0.5) {
    // Negative correlation = counter-trend
    signal = 'neutral';
    score = 0;
  }
  
  console.log('✅ Correlation: ' + correlation.toFixed(3) + ', Signal=' + signal);
  
  return { correlation: correlation, signal: signal, score: score };
}

// ============================================
// NEW: VOLATILITY INDEX
// ============================================
function calculateVolatility(candles, period) {
  period = period || 20;
  if (!candles || candles.length < period) return { volatility: 0, signal: 'neutral', score: 0 };
  
  var closes = candles.map(function(c) { return c.close; });
  var recent = closes.slice(-period);
  
  // Calculate standard deviation
  var mean = recent.reduce(function(a, b) { return a + b; }, 0) / recent.length;
  var variance = recent.reduce(function(sum, price) {
    return sum + Math.pow(price - mean, 2);
  }, 0) / recent.length;
  
  var stdDev = Math.sqrt(variance);
  var volatility = (stdDev / mean) * 100; // As percentage
  
  var signal = 'neutral';
  var score = 0;
  
  // Low volatility = potential breakout
  if (volatility < 2) {
    signal = 'bullish';
    score = 5;
  }
  // High volatility = potential reversal
  else if (volatility > 10) {
    signal = 'bearish';
    score = -5;
  }
  
  console.log('✅ Volatility: ' + volatility.toFixed(2) + '%, Signal=' + signal);
  
  return { volatility: volatility, signal: signal, score: score };
}

// ============================================
// NEW: MACHINE LEARNING SIGNALS
// ============================================
function calculateMLSignals(candles) {
  if (!candles || candles.length < 50) return { signal: 'neutral', score: 0, confidence: 0 };
  
  var closes = candles.map(function(c) { return c.close; });
  var volumes = candles.map(function(c) { return c.volume; });
  
  // Feature 1: Price momentum (5-period)
  var momentum5 = (closes[closes.length - 1] - closes[closes.length - 6]) / closes[closes.length - 6];
  
  // Feature 2: Volume trend
  var recentVol = volumes.slice(-5).reduce(function(a, b) { return a + b; }, 0) / 5;
  var prevVol = volumes.slice(-10, -5).reduce(function(a, b) { return a + b; }, 0) / 5;
  var volumeTrend = (recentVol - prevVol) / prevVol;
  
  // Feature 3: Price distance from SMA50
  var sma50 = closes.slice(-50).reduce(function(a, b) { return a + b; }, 0) / 50;
  var distanceFromSMA = (closes[closes.length - 1] - sma50) / sma50;
  
  // Feature 4: RSI momentum
  var rsi = calculateRSI(closes, 14);
  
  // Feature 5: MACD histogram
  var macd = calculateMACD(closes);
  
  // Simple weighted scoring (simulating ML model)
  var score = 0;
  
  // Momentum contribution (weight: 25%)
  if (momentum5 > 0.05) score += 5;
  else if (momentum5 < -0.05) score -= 5;
  
  // Volume trend contribution (weight: 20%)
  if (volumeTrend > 0.2 && momentum5 > 0) score += 4;
  else if (volumeTrend > 0.2 && momentum5 < 0) score -= 4;
  
  // Distance from SMA contribution (weight: 20%)
  if (distanceFromSMA > 0.1) score += 4;
  else if (distanceFromSMA < -0.1) score -= 4;
  
  // RSI contribution (weight: 15%)
  if (rsi.value < 30) score += 3;
  else if (rsi.value > 70) score -= 3;
  
  // MACD contribution (weight: 20%)
  if (macd.histogram > 0) score += 4;
  else if (macd.histogram < 0) score -= 4;
  
  var signal = 'neutral';
  var confidence = Math.min(Math.abs(score) * 5, 100);
  
  if (score > 5) signal = 'bullish';
  else if (score < -5) signal = 'bearish';
  
  console.log('✅ ML Signal: Signal=' + signal + ', Score=' + score + ', Confidence=' + confidence + '%');
  
  return { signal: signal, score: score, confidence: confidence };
}

// ============================================
// NEW: ICHIMOKU CLOUD
// ============================================
function calculateIchimoku(candles) {
  if (!candles || candles.length < 52) return { signal: 'neutral', score: 0 };
  
  var closes = candles.map(function(c) { return c.close; });
  var highs = candles.map(function(c) { return c.high; });
  var lows = candles.map(function(c) { return c.low; });
  
  // Tenkan-sen (Conversion Line): (9-period high + 9-period low) / 2
  var tenkanHigh = Math.max.apply(null, highs.slice(-9));
  var tenkanLow = Math.min.apply(null, lows.slice(-9));
  var tenkan = (tenkanHigh + tenkanLow) / 2;
  
  // Kijun-sen (Base Line): (26-period high + 26-period low) / 2
  var kijunHigh = Math.max.apply(null, highs.slice(-26));
  var kijunLow = Math.min.apply(null, lows.slice(-26));
  var kijun = (kijunHigh + kijunLow) / 2;
  
  // Senkou Span A (Leading Span A): (Tenkan + Kijun) / 2
  var senkouA = (tenkan + kijun) / 2;
  
  // Senkou Span B (Leading Span B): (52-period high + 52-period low) / 2
  var senkouBHigh = Math.max.apply(null, highs.slice(-52));
  var senkouBLow = Math.min.apply(null, lows.slice(-52));
  var senkouB = (senkouBHigh + senkouBLow) / 2;
  
  var currentPrice = closes[closes.length - 1];
  var signal = 'neutral';
  var score = 0;
  
  // Price above cloud = bullish
  if (currentPrice > senkouA && currentPrice > senkouB) {
    signal = 'bullish';
    score = 10;
  }
  // Price below cloud = bearish
  else if (currentPrice < senkouA && currentPrice < senkouB) {
    signal = 'bearish';
    score = -10;
  }
  
  // Tenkan > Kijun = bullish momentum
  if (tenkan > kijun && signal === 'neutral') {
    signal = 'bullish';
    score = 5;
  } else if (tenkan < kijun && signal === 'neutral') {
    signal = 'bearish';
    score = -5;
  }
  
  console.log('✅ Ichimoku: Signal=' + signal + ', Price=' + currentPrice.toFixed(2) + ', Cloud=[' + senkouA.toFixed(2) + '-' + senkouB.toFixed(2) + ']');
  
  return { signal: signal, score: score };
}

// ============================================
// NEW: FIBONACCI RETRACEMENT
// ============================================
function calculateFibonacci(candles) {
  if (!candles || candles.length < 50) return { levels: {}, signal: 'neutral', score: 0 };
  
  var closes = candles.map(function(c) { return c.close; });
  var recent = closes.slice(-50);
  
  var high = Math.max.apply(null, recent);
  var low = Math.min.apply(null, recent);
  var diff = high - low;
  
  var currentPrice = closes[closes.length - 1];
  
  // Fibonacci levels
  var levels = {
    level_0: high,
    level_236: high - (diff * 0.236),
    level_382: high - (diff * 0.382),
    level_500: high - (diff * 0.5),
    level_618: high - (diff * 0.618),
    level_786: high - (diff * 0.786),
    level_100: low
  };
  
  var signal = 'neutral';
  var score = 0;
  
  // Check which level price is near (within 1%)
  var tolerance = diff * 0.01;
  
  // Price at 0.618 or 0.382 retracement = strong support/resistance
  if (Math.abs(currentPrice - levels.level_618) < tolerance) {
    signal = 'bullish';
    score = 8;
  } else if (Math.abs(currentPrice - levels.level_382) < tolerance) {
    signal = 'bearish';
    score = -8;
  } else if (Math.abs(currentPrice - levels.level_500) < tolerance) {
    // Midpoint - could go either way
    signal = 'neutral';
    score = 0;
  } else if (currentPrice < levels.level_618 && currentPrice > levels.level_786) {
    // Deep retracement - potential reversal
    signal = 'bullish';
    score = 5;
  }
  
  console.log('✅ Fibonacci: Signal=' + signal + ', Price=' + currentPrice.toFixed(2) + ', Levels=[0.382:' + levels.level_382.toFixed(2) + ', 0.5:' + levels.level_500.toFixed(2) + ', 0.618:' + levels.level_618.toFixed(2) + ']');
  
  return { levels: levels, signal: signal, score: score };
}

// ============================================
// NEW: CORRELATION ANALYSIS
// ============================================
function calculateCorrelation(candles, benchmarkCandles) {
  if (!candles || !benchmarkCandles || candles.length < 30 || benchmarkCandles.length < 30) {
    return { correlation: 0, signal: 'neutral', score: 0 };
  }
  
  var closes = candles.map(function(c) { return c.close; });
  var benchmark = benchmarkCandles.map(function(c) { return c.close; });
  
  // Calculate returns
  var returns1 = [];
  var returns2 = [];
  
  for (var i = 1; i < Math.min(closes.length, benchmark.length); i++) {
    returns1.push((closes[i] - closes[i-1]) / closes[i-1]);
    returns2.push((benchmark[i] - benchmark[i-1]) / benchmark[i-1]);
  }
  
  // Calculate correlation coefficient
  var n = returns1.length;
  var sum1 = returns1.reduce(function(a, b) { return a + b; }, 0);
  var sum2 = returns2.reduce(function(a, b) { return a + b; }, 0);
  var sum1Sq = returns1.reduce(function(a, b) { return a + b * b; }, 0);
  var sum2Sq = returns2.reduce(function(a, b) { return a + b * b; }, 0);
  var pSum = returns1.reduce(function(sum, r1, i) { return sum + r1 * returns2[i]; }, 0);
  
  var numerator = pSum - (sum1 * sum2 / n);
  var denominator = Math.sqrt((sum1Sq - sum1 * sum1 / n) * (sum2Sq - sum2 * sum2 / n));
  
  var correlation = denominator === 0 ? 0 : numerator / denominator;
  
  var signal = 'neutral';
  var score = 0;
  
  // High positive correlation = follows market
  if (correlation > 0.8) {
    signal = 'bullish';
    score = 5;
  } else if (correlation < -0.5) {
    // Negative correlation = counter-trend
    signal = 'neutral';
    score = 0;
  }
  
  console.log('✅ Correlation: ' + correlation.toFixed(3) + ', Signal=' + signal);
  
  return { correlation: correlation, signal: signal, score: score };
}

// ============================================
// NEW: VOLATILITY INDEX
// ============================================
function calculateVolatility(candles, period) {
  period = period || 20;
  if (!candles || candles.length < period) return { volatility: 0, signal: 'neutral', score: 0 };
  
  var closes = candles.map(function(c) { return c.close; });
  var recent = closes.slice(-period);
  
  // Calculate standard deviation
  var mean = recent.reduce(function(a, b) { return a + b; }, 0) / recent.length;
  var variance = recent.reduce(function(sum, price) {
    return sum + Math.pow(price - mean, 2);
  }, 0) / recent.length;
  
  var stdDev = Math.sqrt(variance);
  var volatility = (stdDev / mean) * 100; // As percentage
  
  var signal = 'neutral';
  var score = 0;
  
  // Low volatility = potential breakout
  if (volatility < 2) {
    signal = 'bullish';
    score = 5;
  }
  // High volatility = potential reversal
  else if (volatility > 10) {
    signal = 'bearish';
    score = -5;
  }
  
  console.log('✅ Volatility: ' + volatility.toFixed(2) + '%, Signal=' + signal);
  
  return { volatility: volatility, signal: signal, score: score };
}

// ============================================
// NEW: MACHINE LEARNING SIGNALS
// ============================================
function calculateMLSignals(candles) {
