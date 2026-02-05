// API configuration and utility functions for Mission Section
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://med-backend-d61c905599c2.herokuapp.com';

/**
 * Get the current language from i18next
 */
export const getCurrentLanguage = () => {
    // Check if we're in browser environment
    if (typeof window !== 'undefined') {
        // Try to get from localStorage (where i18next stores the language)
        const savedLanguage = localStorage.getItem('i18nextLng');

        if (savedLanguage && ['ru', 'kg', 'en'].includes(savedLanguage)) {
            return savedLanguage;
        }

        // Fallback to browser language
        const browserLang = navigator.language || navigator.languages[0];
        if (browserLang.startsWith('ky') || browserLang.startsWith('kg')) {
            return 'kg';
        }
        if (browserLang.startsWith('en')) {
            return 'en';
        }
    }

    return 'ru'; // Default language
};

/**
 * Make API request with proper headers and language parameter
 */
const apiRequest = async (endpoint, options = {}) => {
    const currentLang = getCurrentLanguage();

    // Add language parameter to URL
    const separator = endpoint.includes('?') ? '&' : '?';
    const urlWithLang = `${endpoint}${separator}lang=${currentLang}`;

    const defaultHeaders = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Accept-Language': currentLang,
    };

    const config = {
        method: 'GET',
        headers: { ...defaultHeaders, ...options.headers },
        ...options,
    };

    try {
        console.log('Request config:', config);
        console.log('Final URL:', `${API_BASE_URL}${urlWithLang}`);
        const response = await fetch(`${API_BASE_URL}${urlWithLang}`, config);
        console.log('Response status:', response.status, response.statusText);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Response data:', data);
        return data;
    } catch (error) {
        console.error('API request failed:', error);
        throw error;
    }
};

/**
 * Fetch all mission data from the API
 */
export const fetchMissionData = async () => {
    console.log('fetchMissionData called');
    try {
        console.log('About to call apiRequest...');
        const data = await apiRequest('/api/mission/api/complete/');
        console.log('fetchMissionData success:', data);
        return data;
    } catch (error) {
        console.error('Failed to fetch mission data:', error);
        throw error;
    }
};

/**
 * Fetch specific mission sections
 */
export const fetchMissionSections = async () => {
    try {
        const data = await apiRequest('/api/mission/api/mission-sections/');
        return data.results || data;
    } catch (error) {
        console.error('Failed to fetch mission sections:', error);
        throw error;
    }
};

/**
 * Fetch history milestones
 */
export const fetchHistoryMilestones = async () => {
    try {
        const data = await apiRequest('/api/mission/api/history/');
        return data.results || data;
    } catch (error) {
        console.error('Failed to fetch history milestones:', error);
        throw error;
    }
};

/**
 * Fetch values
 */
export const fetchValues = async () => {
    try {
        const data = await apiRequest('/api/mission/api/values/');
        return data.results || data;
    } catch (error) {
        console.error('Failed to fetch values:', error);
        throw error;
    }
};

/**
 * Fetch priorities
 */
export const fetchPriorities = async () => {
    try {
        const data = await apiRequest('/api/mission/api/priorities/');
        return data.results || data;
    } catch (error) {
        console.error('Failed to fetch priorities:', error);
        throw error;
    }
};

/**
 * Fetch achievements
 */
export const fetchAchievements = async () => {
    try {
        const data = await apiRequest('/api/mission/api/achievements/');
        return data.results || data;
    } catch (error) {
        console.error('Failed to fetch achievements:', error);
        throw error;
    }
};