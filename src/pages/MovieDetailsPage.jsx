import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Bookmark, Star, Share2, Play, Clock, Calendar, DollarSign,
    Globe, Award
} from 'lucide-react';
import {
    fetchMovieDetails, fetchCredits, fetchReviews, fetchSimilar,
    getImageUrl, getBackdropUrl
} from '../api/tmdb';
import Button from '../components/Button';
import GenreChip from '../components/GenreChip';
import CastCard from '../components/CastCard';
import MoveTaleMeter from '../components/MoveTaleMeter';
import ReviewInput from '../components/ReviewInput';
import PosterCard from '../components/PosterCard';

const MovieDetailsPage = () => {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [credits, setCredits] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [similar, setSimilar] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        window.scrollTo(0, 0);

        Promise.all([
            fetchMovieDetails(id),
            fetchCredits(id),
            fetchReviews(id),
            fetchSimilar(id),
        ]).then(([movieData, creditsData, reviewsData, similarData]) => {
            setMovie(movieData);
            setCredits(creditsData);
            setReviews(reviewsData?.results?.slice(0, 5) || []);
            setSimilar(similarData?.results?.slice(0, 10) || []);
            setLoading(false);
        });
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-bg flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-accent/30 border-t-accent rounded-full animate-spin" />
                    <p className="text-muted text-sm">Loading movie details...</p>
                </div>
            </div>
        );
    }

    if (!movie) {
        return (
            <div className="min-h-screen bg-bg flex items-center justify-center">
                <p className="text-muted">Movie not found.</p>
            </div>
        );
    }

    const cast = credits?.cast?.slice(0, 12) || [];
    const crew = credits?.crew?.filter(
        (c) => ['Director', 'Writer', 'Producer', 'Screenplay'].includes(c.job)
    )?.slice(0, 8) || [];
    const directors = crew.filter((c) => c.job === 'Director');
    const runtime = movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : null;

    return (
        <div className="min-h-screen bg-bg">
            {/* Hero Section */}
            <div className="relative h-[70vh] min-h-[500px]">
                {/* Backdrop */}
                <div className="absolute inset-0">
                    <img
                        src={getBackdropUrl(movie.backdrop_path)}
                        alt=""
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/70 to-bg/30" />
                    <div className="absolute inset-0 bg-gradient-to-r from-bg via-transparent to-transparent" />
                </div>

                {/* Hero Content */}
                <div className="absolute bottom-0 left-0 right-0 pb-10">
                    <div className="max-w-[1440px] mx-auto px-6 flex gap-8">
                        {/* Poster */}
                        <motion.div
                            className="hidden md:block w-48 lg:w-56 flex-shrink-0"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <div className="rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-white/10">
                                <img
                                    src={getImageUrl(movie.poster_path)}
                                    alt={movie.title}
                                    className="w-full h-auto"
                                />
                            </div>
                        </motion.div>

                        {/* Info */}
                        <motion.div
                            className="flex-1 flex flex-col justify-end"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <h1 className="text-3xl lg:text-5xl font-bold text-white text-shadow leading-tight">
                                {movie.title}
                            </h1>

                            {movie.tagline && (
                                <p className="text-base text-muted mt-2 italic">"{movie.tagline}"</p>
                            )}

                            {/* Meta row */}
                            <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-muted">
                                {movie.release_date && (
                                    <span className="flex items-center gap-1.5">
                                        <Calendar size={14} />
                                        {new Date(movie.release_date).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </span>
                                )}
                                {runtime && (
                                    <span className="flex items-center gap-1.5">
                                        <Clock size={14} />
                                        {runtime}
                                    </span>
                                )}
                                {movie.original_language && (
                                    <span className="flex items-center gap-1.5">
                                        <Globe size={14} />
                                        {movie.original_language.toUpperCase()}
                                    </span>
                                )}
                                {movie.vote_average > 0 && (
                                    <span className="flex items-center gap-1.5 text-yellow-400">
                                        <Star size={14} fill="currentColor" />
                                        {movie.vote_average.toFixed(1)} / 10
                                    </span>
                                )}
                            </div>

                            {/* Directors */}
                            {directors.length > 0 && (
                                <p className="text-sm text-muted mt-2">
                                    Directed by{' '}
                                    <span className="text-white font-medium">
                                        {directors.map((d) => d.name).join(', ')}
                                    </span>
                                </p>
                            )}

                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-3 mt-6">
                                <Button variant="primary" size="lg">
                                    <Play size={18} fill="white" />
                                    Watch Trailer
                                </Button>
                                <Button variant="secondary" size="lg">
                                    <Bookmark size={18} />
                                    Watchlist
                                </Button>
                                <Button variant="ghost" size="lg">
                                    <Star size={18} />
                                    Rate
                                </Button>
                                <Button variant="ghost" size="lg">
                                    <Share2 size={18} />
                                    Share
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Content Below Hero */}
            <div className="max-w-[1440px] mx-auto px-6 py-10">
                <div className="flex gap-10">
                    {/* Main Content */}
                    <div className="flex-1 min-w-0 space-y-10">
                        {/* Awards Badge */}
                        {movie.vote_average >= 7.5 && (
                            <motion.div
                                className="inline-flex items-center gap-2 bg-yellow-400/10 text-yellow-400 px-4 py-2 rounded-xl border border-yellow-400/20"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                            >
                                <Award size={18} />
                                <span className="text-sm font-medium">Highly Rated — Top Film</span>
                            </motion.div>
                        )}

                        {/* Overview */}
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-lg font-semibold text-white mb-3">Overview</h2>
                            <p className="text-gray-300 leading-relaxed">{movie.overview}</p>
                        </motion.div>

                        {/* Genre Chips */}
                        {movie.genres?.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <h2 className="text-lg font-semibold text-white mb-3">Genres</h2>
                                <div className="flex flex-wrap gap-2">
                                    {movie.genres.map((genre) => (
                                        <GenreChip key={genre.id} genre={genre.name} />
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Cast */}
                        {cast.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <h2 className="text-lg font-semibold text-white mb-4">Cast</h2>
                                <div className="flex gap-5 overflow-x-auto scrollbar-hide pb-2">
                                    {cast.map((person) => (
                                        <CastCard key={person.id} person={person} />
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Crew */}
                        {crew.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <h2 className="text-lg font-semibold text-white mb-4">Crew</h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {crew.map((person, idx) => (
                                        <div
                                            key={`${person.id}-${idx}`}
                                            className="bg-surface rounded-xl p-3 border border-white/5"
                                        >
                                            <p className="text-sm font-medium text-white">{person.name}</p>
                                            <p className="text-xs text-muted mt-0.5">{person.job}</p>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Production Companies */}
                        {movie.production_companies?.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <h2 className="text-lg font-semibold text-white mb-3">Production</h2>
                                <div className="flex flex-wrap gap-2">
                                    {movie.production_companies.map((company) => (
                                        <span
                                            key={company.id}
                                            className="bg-surface-light text-muted text-sm px-4 py-2 rounded-xl border border-white/5"
                                        >
                                            {company.name}
                                        </span>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Write a Review */}
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-lg font-semibold text-white mb-4">Write a Review</h2>
                            <ReviewInput movieTitle={movie.title} />
                        </motion.div>

                        {/* Reviews */}
                        {reviews.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <h2 className="text-lg font-semibold text-white mb-4">Reviews</h2>
                                <div className="space-y-4">
                                    {reviews.map((review) => (
                                        <div
                                            key={review.id}
                                            className="bg-surface rounded-2xl border border-white/5 p-5"
                                        >
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-accent-light flex items-center justify-center text-xs font-bold text-white">
                                                    {review.author?.[0]?.toUpperCase() || 'U'}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-white">{review.author}</p>
                                                    <p className="text-[10px] text-muted">
                                                        {review.created_at
                                                            ? new Date(review.created_at).toLocaleDateString()
                                                            : ''}
                                                    </p>
                                                </div>
                                                {review.author_details?.rating && (
                                                    <span className="ml-auto flex items-center gap-1 text-yellow-400 text-sm">
                                                        <Star size={12} fill="currentColor" />
                                                        {review.author_details.rating}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-300 leading-relaxed line-clamp-3">
                                                {review.content}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Similar Movies */}
                        {similar.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <h2 className="text-lg font-semibold text-white mb-4">Similar Movies</h2>
                                <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
                                    {similar.map((m) => (
                                        <PosterCard key={m.id} movie={m} size="md" showTitle showSubtitle />
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Right Sidebar — Stats */}
                    <div className="hidden xl:block w-80 flex-shrink-0 space-y-6">
                        {/* MoveTale Meter */}
                        <MoveTaleMeter
                            rating={movie.vote_average || 0}
                            voteCount={movie.vote_count || 0}
                            totalVotes={Math.floor((movie.vote_count || 0) * 1.15)}
                        />

                        {/* Movie Facts */}
                        <div className="bg-surface rounded-2xl border border-white/5 p-5 space-y-4">
                            <h3 className="text-sm font-semibold text-white">Movie Info</h3>

                            {movie.status && (
                                <div>
                                    <p className="text-xs text-muted">Status</p>
                                    <p className="text-sm text-white mt-0.5">{movie.status}</p>
                                </div>
                            )}

                            {movie.budget > 0 && (
                                <div>
                                    <p className="text-xs text-muted flex items-center gap-1">
                                        <DollarSign size={12} /> Budget
                                    </p>
                                    <p className="text-sm text-white mt-0.5">
                                        ${movie.budget?.toLocaleString()}
                                    </p>
                                </div>
                            )}

                            {movie.revenue > 0 && (
                                <div>
                                    <p className="text-xs text-muted flex items-center gap-1">
                                        <DollarSign size={12} /> Revenue
                                    </p>
                                    <p className="text-sm text-white mt-0.5">
                                        ${movie.revenue?.toLocaleString()}
                                    </p>
                                </div>
                            )}

                            {movie.spoken_languages?.length > 0 && (
                                <div>
                                    <p className="text-xs text-muted">Languages</p>
                                    <p className="text-sm text-white mt-0.5">
                                        {movie.spoken_languages.map((l) => l.english_name).join(', ')}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieDetailsPage;
