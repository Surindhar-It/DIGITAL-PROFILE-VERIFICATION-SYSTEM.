import { useEffect, useState } from 'react';
import axios from '../api/axios';
import * as XLSX from 'xlsx';
import { Github, Linkedin, Code, Terminal, Cpu, ExternalLink, BarChart2, ChevronDown, Info, X } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';

const StudentDetailsModal = ({ student, onClose }) => {
    if (!student) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/20 dark:bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl dark:shadow-slate-900/50 animate-fade-in-up">
                {/* Header */}
                <div className="sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 p-6 flex justify-between items-center z-10">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <span className="bg-blue-600 w-2 h-8 rounded-full"></span>
                        {student.name}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Personal Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Name</label>
                            <div className="text-slate-800 dark:text-slate-200 font-bold text-lg">{student.name}</div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Main ID (Email)</label>
                            <div className="text-slate-700 dark:text-slate-200">{student.email}</div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Department</label>
                            <div className="text-slate-700 dark:text-slate-200">{student.dept}</div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs text-slate-500 uppercase tracking-wider font-semibold">College</label>
                            <div className="text-slate-700 dark:text-slate-200">{student.college}</div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Register Number</label>
                            <div className="text-slate-700 dark:text-slate-200 font-mono">{student.regNo}</div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Phone Number</label>
                            <div className="text-slate-700 dark:text-slate-200">{student.phone}</div>
                        </div>
                    </div>

                    {/* Stats Section */}
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 border-l-4 border-purple-500 pl-3">Coding Statistics</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {/* LeetCode */}
                            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm dark:shadow-none">
                                <div className="flex items-center gap-2 mb-2 text-yellow-600 dark:text-yellow-500 font-bold"><Code size={18} /> LeetCode</div>
                                <div className="space-y-1 text-sm">
                                    <div className="flex justify-between"><span>Easy:</span> <span className="text-green-600 dark:text-green-400 font-mono">{student.leetcodeStats?.easy || 0}</span></div>
                                    <div className="flex justify-between"><span>Medium:</span> <span className="text-amber-600 dark:text-amber-400 font-mono">{student.leetcodeStats?.medium || 0}</span></div>
                                    <div className="flex justify-between"><span>Hard:</span> <span className="text-red-600 dark:text-red-400 font-mono">{student.leetcodeStats?.hard || 0}</span></div>
                                    <div className="border-t border-slate-200 dark:border-slate-700 pt-1 mt-1 flex justify-between font-bold text-slate-900 dark:text-white"><span>Total:</span> <span>{student.leetcodeStats?.total || 0}</span></div>
                                </div>
                            </div>
                            {/* CodeForces */}
                            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm dark:shadow-none">
                                <div className="flex items-center gap-2 mb-2 text-blue-600 dark:text-blue-400 font-bold"><BarChart2 size={18} /> Codeforces</div>
                                <div className="space-y-1 text-sm">
                                    <div className="flex justify-between"><span>Solved:</span> <span className="text-slate-900 dark:text-white font-mono">{student.codeforcesStats?.solved || 0}</span></div>
                                    <div className="flex justify-between"><span>Rating:</span> <span className="text-yellow-600 dark:text-yellow-400 font-mono">{student.codeforcesStats?.rating || 'N/A'}</span></div>
                                </div>
                            </div>
                            {/* CodeChef */}
                            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm dark:shadow-none">
                                <div className="flex items-center gap-2 mb-2 text-orange-600 dark:text-orange-500 font-bold"><Cpu size={18} /> CodeChef</div>
                                <div className="space-y-1 text-sm">
                                    <div className="flex justify-between"><span>Rating:</span> <span className="text-orange-600 dark:text-orange-400 font-mono font-bold">{student.codechefStats?.rating || 'N/A'}</span></div>
                                    <div className="flex justify-between"><span>Global Rank:</span> <span className="text-slate-600 dark:text-slate-300 font-mono">#{student.codechefStats?.globalRank || 'N/A'}</span></div>
                                    <div className="flex justify-between"><span>Stars:</span> <span className="text-yellow-600 dark:text-yellow-400 font-mono">{student.codechefStats?.stars || 0}★</span></div>
                                </div>
                            </div>
                            {/* GitHub */}
                            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm dark:shadow-none">
                                <div className="flex items-center gap-2 mb-2 text-slate-900 dark:text-white font-bold"><Github size={18} /> GitHub</div>
                                <div className="space-y-1 text-sm">
                                    <div className="flex justify-between"><span>Repos:</span> <span className="text-slate-900 dark:text-white font-mono">{student.githubStats?.public_repos || 0}</span></div>
                                    <div className="flex justify-between"><span>Followers:</span> <span className="text-slate-900 dark:text-white font-mono">{student.githubStats?.followers || 0}</span></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Profiles Links */}
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 border-l-4 border-blue-500 pl-3">Profile Links</h3>
                        <div className="flex flex-wrap gap-3">
                            {Object.entries(student.profiles || {}).map(([key, url]) => (
                                url && (
                                    <a key={key} href={url} target="_blank" rel="noreferrer"
                                        className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg transition text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white capitalize">
                                        <ExternalLink size={14} /> {key}
                                    </a>
                                )
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const AdminDashboard = () => {
    const [students, setStudents] = useState([]);
    const [filter, setFilter] = useState('Verified');
    const [selectedIds, setSelectedIds] = useState([]);
    const [leaderboardFilter, setLeaderboardFilter] = useState('LeetCode');
    const [customExportLimit, setCustomExportLimit] = useState('');

    const [showExportOptions, setShowExportOptions] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);

    // Hardcoded Mock Data for Leaderboard (Frontend Only)

    // ...



    const getProcessedStudents = () => {
        // Use Real Data for Leaderboard
        let baseData = students;

        if (filter === 'Leaderboard') {
            // Filter by status 'Verified'
            let processed = baseData.filter(s => s.status === 'Verified');

            // Filter by platform presence if specific platform selected
            if (leaderboardFilter !== 'Total') {
                const platformKey = leaderboardFilter.toLowerCase();
                processed = processed.filter(s => s.profiles && s.profiles[platformKey]);
            }

            // Sort by selected metric (Safe Access)
            processed.sort((a, b) => {
                const metric = leaderboardFilter === 'Total' ? 'total' : leaderboardFilter.toLowerCase();
                const scoreA = a.scores ? a.scores[metric] || 0 : 0;
                const scoreB = b.scores ? b.scores[metric] || 0 : 0;
                return scoreB - scoreA;
            });

            return processed;
        }

        // Standard filtering for other views
        return filter === 'All' ? students : students.filter(s => filter === 'All' ? true : s.status === filter);
    };

    const filteredStudents = getProcessedStudents();

    const fetchStudents = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('/students', { headers: { 'x-auth-token': token } });
            setStudents(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchStudents();
        const interval = setInterval(fetchStudents, 5000); // Auto-refresh every 5 seconds
        return () => clearInterval(interval);
    }, []);

    const handleVerify = async (id, status) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`/students/verify/${id}`, { status }, { headers: { 'x-auth-token': token } });
            fetchStudents();
        } catch (err) {
            console.error(err);
        }
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedIds(filteredStudents.map(s => s._id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelect = (id) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(sid => sid !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const handleBulkAction = async (actionStatus) => {
        if (selectedIds.length === 0) return;
        if (!window.confirm(`Are you sure you want to mark ${selectedIds.length} students as ${actionStatus}?`)) return;

        try {
            const token = localStorage.getItem('token');
            await Promise.all(selectedIds.map(id => axios.put(`/students/verify/${id}`, { status: actionStatus }, {
                headers: { 'x-auth-token': token }
            })));
            setStudents(students.map(s => selectedIds.includes(s._id) ? { ...s, status: actionStatus } : s));
            setSelectedIds([]);
            fetchStudents(); // Re-fetch to ensure data consistency
        } catch (error) {
            console.error("Bulk action failed", error);
            alert('Bulk action failed');
        }
    };

    const handleBulkDelete = async () => {
        if (selectedIds.length === 0) return;
        if (!window.confirm(`Are you sure you want to PERMANENTLY DELETE ${selectedIds.length} students? This action cannot be undone.`)) return;

        try {
            const token = localStorage.getItem('token');
            await axios.post('/students/bulk-delete', { ids: selectedIds }, {
                headers: { 'x-auth-token': token }
            });
            setStudents(students.filter(s => !selectedIds.includes(s._id)));
            setSelectedIds([]);
            fetchStudents(); // Re-fetch to ensure data consistency
        } catch (error) {
            console.error("Bulk delete failed", error);
            alert("Bulk delete failed");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this student record? This action cannot be undone.')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`/students/${id}`, { headers: { 'x-auth-token': token } });
                fetchStudents();
            } catch (err) {
                console.error(err);
                alert('Failed to delete student');
            }
        }
    };

    const handleCustomExport = (limit) => {
        const dataToExport = (limit === 'All' ? filteredStudents : filteredStudents.slice(0, limit)).map((s, index) => ({
            Rank: index + 1,
            Name: s.name,
            'Register Number': s.regNo,
            College: s.college,
            'Profile Filter': leaderboardFilter,
            'Score': leaderboardFilter === 'Total' ? (s.scores?.total || 0) : (s.scores ? s.scores[leaderboardFilter.toLowerCase()] || 'N/A' : 'N/A'),
            'Profile URL': leaderboardFilter === 'Total' ? 'N/A' : (s.profiles ? s.profiles[leaderboardFilter.toLowerCase()] || 'N/A' : 'N/A')
        }));

        const ws = XLSX.utils.json_to_sheet(dataToExport);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const fileName = `Leaderboard_${leaderboardFilter}_Top_${limit}`;
        XLSX.writeFile(wb, fileName + '.xlsx');
        setShowExportOptions(false);
    };

    const exportToExcel = () => {
        const fileExtension = '.xlsx';
        const fileName = 'student_data_export';

        const dataToExport = filteredStudents.map(s => ({
            Name: s.name,
            Email: s.email,
            Phone: s.phone,
            College: s.college,
            Department: s.dept,
            RegisterNo: s.regNo,
            Status: s.status,
            SubmittedAt: new Date(s.submittedAt).toLocaleDateString(),
            ...(s.scores && {
                'Total Score': s.scores.total,
                'LeetCode Score': s.scores.leetcode,
                'CodeChef Score': s.scores.codechef,
                'Codeforces Score': s.scores.codeforces,
            })
        }));

        const ws = XLSX.utils.json_to_sheet(dataToExport);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        XLSX.writeFile(wb, fileName + fileExtension);
    };

    const getProfileIcon = (platform) => {
        switch (platform) {
            case 'leetcode': return <Code className="w-5 h-5" />;
            case 'github': return <Github className="w-5 h-5" />;
            case 'hackerrank': return <Terminal className="w-5 h-5" />;
            case 'codechef': return <Cpu className="w-5 h-5" />;
            case 'codeforces': return <BarChart2 className="w-5 h-5" />;
            case 'linkedin': return <Linkedin className="w-5 h-5" />;
            default: return <ExternalLink className="w-5 h-5" />; // Fallback
        }
    };

    return (
        <div className="min-h-screen p-8 bg-white dark:bg-transparent transition-colors duration-300">
            <div className="max-w-7xl mx-auto space-y-8">
                <header className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
                        <ThemeToggle />
                    </div>
                    <div className="flex gap-4">
                        {selectedIds.length > 0 && filter !== 'Leaderboard' && (
                            <div className="flex gap-2">
                                <button onClick={() => handleBulkAction('Verified')} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition shadow-lg shadow-blue-900/20">
                                    Verify Selected ({selectedIds.length})
                                </button>
                                <button onClick={() => handleBulkAction('Rejected')} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition shadow-lg shadow-red-900/20">
                                    Reject Selected ({selectedIds.length})
                                </button>
                                <button onClick={handleBulkDelete} className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition shadow-lg shadow-slate-900/20">
                                    Delete Selected ({selectedIds.length})
                                </button>
                            </div>
                        )}
                        <div className="relative">
                            <button
                                onClick={() => filter === 'Leaderboard' ? setShowExportOptions(!showExportOptions) : exportToExcel()}
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition shadow-lg shadow-green-900/20"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                {filter === 'Leaderboard' ? 'Download Report' : 'Export Excel'}
                                {filter === 'Leaderboard' && <ChevronDown className="w-4 h-4 ml-1" />}
                            </button>

                            {/* Dropdown Menu */}
                            {showExportOptions && filter === 'Leaderboard' && (
                                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden p-2">
                                    <div className="mb-2 px-2">
                                        <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Custom Range</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="number"
                                                min="1"
                                                placeholder="Top X"
                                                value={customExportLimit}
                                                onChange={(e) => setCustomExportLimit(e.target.value)}
                                                className="w-full bg-slate-50 border border-slate-200 dark:bg-slate-900 dark:border-slate-600 rounded px-3 py-1 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 dark:focus:border-blue-500 transition-all shadow-sm"
                                            />
                                            <button
                                                onClick={() => handleCustomExport(customExportLimit || 'All')}
                                                disabled={!customExportLimit}
                                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Go
                                            </button>
                                        </div>
                                    </div>
                                    <div className="border-t border-slate-200 dark:border-slate-700 my-1"></div>
                                    <button onClick={() => handleCustomExport(10)} className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition rounded">Top 10</button>
                                    <button onClick={() => handleCustomExport(20)} className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition rounded">Top 20</button>
                                    <button onClick={() => handleCustomExport(50)} className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition rounded">Top 50</button>
                                    <div className="border-t border-slate-200 dark:border-slate-700 my-1"></div>
                                    <button onClick={() => handleCustomExport('All')} className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition rounded">Download All</button>
                                </div>
                            )}
                        </div>
                        <button onClick={() => { localStorage.removeItem('token'); window.location.href = '/admin'; }} className="bg-red-50 dark:bg-red-500/20 text-red-700 dark:text-red-300 px-4 py-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-500/30 border border-red-200 dark:border-red-500/30 transition font-semibold">Logout</button>
                    </div>
                </header>

                <div className="space-y-4 mb-6">
                    <div className="flex space-x-4">
                        {['All', 'Pending', 'Verified', 'Rejected', 'Leaderboard'].map(status => {
                            let count = 0;
                            if (status === 'All') count = students.length;
                            else if (status === 'Leaderboard') count = students.filter(s => s.status === 'Verified').length;
                            else count = students.filter(s => s.status === status).length;

                            return (
                                <button
                                    key={status}
                                    onClick={() => setFilter(status)}
                                    className={`px-5 py-2.5 rounded-xl transition font-bold shadow-sm ${filter === status ? 'bg-indigo-600 text-white shadow-indigo-500/30 ring-2 ring-indigo-600 ring-offset-2 ring-offset-white dark:ring-offset-[#131620]' : 'bg-white dark:bg-[#1e293b] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-indigo-600 hover:border-indigo-300'}`}
                                >
                                    {status} ({count})
                                </button>
                            );
                        })}
                    </div>

                    {filter === 'Leaderboard' && (
                        <div className="flex space-x-2 animate-fade-in-down">
                            {['LeetCode', 'CodeChef', 'Codeforces', 'GitHub'].map(subFilter => (
                                <button
                                    key={subFilter}
                                    onClick={() => setLeaderboardFilter(subFilter)}
                                    className={`px-5 py-2.5 text-sm rounded-xl font-bold transition flex items-center gap-2 shadow-sm ${leaderboardFilter === subFilter
                                        ? 'bg-purple-600 text-white shadow-purple-900/40 ring-2 ring-purple-600 ring-offset-2 ring-offset-white dark:ring-offset-[#131620]'
                                        : 'bg-white dark:bg-[#1e293b] text-slate-700 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:text-purple-700 dark:hover:text-white hover:border-purple-300 dark:hover:border-slate-500 hover:bg-slate-50'}`}
                                >
                                    {subFilter !== 'Total' && getProfileIcon(subFilter.toLowerCase())}
                                    {subFilter}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="glass-card rounded-3xl overflow-hidden overflow-x-auto bg-white dark:bg-[#131620] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 dark:bg-[#1e293b] text-slate-800 font-bold dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                            <tr>
                                {filter === 'Leaderboard' ? (
                                    <>
                                        {leaderboardFilter !== 'GitHub' && <th className="p-4 w-16">Rank</th>}
                                        {leaderboardFilter === 'GitHub' && <th className="p-4 w-16">S/No</th>}
                                        <th className="p-4">Register No</th>
                                        <th className="p-4">Name</th>
                                        {leaderboardFilter === 'LeetCode' ? (
                                            <>
                                                <th className="p-4 text-center">Profile Link</th>
                                                <th className="p-4 text-center text-green-400">Easy</th>
                                                <th className="p-4 text-center text-amber-400">Medium</th>
                                                <th className="p-4 text-center text-red-400">Hard</th>
                                                <th className="p-4 text-center">Total Solved</th>
                                            </>
                                        ) : leaderboardFilter === 'Codeforces' ? (
                                            <>
                                                <th className="p-4 text-center">Profile Link</th>
                                                <th className="p-4 text-center">Problems Solved</th>
                                                <th className="p-4 text-center">Rating</th>
                                            </>
                                        ) : leaderboardFilter === 'CodeChef' ? (
                                            <>
                                                <th className="p-4 text-center">Profile Link</th>
                                                <th className="p-4 text-center">No of Contests</th>
                                                <th className="p-4 text-center">Rating</th>
                                            </>
                                        ) : (
                                            <>
                                                <th className="p-4 text-center">Profile Link</th>
                                                <th className="p-4 text-center">{leaderboardFilter === 'GitHub' ? 'Projects/Repos' : `${leaderboardFilter} Score`}</th>
                                            </>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        {['All', 'Pending'].includes(filter) && (
                                            <th className="p-4 w-12">
                                                <input
                                                    type="checkbox"
                                                    onChange={handleSelectAll}
                                                    checked={filteredStudents.length > 0 && selectedIds.length === filteredStudents.length}
                                                    className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-indigo-600 focus:ring-indigo-500 transition-shadow shadow-sm"
                                                />
                                            </th>
                                        )}
                                        <th className="p-4 w-12">#</th>
                                        <th className="p-4">Register No</th>
                                        <th className="p-4">Name</th>
                                        <th className="p-4">College</th>
                                        <th className="p-4">Profiles</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4">Actions</th>
                                    </>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStudents.map((student, index) => {
                                const displayIndex = index + 1;

                                return (
                                    <motion.tr
                                        key={student._id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className={`border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 ${selectedIds.includes(student._id) ? 'bg-blue-50 dark:bg-blue-900/10' : ''}`}
                                    >
                                        {filter === 'Leaderboard' ? (
                                            <>
                                                {leaderboardFilter !== 'GitHub' && <td className="p-4 font-bold text-lg text-slate-800 dark:text-slate-500">#{displayIndex}</td>}
                                                {leaderboardFilter === 'GitHub' && <td className="p-4 font-mono text-slate-700 dark:text-slate-400">{displayIndex}</td>}

                                                <td className="p-4 text-slate-800 font-semibold dark:text-slate-300 font-mono">{student.regNo}</td>
                                                <td className="p-4">
                                                    <div className="font-bold text-slate-900 dark:text-white">{student.name}</div>
                                                    <div className="text-sm font-medium text-slate-600 dark:text-slate-400">{student.college}</div>
                                                </td>

                                                {leaderboardFilter === 'LeetCode' ? (
                                                    <>
                                                        <td className="p-4 text-center">
                                                            <a href={student.profiles.leetcode} target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline">View Profile</a>
                                                        </td>
                                                        <td className="p-4 text-center font-mono text-green-600 dark:text-green-400">{student.leetcodeStats?.easy || 0}</td>
                                                        <td className="p-4 text-center font-mono text-amber-600 dark:text-amber-400">{student.leetcodeStats?.medium || 0}</td>
                                                        <td className="p-4 text-center font-mono text-red-600 dark:text-red-400">{student.leetcodeStats?.hard || 0}</td>
                                                        <td className="p-4 text-center font-bold text-slate-900 dark:text-white">{student.leetcodeStats?.total || 0}</td>
                                                    </>
                                                ) : leaderboardFilter === 'Codeforces' ? (
                                                    <>
                                                        <td className="p-4 text-center">
                                                            <a href={student.profiles.codeforces} target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline">View Profile</a>
                                                        </td>
                                                        <td className="p-4 text-center font-mono text-slate-900 dark:text-white">{student.codeforcesStats?.solved || 0}</td>
                                                        <td className="p-4 text-center font-mono font-bold text-yellow-600 dark:text-yellow-400">{student.codeforcesStats?.rating || 'N/A'}</td>
                                                    </>
                                                ) : leaderboardFilter === 'CodeChef' ? (
                                                    <>
                                                        <td className="p-4 text-center">
                                                            <a href={student.profiles.codechef} target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline">View Profile</a>
                                                        </td>
                                                        <td className="p-4 text-center font-mono text-slate-800 dark:text-white">{student.codechefStats?.contests || 0}</td>
                                                        <td className="p-4 text-center font-mono font-bold text-orange-600 dark:text-orange-400">{student.codechefStats?.rating || 'N/A'}</td>
                                                    </>
                                                ) : (
                                                    <>
                                                        <td className="p-4 text-center">
                                                            <a href={student.profiles[leaderboardFilter.toLowerCase()]} target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline">View Profile</a>
                                                        </td>
                                                        <td className="p-4 text-center font-mono text-slate-900 dark:text-white">
                                                            {student.githubStats?.public_repos !== undefined ? student.githubStats.public_repos : (student.scores?.github !== undefined ? student.scores.github : 'N/A')}
                                                        </td>
                                                    </>
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                {['All', 'Pending'].includes(filter) && (
                                                    <td className="p-4">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedIds.includes(student._id)}
                                                            onChange={() => handleSelect(student._id)}
                                                            className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-indigo-600 focus:ring-indigo-500 shadow-sm"
                                                        />
                                                    </td>
                                                )}
                                                <td className="p-4 text-slate-600 dark:text-slate-500 font-mono text-sm font-bold">
                                                    {String(displayIndex).padStart(2, '0')}
                                                </td>
                                                <td className="p-4 text-slate-800 dark:text-slate-300 font-mono font-semibold">{student.regNo}</td>
                                                <td className="p-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="font-bold text-slate-900 dark:text-white">{student.name}</div>
                                                        <button onClick={() => setSelectedStudent(student)} className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-blue-400 transition">
                                                            <Info size={16} />
                                                        </button>
                                                    </div>
                                                    <div className="text-sm font-medium text-slate-600 dark:text-slate-400">{student.email}</div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="text-slate-900 font-bold dark:text-white">{student.college}</div>
                                                    <div className="text-sm font-medium text-slate-600 dark:text-slate-400">{student.dept}</div>
                                                </td>
                                                <td className="p-4 flex space-x-2">
                                                    {Object.entries(student.profiles).map(([key, url]) => (
                                                        url && <a key={key} href={url} target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline text-xs bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded capitalize border border-blue-200 dark:border-blue-900/50">{key}</a>
                                                    ))}
                                                </td>
                                                <td className="p-4">
                                                    <span className={`px-2 py-1 rounded text-xs font-semibold ${student.status === 'Verified' ? 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300' :
                                                        student.status === 'Rejected' ? 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300' :
                                                            'bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-300'
                                                        }`}>
                                                        {student.status}
                                                    </span>
                                                </td>
                                                <td className="p-4 space-x-2">
                                                    {student.status !== 'Verified' && (
                                                        <>
                                                            <button onClick={() => handleVerify(student._id, 'Verified')} className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300">Verify</button>
                                                            <button onClick={() => handleVerify(student._id, 'Rejected')} className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300">Reject</button>
                                                        </>
                                                    )}
                                                    <button onClick={() => handleDelete(student._id)} className="text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-500 transition-colors ml-2" title="Delete Student">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </td>
                                            </>
                                        )}
                                    </motion.tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* Student Details Modal */}
            <StudentDetailsModal student={selectedStudent} onClose={() => setSelectedStudent(null)} />
        </div>
    );
};

export default AdminDashboard;
