import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios';
import { CheckCircle, XCircle, Clock, ExternalLink, User, Book, Hash, Phone, Mail, Award, BarChart2, Github, Code, Terminal, Cpu, Trophy } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';

const StatusPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [student, setStudent] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Leaderboard State
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [leaderboardFilter, setLeaderboardFilter] = useState('LeetCode');
    const [loadingLeaderboard, setLoadingLeaderboard] = useState(true);

    useEffect(() => {
        fetchLeaderboard();
    }, []);

    const fetchLeaderboard = async () => {
        try {
            const res = await axios.get('/students/leaderboard');
            setLeaderboardData(res.data);
        } catch (err) {
            console.error("Failed to fetch leaderboard", err);
        } finally {
            setLoadingLeaderboard(false);
        }
    };

    const getProcessedLeaderboard = () => {
        let data = [...leaderboardData];

        // Filter by platform presence if specific platform selected
        if (leaderboardFilter !== 'Total') {
            const platformKey = leaderboardFilter.toLowerCase();
            data = data.filter(s => s.profiles && s.profiles[platformKey]);
        }

        // Sort by selected metric
        data.sort((a, b) => {
            const metric = leaderboardFilter === 'Total' ? 'total' : leaderboardFilter.toLowerCase();
            const scoreA = a.scores ? a.scores[metric] || 0 : 0;
            const scoreB = b.scores ? b.scores[metric] || 0 : 0;
            return scoreB - scoreA;
        });

        return data;
    };

    const sortedLeaderboard = getProcessedLeaderboard();

    const handleCheck = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setStudent(null);
        try {
            const res = await axios.post('/students/login', { email, password });
            setStudent(res.data);
        } catch (err) {
            setError(err.response?.data?.msg || 'Student not found');
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Verified': return <CheckCircle className="w-12 h-12 text-green-400" />;
            case 'Rejected': return <XCircle className="w-12 h-12 text-red-400" />;
            default: return <Clock className="w-12 h-12 text-orange-400" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Verified': return 'bg-green-500/20 border-green-500/50 text-green-300';
            case 'Rejected': return 'bg-red-500/20 border-red-500/50 text-red-300';
            default: return 'bg-orange-500/20 border-orange-500/50 text-orange-300';
        }
    };

    const handleResubmit = () => {
        // Navigate to registration page with student data
        window.location.href = '/register?edit=true';
        // Store student data in localStorage to retrieve it in the form
        localStorage.setItem('editStudentData', JSON.stringify(student));
    };

    const getProfileIcon = (platform) => {
        switch (platform) {
            case 'leetcode': return <Code className="w-4 h-4" />;
            case 'github': return <Github className="w-4 h-4" />;
            case 'hackerrank': return <Terminal className="w-4 h-4" />;
            case 'codechef': return <Cpu className="w-4 h-4" />;
            case 'codeforces': return <BarChart2 className="w-4 h-4" />;
            default: return <ExternalLink className="w-4 h-4" />;
        }
    };

    return (
        <div className="min-h-screen p-4 md:p-8 flex flex-col items-center relative bg-white dark:bg-transparent transition-colors duration-300">
            {/* Theme Toggle Button */}
            <div className="absolute top-4 left-4 md:top-8 md:left-8 z-50">
                <ThemeToggle />
            </div>

            <Link to="/" className="absolute top-4 right-4 md:top-8 md:right-8 text-red-600 font-bold dark:text-slate-400 hover:text-red-700 dark:hover:text-white flex items-center gap-2 transition bg-white dark:bg-slate-800/50 px-4 py-2 rounded-xl border border-red-200 dark:border-slate-700/50 shadow-sm hover:shadow-md">
                Exit Dashboard
            </Link>
            {/* Search Section */}
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="w-full max-w-xl mb-8"
            >
                <div className="glass-card p-8 rounded-3xl bg-white dark:bg-[#131620] shadow-2xl shadow-indigo-500/10 dark:shadow-none border border-slate-100 dark:border-slate-800">
                    <h1 className="text-3xl font-extrabold mb-4 text-center text-slate-900 dark:text-white">Student Dashboard</h1>
                    <p className="text-center text-slate-600 dark:text-slate-400 mb-8 font-medium">Enter your registered email to view your profile and status.</p>
                    <form onSubmit={handleCheck} className="flex flex-col gap-3">
                        <input
                            type="email"
                            placeholder="student@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="glass-input p-4 rounded-xl w-full bg-slate-50 dark:bg-slate-800 border-slate-200 text-slate-900 dark:text-white placeholder:text-slate-400 focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-transparent outline-none transition-all"
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="glass-input p-4 rounded-xl w-full bg-slate-50 dark:bg-slate-800 border-slate-200 text-slate-900 dark:text-white placeholder:text-slate-400 focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-transparent outline-none transition-all"
                            required
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 mt-2 rounded-xl font-bold transition disabled:opacity-50 w-full shadow-lg shadow-blue-500/30"
                        >
                            {loading ? 'Logging in...' : 'View Status'}
                        </button>
                    </form>
                    {error && <p className="mt-4 text-center text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-500/10 p-2 rounded-lg border border-red-200 dark:border-transparent">{error}</p>}
                </div>
            </motion.div>

            {/* Dashboard Content */}
            {student && (
                <>
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6"
                    >
                        {/* Status Card */}
                        <div className="md:col-span-1">
                            <div className="glass-card p-6 rounded-2xl h-full flex flex-col items-center justify-center text-center space-y-4 bg-white dark:bg-[#131620] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-800">
                                {getStatusIcon(student.status)}
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Application Status</h2>
                                    <div className={`mt-3 px-6 py-2 rounded-full border-2 font-bold ${getStatusColor(student.status)} inline-block`}>
                                        {student.status}
                                    </div>
                                </div>
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                    Last Updated: {new Date(student.submittedAt).toLocaleDateString()}
                                </p>
                                {student.status === 'Rejected' && (
                                    <button
                                        onClick={handleResubmit}
                                        className="mt-4 bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition shadow-lg shadow-slate-900/20 dark:shadow-blue-900/30 flex items-center gap-2"
                                    >
                                        Edit & Resubmit
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Profile Details */}
                        <div className="md:col-span-2 space-y-6">
                            {/* Personal Info */}
                            <div className="glass-card p-8 rounded-3xl bg-white dark:bg-[#131620] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800">
                                <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-900 dark:text-white pb-4 border-b border-slate-100 dark:border-slate-800">
                                    <User className="w-6 h-6 text-blue-500 dark:text-blue-400" /> Personal Details
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="p-4 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-100 dark:border-transparent">
                                        <div className="text-xs font-bold text-slate-400 dark:text-slate-500 mb-1 uppercase tracking-wider">Full Name</div>
                                        <div className="font-bold text-slate-900 dark:text-white text-lg">{student.name}</div>
                                    </div>
                                    <div className="p-4 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-100 dark:border-transparent">
                                        <div className="text-xs font-bold text-slate-400 dark:text-slate-500 mb-1 flex items-center gap-1 uppercase tracking-wider"><Mail className="w-3 h-3" /> Email</div>
                                        <div className="font-semibold break-all text-indigo-600 dark:text-blue-400">{student.email}</div>
                                    </div>
                                    <div className="p-4 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-100 dark:border-transparent">
                                        <div className="text-xs font-bold text-slate-400 dark:text-slate-500 mb-1 flex items-center gap-1 uppercase tracking-wider"><Phone className="w-3 h-3" /> Phone</div>
                                        <div className="font-semibold text-slate-800 dark:text-white">{student.phone}</div>
                                    </div>
                                    <div className="p-4 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-100 dark:border-transparent">
                                        <div className="text-xs font-bold text-slate-400 dark:text-slate-500 mb-1 flex items-center gap-1 uppercase tracking-wider"><Hash className="w-3 h-3" /> Register No</div>
                                        <div className="font-mono font-bold text-slate-900 dark:text-white">{student.regNo}</div>
                                    </div>
                                    <div className="p-4 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-100 dark:border-transparent">
                                        <div className="text-xs font-bold text-slate-400 dark:text-slate-500 mb-1 flex items-center gap-1 uppercase tracking-wider"><Book className="w-3 h-3" /> College</div>
                                        <div className="font-semibold text-slate-800 dark:text-white">{student.college}</div>
                                    </div>
                                    <div className="p-4 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-100 dark:border-transparent">
                                        <div className="text-xs font-bold text-slate-400 dark:text-slate-500 mb-1 flex items-center gap-1 uppercase tracking-wider"><Award className="w-3 h-3" /> Department</div>
                                        <div className="font-semibold text-slate-800 dark:text-white">{student.dept}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Profiles */}
                            <div className="glass-card p-8 rounded-3xl bg-white dark:bg-[#131620] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800">
                                <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-900 dark:text-white pb-4 border-b border-slate-100 dark:border-slate-800">
                                    <ExternalLink className="w-6 h-6 text-purple-500 dark:text-purple-400" /> Coding Profiles
                                </h3>
                                <div className="space-y-3">
                                    {Object.entries(student.profiles).map(([platform, url]) => (
                                        url && (
                                            <div key={platform} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-100 dark:border-transparent group hover:bg-white hover:border-slate-300 dark:hover:bg-slate-800/50 transition">
                                                <span className="capitalize font-bold text-slate-800 dark:text-slate-300 flex items-center gap-2">
                                                    {getProfileIcon(platform)} {platform}
                                                </span>
                                                <a
                                                    href={url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="bg-indigo-50 dark:bg-blue-500/10 text-indigo-700 dark:text-blue-400 hover:bg-indigo-100 hover:text-indigo-800 dark:hover:bg-blue-500/20 px-3 py-1.5 rounded-lg flex items-center gap-1 text-sm font-bold transition"
                                                >
                                                    View <ExternalLink className="w-3 h-3" />
                                                </a>
                                            </div>
                                        )
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                    {/* Public Leaderboard Section */}
                    <div className="w-full max-w-7xl mt-12 mb-16 animate-fade-in-up">
                        <div className="glass-card rounded-2xl overflow-hidden p-6 md:p-8 bg-white dark:bg-[#131620] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-800">
                            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-8 flex items-center gap-3">
                                <Trophy className="text-yellow-500 w-8 h-8" /> Live Leaderboard
                            </h2>

                            {/* Filter Tabs */}
                            <div className="flex flex-wrap gap-3 mb-8">
                                {['LeetCode', 'CodeChef', 'Codeforces', 'GitHub'].map(filter => (
                                    <button
                                        key={filter}
                                        onClick={() => setLeaderboardFilter(filter)}
                                        className={`px-5 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 transition ${leaderboardFilter === filter
                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 translate-y-[-2px]'
                                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white shadow-sm border border-slate-200 dark:border-slate-700/50'
                                            }`}
                                    >
                                        {filter !== 'Total' && getProfileIcon(filter.toLowerCase())}
                                        {filter}
                                    </button>
                                ))}
                            </div>

                            {/* Leaderboard Table */}
                            <div className="overflow-x-auto rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/50">
                                {loadingLeaderboard ? (
                                    <div className="p-8 text-center text-slate-500 dark:text-slate-400">Loading Leaderboard...</div>
                                ) : sortedLeaderboard.length === 0 ? (
                                    <div className="p-8 text-center text-slate-500 dark:text-slate-400">No data available for {leaderboardFilter}</div>
                                ) : (
                                    <table className="w-full text-left">
                                        <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 uppercase text-xs tracking-wider">
                                            <tr>
                                                <th className="p-4 w-16 text-center">Rank</th>
                                                <th className="p-4">Register No</th>
                                                <th className="p-4">Name</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                                            {sortedLeaderboard.slice(0, 50).map((s, index) => (
                                                <tr key={s._id} className="hover:bg-slate-100 dark:hover:bg-slate-800/30 transition">
                                                    <td className="p-4 text-center font-bold text-slate-500">
                                                        {index + 1 <= 3 ? (
                                                            <span className={`flex items-center justify-center w-8 h-8 rounded-full ${index === 0 ? 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-500' :
                                                                index === 1 ? 'bg-slate-200 dark:bg-slate-400/20 text-slate-600 dark:text-slate-300' :
                                                                    'bg-orange-100 dark:bg-orange-700/20 text-orange-600 dark:text-orange-400'
                                                                }`}>
                                                                #{index + 1}
                                                            </span>
                                                        ) : (
                                                            `#${index + 1}`
                                                        )}
                                                    </td>
                                                    <td className="p-4 font-mono text-slate-700 dark:text-slate-300">{s.regNo}</td>
                                                    <td className="p-4 font-semibold text-slate-900 dark:text-white">{s.name}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default StatusPage;
