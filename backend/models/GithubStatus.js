const mongoose = require('mongoose');

const GithubStatusSchema = new mongoose.Schema({
    username: { type: String, default: '' },
    public_repos: { type: Number, default: 0 },
    followers: { type: Number, default: 0 },
    following: { type: Number, default: 0 }
});

module.exports = mongoose.model('GithubStatus', GithubStatusSchema);
