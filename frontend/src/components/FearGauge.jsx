// Fear & Greed gauge with color gradient bar and needle marker
export default function FearGauge({ data }) {
  if (!data) return null;

  const { score, label, color, components } = data;

  const segments = [
    { color: '#ef4444', label: 'Extreme Fear' },
    { color: '#f97316', label: 'Fear' },
    { color: '#eab308', label: 'Neutral' },
    { color: '#84cc16', label: 'Greed' },
    { color: '#16a34a', label: 'Extreme Greed' },
  ];

  return (
    <div>
      {/* Big score number */}
      <div style={{ textAlign: 'center', marginBottom: '12px' }}>
        <div style={{ fontSize: '48px', fontWeight: 700, color, lineHeight: 1 }}>
          {score}
        </div>
        <div style={{ fontSize: '14px', fontWeight: 600, color, marginTop: '4px' }}>
          {label}
        </div>
      </div>

      {/* Gradient bar */}
      <div style={{ position: 'relative', marginBottom: '6px' }}>
        <div style={{
          display: 'flex',
          height: '10px',
          borderRadius: '5px',
          overflow: 'hidden',
        }}>
          {segments.map((s, i) => (
            <div key={i} style={{ flex: 1, background: s.color }} />
          ))}
        </div>

        {/* Needle */}
        <div style={{
          position: 'absolute',
          top: '-3px',
          left: `calc(${score}% - 2px)`,
          width: '4px',
          height: '16px',
          background: '#111',
          borderRadius: '2px',
          transition: 'left 0.8s ease',
        }} />
      </div>

      {/* Bar labels */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '9px',
        color: '#aaa',
        marginBottom: '16px',
      }}>
        <span>Extreme Fear</span>
        <span>Neutral</span>
        <span>Extreme Greed</span>
      </div>

      {/* Component breakdown */}
      {components && (
        <div style={{
          background: '#f8f9fa',
          borderRadius: '8px',
          padding: '12px',
        }}>
          <p style={{ fontSize: '11px', fontWeight: 600, color: '#888', marginBottom: '8px' }}>
            SCORE BREAKDOWN
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <ComponentRow label="RSI" value={`${components.rsi}`} hint={components.rsi > 70 ? 'Overbought' : components.rsi < 30 ? 'Oversold' : 'Neutral'} />
            <ComponentRow label="Momentum" value={`${components.momentum > 0 ? '+' : ''}${components.momentum}%`} hint="vs 30d MA" />
            <ComponentRow label="52W Position" value={`${components.range52?.toFixed(0)}%`} hint="in range" />
            <ComponentRow label="Volatility" value={`${components.volatility}%`} hint="std dev" />
          </div>
        </div>
      )}
    </div>
  );
}

function ComponentRow({ label, value, hint }) {
  return (
    <div style={{
      background: '#fff',
      borderRadius: '6px',
      padding: '8px 10px',
    }}>
      <p style={{ fontSize: '10px', color: '#aaa', margin: '0 0 2px' }}>{label}</p>
      <p style={{ fontSize: '14px', fontWeight: 600, color: '#111', margin: '0 0 1px' }}>{value}</p>
      <p style={{ fontSize: '10px', color: '#888', margin: 0 }}>{hint}</p>
    </div>
  );
}
