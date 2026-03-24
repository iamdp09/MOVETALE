import { motion } from 'framer-motion';

const GenreChip = ({ genre, isActive = false, onClick, size = 'md' }) => {
    const sizeClasses = {
        sm: 'px-3 py-1 text-xs',
        md: 'px-4 py-1.5 text-sm',
        lg: 'px-5 py-2 text-base',
    };

    return (
        <motion.button
            className={`
        ${sizeClasses[size]}
        rounded-full font-medium transition-all duration-200
        ${isActive
                    ? 'bg-gradient-to-r from-accent to-accent-light text-white shadow-lg shadow-accent/20'
                    : 'bg-surface-light text-muted border border-white/5 hover:text-white hover:border-accent/30 hover:bg-accent/10'
                }
      `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onClick?.(genre)}
        >
            {genre?.name || genre}
        </motion.button>
    );
};

export default GenreChip;
