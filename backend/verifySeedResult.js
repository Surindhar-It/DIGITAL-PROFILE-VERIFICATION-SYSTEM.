const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');

const StudentPersonal = require('./models/StudentPersonal');
const Profile = require('./models/Profile');
const LeetcodeStatus = require('./models/LeetcodeStatus');
const GithubStatus = require('./models/GithubStatus');
const CodechefStatus = require('./models/CodechefStatus');
const CodeforcesStatus = require('./models/CodeforcesStatus');
const HackerrankStatus = require('./models/HackerrankStatus');
const Score = require('./models/Score');

dotenv.config();

const checkData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const populateStudent = (query) => {
            return query.populate('profiles leetcodeStats githubStats codechefStats codeforcesStats hackerrankStats scores');
        };
        const students = await populateStudent(StudentPersonal.find({ status: 'Verified' }).select('-password'));
        const sampleStudents = students.filter(s => s.email.includes('student'));
        
        const output = {
            count: students.length,
            sampleCount: sampleStudents.length,
            firstSample: sampleStudents.length > 0 ? sampleStudents[0] : null
        };
        fs.writeFileSync('verifyOutput.json', JSON.stringify(output, null, 2), 'utf-8');
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
checkData();
