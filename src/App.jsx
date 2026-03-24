import { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import ExplorePage from './pages/ExplorePage';
import UpcomingPage from './pages/UpcomingPage';
import ClubsPage from './pages/ClubsPage';
import CategoriesPage from './pages/CategoriesPage';
import MovieDetailsPage from './pages/MovieDetailsPage';
import SearchOverlay from './pages/SearchOverlay';

const App = () => {
    const [searchOpen, setSearchOpen] = useState(false);
    const location = useLocation();
    const isLoginPage = location.pathname === '/login';

    return (
        <div className="min-h-screen bg-bg text-white font-sans">
            {/* Navbar — hidden on login page */}
            {!isLoginPage && (
                <Navbar onSearchToggle={() => setSearchOpen(true)} />
            )}

            {/* Search Overlay */}
            <SearchOverlay
                isOpen={searchOpen}
                onClose={() => setSearchOpen(false)}
            />

            {/* Routes */}
            <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname}>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/explore" element={<ExplorePage />} />
                    <Route path="/upcoming" element={<UpcomingPage />} />
                    <Route path="/clubs" element={<ClubsPage />} />
                    <Route path="/categories" element={<CategoriesPage />} />
                    <Route path="/movie/:id" element={<MovieDetailsPage />} />
                    <Route path="/profile" element={
                        <div className="pt-20 px-6 max-w-[1440px] mx-auto">
                            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-accent to-accent-light flex items-center justify-center text-3xl font-bold text-white mb-4">
                                    U
                                </div>
                                <h1 className="text-2xl font-bold text-white">Profile</h1>
                                <p className="text-muted mt-2">Your profile page is coming soon.</p>
                            </div>
                        </div>
                    } />
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            </AnimatePresence>
        </div>
    );
};

export default App;
