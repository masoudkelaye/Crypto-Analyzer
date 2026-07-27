// Internal Candlestick Chart with Technical Indicators
class CandlestickChart {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.data = [];
    this.indicators = {};
    this.hoveredCandle = null;
    
    // Colors
    this.colors = {
      bg: '#0a0a1a',
      grid: '#1a1a35',
      text: '#9898b0',
      bullish: '#22c55e',
      bearish: '#ef4444',
      ema9: '#f59e0b',
      ema21: '#8b5cf6',
      bbUpper: 'rgba(59, 130, 246, 0.3)',
      bbLower: 'rgba(59, 130, 246, 0.3)',
      bbMiddle: 'rgba(59, 130, 246, 0.6)',
      volume: 'rgba(59, 130, 246, 0.2)',
      crosshair: 'rgba(255, 255, 255, 0.3)'
    };
    
    // Margins
    this.margin = { top: 20, right: 60, bottom: 30, left: 10 };
    this.volumeHeight = 80;
    
    if (this.canvas) {
      this.setupCanvas();
      this.setupEventListeners();
    }
  }
  
  setupCanvas() {
    const resize = () => {
      const container = this.canvas.parentElement;
      const width = container.clientWidth;
      const height = 500;
      
      this.canvas.width = width * window.devicePixelRatio;
      this.canvas.height = height * window.devicePixelRatio;
      this.canvas.style.width = width + 'px';
      this.canvas.style.height = height + 'px';
      
      this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      this.width = width;
      this.height = height;
      
      if (this.data.length > 0) this.render();
    };
    
    resize();
    window.addEventListener('resize', () => {
      this.ctx.setTransform(1, 0, 0, 1, 0, 0);
      resize();
    });
  }
  
  setupEventListeners() {
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      this.handleMouseMove(x, y);
    });
    
    this.canvas.addEventListener('mouseleave', () => {
      this.hoveredCandle = null;
      this.render();
    });
  }
  
  handleMouseMove(x, y) {
    if (!this.data || this.data.length === 0) return;
    
    const chartWidth = this.width - this.margin.left - this.margin.right;
    const candleWidth = chartWidth / this.data.length;
    const index = Math.floor((x - this.margin.left) / candleWidth);
    
    if (index >= 0 && index < this.data.length) {
      this.hoveredCandle = { index, x, y };
      this.render();
    }
  }
  
  setData(candles, indicators = {}) {
    this.data = candles || [];
    this.indicators = indicators;
    this.render();
  }
  
  render() {
    if (!this.ctx || !this.data || this.data.length === 0) return;
    
    const ctx = this.ctx;
    
    // Clear
    ctx.fillStyle = this.colors.bg;
    ctx.fillRect(0, 0, this.width, this.height);
    
    // Calculate dimensions
    const chartHeight = this.height - this.margin.top - this.margin.bottom - this.volumeHeight;
    const chartWidth = this.width - this.margin.left - this.margin.right;
    
    // Find price range
    const prices = this.data.map(c => [c.high, c.low]).flat();
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice;
    const pricePadding = priceRange * 0.05;
    
    const adjustedMin = minPrice - pricePadding;
    const adjustedMax = maxPrice + pricePadding;
    const adjustedRange = adjustedMax - adjustedMin;
    
    // Draw grid
    this.drawGrid(chartWidth, chartHeight, adjustedMin, adjustedMax, adjustedRange);
    
    // Draw Bollinger Bands (if available)
    if (this.indicators.bb) {
      this.drawBollingerBands(chartWidth, chartHeight, adjustedMin, adjustedRange);
    }
    
    // Draw candles
    const candleWidth = chartWidth / this.data.length;
    const bodyWidth = Math.max(candleWidth * 0.7, 2);
    
    this.data.forEach((candle, i) => {
      const x = this.margin.left + i * candleWidth + candleWidth / 2;
      const isBullish = candle.close >= candle.open;
      const color = isBullish ? this.colors.bullish : this.colors.bearish;
      
      // High-Low line
      const highY = this.margin.top + (adjustedMax - candle.high) / adjustedRange * chartHeight;
      const lowY = this.margin.top + (adjustedMax - candle.low) / adjustedRange * chartHeight;
      
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, highY);
      ctx.lineTo(x, lowY);
      ctx.stroke();
      
      // Body
      const openY = this.margin.top + (adjustedMax - candle.open) / adjustedRange * chartHeight;
      const closeY = this.margin.top + (adjustedMax - candle.close) / adjustedRange * chartHeight;
      const bodyTop = Math.min(openY, closeY);
      const bodyHeight = Math.max(Math.abs(closeY - openY), 1);
      
      ctx.fillStyle = color;
      ctx.fillRect(x - bodyWidth / 2, bodyTop, bodyWidth, bodyHeight);
    });
    
    // Draw EMAs
    if (this.indicators.ema9) {
      this.drawLine(this.indicators.ema9, this.colors.ema9, chartWidth, chartHeight, adjustedMin, adjustedRange);
    }
    if (this.indicators.ema21) {
      this.drawLine(this.indicators.ema21, this.colors.ema21, chartWidth, chartHeight, adjustedMin, adjustedRange);
    }
    
    // Draw volume
    this.drawVolume(chartWidth, chartHeight);
    
    // Draw hover info
    if (this.hoveredCandle) {
      this.drawCrosshair(chartWidth, chartHeight, adjustedMin, adjustedRange);
    }
    
    // Draw price scale
    this.drawPriceScale(chartHeight, adjustedMin, adjustedMax, adjustedRange);
  }
  
  drawGrid(chartWidth, chartHeight, minPrice, maxPrice, priceRange) {
    const ctx = this.ctx;
    ctx.strokeStyle = this.colors.grid;
    ctx.lineWidth = 1;
    
    // Horizontal grid lines
    const gridLines = 5;
    for (let i = 0; i <= gridLines; i++) {
      const y = this.margin.top + (chartHeight / gridLines) * i;
      ctx.beginPath();
      ctx.moveTo(this.margin.left, y);
      ctx.lineTo(this.width - this.margin.right, y);
      ctx.stroke();
    }
  }
  
  drawBollingerBands(chartWidth, chartHeight, minPrice, priceRange) {
    const ctx = this.ctx;
    const bb = this.indicators.bb;
    if (!bb || !bb.upper || bb.upper.length === 0) return;
    
    const candleWidth = chartWidth / this.data.length;
    const offset = this.data.length - bb.upper.length;
    
    // Fill area between bands
    ctx.fillStyle = 'rgba(59, 130, 246, 0.1)';
    ctx.beginPath();
    
    for (let i = 0; i < bb.upper.length; i++) {
      const x = this.margin.left + (i + offset) * candleWidth + candleWidth / 2;
      const y = this.margin.top + (bb.upper[bb.upper.length - 1 - i] - minPrice) / priceRange * chartHeight;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    
    for (let i = bb.lower.length - 1; i >= 0; i--) {
      const x = this.margin.left + (i + offset) * candleWidth + candleWidth / 2;
      const y = this.margin.top + (bb.lower[bb.lower.length - 1 - i] - minPrice) / priceRange * chartHeight;
      ctx.lineTo(x, y);
    }
    
    ctx.closePath();
    ctx.fill();
    
    // Draw middle line
    ctx.strokeStyle = this.colors.bbMiddle;
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    for (let i = 0; i < bb.middle.length; i++) {
      const x = this.margin.left + (i + offset) * candleWidth + candleWidth / 2;
      const y = this.margin.top + (bb.middle[bb.middle.length - 1 - i] - minPrice) / priceRange * chartHeight;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.setLineDash([]);
  }
  
  drawLine(data, color, chartWidth, chartHeight, minPrice, priceRange) {
    const ctx = this.ctx;
    if (!data || data.length === 0) return;
    
    const candleWidth = chartWidth / this.data.length;
    const offset = this.data.length - data.length;
    
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    
    for (let i = 0; i < data.length; i++) {
      const x = this.margin.left + (i + offset) * candleWidth + candleWidth / 2;
      const y = this.margin.top + (data[data.length - 1 - i] - minPrice) / priceRange * chartHeight;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    
    ctx.stroke();
  }
  
  drawVolume(chartWidth, chartHeight) {
    const ctx = this.ctx;
    const volumes = this.data.map(c => c.volume);
    const maxVolume = Math.max(...volumes);
    
    const volumeTop = this.height - this.margin.bottom - this.volumeHeight;
    const candleWidth = chartWidth / this.data.length;
    const barWidth = Math.max(candleWidth * 0.7, 2);
    
    this.data.forEach((candle, i) => {
      const x = this.margin.left + i * candleWidth + candleWidth / 2;
      const volumeHeight = (candle.volume / maxVolume) * this.volumeHeight;
      const y = volumeTop + this.volumeHeight - volumeHeight;
      
      ctx.fillStyle = this.colors.volume;
      ctx.fillRect(x - barWidth / 2, y, barWidth, volumeHeight);
    });
  }
  
  drawCrosshair(chartWidth, chartHeight, minPrice, priceRange) {
    const ctx = this.ctx;
    const { index, x, y } = this.hoveredCandle;
    const candle = this.data[index];
    
    if (!candle) return;
    
    // Vertical line
    ctx.strokeStyle = this.colors.crosshair;
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(x, this.margin.top);
    ctx.lineTo(x, this.height - this.margin.bottom);
    ctx.stroke();
    
    // Horizontal line
    ctx.beginPath();
    ctx.moveTo(this.margin.left, y);
    ctx.lineTo(this.width - this.margin.right, y);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Info box
    const isBullish = candle.close >= candle.open;
    const color = isBullish ? this.colors.bullish : this.colors.bearish;
    
    const boxX = Math.min(x + 10, this.width - 180);
    const boxY = Math.max(y - 80, 10);
    
    ctx.fillStyle = 'rgba(26, 26, 53, 0.95)';
    ctx.fillRect(boxX, boxY, 170, 90);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.strokeRect(boxX, boxY, 170, 90);
    
    ctx.fillStyle = '#e8e8f0';
    ctx.font = '11px monospace';
    ctx.textAlign = 'left';
    
    const date = new Date(candle.time).toLocaleDateString();
    ctx.fillText(date, boxX + 10, boxY + 18);
    
    ctx.fillStyle = color;
    ctx.fillText(`O: ${candle.open.toFixed(2)}`, boxX + 10, boxY + 35);
    ctx.fillText(`H: ${candle.high.toFixed(2)}`, boxX + 10, boxY + 50);
    ctx.fillText(`L: ${candle.low.toFixed(2)}`, boxX + 10, boxY + 65);
    ctx.fillText(`C: ${candle.close.toFixed(2)}`, boxX + 10, boxY + 80);
  }
  
  drawPriceScale(chartHeight, minPrice, maxPrice, priceRange) {
    const ctx = this.ctx;
    ctx.fillStyle = this.colors.text;
    ctx.font = '10px monospace';
    ctx.textAlign = 'left';
    
    const gridLines = 5;
    for (let i = 0; i <= gridLines; i++) {
      const price = maxPrice - (priceRange / gridLines) * i;
      const y = this.margin.top + (chartHeight / gridLines) * i;
      
      let label;
      if (price >= 1000) label = price.toFixed(0);
      else if (price >= 1) label = price.toFixed(2);
      else label = price.toFixed(4);
      
      ctx.fillText(label, this.width - this.margin.right + 5, y + 4);
    }
  }
}

export { CandlestickChart };
