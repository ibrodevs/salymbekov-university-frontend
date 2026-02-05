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

export const hsmAPI = {
    // Get all accreditations
    getAccreditations: async (params = {}) => {
        try {
            const response = await api.get("/hsm/accreditations/", { params });
            return response.data;
        } catch (error) {
            console.error("Error fetching accreditations:", error);
            throw error;
        }
    },

    // Get accreditations by type
    getAccreditationsByType: async () => {
        try {
            const response = await api.get("/api/hsm/accreditations/by_type/");
            return response.data;
        } catch (error) {
            console.error("Error fetching accreditations by type:", error);
            throw error;
        }
    },

    // Get single accreditation
    getAccreditation: async (id) => {
        try {
            const response = await api.get(`/api/hsm/accreditations/${id}/`);
            return response.data;
        } catch (error) {
            console.error("Error fetching accreditation:", error);
            throw error;
        }
    },

    // Get leadership
    getLeadership: async (params = {}) => {
        try {
            const response = await api.get("/api/hsm/leadership/", { params });
            return response.data;
        } catch (error) {
            console.error("Error fetching leadership:", error);
            throw error;
        }
    },

    // Get faculty
    getFaculty: async (params = {}) => {
        try {
            const response = await api.get("/api/hsm/faculty/", { params });
            return response.data;
        } catch (error) {
            console.error("Error fetching faculty:", error);
            throw error;
        }
    },

    // Get faculty by position
    getFacultyByPosition: async () => {
        try {
            const response = await api.get("/api/hsm/faculty/by_position/");
            return response.data;
        } catch (error) {
            console.error("Error fetching faculty by position:", error);
            throw error;
        }
    },
};

export default hsmAPI;