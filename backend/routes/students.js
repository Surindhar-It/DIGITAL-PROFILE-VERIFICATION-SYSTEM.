const express = require('express');
const router = express.Router();
const StudentPersonal = require('../models/StudentPersonal');
const Profile = require('../models/Profile');
const LeetcodeStatus = require('../models/LeetcodeStatus');
const GithubStatus = require('../models/GithubStatus');
const CodechefStatus = require('../models/CodechefStatus');
const CodeforcesStatus = require('../models/CodeforcesStatus');
const HackerrankStatus = require('../models/HackerrankStatus');
const Score = require('../models/Score');
const auth = require('../middleware/auth');
const Joi = require('joi');
const { getLeetCodeStats, extractLeetCodeUsername } = require('../utils/leetcodeHelper');
const { getGitHubStats, extractGitHubUsername } = require('../utils/githubHelper');
const { getCodeChefStats, extractCodeChefUsername } = require('../utils/codechefHelper');
const { getCodeforcesStats, extractCodeforcesUsername } = require('../utils/codeforcesHelper');
const { getHackerrankStats, extractHackerrankUsername } = require('../utils/hackerrankHelper');
const bcrypt = require('bcryptjs');

// Helper to fully populate a student record
const populateStudent = (query) => {
    return query.populate('profiles leetcodeStats githubStats codechefStats codeforcesStats hackerrankStats scores');
};

// @route   POST api/students/submit
// @desc    Submit student profile
// @access  Public
router.post('/submit', async (req, res) => {
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
        let student = await populateStudent(StudentPersonal.findOne({ email }));
        
        if (student) {
            if (student.status === 'Rejected') {
                const { name, phone, college, dept, regNo, profiles, password } = req.body;
                student.name = name;
                student.phone = phone;
                student.college = college;
                student.dept = dept;
                student.regNo = regNo;
                student.status = 'Pending';
                student.submittedAt = Date.now();

                const salt = await bcrypt.genSalt(10);
                student.password = await bcrypt.hash(password, salt);

                // Profiles
                let profileDoc = student.profiles || new Profile();
                if (profiles) Object.assign(profileDoc, profiles);
                await profileDoc.save();
                student.profiles = profileDoc._id;

                // Score doc
                let scoreDoc = student.scores || new Score();
                scoreDoc.total = 0; // recalculate

                // LeetCode
                if (profiles && profiles.leetcode) {
                    const lcUser = extractLeetCodeUsername(profiles.leetcode);
                    if (lcUser) {
                        const stats = await getLeetCodeStats(lcUser);
                        if (stats) {
                            let lcDoc = student.leetcodeStats || new LeetcodeStatus();
                            Object.assign(lcDoc, stats);
                            await lcDoc.save();
                            student.leetcodeStats = lcDoc._id;
                            scoreDoc.leetcode = stats.total;
                        }
                    }
                }

                // GitHub
                if (profiles && profiles.github) {
                    const ghUser = extractGitHubUsername(profiles.github);
                    if (ghUser) {
                        const stats = await getGitHubStats(ghUser);
                        if (stats) {
                            let ghDoc = student.githubStats || new GithubStatus();
                            Object.assign(ghDoc, stats);
                            await ghDoc.save();
                            student.githubStats = ghDoc._id;
                            scoreDoc.github = stats.public_repos;
                        }
                    }
                }

                // CodeChef
                if (profiles && profiles.codechef) {
                    const ccUser = extractCodeChefUsername(profiles.codechef);
                    if (ccUser) {
                        const stats = await getCodeChefStats(ccUser);
                        if (stats) {
                            let ccDoc = student.codechefStats || new CodechefStatus();
                            Object.assign(ccDoc, stats);
                            await ccDoc.save();
                            student.codechefStats = ccDoc._id;
                            scoreDoc.codechef = stats.rating;
                        }
                    }
                }

                // Codeforces
                if (profiles && profiles.codeforces) {
                    const cfUser = extractCodeforcesUsername(profiles.codeforces);
                    if (cfUser) {
                        const stats = await getCodeforcesStats(cfUser);
                        if (stats) {
                            let cfDoc = student.codeforcesStats || new CodeforcesStatus();
                            Object.assign(cfDoc, stats);
                            await cfDoc.save();
                            student.codeforcesStats = cfDoc._id;
                            scoreDoc.codeforces = stats.rating || stats.solved;
                        }
                    }
                }

                // HackerRank
                if (profiles && profiles.hackerrank) {
                    const hrUser = extractHackerrankUsername(profiles.hackerrank);
                    if (hrUser) {
                        const stats = await getHackerrankStats(hrUser);
                        if (stats) {
                            let hrDoc = student.hackerrankStats || new HackerrankStatus();
                            Object.assign(hrDoc, stats);
                            await hrDoc.save();
                            student.hackerrankStats = hrDoc._id;
                            scoreDoc.hackerrank = stats.badges;
                        }
                    }
                }

                scoreDoc.total = (scoreDoc.leetcode || 0) + (scoreDoc.github || 0) + (scoreDoc.codechef || 0) + (scoreDoc.codeforces || 0) + (scoreDoc.hackerrank || 0);
                await scoreDoc.save();
                student.scores = scoreDoc._id;

                await student.save();
                
                const returnStudent = await populateStudent(StudentPersonal.findById(student._id));
                return res.json(returnStudent);
            } else {
                return res.status(400).json({ msg: 'Student already submitted with this email' });
            }
        }

        // --- New Student Creation ---
        student = new StudentPersonal(req.body);

        let profileDoc = new Profile(req.body.profiles || {});
        await profileDoc.save();
        student.profiles = profileDoc._id;

        let scoreDoc = new Score({ total: 0, leetcode: 0, codechef: 0, codeforces: 0, github: 0, hackerrank: 0 });

        // Fetch LeetCode Stats
        if (req.body.profiles && req.body.profiles.leetcode) {
            const lcUser = extractLeetCodeUsername(req.body.profiles.leetcode);
            if (lcUser) {
                const stats = await getLeetCodeStats(lcUser);
                if (stats) {
                    let lcDoc = new LeetcodeStatus(stats);
                    await lcDoc.save();
                    student.leetcodeStats = lcDoc._id;
                    scoreDoc.leetcode = stats.total;
                }
            }
        }

        // Fetch GitHub Stats
        if (req.body.profiles && req.body.profiles.github) {
            const ghUser = extractGitHubUsername(req.body.profiles.github);
            if (ghUser) {
                const stats = await getGitHubStats(ghUser);
                if (stats) {
                    let ghDoc = new GithubStatus(stats);
                    await ghDoc.save();
                    student.githubStats = ghDoc._id;
                    scoreDoc.github = stats.public_repos;
                }
            }
        }

        // Fetch CodeChef Stats
        if (req.body.profiles && req.body.profiles.codechef) {
            const ccUser = extractCodeChefUsername(req.body.profiles.codechef);
            if (ccUser) {
                const stats = await getCodeChefStats(ccUser);
                if (stats) {
                    let ccDoc = new CodechefStatus(stats);
                    await ccDoc.save();
                    student.codechefStats = ccDoc._id;
                    scoreDoc.codechef = stats.rating;
                }
            }
        }

        // Fetch Codeforces Stats
        if (req.body.profiles && req.body.profiles.codeforces) {
            const cfUser = extractCodeforcesUsername(req.body.profiles.codeforces);
            if (cfUser) {
                const stats = await getCodeforcesStats(cfUser);
                if (stats) {
                    let cfDoc = new CodeforcesStatus(stats);
                    await cfDoc.save();
                    student.codeforcesStats = cfDoc._id;
                    scoreDoc.codeforces = stats.rating || stats.solved;
                }
            }
        }

        // Fetch HackerRank Stats
        if (req.body.profiles && req.body.profiles.hackerrank) {
            const hrUser = extractHackerrankUsername(req.body.profiles.hackerrank);
            if (hrUser) {
                const stats = await getHackerrankStats(hrUser);
                if (stats) {
                    let hrDoc = new HackerrankStatus(stats);
                    await hrDoc.save();
                    student.hackerrankStats = hrDoc._id;
                    scoreDoc.hackerrank = stats.badges;
                }
            }
        }

        scoreDoc.total = (scoreDoc.leetcode || 0) + (scoreDoc.github || 0) + (scoreDoc.codechef || 0) + (scoreDoc.codeforces || 0) + (scoreDoc.hackerrank || 0);
        await scoreDoc.save();
        student.scores = scoreDoc._id;

        const salt = await bcrypt.genSalt(10);
        student.password = await bcrypt.hash(password, salt);

        await student.save();

        const newStudent = await populateStudent(StudentPersonal.findById(student._id));
        res.json(newStudent);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server Error: ' + err.message });
    }
});

// @route   POST api/students/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ msg: 'Please provide email and password' });

    try {
        const student = await populateStudent(StudentPersonal.findOne({ email }));
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
router.get('/status/:email', async (req, res) => {
    try {
        const student = await populateStudent(StudentPersonal.findOne({ email: req.params.email }));
        if (!student) return res.status(404).json({ msg: 'Student not found' });
        res.json(student);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/students/leaderboard
router.get('/leaderboard', async (req, res) => {
    try {
        // Need to sort by scores.total. Since scores is referenced, we can query students and populate.
        // Or we can query Score, sort, and then map back to students. Standard mongoose approach:
        const students = await populateStudent(StudentPersonal.find({ status: 'Verified' }).select('-password'));
        
        // Sorting in JS memory because populating across references makes DB sorting tricky natively without aggregation
        students.sort((a, b) => {
            const scoreA = a.scores ? a.scores.total : 0;
            const scoreB = b.scores ? b.scores.total : 0;
            return scoreB - scoreA;
        });

        res.json(students);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/students
// @desc    Get all students (Admin only)
router.get('/', auth, async (req, res) => {
    try {
        const students = await populateStudent(StudentPersonal.find().sort({ submittedAt: -1 }));
        res.json(students);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/students/verify/:id
router.put('/verify/:id', auth, async (req, res) => {
    const { status } = req.body;
    if (!['Verified', 'Rejected', 'Pending'].includes(status)) {
        return res.status(400).json({ msg: 'Invalid status' });
    }
    try {
        let student = await StudentPersonal.findById(req.params.id);
        if (!student) return res.status(404).json({ msg: 'Student not found' });

        student.status = status;
        await student.save();
        
        const populatedStudent = await populateStudent(StudentPersonal.findById(req.params.id));
        res.json(populatedStudent);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/students/verified
router.get('/verified', auth, async (req, res) => {
    try {
        const students = await populateStudent(StudentPersonal.find({ status: 'Verified' }).sort({ name: 1 }));
        res.json(students);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/students/:id
router.delete('/:id', auth, async (req, res) => {
    try {
        const student = await StudentPersonal.findById(req.params.id);
        if (!student) return res.status(404).json({ msg: 'Student not found' });

        await student.deleteOne();
        // optionally delete associated child documents, omitted for brevity / not strictly required
        
        res.json({ msg: 'Student removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/students/bulk-verify
router.put('/bulk-verify', auth, async (req, res) => {
    const { ids, status } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) return res.status(400).json({ msg: 'No students selected' });
    if (!['Verified', 'Rejected', 'Pending'].includes(status)) return res.status(400).json({ msg: 'Invalid status' });

    try {
        await StudentPersonal.updateMany({ _id: { $in: ids } }, { $set: { status: status } });
        res.json({ msg: `Students marked as ${status}` });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/students/bulk-delete
router.post('/bulk-delete', auth, async (req, res) => {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) return res.status(400).json({ msg: 'No students selected' });

    try {
        await StudentPersonal.deleteMany({ _id: { $in: ids } });
        res.json({ msg: 'Selected students deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
