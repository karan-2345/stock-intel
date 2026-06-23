require('dotenv').config();
const express = require('express');
const cors = require('cors');

const stockRoutes = require('./routes/stock');
const newsRoutes = require('./routes/news');
const analysisRoutes = require('./routes/analysis');
const geoRoutes = require('./routes/geo');
const fearRoutes = require('./routes/fear');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://stocksintel-sage.vercel.app'
  ]
}));
app.use(express.json());

// Routes
app.use('/api/stock', stockRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/geo', geoRoutes);
app.use('/api/fear', fearRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Stock Intel API running on http://localhost:${PORT}`);
});
