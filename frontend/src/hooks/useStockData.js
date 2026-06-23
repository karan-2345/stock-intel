import { useState, useCallback } from 'react';
import { fetchStock, fetchNews, fetchAnalysis, fetchGeo, fetchFear } from '../services/api';

// This hook handles ALL data fetching for a ticker symbol.
// Components stay clean - they just call loadTicker() and read the state.
export function useStockData() {
  const [stockData, setStockData] = useState(null);
  const [newsData, setNewsData] = useState([]);
  const [geoData, setGeoData] = useState([]);
  const [fearData, setFearData] = useState(null);
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTicker, setActiveTicker] = useState('');

  const loadTicker = useCallback(async (ticker) => {
    if (!ticker.trim()) return;
    const upperTicker = ticker.trim().toUpperCase();

    setLoading(true);
    setError(null);
    setActiveTicker(upperTicker);
    setSummary('');
    setGeoData([]);
    setFearData(null);

    try {
      // Fetch all data sources in parallel for speed
      const [stock, news, geo, fear] = await Promise.all([
        fetchStock(upperTicker),
        fetchNews(upperTicker),
        fetchGeo(upperTicker),
        fetchFear(upperTicker),
      ]);

      setStockData(stock);
      setNewsData(news);
      setGeoData(geo);
      setFearData(fear);

      // AI analysis last — depends on stock + news
      const aiSummary = await fetchAnalysis(upperTicker, stock, news);
      setSummary(aiSummary);
    } catch (err) {
      setError(err.message || 'Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    stockData,
    newsData,
    geoData,
    fearData,
    summary,
    loading,
    error,
    activeTicker,
    loadTicker,
  };
}
