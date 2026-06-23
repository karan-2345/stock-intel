const express = require('express');
const router = express.Router();
const axios = require('axios');

// POST /api/analysis/summary
// Body: { ticker, stockData, newsData }
// Returns: AI-generated analysis summary
router.post('/summary', async (req, res) => {
  const { ticker, stockData, newsData } = req.body;
  const API_KEY = process.env.ANTHROPIC_API_KEY;

  if (!API_KEY) {
    return res.status(500).json({
      success: false,
      error: 'ANTHROPIC_API_KEY not set in .env file',
    });
  }

  // Build a structured prompt with all available data
  const newsHeadlines = newsData
    .map((n) => `- [${n.sentiment}] ${n.headline}`)
    .join('\n');

  const prompt = `You are a friendly but professional stock analyst. Analyse the following data for ${ticker} and write a clear, conversational investment summary in 4-5 sentences.

STOCK DATA:
- Current Price: ${stockData.price} ${stockData.currency}
- Change: ${stockData.changePercent?.toFixed(2)}%
- P/E Ratio: ${stockData.peRatio || 'N/A'}
- 52-Week High: ${stockData.high52w}
- 52-Week Low: ${stockData.low52w}
- Volume: ${stockData.volume?.toLocaleString()}

RECENT NEWS SENTIMENT:
${newsHeadlines}

Write a natural, clean summary covering:
1. Current momentum and price action
2. What the news suggests about near term direction
3. Key risk to watch
4. One actionable takeaway

Rules:
- NO markdown formatting at all
- NO asterisks, hashes, dashes or special characters
- NO bold or italic text
- Write in plain conversational English like a human analyst talking to a friend
- Be direct and specific to this ticker`;

  try {
    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: 'claude-sonnet-4-6',
        max_tokens: 300,
        messages: [{ role: 'user', content: prompt }],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY,
          'anthropic-version': '2023-06-01',
        },
      }
    );

    const summary = response.data.content[0]?.text || 'Analysis unavailable.';
    res.json({ success: true, summary });
  } catch (err) {
    console.error('Analysis error:', err.response?.data || err.message);
    res.status(500).json({
      success: false,
      error: 'Failed to generate AI analysis.',
    });
  }
});

module.exports = router;
