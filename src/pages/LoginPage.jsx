import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchTrending, getImageUrl } from '../api/tmdb';
import Button from '../components/Button';

const LoginPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [posters, setPosters] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const loadPosters = async () => {
            const data = await fetchTrending();
            if (data?.results) {
                setPosters(data.results.map((m) => getImageUrl(m.poster_path, 'w342')));
            }
        };
        loadPosters();
    }, []);

    // Create 3 columns from poster data
    const columns = useMemo(() => {
        const fallback = Array(20).fill('https://via.placeholder.com/342x513/121212/333?text=Movie');
        const imgs = posters.length > 0 ? posters : fallback;
        // Duplicate so we have enough for infinite scroll
        const extended = [...imgs, ...imgs, ...imgs];
        const col1 = extended.slice(0, 12);
        const col2 = extended.slice(4, 16);
        const col3 = extended.slice(8, 20);
        return [col1, col2, col3];
    }, [posters]);

    const validate = () => {
        const e = {};
        if (!email) e.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Invalid email format';
        if (!password) e.password = 'Password is required';
        else if (password.length < 6) e.password = 'Min 6 characters';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            navigate('/explore');
        }
    };

    return (
        <div className="h-screen flex bg-bg overflow-hidden">
            {/* LEFT — Poster Columns */}
            <div className="hidden lg:flex w-[55%] relative overflow-hidden">
                <div className="absolute inset-0 z-10 bg-gradient-to-r from-bg/30 via-transparent to-bg" />
                <div className="absolute inset-0 z-10 bg-bg/40 backdrop-blur-[2px]" />

                <div className="flex gap-3 p-4 w-full">
                    {columns.map((col, colIdx) => (
                        <div
                            key={colIdx}
                            className={`flex-1 flex flex-col gap-3 ${colIdx === 1 ? 'animate-scroll-down' : 'animate-scroll-up'
                                }`}
                            style={{
                                animationDuration: `${30 + colIdx * 5}s`,
                            }}
                        >
                            {col.map((src, imgIdx) => (
                                <div
                                    key={imgIdx}
                                    className="rounded-xl overflow-hidden flex-shrink-0"
                                >
                                    <img
                                        src={src}
                                        alt=""
                                        className="w-full h-auto object-cover"
                                        loading="lazy"
                                    />
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* RIGHT — Auth Card */}
            <div className="flex-1 flex items-center justify-center px-6 lg:px-16 relative">
                {/* Background glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[120px]" />

                <motion.div
                    className="w-full max-w-md relative z-10"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    {/* Logo */}
                    <motion.div
                        className="mb-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h1 className="text-3xl font-bold tracking-tight">
                            <span className="gradient-text">MOVE</span>
                            <span className="text-white">TALE</span>
                        </h1>
                        <p className="text-muted text-sm mt-2">
                            {isLogin ? 'Welcome back. Continue your cinematic journey.' : 'Join the community of cinema lovers.'}
                        </p>
                    </motion.div>

                    {/* Auth Card */}
                    <div className="glass rounded-2xl p-8">
                        {/* Toggle */}
                        <div className="flex mb-6 bg-surface rounded-xl p-1">
                            {['Login', 'Sign Up'].map((tab, idx) => (
                                <button
                                    key={tab}
                                    onClick={() => {
                                        setIsLogin(idx === 0);
                                        setErrors({});
                                    }}
                                    className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${(idx === 0 && isLogin) || (idx === 1 && !isLogin)
                                            ? 'bg-gradient-to-r from-accent to-accent-light text-white shadow-lg shadow-accent/25'
                                            : 'text-muted hover:text-white'
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.form
                                key={isLogin ? 'login' : 'signup'}
                                onSubmit={handleSubmit}
                                initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
                                transition={{ duration: 0.25 }}
                                className="space-y-4"
                            >
                                {/* Email */}
                                <div>
                                    <div className={`flex items-center gap-3 bg-surface rounded-xl px-4 py-3 border transition-colors ${errors.email ? 'border-red-500/50' : 'border-white/5 focus-within:border-accent/50'
                                        }`}>
                                        <Mail size={18} className="text-muted" />
                                        <input
                                            type="email"
                                            placeholder="Email address"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="flex-1 bg-transparent text-sm text-white placeholder:text-muted/60 outline-none"
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="text-xs text-red-400 mt-1 ml-1">{errors.email}</p>
                                    )}
                                </div>

                                {/* Password */}
                                <div>
                                    <div className={`flex items-center gap-3 bg-surface rounded-xl px-4 py-3 border transition-colors ${errors.password ? 'border-red-500/50' : 'border-white/5 focus-within:border-accent/50'
                                        }`}>
                                        <Lock size={18} className="text-muted" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="Password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="flex-1 bg-transparent text-sm text-white placeholder:text-muted/60 outline-none"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="text-muted hover:text-white transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                    {errors.password && (
                                        <p className="text-xs text-red-400 mt-1 ml-1">{errors.password}</p>
                                    )}
                                </div>

                                {isLogin && (
                                    <div className="flex justify-end">
                                        <button type="button" className="text-xs text-accent hover:text-accent-light transition-colors">
                                            Forgot password?
                                        </button>
                                    </div>
                                )}

                                <Button
                                    type="submit"
                                    variant="primary"
                                    size="lg"
                                    fullWidth
                                    className="mt-2"
                                >
                                    {isLogin ? 'Login' : 'Create Account'}
                                    <ArrowRight size={16} />
                                </Button>
                            </motion.form>
                        </AnimatePresence>

                        {/* Divider */}
                        <div className="flex items-center gap-4 my-6">
                            <div className="flex-1 h-px bg-white/10" />
                            <span className="text-xs text-muted">or continue with</span>
                            <div className="flex-1 h-px bg-white/10" />
                        </div>

                        {/* Social buttons */}
                        <div className="grid grid-cols-2 gap-3">
                            <Button variant="secondary" size="md">
                                <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" /><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                                Google
                            </Button>
                            <Button variant="secondary" size="md">
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" /></svg>
                                GitHub
                            </Button>
                        </div>
                    </div>

                    {/* Footer */}
                    <p className="text-center text-xs text-muted mt-6">
                        {isLogin ? "Don't have an account? " : 'Already have an account? '}
                        <button
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setErrors({});
                            }}
                            className="text-accent hover:text-accent-light font-medium transition-colors"
                        >
                            {isLogin ? 'Sign Up' : 'Login'}
                        </button>
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default LoginPage;
