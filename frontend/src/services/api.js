import axios from 'axios';

const BASE = 'https://stock-intel-6wrm.onrender.com/api';

// Fetch stock price, metrics, chart data
export async function fetchStock(ticker) {
  const { data } = await axios.get(`${BASE}/stock/${ticker}`);
  if (!data.success) throw new Error(data.error);
  return data.data;
}

// Fetch news with sentiment tags
export async function fetchNews(ticker) {
  const { data } = await axios.get(`${BASE}/news/${ticker}`);
  if (!data.success) throw new Error(data.error);
  return data.data;
}

// Generate AI analysis summary
export async function fetchAnalysis(ticker, stockData, newsData) {
  const { data } = await axios.post(`${BASE}/analysis/summary`, {
    ticker,
    stockData,
    newsData,
  });
  if (!data.success) throw new Error(data.error);
  return data.summary;
}

// Fetch geopolitical events with sector impact
export async function fetchGeo(ticker) {
  const { data } = await axios.get(`${BASE}/geo/${ticker}`);
  if (!data.success) throw new Error(data.error);
  return data.data;
}

// Fetch Fear & Greed score
export async function fetchFear(ticker) {
  const { data } = await axios.get(`${BASE}/fear/${ticker}`);
  if (!data.success) throw new Error(data.error);
  return data.data;
}
