import axios from 'axios';

// Base configuration for infrastructure API calls
const baseURL = 'http://localhost:8000/api/infrastructure';

const infrastructureAPI = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add language headers
infrastructureAPI.interceptors.request.use((config) => {
    const language = localStorage.getItem('i18nextLng') || 'ru';
    const langMapping = {
        'ru': 'ru',
        'kg': 'kg',
        'en': 'en'
    };
    const apiLang = langMapping[language] || 'ru';

    // Add language as query parameter
    config.params = {
        ...config.params,
        lang: apiLang
    };

    // Add Accept-Language header as fallback
    config.headers['Accept-Language'] = apiLang;

    return config;
});

// Response interceptor for error handling
infrastructureAPI.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('Infrastructure API Error:', error);
        return Promise.reject(error);
    }
);

// === CLASSROOM/AUDIENCE API FUNCTIONS ===

export const getClassroomCategories = async (language = 'ru') => {
    try {
        const response = await infrastructureAPI.get('/classrooms/categories/', {
            params: { lang: language }
        });
        return response;
    } catch (error) {
        console.error('Error fetching classroom categories:', error);
        return { data: { success: false, data: [] } };
    }
};

export const getClassrooms = async (language = 'ru') => {
    try {
        const response = await infrastructureAPI.get('/classrooms/', {
            params: { lang: language }
        });
        return response;
    } catch (error) {
        console.error('Error fetching classrooms:', error);
        return { data: { success: false, data: [] } };
    }
};

export const getClassroomsForFrontend = async (language = 'ru') => {
    try {
        const response = await infrastructureAPI.get('/classrooms/frontend/', {
            params: { lang: language }
        });
        return response;
    } catch (error) {
        console.error('Error fetching classrooms for frontend:', error);
        return { data: { success: false, data: { categories: [], classrooms: [] } } };
    }
};

export const getClassroomById = async (id, language = 'ru') => {
    try {
        const response = await infrastructureAPI.get(`/classrooms/${id}/`, {
            params: { lang: language }
        });
        return response;
    } catch (error) {
        console.error('Error fetching classroom details:', error);
        return { data: { success: false, data: null } };
    }
};

// === STARTUP API FUNCTIONS ===

export const getStartupCategories = async (language = 'ru') => {
    try {
        const response = await infrastructureAPI.get('/startups/categories/', {
            params: { lang: language }
        });
        return response;
    } catch (error) {
        console.error('Error fetching startup categories:', error);
        return { data: { success: false, data: [] } };
    }
};

export const getStartups = async (language = 'ru') => {
    try {
        const response = await infrastructureAPI.get('/startups/', {
            params: { lang: language }
        });
        return response;
    } catch (error) {
        console.error('Error fetching startups:', error);
        return { data: { success: false, data: [] } };
    }
};

export const getStartupsForFrontend = async (language = 'ru') => {
    try {
        const response = await infrastructureAPI.get('/startups/frontend/', {
            params: { lang: language }
        });
        return response;
    } catch (error) {
        console.error('Error fetching startups for frontend:', error);
        return { data: { success: false, data: { categories: [], startups: [], statistics: {} } } };
    }
};

export const getStartupById = async (id, language = 'ru') => {
    try {
        const response = await infrastructureAPI.get(`/startups/${id}/`, {
            params: { lang: language }
        });
        return response;
    } catch (error) {
        console.error('Error fetching startup details:', error);
        return { data: { success: false, data: null } };
    }
};

// Export default object with all functions for easy import
const infrastructureService = {
    // Classrooms
    getClassroomCategories,
    getClassrooms,
    getClassroomsForFrontend,
    getClassroomById,

    // Startups
    getStartupCategories,
    getStartups,
    getStartupsForFrontend,
    getStartupById,
};

export default infrastructureService;