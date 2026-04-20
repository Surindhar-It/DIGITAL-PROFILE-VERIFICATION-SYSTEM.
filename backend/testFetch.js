const axios = require('axios');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config({ path: '.env' });

const testFetch = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const StudentPersonal = require('./models/StudentPersonal');
        const Profile = require('./models/Profile');
        const LeetcodeStatus = require('./models/LeetcodeStatus');
        const GithubStatus = require('./models/GithubStatus');
        const CodechefStatus = require('./models/CodechefStatus');
        const CodeforcesStatus = require('./models/CodeforcesStatus');
        const Score = require('./models/Score');

        const populateStudent = (query) => {
            return query.populate('profiles leetcodeStats githubStats codechefStats codeforcesStats scores');
        };
        const students = await populateStudent(StudentPersonal.find().sort({ submittedAt: -1 }));
        fs.writeFileSync('errorLog2.txt', "Success " + students.length, 'utf-8');
        process.exit(0);
    } catch (e) {
        fs.writeFileSync('errorLog2.txt', e.stack, 'utf-8');
        process.exit(1);
    }
}
testFetch();
