import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://med-backend-d61c905599c2.herokuapp.com";

// Create axios instance with default config
const api = axios.create({
    baseURL: `${API_BASE_URL}/api`,
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
    (response) => response,
    (error) => {
        console.error("API Error:", error.response?.data || error.message);
        return Promise.reject(error);
    }
);

// Leadership API
export const leadershipAPI = {
    // Получить всех руководителей
    getAll: () => api.get('/hsm/leadership/'),

    // Получить конкретного руководителя
    getById: (id) => api.get(`/hsm/leadership/${id}/`),

    // Получить только директоров
    getDirectors: () => api.get('/hsm/leadership/directors/'),

    // Получить заведующих кафедрами
    getDepartmentHeads: () => api.get('/hsm/leadership/department_heads/'),

    // Получить руководство по департаменту
    getByDepartment: (department) => api.get(`/hsm/leadership/by_department/?department=${department}`),
};

export default api;