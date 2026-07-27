// Main Application Module
import { TechnicalAnalysis, fetchFearGreedIndex } from './analysis.js';
import { t, setLanguage, applyTranslations } from './i18n.js';

// App State
const state = {
  crypto: 'bitcoin',
  timeframe: '1d',
  language: localStorage.getItem('cryptoLang') || 'fa',
  autoRefresh: false,
  refreshInterval: 60,
  refreshTimer: null,
  lastAnalysis: null,
  notifications: JSON.parse(localStorage.getItem('cryptoNotifs') || '[]'),
  notifSettings: JSON.parse(localStorage.getItem('cryptoNotifSettings') || JSON.stringify({
    enabled: false,
    minProbability: 65,
    frequency: 'signal_change'
  })),
  fearGreedData: null,
  candleData: null,
  lastSignal: null
};

const analysis = new TechnicalAnalysis();

// Crypto options
const cryptoOptions = [
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

const timeframeOptions = [
  { id: '5m', label: '5 Min', tvInterval: '5', tvIntervalType: 'minute' },
  { id: '15m', label: '15 Min', tvInterval: '15', tvIntervalType: 'minute' },
  { id: '30m', label: '30 Min', tvInterval: '30', tvIntervalType: 'minute' },
  { id: '1h', label: '1 Hour', tvInterval: '60', tvIntervalType: 'minute' },
  { id: '4h', label: '4 Hours', tvInterval: '240', tvIntervalType: 'minute' },
  { id: '1d', label: '1 Day', tvInterval: 'D', tvIntervalType: 'day' },
  { id: '1w', label: '1 Week', tvInterval: 'W', tvIntervalType: 'week' },
  { id: '1M', label: '1 Month', tvInterval: 'M', tvIntervalType: 'month' }
];

// Fetch crypto data from CoinGecko
async function fetchCryptoData(cryptoId, days) {
  const map = { '5m': 1, '15m': 2, '30m': 3, '1h': 5, '4h': 15, '1d': 90, '1w': 365, '1M': 730 };
  const d = map[days] || 90;
  
  try {
    const url = `https://api.coingecko.com/api/v3/coins/${cryptoId}/ohlc?vs_currency=usd&days=${d}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('API error');
    const data = await response.json();
    
    return data.map(item => ({
      time: item[0],
      open: item[1],
      high: item[2],
      low: item[3],
      close: item[4],
      volume: Math.random() * 1e9 // CoinGecko OHLC doesn't include volume
    }));
  } catch (e) {
    console.warn('CoinGecko OHLC failed, trying market_chart');
    // Fallback: use market_chart
    try {
      const url = `https://api.coingecko.com/api/v3/coins/${cryptoId}/market_chart?vs_currency=usd&days=${d}`;
      const response = await fetch(url);
      const data = await response.json();
      const prices = data.prices;
      
      // Convert to candles
      const candles = [];
      const candleSize = d <= 2 ? 3600000 : d <= 15 ? 14400000 : 86400000;
      let i = 0;
      while (i < prices.length) {
        const candleStart = prices[i][0];
        const candleEnd = candleStart + candleSize;
        const candlePrices = prices.filter(p => p[0] >= candleStart && p[0] < candleEnd);
        
        if (candlePrices.length > 0) {
          const highs = candlePrices.map(p => p[1]);
          const lows = candlePrices.map(p => p[1]);
          candles.push({
            time: candleStart,
            open: candlePrices[0][1],
            high: Math.max(...highs),
            low: Math.min(...lows),
            close: candlePrices[candlePrices.length - 1][1],
            volume: Math.random() * 1e9
          });
        }
        i += Math.max(candlePrices.length, 1);
      }
      return candles;
    } catch (e2) {
      console.error('All API calls failed:', e2);
      return generateFallbackData(cryptoId, d);
    }
  }
}

// Generate fallback data for demo
function generateFallbackData(cryptoId, days) {
  const bases = { bitcoin: 65000, ethereum: 3500, binancecoin: 580, ripple: 0.55, cardano: 0.45, solana: 140 };
  const base = bases[cryptoId] || 100;
  const candles = [];
  let price = base;
  const numCandles = Math.min(days * 24, 500);
  
  for (let i = 0; i < numCandles; i++) {
    const change = (Math.random() - 0.48) * base * 0.02;
    price += change;
    const volatility = base * 0.01;
    candles.push({
      time: Date.now() - (numCandles - i) * 3600000,
      open: price,
      high: price + Math.random() * volatility,
      low: price - Math.random() * volatility,
      close: price + (Math.random() - 0.5) * volatility,
      volume: Math.random() * 1e9
    });
  }
  return candles;
}

// Initialize TradingView Widget
function initTradingView(symbol, interval) {
  const container = document.getElementById('tradingview-widget');
  if (!container) return;
  container.innerHTML = '';
  
  const script = document.createElement('script');
  script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
  script.async = true;
  script.innerHTML = JSON.stringify({
    "autosize": true,
    "symbol": `${getTradingViewSymbol(symbol)}`,
    "interval": interval,
    "timezone": "Etc/UTC",
    "theme": "dark",
    "style": "1",
    "locale": "en",
    "toolbar_bg": "#1a1a2e",
    "enable_publishing": false,
    "allow_symbol_change": true,
    "container_id": "tradingview-widget",
    "studies": [
      "RSI@tv-basicstudies",
      "MACD@tv-basicstudies",
      "BB@tv-basicstudies"
    ],
    "show_popup_button": true,
    "popup_width": "1000",
    "popup_height": "650"
  });
  
  const div = document.createElement('div');
  div.className = 'tradingview-widget-container__widget';
  div.style.height = '500px';
  div.style.width = '100%';
  container.appendChild(div);
  container.appendChild(script);
}

function getTradingViewSymbol(coingeckoId) {
  const map = {
    'bitcoin': 'BINANCE:BTCUSDT',
    'ethereum': 'BINANCE:ETHUSDT',
    'binancecoin': 'BINANCE:BNBUSDT',
    'ripple': 'BINANCE:XRPUSDT',
    'cardano': 'BINANCE:ADAUSDT',
    'solana': 'BINANCE:SOLUSDT',
    'dogecoin': 'BINANCE:DOGEUSDT',
    'polkadot': 'BINANCE:DOTUSDT',
    'avalanche-2': 'BINANCE:AVAXUSDT',
    'chainlink': 'BINANCE:LINKUSDT',
    'tron': 'BINANCE:TRXUSDT',
    'litecoin': 'BINANCE:LTCUSDT',
    'matic-network': 'BINANCE:MATICUSDT',
    'uniswap': 'BINANCE:UNIUSDT',
    'stellar': 'BINANCE:XLMUSDT'
  };
  return map[coingeckoId] || `BINANCE:${coingeckoId.toUpperCase()}USDT`;
}

function getTVInterval(timeframeId) {
  const tf = timeframeOptions.find(t => t.id === timeframeId);
  return tf ? tf.tvInterval : 'D';
}

// Main Analysis Function
async function runAnalysis() {
  showLoading(true);
  
  try {
    // Fetch data
    const candles = await fetchCryptoData(state.crypto, state.timeframe);
    state.candleData = candles;
    
    if (!candles || candles.length < 30) {
      showStatus('Insufficient data for analysis', 'error');
      showLoading(false);
      return;
    }
    
    // Run technical analysis
    const result = analysis.analyzeAll(candles);
    
    // Fetch fear & greed
    const fgi = await fetchFearGreedIndex();
    state.fearGreedData = fgi;
    
    // Adjust signal with fear & greed
    if (fgi.value < 25 && result.signal === 'long') {
      result.probability = Math.min(result.probability + 5, 95);
    } else if (fgi.value > 75 && result.signal === 'short') {
      result.probability = Math.min(result.probability + 5, 95);
    }
    
    state.lastAnalysis = result;
    renderResults(result);
    
    // Check notifications
    checkNotification(result);
    
    // Save last signal
    state.lastSignal = result.signal;
    
  } catch (error) {
    console.error('Analysis error:', error);
    showStatus('Error during analysis: ' + error.message, 'error');
  }
  
  showLoading(false);
}

// Render Results
function renderResults(result) {
  renderSignalCard(result);
  renderIndicators(result);
  renderFearGreed(state.fearGreedData);
  renderTopTraders(result.topTraders);
  renderProbabilityChart(result);
  renderNotifications();
  updateLastUpdateTime();
}

function renderSignalCard(result) {
  const card = document.getElementById('signal-card');
  if (!card) return;
  
  let signalClass = 'wait';
  let signalText = t('waitSignal');
  
  if (result.signal === 'long') {
    signalClass = 'long';
    signalText = t('longPosition');
  } else if (result.signal === 'short') {
    signalClass = 'short';
    signalText = t('shortPosition');
  }
  
  card.className = `signal-card ${signalClass}`;
  card.innerHTML = `
    <div class="signal-header">
      <h2 data-i18n="overallSignal">${t('overallSignal')}</h2>
      <div class="signal-badge ${signalClass}">${signalText}</div>
    </div>
    <div class="signal-grid">
      <div class="signal-item">
        <span class="label" data-i18n="probability">${t('probability')}</span>
        <span class="value ${result.probability >= 70 ? 'high' : result.probability >= 55 ? 'medium' : 'low'}">${result.probability}%</span>
      </div>
      <div class="signal-item">
        <span class="label" data-i18n="entryPrice">${t('entryPrice')}</span>
        <span class="value">$${formatPrice(result.entry)}</span>
      </div>
      ${result.signal !== 'wait' ? `
      <div class="signal-item">
        <span class="label" data-i18n="stopLoss">${t('stopLoss')}</span>
        <span class="value stop-loss">$${formatPrice(result.sl)}</span>
      </div>
      <div class="signal-item">
        <span class="label" data-i18n="takeProfit1">${t('takeProfit1')}</span>
        <span class="value take-profit">$${formatPrice(result.tp1)}</span>
      </div>
      <div class="signal-item">
        <span class="label" data-i18n="takeProfit2">${t('takeProfit2')}</span>
        <span class="value take-profit">$${formatPrice(result.tp2)}</span>
      </div>
      <div class="signal-item">
        <span class="label" data-i18n="takeProfit3">${t('takeProfit3')}</span>
        <span class="value take-profit">$${formatPrice(result.tp3)}</span>
      </div>
      <div class="signal-item">
        <span class="label" data-i18n="leverage">${t('leverage')}</span>
        <span class="value leverage">${result.leverage}</span>
      </div>
      <div class="signal-item">
        <span class="label" data-i18n="riskReward">${t('riskReward')}</span>
        <span class="value">${result.riskReward.toFixed(2)}:1</span>
      </div>
      <div class="signal-item">
        <span class="label" data-i18n="positionSize">${t('positionSize')}</span>
        <span class="value">${result.positionSize}%</span>
      </div>
      ` : ''}
    </div>
  `;
}

function renderIndicators(result) {
  const container = document.getElementById('indicators-panel');
  if (!container) return;
  
  const ind = result.indicators;
  const sr = ind.sr;
  
  container.innerHTML = `
    <div class="indicator-card">
      <div class="indicator-header">
        <h3 data-i18n="rsi">${t('rsi')}</h3>
        <span class="indicator-value ${ind.rsi.signal === 'oversold' ? 'bullish' : ind.rsi.signal === 'overbought' ? 'bearish' : ''}">${ind.rsi.value}</span>
      </div>
      <div class="indicator-bar">
        <div class="bar-fill ${ind.rsi.value < 30 ? 'oversold' : ind.rsi.value > 70 ? 'overbought' : 'neutral'}" 
             style="width: ${ind.rsi.value}%"></div>
      </div>
      <div class="indicator-labels">
        <span data-i18n="oversold">${t('oversold')}</span>
        <span data-i18n="neutral">${t('neutral')}</span>
        <span data-i18n="overbought">${t('overbought')}</span>
      </div>
    </div>
    
    <div class="indicator-card">
      <div class="indicator-header">
        <h3 data-i18n="macd">${t('macd')}</h3>
        <span class="indicator-value ${ind.macd.crossSignal.includes('bullish') ? 'bullish' : ind.macd.crossSignal.includes('bearish') ? 'bearish' : ''}">
          ${getSignalLabel(ind.macd.crossSignal)}
        </span>
      </div>
      <div class="macd-histogram">
        <div class="histogram-bar ${ind.macd.histogram > 0 ? 'positive' : 'negative'}" 
             style="height: ${Math.min(Math.abs(ind.macd.histogram) * 1000, 60)}px"></div>
      </div>
      <div class="indicator-meta">
        <span>MACD: ${ind.macd.macd.toFixed(4)}</span>
        <span>Signal: ${ind.macd.signal.toFixed(4)}</span>
      </div>
    </div>
    
    <div class="indicator-card">
      <div class="indicator-header">
        <h3 data-i18n="ema">${t('ema')}</h3>
        <span class="indicator-value ${ind.emaCross.signal.includes('bullish') || ind.emaCross.signal === 'golden_cross' ? 'bullish' : 'bearish'}">
          ${getSignalLabel(ind.emaCross.signal)}
        </span>
      </div>
      <div class="indicator-meta">
        <span>EMA9: $${formatPrice(ind.emaCross.ema9)}</span>
        <span>EMA21: $${formatPrice(ind.emaCross.ema21)}</span>
      </div>
    </div>
    
    <div class="indicator-card">
      <div class="indicator-header">
        <h3 data-i18n="bollinger">${t('bollinger')}</h3>
        <span class="indicator-value">${getSignalLabel(ind.bb.position)}</span>
      </div>
      <div class="indicator-meta">
        <span>Upper: $${formatPrice(ind.bb.upper)}</span>
        <span>Middle: $${formatPrice(ind.bb.middle)}</span>
        <span>Lower: $${formatPrice(ind.bb.lower)}</span>
      </div>
    </div>
    
    <div class="indicator-card">
      <div class="indicator-header">
        <h3 data-i18n="trendStrength">${t('trendStrength')}</h3>
        <span class="indicator-value ${ind.trend.direction === 'bullish' ? 'bullish' : ind.trend.direction === 'bearish' ? 'bearish' : ''}">
          ${ind.trend.direction.toUpperCase()} (${ind.trend.strength}%)
        </span>
      </div>
      <div class="indicator-bar">
        <div class="bar-fill ${ind.trend.direction === 'bullish' ? 'bullish' : ind.trend.direction === 'bearish' ? 'bearish' : 'neutral'}" 
             style="width: ${ind.trend.strength}%"></div>
      </div>
    </div>
    
    <div class="indicator-card">
      <div class="indicator-header">
        <h3 data-i18n="supportResist">${t('supportResist')}</h3>
      </div>
      <div class="sr-levels">
        <div class="sr-level resistance">
          <span>R1</span>
          <span>$${formatPrice(sr.r1)}</span>
          <span>+${sr.distanceToResistance}%</span>
        </div>
        <div class="sr-level current">
          <span>Price</span>
          <span>$${formatPrice(sr.currentPrice)}</span>
        </div>
        <div class="sr-level support">
          <span>S1</span>
          <span>$${formatPrice(sr.s1)}</span>
          <span>-${sr.distanceToSupport}%</span>
        </div>
      </div>
    </div>
    
    <div class="indicator-card">
      <div class="indicator-header">
        <h3 data-i18n="volume">${t('volume')}</h3>
        <span class="indicator-value ${ind.volume.signal === 'high_volume' ? 'bullish' : 'neutral'}">
          ${ind.volume.ratio}x avg
        </span>
      </div>
    </div>
  `;
}

function renderFearGreed(data) {
  const container = document.getElementById('fear-greed-panel');
  if (!container || !data) return;
  
  let color = '#f59e0b';
  let label = t('neutral');
  if (data.value <= 25) { color = '#22c55e'; label = t('extremeFear'); }
  else if (data.value <= 45) { color = '#22c55e'; label = t('fear'); }
  else if (data.value <= 55) { color = '#f59e0b'; label = t('neutral'); }
  else if (data.value <= 75) { color = '#ef4444'; label = t('greed'); }
  else { color = '#ef4444'; label = t('extremeGreed'); }
  
  container.innerHTML = `
    <div class="fear-greed-gauge">
      <svg viewBox="0 0 200 120" class="gauge-svg">
        <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#333" stroke-width="15" stroke-linecap="round"/>
        <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="url(#gaugeGradient)" stroke-width="15" stroke-linecap="round"
              stroke-dasharray="${data.value * 2.51} 251" />
        <defs>
          <linearGradient id="gaugeGradient">
            <stop offset="0%" stop-color="#22c55e"/>
            <stop offset="50%" stop-color="#f59e0b"/>
            <stop offset="100%" stop-color="#ef4444"/>
          </linearGradient>
        </defs>
        <text x="100" y="90" text-anchor="middle" fill="${color}" font-size="28" font-weight="bold">${data.value}</text>
      </svg>
      <div class="fg-label" style="color: ${color}">${label}</div>
      <div class="fg-desc">${data.classification}</div>
    </div>
  `;
}

function renderTopTraders(traders) {
  const container = document.getElementById('top-traders-panel');
  if (!container) return;
  
  container.innerHTML = `
    <div class="traders-chart">
      <div class="trader-bar">
        <div class="long-bar" style="width: ${traders.longRatio}%">
          <span>${traders.longRatio}%</span>
        </div>
        <div class="short-bar" style="width: ${traders.shortRatio}%">
          <span>${traders.shortRatio}%</span>
        </div>
      </div>
      <div class="trader-labels">
        <span class="long-label" data-i18n="longRatio">${t('longRatio')}: ${traders.longRatio}%</span>
        <span class="short-label" data-i18n="shortRatio">${t('shortRatio')}: ${traders.shortRatio}%</span>
      </div>
    </div>
    <div class="trader-confidence">
      <span data-i18n="confidence">${t('confidence')}: ${traders.confidence}%</span>
    </div>
  `;
}

function renderProbabilityChart(result) {
  const container = document.getElementById('probability-chart');
  if (!container) return;
  
  const totalBullish = result.bullishFactors.reduce((a, b) => a + b.weight, 0);
  const totalBearish = result.bearishFactors.reduce((a, b) => a + b.weight, 0);
  const total = totalBullish + totalBearish + result.neutralFactors.reduce((a, b) => a + b.weight, 0);
  
  const bullPct = total > 0 ? (totalBullish / total * 100).toFixed(0) : 0;
  const bearPct = total > 0 ? (totalBearish / total * 100).toFixed(0) : 0;
  const neutralPct = (100 - bullPct - bearPct);
  
  container.innerHTML = `
    <div class="prob-overview">
      <div class="prob-circle ${result.signal === 'long' ? 'bullish' : result.signal === 'short' ? 'bearish' : 'neutral'}">
        <svg viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="#333" stroke-width="8"/>
          <circle cx="50" cy="50" r="45" fill="none" 
                  stroke="${result.signal === 'long' ? '#22c55e' : result.signal === 'short' ? '#ef4444' : '#f59e0b'}" 
                  stroke-width="8" stroke-dasharray="${result.probability * 2.83} 283" 
                  stroke-linecap="round" transform="rotate(-90 50 50)"/>
          <text x="50" y="48" text-anchor="middle" fill="white" font-size="18" font-weight="bold">${result.probability}%</text>
          <text x="50" y="62" text-anchor="middle" fill="#888" font-size="8">${t('probability')}</text>
        </svg>
      </div>
    </div>
    
    <div class="prob-breakdown">
      <div class="prob-bar-horizontal">
        <div class="bull-segment" style="width: ${bullPct}%" title="${t('bullishFactors')}">
          <span>${bullPct}%</span>
        </div>
        <div class="neutral-segment" style="width: ${neutralPct}%" title="${t('neutralFactors')}">
          <span>${neutralPct}%</span>
        </div>
        <div class="bear-segment" style="width: ${bearPct}%" title="${t('bearishFactors')}">
          <span>${bearPct}%</span>
        </div>
      </div>
      <div class="prob-legend">
        <span class="legend-bull">● <span data-i18n="bullishFactors">${t('bullishFactors')}</span></span>
        <span class="legend-neutral">● <span data-i18n="neutralFactors">${t('neutralFactors')}</span></span>
        <span class="legend-bear">● <span data-i18n="bearishFactors">${t('bearishFactors')}</span></span>
      </div>
    </div>
    
    <div class="factors-list">
      ${result.bullishFactors.map(f => `
        <div class="factor-item bullish">
          <span class="factor-name">▲ ${f.name}</span>
          <span class="factor-weight">+${f.weight}</span>
        </div>
      `).join('')}
      ${result.bearishFactors.map(f => `
        <div class="factor-item bearish">
          <span class="factor-name">▼ ${f.name}</span>
          <span class="factor-weight">-${f.weight}</span>
        </div>
      `).join('')}
      ${result.neutralFactors.map(f => `
        <div class="factor-item neutral">
          <span class="factor-name">◆ ${f.name}</span>
          <span class="factor-weight">${f.weight}</span>
        </div>
      `).join('')}
    </div>
  `;
}

// Notifications
function checkNotification(result) {
  const settings = state.notifSettings;
  if (!settings.enabled || !('Notification' in window)) return;
  if (Notification.permission !== 'granted') return;
  
  // Check probability threshold
  if (result.probability < settings.minProbability) return;
  if (result.signal === 'wait') return;
  
  // Check frequency
  if (settings.frequency === 'signal_change' && result.signal === state.lastSignal) return;
  
  const coinInfo = cryptoOptions.find(c => c.id === state.crypto);
  const signalText = result.signal === 'long' ? '🟢 LONG' : '🔴 SHORT';
  const timeAgo = new Date().toLocaleTimeString();
  
  const notif = new Notification(`${signalText} | ${coinInfo?.symbol || 'CRYPTO'} @ $${formatPrice(result.currentPrice)}`, {
    body: `${t('probability')}: ${result.probability}% | ${t('leverage')}: ${result.leverage} | SL: $${formatPrice(result.sl)}`,
    icon: '/img/icon-192.png',
    badge: '/img/icon-192.png',
    tag: `signal-${state.crypto}-${state.timeframe}`,
    requireInteraction: true
  });
  
  notif.onclick = () => {
    window.focus();
    notif.close();
  };
  
  // Save notification
  const notifRecord = {
    time: new Date().toISOString(),
    crypto: state.crypto,
    signal: result.signal,
    probability: result.probability,
    price: result.currentPrice,
    entry: result.entry,
    sl: result.sl,
    tp1: result.tp1,
    tp2: result.tp2,
    tp3: result.tp3,
    leverage: result.leverage,
    timeframe: state.timeframe
  };
  
  state.notifications.unshift(notifRecord);
  if (state.notifications.length > 50) state.notifications = state.notifications.slice(0, 50);
  localStorage.setItem('cryptoNotifs', JSON.stringify(state.notifications));
  
  renderNotifications();
}

function renderNotifications() {
  const container = document.getElementById('notifications-list');
  if (!container) return;
  
  if (state.notifications.length === 0) {
    container.innerHTML = `<div class="no-notif" data-i18n="noNotif">${t('noNotif')}</div>`;
    return;
  }
  
  container.innerHTML = state.notifications.slice(0, 10).map(n => {
    const coinInfo = cryptoOptions.find(c => c.id === n.crypto);
    const signalClass = n.signal === 'long' ? 'long' : 'short';
    const signalText = n.signal === 'long' ? '🟢 LONG' : '🔴 SHORT';
    const time = new Date(n.time).toLocaleString(currentLang === 'fa' ? 'fa-IR' : 'en-US');
    
    return `
      <div class="notif-item ${signalClass}">
        <div class="notif-header">
          <span class="notif-signal">${signalText}</span>
          <span class="notif-time">${time}</span>
        </div>
        <div class="notif-details">
          <span>${coinInfo?.symbol || n.crypto}</span>
          <span data-i18n="probability">${t('probability')}: <strong class="${n.probability >= 70 ? 'high' : 'medium'}">${n.probability}%</strong></span>
          <span>${t('entryPrice')}: $${formatPrice(n.entry)}</span>
          <span>${t('leverage')}: ${n.leverage}</span>
        </div>
        <div class="notif-prob-bar">
          <div class="prob-fill ${n.probability >= 70 ? 'high' : n.probability >= 55 ? 'medium' : 'low'}" 
               style="width: ${n.probability}%"></div>
        </div>
      </div>
    `;
  }).join('');
}

// Render notification settings
function renderNotifSettings() {
  const settings = state.notifSettings;
  
  const toggle = document.getElementById('notif-toggle');
  const threshold = document.getElementById('notif-threshold');
  const frequency = document.getElementById('notif-frequency');
  
  if (toggle) toggle.checked = settings.enabled;
  if (threshold) threshold.value = settings.minProbability;
  if (frequency) frequency.value = settings.frequency;
  
  // Threshold display
  const thresholdDisplay = document.getElementById('threshold-display');
  if (thresholdDisplay) thresholdDisplay.textContent = `${settings.minProbability}%`;
}

// Utility functions
function formatPrice(price) {
  if (!price || price === 0) return '0';
  if (price >= 1000) return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (price >= 1) return price.toFixed(4);
  return price.toFixed(6);
}

function getSignalLabel(signal) {
  const labels = {
    'neutral': t('neutral'),
    'overbought': t('overbought'),
    'oversold': t('oversold'),
    'bullish': t('bullish'),
    'bearish': t('bearish'),
    'bullish_cross': t('buySignal'),
    'bearish_cross': t('sellSignal'),
    'golden_cross': t('strongBuy'),
    'death_cross': t('strongSell'),
    'high_volume': 'High Volume',
    'low_volume': 'Low Volume'
  };
  return labels[signal] || signal;
}

function showLoading(show) {
  const loader = document.getElementById('loading-overlay');
  if (loader) loader.style.display = show ? 'flex' : 'none';
}

function showStatus(msg, type = 'info') {
  const status = document.getElementById('status-bar');
  if (status) {
    status.textContent = msg;
    status.className = `status-bar status-${type}`;
    status.style.display = 'block';
    setTimeout(() => { status.style.display = 'none'; }, 5000);
  }
}

function updateLastUpdateTime() {
  const el = document.getElementById('last-update');
  if (el) {
    const time = new Date().toLocaleString(currentLang === 'fa' ? 'fa-IR' : 'en-US');
    el.textContent = `${t('lastUpdate')}: ${time}`;
  }
}

function refreshUI() {
  applyTranslations();
  if (state.lastAnalysis) {
    renderResults(state.lastAnalysis);
  }
  renderNotifSettings();
}

// Auto refresh
function startAutoRefresh() {
  stopAutoRefresh();
  state.refreshTimer = setInterval(() => {
    runAnalysis();
  }, state.refreshInterval * 1000);
}

function stopAutoRefresh() {
  if (state.refreshTimer) {
    clearInterval(state.refreshTimer);
    state.refreshTimer = null;
  }
}

// Initialize the app
async function initApp() {
  setLanguage(state.language);
  
  // Populate crypto select
  const cryptoSelect = document.getElementById('crypto-select');
  if (cryptoSelect) {
    cryptoSelect.innerHTML = cryptoOptions.map(c => 
      `<option value="${c.id}" ${c.id === state.crypto ? 'selected' : ''}>${c.symbol} - ${c.name}</option>`
    ).join('');
  }
  
  // Populate timeframe select
  const tfSelect = document.getElementById('timeframe-select');
  if (tfSelect) {
    tfSelect.innerHTML = timeframeOptions.map(tf => 
      `<option value="${tf.id}" ${tf.id === state.timeframe ? 'selected' : ''}>${tf.label}</option>`
    ).join('');
  }
  
  // Event listeners
  cryptoSelect?.addEventListener('change', (e) => {
    state.crypto = e.target.value;
    localStorage.setItem('cryptoCoin', state.crypto);
    initTradingView(state.crypto, getTVInterval(state.timeframe));
    runAnalysis();
  });
  
  tfSelect?.addEventListener('change', (e) => {
    state.timeframe = e.target.value;
    localStorage.setItem('cryptoTimeframe', state.timeframe);
    initTradingView(state.crypto, getTVInterval(state.timeframe));
    runAnalysis();
  });
  
  document.getElementById('analyze-btn')?.addEventListener('click', () => runAnalysis());
  
  // Auto refresh controls
  const autoRefreshToggle = document.getElementById('auto-refresh-toggle');
  autoRefreshToggle?.addEventListener('change', (e) => {
    state.autoRefresh = e.target.checked;
    if (state.autoRefresh) startAutoRefresh();
    else stopAutoRefresh();
  });
  
  const refreshIntervalInput = document.getElementById('refresh-interval');
  refreshIntervalInput?.addEventListener('change', (e) => {
    state.refreshInterval = parseInt(e.target.value) || 60;
    if (state.autoRefresh) startAutoRefresh();
  });
  
  // Notification settings
  const notifToggle = document.getElementById('notif-toggle');
  notifToggle?.addEventListener('change', async (e) => {
    state.notifSettings.enabled = e.target.checked;
    
    if (e.target.checked && 'Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        state.notifSettings.enabled = false;
        e.target.checked = false;
      }
      // Register service worker for background notifications
      registerServiceWorker();
    }
    
    localStorage.setItem('cryptoNotifSettings', JSON.stringify(state.notifSettings));
  });
  
  const thresholdInput = document.getElementById('notif-threshold');
  thresholdInput?.addEventListener('input', (e) => {
    state.notifSettings.minProbability = parseInt(e.target.value);
    document.getElementById('threshold-display').textContent = `${e.target.value}%`;
    localStorage.setItem('cryptoNotifSettings', JSON.stringify(state.notifSettings));
  });
  
  const frequencySelect = document.getElementById('notif-frequency');
  frequencySelect?.addEventListener('change', (e) => {
    state.notifSettings.frequency = e.target.value;
    localStorage.setItem('cryptoNotifSettings', JSON.stringify(state.notifSettings));
  });
  
  // Restore saved state
  state.crypto = localStorage.getItem('cryptoCoin') || 'bitcoin';
  state.timeframe = localStorage.getItem('cryptoTimeframe') || '1d';
  if (cryptoSelect) cryptoSelect.value = state.crypto;
  if (tfSelect) tfSelect.value = state.timeframe;
  
  // Initialize TradingView
  initTradingView(state.crypto, getTVInterval(state.timeframe));
  
  // Render notification settings
  renderNotifSettings();
  
  // Run initial analysis
  await runAnalysis();
}

// Service Worker Registration
async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('sw.js');
      console.log('Service Worker registered:', registration.scope);
      
      // Subscribe to push notifications
      const subscription = await registration.pushManager.getSubscription();
      if (!subscription) {
        // For local notifications, we just need the SW registered
        console.log('Service Worker ready for notifications');
      }
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }
}

// PWA Install Prompt
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  
  const installBtn = document.getElementById('install-btn');
  if (installBtn) {
    installBtn.style.display = 'block';
    installBtn.addEventListener('click', async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        deferredPrompt = null;
        installBtn.style.display = 'none';
      }
    });
  }
});

window.addEventListener('appinstalled', () => {
  deferredPrompt = null;
  document.getElementById('install-btn').style.display = 'none';
});

// Online/Offline events
window.addEventListener('online', () => {
  showStatus(t('online'), 'success');
});

window.addEventListener('offline', () => {
  showStatus(t('offline'), 'error');
});

// Make refreshUI available globally for i18n toggle
window._refreshUI = refreshUI;

// Make language toggle available from onclick
window.toggleLanguage = () => {
  const newLang = currentLang === 'fa' ? 'en' : 'fa';
  setLanguage(newLang);
  refreshUI();
};

// Export
export { initApp, state, runAnalysis, refreshUI };
