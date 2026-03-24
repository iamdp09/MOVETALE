import { motion } from 'framer-motion';
import { Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';

const FeedCard = ({ post, className = '' }) => {
    return (
        <motion.div
            className={`bg-surface rounded-2xl border border-white/5 p-5 ${className}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            {/* Header */}
            <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-accent-light flex items-center justify-center text-sm font-bold text-white">
                    {post?.avatar || post?.username?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="flex-1">
                    <p className="text-sm font-semibold text-white">{post?.username || 'User'}</p>
                    <p className="text-xs text-muted">{post?.clubName || 'Movie Club'} · {post?.time || '2h ago'}</p>
                </div>
                <button className="text-muted hover:text-white transition-colors">
                    <MoreHorizontal size={18} />
                </button>
            </div>

            {/* Content */}
            <p className="text-sm text-gray-300 leading-relaxed mb-4">
                {post?.content || 'Discussing movies and entertainment...'}
            </p>

            {/* Image */}
            {post?.image && (
                <div className="rounded-xl overflow-hidden mb-4">
                    <img src={post.image} alt="" className="w-full h-48 object-cover" />
                </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-6 pt-3 border-t border-white/5">
                <motion.button
                    className="flex items-center gap-2 text-muted hover:text-red-400 transition-colors text-sm"
                    whileTap={{ scale: 0.9 }}
                >
                    <Heart size={16} />
                    <span>{post?.likes || 0}</span>
                </motion.button>
                <motion.button
                    className="flex items-center gap-2 text-muted hover:text-blue-400 transition-colors text-sm"
                    whileTap={{ scale: 0.9 }}
                >
                    <MessageCircle size={16} />
                    <span>{post?.comments || 0}</span>
                </motion.button>
                <motion.button
                    className="flex items-center gap-2 text-muted hover:text-green-400 transition-colors text-sm ml-auto"
                    whileTap={{ scale: 0.9 }}
                >
                    <Share2 size={16} />
                </motion.button>
            </div>
        </motion.div>
    );
};

export default FeedCard;
