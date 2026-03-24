const API_KEY = import.meta.env.VITE_TMDB_API_KEY || 'demo';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE = 'https://image.tmdb.org/t/p';

export const getImageUrl = (path, size = 'w500') => {
    if (!path) return 'https://via.placeholder.com/500x750/121212/333?text=No+Image';
    return `${IMAGE_BASE}/${size}${path}`;
};

export const getBackdropUrl = (path, size = 'original') => {
    if (!path) return 'https://via.placeholder.com/1920x1080/121212/333?text=No+Backdrop';
    return `${IMAGE_BASE}/${size}${path}`;
};

const fetchFromTMDB = async (endpoint, params = {}) => {
    const url = new URL(`${BASE_URL}${endpoint}`);
    url.searchParams.append('api_key', API_KEY);
    Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
    });

    try {
        const response = await fetch(url.toString());
        if (!response.ok) throw new Error(`TMDB API error: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('TMDB fetch error:', error);
        return null;
    }
};

export const fetchTrending = (timeWindow = 'week') =>
    fetchFromTMDB(`/trending/movie/${timeWindow}`);

export const fetchDiscover = (params = {}) =>
    fetchFromTMDB('/discover/movie', { sort_by: 'popularity.desc', ...params });

export const fetchUpcoming = (page = 1) =>
    fetchFromTMDB('/movie/upcoming', { page });

export const fetchNowPlaying = (page = 1) =>
    fetchFromTMDB('/movie/now_playing', { page });

export const fetchTopRated = (page = 1) =>
    fetchFromTMDB('/movie/top_rated', { page });

export const fetchPopular = (page = 1) =>
    fetchFromTMDB('/movie/popular', { page });

export const fetchMovieDetails = (movieId) =>
    fetchFromTMDB(`/movie/${movieId}`);

export const fetchCredits = (movieId) =>
    fetchFromTMDB(`/movie/${movieId}/credits`);

export const fetchReviews = (movieId) =>
    fetchFromTMDB(`/movie/${movieId}/reviews`);

export const fetchSimilar = (movieId) =>
    fetchFromTMDB(`/movie/${movieId}/similar`);

export const searchMovies = (query, page = 1) =>
    fetchFromTMDB('/search/movie', { query, page });

export const searchPeople = (query, page = 1) =>
    fetchFromTMDB('/search/person', { query, page });

export const searchMulti = (query, page = 1) =>
    fetchFromTMDB('/search/multi', { query, page });

export const fetchGenres = () =>
    fetchFromTMDB('/genre/movie/list');
