const express = require('express');
const router = express.Router();
const axios = require('axios');

function calcRSI(prices, period = 14) {
  if (prices.length < period + 1) return 50;
  let gains = 0, losses = 0;
  for (let i = prices.length - period; i < prices.length; i++) {
    const diff = prices[i] - prices[i - 1];
    if (diff > 0) gains += diff;
    else losses += Math.abs(diff);
  }
  const avgGain = gains / period;
  const avgLoss = losses / period;
  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return parseFloat((100 - 100 / (1 + rs)).toFixed(1));
}

function getLabel(score) {
  if (score <= 20) return 'Extreme Fear';
  if (score <= 40) return 'Fear';
  if (score <= 60) return 'Neutral';
  if (score <= 80) return 'Greed';
  return 'Extreme Greed';
}

function getLabelColor(score) {
  if (score <= 20) return '#b91c1c';
  if (score <= 40) return '#d97706';
  if (score <= 60) return '#6b7280';
  if (score <= 80) return '#16a34a';
  return '#15803d';
}

router.get('/:ticker', async (req, res) => {
  const neutral = {
    score: 50, label: 'Neutral', color: '#6b7280',
    components: { rsi: 50, momentum: 0, range52: 50, volatility: 1 },
  };

  const { ticker } = req.params;

  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1d&range=3mo`;
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
      },
    });

    const result = response.data.chart.result[0];
    const closes = (result.indicators.quote[0].close || []).filter(Boolean);

    if (closes.length < 5) return res.json({ success: true, data: neutral });

    const rsi = calcRSI(closes);
    const ma30 = closes.slice(-30).reduce((a, b) => a + b, 0) / Math.min(30, closes.length);
    const currentPrice = closes[closes.length - 1];
    const momentumPct = ((currentPrice - ma30) / ma30) * 100;
    const momentumScore = Math.min(100, Math.max(0, 50 + momentumPct * 4));
    const high52w = Math.max(...closes);
    const low52w = Math.min(...closes);
    const range52Score = high52w === low52w ? 50 :
      ((currentPrice - low52w) / (high52w - low52w)) * 100;
    const recentCloses = closes.slice(-20);
    const mean = recentCloses.reduce((a, b) => a + b, 0) / recentCloses.length;
    const variance = recentCloses.reduce((sum, v) => sum + (v - mean) ** 2, 0) / recentCloses.length;
    const volPct = (Math.sqrt(variance) / mean) * 100;
    const volScore = Math.min(100, Math.max(0, 80 - volPct * 15));
    const score = Math.round(rsi * 0.30 + momentumScore * 0.30 +
      range52Score * 0.25 + volScore * 0.15);

    res.json({
      success: true,
      data: {
        score,
        label: getLabel(score),
        color: getLabelColor(score),
        components: {
          rsi: parseFloat(rsi.toFixed(1)),
          momentum: parseFloat(momentumPct.toFixed(2)),
          range52: parseFloat(range52Score.toFixed(1)),
          volatility: parseFloat(volPct.toFixed(2)),
        },
      },
    });
  } catch (err) {
    console.error('Fear/Greed error:', err.message);
    res.json({ success: true, data: neutral });
  }
});

module.exports = router;