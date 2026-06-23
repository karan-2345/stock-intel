// Color mapping for sentiment badges
const SENTIMENT_STYLES = {
  Positive: { bg: '#dcfce7', color: '#15803d' },
  Negative: { bg: '#fee2e2', color: '#b91c1c' },
  Neutral:  { bg: '#f1f5f9', color: '#64748b' },
};

export default function NewsCard({ articles }) {
  if (!articles.length) {
    return <p style={{ color: '#aaa', fontSize: '13px' }}>No news found.</p>;
  }

  return (
    <div>
      {articles.map((article, i) => {
        const style = SENTIMENT_STYLES[article.sentiment] || SENTIMENT_STYLES.Neutral;
        return (
          <div
            key={i}
            style={{
              padding: '10px 0',
              borderBottom: i < articles.length - 1 ? '1px solid #f0f0f0' : 'none',
            }}
          >
            <p style={{ fontSize: '13px', color: '#111', lineHeight: 1.5, margin: '0 0 6px' }}>
              {article.url ? (
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#111', textDecoration: 'none' }}
                  onMouseOver={(e) => (e.target.style.color = '#2563eb')}
                  onMouseOut={(e) => (e.target.style.color = '#111')}
                >
                  {article.headline}
                </a>
              ) : (
                article.headline
              )}
            </p>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{
                fontSize: '10px',
                fontWeight: 600,
                padding: '2px 8px',
                borderRadius: '999px',
                background: style.bg,
                color: style.color,
              }}>
                {article.sentiment}
              </span>
              <span style={{ fontSize: '11px', color: '#aaa' }}>
                {article.source} · {article.time}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
