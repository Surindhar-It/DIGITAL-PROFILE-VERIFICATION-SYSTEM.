import { useState } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, AreaChart, Area } from 'recharts';
import { Search, Code, Github, Terminal, Cpu, BarChart2, Star, TrendingUp, Award, User } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const StudentAnalysis = ({ students }) => {
    const [searchRegNo, setSearchRegNo] = useState('');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [error, setError] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        if (!searchRegNo.trim()) {
            setError('Please enter a Registration Number.');
            setSelectedStudent(null);
            return;
        }
        const student = students.find(s => s.regNo.toLowerCase() === searchRegNo.toLowerCase().trim());
        if (student) {
            setSelectedStudent(student);
            setError('');
        } else {
            setSelectedStudent(null);
            setError('No student found with this Registration Number.');
        }
    };

    const radarData = selectedStudent ? [
        { subject: 'LeetCode', score: selectedStudent.scores?.leetcode || 0, fullMark: 100 },
        { subject: 'CodeChef', score: selectedStudent.scores?.codechef || 0, fullMark: 100 },
        { subject: 'CodeForces', score: selectedStudent.scores?.codeforces || 0, fullMark: 100 },
        { subject: 'HackerRank', score: selectedStudent.scores?.hackerrank || 0, fullMark: 100 },
        { subject: 'GitHub', score: selectedStudent.scores?.github || 0, fullMark: 100 },
    ] : [];

    // Detailed Stats for Bar Chart
    const statsData = selectedStudent ? [
        { name: 'LeetCode', Solved: selectedStudent.leetcodeStats?.total || 0, Rating: 0, Extra: selectedStudent.leetcodeStats?.medium || 0 },
        { name: 'CodeChef', Solved: selectedStudent.codechefStats?.problemsSolved || 0, Rating: selectedStudent.codechefStats?.rating || 0, Extra: 0 },
        { name: 'CodeForces', Solved: 0, Rating: selectedStudent.codeforcesStats?.rating || 0, Extra: 0 },
        { name: 'HackerRank', Solved: selectedStudent.hackerrankStats?.badges || 0, Rating: 0, Extra: 0 },
        { name: 'GitHub', Solved: selectedStudent.githubStats?.public_repos || 0, Rating: 0, Extra: selectedStudent.githubStats?.followers || 0 },
    ] : [];

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-green-500';
        if (score >= 60) return 'text-blue-500';
        if (score >= 40) return 'text-yellow-500';
        return 'text-red-500';
    };

    return (
        <div className="space-y-8 animate-fade-in-up">
            {/* Search Section */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800">
                <div className="max-w-2xl mx-auto text-center space-y-4">
                    <div className="inline-flex items-center justify-center p-3 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl mb-2">
                        <Search className="w-8 h-8" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                        Student Analysis Center
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 font-medium">
                        Enter a student's Registration Number to view their comprehensive coding profile and analytics.
                    </p>
                    <form onSubmit={handleSearch} className="relative flex items-center mt-6">
                        <input
                            type="text"
                            placeholder="e.g., 2021BTECS001"
                            value={searchRegNo}
                            onChange={(e) => setSearchRegNo(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-800/80 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-2xl pl-6 pr-32 py-4 text-lg focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all font-semibold shadow-inner"
                        />
                        <button
                            type="submit"
                            className="absolute right-2 top-2 bottom-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 rounded-xl font-bold transition shadow-lg shadow-indigo-500/30 flex items-center gap-2"
                        >
                            <Search className="w-5 h-5" />
                            Analyze
                        </button>
                    </form>
                    {error && (
                        <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 dark:text-red-400 font-semibold mt-4 text-sm bg-red-50 dark:bg-red-500/10 py-2 px-4 rounded-lg inline-block">
                            {error}
                        </motion.p>
                    )}
                </div>
            </div>

            {/* Results Section */}
            {selectedStudent && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
                    
                    {/* Header Card */}
                    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mx-10 -my-10 border border-white/20"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-2xl border border-black/10"></div>
                        
                        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
                            <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border-4 border-white/30 shadow-xl">
                                <User className="w-12 h-12 text-white" />
                            </div>
                            <div className="text-center md:text-left flex-1">
                                <h1 className="text-4xl font-extrabold mb-2 tracking-tight">{selectedStudent.name}</h1>
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-indigo-100 font-medium">
                                    <span className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm border border-white/10"><Code size={16} /> {selectedStudent.regNo}</span>
                                    <span className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm border border-white/10"><Cpu size={16} /> {selectedStudent.dept}</span>
                                    <span className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm border border-white/10"><Award size={16} /> {selectedStudent.college}</span>
                                </div>
                            </div>
                            <div className="text-center bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl shadow-xl min-w-[150px]">
                                <div className="text-indigo-100 text-sm font-bold uppercase tracking-wider mb-1">Total Score</div>
                                <div className="text-5xl font-black text-white">{selectedStudent.scores?.total || 0}</div>
                            </div>
                        </div>
                    </div>

                    {/* Charts Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Radar Chart */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                                <Star className="text-yellow-500" /> Platform Mastery Breakdown
                            </h3>
                            <div className="h-[350px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                        <PolarGrid stroke="#64748b" strokeOpacity={0.2} />
                                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontWeight: 600 }} />
                                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#94a3b8' }} />
                                        <Radar name={selectedStudent.name} dataKey="score" stroke="#6366f1" strokeWidth={3} fill="#818cf8" fillOpacity={0.4} />
                                        <Tooltip 
                                            contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: 'none', borderRadius: '12px', color: '#fff', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                            itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                                        />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Bar Chart */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                                <TrendingUp className="text-green-500" /> Activity Insights
                            </h3>
                            <div className="h-[350px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={statsData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#64748b" strokeOpacity={0.1} vertical={false} />
                                        <XAxis dataKey="name" tick={{ fill: '#64748b', fontWeight: 600 }} axisLine={false} tickLine={false} />
                                        <YAxis tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
                                        <Tooltip 
                                            cursor={{ fill: '#64748b', opacity: 0.1 }}
                                            contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: 'none', borderRadius: '12px', color: '#fff', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                        />
                                        <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                        <Bar dataKey="Solved" fill="#8b5cf6" radius={[6, 6, 0, 0]} name="Solved/Repos/Badges" />
                                        <Bar dataKey="Rating" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Rating (CF/CC)" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Detailed Score Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {[
                            { label: 'LeetCode', score: selectedStudent.scores?.leetcode, icon: Code, color: 'text-yellow-600', bg: 'bg-yellow-100 dark:bg-yellow-900/20' },
                            { label: 'CodeChef', score: selectedStudent.scores?.codechef, icon: Cpu, color: 'text-orange-600', bg: 'bg-orange-100 dark:bg-orange-900/20' },
                            { label: 'Codeforces', score: selectedStudent.scores?.codeforces, icon: BarChart2, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/20' },
                            { label: 'HackerRank', score: selectedStudent.scores?.hackerrank, icon: Terminal, color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/20' },
                            { label: 'GitHub', score: selectedStudent.scores?.github, icon: Github, color: 'text-slate-800 dark:text-slate-200', bg: 'bg-slate-200 dark:bg-slate-800' },
                        ].map((platform, i) => (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}
                                key={platform.label} 
                                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-lg flex flex-col items-center justify-center text-center gap-2 hover:-translate-y-1 transition-transform"
                            >
                                <div className={`p-3 rounded-full ${platform.bg}`}>
                                    <platform.icon className={`w-6 h-6 ${platform.color}`} />
                                </div>
                                <div className="text-sm font-bold text-slate-500 dark:text-slate-400">{platform.label}</div>
                                <div className={`text-2xl font-black ${getScoreColor(platform.score || 0)}`}>
                                    {platform.score || 0}
                                </div>
                                <div className="text-xs font-semibold text-slate-400">Score Out of 100</div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default StudentAnalysis;
