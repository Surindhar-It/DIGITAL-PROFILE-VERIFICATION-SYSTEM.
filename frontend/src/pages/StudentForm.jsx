import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';

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
                    <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Success!</h2>
                    <p>{msg}</p>
                    <a href="/status" className="mt-4 inline-block text-blue-400 hover:text-blue-300">Check Status</a>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-10 px-4 flex justify-center relative">
            <Link to="/" className="absolute top-4 right-4 md:top-8 md:right-8 text-slate-400 hover:text-white flex items-center gap-2 transition bg-slate-800/50 px-4 py-2 rounded-lg border border-slate-700/50 z-20">
                Exit to Home
            </Link>
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="glass-card w-full max-w-3xl p-8 rounded-2xl"
            >
                <h1 className="text-3xl font-bold text-center mb-2 text-white">Digital Profile Verification</h1>
                <p className="text-center text-slate-400 mb-8">Submit your details for recruitment eligibility.</p>

                {status === 'error' && <div className="bg-red-500/20 text-red-200 p-3 rounded mb-4 text-center">{msg}</div>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input name="name" placeholder="Full Name *" onChange={handleChange} required className="glass-input p-3 rounded-lg w-full" />
                        <input name="email" type="email" placeholder="Email *" onChange={handleChange} required className="glass-input p-3 rounded-lg w-full" />
                        <input name="password" type="password" placeholder="Create Password *" onChange={handleChange} required className="glass-input p-3 rounded-lg w-full" />
                        <input name="phone" placeholder="Phone Number *" onChange={handleChange} required className="glass-input p-3 rounded-lg w-full" />
                        <input name="college" placeholder="College Name *" onChange={handleChange} required className="glass-input p-3 rounded-lg w-full" />
                        <input name="dept" placeholder="Department *" onChange={handleChange} required className="glass-input p-3 rounded-lg w-full" />
                        <input name="regNo" placeholder="Register Number *" onChange={handleChange} required className="glass-input p-3 rounded-lg w-full" />
                    </div>

                    <div className="border-t border-slate-700 pt-6">
                        <h3 className="text-xl font-semibold mb-4">Coding Profiles</h3>
                        <div className="space-y-4">
                            {['leetcode', 'github', 'hackerrank', 'codechef', 'codeforces', 'linkedin'].map((platform) => (
                                <div className="relative">
                                    <input
                                        name={platform}
                                        placeholder={`${platform.charAt(0).toUpperCase() + platform.slice(1)} Profile URL${(platform === 'leetcode' || platform === 'github') ? ' *' : ''}`}
                                        onChange={handleProfileChange}
                                        required={platform === 'leetcode' || platform === 'github'}
                                        className={`glass-input p-3 rounded-lg w-full ${formData.profiles[platform] && !validateUrl(formData.profiles[platform], platform) ? 'border-red-500' : ''
                                            } ${(platform === 'leetcode' || platform === 'github') && !formData.profiles[platform] ? 'border-amber-500/50' : ''}`}
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

                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-xl font-bold text-lg transition shadow-lg shadow-blue-900/20">
                        Submit Profile
                    </button>
                </form>
            </motion.div>
        </div >
    );
};

export default StudentForm;
