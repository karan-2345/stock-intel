const express = require('express');
const router = express.Router();
const axios = require('axios');

function tagSentiment(headline) {
  const lower = headline.toLowerCase();
  const positiveWords = ['beat','surge','rally','gain','profit','growth','strong',
    'record','upgrade','wins','deal','rises','jumps','outperforms','dividend','soars'];
  const negativeWords = ['fall','drop','decline','loss','miss','cut','warning','risk',
    'sanction','tariff','concern','weak','slump','fine','penalty','downgrade','crash'];
  const posScore = positiveWords.filter((w) => lower.includes(w)).length;
  const negScore = negativeWords.filter((w) => lower.includes(w)).length;
  if (posScore > negScore) return 'Positive';
  if (negScore > posScore) return 'Negative';
  return 'Neutral';
}

function timeAgo(dateStr) {
  const now = new Date();
  const then = new Date(dateStr);
  const diffH = Math.floor((now - then) / (1000 * 60 * 60));
  const diffD = Math.floor(diffH / 24);
  if (diffH < 1) return 'Just now';
  if (diffH < 24) return `${diffH}h ago`;
  if (diffD === 1) return '1d ago';
  return `${diffD}d ago`;
}

function isEnglish(text) {
  if (!text) return false;
  const nonLatin = text.match(/[^\u0000-\u024F\u1E00-\u1EFF]/g) || [];
  return nonLatin.length / text.length < 0.2;
}

router.get('/:ticker', async (req, res) => {
  const { ticker } = req.params;
  const API_KEY = process.env.NEWS_API_KEY;

  if (!API_KEY) {
    return res.status(500).json({ success: false, error: 'NEWS_API_KEY not set' });
  }

  const searchTicker = ticker.replace(/\.(NS|BSE|NYS)$/i, '');

  try {
    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: searchTicker,
        language: 'en',
        sortBy: 'publishedAt',
        pageSize: 20,
        apiKey: API_KEY,
      },
    });

    const articles = response.data.articles || [];

    const news = articles
      .filter((a) => a.title && isEnglish(a.title) && a.title !== '[Removed]')
      .slice(0, 6)
      .map((a) => ({
        headline: a.title,
        source: a.source?.name || 'Unknown',
        url: a.url,
        sentiment: tagSentiment(a.title),
        time: timeAgo(a.publishedAt),
      }));

    res.json({ success: true, data: news });
  } catch (err) {
    console.error('News fetch error:', err.message);
    res.status(500).json({ success: false, error: 'Failed to fetch news.' });
  }
});

module.exports = router;