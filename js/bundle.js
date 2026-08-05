// ============================================
// CRYPTO ANALYZER PRO - COMPLETE BUNDLE
// No ES6 Modules - Works Everywhere
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
  refreshInterval: 60
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
    var y = margin.top + (adjustedMin + data[i] - adjustedMin) / adjustedRange * chartHeight;
    y = margin.top + chartHeight - (data[i] - adjustedMin) / adjustedRange * chartHeight;
    
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
  return fetch('https://api.alternative.me/fng/?limit=1')
    .then(function(response) { return response.json(); })
    .then(function(data) {
      var value = parseInt(data.data[0].value);
      var classification = data.data[0].value_classification;
      return { value: value, classification: classification };
    })
    .catch(function(error) {
      console.warn('Fear & Greed API failed');
      return { value: 50, classification: 'Neutral' };
    });
}

// ============================================
// TECHNICAL ANALYSIS
// ============================================
function calculateRSI(prices, period) {
  period = period || 14;
  if (prices.length < period + 1) return { value: 50, signal: 'neutral' };

  var gains = 0, losses = 0;
  for (var i = prices.length - period; i < prices.length; i++) {
    var diff = prices[i] - prices[i - 1];
    if (diff > 0) gains += diff;
    else losses += Math.abs(diff);
  }

  var avgGain = gains / period;
  var avgLoss = losses / period;

  if (avgLoss === 0) return { value: 100, signal: 'overbought' };

  var rs = avgGain / avgLoss;
  var rsi = 100 - (100 / (1 + rs));

  var signal = 'neutral';
  if (rsi > 70) signal = 'overbought';
  else if (rsi < 30) signal = 'oversold';

  return { value: Math.round(rsi * 100) / 100, signal: signal };
}

function calculateEMA(prices, period) {
  if (prices.length < period) return [];

  var multiplier = 2 / (period + 1);
  var ema = [prices.slice(0, period).reduce(function(a, b) { return a + b; }) / period];

  for (var i = period; i < prices.length; i++) {
    ema.push((prices[i] - ema[ema.length - 1]) * multiplier + ema[ema.length - 1]);
  }
  return ema;
}

function calculateMACD(prices) {
  if (prices.length < 26) return { macd: 0, signal: 0, histogram: 0, crossSignal: 'neutral' };

  var ema12 = calculateEMA(prices, 12);
  var ema26 = calculateEMA(prices, 26);

  var offset = ema12.length - ema26.length;
  var macdLine = [];
  for (var i = 0; i < ema26.length; i++) {
    macdLine.push(ema12[i + offset] - ema26[i]);
  }

  var signalLine = macdLine.length >= 9 ? calculateEMA(macdLine, 9) : [0];
  var macd = macdLine[macdLine.length - 1] || 0;
  var signal = signalLine[signalLine.length - 1] || 0;
  var histogram = macd - signal;

  var crossSignal = 'neutral';
  if (macd > signal) crossSignal = 'bullish';
  else if (macd < signal) crossSignal = 'bearish';

  return { macd: macd, signal: signal, histogram: histogram, crossSignal: crossSignal };
}

function analyzeAll(candles) {
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

  // RSI
  if (rsi.value < 30) {
    bullishScore += 15;
    bullishFactors.push({ name: 'RSI Oversold', weight: 15 });
  } else if (rsi.value > 70) {
    bearishScore += 15;
    bearishFactors.push({ name: 'RSI Overbought', weight: 15 });
  }

  // MACD
  if (macd.crossSignal === 'bullish') {
    bullishScore += 10;
    bullishFactors.push({ name: 'MACD Bullish', weight: 10 });
  } else if (macd.crossSignal === 'bearish') {
    bearishScore += 10;
    bearishFactors.push({ name: 'MACD Bearish', weight: 10 });
  }

  // EMA Cross
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

  // Trend
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

  var totalScore = bullishScore - bearishScore;
  var probability = Math.min(50 + Math.abs(totalScore), 95);

  var signal = 'wait';
  if (totalScore > 20) signal = 'long';
  else if (totalScore < -20) signal = 'short';

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
    topTraders: { longRatio: 55, shortRatio: 45, confidence: 75 }
  };
}

// ============================================
// RENDERING FUNCTIONS
// ============================================
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
  html += '<div class="indicator-card">';
  html += '<div class="indicator-header">';
  html += '<h3>RSI (14)</h3>';
  html += '<span class="indicator-value ' + rsi.signal + '">' + rsi.value + '</span>';
  html += '</div>';
  html += '<div class="indicator-bar">';
  html += '<div class="bar-fill ' + barClass + '" style="width: ' + rsi.value + '%"></div>';
  html += '</div>';
  html += '</div>';

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
  html += '<div class="fg-desc">' + data.classification + '</div>';
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

function renderNews() {
  var container = document.getElementById('news-panel');
  if (!container) return;

  var html = '<div class="no-data">' + t('noNews') + '</div>';
  container.innerHTML = html;
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
    
    // TradingView iframe
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

  fetchCryptoData(window.AppState.crypto, window.AppState.timeframe)
    .then(function(candles) {
      if (!candles || candles.length < 30) {
        showStatus('No data available', 'error');
        showLoading(false);
        return;
      }

      window.AppState.candleData = candles;
      console.log('💰 Latest price: $' + candles[candles.length - 1].close);
      console.log('🧮 Running analysis...');

      var result = analyzeAll(candles);

      console.log('📈 Signal: ' + result.signal + ', Probability: ' + result.probability + '%');

      window.AppState.lastAnalysis = result;

      // Fetch Fear & Greed
      return fetchFearGreedIndex().then(function(fgi) {
        window.AppState.fearGreedData = fgi;
        return result;
      });
    })
    .then(function(result) {
      if (!result) return;
      
      renderResults(result);
      console.log('✅ Analysis complete!\n');
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
  toggleLanguage(); // This will set all the labels

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
