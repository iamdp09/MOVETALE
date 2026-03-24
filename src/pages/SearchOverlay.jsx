import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Film, Users, Layers, User } from 'lucide-react';
import { searchMulti, searchMovies, searchPeople, getImageUrl } from '../api/tmdb';
import { useNavigate } from 'react-router-dom';

const searchTabs = [
    { id: 'content', label: 'Content', icon: Film },
    { id: 'collections', label: 'Collections', icon: Layers },
    { id: 'cast', label: 'Cast & Crew', icon: Users },
    { id: 'users', label: 'Users', icon: User },
];

const SearchOverlay = ({ isOpen, onClose }) => {
    const [query, setQuery] = useState('');
    const [activeTab, setActiveTab] = useState('content');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef(null);
    const timeoutRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 200);
        } else {
            setQuery('');
            setResults([]);
        }
    }, [isOpen]);

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose?.();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    const doSearch = useCallback(
        (q) => {
            if (!q.trim()) {
                setResults([]);
                return;
            }
            setLoading(true);
            const searchFn =
                activeTab === 'cast' ? searchPeople : activeTab === 'content' ? searchMovies : searchMulti;

            searchFn(q).then((data) => {
                setResults(data?.results || []);
                setLoading(false);
            });
        },
        [activeTab]
    );

    const handleInputChange = (e) => {
        const val = e.target.value;
        setQuery(val);
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => doSearch(val), 400);
    };

    const handleResultClick = (item) => {
        if (item.media_type === 'person' || activeTab === 'cast') {
            // Could navigate to person page
        } else {
            navigate(`/movie/${item.id}`);
        }
        onClose?.();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-[100] flex flex-col"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-bg/95 backdrop-blur-xl"
                        onClick={onClose}
                    />

                    {/* Content */}
                    <div className="relative z-10 w-full max-w-3xl mx-auto px-6 pt-24 flex-1 overflow-y-auto">
                        {/* Close button */}
                        <motion.button
                            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-surface-light border border-white/10 flex items-center justify-center text-muted hover:text-white transition-colors"
                            onClick={onClose}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <X size={20} />
                        </motion.button>

                        {/* Search Input */}
                        <motion.div
                            className="relative"
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                        >
                            <Search
                                size={24}
                                className="absolute left-0 top-1/2 -translate-y-1/2 text-muted"
                            />
                            <input
                                ref={inputRef}
                                type="text"
                                value={query}
                                onChange={handleInputChange}
                                placeholder="Search movies, shows, cast & crew..."
                                className="w-full bg-transparent text-3xl font-light text-white placeholder:text-muted/40 outline-none pl-10 pb-4 border-b border-white/10 focus:border-accent/50 transition-colors"
                            />
                        </motion.div>

                        {/* Tabs */}
                        <motion.div
                            className="flex gap-2 mt-6 mb-6"
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            {searchTabs.map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => {
                                            setActiveTab(tab.id);
                                            if (query) doSearch(query);
                                        }}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === tab.id
                                                ? 'bg-accent/15 text-accent border border-accent/20'
                                                : 'text-muted hover:text-white hover:bg-surface-light border border-transparent'
                                            }`}
                                    >
                                        <Icon size={14} />
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </motion.div>

                        {/* Results */}
                        <div className="space-y-2 pb-10">
                            {loading && (
                                <div className="space-y-3">
                                    {Array(5).fill(0).map((_, i) => (
                                        <div key={i} className="flex items-center gap-4 p-3 rounded-xl">
                                            <div className="w-12 h-16 bg-surface rounded-lg animate-pulse" />
                                            <div className="flex-1 space-y-2">
                                                <div className="h-4 bg-surface rounded animate-pulse w-3/4" />
                                                <div className="h-3 bg-surface rounded animate-pulse w-1/2" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {!loading && results.length > 0 && results.map((item, idx) => (
                                <motion.div
                                    key={item.id || idx}
                                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-surface-light cursor-pointer transition-colors group"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.03 }}
                                    onClick={() => handleResultClick(item)}
                                >
                                    <img
                                        src={getImageUrl(item.poster_path || item.profile_path, 'w92')}
                                        alt={item.title || item.name}
                                        className="w-12 h-16 rounded-lg object-cover flex-shrink-0"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-white group-hover:text-accent transition-colors truncate">
                                            {item.title || item.name}
                                        </p>
                                        <p className="text-xs text-muted mt-0.5">
                                            {item.release_date
                                                ? new Date(item.release_date).getFullYear()
                                                : item.known_for_department || ''}
                                            {item.vote_average > 0 && ` · ★ ${item.vote_average.toFixed(1)}`}
                                        </p>
                                    </div>
                                    <span className="text-xs text-muted/60 capitalize">
                                        {item.media_type || (activeTab === 'cast' ? 'person' : 'movie')}
                                    </span>
                                </motion.div>
                            ))}

                            {!loading && query && results.length === 0 && (
                                <div className="text-center py-16">
                                    <Search size={48} className="mx-auto text-muted/30 mb-4" />
                                    <p className="text-muted">No results found for "{query}"</p>
                                    <p className="text-xs text-muted/60 mt-1">Try different keywords</p>
                                </div>
                            )}

                            {!loading && !query && (
                                <div className="text-center py-16">
                                    <Search size={48} className="mx-auto text-muted/20 mb-4" />
                                    <p className="text-muted/60 text-sm">Start typing to search...</p>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SearchOverlay;
