import { motion } from 'framer-motion';
import { getImageUrl } from '../api/tmdb';

const CastCard = ({ person, className = '' }) => {
    return (
        <motion.div
            className={`flex-shrink-0 text-center group cursor-pointer ${className}`}
            whileHover={{ y: -4 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
            <div className="w-20 h-20 mx-auto rounded-full overflow-hidden border-2 border-white/10 group-hover:border-accent/50 transition-colors duration-300">
                <img
                    src={getImageUrl(person?.profile_path, 'w185')}
                    alt={person?.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/185x185/121212/333?text=' + (person?.name?.[0] || '?');
                    }}
                />
            </div>
            <p className="text-xs font-medium text-white mt-2 line-clamp-2 max-w-[80px] mx-auto">
                {person?.name}
            </p>
            <p className="text-[10px] text-muted mt-0.5 line-clamp-2 max-w-[80px] mx-auto">
                {person?.character || person?.job}
            </p>
        </motion.div>
    );
};

export default CastCard;
