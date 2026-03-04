const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const Admin = require('./models/Admin');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log('MongoDB Connected');

        const email = 'admin@company.com';
        const password = 'adminpassword';

        let admin = await Admin.findOne({ email });
        if (admin) {
            console.log('Admin already exists');
            process.exit();
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        admin = new Admin({
            email,
            password: hashedPassword
        });

        await admin.save();
        console.log('Admin Created Successfully');
        console.log('Email:', email);
        console.log('Password:', password);
        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
