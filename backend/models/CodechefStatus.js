const mongoose = require('mongoose');

const CodechefStatusSchema = new mongoose.Schema({
    username: { type: String, default: '' },
    rating: { type: Number, default: 0 },
    stars: { type: Number, default: 0 },
    globalRank: { type: Number, default: 0 },
    countryRank: { type: Number, default: 0 },
    problemsSolved: { type: Number, default: 0 }
});

module.exports = mongoose.model('CodechefStatus', CodechefStatusSchema);
