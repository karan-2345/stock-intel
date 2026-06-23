import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

// Custom tooltip shown on hover
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      padding: '8px 12px',
      fontSize: '13px',
    }}>
      <p style={{ color: '#888', margin: '0 0 2px' }}>{label}</p>
      <p style={{ color: '#111', fontWeight: 600, margin: 0 }}>
        {payload[0].value?.toFixed(2)}
      </p>
    </div>
  );
}

export default function PriceChart({ data, isUp }) {
  const color = isUp ? '#16a34a' : '#dc2626';

  // Show only every 5th date label so it doesn't get crowded
  const formattedData = data.map((d, i) => ({
    ...d,
    label: i % 5 === 0
      ? new Date(d.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
      : '',
  }));

  return (
    <ResponsiveContainer width="100%" height={180}>
      <AreaChart data={formattedData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.15} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 10, fill: '#aaa' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 10, fill: '#aaa' }}
          axisLine={false}
          tickLine={false}
          domain={['auto', 'auto']}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="close"
          stroke={color}
          strokeWidth={2}
          fill="url(#priceGrad)"
          dot={false}
          activeDot={{ r: 4, fill: color }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
