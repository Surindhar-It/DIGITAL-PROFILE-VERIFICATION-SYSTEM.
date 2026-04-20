const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

const StudentPersonal = require('./models/StudentPersonal');
const Profile = require('./models/Profile');
const LeetcodeStatus = require('./models/LeetcodeStatus');
const GithubStatus = require('./models/GithubStatus');
const CodechefStatus = require('./models/CodechefStatus');
const CodeforcesStatus = require('./models/CodeforcesStatus');
const HackerrankStatus = require('./models/HackerrankStatus');
const Score = require('./models/Score');

dotenv.config();

const depts = ['CSE', 'IT', 'ECE', 'EEE', 'MECH'];
const mockNames = [
    'Aarav Patel', 'Priya Sharma', 'Rohan Kumar', 'Neha Gupta',
    'Aditya Singh', 'Ananya Reddy', 'Vikram Verma', 'Kavya Iyer',
    'Rahul Desai', 'Sanya Joshi'
];

const generateSampleData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for Seed');

        console.log('Clearing old sample data...');
        await StudentPersonal.deleteMany({ email: /student\d+@example\.com/ });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        for (let i = 1; i <= 10; i++) {
            const lcTotal = Math.floor(Math.random() * 500) + 50;
            const leetcodeStatus = new LeetcodeStatus({
                easy: Math.floor(lcTotal * 0.5),
                medium: Math.floor(lcTotal * 0.4),
                hard: Math.floor(lcTotal * 0.1),
                total: lcTotal
            });
            await leetcodeStatus.save();

            const githubStatus = new GithubStatus({
                username: `user${i}gh`,
                public_repos: Math.floor(Math.random() * 50) + 5,
                followers: Math.floor(Math.random() * 100),
                following: Math.floor(Math.random() * 50)
            });
            await githubStatus.save();

            const codechefStatus = new CodechefStatus({
                username: `user${i}cc`,
                rating: Math.floor(Math.random() * 1000) + 1000,
                stars: Math.floor(Math.random() * 5) + 1,
                globalRank: Math.floor(Math.random() * 50000) + 1000,
                countryRank: Math.floor(Math.random() * 10000) + 100,
                problemsSolved: Math.floor(Math.random() * 500) + 50
            });
            await codechefStatus.save();

            const codeforcesStatus = new CodeforcesStatus({
                handle: `user${i}cf`,
                rating: Math.floor(Math.random() * 1000) + 800,
                rank: 'pupil',
                maxRating: Math.floor(Math.random() * 1000) + 1000,
                solved: Math.floor(Math.random() * 800) + 50
            });
            await codeforcesStatus.save();

            const hackerrankStatus = new HackerrankStatus({
                username: `user${i}`,
                badges: Math.floor(Math.random() * 15)
            });
            await hackerrankStatus.save();

            const profile = new Profile({
                leetcode: `https://leetcode.com/user${i}`,
                github: `https://github.com/user${i}gh`,
                hackerrank: `https://hackerrank.com/user${i}`,
                codechef: `https://codechef.com/users/user${i}cc`,
                codeforces: `https://codeforces.com/profile/user${i}cf`,
                linkedin: `https://linkedin.com/in/user${i}`
            });
            await profile.save();

            const score = new Score({
                total: Math.floor(Math.random() * 2000),
                leetcode: Math.floor(Math.random() * 500),
                codechef: Math.floor(Math.random() * 500),
                codeforces: Math.floor(Math.random() * 500),
                github: Math.floor(Math.random() * 500),
                hackerrank: Math.floor(Math.random() * 15)
            });
            await score.save();

            const student = new StudentPersonal({
                name: mockNames[i - 1],
                email: `student${i}@example.com`,
                password: hashedPassword,
                phone: `987654321${i % 10}`,
                college: 'BIT',
                dept: depts[i % depts.length],
                regNo: `7321${Math.floor(Math.random() * 1000)}`,
                status: 'Verified',
                profiles: profile._id,
                leetcodeStats: leetcodeStatus._id,
                githubStats: githubStatus._id,
                codechefStats: codechefStatus._id,
                codeforcesStats: codeforcesStatus._id,
                hackerrankStats: hackerrankStatus._id,
                scores: score._id
            });
            await student.save();
            console.log(`Created student: ${student.name}`);
        }
        
        console.log('Sample data insertion complete.');
        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

generateSampleData();
