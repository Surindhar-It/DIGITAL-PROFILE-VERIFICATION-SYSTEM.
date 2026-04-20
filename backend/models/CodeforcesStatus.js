const mongoose = require('mongoose');

const CodeforcesStatusSchema = new mongoose.Schema({
    handle: { type: String, default: '' },
    rating: { type: Number, default: 0 },
    rank: { type: String, default: '' },
    maxRating: { type: Number, default: 0 }
});

module.exports = mongoose.model('CodeforcesStatus', CodeforcesStatusSchema);
