const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/:ticker', async (req, res) => {
  const { ticker } = req.params;

  try {
    // Yahoo Finance v8 API - no key needed
    const quoteUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1d&range=1mo`;
    
    const response = await axios.get(quoteUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
      },
    });

    const result = response.data.chart.result[0];
    const meta = result.meta;
    const timestamps = result.timestamp || [];
    const closes = result.indicators.quote[0].close || [];

    const price = meta.regularMarketPrice;
    const prevClose = meta.previousClose || meta.chartPreviousClose;
    const change = price - prevClose;
    const changePercent = (change / prevClose) * 100;

    const chart = timestamps.map((t, i) => ({
      date: new Date(t * 1000).toISOString().split('T')[0],
      close: closes[i] ? parseFloat(closes[i].toFixed(2)) : null,
    })).filter(d => d.close !== null);

    const allCloses = closes.filter(Boolean);
    const high52w = Math.max(...allCloses);
    const low52w = Math.min(...allCloses);

    res.json({
      success: true,
      data: {
        ticker: meta.symbol,
        name: meta.longName || meta.shortName || ticker,
        price,
        change,
        changePercent,
        volume: meta.regularMarketVolume || 0,
        high52w: meta.fiftyTwoWeekHigh || high52w,
        low52w: meta.fiftyTwoWeekLow || low52w,
        peRatio: null,
        marketCap: null,
        currency: meta.currency || 'USD',
        isUp: change >= 0,
        chart,
      },
    });
  } catch (err) {
    console.error('Stock fetch error:', err.message);
    res.status(500).json({
      success: false,
      error: `Could not fetch data for "${ticker}". Try AAPL, TSLA, NVDA.`,
    });
  }
});

module.exports = router;