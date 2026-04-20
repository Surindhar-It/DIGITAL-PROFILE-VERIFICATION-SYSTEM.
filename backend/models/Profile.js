const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
    leetcode: { type: String, default: '' },
    github: { type: String, default: '' },
    hackerrank: { type: String, default: '' },
    codechef: { type: String, default: '' },
    codeforces: { type: String, default: '' },
    linkedin: { type: String, default: '' }
});

module.exports = mongoose.model('Profile', ProfileSchema);
