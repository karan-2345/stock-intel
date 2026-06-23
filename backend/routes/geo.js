const express = require('express');
const router = express.Router();
const axios = require('axios');

// Keywords that signal geopolitical events
const GEO_KEYWORDS = [
  'war', 'conflict', 'sanction', 'tariff', 'trade war', 'invasion',
  'missile', 'election', 'fed rate', 'interest rate', 'oil price',
  'crude', 'OPEC', 'inflation', 'recession', 'NATO', 'China', 'Russia',
  'Middle East', 'Iran', 'Ukraine', 'dollar', 'rupee', 'RBI', 'GDP',
  'export ban', 'import duty', 'geopolitical', 'diplomatic'
];

// Maps geopolitical themes to sector impacts
const IMPACT_MAP = {
  oil: {
    icon: '🛢️',
    bg: '#FEF3C7',
    color: '#92400E',
    impact: (ticker) =>
      ticker.includes('RELIANCE') || ticker.includes('ONGC')
        ? 'Direct impact — crude price affects feedstock and refining margins'
        : 'Indirect impact — energy costs affect operating expenses',
  },
  rate: {
    icon: '🏦',
    bg: '#EFF6FF',
    color: '#1E40AF',
    impact: () => 'Rate changes affect FII flows, valuations and borrowing costs',
  },
  trade: {
    icon: '📦',
    bg: '#F0FDF4',
    color: '#166534',
    impact: (ticker) =>
      ['TCS', 'INFY', 'WIPRO'].some((t) => ticker.includes(t))
        ? 'IT exports — USD/INR movement directly affects revenue in INR terms'
        : 'Supply chain and export revenue may be affected',
  },
  currency: {
    icon: '💱',
    bg: '#F5F3FF',
    color: '#5B21B6',
    impact: () => 'Currency moves affect imported costs and overseas earnings',
  },
  conflict: {
    icon: '⚠️',
    bg: '#FEF2F2',
    color: '#991B1B',
    impact: () => 'Market risk-off sentiment — FII outflows likely in near term',
  },
};

function categoriseEvent(headline) {
  const lower = headline.toLowerCase();
  if (lower.match(/oil|crude|opec|petroleum/)) return 'oil';
  if (lower.match(/rate|fed|rbi|interest|inflation/)) return 'rate';
  if (lower.match(/tariff|trade|export|import|sanction/)) return 'trade';
  if (lower.match(/dollar|rupee|currency|forex|yuan/)) return 'currency';
  if (lower.match(/war|conflict|missile|invasion|nato|military/)) return 'conflict';
  return null;
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

// GET /api/geo/:ticker
router.get('/:ticker', async (req, res) => {
  const { ticker } = req.params;
  const API_KEY = process.env.NEWS_API_KEY;

  if (!API_KEY) {
    return res.status(500).json({ success: false, error: 'NEWS_API_KEY not set' });
  }

  try {
    // Search for geopolitical news broadly
    const query = GEO_KEYWORDS.slice(0, 6).join(' OR ');
    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: query,
        language: 'en',
        sortBy: 'publishedAt',
        pageSize: 20,
        apiKey: API_KEY,
      },
    });

    const articles = response.data.articles || [];

    // Filter to only geopolitical-relevant ones and categorise
    const events = articles
      .filter((a) => {
        const lower = (a.title + ' ' + (a.description || '')).toLowerCase();
        return GEO_KEYWORDS.some((kw) => lower.includes(kw.toLowerCase()));
      })
      .slice(0, 5)
      .map((a) => {
        const category = categoriseEvent(a.title) || 'conflict';
        const mapEntry = IMPACT_MAP[category];
        return {
          headline: a.title,
          source: a.source?.name || 'Unknown',
          time: timeAgo(a.publishedAt),
          url: a.url,
          icon: mapEntry.icon,
          bg: mapEntry.bg,
          color: mapEntry.color,
          impact: mapEntry.impact(ticker.toUpperCase()),
          category,
        };
      });

    res.json({ success: true, data: events });
  } catch (err) {
    console.error('Geo fetch error:', err.message);
    res.status(500).json({ success: false, error: 'Failed to fetch geopolitical data' });
  }
});

module.exports = router;
