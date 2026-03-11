import { useState } from 'react';
import axios from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/auth/login', { email, password });
            localStorage.setItem('token', res.data.token);
            navigate('/admin/dashboard');
        } catch (err) {
            setError(err.response?.data?.msg || 'Login failed');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen relative">
            <Link to="/" className="absolute top-4 right-4 md:top-8 md:right-8 text-red-600 font-bold dark:text-slate-400 hover:text-red-700 dark:hover:text-white flex items-center gap-2 transition bg-white dark:bg-slate-800/50 px-4 py-2 rounded-xl border border-red-200 dark:border-slate-700/50 shadow-sm hover:shadow-md">
                Exit to Home
            </Link>
            <div className="glass-card p-8 rounded-xl w-full max-w-md">
                <h2 className="text-3xl font-extrabold mb-6 text-center text-slate-900 dark:text-white">Admin Login</h2>
                {error && <p className="text-red-400 mb-4 text-center">{error}</p>}
                <form onSubmit={handleLogin} className="space-y-4">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="glass-input w-full p-3 rounded-lg"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="glass-input w-full p-3 rounded-lg"
                        required
                    />
                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-semibold transition">
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
