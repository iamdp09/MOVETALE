import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Compass,
    CalendarClock,
    Users,
    LayoutGrid,
    Search,
    User,
} from 'lucide-react';

const navItems = [
    { id: 'explore', label: 'Explore', icon: Compass, path: '/explore' },
    { id: 'upcoming', label: 'Upcoming', icon: CalendarClock, path: '/upcoming' },
    { id: 'clubs', label: 'Clubs', icon: Users, path: '/clubs' },
    { id: 'categories', label: 'Categories', icon: LayoutGrid, path: '/categories' },
    { id: 'search', label: 'Search', icon: Search, path: null },
    { id: 'profile', label: 'Profile', icon: User, path: '/profile' },
];

const Navbar = ({ onSearchToggle }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const getActiveTab = () => {
        const current = navItems.find((item) => item.path && location.pathname.startsWith(item.path));
        return current?.id || 'explore';
    };

    const activeTab = getActiveTab();

    const handleTabClick = (item) => {
        if (item.id === 'search') {
            onSearchToggle?.();
        } else if (item.path) {
            navigate(item.path);
        }
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5">
            <div className="max-w-[1440px] mx-auto px-6 h-16 flex items-center justify-between">
                {/* Logo */}
                <motion.div
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => navigate('/explore')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <span className="text-xl font-bold tracking-tight">
                        <span className="gradient-text">MOVE</span>
                        <span className="text-white">TALE</span>
                    </span>
                </motion.div>

                {/* Center Tabs */}
                <div className="flex items-center gap-1">
                    {navItems.map((item) => {
                        const isActive = activeTab === item.id;
                        const Icon = item.icon;

                        return (
                            <motion.button
                                key={item.id}
                                onClick={() => handleTabClick(item)}
                                className={`relative flex items-center gap-2 px-4 py-2 rounded-xl transition-colors duration-200 ${isActive
                                        ? 'text-white'
                                        : 'text-muted hover:text-white/80'
                                    }`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                                <AnimatePresence mode="wait">
                                    {isActive && (
                                        <motion.span
                                            initial={{ width: 0, opacity: 0 }}
                                            animate={{ width: 'auto', opacity: 1 }}
                                            exit={{ width: 0, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="text-sm font-medium whitespace-nowrap overflow-hidden"
                                        >
                                            {item.label}
                                        </motion.span>
                                    )}
                                </AnimatePresence>

                                {/* Active underline */}
                                {isActive && (
                                    <motion.div
                                        layoutId="navbar-underline"
                                        className="absolute -bottom-[1px] left-2 right-2 h-[2px] rounded-full"
                                        style={{
                                            background: 'linear-gradient(90deg, #3B82F6, #60A5FA)',
                                        }}
                                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                                    />
                                )}
                            </motion.button>
                        );
                    })}
                </div>

                {/* Right spacer for symmetry */}
                <div className="w-24" />
            </div>
        </nav>
    );
};

export default Navbar;
