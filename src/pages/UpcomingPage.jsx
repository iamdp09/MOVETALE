import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarDays, Film, Tv, Clock, Megaphone, Calendar } from 'lucide-react';
import { fetchUpcoming, fetchNowPlaying, getImageUrl } from '../api/tmdb';
import Sidebar from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';

const sidebarItems = [
    { id: 'today', label: 'Today', icon: Clock },
    { id: 'upcoming', label: 'Upcoming', icon: CalendarDays },
    { id: 'announced', label: 'Announced', icon: Megaphone },
];

const tabs = [
    { id: 'all', label: 'All' },
    { id: 'movies', label: 'Movies' },
    { id: 'shows', label: 'Shows' },
];

const UpcomingPage = () => {
    const [activeFilter, setActiveFilter] = useState('upcoming');
    const [activeTab, setActiveTab] = useState('all');
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        const fetchFn = activeFilter === 'today' ? fetchNowPlaying : fetchUpcoming;
        fetchFn().then((data) => {
            if (data?.results) setMovies(data.results);
            setLoading(false);
        });
    }, [activeFilter]);

    // Group movies by release month
    const groupedMovies = movies.reduce((groups, movie) => {
        const date = movie.release_date || 'TBA';
        const key = date !== 'TBA'
            ? new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
            : 'To Be Announced';
        if (!groups[key]) groups[key] = [];
        groups[key].push(movie);
        return groups;
    }, {});

    return (
        <div className="flex max-w-[1440px] mx-auto px-6 pt-20 pb-10 gap-6">
            {/* Left Sidebar */}
            <div className="hidden lg:block w-56 flex-shrink-0">
                <Sidebar
                    items={sidebarItems}
                    activeItem={activeFilter}
                    onItemClick={setActiveFilter}
                    title="Schedule"
                />
            </div>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
                {/* Top Tabs */}
                <div className="flex items-center gap-2 mb-6">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${activeTab === tab.id
                                    ? 'bg-accent/15 text-accent border border-accent/20'
                                    : 'text-muted hover:text-white hover:bg-surface-light border border-transparent'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Movie Grid grouped by date */}
                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
                        >
                            {Array(15).fill(0).map((_, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="aspect-[2/3] bg-surface rounded-xl animate-pulse" />
                                    <div className="h-3 bg-surface rounded animate-pulse w-3/4" />
                                    <div className="h-2 bg-surface rounded animate-pulse w-1/2" />
                                </div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            key={activeFilter}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            {Object.entries(groupedMovies).map(([dateGroup, groupMovies]) => (
                                <div key={dateGroup} className="mb-8">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Calendar size={16} className="text-accent" />
                                        <h2 className="text-base font-semibold text-white">{dateGroup}</h2>
                                        <span className="text-xs text-muted">({groupMovies.length})</span>
                                    </div>

                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                        {groupMovies.map((movie, idx) => (
                                            <motion.div
                                                key={movie.id}
                                                className="cursor-pointer group"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: idx * 0.03 }}
                                                onClick={() => navigate(`/movie/${movie.id}`)}
                                            >
                                                <div className="aspect-[2/3] rounded-xl overflow-hidden relative">
                                                    <img
                                                        src={getImageUrl(movie.poster_path)}
                                                        alt={movie.title}
                                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                        loading="lazy"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                                    {/* Interest badge */}
                                                    <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                                                        <span className="bg-accent/90 text-white text-[10px] font-semibold px-2 py-0.5 rounded-md backdrop-blur-sm">
                                                            {movie.release_date ? new Date(movie.release_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'TBA'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="mt-2">
                                                    <p className="text-sm font-medium text-white line-clamp-2 group-hover:text-accent transition-colors">
                                                        {movie.title}
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-xs text-muted">
                                                            ★ {movie.vote_average?.toFixed(1) || 'N/A'}
                                                        </span>
                                                        <span className="text-xs text-muted">
                                                            · {Math.floor(movie.popularity)} interested
                                                        </span>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default UpcomingPage;
