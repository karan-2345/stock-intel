import { useState } from 'react';
import { useStockData } from './hooks/useStockData';
import MetricCard from './components/MetricCard';
import PriceChart from './components/PriceChart';
import NewsCard from './components/NewsCard';
import SentimentBar from './components/SentimentBar';
import FearGauge from './components/FearGauge';
import GeopoliticalPanel from './components/GeopoliticalPanel';

// Quick-access tickers for Indian + US markets
const QUICK_TICKERS = ['RELIANCE.BO', 'TCS.BO', 'INFY.BO', 'AAPL', 'NVDA', 'TSLA'];
// Helper: format large numbers (marketcap etc.)
function formatNumber(n) {
  if (!n) return 'N/A';
  if (n >= 1e12) return `${(n / 1e12).toFixed(2)}T`;
  if (n >= 1e9) return `${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(2)}M`;
  return n.toLocaleString();
}

// Panel wrapper for consistent card styling
function Panel({ title, children }) {
  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e5e7eb',
      borderRadius: '14px',
      padding: '20px',
    }}>
      <p style={{
        fontSize: '11px',
        fontWeight: 600,
        color: '#aaa',
        textTransform: 'uppercase',
        letterSpacing: '0.07em',
        marginBottom: '14px',
      }}>
        {title}
      </p>
      {children}
    </div>
  );
}

export default function App() {
  const [input, setInput] = useState('');
  const { stockData, newsData, geoData, fearData, summary, loading, error, activeTicker, loadTicker } = useStockData();

  const handleSearch = () => {
    if (input.trim()) loadTicker(input);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  // Derive sentiment mock values from news until we add a real sentiment API
  // Count positive vs negative news articles
  const posCount = newsData.filter((n) => n.sentiment === 'Positive').length;
  const negCount = newsData.filter((n) => n.sentiment === 'Negative').length;
  const totalNews = newsData.length || 1;
  const retailSentiment = Math.round((posCount / totalNews) * 100);
  const shortInterest = Math.round((negCount / totalNews) * 60);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f9fafb',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      padding: '0',
    }}>

      {/* Header */}
      <div style={{
        background: '#fff',
        borderBottom: '1px solid #e5e7eb',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
          <span style={{ fontSize: '18px', fontWeight: 700, color: '#111' }}>
            Stock Intel
          </span>
          <span style={{
            fontSize: '10px',
            fontWeight: 600,
            padding: '2px 7px',
            borderRadius: '999px',
            background: '#eff6ff',
            color: '#1d4ed8',
          }}>
            AI-Powered
          </span>
        </div>

        {/* Search */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ticker (e.g. RELIANCE.NS, AAPL)"
            style={{
              width: '260px',
              padding: '9px 14px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none',
              background: '#f9fafb',
            }}
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            style={{
              padding: '9px 20px',
              background: loading ? '#93c5fd' : '#2563eb',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 500,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Loading...' : 'Analyse'}
          </button>
        </div>
      </div>

      {/* Quick tickers */}
      <div style={{ padding: '12px 24px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {QUICK_TICKERS.map((t) => (
          <button
            key={t}
            onClick={() => { setInput(t); loadTicker(t); }}
            style={{
              padding: '5px 14px',
              border: `1px solid ${activeTicker === t ? '#2563eb' : '#d1d5db'}`,
              borderRadius: '999px',
              fontSize: '12px',
              fontWeight: 500,
              background: activeTicker === t ? '#eff6ff' : '#fff',
              color: activeTicker === t ? '#1d4ed8' : '#555',
              cursor: 'pointer',
            }}
          >
            {t}
          </button>
        ))}
        <span style={{ fontSize: '12px', color: '#aaa', alignSelf: 'center' }}>
          US Markets · Indian stocks coming soon
        </span>
      </div>

      {/* Main content */}
      <div style={{ padding: '0 24px 24px' }}>

        {/* Error state */}
        {error && (
          <div style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '10px',
            padding: '14px 18px',
            color: '#b91c1c',
            fontSize: '14px',
            marginBottom: '16px',
          }}>
            {error}
          </div>
        )}

        {/* Empty state */}
        {!stockData && !loading && !error && (
          <div style={{
            textAlign: 'center',
            padding: '80px 0',
            color: '#aaa',
          }}>
            <p style={{ fontSize: '32px', marginBottom: '12px' }}>📈</p>
            <p style={{ fontSize: '18px', fontWeight: 600, color: '#555', marginBottom: '8px' }}>
              Search any stock to begin
            </p>
            <p style={{ fontSize: '14px' }}>
              Try RELIANCE.NS, TCS.NS for Indian stocks or AAPL, NVDA for US stocks
            </p>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px', marginBottom: '16px' }}>
            {[...Array(5)].map((_, i) => (
              <div key={i} style={{
                height: '72px',
                background: '#e5e7eb',
                borderRadius: '10px',
                animation: 'pulse 1.5s ease infinite',
              }} />
            ))}
          </div>
        )}

        {/* Dashboard — shown when we have data */}
        {stockData && !loading && (
          <>
            {/* Stock name + live badge */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', margin: '4px 0 16px' }}>
              <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#111', margin: 0 }}>
                {stockData.name}
              </h1>
              <span style={{ fontSize: '13px', color: '#888' }}>{stockData.ticker}</span>
              <span style={{
                fontSize: '10px',
                padding: '2px 7px',
                borderRadius: '999px',
                background: '#f0fdf4',
                color: '#15803d',
                fontWeight: 600,
              }}>
                Live
              </span>
            </div>

            {/* Metrics row */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: '10px',
              marginBottom: '16px',
            }}>
              <MetricCard
                label="Price"
                value={`${stockData.currency === 'INR' ? '₹' : '$'}${stockData.price?.toFixed(2)}`}
              />
              <MetricCard
                label="Change"
                value={`${stockData.changePercent >= 0 ? '+' : ''}${stockData.changePercent?.toFixed(2)}%`}
                color={stockData.isUp ? '#16a34a' : '#dc2626'}
              />
              <MetricCard label="Volume" value={formatNumber(stockData.volume)} />
              <MetricCard
                label="52W High"
                value={`${stockData.currency === 'INR' ? '₹' : '$'}${stockData.high52w?.toFixed(2)}`}
              />
              <MetricCard label="P/E Ratio" value={stockData.peRatio?.toFixed(1) || 'N/A'} />
            </div>

            {/* Two-column panels */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              marginBottom: '12px',
            }}>
              <Panel title="Price chart — 30 days">
                <PriceChart data={stockData.chart} isUp={stockData.isUp} />
              </Panel>

              <Panel title="Fear & Greed index">
                <FearGauge data={fearData} />
                {!fearData && (
                  <>
                    <SentimentBar label="News positivity" value={retailSentiment} color="#16a34a" />
                    <SentimentBar label="Bullish signals" value={Math.max(30, 100 - shortInterest - 10)} color="#2563eb" />
                    <SentimentBar label="Bearish signals" value={Math.max(10, shortInterest)} color="#dc2626" />
                  </>
                )}
              </Panel>
            </div>

            {/* News + AI analysis */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              marginBottom: '12px',
            }}>
              <Panel title="Recent news">
                <NewsCard articles={newsData} />
              </Panel>

              <Panel title="AI analysis">
                {summary ? (
                  <>
                    <div style={{
                      background: '#f0f9ff',
                      borderRadius: '8px',
                      padding: '14px',
                      fontSize: '14px',
                      color: '#1e3a5f',
                      lineHeight: 1.7,
                      marginBottom: '14px',
                    }}>
                      {summary}
                    </div>
                    <p style={{ fontSize: '11px', color: '#aaa', margin: 0 }}>
                      Generated by Claude AI · Not financial advice
                    </p>
                  </>
                ) : (
                  <div style={{
                    padding: '20px',
                    textAlign: 'center',
                    color: '#aaa',
                    fontSize: '13px',
                  }}>
                    Generating analysis...
                  </div>
                )}
              </Panel>
            </div>

            {/* Geopolitical Impact - full width */}
            <Panel title="🌍 Geopolitical impact on this ticker">
              <GeopoliticalPanel events={geoData} />
            </Panel>
          </>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { margin: 0; }
      `}</style>
    </div>
  );
}
