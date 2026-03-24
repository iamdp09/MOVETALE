import { useState } from 'react';
import { motion } from 'framer-motion';

const ratingOptions = [
    { id: 'skip', label: 'Skip', color: '#F472B6', bgActive: 'bg-pink-400' },
    { id: 'timepass', label: 'Timepass', color: '#FBBF24', bgActive: 'bg-yellow-400' },
    { id: 'goforit', label: 'Go for it', color: '#34D399', bgActive: 'bg-emerald-400' },
    { id: 'perfection', label: 'Perfection', color: '#A78BFA', bgActive: 'bg-violet-400' },
];

const ReviewInput = ({ movieTitle, className = '' }) => {
    const [selectedRating, setSelectedRating] = useState(null);
    const [reviewText, setReviewText] = useState('');
    const maxChars = 1000;

    const handlePost = () => {
        if (!reviewText.trim() && !selectedRating) return;
        // In a full app, this would submit to backend
        alert(`Review posted!\nRating: ${selectedRating || 'None'}\nReview: ${reviewText}`);
        setReviewText('');
        setSelectedRating(null);
    };

    return (
        <motion.div
            className={`bg-surface-light rounded-2xl border border-white/5 p-5 ${className}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            {/* Top row: Avatar + Rating Pills */}
            <div className="flex items-center justify-between gap-4 mb-4">
                {/* User avatar & name */}
                <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-accent-light flex items-center justify-center text-sm font-bold text-white border-2 border-white/10">
                        U
                    </div>
                    <span className="text-sm font-medium text-muted">@user</span>
                </div>

                {/* Rating pills */}
                <div className="flex items-center bg-surface rounded-full border border-white/10 p-1 gap-0.5">
                    {ratingOptions.map((option) => {
                        const isSelected = selectedRating === option.id;
                        return (
                            <motion.button
                                key={option.id}
                                onClick={() => setSelectedRating(isSelected ? null : option.id)}
                                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 whitespace-nowrap ${isSelected
                                        ? 'text-black shadow-md'
                                        : 'text-muted hover:text-white'
                                    }`}
                                style={isSelected ? { backgroundColor: option.color } : {}}
                                whileTap={{ scale: 0.95 }}
                            >
                                {option.label}
                            </motion.button>
                        );
                    })}
                </div>
            </div>

            {/* Review textarea */}
            <textarea
                value={reviewText}
                onChange={(e) => {
                    if (e.target.value.length <= maxChars) {
                        setReviewText(e.target.value);
                    }
                }}
                placeholder="Write your review here..."
                className="w-full bg-transparent text-sm text-white placeholder:text-muted/40 outline-none resize-none min-h-[80px] leading-relaxed"
                rows={3}
            />

            {/* Bottom divider + counter + post */}
            <div className="border-t border-white/10 pt-3 mt-1">
                <div className="flex items-center justify-between">
                    {/* Character counter */}
                    <span className={`text-xs ${reviewText.length > maxChars * 0.9
                            ? 'text-red-400'
                            : 'text-muted/60'
                        }`}>
                        {reviewText.length}/{maxChars}
                    </span>

                    {/* Post button */}
                    <motion.button
                        onClick={handlePost}
                        disabled={!reviewText.trim() && !selectedRating}
                        className={`px-5 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ${reviewText.trim() || selectedRating
                                ? 'bg-white text-black hover:bg-gray-200'
                                : 'bg-white/10 text-muted/40 cursor-not-allowed'
                            }`}
                        whileHover={reviewText.trim() || selectedRating ? { scale: 1.05 } : {}}
                        whileTap={reviewText.trim() || selectedRating ? { scale: 0.95 } : {}}
                    >
                        Post
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};

export default ReviewInput;
