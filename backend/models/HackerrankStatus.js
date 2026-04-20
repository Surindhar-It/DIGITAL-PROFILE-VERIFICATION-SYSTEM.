const mongoose = require('mongoose');

const HackerrankStatusSchema = new mongoose.Schema({
    username: { type: String, default: '' },
    badges: { type: Number, default: 0 }
});

module.exports = mongoose.model('HackerrankStatus', HackerrankStatusSchema);
