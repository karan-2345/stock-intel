// Displays geopolitical events with their mapped sector impact
export default function GeopoliticalPanel({ events }) {
  if (!events || events.length === 0) {
    return (
      <p style={{ color: '#aaa', fontSize: '13px', textAlign: 'center', padding: '20px 0' }}>
        No major geopolitical events detected.
      </p>
    );
  }

  return (
    <div>
      {events.map((event, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            gap: '12px',
            padding: '10px 0',
            borderBottom: i < events.length - 1 ? '1px solid #f0f0f0' : 'none',
            alignItems: 'flex-start',
          }}
        >
          {/* Icon badge */}
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '8px',
            background: event.bg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            flexShrink: 0,
          }}>
            {event.icon}
          </div>

          {/* Content */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Headline */}
            <p style={{
              fontSize: '13px',
              fontWeight: 500,
              color: '#111',
              margin: '0 0 4px',
              lineHeight: 1.4,
              // Truncate long headlines
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}>
              {event.url ? (
                <a
                  href={event.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#111', textDecoration: 'none' }}
                >
                  {event.headline}
                </a>
              ) : event.headline}
            </p>

            {/* Sector impact */}
            <p style={{
              fontSize: '12px',
              color: event.color,
              margin: '0 0 4px',
              fontWeight: 500,
            }}>
              {event.impact}
            </p>

            {/* Source + time */}
            <p style={{ fontSize: '11px', color: '#aaa', margin: 0 }}>
              {event.source} · {event.time}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
