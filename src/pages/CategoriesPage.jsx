import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchGenres } from '../api/tmdb';
import GenreChip from '../components/GenreChip';
import { useNavigate } from 'react-router-dom';

// Extended category list grouped alphabetically
const allCategories = [
    'Action', 'Adventure', 'Animation', 'Anime',
    'Biography', 'Bollywood',
    'Comedy', 'Crime',
    'Documentary', 'Drama',
    'Epic',
    'Family', 'Fantasy', 'Film Noir',
    'Gore',
    'Historical', 'Horror',
    'Independent',
    'Japanese',
    'Kids', 'Korean',
    'LGBTQ+',
    'Musical', 'Mystery',
    'Noir',
    'Oscar Winners',
    'Political', 'Psychological',
    'Queer Cinema',
    'Romance', 'Romantic Comedy',
    'Sci-Fi', 'Slasher', 'Sports', 'Superhero', 'Suspense',
    'Thriller', 'True Crime',
    'Urban',
    'Vampire',
    'War', 'Western',
    'Zombie',
];

const CategoriesPage = () => {
    const [tmdbGenres, setTmdbGenres] = useState([]);
    const [activeCategory, setActiveCategory] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchGenres().then((data) => {
            if (data?.genres) setTmdbGenres(data.genres);
        });
    }, []);

    // Group categories by first letter
    const grouped = allCategories.reduce((acc, cat) => {
        const letter = cat[0].toUpperCase();
        if (!acc[letter]) acc[letter] = [];
        acc[letter].push(cat);
        return acc;
    }, {});

    const handleCategoryClick = (category) => {
        setActiveCategory(category === activeCategory ? null : category);
        // In a full app, this would filter/navigate
    };

    return (
        <div className="max-w-[1440px] mx-auto px-6 pt-20 pb-10">
            {/* Header */}
            <motion.div
                className="mb-8"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-2xl font-bold text-white">Categories</h1>
                <p className="text-sm text-muted mt-1">Browse movies by genre and category</p>
            </motion.div>

            {/* TMDB Genres (official) */}
            {tmdbGenres.length > 0 && (
                <motion.div
                    className="mb-10"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <h2 className="text-sm font-semibold text-muted uppercase tracking-wider mb-4">Popular Genres</h2>
                    <div className="flex flex-wrap gap-2">
                        {tmdbGenres.map((genre) => (
                            <GenreChip
                                key={genre.id}
                                genre={genre.name}
                                size="lg"
                                isActive={activeCategory === genre.name}
                                onClick={() => handleCategoryClick(genre.name)}
                            />
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Alphabetical Categories */}
            <div className="space-y-6">
                {Object.entries(grouped).map(([letter, categories], idx) => (
                    <motion.div
                        key={letter}
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.02 }}
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <span className="text-2xl font-bold gradient-text w-8">{letter}</span>
                            <div className="flex-1 h-px bg-white/5" />
                        </div>
                        <div className="flex flex-wrap gap-2 pl-11">
                            {categories.map((cat) => (
                                <GenreChip
                                    key={cat}
                                    genre={cat}
                                    isActive={activeCategory === cat}
                                    onClick={() => handleCategoryClick(cat)}
                                />
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default CategoriesPage;
