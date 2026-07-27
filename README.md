# 📊 Crypto Analyzer Pro

<div align="center">

**Advanced Cryptocurrency Trading Analysis & Smart Signal System**

[Features](#features) • [Getting Started](#getting-started) • [Usage](#usage) • [Technical Analysis](#technical-analysis) • [PWA & Notifications](#pwa--notifications) • [Architecture](#architecture) • [Disclaimer](#disclaimer)

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![PWA](https://img.shields.io/badge/PWA-ready-purple)

</div>

---

## 📖 Description / توضیحات

### English

**Crypto Analyzer Pro** is a comprehensive Progressive Web Application (PWA) that provides real-time cryptocurrency trading analysis, technical indicators, and smart trading signals. The application analyzes market data using multiple technical analysis methods and generates actionable buy/sell recommendations with specific entry prices, stop losses, take profit targets, and leverage suggestions.

Key highlights:
- 🔄 Real-time analysis of 15+ cryptocurrencies
- 📊 Interactive TradingView charts with technical indicators
- 🤖 Multi-factor analysis engine (RSI, MACD, Bollinger Bands, EMA Crossovers, etc.)
- 📈 Probability-based signal system with confidence scoring
- 🔔 Smart push notifications with configurable probability thresholds
- 🌍 Full bilingual support (English / Persian-Farsi)
- 📱 Installable PWA - works offline
- 👥 Top trader position analysis simulation

### فارسی

**کریپتو آنالایزر پرو** یک اپلیکیشن وب پیشرفته (PWA) است که تحلیل لحظه‌ای بازار ارزهای دیجیتال، اندیکاتورهای تکنیکال و سیگنال‌های هوشمند معاملاتی را ارائه می‌دهد. این اپلیکیشن داده‌های بازار را با استفاده از روش‌های متعدد تحلیل تکنیکال بررسی کرده و توصیه‌های قابل اجرایی برای خرید/فروش با قیمت ورود، حد ضرر، اهداف سود و پیشنهاد لوریج ارائه می‌دهد.

نکات کلیدی:
- 🔄 تحلیل لحظه‌ای بیش از ۱۵ ارز دیجیتال
- 📊 نمودارهای تعاملی TradingView با اندیکاتورهای تکنیکال
- 🤖 موتور تحلیل چندعاملی (RSI، MACD، باندهای بولینگر، تقاطع EMA و...)
- 📈 سیستم سیگنال مبتنی بر احتمال با امتیازدهی اطمینان
- 🔔 نوتیفیکیشن‌های هوشمند با آستانه احتمال قابل تنظیم
- 🌍 پشتیبانی کامل دوزبانه (انگلیسی / فارسی)
- 📱 PWA قابل نصب - آفلاین کار می‌کند
- 👥 شبیه‌سازی تحلیل پوزیشن تریدرهای برتر

---

## ✨ Features

### 📈 Trading Analysis
- **Multi-timeframe analysis**: 5min, 15min, 30min, 1hr, 4hr, Daily, Weekly, Monthly
- **15+ Cryptocurrencies**: BTC, ETH, BNB, XRP, ADA, SOL, DOGE, DOT, AVAX, LINK, TRX, LTC, MATIC, UNI, XLM
- **Real-time charts**: Powered by TradingView with built-in indicators
- **Comprehensive signals**: LONG, SHORT, or WAIT with specific parameters

### 🤖 Technical Indicators
| Indicator | Description | Weight |
|-----------|-------------|--------|
| RSI (14) | Relative Strength Index | 10-20 |
| MACD | Moving Average Convergence Divergence | 10-25 |
| Bollinger Bands | Price volatility bands | 5-15 |
| EMA Crossover | 9/21 EMA Golden/Death Cross | 10-20 |
| Volume Analysis | Volume vs average comparison | 10 |
| Trend Analysis | EMA 20/50 trend direction | 20 |
| Support/Resistance | Key price levels | Reference |

### 🔔 Smart Notifications
- Push notifications for trading signals
- Configurable probability threshold (50%-95%)
- Multiple frequency options (every refresh, signal change, hourly)
- Probability visualization for each notification
- Notification history with success tracking

### 📱 PWA Features
- Installable on desktop and mobile
- Offline support with cached assets
- Background service worker
- App shortcuts for quick access
- Native-like experience

---

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection for live data
- HTTPS or localhost (required for PWA features & notifications)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/crypto-analyzer.git

# Navigate to project directory
cd crypto-analyzer

# Serve with any HTTP server
# Option 1: Python
python3 -m http.server 8080

# Option 2: Node.js (npx)
npx serve .

# Option 3: PHP
php -S localhost:8080
```

Then open `http://localhost:8080` in your browser.

### Deploy to Production
```bash
# Deploy to Netlify
netlify deploy --prod

# Deploy to Vercel
vercel --prod

# Deploy to GitHub Pages
# Push to gh-pages branch
```

---

## 📋 Usage

### Basic Analysis
1. Select your cryptocurrency from the dropdown
2. Choose a timeframe (5min to Monthly)
3. Click "🔍 Analyze Now" or enable auto-refresh
4. View the signal card for entry/exit recommendations

### Understanding Signals

#### 🟢 LONG Signal (Buy)
- Entry price: Recommended buy price
- Take Profit 1-3: Profit targets (conservative to aggressive)
- Stop Loss: Risk management level
- Leverage: Suggested leverage based on confidence
- Position Size: Recommended % of portfolio

#### 🔴 SHORT Signal (Sell)
- Same parameters as LONG but for selling/shorting
- Stop loss is above entry price
- Take profits are below entry price

#### 🟡 WAIT Signal
- No clear market direction
- Multiple conflicting indicators
- Best to stay out of the market

### Probability Threshold
- **50-59%**: Low confidence - high risk
- **60-69%**: Moderate confidence - standard risk
- **70-79%**: High confidence - favorable risk/reward
- **80-90%**: Very high confidence - strong signal

### Notification Setup
1. Go to Notification Settings panel
2. Enable notifications (browser permission required)
3. Set minimum probability threshold using the slider
4. Choose notification frequency
5. Notifications will appear when conditions are met

---

## 🔬 Technical Analysis

### Analysis Engine Architecture

```
┌─────────────────────────────────────────────┐
│              Data Collection                 │
│  CoinGecko API → OHLC/Candle Data           │
│  Alternative.me → Fear & Greed Index        │
│  TradingView → Interactive Charts           │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│           Technical Indicators               │
│  ┌─────────┐ ┌──────┐ ┌───────────────┐    │
│  │   RSI   │ │ MACD │ │ Bollinger     │    │
│  │  (14)   │ │      │ │ Bands         │    │
│  └────┬────┘ └──┬───┘ └──────┬────────┘    │
│       │         │            │              │
│  ┌────┴────┐ ┌──┴───┐ ┌─────┴─────────┐   │
│  │EMA Cross│ │Volume│ │ Trend         │   │
│  │  9/21   │ │Anal. │ │ Analysis      │   │
│  └────┬────┘ └──┬───┘ └─────┬─────────┘   │
└───────┼─────────┼────────────┼──────────────┘
        │         │            │
┌───────▼─────────▼────────────▼──────────────┐
│         Signal Composition Engine            │
│  • Weighted scoring system                   │
│  • Bullish/Bearish factor aggregation        │
│  • Probability calculation                   │
│  • Entry/Exit point computation              │
│  • ATR-based risk management                 │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│            Output / Actions                  │
│  • Signal Card (LONG/SHORT/WAIT)            │
│  • Probability Chart & Factors              │
│  • Push Notifications                       │
│  • Notification History                     │
└─────────────────────────────────────────────┘
```

### Scoring System

Each indicator contributes a weighted score:

| Signal | Bullish Weight | Bearish Weight |
|--------|---------------|----------------|
| RSI < 30 (Oversold) | +20 | - |
| RSI > 70 (Overbought) | - | +20 |
| MACD Bullish Cross | +25 | - |
| MACD Bearish Cross | - | +25 |
| BB Lower Band | +15 | - |
| BB Upper Band | - | +15 |
| Bullish Trend | +20 | - |
| Bearish Trend | - | +20 |
| Golden Cross (EMA) | +20 | - |
| Death Cross (EMA) | - | +20 |
| Volume Confirmation | +10 | +10 |

**Decision Rules:**
- Score > +25 → LONG signal
- Score < -25 → SHORT signal
- Otherwise → WAIT

**Probability Formula:**
```
rawProbability = |totalScore| / maxScore
probability = 50% + (rawProbability × 40%)
```

This gives a probability range of 50% to 90%.

---

## 🏗️ Architecture

### Project Structure

```
crypto-analyzer/
├── index.html          # Main application HTML
├── manifest.json       # PWA manifest
├── sw.js              # Service Worker
├── css/
│   └── style.css      # Main stylesheet
├── js/
│   ├── app.js         # Main application logic
│   ├── analysis.js    # Technical analysis engine
│   └── i18n.js        # Internationalization
├── img/
│   ├── icon-192.png   # PWA icon (192x192)
│   └── icon-512.png   # PWA icon (512x512)
└── README.md          # This file
```

### Data Flow

1. **User selects** crypto & timeframe
2. **App fetches** OHLC data from CoinGecko API
3. **Analysis engine** computes all technical indicators
4. **Signal composer** aggregates scores and calculates probability
5. **UI renders** signal card, charts, indicators, and probability chart
6. **Notification system** checks thresholds and sends alerts if conditions met

### Data Sources

| Source | Data | Rate Limit |
|--------|------|------------|
| [CoinGecko](https://www.coingecko.com/api) | OHLC, Market Data | 10-30 calls/min (free) |
| [Alternative.me](https://alternative.me/crypto/fear-and-greed-index/) | Fear & Greed Index | Unlimited |
| [TradingView](https://www.tradingview.com/) | Interactive Charts | Widget embed (free) |

---

## 🔔 PWA & Notifications

### Push Notification System

The app implements a smart notification system:

```
┌──────────────────────────────────┐
│     Notification Decision Tree    │
│                                  │
│  Is notification enabled?        │
│    ├─ No → Skip                  │
│    └─ Yes ↓                      │
│                                  │
│  Is probability >= threshold?    │
│    ├─ No → Skip                  │
│    └─ Yes ↓                      │
│                                  │
│  Is frequency condition met?     │
│    ├─ No → Skip                  │
│    └─ Yes ↓                      │
│                                  │
│  Send Notification! 🔔           │
│  ┌──────────────────────┐        │
│  │ 🟢 LONG BTC $65,432  │        │
│  │ Probability: 78%     │        │
│  │ Leverage: 5x-10x     │        │
│  │ SL: $63,200          │        │
│  └──────────────────────┘        │
└──────────────────────────────────┘
```

### Notification Content
- Signal type (LONG/SHORT)
- Cryptocurrency symbol and current price
- Probability percentage
- Recommended leverage
- Stop loss price

### Probability Visualization
Each notification includes:
- Circular probability gauge
- Horizontal breakdown bar (bullish/neutral/bearish factors)
- Individual factor list with weights

---

## 🌍 Internationalization (i18n)

The app supports two languages:

| Feature | English | Persian (Farsi) |
|---------|---------|-----------------|
| UI Labels | ✅ | ✅ |
| Number Format | 1,234.56 | ۱٬۲۳۴٫۵۶ |
| Direction | LTR | RTL |
| Font | Segoe UI | Vazirmatn |
| Date Format | MM/DD/YYYY | YYYY/MM/DD |

Language preference is stored in `localStorage` and persists across sessions.

---

## ⚙️ Configuration

### LocalStorage Keys

| Key | Description | Default |
|-----|-------------|---------|
| `cryptoLang` | Language preference | `fa` |
| `cryptoCoin` | Selected cryptocurrency | `bitcoin` |
| `cryptoTimeframe` | Selected timeframe | `1d` |
| `cryptoNotifs` | Notification history | `[]` |
| `cryptoNotifSettings` | Notification config | `{enabled: false, minProbability: 65}` |

### Customization

To add more cryptocurrencies, edit the `cryptoOptions` array in `js/app.js`:

```javascript
const cryptoOptions = [
  { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin' },
  // Add more here...
];
```

---

## 🔒 Security & Privacy

- **No user accounts** - all data stays in your browser
- **No tracking** - no analytics or telemetry
- **No data sent** to any server except public APIs (CoinGecko, Alternative.me)
- **Local storage only** - notification history stored locally
- **HTTPS recommended** for production deployment

---

## ⚠️ Disclaimer

**This tool is for educational and informational purposes only.** 

- This is NOT financial advice
- Past performance does not guarantee future results
- Cryptocurrency trading involves substantial risk of loss
- Always do your own research (DYOR)
- Never invest more than you can afford to lose
- The probability scores are based on historical patterns and technical analysis, not guarantees
- Top trader data shown is simulated for demonstration purposes

The developers are not responsible for any financial losses incurred from using this tool.

---

## 📄 License

MIT License - feel free to use, modify, and distribute.

---

## 🙏 Credits

- **TradingView** - Charts and technical analysis widgets
- **CoinGecko** - Cryptocurrency market data API
- **Alternative.me** - Fear & Greed Index API
- **Vazirmatn Font** - Persian typography

---

<div align="center">

**Built with ❤️ for the crypto community**

*Happy Trading! 📈📉*

</div>
