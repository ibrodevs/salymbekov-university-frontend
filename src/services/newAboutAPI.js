import axios from "axios";

const API_BASE_URL = "https://med-backend-d61c905599c2.herokuapp.com/api/about-section";

// Create axios instance with default config
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

// Add request interceptor to add language parameter and headers
api.interceptors.request.use(
    (config) => {
        // Get current language from localStorage or i18next instance
        let currentLanguage = "ru";

        // Try to get from i18next first
        if (typeof window !== "undefined" && window.i18n) {
            currentLanguage = window.i18n.language || "ru";
        } else if (typeof localStorage !== "undefined") {
            currentLanguage =
                localStorage.getItem("i18nextLng") ||
                localStorage.getItem("language") ||
                "ru";
        }

        // Map language codes
        const languageMapping = {
            kg: "ky", // Map Kyrgyz from frontend to backend format
            en: "en",
            ru: "ru",
        };

        const backendLanguage = languageMapping[currentLanguage] || "ru";

        // Add lang parameter to all requests
        config.params = {
            ...config.params,
            lang: backendLanguage,
        };

        // Add Accept-Language header
        config.headers["Accept-Language"] = backendLanguage;

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor for error handling
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        console.error("API Error:", error);

        if (error.response) {
            // Server responded with error status
            const { status, data } = error.response;

            switch (status) {
                case 404:
                    console.error("Resource not found");
                    break;
                case 500:
                    console.error("Internal server error");
                    break;
                default:
                    console.error("API Error:", data?.error || error.message);
            }
        } else if (error.request) {
            // Request was made but no response received
            console.error("Network error - no response received");
        } else {
            // Something else happened
            console.error("Request setup error:", error.message);
        }

        return Promise.reject(error);
    }
);

/**
 * New About Section API endpoints
 */
export const newAboutAPI = {
    /**
     * Get university structure
     * @param {string} language - Language code (ru, kg, en)
     * @param {string} type - Department type filter
     * @returns {Promise} Axios response with structure data
     */
    getStructure: (language = null, type = null) => {
        let endpoint = `/structure/frontend/`;
        const params = [];

        if (type) {
            params.push(`type=${type}`);
        }

        if (params.length > 0) {
            endpoint += `?${params.join('&')}`;
        }

        return api.get(endpoint);
    },

    /**
     * Get achievements data
     * @param {string} language - Language code (ru, kg, en)
     * @param {string} category - Achievement category filter
     * @returns {Promise} Axios response with achievements data
     */
    getAchievements: (language = null, category = 'all') => {
        let endpoint = `/achievements/frontend/`;
        const params = [];

        if (category && category !== 'all') {
            params.push(`category=${category}`);
        }

        if (params.length > 0) {
            endpoint += `?${params.join('&')}`;
        }

        return api.get(endpoint);
    },

    /**
     * Get university statistics
     * @param {string} language - Language code (ru, kg, en)
     * @returns {Promise} Axios response with statistics data
     */
    getStatistics: (language = null) => {
        const endpoint = `/statistics/frontend/`;
        return api.get(endpoint);
    },

    /**
     * Get list of university founders
     * Returns founders with localized content based on current language
     * @param {string} language - Language code (optional)
     * @returns {Promise} Axios response with founders data
     */
    getUniversityFounders: (language = null) => {
        const endpoint = `/university-founders/`;
        return api.get(endpoint);
    },

    /**
     * Get specific university founder by ID
     * @param {number} id - Founder ID
     * @param {string} language - Language code (optional)
     * @returns {Promise} Axios response with founder data
     */
    getUniversityFounder: (id, language = null) => {
        const endpoint = `/university-founders/${id}/`;
        return api.get(endpoint);
    },
};

export default newAboutAPI;
