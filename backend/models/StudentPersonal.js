const mongoose = require('mongoose');

const StudentPersonalSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    college: { type: String, required: true },
    dept: { type: String, required: true },
    regNo: { type: String, required: true },
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
    },
    profiles: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile' },
    leetcodeStats: { type: mongoose.Schema.Types.ObjectId, ref: 'LeetcodeStatus' },
    githubStats: { type: mongoose.Schema.Types.ObjectId, ref: 'GithubStatus' },
    codechefStats: { type: mongoose.Schema.Types.ObjectId, ref: 'CodechefStatus' },
    codeforcesStats: { type: mongoose.Schema.Types.ObjectId, ref: 'CodeforcesStatus' },
    hackerrankStats: { type: mongoose.Schema.Types.ObjectId, ref: 'HackerrankStatus' },
    scores: { type: mongoose.Schema.Types.ObjectId, ref: 'Score' }
});

module.exports = mongoose.model('StudentPersonal', StudentPersonalSchema);
