const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const { scheduleDailyRefresh, runDailyRefresh } = require('./utils/dailyRefresh');
const auth = require('./middleware/auth');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true
}));
app.use(express.json());

// Debug Middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/students', require('./routes/students'));

// Admin: Manually trigger a stats refresh right now
app.post('/api/admin/refresh-stats', auth, async (req, res) => {
    res.json({ msg: 'Stats refresh started in the background. Check server logs for progress.' });
    // Run after response so the HTTP call doesn't time out
    setImmediate(() => runDailyRefresh());
});

// Database Connection — start the daily scheduler only after DB is ready
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB Connected');
        scheduleDailyRefresh();
    })
    .catch(err => console.error('MongoDB Connection Error:', err));

app.get('/', (req, res) => {
    res.send('Digital Profile Verification System API');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
