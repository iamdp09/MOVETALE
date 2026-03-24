import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, ChevronRight, ChevronLeft, Sparkles, Star, Flame } from 'lucide-react';
import { fetchTrending, fetchPopular, fetchTopRated, fetchNowPlaying, fetchUpcoming, getImageUrl } from '../api/tmdb';
import PosterCard from '../components/PosterCard';

const movieRows = [
    { id: 'trending', label: 'Talk of the Town', icon: Flame, fetch: fetchTrending },
    { id: 'top_rated', label: 'Oscar Nominated Movies', icon: Star, fetch: fetchTopRated },
    { id: 'popular', label: "Editor's Pick", icon: Sparkles, fetch: fetchPopular },
    { id: 'now_playing', label: "Don't Miss on Netflix", icon: null, fetch: fetchNowPlaying },
    { id: 'upcoming', label: 'Worth Watching on Prime', icon: null, fetch: fetchUpcoming },
    { id: 'popular2', label: 'Crunchyroll Picks', icon: null, fetch: () => fetchPopular(2) },
];

const ScrollRow = ({ row }) => {
    const [movies, setMovies] = useState([]);
    const scrollRef = useRef(null);

    useEffect(() => {
        row.fetch().then((data) => {
            if (data?.results) setMovies(data.results);
        });
    }, []);

    const scroll = (dir) => {
        if (scrollRef.current) {
            const amount = dir === 'left' ? -400 : 400;
            scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
        }
    };

    return (
        <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
        >
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    {row.icon && <row.icon size={18} className="text-accent" />}
                    <h2 className="text-lg font-semibold text-white">{row.label}</h2>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => scroll('left')}
                        className="w-8 h-8 rounded-lg bg-surface-light border border-white/5 flex items-center justify-center text-muted hover:text-white hover:border-white/20 transition-all"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        className="w-8 h-8 rounded-lg bg-surface-light border border-white/5 flex items-center justify-center text-muted hover:text-white hover:border-white/20 transition-all"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>

            <div
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto scrollbar-hide pb-2"
            >
                {movies.map((movie) => (
                    <PosterCard key={movie.id} movie={movie} size="md" showTitle showSubtitle />
                ))}
                {movies.length === 0 &&
                    Array(6).fill(0).map((_, i) => (
                        <div key={i} className="w-40 h-60 rounded-xl bg-surface animate-pulse flex-shrink-0" />
                    ))}
            </div>
        </motion.div>
    );
};

const ExplorePage = () => {
    const [trendingList, setTrendingList] = useState([]);

    useEffect(() => {
        fetchTrending().then((data) => {
            if (data?.results) setTrendingList(data.results.slice(0, 10));
        });
    }, []);

    return (
        <div className="flex gap-6 max-w-[1440px] mx-auto px-6 pt-20 pb-10">
            {/* LEFT — Scroll Rows (70%) */}
            <div className="flex-1 min-w-0">
                {movieRows.map((row) => (
                    <ScrollRow key={row.id} row={row} />
                ))}
            </div>

            {/* RIGHT — Sidebar (30%) */}
            <div className="hidden xl:block w-[320px] flex-shrink-0">
                {/* Promo Banner */}
                <motion.div
                    className="rounded-2xl overflow-hidden mb-6 relative h-44"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-accent via-accent-light to-purple-400" />
                    <div className="absolute inset-0 flex flex-col justify-end p-5">
                        <p className="text-xs font-medium text-white/80 uppercase tracking-wider">Featured</p>
                        <h3 className="text-lg font-bold text-white mt-1">Discover New Releases</h3>
                        <p className="text-sm text-white/70 mt-1">Explore the latest blockbusters and hidden gems</p>
                    </div>
                </motion.div>

                {/* Trending List */}
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <TrendingUp size={18} className="text-accent" />
                        <h3 className="text-base font-semibold text-white">Trending</h3>
                    </div>

                    <div className="space-y-3">
                        {trendingList.map((movie, idx) => (
                            <motion.div
                                key={movie.id}
                                className="flex items-center gap-3 p-2 rounded-xl hover:bg-surface-light cursor-pointer transition-colors group"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                            >
                                <span className="text-lg font-bold text-white/20 w-6 text-center group-hover:text-accent/60 transition-colors">
                                    {idx + 1}
                                </span>
                                <img
                                    src={getImageUrl(movie.poster_path, 'w92')}
                                    alt={movie.title}
                                    className="w-10 h-14 rounded-lg object-cover flex-shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-white truncate">{movie.title}</p>
                                    <p className="text-xs text-muted">
                                        {movie.release_date ? new Date(movie.release_date).getFullYear() : 'TBA'}
                                    </p>
                                </div>
                                <div className="text-xs text-muted flex items-center gap-1">
                                    <Flame size={12} className="text-orange-400" />
                                    {Math.floor(movie.popularity)}
                                </div>
                            </motion.div>
                        ))}
                        {trendingList.length === 0 &&
                            Array(5).fill(0).map((_, i) => (
                                <div key={i} className="flex items-center gap-3 p-2">
                                    <div className="w-6 h-4 bg-surface rounded animate-pulse" />
                                    <div className="w-10 h-14 bg-surface rounded-lg animate-pulse" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-3 bg-surface rounded animate-pulse w-3/4" />
                                        <div className="h-2 bg-surface rounded animate-pulse w-1/2" />
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExplorePage;
