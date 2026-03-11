import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';

import ThemeToggle from '../components/ThemeToggle';

const StudentForm = () => {
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', phone: '', college: '', dept: '', regNo: '',
        profiles: { leetcode: '', github: '', hackerrank: '', codechef: '', codeforces: '', linkedin: '' }
    });

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        if (queryParams.get('edit') === 'true') {
            const savedData = localStorage.getItem('editStudentData');
            if (savedData) {
                const parsedData = JSON.parse(savedData);
                // Ensure we map the data correctly, especially profiles
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setFormData({
                    name: parsedData.name || '',
                    email: parsedData.email || '',
                    password: '', // Force them to set a new password or we could keep old one if we didn't hash it but we do. Let's make them re-enter for security or leave blank to keep same? Backend expects password. Let's ask them to re-enter.
                    phone: parsedData.phone || '',
                    college: parsedData.college || '',
                    dept: parsedData.dept || '',
                    regNo: parsedData.regNo || '',
                    profiles: {
                        leetcode: parsedData.profiles?.leetcode || '',
                        github: parsedData.profiles?.github || '',
                        hackerrank: parsedData.profiles?.hackerrank || '',
                        codechef: parsedData.profiles?.codechef || '',
                        codeforces: parsedData.profiles?.codeforces || '',
                        linkedin: parsedData.profiles?.linkedin || ''
                    }
                });
                // Clear it so it doesn't persist forever
                localStorage.removeItem('editStudentData');
            }
        }
    }, []);
    const [status, setStatus] = useState('idle'); // idle, submitting, success, error
    const [msg, setMsg] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleProfileChange = (e) => {
        setFormData({
            ...formData,
            profiles: { ...formData.profiles, [e.target.name]: e.target.value }
        });
    };

    const validateUrl = (url, domain) => {
        if (!url) return null;
        return url.includes(domain);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Manual Validation for Mandatory Profiles
        if (!formData.profiles.leetcode || !formData.profiles.github) {
            setMsg('Please provide both LeetCode and GitHub profile URLs.');
            setStatus('error');
            return;
        }

        // Validate other fields (Double check)
        const requiredFields = ['name', 'email', 'password', 'phone', 'college', 'dept', 'regNo'];
        for (const field of requiredFields) {
            if (!formData[field]) {
                setMsg(`Please fill in the ${field} field.`);
                setStatus('error');
                return;
            }
        }

        setStatus('submitting');
        try {
            await axios.post('/students/submit', formData);
            setStatus('success');
            setMsg('Profile Submitted Successfully! Waiting for Admin Verification.');
        } catch (err) {
            setStatus('error');
            setMsg(err.response?.data?.msg || err.message || 'Submission failed');
        }
    };

    if (status === 'success') {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-card p-8 rounded-2xl">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">Success!</h2>
                    <p className="text-slate-700 dark:text-slate-300">{msg}</p>
                    <a href="/status" className="mt-4 inline-block text-blue-500 hover:text-blue-600 dark:hover:text-blue-400">Check Status</a>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-10 px-4 flex justify-center relative bg-white dark:bg-transparent transition-colors duration-300">
            <div className="absolute top-4 left-4 md:top-8 md:left-8 z-50 p-2 rounded-full bg-slate-50 shadow-sm border border-slate-200 dark:border-transparent dark:bg-transparent">
                <ThemeToggle />
            </div>

            <Link to="/" className="absolute top-4 right-4 md:top-8 md:right-8 text-red-600 font-bold dark:text-slate-400 hover:text-red-700 dark:hover:text-white flex items-center gap-2 transition bg-white dark:bg-slate-800/50 px-4 py-2 rounded-xl border border-red-200 dark:border-slate-700/50 z-20 shadow-sm hover:shadow-md">
                Exit to Home
            </Link>

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="glass-card w-full max-w-3xl p-8 rounded-3xl bg-white dark:bg-[#131620] shadow-2xl shadow-slate-200/60 dark:shadow-none border border-slate-100 dark:border-slate-800"
            >
                <h1 className="text-3xl font-extrabold text-center mb-2 text-black dark:text-white">Digital Profile Verification</h1>
                <p className="text-center text-black/80 dark:text-slate-400 mb-8 font-medium">Submit your details for recruitment eligibility.</p>

                {status === 'error' && <div className="bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-200 p-3 rounded mb-4 text-center border border-red-200 dark:border-red-500/30">{msg}</div>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input name="name" placeholder="Full Name *" onChange={handleChange} required className="glass-input p-4 rounded-xl w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-transparent outline-none transition-all shadow-sm" />
                        <input name="email" type="email" placeholder="Email *" onChange={handleChange} required className="glass-input p-4 rounded-xl w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-transparent outline-none transition-all shadow-sm" />
                        <input name="password" type="password" placeholder="Create Password *" onChange={handleChange} required className="glass-input p-4 rounded-xl w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-transparent outline-none transition-all shadow-sm" />
                        <input name="phone" placeholder="Phone Number *" onChange={handleChange} required className="glass-input p-4 rounded-xl w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-transparent outline-none transition-all shadow-sm" />
                        <input name="college" placeholder="College Name *" onChange={handleChange} required className="glass-input p-4 rounded-xl w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-transparent outline-none transition-all shadow-sm" />
                        <input name="dept" placeholder="Department *" onChange={handleChange} required className="glass-input p-4 rounded-xl w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-transparent outline-none transition-all shadow-sm" />
                        <input name="regNo" placeholder="Register Number *" onChange={handleChange} required className="glass-input p-4 rounded-xl w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-transparent outline-none transition-all shadow-sm" />
                    </div>

                    <div className="border-t border-slate-200 dark:border-slate-700 pt-8 mt-4">
                        <h3 className="text-xl font-bold mb-6 text-slate-800 dark:text-white flex items-center gap-2">
                            <span className="w-2 h-6 bg-indigo-500 rounded-full"></span> Coding Profiles
                        </h3>
                        <div className="space-y-4">
                            {['leetcode', 'github', 'hackerrank', 'codechef', 'codeforces', 'linkedin'].map((platform) => (
                                <div className="relative" key={platform}>
                                    <input
                                        name={platform}
                                        placeholder={`${platform.charAt(0).toUpperCase() + platform.slice(1)} Profile URL${(platform === 'leetcode' || platform === 'github') ? ' *' : ''}`}
                                        onChange={handleProfileChange}
                                        required={platform === 'leetcode' || platform === 'github'}
                                        className={`glass-input p-4 rounded-xl w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-transparent outline-none transition-all shadow-sm ${formData.profiles[platform] && !validateUrl(formData.profiles[platform], platform) ? 'border-red-500 dark:border-red-500' : ''
                                            } ${(platform === 'leetcode' || platform === 'github') && !formData.profiles[platform] ? 'border-amber-400 dark:border-amber-500/50' : ''}`}
                                    />
                                    {formData.profiles[platform] && (
                                        <div className="absolute right-3 top-3">
                                            {validateUrl(formData.profiles[platform], platform === 'linkedin' ? 'linkedin.com' : platform) ? (
                                                <CheckCircle className="text-green-400 w-5 h-5" />
                                            ) : (
                                                <XCircle className="text-red-400 w-5 h-5" />
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold text-lg transition shadow-lg shadow-blue-500/30">
                        Submit Profile
                    </button>
                </form>
            </motion.div>
        </div >
    );
};

export default StudentForm;
