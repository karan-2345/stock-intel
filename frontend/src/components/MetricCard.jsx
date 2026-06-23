// A single metric tile — label on top, big value below
export default function MetricCard({ label, value, color }) {
  return (
    <div style={{
      background: '#f8f9fa',
      borderRadius: '10px',
      padding: '14px 16px',
    }}>
      <p style={{
        fontSize: '11px',
        color: '#888',
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        marginBottom: '6px',
        fontWeight: 500,
      }}>
        {label}
      </p>
      <p style={{
        fontSize: '20px',
        fontWeight: 600,
        color: color || '#111',
        margin: 0,
      }}>
        {value}
      </p>
    </div>
  );
}
