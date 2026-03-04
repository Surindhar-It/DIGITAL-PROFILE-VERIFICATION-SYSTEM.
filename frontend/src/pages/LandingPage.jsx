import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';

const LandingPage = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#0B0F19]">
            <motion.div
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="z-10 text-center max-w-4xl w-full"
            >
                {/* Logo & Title */}
                <div className="mb-12">
                    <div className="mx-auto w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20">
                        <ShieldCheck className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                        Digital Profile Verification System

                    </h1>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                        Secure Recruitment Verification Portal for Students and Administrators
                    </p>
                </div>

                {/* Cards Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                    {/* Student Card */}
                    <div className="bg-[#131620] border border-slate-800 p-8 rounded-2xl hover:border-blue-500/30 transition duration-300 text-left flex flex-col h-full">
                        <h3 className="text-xl font-bold text-white mb-2">Student Portal</h3>
                        <p className="text-slate-400 mb-8 text-sm flex-grow">Submit your profile details or check your current verification status.</p>

                        <div className="flex flex-col gap-3 mt-auto">
                            <Link to="/register" className="w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-3 rounded-xl text-sm font-semibold transition shadow-lg shadow-blue-600/10">
                                New Registration
                            </Link>
                            <Link to="/status" className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 text-center py-3 rounded-xl text-sm font-semibold transition border border-slate-700">
                                Check Status
                            </Link>
                        </div>
                    </div>

                    {/* Admin Card */}
                    <div className="bg-[#131620] border border-slate-800 p-8 rounded-2xl hover:border-blue-500/30 transition duration-300 text-left flex flex-col h-full">
                        <h3 className="text-xl font-bold text-white mb-2">Admin Portal</h3>
                        <p className="text-slate-400 mb-8 text-sm flex-grow">Restricted access for recruitment officers to verify submissions.</p>

                        <div className="flex flex-col gap-3 mt-auto">
                            <Link to="/admin" className="w-full bg-white text-slate-900 hover:bg-slate-100 text-center py-3 rounded-xl text-sm font-bold transition shadow-lg">
                                Login as Admin
                            </Link>
                            <div className="py-3 hidden md:block"></div> {/* Spacer to match height */}
                        </div>
                    </div>
                </div>

                <div className="mt-16 text-slate-500 text-sm">
                    &copy; 2026 Verification System. All rights reserved.
                </div>
            </motion.div>
        </div>
    );
};

export default LandingPage;
