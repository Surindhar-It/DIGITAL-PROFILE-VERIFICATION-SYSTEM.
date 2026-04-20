const mongoose = require('mongoose');

const LeetcodeStatusSchema = new mongoose.Schema({
    easy: { type: Number, default: 0 },
    medium: { type: Number, default: 0 },
    hard: { type: Number, default: 0 },
    total: { type: Number, default: 0 }
});

module.exports = mongoose.model('LeetcodeStatus', LeetcodeStatusSchema);
