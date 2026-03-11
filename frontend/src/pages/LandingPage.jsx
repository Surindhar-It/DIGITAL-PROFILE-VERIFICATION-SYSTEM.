import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

import ThemeToggle from '../components/ThemeToggle';

const LandingPage = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-white dark:bg-[#0B0F19] transition-colors duration-300">
            {/* Theme Toggle Button */}
            <div className="absolute top-4 right-4 md:top-8 md:right-8 z-50">
                <ThemeToggle />
            </div>

            <motion.div
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="z-10 text-center max-w-4xl w-full"
            >
                {/* Logo & Title */}
                <div className="mb-12">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-indigo-500/20 dark:shadow-blue-500/30">
                        <ShieldCheck className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight transition-colors">
                        Digital Profile Verification System
                    </h1>
                    <p className="text-slate-600 dark:text-slate-300 text-lg max-w-2xl mx-auto transition-colors font-medium">
                        Secure Recruitment Verification Portal for Students and Administrators
                    </p>
                </div>

                {/* Cards Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                    {/* Student Card */}
                    <div className="bg-white dark:bg-[#131620] border border-indigo-100 dark:border-slate-800 shadow-xl shadow-indigo-100 dark:shadow-none p-8 rounded-2xl hover:border-indigo-300 dark:hover:border-blue-500/50 transition duration-300 text-left flex flex-col h-full relative overflow-hidden group">
                        <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2 transition-colors relative z-10">Student Portal</h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-8 text-base flex-grow transition-colors relative z-10 font-medium">Submit your profile details or check your current verification status.</p>

                        <div className="flex flex-col gap-3 mt-auto relative z-10">
                            <Link to="/register" className="w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-3.5 rounded-xl text-base font-bold transition shadow-lg shadow-blue-500/20">
                                New Registration
                            </Link>
                            <Link to="/status" className="w-full bg-indigo-50 hover:bg-indigo-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-indigo-900 dark:text-slate-200 text-center py-3.5 rounded-xl text-base font-bold transition border border-indigo-200 dark:border-slate-700">
                                Check Status
                            </Link>
                        </div>
                    </div>

                    {/* Admin Card */}
                    <div className="bg-white dark:bg-[#131620] border border-indigo-100 dark:border-slate-800 shadow-xl shadow-indigo-100 dark:shadow-none p-8 rounded-2xl hover:border-indigo-300 dark:hover:border-blue-500/50 transition duration-300 text-left flex flex-col h-full relative overflow-hidden group">
                        <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2 transition-colors relative z-10">Admin Portal</h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-8 text-base flex-grow transition-colors relative z-10 font-medium">Restricted access for recruitment officers to verify submissions.</p>

                        <div className="flex flex-col gap-3 mt-auto relative z-10">
                            <Link to="/admin" className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 text-center py-3.5 rounded-xl text-base font-extrabold transition shadow-lg shadow-slate-900/20 dark:shadow-white/20">
                                Login as Admin
                            </Link>
                            <div className="py-3.5 hidden md:block"></div> {/* Spacer to match height */}
                        </div>
                    </div>
                </div>

                <div className="mt-16 text-slate-500 dark:text-slate-500 text-sm transition-colors">
                    &copy; 2026 Verification System. All rights reserved.
                </div>
            </motion.div>
        </div>
    );
};

export default LandingPage;
