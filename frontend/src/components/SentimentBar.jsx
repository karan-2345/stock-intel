// Horizontal bar showing a named sentiment metric
// value: 0-100 number
// color: bar fill color
export default function SentimentBar({ label, value, color }) {
  return (
    <div style={{ marginBottom: '12px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '12px',
        color: '#555',
        marginBottom: '5px',
      }}>
        <span>{label}</span>
        <span style={{ fontWeight: 600 }}>{value}%</span>
      </div>
      <div style={{
        height: '6px',
        background: '#f0f0f0',
        borderRadius: '3px',
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          width: `${value}%`,
          background: color,
          borderRadius: '3px',
          transition: 'width 0.6s ease',
        }} />
      </div>
    </div>
  );
}
