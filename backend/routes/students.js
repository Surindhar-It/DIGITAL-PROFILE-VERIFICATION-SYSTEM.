const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const auth = require('../middleware/auth');
const Joi = require('joi');
const { getLeetCodeStats, extractLeetCodeUsername } = require('../utils/leetcodeHelper');
const { getGitHubStats, extractGitHubUsername } = require('../utils/githubHelper');
const { getCodeChefStats, extractCodeChefUsername } = require('../utils/codechefHelper');
const bcrypt = require('bcryptjs');

// @route   POST api/students/submit
// @desc    Submit student profile
// @access  Public
router.post('/submit', async (req, res) => {
    // Validation Schema
    const schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        phone: Joi.string().required(),
        college: Joi.string().required(),
        dept: Joi.string().required(),
        regNo: Joi.string().required(),
        profiles: Joi.object({
            leetcode: Joi.string().uri().allow(''),
            github: Joi.string().uri().allow(''),
            hackerrank: Joi.string().uri().allow(''),
            codechef: Joi.string().uri().allow(''),
            codeforces: Joi.string().uri().allow(''),
            linkedin: Joi.string().uri().allow('')
        })
    });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ msg: error.details[0].message });

    const { email, password } = req.body;

    try {
        let student = await Student.findOne({ email });
        if (student) {
            if (student.status === 'Rejected') {
                // Allow resubmission: update fields and reset status
                const { name, phone, college, dept, regNo, profiles, password } = req.body;
                student.name = name;
                student.phone = phone;
                student.college = college;
                student.dept = dept;
                student.regNo = regNo;
                student.profiles = profiles;
                student.status = 'Pending';
                student.submittedAt = Date.now();

                // Hash new password if provided (optional logic, but good to keep in sync)
                const salt = await bcrypt.genSalt(10);
                student.password = await bcrypt.hash(password, salt);

                // Fetch LeetCode Stats (Resubmission)
                if (profiles && profiles.leetcode) {
                    const leetCodeUsername = extractLeetCodeUsername(profiles.leetcode);
                    if (leetCodeUsername) {
                        const stats = await getLeetCodeStats(leetCodeUsername);
                        if (stats) {
                            student.leetcodeStats = stats;
                            if (!student.scores) student.scores = {};
                            student.scores.leetcode = stats.total;
                            student.scores.total = (student.scores.codechef || 0) + (student.scores.codeforces || 0) + (student.scores.github || 0) + stats.total;
                        }
                    }
                }

                // Fetch GitHub Stats (Resubmission)
                if (profiles && profiles.github) {
                    const gitHubUsername = extractGitHubUsername(profiles.github);
                    if (gitHubUsername) {
                        const stats = await getGitHubStats(gitHubUsername);
                        if (stats) {
                            student.githubStats = stats;
                            if (!student.scores) student.scores = {};
                            student.scores.github = stats.public_repos; // Score = Public Repos
                            student.scores.total = (student.scores.codechef || 0) + (student.scores.codeforces || 0) + (student.scores.leetcode || 0) + stats.public_repos;
                        }
                    }
                }

                // Fetch CodeChef Stats (Resubmission)
                if (profiles && profiles.codechef) {
                    const codeChefUsername = extractCodeChefUsername(profiles.codechef);
                    if (codeChefUsername) {
                        const stats = await getCodeChefStats(codeChefUsername);
                        if (stats) {
                            student.codechefStats = stats;
                            if (!student.scores) student.scores = {};
                            student.scores.codechef = stats.rating; // Using rating as score
                            student.scores.total = (student.scores.leetcode || 0) + (student.scores.codeforces || 0) + (student.scores.github || 0) + stats.rating;
                        }
                    }
                }

                await student.save();
                return res.json(student);
            } else {
                return res.status(400).json({ msg: 'Student already submitted with this email' });
            }
        }

        student = new Student(req.body);

        // Fetch LeetCode Stats
        if (req.body.profiles && req.body.profiles.leetcode) {
            const leetCodeUsername = extractLeetCodeUsername(req.body.profiles.leetcode);
            if (leetCodeUsername) {
                const stats = await getLeetCodeStats(leetCodeUsername);
                if (stats) {
                    student.leetcodeStats = stats;
                    // Update scores (Simple logic: Total Score = Total Solved)
                    // Ensure scores object exists
                    if (!student.scores) student.scores = {};
                    student.scores.leetcode = stats.total;
                    student.scores.total = (student.scores.codechef || 0) + (student.scores.codeforces || 0) + (student.scores.github || 0) + stats.total;
                }
            }
        }

        // Fetch GitHub Stats
        if (req.body.profiles && req.body.profiles.github) {
            const gitHubUsername = extractGitHubUsername(req.body.profiles.github);
            if (gitHubUsername) {
                const stats = await getGitHubStats(gitHubUsername);
                if (stats) {
                    student.githubStats = stats;
                    // Update scores (Score = Public Repos)
                    if (!student.scores) student.scores = {};
                    student.scores.github = stats.public_repos;
                    student.scores.total = (student.scores.codechef || 0) + (student.scores.codeforces || 0) + (student.scores.leetcode || 0) + stats.public_repos;
                }
            }
        }

        // Fetch CodeChef Stats
        if (req.body.profiles && req.body.profiles.codechef) {
            const codeChefUsername = extractCodeChefUsername(req.body.profiles.codechef);
            if (codeChefUsername) {
                const stats = await getCodeChefStats(codeChefUsername);
                if (stats) {
                    student.codechefStats = stats;
                    // Update scores (Score = Rating)
                    if (!student.scores) student.scores = {};
                    student.scores.codechef = stats.rating;
                    student.scores.total = (student.scores.leetcode || 0) + (student.scores.codeforces || 0) + (student.scores.github || 0) + stats.rating;
                }
            }
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        student.password = await bcrypt.hash(password, salt);

        await student.save();

        res.json(student);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server Error: ' + err.message });
    }
});

// @route   POST api/students/login
// @desc    Login student to check status
// @access  Public
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ msg: 'Please provide email and password' });
    }

    try {
        const student = await Student.findOne({ email });
        if (!student) return res.status(400).json({ msg: 'Invalid Credentials' });

        const isMatch = await bcrypt.compare(password, student.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });

        res.json(student);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/students/status/:email
// @desc    Check student status
// @access  Public
router.get('/status/:email', async (req, res) => {
    try {
        const student = await Student.findOne({ email: req.params.email });
        if (!student) return res.status(404).json({ msg: 'Student not found' });
        res.json(student);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/students/leaderboard
// @desc    Get leaderboard data (Public)
// @access  Public
router.get('/leaderboard', async (req, res) => {
    try {
        const students = await Student.find({ status: 'Verified' })
            .select('name regNo scores profiles leetcodeStats codeforcesStats githubStats codechefStats college') // Select only necessary fields
            .sort({ 'scores.total': -1 });
        res.json(students);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/students
// @desc    Get all students (Admin only)
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const students = await Student.find().sort({ submittedAt: -1 });
        res.json(students);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/students/verify/:id
// @desc    Verify or Reject student
// @access  Private
router.put('/verify/:id', auth, async (req, res) => {
    const { status } = req.body;
    if (!['Verified', 'Rejected', 'Pending'].includes(status)) {
        return res.status(400).json({ msg: 'Invalid status' });
    }

    try {
        let student = await Student.findById(req.params.id);
        if (!student) return res.status(404).json({ msg: 'Student not found' });

        student.status = status;
        await student.save();

        res.json(student);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/students/verified
// @desc    Get verified students
// @access  Private
router.get('/verified', auth, async (req, res) => {
    try {
        const students = await Student.find({ status: 'Verified' }).sort({ name: 1 });
        res.json(students);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/students/:id
// @desc    Delete student
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) return res.status(404).json({ msg: 'Student not found' });

        await student.deleteOne();
        res.json({ msg: 'Student removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/students/bulk-verify
// @desc    Bulk verify or reject students
// @access  Private
router.put('/bulk-verify', auth, async (req, res) => {
    const { ids, status } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ msg: 'No students selected' });
    }

    if (!['Verified', 'Rejected', 'Pending'].includes(status)) {
        return res.status(400).json({ msg: 'Invalid status' });
    }

    try {
        await Student.updateMany(
            { _id: { $in: ids } },
            { $set: { status: status } }
        );
        res.json({ msg: `Students marked as ${status}` });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/students/bulk-delete
// @desc    Bulk delete students
// @access  Private
router.post('/bulk-delete', auth, async (req, res) => {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ msg: 'No students selected' });
    }

    try {
        await Student.deleteMany({ _id: { $in: ids } });
        res.json({ msg: 'Selected students deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
