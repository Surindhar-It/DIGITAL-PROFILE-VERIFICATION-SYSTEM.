const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    college: { type: String, required: true },
    dept: { type: String, required: true },
    regNo: { type: String, required: true },
    profiles: {
        leetcode: { type: String, default: '' },
        github: { type: String, default: '' },
        hackerrank: { type: String, default: '' },
        codechef: { type: String, default: '' },
        codeforces: { type: String, default: '' },
        linkedin: { type: String, default: '' }
    },
    leetcodeStats: {
        easy: { type: Number, default: 0 },
        medium: { type: Number, default: 0 },
        hard: { type: Number, default: 0 },
        total: { type: Number, default: 0 }
    },
    githubStats: {
        username: { type: String, default: '' },
        public_repos: { type: Number, default: 0 },
        followers: { type: Number, default: 0 },
        following: { type: Number, default: 0 }
    },
    codechefStats: {
        username: { type: String, default: '' },
        rating: { type: Number, default: 0 },
        stars: { type: Number, default: 0 },
        globalRank: { type: Number, default: 0 },
        countryRank: { type: Number, default: 0 }
    },
    scores: {
        total: { type: Number, default: 0 },
        leetcode: { type: Number, default: 0 },
        codechef: { type: Number, default: 0 },
        codeforces: { type: Number, default: 0 },
        github: { type: Number, default: 0 }
    },
    status: {
        type: String,
        enum: ['Pending', 'Verified', 'Rejected'],
        default: 'Pending'
    },
    submittedAt: {
        type: Date,
        default: Date.now
    },
    statsLastRefreshed: {
        type: Date,
        default: null
    }
});

module.exports = mongoose.model('Student', StudentSchema);
