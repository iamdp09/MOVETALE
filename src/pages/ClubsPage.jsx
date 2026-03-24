import { useState } from 'react';
import { motion } from 'framer-motion';
import { Rss, UserCheck, Compass, ImagePlus, Smile, Send, Hash, Users } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import FeedCard from '../components/FeedCard';
import Button from '../components/Button';

const sidebarItems = [
    { id: 'feed', label: 'Feed', icon: Rss },
    { id: 'following', label: 'Following', icon: UserCheck },
    { id: 'discover', label: 'Discover', icon: Compass },
];

const sampleClubs = [
    { id: 1, name: 'Marvel Universe', members: 1243 },
    { id: 2, name: 'Nolan Fans', members: 892 },
    { id: 3, name: 'Horror Nights', members: 567 },
    { id: 4, name: 'Anime Club', members: 2105 },
    { id: 5, name: 'Classic Cinema', members: 334 },
    { id: 6, name: 'Sci-Fi Hub', members: 778 },
    { id: 7, name: 'K-Drama Club', members: 1456 },
    { id: 8, name: 'Indie Films', members: 445 },
];

const samplePosts = [
    {
        id: 1,
        username: 'CinemaLover',
        clubName: 'Marvel Universe',
        time: '2h ago',
        content: 'Just watched the new Avengers teaser trailer and I\'m absolutely blown away! The CGI has reached a whole new level. What do you all think about the rumored villain?',
        likes: 42,
        comments: 18,
    },
    {
        id: 2,
        username: 'NolanFanatic',
        clubName: 'Nolan Fans',
        time: '4h ago',
        content: 'Rewatched Interstellar for the 10th time. The docking scene still gives me chills. Hans Zimmer\'s score is pure perfection. This is cinema at its finest.',
        likes: 89,
        comments: 34,
    },
    {
        id: 3,
        username: 'HorrorBuff',
        clubName: 'Horror Nights',
        time: '6h ago',
        content: 'The latest A24 horror film is a masterclass in atmospheric tension. No jump scares needed when you have that level of craftsmanship. Highly recommended! 🎬',
        likes: 56,
        comments: 22,
    },
    {
        id: 4,
        username: 'AnimeFan',
        clubName: 'Anime Club',
        time: '8h ago',
        content: 'The new Makoto Shinkai film just hit theaters in Japan and the early reviews are incredible. Can\'t wait for the international release!',
        likes: 124,
        comments: 45,
    },
];

const ClubsPage = () => {
    const [activeFilter, setActiveFilter] = useState('feed');
    const [postText, setPostText] = useState('');
    const [selectedClub, setSelectedClub] = useState('');

    return (
        <div className="flex max-w-[1440px] mx-auto px-6 pt-20 pb-10 gap-6">
            {/* Left Sidebar */}
            <div className="hidden lg:block w-56 flex-shrink-0 space-y-6">
                <Sidebar
                    items={sidebarItems}
                    activeItem={activeFilter}
                    onItemClick={setActiveFilter}
                    title="Navigation"
                />

                <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted mb-3 px-3">
                        Your Clubs
                    </h3>
                    <div className="space-y-1 max-h-[400px] overflow-y-auto scrollbar-hide">
                        {sampleClubs.map((club) => (
                            <motion.button
                                key={club.id}
                                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-muted hover:text-white hover:bg-surface-light transition-all"
                                whileHover={{ x: 4 }}
                            >
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent/30 to-accent-light/30 flex items-center justify-center text-xs font-bold text-accent">
                                    {club.name[0]}
                                </div>
                                <div className="flex-1 text-left">
                                    <p className="text-sm">{club.name}</p>
                                    <p className="text-[10px] text-muted">{club.members} members</p>
                                </div>
                            </motion.button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Center — Post Creator + Feed */}
            <div className="flex-1 max-w-2xl mx-auto">
                {/* Post Creator */}
                <motion.div
                    className="bg-surface rounded-2xl border border-white/5 p-5 mb-6"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-accent-light flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                            U
                        </div>
                        <div className="flex-1 space-y-3">
                            <select
                                value={selectedClub}
                                onChange={(e) => setSelectedClub(e.target.value)}
                                className="bg-surface-light border border-white/5 rounded-lg px-3 py-1.5 text-sm text-muted focus:border-accent/50 outline-none transition-colors w-full"
                            >
                                <option value="">Select a club</option>
                                {sampleClubs.map((club) => (
                                    <option key={club.id} value={club.name}>{club.name}</option>
                                ))}
                            </select>

                            <textarea
                                value={postText}
                                onChange={(e) => setPostText(e.target.value)}
                                placeholder="Share your thoughts about a movie..."
                                className="w-full bg-transparent text-sm text-white placeholder:text-muted/60 outline-none resize-none min-h-[60px]"
                                rows={2}
                            />

                            <div className="flex items-center justify-between pt-2 border-t border-white/5">
                                <div className="flex gap-3">
                                    <button className="text-muted hover:text-accent transition-colors">
                                        <ImagePlus size={18} />
                                    </button>
                                    <button className="text-muted hover:text-accent transition-colors">
                                        <Smile size={18} />
                                    </button>
                                    <button className="text-muted hover:text-accent transition-colors">
                                        <Hash size={18} />
                                    </button>
                                </div>
                                <Button variant="primary" size="sm" disabled={!postText.trim()}>
                                    <Send size={14} />
                                    Post
                                </Button>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Feed */}
                <div className="space-y-4">
                    {samplePosts.map((post) => (
                        <FeedCard key={post.id} post={post} />
                    ))}
                </div>
            </div>

            {/* Right Sidebar — Suggested Clubs */}
            <div className="hidden xl:block w-72 flex-shrink-0">
                <div className="bg-surface rounded-2xl border border-white/5 p-5">
                    <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                        <Users size={16} className="text-accent" />
                        Suggested Clubs
                    </h3>
                    <div className="space-y-3">
                        {sampleClubs.slice(4).map((club) => (
                            <div key={club.id} className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent/20 to-accent-light/20 flex items-center justify-center text-sm font-bold text-accent">
                                    {club.name[0]}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-white">{club.name}</p>
                                    <p className="text-xs text-muted">{club.members} members</p>
                                </div>
                                <Button variant="outline" size="sm" className="text-xs">
                                    Join
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClubsPage;
