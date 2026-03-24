import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getImageUrl } from '../api/tmdb';
import RatingChart from './RatingChart';

const PosterCard = ({
    movie,
    size = 'md',
    showTitle = true,
    showSubtitle = false,
    showRating = true,
    className = '',
}) => {
    const navigate = useNavigate();

    const sizes = {
        sm: 'w-28 h-40',
        md: 'w-40 h-60',
        lg: 'w-48 h-72',
        xl: 'w-56 h-80',
    };

    const handleClick = () => {
        if (movie?.id) {
            navigate(`/movie/${movie.id}`);
        }
    };

    return (
        <motion.div
            className={`flex-shrink-0 cursor-pointer group ${className}`}
            onClick={handleClick}
            whileHover={{ y: -8, scale: 1.03 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
            <div className={`${sizes[size]} relative rounded-xl overflow-hidden`}>
                <img
                    src={getImageUrl(movie?.poster_path)}
                    alt={movie?.title || 'Movie poster'}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                />
                {/* Dark overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Circular Rating Ring — bottom left, peeking out */}
                {showRating && movie?.vote_average > 0 && (
                    <div className="absolute -bottom-2 -left-2 z-10">
                        <RatingChart
                            rating={movie.vote_average}
                            variant="card"
                        />
                    </div>
                )}

                {/* Hover overlay info */}
                <div className="absolute inset-0 flex flex-col justify-end p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-xs text-white/90 font-medium line-clamp-2 text-shadow">
                        {movie?.title}
                    </p>
                    {movie?.release_date && (
                        <p className="text-[10px] text-white/60 mt-0.5">
                            {new Date(movie.release_date).getFullYear()}
                        </p>
                    )}
                </div>
            </div>

            {showTitle && (
                <div className="mt-3 px-0.5">
                    <p className="text-sm font-medium text-white line-clamp-2 group-hover:text-accent transition-colors">
                        {movie?.title}
                    </p>
                    {showSubtitle && movie?.release_date && (
                        <p className="text-xs text-muted mt-0.5">
                            {new Date(movie.release_date).getFullYear()}
                        </p>
                    )}
                </div>
            )}
        </motion.div>
    );
};

export default PosterCard;
