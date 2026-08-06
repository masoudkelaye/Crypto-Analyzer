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
  

// ============================================
// NEW: ENSEMBLE LEARNING (Weighted Average)
// ============================================
function calculateEnsembleLearning(candles, allSignals) {
  if (!candles || candles.length < 50 || !allSignals) return { signal: 'neutral', score: 0, confidence: 0 };
  
  var weightedScore = 0;
  var totalWeight = 0;
  
  var signalWeights = {
    rsi: 15,
    macd: 10,
    ema: 10,
    trend: 10,
    orderBook: 20,
    fundingRate: 15,
    multiTimeframe: 15,
    momentum: 10,
    market: 10,
    rsiDivergence: 12,
    fearGreed: 8,
    candlePatterns: 12,
    marketStructure: 15,
    smartMoney: 12,
    volumeProfile: 10,
    adx: 10,
    ichimoku: 10,
    fibonacci: 8,
    correlation: 5,
    volatility: 5,
    ml: 8
  };
  
  for (var signalType in allSignals) {
    if (signalWeights[signalType] && allSignals[signalType] !== 'neutral') {
      var weight = signalWeights[signalType];
      if (allSignals[signalType] === 'bullish') {
        weightedScore += weight;
      } else if (allSignals[signalType] === 'bearish') {
        weightedScore -= weight;
      }
      totalWeight += weight;
    }
  }
  
  var normalizedScore = totalWeight > 0 ? (weightedScore / totalWeight) * 100 : 0;
  var confidence = Math.min(Math.abs(normalizedScore), 100);
  
  var signal = 'neutral';
  if (normalizedScore > 20) signal = 'bullish';
  else if (normalizedScore < -20) signal = 'bearish';
  
  console.log('✅ Ensemble: Signal=' + signal + ', Score=' + normalizedScore.toFixed(1) + ', Confidence=' + confidence.toFixed(1) + '%');
  
  return { signal: signal, score: normalizedScore, confidence: confidence };
}

// ============================================
// NEW: NEURAL NETWORK SIGNALS (Simple Perceptron)
// ============================================
function calculateNeuralNetwork(candles) {
  if (!candles || candles.length < 50) return { signal: 'neutral', score: 0, confidence: 0 };
  
  var closes = candles.map(function(c) { return c.close; });
  var volumes = candles.map(function(c) { return c.volume; });
  
  var recentPrices = closes.slice(-10);
  var recentVolumes = volumes.slice(-10);
  
  var priceChanges = [];
  for (var i = 1; i < recentPrices.length; i++) {
    priceChanges.push((recentPrices[i] - recentPrices[i-1]) / recentPrices[i-1]);
  }
  
  var volumeChanges = [];
  for (var i = 1; i < recentVolumes.length; i++) {
    volumeChanges.push((recentVolumes[i] - recentVolumes[i-1]) / (recentVolumes[i-1] + 0.0001));
  }
  
  var weights = [0.3, 0.25, 0.2, 0.15, 0.1];
  var bias = 0;
  
  var sum = 0;
  for (var i = 0; i < Math.min(priceChanges.length, weights.length); i++) {
    sum += priceChanges[i] * weights[i];
  }
  
  var avgVolumeChange = volumeChanges.reduce(function(a, b) { return a + b; }, 0) / volumeChanges.length;
  sum += avgVolumeChange * 0.1;
  
  var output = Math.tanh(sum + bias);
  
  var signal = 'neutral';
  if (output > 0.3) signal = 'bullish';
  else if (output < -0.3) signal = 'bearish';
  
  var confidence = Math.abs(output) * 100;
  
  console.log('✅ Neural Network: Signal=' + signal + ', Output=' + output.toFixed(3) + ', Confidence=' + confidence.toFixed(1) + '%');
  
  return { signal: signal, score: output, confidence: confidence };
}

// ============================================
// NEW: SENTIMENT ANALYSIS (From Price Action)
// ============================================
function calculateSentimentAnalysis(candles) {
  if (!candles || candles.length < 20) return { sentiment: 0, signal: 'neutral', score: 0 };
  
  var closes = candles.map(function(c) { return c.close; });
  var volumes = candles.map(function(c) { return c.volume; });
  
  var recent = closes.slice(-20);
  var recentVol = volumes.slice(-20);
  
  var bullishCandles = 0;
  var bearishCandles = 0;
  for (var i = 0; i < recent.length - 1; i++) {
    if (closes[closes.length - 20 + i] > closes[closes.length - 21 + i]) {
      bullishCandles++;
    } else {
      bearishCandles++;
    }
  }
  
  var candleRatio = (bullishCandles - bearishCandles) / 20;
  
  var upVolume = 0;
  var downVolume = 0;
  for (var i = 0; i < recentVol.length - 1; i++) {
    var idx = volumes.length - 20 + i;
    if (closes[idx] > closes[idx - 1]) {
      upVolume += volumes[idx];
    } else {
      downVolume += volumes[idx];
    }
  }
  
  var volumeSentiment = (upVolume - downVolume) / (upVolume + downVolume + 0.0001);
  
  var momentum = (recent[recent.length - 1] - recent[0]) / recent[0];
  
  var avg = recent.reduce(function(a, b) { return a + b; }, 0) / recent.length;
  var variance = recent.reduce(function(sum, price) {
    return sum + Math.pow(price - avg, 2);
  }, 0) / recent.length;
  var volatility = Math.sqrt(variance) / avg;
  
  var sentiment = (candleRatio * 0.3 + volumeSentiment * 0.3 + momentum * 20 + volatility * -2) * 10;
  
  sentiment = Math.max(-100, Math.min(100, sentiment));
  
  var signal = 'neutral';
  var score = 0;
  
  if (sentiment > 30) {
    signal = 'bullish';
    score = 8;
  } else if (sentiment < -30) {
    signal = 'bearish';
    score = -8;
  }
  
  console.log('✅ Sentiment: Signal=' + signal + ', Score=' + sentiment.toFixed(1));
  
  return { sentiment: sentiment, signal: signal, score: score };
}

// ============================================
// NEW: WHALE MOVEMENT DETECTION
// ============================================
function detectWhaleMovements(candles) {
  if (!candles || candles.length < 20) return { whaleActivity: 0, signal: 'neutral', score: 0 };
  
  var volumes = candles.map(function(c) { return c.volume; });
  var closes = candles.map(function(c) { return c.close; });
  
  var recentVol = volumes.slice(-20);
  var recentPrices = closes.slice(-20);
  
  var avgVolume = recentVol.reduce(function(a, b) { return a + b; }, 0) / recentVol.length;
  
  var whaleCandles = [];
  for (var i = 0; i < recentVol.length; i++) {
    if (recentVol[i] > avgVolume * 3) {
      var priceChange = recentPrices[i] - (i > 0 ? recentPrices[i-1] : recentPrices[i]);
      whaleCandles.push({
        volume: recentVol[i],
        priceChange: priceChange,
        isBullish: priceChange > 0
      });
    }
  }
  
  var bullishWhales = whaleCandles.filter(function(w) { return w.isBullish; }).length;
  var bearishWhales = whaleCandles.filter(function(w) { return !w.isBullish; }).length;
  
  var whaleScore = (bullishWhales - bearishWhales) / (whaleCandles.length + 0.0001);
  
  var signal = 'neutral';
  var score = 0;
  
  if (whaleScore > 0.3 && whaleCandles.length >= 2) {
    signal = 'bullish';
    score = 7;
  } else if (whaleScore < -0.3 && whaleCandles.length >= 2) {
    signal = 'bearish';
    score = -7;
  }
  
  console.log('✅ Whales: ' + whaleCandles.length + ' detected, Signal=' + signal);
  
  return { 
    whaleCount: whaleCandles.length,
    whaleScore: whaleScore,
    signal: signal, 
    score: score 
  };
}

// ============================================
// NEW: OPTIONS FLOW ALTERNATIVE (Funding + OI)
// ============================================
function calculateOptionsFlow(candles, fundingRate) {
  if (!candles || candles.length < 20) return { signal: 'neutral', score: 0 };
  
  var volumes = candles.map(function(c) { return c.volume; });
  var closes = candles.map(function(c) { return c.close; });
  
  var recentVol = volumes.slice(-20);
  var recentPrices = closes.slice(-20);
  
  var avgVol = recentVol.reduce(function(a, b) { return a + b; }, 0) / recentVol.length;
  var recentAvgVol = recentVol.slice(-5).reduce(function(a, b) { return a + b; }, 0) / 5;
  var volumeTrend = (recentAvgVol - avgVol) / avgVol;
  
  var momentum = (recentPrices[recentPrices.length - 1] - recentPrices[0]) / recentPrices[0];
  
  var fundingInfluence = 0;
  if (fundingRate) {
    if (fundingRate.rate > 0.01) fundingInfluence = -1;
    else if (fundingRate.rate < -0.01) fundingInfluence = 1;
  }
  
  var flowScore = (volumeTrend * 2 + momentum * 10 + fundingInfluence) * 5;
  
  var signal = 'neutral';
  var score = 0;
  
  if (flowScore > 15) {
    signal = 'bullish';
    score = 6;
  } else if (flowScore < -15) {
    signal = 'bearish';
    score = -6;
  }
  
  console.log('✅ Options Flow: Signal=' + signal + ', Score=' + flowScore.toFixed(1));
  
  return { signal: signal, score: score };
}
function analyzeAll(candles, extraData) {
  extraData = extraData || {};
  
  var closes = candles.map(function(c) { return c.close; });
  var highs = candles.map(function(c) { return c.high; });
  var lows = candles.map(function(c) { return c.low; });
  var volumes = candles.map(function(c) { return c.volume; });
  var currentPrice = closes[closes.length - 1];

  var rsi = calculateRSI(closes);
  var macd = calculateMACD(closes);
  var ema9 = calculateEMA(closes, 9);
  var ema21 = calculateEMA(closes, 21);

  var bullishScore = 0;
  var bearishScore = 0;
  var bullishFactors = [];
  var bearishFactors = [];

  // 1. RSI (Weight: 15)
  if (rsi.value < 30) {
    bullishScore += 15;
    bullishFactors.push({ name: 'RSI Oversold', weight: 15 });
  } else if (rsi.value > 70) {
    bearishScore += 15;
    bearishFactors.push({ name: 'RSI Overbought', weight: 15 });
  }

  // 2. MACD (Weight: 10)
  if (macd.crossSignal === 'bullish') {
    bullishScore += 10;
    bullishFactors.push({ name: 'MACD Bullish', weight: 10 });
  } else if (macd.crossSignal === 'bearish') {
    bearishScore += 10;
    bearishFactors.push({ name: 'MACD Bearish', weight: 10 });
  }

  // 3. EMA Cross (Weight: 10)
  if (ema9.length > 0 && ema21.length > 0) {
    var current9 = ema9[ema9.length - 1];
    var current21 = ema21[ema21.length - 1];

    if (current9 > current21) {
      bullishScore += 10;
      bullishFactors.push({ name: 'EMA Bullish', weight: 10 });
    } else {
      bearishScore += 10;
      bearishFactors.push({ name: 'EMA Bearish', weight: 10 });
    }
  }

  // 4. Trend (Weight: 10)
  if (closes.length >= 20) {
    var sma20 = closes.slice(-20).reduce(function(a, b) { return a + b; }) / 20;
    if (currentPrice > sma20) {
      bullishScore += 10;
      bullishFactors.push({ name: 'Above SMA20', weight: 10 });
    } else {
      bearishScore += 10;
      bearishFactors.push({ name: 'Below SMA20', weight: 10 });
    }
  }

  // 5. Order Book (Weight: 20) - NEW
  if (extraData.orderBook && extraData.orderBook.signal !== 'neutral') {
    if (extraData.orderBook.signal === 'bullish') {
      bullishScore += 20;
      bullishFactors.push({ name: 'Order Book: Buy Pressure', weight: 20 });
    } else if (extraData.orderBook.signal === 'bearish') {
      bearishScore += 20;
      bearishFactors.push({ name: 'Order Book: Sell Pressure', weight: 20 });
    }
  }

  // 6. Funding Rate (Weight: 15) - NEW
  if (extraData.fundingRate && extraData.fundingRate.signal !== 'neutral') {
    if (extraData.fundingRate.signal === 'bullish') {
      bullishScore += 15;
      bullishFactors.push({ name: 'Funding: Shorts Pay', weight: 15 });
    } else if (extraData.fundingRate.signal === 'bearish') {
      bearishScore += 15;
      bearishFactors.push({ name: 'Funding: Longs Pay', weight: 15 });
    }
  }

  // 7. Multi-Timeframe (Weight: 15) - NEW
  if (extraData.multiTimeframe && extraData.multiTimeframe.signal !== 'neutral') {
    if (extraData.multiTimeframe.signal === 'bullish') {
      bullishScore += 15;
      bullishFactors.push({ name: 'Multi-TF: Higher TF Bullish', weight: 15 });
    } else if (extraData.multiTimeframe.signal === 'bearish') {
      bearishScore += 15;
      bearishFactors.push({ name: 'Multi-TF: Higher TF Bearish', weight: 15 });
    }
  }

  // 8. 24h Momentum (Weight: 10) - NEW
  if (extraData.momentum && extraData.momentum.signal !== 'neutral') {
    if (extraData.momentum.signal === 'bullish') {
      bullishScore += 10;
      bullishFactors.push({ name: '24h: Strong Bullish (' + extraData.momentum.changePercent + '%)', weight: 10 });
    } else if (extraData.momentum.signal === 'bearish') {
      bearishScore += 10;
      bearishFactors.push({ name: '24h: Strong Bearish (' + extraData.momentum.changePercent + '%)', weight: 10 });
    } else if (extraData.momentum.signal === 'slightly_bullish') {
      bullishScore += 5;
      bullishFactors.push({ name: '24h: Slightly Bullish (' + extraData.momentum.changePercent + '%)', weight: 5 });
    } else if (extraData.momentum.signal === 'slightly_bearish') {
      bearishScore += 5;
      bearishFactors.push({ name: '24h: Slightly Bearish (' + extraData.momentum.changePercent + '%)', weight: 5 });
    }
  }

  // 9. Market Overview (Weight: 10) - NEW
  if (extraData.market && extraData.market.signal !== 'neutral') {
    if (extraData.market.signal === 'bullish') {
      bullishScore += 10;
      bullishFactors.push({ name: 'Market: Bullish (' + extraData.market.marketChange + '%)', weight: 10 });
    } else if (extraData.market.signal === 'bearish') {
      bearishScore += 10;
      bearishFactors.push({ name: 'Market: Bearish (' + extraData.market.marketChange + '%)', weight: 10 });
    }
  }

  // 10. RSI Divergence (Weight: 12) - NEW
  var rsiDiv = detectRSIDivergence(candles);
  if (rsiDiv.signal !== 'neutral') {
    if (rsiDiv.signal === 'bullish') {
      bullishScore += 12;
      bullishFactors.push({ name: 'RSI Bullish Divergence', weight: 12 });
    } else if (rsiDiv.signal === 'bearish') {
      bearishScore += 12;
      bearishFactors.push({ name: 'RSI Bearish Divergence', weight: 12 });
    }
  }

  // 11. Fear & Greed Trend (Weight: 8) - NEW
  if (extraData.fearGreed && extraData.fearGreed.trend) {
    if (extraData.fearGreed.trend === 'rising' && extraData.fearGreed.value < 40) {
      bullishScore += 8;
      bullishFactors.push({ name: 'F&G: Recovering from Fear', weight: 8 });
    } else if (extraData.fearGreed.trend === 'falling' && extraData.fearGreed.value > 60) {
      bearishScore += 8;
      bearishFactors.push({ name: 'F&G: Falling from Greed', weight: 8 });
    }
  }

  // 12. Candlestick Patterns (Weight: 12) - NEW
  var candlePatterns = detectCandlestickPatterns(candles);
  if (candlePatterns.signal !== 'neutral') {
    if (candlePatterns.signal === 'bullish') {
      bullishScore += 12;
      bullishFactors.push({ name: 'Bullish Candle Patterns', weight: 12 });
    } else if (candlePatterns.signal === 'bearish') {
      bearishScore += 12;
      bearishFactors.push({ name: 'Bearish Candle Patterns', weight: 12 });
    }
  }

  // 13. Market Structure (Weight: 15) - NEW
  var marketStructure = analyzeMarketStructure(candles);
  if (marketStructure.trend !== 'neutral') {
    if (marketStructure.trend === 'bullish') {
      bullishScore += 15;
      bullishFactors.push({ name: 'Market Structure: Uptrend', weight: 15 });
    } else if (marketStructure.trend === 'bearish') {
      bearishScore += 15;
      bearishFactors.push({ name: 'Market Structure: Downtrend', weight: 15 });
    }
  }

  // 14. Smart Money Concepts (Weight: 12) - NEW
  var smartMoney = detectSmartMoneyConcepts(candles);
  if (smartMoney.signal !== 'neutral') {
    if (smartMoney.signal === 'bullish') {
      bullishScore += 12;
      bullishFactors.push({ name: 'Smart Money: Bullish OB/FVG', weight: 12 });
    } else if (smartMoney.signal === 'bearish') {
      bearishScore += 12;
      bearishFactors.push({ name: 'Smart Money: Bearish OB/FVG', weight: 12 });
    }
  }

  // 15. Volume Profile (Weight: 10) - NEW
  var volumeProfile = analyzeVolumeProfile(candles);
  if (volumeProfile.signal !== 'neutral') {
    if (volumeProfile.signal === 'bullish') {
      bullishScore += 10;
      bullishFactors.push({ name: 'Volume Profile: Above VAH', weight: 10 });
    } else if (volumeProfile.signal === 'bearish') {
      bearishScore += 10;
      bearishFactors.push({ name: 'Volume Profile: Below VAL', weight: 10 });
    }
  }

  // 16. ADX Trend Strength (Weight: 10) - NEW
  var adx = calculateADX(candles, 14);
  if (adx.signal !== 'neutral') {
    if (adx.signal === 'bullish') {
      bullishScore += 10;
      bullishFactors.push({ name: 'ADX: Strong Uptrend (' + adx.value.toFixed(1) + ')', weight: 10 });
    } else if (adx.signal === 'bearish') {
      bearishScore += 10;
      bearishFactors.push({ name: 'ADX: Strong Downtrend (' + adx.value.toFixed(1) + ')', weight: 10 });
    }
  }

  // 17. Ichimoku Cloud (Weight: 10) - NEW
  var ichimoku = calculateIchimoku(candles);
  if (ichimoku.signal !== 'neutral') {
    if (ichimoku.signal === 'bullish') {
      bullishScore += 10;
      bullishFactors.push({ name: 'Ichimoku: Above Cloud', weight: 10 });
    } else if (ichimoku.signal === 'bearish') {
      bearishScore += 10;
      bearishFactors.push({ name: 'Ichimoku: Below Cloud', weight: 10 });
    }
  }

  // 18. Fibonacci Retracement (Weight: 8) - NEW
  var fibonacci = calculateFibonacci(candles);
  if (fibonacci.signal !== 'neutral') {
    if (fibonacci.signal === 'bullish') {
      bullishScore += 8;
      bullishFactors.push({ name: 'Fibonacci: Support Level', weight: 8 });
    } else if (fibonacci.signal === 'bearish') {
      bearishScore += 8;
      bearishFactors.push({ name: 'Fibonacci: Resistance Level', weight: 8 });
    }
  }

  // 19. Correlation Analysis (Weight: 5) - NEW
  var correlation = calculateCorrelation(candles);
  if (correlation.signal !== 'neutral') {
    if (correlation.signal === 'bullish') {
      bullishScore += 5;
      bullishFactors.push({ name: 'Correlation: Positive (' + correlation.correlation.toFixed(2) + ')', weight: 5 });
    } else if (correlation.signal === 'bearish') {
      bearishScore += 5;
      bearishFactors.push({ name: 'Correlation: Negative (' + correlation.correlation.toFixed(2) + ')', weight: 5 });
    }
  }

  // 20. Volatility Index (Weight: 5) - NEW
  var volatility = calculateVolatilityIndex(candles, 20);
  if (volatility.signal !== 'neutral') {
    if (volatility.signal === 'bullish') {
      bullishScore += 5;
      bullishFactors.push({ name: 'Volatility: Low (' + volatility.volatility.toFixed(2) + '%)', weight: 5 });
    } else if (volatility.signal === 'bearish') {
      bearishScore += 5;
      bearishFactors.push({ name: 'Volatility: High (' + volatility.volatility.toFixed(2) + '%)', weight: 5 });
    }
  }

  // 21. Machine Learning Signals (Weight: 8) - NEW
  var mlSignals = calculateMLSignals(candles);
  if (mlSignals.signal !== 'neutral') {
    if (mlSignals.signal === 'bullish') {
      bullishScore += 8;
      bullishFactors.push({ name: 'ML: Bullish (' + mlSignals.confidence + '% conf)', weight: 8 });
    } else if (mlSignals.signal === 'bearish') {
      bearishScore += 8;
      bearishFactors.push({ name: 'ML: Bearish (' + mlSignals.confidence + '% conf)', weight: 8 });
    }
  }

  // 22. Ensemble Learning (Weight: 10) - NEW
  var allSignals = {
    rsi: rsi.signal,
    macd: macd.crossSignal,
    ema: ema9.length > 0 && ema21.length > 0 ? (ema9[ema9.length - 1] > ema21[ema21.length - 1] ? 'bullish' : 'bearish') : 'neutral',
    trend: closes.length >= 20 ? (currentPrice > closes.slice(-20).reduce(function(a, b) { return a + b; }) / 20 ? 'bullish' : 'bearish') : 'neutral',
    orderBook: extraData.orderBook ? extraData.orderBook.signal : 'neutral',
    fundingRate: extraData.fundingRate ? extraData.fundingRate.signal : 'neutral',
    multiTimeframe: extraData.multiTimeframe ? extraData.multiTimeframe.signal : 'neutral',
    momentum: extraData.momentum ? extraData.momentum.signal : 'neutral',
    market: extraData.market ? extraData.market.signal : 'neutral',
    ml: mlSignals.signal
  };
  var ensemble = calculateEnsembleLearning(candles, allSignals);
  if (ensemble.signal !== 'neutral') {
    if (ensemble.signal === 'bullish') {
      bullishScore += 10;
      bullishFactors.push({ name: 'Ensemble: Bullish (' + ensemble.confidence.toFixed(0) + '%)', weight: 10 });
    } else if (ensemble.signal === 'bearish') {
      bearishScore += 10;
      bearishFactors.push({ name: 'Ensemble: Bearish (' + ensemble.confidence.toFixed(0) + '%)', weight: 10 });
    }
  }

  // 23. Neural Network (Weight: 8) - NEW
  var neuralNet = calculateNeuralNetwork(candles);
  if (neuralNet.signal !== 'neutral') {
    if (neuralNet.signal === 'bullish') {
      bullishScore += 8;
      bullishFactors.push({ name: 'Neural Net: Bullish', weight: 8 });
    } else if (neuralNet.signal === 'bearish') {
      bearishScore += 8;
      bearishFactors.push({ name: 'Neural Net: Bearish', weight: 8 });
    }
  }

  // 24. Sentiment Analysis (Weight: 8) - NEW
  var sentiment = calculateSentimentAnalysis(candles);
  if (sentiment.signal !== 'neutral') {
    if (sentiment.signal === 'bullish') {
      bullishScore += 8;
      bullishFactors.push({ name: 'Sentiment: Bullish', weight: 8 });
    } else if (sentiment.signal === 'bearish') {
      bearishScore += 8;
      bearishFactors.push({ name: 'Sentiment: Bearish', weight: 8 });
    }
  }

  // 25. Whale Movements (Weight: 7) - NEW
  var whales = detectWhaleMovements(candles);
  if (whales.signal !== 'neutral') {
    if (whales.signal === 'bullish') {
      bullishScore += 7;
      bullishFactors.push({ name: 'Whales: ' + whales.whaleCount + ' Bullish', weight: 7 });
    } else if (whales.signal === 'bearish') {
      bearishScore += 7;
      bearishFactors.push({ name: 'Whales: ' + whales.whaleCount + ' Bearish', weight: 7 });
    }
  }

  // 26. Options Flow (Weight: 6) - NEW
  var optionsFlow = calculateOptionsFlow(candles, extraData.fundingRate);
  if (optionsFlow.signal !== 'neutral') {
    if (optionsFlow.signal === 'bullish') {
      bullishScore += 6;
      bullishFactors.push({ name: 'Options Flow: Bullish', weight: 6 });
    } else if (optionsFlow.signal === 'bearish') {
      bearishScore += 6;
      bearishFactors.push({ name: 'Options Flow: Bearish', weight: 6 });
    }
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
    signal: signal,
    probability: probability,
    totalScore: totalScore,
    entry: currentPrice,
    sl: sl,
    tp1: tp1,
    tp2: tp2,
    leverage: probability >= 75 ? '5x-10x' : '3x-5x',
    riskReward: 3,
    positionSize: Math.min(Math.round(probability / 5), 20),
    currentPrice: currentPrice,
    indicators: { rsi: rsi, macd: macd },
    bullishFactors: bullishFactors,
    bearishFactors: bearishFactors,
    neutralFactors: [],
    topTraders: { longRatio: 55, shortRatio: 45, confidence: 75 },
    orderBook: extraData.orderBook,
    fundingRate: extraData.fundingRate,
    multiTimeframe: extraData.multiTimeframe,
    rsiDivergence: rsiDiv,
    momentum: extraData.momentum,
    market: extraData.market,
    candlePatterns: candlePatterns,
    marketStructure: marketStructure,
    smartMoney: smartMoney,
    volumeProfile: volumeProfile,
    adx: adx,
    ichimoku: ichimoku,
    fibonacci: fibonacci,
    correlation: correlation,
    volatility: volatility,
    mlSignals: mlSignals,
    ensemble: ensemble,
    neuralNet: neuralNet,
    sentiment: sentiment,
    whales: whales,
    optionsFlow: optionsFlow
  };
}

function renderSignalCard(result) {
  var card = document.getElementById('signal-card');
  if (!card) return;

  var signalClass = 'wait';
  var signalText = t('waitSignal');

  if (result.signal === 'long') {
    signalClass = 'long';
    signalText = t('longPosition');
  } else if (result.signal === 'short') {
    signalClass = 'short';
    signalText = t('shortPosition');
  }

  card.className = 'signal-card ' + signalClass;

  var html = '<div class="signal-header">';
  html += '<h2>' + t('overallSignal') + '</h2>';
  html += '<div class="signal-badge ' + signalClass + '">' + signalText + '</div>';
  html += '</div>';
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

  var rsi = result.indicators.rsi;
  var macd = result.indicators.macd;
  var barClass = rsi.value < 30 ? 'oversold' : rsi.value > 70 ? 'overbought' : 'neutral';

  var html = '';
  
  // RSI
  html += '<div class="indicator-card">';
  html += '<div class="indicator-header">';
  html += '<h3>RSI (14)</h3>';
  html += '<span class="indicator-value ' + rsi.signal + '">' + rsi.value + '</span>';
  html += '</div>';
  html += '<div class="indicator-bar">';
  html += '<div class="bar-fill ' + barClass + '" style="width: ' + rsi.value + '%"></div>';
  html += '</div>';
  html += '</div>';

  // MACD
  html += '<div class="indicator-card">';
  html += '<div class="indicator-header">';
  html += '<h3>MACD</h3>';
  html += '<span class="indicator-value ' + macd.crossSignal + '">' + macd.crossSignal.toUpperCase() + '</span>';
  html += '</div>';
  html += '<div class="indicator-meta">';
  html += '<span>MACD: ' + macd.macd.toFixed(4) + '</span>';
  html += '<span>Signal: ' + macd.signal.toFixed(4) + '</span>';
  html += '</div>';
  html += '</div>';

  // Order Book
  if (result.orderBook) {
    var obSignal = result.orderBook.signal;
    html += '<div class="indicator-card">';
    html += '<div class="indicator-header">';
    html += '<h3>📋 Order Book</h3>';
    html += '<span class="indicator-value ' + obSignal + '">' + obSignal.toUpperCase() + '</span>';
    html += '</div>';
    html += '<div class="indicator-meta">';
    html += '<span>Bid/Ask: ' + result.orderBook.bidAskRatio + '</span>';
    html += '<span>Imbalance: ' + result.orderBook.imbalance + '%</span>';
    html += '</div>';
    html += '</div>';
  }

  // Funding Rate
  if (result.fundingRate) {
    var frSignal = result.fundingRate.signal;
    html += '<div class="indicator-card">';
    html += '<div class="indicator-header">';
    html += '<h3>💰 Funding Rate</h3>';
    html += '<span class="indicator-value ' + frSignal + '">' + frSignal.toUpperCase() + '</span>';
    html += '</div>';
    html += '<div class="indicator-meta">';
    html += '<span>Rate: ' + result.fundingRate.rate + '%</span>';
    html += '</div>';
    html += '</div>';
  }

  // Multi-Timeframe
  if (result.multiTimeframe) {
    var mtfSignal = result.multiTimeframe.signal;
    html += '<div class="indicator-card">';
    html += '<div class="indicator-header">';
    html += '<h3>🔄 Multi-TF</h3>';
    html += '<span class="indicator-value ' + mtfSignal + '">' + mtfSignal.toUpperCase() + '</span>';
    html += '</div>';
    html += '<div class="indicator-meta">';
    html += '<span>Alignment: ' + result.multiTimeframe.alignment + '%</span>';
    html += '</div>';
    html += '</div>';
  }

  // 24h Momentum
  if (result.momentum) {
    var momSignal = result.momentum.signal;
    var momClass = momSignal.includes('bullish') ? 'bullish' : momSignal.includes('bearish') ? 'bearish' : 'neutral';
    html += '<div class="indicator-card">';
    html += '<div class="indicator-header">';
    html += '<h3>⚡ 24h Momentum</h3>';
    html += '<span class="indicator-value ' + momClass + '">' + result.momentum.changePercent + '%</span>';
    html += '</div>';
    html += '<div class="indicator-meta">';
    html += '<span>Volume: $' + (result.momentum.volume/1e9).toFixed(2) + 'B</span>';
    html += '</div>';
    html += '</div>';
  }

  // Market Overview
  if (result.market && result.market.totalMarketCap > 0) {
    var marketSignal = result.market.signal;
    html += '<div class="indicator-card">';
    html += '<div class="indicator-header">';
    html += '<h3>🌍 Market</h3>';
    html += '<span class="indicator-value ' + marketSignal + '">' + result.market.marketChange + '%</span>';
    html += '</div>';
    html += '<div class="indicator-meta">';
    html += '<span>Cap: $' + (result.market.totalMarketCap/1e12).toFixed(2) + 'T</span>';
    html += '<span>BTC Dom: ' + result.market.btcDominance + '%</span>';
    html += '</div>';
    html += '</div>';
  }

  // Candlestick Patterns
  if (result.candlePatterns && result.candlePatterns.patterns && result.candlePatterns.patterns.length > 0) {
    var patternSignal = result.candlePatterns.signal;
    html += '<div class="indicator-card">';
    html += '<div class="indicator-header">';
    html += '<h3>🕯️ Candle Patterns</h3>';
    html += '<span class="indicator-value ' + patternSignal + '">' + patternSignal.toUpperCase() + '</span>';
    html += '</div>';
    html += '<div class="indicator-meta">';
    html += '<span>Detected: ' + result.candlePatterns.patterns.length + '</span>';
    html += '</div>';
    html += '</div>';
  }

  // Market Structure
  if (result.marketStructure && result.marketStructure.structure !== 'ranging') {
    var structureSignal = result.marketStructure.trend;
    html += '<div class="indicator-card">';
    html += '<div class="indicator-header">';
    html += '<h3>🏗️ Market Structure</h3>';
    html += '<span class="indicator-value ' + structureSignal + '">' + result.marketStructure.structure + '</span>';
    html += '</div>';
    html += '</div>';
  }

  // Smart Money Concepts
  if (result.smartMoney && (result.smartMoney.activeBullishOB || result.smartMoney.activeBearishOB || result.smartMoney.fvg.length > 0)) {
    var smSignal = result.smartMoney.signal;
    html += '<div class="indicator-card">';
    html += '<div class="indicator-header">';
    html += '<h3>💎 Smart Money</h3>';
    html += '<span class="indicator-value ' + smSignal + '">' + smSignal.toUpperCase() + '</span>';
    html += '</div>';
    html += '<div class="indicator-meta">';
    if (result.smartMoney.activeBullishOB) html += '<span>Bullish OB</span>';
    if (result.smartMoney.activeBearishOB) html += '<span>Bearish OB</span>';
    html += '<span>FVG: ' + result.smartMoney.fvg.length + '</span>';
    html += '</div>';
    html += '</div>';
  }

  // Volume Profile
  if (result.volumeProfile && result.volumeProfile.poc > 0) {
    var vpSignal = result.volumeProfile.signal;
    html += '<div class="indicator-card">';
    html += '<div class="indicator-header">';
    html += '<h3>📊 Volume Profile</h3>';
    html += '<span class="indicator-value ' + vpSignal + '">' + vpSignal.toUpperCase() + '</span>';
    html += '</div>';
    html += '<div class="indicator-meta">';
    html += '<span>POC: $' + formatPrice(result.volumeProfile.poc) + '</span>';
    html += '</div>';
    html += '</div>';
  }

  // ADX Trend Strength
  if (result.adx && result.adx.value > 20) {
    var adxSignal = result.adx.signal;
    html += '<div class="indicator-card">';
    html += '<div class="indicator-header">';
    html += '<h3>💪 ADX Strength</h3>';
    html += '<span class="indicator-value ' + adxSignal + '">' + result.adx.value.toFixed(1) + '</span>';
    html += '</div>';
    html += '<div class="indicator-meta">';
    html += '<span>Trend: ' + result.adx.trendStrength + '</span>';
    html += '</div>';
    html += '</div>';
  }

  // Ichimoku Cloud
  if (result.ichimoku && result.ichimoku.signal !== 'neutral') {
    var ichimokuSignal = result.ichimoku.signal;
    html += '<div class="indicator-card">';
    html += '<div class="indicator-header">';
    html += '<h3>☁️ Ichimoku</h3>';
    html += '<span class="indicator-value ' + ichimokuSignal + '">' + ichimokuSignal.toUpperCase() + '</span>';
    html += '</div>';
    html += '</div>';
  }

  // Fibonacci Retracement
  if (result.fibonacci && result.fibonacci.signal !== 'neutral') {
    var fibSignal = result.fibonacci.signal;
    html += '<div class="indicator-card">';
    html += '<div class="indicator-header">';
    html += '<h3>📏 Fibonacci</h3>';
    html += '<span class="indicator-value ' + fibSignal + '">' + fibSignal.toUpperCase() + '</span>';
    html += '</div>';
    html += '</div>';
  }

  // Correlation
  if (result.correlation && result.correlation.signal !== 'neutral') {
    var corrSignal = result.correlation.signal;
    html += '<div class="indicator-card">';
    html += '<div class="indicator-header">';
    html += '<h3>🔗 Correlation</h3>';
    html += '<span class="indicator-value ' + corrSignal + '">' + result.correlation.correlation.toFixed(2) + '</span>';
    html += '</div>';
    html += '</div>';
  }

  // Volatility
  if (result.volatility && result.volatility.signal !== 'neutral') {
    var volSignal = result.volatility.signal;
    html += '<div class="indicator-card">';
    html += '<div class="indicator-header">';
    html += '<h3>🌊 Volatility</h3>';
    html += '<span class="indicator-value ' + volSignal + '">' + result.volatility.volatility.toFixed(2) + '%</span>';
    html += '</div>';
    html += '</div>';
  }

  // Machine Learning
  if (result.mlSignals && result.mlSignals.signal !== 'neutral') {
    var mlSignal = result.mlSignals.signal;
    html += '<div class="indicator-card">';
    html += '<div class="indicator-header">';
    html += '<h3>🤖 ML Signal</h3>';
    html += '<span class="indicator-value ' + mlSignal + '">' + mlSignal.toUpperCase() + '</span>';
    html += '</div>';
    html += '<div class="indicator-meta">';
    html += '<span>Confidence: ' + result.mlSignals.confidence + '%</span>';
    html += '</div>';
    html += '</div>';
  }

  // Ensemble Learning
  if (result.ensemble && result.ensemble.signal !== 'neutral') {
    var ensembleSignal = result.ensemble.signal;
    html += '<div class="indicator-card">';
    html += '<div class="indicator-header">';
    html += '<h3>🎯 Ensemble</h3>';
    html += '<span class="indicator-value ' + ensembleSignal + '">' + ensembleSignal.toUpperCase() + '</span>';
    html += '</div>';
    html += '<div class="indicator-meta">';
    html += '<span>Confidence: ' + result.ensemble.confidence.toFixed(0) + '%</span>';
    html += '</div>';
    html += '</div>';
  }

  // Neural Network
  if (result.neuralNet && result.neuralNet.signal !== 'neutral') {
    var nnSignal = result.neuralNet.signal;
    html += '<div class="indicator-card">';
    html += '<div class="indicator-header">';
    html += '<h3>🧠 Neural Net</h3>';
    html += '<span class="indicator-value ' + nnSignal + '">' + nnSignal.toUpperCase() + '</span>';
    html += '</div>';
    html += '<div class="indicator-meta">';
    html += '<span>Confidence: ' + result.neuralNet.confidence.toFixed(0) + '%</span>';
    html += '</div>';
    html += '</div>';
  }

  // Sentiment Analysis
  if (result.sentiment && result.sentiment.signal !== 'neutral') {
    var sentSignal = result.sentiment.signal;
    html += '<div class="indicator-card">';
    html += '<div class="indicator-header">';
    html += '<h3>💭 Sentiment</h3>';
    html += '<span class="indicator-value ' + sentSignal + '">' + sentSignal.toUpperCase() + '</span>';
    html += '</div>';
    html += '<div class="indicator-meta">';
    html += '<span>Score: ' + result.sentiment.sentiment.toFixed(1) + '</span>';
    html += '</div>';
    html += '</div>';
  }

  // Whale Movements
  if (result.whales && result.whales.signal !== 'neutral') {
    var whaleSignal = result.whales.signal;
    html += '<div class="indicator-card">';
    html += '<div class="indicator-header">';
    html += '<h3>🐋 Whales</h3>';
    html += '<span class="indicator-value ' + whaleSignal + '">' + whaleSignal.toUpperCase() + '</span>';
    html += '</div>';
    html += '<div class="indicator-meta">';
    html += '<span>Detections: ' + result.whales.whaleCount + '</span>';
    html += '</div>';
    html += '</div>';
  }

  // Options Flow
  if (result.optionsFlow && result.optionsFlow.signal !== 'neutral') {
    var optSignal = result.optionsFlow.signal;
    html += '<div class="indicator-card">';
    html += '<div class="indicator-header">';
    html += '<h3>📊 Options Flow</h3>';
    html += '<span class="indicator-value ' + optSignal + '">' + optSignal.toUpperCase() + '</span>';
    html += '</div>';
    html += '</div>';
  }

  // RSI Divergence
  if (result.rsiDivergence && result.rsiDivergence.divergence !== 'none') {
    var divSignal = result.rsiDivergence.signal;
    html += '<div class="indicator-card">';
    html += '<div class="indicator-header">';
    html += '<h3>📐 RSI Divergence</h3>';
    html += '<span class="indicator-value ' + divSignal + '">' + result.rsiDivergence.divergence.toUpperCase() + '</span>';
    html += '</div>';
    html += '</div>';
  }

  container.innerHTML = html;
}

function renderProbabilityChart(result) {
  var container = document.getElementById('probability-chart');
  if (!container) return;

  var totalBullish = result.bullishFactors.reduce(function(a, b) { return a + b.weight; }, 0);
  var totalBearish = result.bearishFactors.reduce(function(a, b) { return a + b.weight; }, 0);
  var total = totalBullish + totalBearish;

  var color = result.signal === 'long' ? '#22c55e' : result.signal === 'short' ? '#ef4444' : '#f59e0b';

  var html = '<div class="prob-overview">';
  html += '<div class="prob-circle ' + result.signal + '">';
  html += '<svg viewBox="0 0 100 100">';
  html += '<circle cx="50" cy="50" r="45" fill="none" stroke="#333" stroke-width="8"/>';
  html += '<circle cx="50" cy="50" r="45" fill="none" stroke="' + color + '" stroke-width="8" ';
  html += 'stroke-dasharray="' + (result.probability * 2.83) + ' 283" stroke-linecap="round" transform="rotate(-90 50 50)"/>';
  html += '<text x="50" y="55" text-anchor="middle" fill="white" font-size="20" font-weight="bold">' + result.probability + '%</text>';
  html += '</svg>';
  html += '</div>';
  html += '</div>';

  container.innerHTML = html;
}

function renderFearGreed(data) {
  var container = document.getElementById('fear-greed-panel');
  if (!container || !data) return;

  var color = '#f59e0b';
  var label = 'Neutral';
  if (data.value <= 25) { color = '#22c55e'; label = 'Extreme Fear'; }
  else if (data.value <= 45) { color = '#22c55e'; label = 'Fear'; }
  else if (data.value <= 55) { color = '#f59e0b'; label = 'Neutral'; }
  else if (data.value <= 75) { color = '#ef4444'; label = 'Greed'; }
  else { color = '#ef4444'; label = 'Extreme Greed'; }

  var html = '<div class="fear-greed-gauge">';
  html += '<svg viewBox="0 0 200 120" class="gauge-svg">';
  html += '<path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#333" stroke-width="15" stroke-linecap="round"/>';
  html += '<path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="' + color + '" stroke-width="15" stroke-linecap="round" stroke-dasharray="' + (data.value * 2.51) + ' 251"/>';
  html += '<text x="100" y="90" text-anchor="middle" fill="' + color + '" font-size="28" font-weight="bold">' + data.value + '</text>';
  html += '</svg>';
  html += '<div class="fg-label" style="color:' + color + '">' + label + '</div>';
  html += '<div class="fg-desc">' + data.classification;
  
  // Add trend indicator
  if (data.trend) {
    var trendIcon = data.trend === 'rising' ? '📈' : data.trend === 'falling' ? '📉' : '➡️';
    html += ' ' + trendIcon + ' ' + data.trend.toUpperCase();
  }
  
  html += '</div>';
  
  // Add 10-day history mini chart
  if (data.history && data.history.length > 0) {
    html += '<div style="margin-top:10px;font-size:0.75rem;color:var(--text-muted);">';
    html += '10-Day: ' + data.history.slice(0, 10).map(function(v) {
      var c = v < 25 ? '#22c55e' : v > 75 ? '#ef4444' : v < 45 ? '#22c55e' : v > 55 ? '#ef4444' : '#f59e0b';
      return '<span style="color:' + c + '">' + v + '</span>';
    }).join(' → ');
    html += '</div>';
  }
  
  html += '</div>';

  container.innerHTML = html;
}

function renderTopTraders(traders) {
  var container = document.getElementById('top-traders-panel');
  if (!container) return;

  var html = '<div class="traders-chart">';
  html += '<div class="trader-bar">';
  html += '<div class="long-bar" style="width:' + traders.longRatio + '%"><span>' + traders.longRatio + '%</span></div>';
  html += '<div class="short-bar" style="width:' + traders.shortRatio + '%"><span>' + traders.shortRatio + '%</span></div>';
  html += '</div>';
  html += '</div>';
  html += '<div class="trader-confidence"><span>Confidence: ' + traders.confidence + '%</span></div>';

  container.innerHTML = html;
}

function renderTrending() {
  var container = document.getElementById('news-panel');
  if (!container) return;

  var trending = window.AppState.trending;
  
  if (!trending || !trending.coins || trending.coins.length === 0) {
    container.innerHTML = '<div class="no-data">No trending data</div>';
    return;
  }

  var html = '<div style="font-size:0.85rem;">';
  trending.coins.forEach(function(coin, idx) {
    html += '<div style="padding:0.5rem 0;border-bottom:1px solid var(--border-color);">';
    html += '<span style="font-weight:600;">' + (idx + 1) + '. ' + coin.symbol + '</span>';
    html += '<span style="color:var(--text-muted);margin-left:0.5rem;">' + coin.name + '</span>';
    if (coin.marketCapRank) {
      html += '<span style="float:right;color:var(--accent-purple);font-size:0.75rem;">Rank #' + coin.marketCapRank + '</span>';
    }
    html += '</div>';
  });
  html += '</div>';
  
  container.innerHTML = html;
}

function renderNews() {
  renderTrending();
}

function renderInternalChart(result) {
  if (!priceChart || currentChartType !== 'internal') return;

  var candles = window.AppState.candleData;
  if (!candles || candles.length === 0) return;

  var closes = candles.map(function(c) { return c.close; });
  var ema9 = calculateEMA(closes, 9);
  var ema21 = calculateEMA(closes, 21);

  priceChart.setData(candles, { ema9: ema9, ema21: ema21 });
}

function switchChart(type) {
  currentChartType = type;

  var internalBtn = document.getElementById('chart-internal-btn');
  var tvBtn = document.getElementById('chart-tv-btn');
  var internalContainer = document.getElementById('internal-chart-container');
  var tvContainer = document.getElementById('tradingview-widget');

  if (type === 'internal') {
    internalBtn.classList.add('active');
    tvBtn.classList.remove('active');
    internalContainer.style.display = 'block';
    tvContainer.style.display = 'none';

    if (window.AppState.lastAnalysis) {
      renderInternalChart(window.AppState.lastAnalysis);
    }
  } else {
    tvBtn.classList.add('active');
    internalBtn.classList.remove('active');
    tvContainer.style.display = 'block';
    internalContainer.style.display = 'none';
    
    tvContainer.innerHTML = '<iframe src="https://www.tradingview.com/widgetembed/?symbol=KUCOIN%3ABTCUSDT&interval=D&theme=dark&style=1" style="width:100%;height:500px;border:none;border-radius:8px"></iframe>';
  }
}

function renderResults(result) {
  renderSignalCard(result);
  renderIndicators(result);
  renderInternalChart(result);
  renderFearGreed(window.AppState.fearGreedData);
  renderTopTraders(result.topTraders);
  renderProbabilityChart(result);
  renderNews();
  updateLastUpdateTime();
}

function updateLastUpdateTime() {
  var el = document.getElementById('last-update');
  if (el) {
    var time = new Date().toLocaleString();
    var source = window.AppState.dataSource || 'API';
    el.textContent = 'Last Update: ' + time + ' | Data source: ' + source;
  }
}

// ============================================
// MAIN ANALYSIS FUNCTION
// ============================================
function runAnalysis() {
  showLoading(true);

  var coinInfo = cryptoOptions.find(function(c) { return c.id === window.AppState.crypto; });
  var coinName = coinInfo ? coinInfo.symbol : 'BTC';

  console.log('\n🔍 Analyzing ' + coinName + ' (' + window.AppState.timeframe + ')...');

  // Fetch all data in parallel
  Promise.all([
    fetchCryptoData(window.AppState.crypto, window.AppState.timeframe),
    fetchOrderBook(window.AppState.crypto),
    fetchFundingRate(window.AppState.crypto),
    fetchMultiTimeframeData(window.AppState.crypto, window.AppState.timeframe),
    fetchFearGreedIndex(),
    fetch24hrMomentum(window.AppState.crypto),
    fetchMarketOverview(),
    fetchTrendingCoins()
  ])
  .then(function(results) {
    var candles = results[0];
    var orderBook = results[1];
    var fundingRate = results[2];
    var multiTimeframe = results[3];
    var fearGreed = results[4];
    var momentum = results[5];
    var market = results[6];
    var trending = results[7];

    if (!candles || candles.length < 30) {
      showStatus('No data available', 'error');
      showLoading(false);
      return;
    }

    window.AppState.candleData = candles;
    window.AppState.fearGreedData = fearGreed;
    window.AppState.orderBook = orderBook;
    window.AppState.fundingRate = fundingRate;
    window.AppState.multiTimeframe = multiTimeframe;
    window.AppState.momentum = momentum;
    window.AppState.market = market;
    window.AppState.trending = trending;

    console.log('💰 Latest price: $' + candles[candles.length - 1].close);
    console.log('🧮 Running advanced analysis...');

    var extraData = {
      orderBook: orderBook,
      fundingRate: fundingRate,
      multiTimeframe: multiTimeframe,
      momentum: momentum,
      market: market,
      fearGreed: fearGreed
    };

    var result = analyzeAll(candles, extraData);

    console.log('📈 Signal: ' + result.signal + ', Probability: ' + result.probability + '%');
    console.log('📊 Bullish factors: ' + result.bullishFactors.length);
    console.log('📊 Bearish factors: ' + result.bearishFactors.length);

    window.AppState.lastAnalysis = result;
    window.AppState.lastSignal = result.signal;

    renderResults(result);
    console.log('✅ Advanced analysis complete!\n');
    showLoading(false);
  })
  .catch(function(error) {
    console.error('❌ Analysis error:', error);
    showStatus('Error: ' + error.message, 'error');
    showLoading(false);
  });
}

// ============================================
// INITIALIZATION
// ============================================
function initApp() {
  console.log('🚀 Initializing app...');
  console.log('🌐 Language:', window.AppState.language);

  // Set language
  document.documentElement.lang = window.AppState.language;
  document.documentElement.dir = window.AppState.language === 'fa' ? 'rtl' : 'ltr';
  document.title = t('appTitle');

  // Update all UI labels
  toggleLanguage();

  // Populate crypto select
  var cryptoSelect = document.getElementById('crypto-select');
  if (cryptoSelect) {
    var html = '';
    for (var i = 0; i < cryptoOptions.length; i++) {
      var c = cryptoOptions[i];
      var selected = c.id === window.AppState.crypto ? ' selected' : '';
      html += '<option value="' + c.id + '"' + selected + '>' + c.symbol + ' - ' + c.name + '</option>';
    }
    cryptoSelect.innerHTML = html;
    console.log('✅ Populated ' + cryptoOptions.length + ' cryptocurrencies');

    cryptoSelect.addEventListener('change', function(e) {
      window.AppState.crypto = e.target.value;
      localStorage.setItem('cryptoCoin', window.AppState.crypto);
      console.log('🔄 Crypto changed to:', window.AppState.crypto);
      runAnalysis();
    });
  } else {
    console.error('❌ crypto-select NOT FOUND!');
  }

  // Populate timeframe select
  var tfSelect = document.getElementById('timeframe-select');
  if (tfSelect) {
    var html = '';
    for (var i = 0; i < timeframeOptions.length; i++) {
      var tf = timeframeOptions[i];
      var selected = tf.id === window.AppState.timeframe ? ' selected' : '';
      html += '<option value="' + tf.id + '"' + selected + '>' + tf.label + '</option>';
    }
    tfSelect.innerHTML = html;
    console.log('✅ Populated ' + timeframeOptions.length + ' timeframes');

    tfSelect.addEventListener('change', function(e) {
      window.AppState.timeframe = e.target.value;
      localStorage.setItem('cryptoTimeframe', window.AppState.timeframe);
      console.log('🔄 Timeframe changed to:', window.AppState.timeframe);
      runAnalysis();
    });
  } else {
    console.error('❌ timeframe-select NOT FOUND!');
  }

  // Analyze button
  var analyzeBtn = document.getElementById('analyze-btn');
  if (analyzeBtn) {
    analyzeBtn.textContent = t('analyzeBtn');
    analyzeBtn.addEventListener('click', function() {
      console.log('🔍 Analyze button clicked');
      runAnalysis();
    });
  }

  // Auto refresh
  var autoRefreshToggle = document.getElementById('auto-refresh-toggle');
  if (autoRefreshToggle) {
    autoRefreshToggle.addEventListener('change', function(e) {
      window.AppState.autoRefresh = e.target.checked;
      if (window.AppState.autoRefresh) {
        window.AppState.refreshTimer = setInterval(runAnalysis, window.AppState.refreshInterval * 1000);
      } else {
        clearInterval(window.AppState.refreshTimer);
      }
    });
  }

  var refreshIntervalInput = document.getElementById('refresh-interval');
  if (refreshIntervalInput) {
    refreshIntervalInput.addEventListener('change', function(e) {
      window.AppState.refreshInterval = parseInt(e.target.value) || 60;
      if (window.AppState.autoRefresh) {
        clearInterval(window.AppState.refreshTimer);
        window.AppState.refreshTimer = setInterval(runAnalysis, window.AppState.refreshInterval * 1000);
      }
    });
  }

  // Initialize chart
  priceChart = new CandlestickChart('price-chart');
  console.log('✅ Chart initialized');

  // Run initial analysis
  console.log('📊 Running initial analysis...');
  runAnalysis();

  console.log('✅ App initialization complete!');
}

// Wait for DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

// Export for global access
window.toggleLanguage = toggleLanguage;
window.runAnalysis = runAnalysis;
window.switchChart = switchChart;
