// Advanced Technical Analysis Engine with 5 Extra Parameters
class TechnicalAnalysis {
  constructor() {
    this.indicators = {};
    this.signals = [];
  }

  // Calculate RSI
  calculateRSI(prices, period = 14) {
    if (prices.length < period + 1) return { value: 50, signal: 'neutral' };
    
    let gains = 0, losses = 0;
    for (let i = prices.length - period; i < prices.length; i++) {
      const diff = prices[i] - prices[i - 1];
      if (diff > 0) gains += diff;
      else losses += Math.abs(diff);
    }
    
    const avgGain = gains / period;
    const avgLoss = losses / period;
    
    if (avgLoss === 0) return { value: 100, signal: 'overbought' };
    
    const rs = avgGain / avgLoss;
    const rsi = 100 - (100 / (1 + rs));
    
    let signal = 'neutral';
    if (rsi > 70) signal = 'overbought';
    else if (rsi < 30) signal = 'oversold';
    
    return { value: Math.round(rsi * 100) / 100, signal };
  }

  // Calculate EMA
  calculateEMA(prices, period) {
    if (prices.length < period) return [];
    
    const multiplier = 2 / (period + 1);
    let ema = [prices.slice(0, period).reduce((a, b) => a + b) / period];
    
    for (let i = period; i < prices.length; i++) {
      ema.push((prices[i] - ema[ema.length - 1]) * multiplier + ema[ema.length - 1]);
    }
    return ema;
  }

  // Calculate SMA
  calculateSMA(prices, period) {
    if (prices.length < period) return [];
    const sma = [];
    for (let i = period - 1; i < prices.length; i++) {
      const sum = prices.slice(i - period + 1, i + 1).reduce((a, b) => a + b);
      sma.push(sum / period);
    }
    return sma;
  }

  // MACD Calculation
  calculateMACD(prices) {
    if (prices.length < 26) return { macd: 0, signal: 0, histogram: 0, crossSignal: 'neutral' };
    
    const ema12 = this.calculateEMA(prices, 12);
    const ema26 = this.calculateEMA(prices, 26);
    
    const offset = ema12.length - ema26.length;
    const macdLine = [];
    for (let i = 0; i < ema26.length; i++) {
      macdLine.push(ema12[i + offset] - ema26[i]);
    }
    
    const signalLine = macdLine.length >= 9 ? this.calculateEMA(macdLine, 9) : [0];
    const signalOffset = macdLine.length - signalLine.length;
    
    const macd = macdLine[macdLine.length - 1] || 0;
    const signal = signalLine[signalLine.length - 1] || 0;
    const histogram = macd - signal;
    
    let crossSignal = 'neutral';
    if (macdLine.length >= 2 && signalLine.length >= 2) {
      const prevMacd = macdLine[macdLine.length - 2];
      const prevSignal = signalLine[signalLine.length - 2];
      
      if (prevMacd <= prevSignal && macd > signal) crossSignal = 'bullish_cross';
      else if (prevMacd >= prevSignal && macd < signal) crossSignal = 'bearish_cross';
      else if (macd > signal) crossSignal = 'bullish';
      else crossSignal = 'bearish';
    }
    
    return { macd, signal, histogram, crossSignal };
  }

  // Bollinger Bands
  calculateBollingerBands(prices, period = 20, stdDev = 2) {
    if (prices.length < period) return { upper: 0, middle: 0, lower: 0, position: 'neutral' };
    
    const recentPrices = prices.slice(-period);
    const sma = recentPrices.reduce((a, b) => a + b) / period;
    
    const squaredDiffs = recentPrices.map(p => Math.pow(p - sma, 2));
    const variance = squaredDiffs.reduce((a, b) => a + b) / period;
    const std = Math.sqrt(variance);
    
    const upper = sma + (stdDev * std);
    const lower = sma - (stdDev * std);
    const currentPrice = prices[prices.length - 1];
    
    let position = 'neutral';
    if (currentPrice >= upper) position = 'overbought';
    else if (currentPrice <= lower) position = 'oversold';
    else if (currentPrice > sma) position = 'bullish';
    else position = 'bearish';
    
    return { upper, middle: sma, lower, position, bandwidth: (upper - lower) / sma * 100 };
  }

  // Volume Analysis
  analyzeVolume(volumes) {
    if (volumes.length < 20) return { signal: 'neutral', ratio: 1 };
    
    const avgVolume = volumes.slice(-20).reduce((a, b) => a + b) / 20;
    const currentVolume = volumes[volumes.length - 1];
    const ratio = currentVolume / avgVolume;
    
    let signal = 'neutral';
    if (ratio > 1.5) signal = 'high_volume';
    else if (ratio < 0.5) signal = 'low_volume';
    
    return { signal, ratio: Math.round(ratio * 100) / 100, avgVolume, currentVolume };
  }

  // Support & Resistance
  calculateSupportResistance(highs, lows, closes) {
    const recentHighs = highs.slice(-30);
    const recentLows = lows.slice(-30);
    
    const resistance = Math.max(...recentHighs);
    const support = Math.min(...recentLows);
    const currentPrice = closes[closes.length - 1];
    
    const pivotPoint = (resistance + support + currentPrice) / 3;
    const r1 = 2 * pivotPoint - support;
    const s1 = 2 * pivotPoint - resistance;
    
    return {
      resistance, support, pivotPoint,
      r1, s1,
      currentPrice,
      distanceToResistance: ((resistance - currentPrice) / currentPrice * 100).toFixed(2),
      distanceToSupport: ((currentPrice - support) / currentPrice * 100).toFixed(2)
    };
  }

  // Trend Analysis
  analyzeTrend(prices) {
    if (prices.length < 50) return { direction: 'neutral', strength: 0 };
    
    const ema20 = this.calculateEMA(prices, 20);
    const ema50 = this.calculateEMA(prices, 50);
    
    const currentEma20 = ema20[ema20.length - 1];
    const currentEma50 = ema50[ema50.length - 1];
    const currentPrice = prices[prices.length - 1];
    
    let direction = 'neutral';
    let strength = 0;
    
    if (currentPrice > currentEma20 && currentEma20 > currentEma50) {
      direction = 'bullish';
      strength = Math.min(((currentPrice - currentEma50) / currentEma50 * 100) * 10, 100);
    } else if (currentPrice < currentEma20 && currentEma20 < currentEma50) {
      direction = 'bearish';
      strength = Math.min(((currentEma50 - currentPrice) / currentEma50 * 100) * 10, 100);
    } else {
      direction = 'neutral';
      strength = 30;
    }
    
    return { direction, strength: Math.round(strength), ema20: currentEma20, ema50: currentEma50 };
  }

  // EMA Crossover Signal
  analyzeEMACrossover(prices) {
    if (prices.length < 50) return { signal: 'neutral' };
    
    const ema9 = this.calculateEMA(prices, 9);
    const ema21 = this.calculateEMA(prices, 21);
    
    if (ema9.length < 2 || ema21.length < 2) return { signal: 'neutral' };
    
    const offset = ema9.length - ema21.length;
    const current9 = ema9[ema9.length - 1];
    const current21 = ema21[ema21.length - 1];
    const prev9 = ema9[ema9.length - 2];
    const prev21 = ema21[ema21.length - 2 + (ema21.length < ema9.length ? 0 : 0)];
    
    let signal = 'neutral';
    if (prev9 <= prev21 && current9 > current21) signal = 'golden_cross';
    else if (prev9 >= prev21 && current9 < current21) signal = 'death_cross';
    else if (current9 > current21) signal = 'bullish';
    else signal = 'bearish';
    
    return { signal, ema9: current9, ema21: current21 };
  }

  // NEW: Volume Profile Analysis
  analyzeVolumeProfile(candles, period = 50) {
    if (candles.length < period) return { poc: 0, vah: 0, val: 0, signal: 'neutral' };
    
    const recentCandles = candles.slice(-period);
    const priceRange = recentCandles.map(c => c.high).reduce((a, b) => Math.max(a, b)) - 
                       recentCandles.map(c => c.low).reduce((a, b) => Math.min(a, b));
    const binSize = priceRange / 20;
    
    // Create volume profile
    const profile = {};
    recentCandles.forEach(c => {
      const priceLevel = Math.floor((c.close - Math.min(...recentCandles.map(x => x.low))) / binSize);
      profile[priceLevel] = (profile[priceLevel] || 0) + c.volume;
    });
    
    // Find Point of Control (highest volume)
    const maxVolume = Math.max(...Object.values(profile));
    const pocLevel = Object.keys(profile).find(k => profile[k] === maxVolume);
    const poc = parseFloat(pocLevel) * binSize + Math.min(...recentCandles.map(c => c.low));
    
    // Value Area (70% of volume)
    const totalVolume = Object.values(profile).reduce((a, b) => a + b, 0);
    const valueAreaVolume = totalVolume * 0.7;
    
    let accumulated = 0;
    const sortedLevels = Object.entries(profile).sort((a, b) => b[1] - a[1]);
    const valueAreaLevels = [];
    
    for (const [level, vol] of sortedLevels) {
      accumulated += vol;
      valueAreaLevels.push(parseFloat(level));
      if (accumulated >= valueAreaVolume) break;
    }
    
    const vah = Math.max(...valueAreaLevels) * binSize + Math.min(...recentCandles.map(c => c.low));
    const val = Math.min(...valueAreaLevels) * binSize + Math.min(...recentCandles.map(c => c.low));
    
    const currentPrice = candles[candles.length - 1].close;
    let signal = 'neutral';
    
    if (currentPrice > vah) signal = 'bullish';
    else if (currentPrice < val) signal = 'bearish';
    
    return { poc, vah, val, signal, profile };
  }

  // NEW: ADX (Average Directional Index) - Trend Strength
  calculateADX(candles, period = 14) {
    if (candles.length < period * 2) return { value: 0, trendStrength: 'weak' };
    
    let plusDM = 0, minusDM = 0, tr = 0;
    
    for (let i = candles.length - period; i < candles.length; i++) {
      const high = candles[i].high;
      const low = candles[i].low;
      const prevHigh = candles[i - 1].high;
      const prevLow = candles[i - 1].low;
      const prevClose = candles[i - 1].close;
      
      const upMove = high - prevHigh;
      const downMove = prevLow - low;
      
      if (upMove > downMove && upMove > 0) plusDM += upMove;
      if (downMove > upMove && downMove > 0) minusDM += downMove;
      
      tr += Math.max(high - low, Math.abs(high - prevClose), Math.abs(low - prevClose));
    }
    
    const plusDI = (plusDM / tr) * 100;
    const minusDI = (minusDM / tr) * 100;
    const dx = (Math.abs(plusDI - minusDI) / (plusDI + minusDI)) * 100;
    
    let trendStrength = 'weak';
    if (dx > 50) trendStrength = 'very_strong';
    else if (dx > 25) trendStrength = 'strong';
    else if (dx > 20) trendStrength = 'moderate';
    
    return { value: Math.round(dx * 100) / 100, trendStrength, plusDI, minusDI };
  }

  // NEW: Stochastic RSI
  calculateStochasticRSI(prices, rsiPeriod = 14, stochPeriod = 14) {
    if (prices.length < rsiPeriod + stochPeriod) return { k: 50, d: 50, signal: 'neutral' };
    
    // Calculate RSI series
    const rsiValues = [];
    for (let i = rsiPeriod; i <= prices.length; i++) {
      const slice = prices.slice(0, i);
      const rsi = this.calculateRSI(slice, rsiPeriod);
      rsiValues.push(rsi.value);
    }
    
    if (rsiValues.length < stochPeriod) return { k: 50, d: 50, signal: 'neutral' };
    
    const recentRSI = rsiValues.slice(-stochPeriod);
    const minRSI = Math.min(...recentRSI);
    const maxRSI = Math.max(...recentRSI);
    
    const currentRSI = rsiValues[rsiValues.length - 1];
    const k = ((currentRSI - minRSI) / (maxRSI - minRSI)) * 100;
    
    // Calculate %D (3-period SMA of %K)
    const kValues = rsiValues.slice(-3).map(rsi => ((rsi - minRSI) / (maxRSI - minRSI)) * 100);
    const d = kValues.reduce((a, b) => a + b, 0) / 3;
    
    let signal = 'neutral';
    if (k < 20 && d < 20) signal = 'oversold';
    else if (k > 80 && d > 80) signal = 'overbought';
    
    return { k: Math.round(k * 100) / 100, d: Math.round(d * 100) / 100, signal };
  }


  // ============================================
  // ULTRA-ADVANCED: Candlestick Pattern Recognition
  // ============================================
  detectCandlestickPatterns(candles) {
    if (candles.length < 3) return { patterns: [], score: 0, signal: 'neutral' };
    
    const patterns = [];
    const recent = candles.slice(-5);
    let score = 0;
    
    for (let i = 0; i < recent.length; i++) {
      const c = recent[i];
      const body = Math.abs(c.close - c.open);
      const range = c.high - c.low;
      const upperWick = c.high - Math.max(c.open, c.close);
      const lowerWick = Math.min(c.open, c.close) - c.low;
      
      // Hammer (bullish reversal)
      if (lowerWick > body * 2 && upperWick < body * 0.3 && c.close > c.open) {
        patterns.push({ name: 'Hammer', type: 'bullish', weight: 12 });
        score += 12;
      }
      
      // Shooting Star (bearish reversal)
      if (upperWick > body * 2 && lowerWick < body * 0.3 && c.close < c.open) {
        patterns.push({ name: 'Shooting Star', type: 'bearish', weight: 12 });
        score -= 12;
      }
      
      // Doji (indecision)
      if (body < range * 0.1 && range > 0) {
        patterns.push({ name: 'Doji', type: 'neutral', weight: 5 });
      }
      
      // Engulfing patterns
      if (i > 0) {
        const prev = recent[i - 1];
        // Bullish Engulfing
        if (prev.close < prev.open && c.close > c.open && 
            c.open < prev.close && c.close > prev.open) {
          patterns.push({ name: 'Bullish Engulfing', type: 'bullish', weight: 15 });
          score += 15;
        }
        // Bearish Engulfing
        if (prev.close > prev.open && c.close < c.open && 
            c.open > prev.close && c.close < prev.open) {
          patterns.push({ name: 'Bearish Engulfing', type: 'bearish', weight: 15 });
          score -= 15;
        }
      }
    }
    
    let signal = 'neutral';
    if (score > 10) signal = 'bullish';
    else if (score < -10) signal = 'bearish';
    
    return { patterns, score, signal };
  }

  // ============================================
  // ULTRA-ADVANCED: Divergence Detection (RSI vs Price)
  // ============================================
  detectDivergence(candles) {
    if (candles.length < 30) return { divergence: 'none', signal: 'neutral', score: 0 };
    
    const closes = candles.map(c => c.close);
    const rsiValues = [];
    
    // Calculate RSI series
    for (let i = 14; i <= closes.length; i++) {
      const slice = closes.slice(0, i);
      const rsi = this.calculateRSI(slice, 14);
      rsiValues.push({ price: closes[i - 1], rsi: rsi.value, index: i - 1 });
    }
    
    if (rsiValues.length < 10) return { divergence: 'none', signal: 'neutral', score: 0 };
    
    const recent = rsiValues.slice(-20);
    let score = 0;
    let divergence = 'none';
    
    // Find swing highs and lows
    const swingHighs = [];
    const swingLows = [];
    
    for (let i = 2; i < recent.length - 2; i++) {
      if (recent[i].price > recent[i-1].price && recent[i].price > recent[i-2].price &&
          recent[i].price > recent[i+1].price && recent[i].price > recent[i+2].price) {
        swingHighs.push(recent[i]);
      }
      if (recent[i].price < recent[i-1].price && recent[i].price < recent[i-2].price &&
          recent[i].price < recent[i+1].price && recent[i].price < recent[i+2].price) {
        swingLows.push(recent[i]);
      }
    }
    
    // Bearish divergence: price higher high, RSI lower high
    if (swingHighs.length >= 2) {
      const last = swingHighs[swingHighs.length - 1];
      const prev = swingHighs[swingHighs.length - 2];
      if (last.price > prev.price && last.rsi < prev.rsi) {
        divergence = 'bearish';
        score -= 15;
      }
    }
    
    // Bullish divergence: price lower low, RSI higher low
    if (swingLows.length >= 2) {
      const last = swingLows[swingLows.length - 1];
      const prev = swingLows[swingLows.length - 2];
      if (last.price < prev.price && last.rsi > prev.rsi) {
        divergence = 'bullish';
        score += 15;
      }
    }
    
    let signal = 'neutral';
    if (score > 10) signal = 'bullish';
    else if (score < -10) signal = 'bearish';
    
    return { divergence, signal, score };
  }

  // ============================================
  // ULTRA-ADVANCED: Market Structure (HH/HL/LH/LL)
  // ============================================
  analyzeMarketStructure(candles, lookback = 30) {
    if (candles.length < lookback) return { structure: 'ranging', trend: 'neutral', score: 0 };
    
    const recent = candles.slice(-lookback);
    const highs = [];
    const lows = [];
    
    // Find swing points
    for (let i = 2; i < recent.length - 2; i++) {
      if (recent[i].high > recent[i-1].high && recent[i].high > recent[i-2].high &&
          recent[i].high > recent[i+1].high && recent[i].high > recent[i+2].high) {
        highs.push(recent[i].high);
      }
      if (recent[i].low < recent[i-1].low && recent[i].low < recent[i-2].low &&
          recent[i].low < recent[i+1].low && recent[i].low < recent[i+2].low) {
        lows.push(recent[i].low);
      }
    }
    
    let structure = 'ranging';
    let trend = 'neutral';
    let score = 0;
    
    if (highs.length >= 2 && lows.length >= 2) {
      const lastHigh = highs[highs.length - 1];
      const prevHigh = highs[highs.length - 2];
      const lastLow = lows[lows.length - 1];
      const prevLow = lows[lows.length - 2];
      
      if (lastHigh > prevHigh && lastLow > prevLow) {
        structure = 'uptrend';
        trend = 'bullish';
        score = 20;
      } else if (lastHigh < prevHigh && lastLow < prevLow) {
        structure = 'downtrend';
        trend = 'bearish';
        score = -20;
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
    
    return { structure, trend, score };
  }

  // ============================================
  // ULTRA-ADVANCED: Smart Money Concepts (Order Blocks & FVG)
  // ============================================
  detectSmartMoneyLevels(candles) {
    if (candles.length < 20) return { orderBlocks: [], fvg: [], signal: 'neutral', score: 0 };
    
    const recent = candles.slice(-20);
    const currentPrice = candles[candles.length - 1].close;
    const orderBlocks = [];
    const fvg = [];
    let score = 0;
    
    // Detect Order Blocks (strong institutional candles)
    for (let i = 2; i < recent.length - 1; i++) {
      const body = Math.abs(recent[i].close - recent[i].open);
      const range = recent[i].high - recent[i].low;
      
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
    for (let i = 2; i < recent.length; i++) {
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
    const activeBullishOB = orderBlocks.find(ob => 
      ob.type === 'bullish' && 
      currentPrice >= ob.low * 0.99 && 
      currentPrice <= ob.high * 1.01
    );
    
    const activeBearishOB = orderBlocks.find(ob => 
      ob.type === 'bearish' && 
      currentPrice <= ob.high * 1.01 && 
      currentPrice >= ob.low * 0.99
    );
    
    if (activeBullishOB) {
      score += 15;
    }
    if (activeBearishOB) {
      score -= 15;
    }
    
    // Check unfilled FVGs
    const unfilledBullishFVG = fvg.filter(f => f.type === 'bullish' && !f.filled);
    const unfilledBearishFVG = fvg.filter(f => f.type === 'bearish' && !f.filled);
    
    if (unfilledBullishFVG.length > 0) score += 5;
    if (unfilledBearishFVG.length > 0) score -= 5;
    
    let signal = 'neutral';
    if (score > 10) signal = 'bullish';
    else if (score < -10) signal = 'bearish';
    
    return { orderBlocks, fvg, activeBullishOB, activeBearishOB, signal, score };
  }

  // ============================================
  // ULTRA-ADVANCED: BTC Dominance & Altcoin Correlation
  // ============================================
  async analyzeBTCInfluence(cryptoId) {
    if (cryptoId === 'bitcoin') {
      return { dominance: 50, correlation: 1, btcTrend: 'neutral', signal: 'neutral', score: 0 };
    }
    
    try {
      // Fetch BTC dominance
      const globalResp = await fetch('https://api.coingecko.com/api/v3/global');
      const globalData = await globalResp.json();
      const dominance = globalData.data.market_cap_percentage.btc;
      
      // Fetch BTC and altcoin prices for correlation
      const btcResp = await fetch('https://data-api.binance.vision/api/v3/klines?symbol=BTCUSDT&interval=1d&limit=30');
      const altResp = await fetch(`https://data-api.binance.vision/api/v3/klines?symbol=${this.getAltcoinSymbol(cryptoId)}&interval=1d&limit=30`);
      
      const btcData = await btcResp.json();
      const altData = await altResp.json();
      
      if (!Array.isArray(btcData) || !Array.isArray(altData) || btcData.length < 10 || altData.length < 10) {
        return { dominance, correlation: 0, btcTrend: 'neutral', signal: 'neutral', score: 0 };
      }
      
      const btcPrices = btcData.map(k => parseFloat(k[4]));
      const altPrices = altData.map(k => parseFloat(k[4]));
      
      // Calculate correlation
      const minLen = Math.min(btcPrices.length, altPrices.length);
      const btcSlice = btcPrices.slice(-minLen);
      const altSlice = altPrices.slice(-minLen);
      
      const btcReturns = [];
      const altReturns = [];
      for (let i = 1; i < btcSlice.length; i++) {
        btcReturns.push((btcSlice[i] - btcSlice[i-1]) / btcSlice[i-1]);
        altReturns.push((altSlice[i] - altSlice[i-1]) / altSlice[i-1]);
      }
      
      // Pearson correlation
      const n = btcReturns.length;
      const btcMean = btcReturns.reduce((a, b) => a + b, 0) / n;
      const altMean = altReturns.reduce((a, b) => a + b, 0) / n;
      
      let numerator = 0, btcVariance = 0, altVariance = 0;
      for (let i = 0; i < n; i++) {
        const btcDiff = btcReturns[i] - btcMean;
        const altDiff = altReturns[i] - altMean;
        numerator += btcDiff * altDiff;
        btcVariance += btcDiff * btcDiff;
        altVariance += altDiff * altDiff;
      }
      
      const correlation = numerator / Math.sqrt(btcVariance * altVariance);
      
      // BTC trend
      const btcChange = (btcPrices[btcPrices.length - 1] - btcPrices[0]) / btcPrices[0];
      const btcTrend = btcChange > 0.02 ? 'bullish' : btcChange < -0.02 ? 'bearish' : 'neutral';
      
      let signal = 'neutral';
      let score = 0;
      
      // High correlation with BTC
      if (Math.abs(correlation) > 0.7) {
        if (btcTrend === 'bullish') {
          signal = 'bullish';
          score = 10;
        } else if (btcTrend === 'bearish') {
          signal = 'bearish';
          score = -10;
        }
      }
      
      // BTC dominance effect
      if (dominance > 55) score -= 5;
      
      console.log(`✅ BTC Influence: Dominance ${dominance.toFixed(1)}%, Correlation ${correlation.toFixed(2)}, BTC ${btcTrend}`);
      
      return { dominance, correlation: Math.round(correlation * 100) / 100, btcTrend, signal, score };
    } catch (e) {
      console.warn('BTC Influence analysis failed:', e);
      return { dominance: 0, correlation: 0, btcTrend: 'neutral', signal: 'neutral', score: 0 };
    }
  }
  
  getAltcoinSymbol(cryptoId) {
    const map = {
      'ethereum': 'ETHUSDT', 'binancecoin': 'BNBUSDT', 'ripple': 'XRPUSDT',
      'cardano': 'ADAUSDT', 'solana': 'SOLUSDT', 'dogecoin': 'DOGEUSDT',
      'polkadot': 'DOTUSDT', 'avalanche-2': 'AVAXUSDT', 'chainlink': 'LINKUSDT',
      'tron': 'TRXUSDT', 'litecoin': 'LTCUSDT', 'matic-network': 'MATICUSDT',
      'uniswap': 'UNIUSDT', 'stellar': 'XLMUSDT'
    };
    return map[cryptoId] || (cryptoId.toUpperCase() + 'USDT');
  }

  // Calculate comprehensive signals with 5 NEW parameters
  analyzeAll(candles, extraData = {}) {
    const closes = candles.map(c => c.close);
    const highs = candles.map(c => c.high);
    const lows = candles.map(c => c.low);
    const volumes = candles.map(c => c.volume);
    
    // Original indicators
    const rsi = this.calculateRSI(closes);
    const macd = this.calculateMACD(closes);
    const bb = this.calculateBollingerBands(closes);
    const volume = this.analyzeVolume(volumes);
    const sr = this.calculateSupportResistance(highs, lows, closes);
    const trend = this.analyzeTrend(closes);
    const emaCross = this.analyzeEMACrossover(closes);
    
    // NEW: 5 Extra Parameters
    const volumeProfile = this.analyzeVolumeProfile(candles);
    const adx = this.calculateADX(candles);
    const stochRSI = this.calculateStochasticRSI(closes);
    const orderBook = extraData.orderBook || { bidAskRatio: 1, imbalance: 0, signal: 'neutral' };
    const fundingRate = extraData.fundingRate || { rate: 0, signal: 'neutral' };
    const multiTimeframe = extraData.multiTimeframe || { signal: 'neutral', alignment: 0 };
    
    // ULTRA-ADVANCED: 5 new professional indicators
    const candlePatterns = this.detectCandlestickPatterns(candles);
    const divergence = this.detectDivergence(candles);
    const marketStructure = this.analyzeMarketStructure(candles);
    const smartMoney = this.detectSmartMoneyLevels(candles);
    const btcInfluence = extraData.btcInfluence || { dominance: 0, correlation: 0, btcTrend: 'neutral', signal: 'neutral', score: 0 };
    
    const currentPrice = closes[closes.length - 1];
    
    // Calculate composite score with NEW weights
    let bullishScore = 0;
    let bearishScore = 0;
    const bullishFactors = [];
    const bearishFactors = [];
    const neutralFactors = [];
    
    // Original indicators (reduced weights)
    if (rsi.value < 30) { bullishScore += 10; bullishFactors.push({ name: 'RSI Oversold', weight: 10 }); }
    else if (rsi.value > 70) { bearishScore += 10; bearishFactors.push({ name: 'RSI Overbought', weight: 10 }); }
    
    if (macd.crossSignal === 'bullish_cross') { bullishScore += 10; bullishFactors.push({ name: 'MACD Bullish Cross', weight: 10 }); }
    else if (macd.crossSignal === 'bearish_cross') { bearishScore += 10; bearishFactors.push({ name: 'MACD Bearish Cross', weight: 10 }); }
    
    if (bb.position === 'oversold') { bullishScore += 5; bullishFactors.push({ name: 'BB Lower Band', weight: 5 }); }
    else if (bb.position === 'overbought') { bearishScore += 5; bearishFactors.push({ name: 'BB Upper Band', weight: 5 }); }
    
    if (trend.direction === 'bullish') { bullishScore += 10; bullishFactors.push({ name: 'Bullish Trend', weight: 10 }); }
    else if (trend.direction === 'bearish') { bearishScore += 10; bearishFactors.push({ name: 'Bearish Trend', weight: 10 }); }
    
    if (emaCross.signal === 'golden_cross') { bullishScore += 10; bullishFactors.push({ name: 'Golden Cross', weight: 10 }); }
    else if (emaCross.signal === 'death_cross') { bearishScore += 10; bearishFactors.push({ name: 'Death Cross', weight: 10 }); }
    
    // NEW: Volume Profile (Weight: 10)
    if (volumeProfile.signal === 'bullish') { 
      bullishScore += 10; 
      bullishFactors.push({ name: 'Above Volume Profile VAH', weight: 10 }); 
    } else if (volumeProfile.signal === 'bearish') { 
      bearishScore += 10; 
      bearishFactors.push({ name: 'Below Volume Profile VAL', weight: 10 }); 
    }
    
    // NEW: ADX Trend Strength (Weight: 10)
    if (adx.trendStrength === 'strong' || adx.trendStrength === 'very_strong') {
      if (adx.plusDI > adx.minusDI) {
        bullishScore += 10;
        bullishFactors.push({ name: `Strong Uptrend (ADX: ${adx.value})`, weight: 10 });
      } else {
        bearishScore += 10;
        bearishFactors.push({ name: `Strong Downtrend (ADX: ${adx.value})`, weight: 10 });
      }
    }
    
    // NEW: Stochastic RSI (Weight: 5)
    if (stochRSI.signal === 'oversold') {
      bullishScore += 5;
      bullishFactors.push({ name: 'Stoch RSI Oversold', weight: 5 });
    } else if (stochRSI.signal === 'overbought') {
      bearishScore += 5;
      bearishFactors.push({ name: 'Stoch RSI Overbought', weight: 5 });
    }
    
    // NEW: Order Book (Weight: 20) - HIGHEST
    if (orderBook.signal === 'bullish') {
      bullishScore += 20;
      bullishFactors.push({ name: 'Order Book: Buy Pressure', weight: 20 });
    } else if (orderBook.signal === 'bearish') {
      bearishScore += 20;
      bearishFactors.push({ name: 'Order Book: Sell Pressure', weight: 20 });
    }
    
    // NEW: Funding Rate (Weight: 15)
    if (fundingRate.signal === 'bullish') {
      bullishScore += 15;
      bullishFactors.push({ name: 'Funding Rate: Shorts Dominant', weight: 15 });
    } else if (fundingRate.signal === 'bearish') {
      bearishScore += 15;
      bearishFactors.push({ name: 'Funding Rate: Longs Dominant', weight: 15 });
    }
    
    // NEW: Multi-Timeframe (Weight: 15)
    if (multiTimeframe.signal === 'bullish') {
      bullishScore += 15;
      bullishFactors.push({ name: 'Multi-TF: Higher TF Bullish', weight: 15 });
    } else if (multiTimeframe.signal === 'bearish') {
      bearishScore += 15;
      bearishFactors.push({ name: 'Multi-TF: Higher TF Bearish', weight: 15 });
    }
    
    
    // ULTRA-ADVANCED: Candlestick Patterns (Weight: 10-15)
    if (candlePatterns.signal === 'bullish') { 
      bullishScore += Math.min(candlePatterns.score, 15);
      candlePatterns.patterns.filter(p => p.type === 'bullish').forEach(p => {
        bullishFactors.push({ name: '🕯️ ' + p.name, weight: p.weight });
      });
    } else if (candlePatterns.signal === 'bearish') { 
      bearishScore += Math.min(Math.abs(candlePatterns.score), 15);
      candlePatterns.patterns.filter(p => p.type === 'bearish').forEach(p => {
        bearishFactors.push({ name: '🕯️ ' + p.name, weight: p.weight });
      });
    }
    
    // ULTRA-ADVANCED: Divergence (Weight: 15)
    if (divergence.signal === 'bullish') {
      bullishScore += 15;
      bullishFactors.push({ name: '📐 RSI Bullish Divergence', weight: 15 });
    } else if (divergence.signal === 'bearish') {
      bearishScore += 15;
      bearishFactors.push({ name: '📐 RSI Bearish Divergence', weight: 15 });
    }
    
    // ULTRA-ADVANCED: Market Structure (Weight: 20)
    if (marketStructure.trend === 'bullish') {
      bullishScore += 20;
      bullishFactors.push({ name: '🏗️ Market: ' + marketStructure.structure, weight: 20 });
    } else if (marketStructure.trend === 'bearish') {
      bearishScore += 20;
      bearishFactors.push({ name: '🏗️ Market: ' + marketStructure.structure, weight: 20 });
    }
    
    // ULTRA-ADVANCED: Smart Money (Weight: 15-20)
    if (smartMoney.signal === 'bullish') {
      bullishScore += Math.min(smartMoney.score, 20);
      if (smartMoney.activeBullishOB) bullishFactors.push({ name: '💎 Bullish Order Block', weight: 15 });
      if (smartMoney.fvg.filter(f => f.type === 'bullish' && !f.filled).length > 0) {
        bullishFactors.push({ name: '💎 Unfilled Bullish FVG', weight: 10 });
      }
    } else if (smartMoney.signal === 'bearish') {
      bearishScore += Math.min(Math.abs(smartMoney.score), 20);
      if (smartMoney.activeBearishOB) bearishFactors.push({ name: '💎 Bearish Order Block', weight: 15 });
    }
    
    // ULTRA-ADVANCED: News Sentiment (Weight: 15)
    if (extraData.news && extraData.news.score !== 0) {
      if (extraData.news.score > 0) {
        bullishScore += Math.abs(extraData.news.score);
        bullishFactors.push({ name: `📰 News: ${extraData.news.overallSentiment.replace('_', ' ')}`, weight: Math.abs(extraData.news.score) });
      } else {
        bearishScore += Math.abs(extraData.news.score);
        bearishFactors.push({ name: `📰 News: ${extraData.news.overallSentiment.replace('_', ' ')}`, weight: Math.abs(extraData.news.score) });
      }
    }
    
    // ULTRA-ADVANCED: BTC Influence (Weight: 10)
    if (btcInfluence.signal === 'bullish') {
      bullishScore += Math.abs(btcInfluence.score);
      bullishFactors.push({ name: '📊 BTC: ' + btcInfluence.btcTrend + ' (Corr: ' + btcInfluence.correlation + ')', weight: Math.abs(btcInfluence.score) });
    } else if (btcInfluence.signal === 'bearish') {
      bearishScore += Math.abs(btcInfluence.score);
      bearishFactors.push({ name: '📊 BTC: ' + btcInfluence.btcTrend + ' (Corr: ' + btcInfluence.correlation + ')', weight: Math.abs(btcInfluence.score) });
    }
    
    // Volume confirmation
    if (volume.signal === 'high_volume') {
      if (bullishScore > bearishScore) { bullishScore += 5; bullishFactors.push({ name: 'Volume Confirms', weight: 5 }); }
      else { bearishScore += 5; bearishFactors.push({ name: 'Volume Confirms', weight: 5 }); }
    }
    
    const totalScore = bullishScore - bearishScore;
    const maxScore = 250; // Increased max score
    
    // Calculate probability (more accurate)
    const rawProbability = Math.abs(totalScore) / maxScore;
    const probability = Math.round((0.5 + rawProbability * 0.45) * 100); // 50-95% range
    
    let signal = 'wait';
    if (totalScore > 30) signal = 'long';
    else if (totalScore < -30) signal = 'short';
    
    // Calculate entry/exit points
    const atr = this.calculateATR(candles, 14);
    let entry, tp1, tp2, tp3, sl, leverage, riskReward, positionSize;
    
    if (signal === 'long') {
      entry = currentPrice;
      sl = currentPrice - (atr * 2);
      tp1 = currentPrice + (atr * 1.5);
      tp2 = currentPrice + (atr * 3);
      tp3 = currentPrice + (atr * 5);
      riskReward = (tp2 - entry) / (entry - sl);
      
      if (probability >= 80) leverage = '5x-10x';
      else if (probability >= 65) leverage = '3x-5x';
      else leverage = '2x-3x';
      
      positionSize = Math.min(Math.round(probability / 5), 20);
    } else if (signal === 'short') {
      entry = currentPrice;
      sl = currentPrice + (atr * 2);
      tp1 = currentPrice - (atr * 1.5);
      tp2 = currentPrice - (atr * 3);
      tp3 = currentPrice - (atr * 5);
      riskReward = (entry - tp2) / (sl - entry);
      
      if (probability >= 80) leverage = '5x-10x';
      else if (probability >= 65) leverage = '3x-5x';
      else leverage = '2x-3x';
      
      positionSize = Math.min(Math.round(probability / 5), 20);
    } else {
      entry = currentPrice;
      sl = tp1 = tp2 = tp3 = 0;
      leverage = 'N/A';
      riskReward = 0;
      positionSize = 0;
    }
    
    // Simulated top trader data
    const topTraders = this.simulateTopTraders(signal, probability);
    
    return {
      signal,
      probability,
      totalScore,
      entry, tp1, tp2, tp3, sl, leverage, riskReward, positionSize,
      indicators: { rsi, macd, bb, volume, sr, trend, emaCross },
      // NEW indicators
      advancedIndicators: { volumeProfile, adx, stochRSI, orderBook, fundingRate, multiTimeframe },
      ultraIndicators: { candlePatterns, divergence, marketStructure, smartMoney, btcInfluence },
      newsSentiment: extraData.news || null,
      bullishFactors, bearishFactors, neutralFactors,
      topTraders,
      currentPrice,
      atr
    };
  }

  // ATR Calculation
  calculateATR(candles, period = 14) {
    if (candles.length < period + 1) return candles[candles.length - 1].high - candles[candles.length - 1].low;
    
    let atrSum = 0;
    for (let i = candles.length - period; i < candles.length; i++) {
      const tr = Math.max(
        candles[i].high - candles[i].low,
        Math.abs(candles[i].high - candles[i - 1].close),
        Math.abs(candles[i].low - candles[i - 1].close)
      );
      atrSum += tr;
    }
    return atrSum / period;
  }

  // Simulate top trader analysis
  simulateTopTraders(mainSignal, probability) {
    const baseLong = mainSignal === 'long' ? 55 + Math.random() * 20 : 35 + Math.random() * 15;
    return {
      longRatio: Math.round(baseLong),
      shortRatio: Math.round(100 - baseLong),
      topTraderSignal: mainSignal,
      confidence: Math.round(probability * 0.9)
    };
  }
}

// Fear & Greed Index
async function fetchFearGreedIndex() {
  try {
    const response = await fetch('https://api.alternative.me/fng/?limit=1');
    const data = await response.json();
    const value = parseInt(data.data[0].value);
    const classification = data.data[0].value_classification;
    return { value, classification };
  } catch (e) {
    console.warn('Fear & Greed API failed, using simulated data');
    return { value: Math.round(40 + Math.random() * 20), classification: 'Neutral' };
  }
}

// NEW: Fetch Order Book Data
async function fetchOrderBook(symbol = 'BTCUSDT') {
  try {
    const response = await fetch(`https://data-api.binance.vision/api/v3/depth?symbol=${symbol}&limit=100`);
    const data = await response.json();
    
    const bids = data.bids; // [price, quantity]
    const asks = data.asks;
    
    const totalBidVolume = bids.reduce((sum, b) => sum + parseFloat(b[1]), 0);
    const totalAskVolume = asks.reduce((sum, a) => sum + parseFloat(a[1]), 0);
    
    const bidAskRatio = totalBidVolume / totalAskVolume;
    const imbalance = ((totalBidVolume - totalAskVolume) / (totalBidVolume + totalAskVolume)) * 100;
    
    let signal = 'neutral';
    if (bidAskRatio > 1.3) signal = 'bullish';
    else if (bidAskRatio < 0.7) signal = 'bearish';
    
    console.log(`✅ Order Book: Bid/Ask ratio = ${bidAskRatio.toFixed(2)}, Imbalance = ${imbalance.toFixed(2)}%`);
    
    return {
      bidAskRatio: Math.round(bidAskRatio * 100) / 100,
      imbalance: Math.round(imbalance * 100) / 100,
      signal,
      totalBidVolume,
      totalAskVolume,
      topBid: parseFloat(bids[0][0]),
      topAsk: parseFloat(asks[0][0])
    };
  } catch (e) {
    console.warn('Order Book API failed:', e);
    return { bidAskRatio: 1, imbalance: 0, signal: 'neutral' };
  }
}

// NEW: Fetch Funding Rate (Gate.io - works globally)
async function fetchFundingRate(symbol = 'BTCUSDT') {
  try {
    // Convert BTCUSDT to BTC_USDT for Gate.io
    const gateSymbol = symbol.replace('USDT', '_USDT');
    
    const response = await fetch(`https://api.gateio.ws/api/v4/futures/usdt/contracts/${gateSymbol}`);
    const data = await response.json();
    
    if (!data || !data.funding_rate) return { rate: 0, signal: 'neutral' };
    
    const rate = parseFloat(data.funding_rate) * 100;
    
    let signal = 'neutral';
    if (rate < -0.01) signal = 'bullish'; // Negative = shorts pay longs = bullish
    else if (rate > 0.01) signal = 'bearish'; // Positive = longs pay shorts = bearish
    
    console.log(`✅ Funding Rate: ${rate.toFixed(4)}%`);
    
    return {
      rate: Math.round(rate * 10000) / 10000,
      signal,
      timestamp: data.funding_next_apply
    };
  } catch (e) {
    console.warn('Funding Rate API failed:', e);
    return { rate: 0, signal: 'neutral' };
  }
}

// NEW: Multi-Timeframe Analysis
async function analyzeMultiTimeframe(cryptoId, currentTimeframe) {
  try {
    const tfMap = {
      '5m': ['15m', '1h', '4h'],
      '15m': ['1h', '4h', '1d'],
      '30m': ['4h', '1d', '1w'],
      '1h': ['4h', '1d', '1w'],
      '4h': ['1d', '1w', '1M'],
      '1d': ['1w', '1M'],
      '1w': ['1M'],
      '1M': []
    };
    
    const higherTimeframes = tfMap[currentTimeframe] || [];
    
    if (higherTimeframes.length === 0) {
      return { signal: 'neutral', alignment: 50 };
    }
    
    // Fetch data from higher timeframes
    const results = [];
    for (const tf of higherTimeframes.slice(0, 2)) {
      try {
        const response = await fetch(`https://data-api.binance.vision/api/v3/klines?symbol=${getSymbol(cryptoId)}&interval=${tf}&limit=50`);
        const data = await response.json();
        
        if (data && data.length > 20) {
          const closes = data.map(k => parseFloat(k[4]));
          const sma20 = closes.slice(-20).reduce((a, b) => a + b, 0) / 20;
          const currentPrice = closes[closes.length - 1];
          
          if (currentPrice > sma20 * 1.02) {
            results.push('bullish');
          } else if (currentPrice < sma20 * 0.98) {
            results.push('bearish');
          } else {
            results.push('neutral');
          }
        }
      } catch (e) {
        console.warn(`Failed to fetch ${tf} data`);
      }
    }
    
    const bullishCount = results.filter(r => r === 'bullish').length;
    const bearishCount = results.filter(r => r === 'bearish').length;
    
    let signal = 'neutral';
    let alignment = 50;
    
    if (bullishCount >= 2) {
      signal = 'bullish';
      alignment = 70 + (bullishCount * 10);
    } else if (bearishCount >= 2) {
      signal = 'bearish';
      alignment = 30 - (bearishCount * 10);
    }
    
    console.log(`✅ Multi-TF: ${signal}, Alignment: ${alignment}%`);
    
    return { signal, alignment, details: results };
  } catch (e) {
    console.warn('Multi-timeframe analysis failed:', e);
    return { signal: 'neutral', alignment: 50 };
  }
}

function getSymbol(cryptoId) {
  const map = {
    'bitcoin': 'BTCUSDT', 'ethereum': 'ETHUSDT', 'binancecoin': 'BNBUSDT',
    'ripple': 'XRPUSDT', 'cardano': 'ADAUSDT', 'solana': 'SOLUSDT',
    'dogecoin': 'DOGEUSDT', 'polkadot': 'DOTUSDT', 'avalanche-2': 'AVAXUSDT',
    'chainlink': 'LINKUSDT', 'tron': 'TRXUSDT', 'litecoin': 'LTCUSDT'
  };
  return map[cryptoId] || (cryptoId.toUpperCase() + 'USDT');
}

export { TechnicalAnalysis, fetchFearGreedIndex, fetchOrderBook, fetchFundingRate, analyzeMultiTimeframe };
