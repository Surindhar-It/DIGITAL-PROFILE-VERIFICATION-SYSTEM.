const mongoose = require('mongoose');

const ScoreSchema = new mongoose.Schema({
    total: { type: Number, default: 0 },
    leetcode: { type: Number, default: 0 },
    codechef: { type: Number, default: 0 },
    codeforces: { type: Number, default: 0 },
    github: { type: Number, default: 0 },
    hackerrank: { type: Number, default: 0 }
});

module.exports = mongoose.model('Score', ScoreSchema);
