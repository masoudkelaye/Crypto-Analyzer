// Technical Analysis Engine
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

  // Calculate comprehensive signals
  analyzeAll(candles) {
    const closes = candles.map(c => c.close);
    const highs = candles.map(c => c.high);
    const lows = candles.map(c => c.low);
    const volumes = candles.map(c => c.volume);
    
    const rsi = this.calculateRSI(closes);
    const macd = this.calculateMACD(closes);
    const bb = this.calculateBollingerBands(closes);
    const volume = this.analyzeVolume(volumes);
    const sr = this.calculateSupportResistance(highs, lows, closes);
    const trend = this.analyzeTrend(closes);
    const emaCross = this.analyzeEMACrossover(closes);
    
    const currentPrice = closes[closes.length - 1];
    
    // Calculate composite score (-100 to +100)
    let bullishScore = 0;
    let bearishScore = 0;
    const bullishFactors = [];
    const bearishFactors = [];
    const neutralFactors = [];
    
    // RSI signals
    if (rsi.value < 30) { bullishScore += 20; bullishFactors.push({ name: 'RSI Oversold', weight: 20 }); }
    else if (rsi.value > 70) { bearishScore += 20; bearishFactors.push({ name: 'RSI Overbought', weight: 20 }); }
    else if (rsi.value < 45) { bullishScore += 10; bullishFactors.push({ name: 'RSI Low', weight: 10 }); }
    else if (rsi.value > 55) { bearishScore += 10; bearishFactors.push({ name: 'RSI High', weight: 10 }); }
    else { neutralFactors.push({ name: 'RSI Neutral', weight: 5 }); }
    
    // MACD signals
    if (macd.crossSignal === 'bullish_cross') { bullishScore += 25; bullishFactors.push({ name: 'MACD Bullish Cross', weight: 25 }); }
    else if (macd.crossSignal === 'bearish_cross') { bearishScore += 25; bearishFactors.push({ name: 'MACD Bearish Cross', weight: 25 }); }
    else if (macd.histogram > 0) { bullishScore += 10; bullishFactors.push({ name: 'MACD Positive', weight: 10 }); }
    else if (macd.histogram < 0) { bearishScore += 10; bearishFactors.push({ name: 'MACD Negative', weight: 10 }); }
    
    // Bollinger Bands
    if (bb.position === 'oversold') { bullishScore += 15; bullishFactors.push({ name: 'BB Lower Band', weight: 15 }); }
    else if (bb.position === 'overbought') { bearishScore += 15; bearishFactors.push({ name: 'BB Upper Band', weight: 15 }); }
    else if (bb.position === 'bullish') { bullishScore += 5; }
    else if (bb.position === 'bearish') { bearishScore += 5; }
    
    // Trend
    if (trend.direction === 'bullish') { bullishScore += 20; bullishFactors.push({ name: 'Bullish Trend', weight: 20 }); }
    else if (trend.direction === 'bearish') { bearishScore += 20; bearishFactors.push({ name: 'Bearish Trend', weight: 20 }); }
    
    // EMA Crossover
    if (emaCross.signal === 'golden_cross') { bullishScore += 20; bullishFactors.push({ name: 'Golden Cross', weight: 20 }); }
    else if (emaCross.signal === 'death_cross') { bearishScore += 20; bearishFactors.push({ name: 'Death Cross', weight: 20 }); }
    else if (emaCross.signal === 'bullish') { bullishScore += 10; }
    else if (emaCross.signal === 'bearish') { bearishScore += 10; }
    
    // Volume confirmation
    if (volume.signal === 'high_volume') {
      if (bullishScore > bearishScore) { bullishScore += 10; bullishFactors.push({ name: 'Volume Confirms', weight: 10 }); }
      else { bearishScore += 10; bearishFactors.push({ name: 'Volume Confirms', weight: 10 }); }
    }
    
    const totalScore = bullishScore - bearishScore;
    const maxScore = 100;
    
    // Calculate probability
    const rawProbability = Math.abs(totalScore) / maxScore;
    const probability = Math.round((0.5 + rawProbability * 0.4) * 100); // 50-90% range
    
    let signal = 'wait';
    if (totalScore > 25) signal = 'long';
    else if (totalScore < -25) signal = 'short';
    
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
      
      if (probability >= 75) leverage = '5x-10x';
      else if (probability >= 60) leverage = '3x-5x';
      else leverage = '2x-3x';
      
      positionSize = Math.min(Math.round(probability / 5), 20);
    } else if (signal === 'short') {
      entry = currentPrice;
      sl = currentPrice + (atr * 2);
      tp1 = currentPrice - (atr * 1.5);
      tp2 = currentPrice - (atr * 3);
      tp3 = currentPrice - (atr * 5);
      riskReward = (entry - tp2) / (sl - entry);
      
      if (probability >= 75) leverage = '5x-10x';
      else if (probability >= 60) leverage = '3x-5x';
      else leverage = '2x-3x';
      
      positionSize = Math.min(Math.round(probability / 5), 20);
    } else {
      entry = currentPrice;
      sl = tp1 = tp2 = tp3 = 0;
      leverage = 'N/A';
      riskReward = 0;
      positionSize = 0;
    }
    
    // Simulated top trader data (in production, fetch from exchanges)
    const topTraders = this.simulateTopTraders(signal, probability);
    
    return {
      signal,
      probability,
      totalScore,
      entry, tp1, tp2, tp3, sl, leverage, riskReward, positionSize,
      indicators: { rsi, macd, bb, volume, sr, trend, emaCross },
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

export { TechnicalAnalysis, fetchFearGreedIndex };
