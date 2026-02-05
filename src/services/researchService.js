import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://med-backend-d61c905599c2.herokuapp.com';

console.log('🔧 ResearchService Debug:', {
    VITE_API_URL: import.meta.env.VITE_API_URL,
    API_BASE_URL,
    fullBaseURL: `${API_BASE_URL}/research/api/`
});

// Create axios instance
const api = axios.create({
    baseURL: `${API_BASE_URL}/research/api/`,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add response interceptor for error handling
api.interceptors.request.use(
    (config) => {
        console.log('🚀 API Request:', config.method?.toUpperCase(), config.url, config);
        return config;
    },
    (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        console.log('✅ API Response:', response.status, response.config.url, response.data);
        return response;
    },
    (error) => {
        console.error('❌ API Error:', error.response?.status, error.response?.data, error.message);
        return Promise.reject(error);
    }
);

export const researchAPI = {
    // Research Management endpoints
    getManagementByType: async () => {
        try {
            const response = await api.get('management/');
            return response.data;
        } catch (error) {
            console.error('Error fetching management data:', error);
            throw error;
        }
    },

    getScientificCouncils: async () => {
        try {
            const response = await api.get('councils/');
            return response.data;
        } catch (error) {
            console.error('Error fetching councils data:', error);
            throw error;
        }
    },

    getCommissionsByType: async () => {
        try {
            const response = await api.get('commissions/');
            return response.data;
        } catch (error) {
            console.error('Error fetching commissions data:', error);
            throw error;
        }
    },

    // Grants endpoints
    getGrants: async () => {
        try {
            console.log('🔍 Fetching grants...');
            const response = await api.get('grants/');
            console.log('📊 Grants response:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ Error fetching grants:', error);
            throw error;
        }
    },

    getActiveGrants: async () => {
        try {
            const response = await api.get('grants/active/');
            return response.data;
        } catch (error) {
            console.error('Error fetching active grants:', error);
            throw error;
        }
    },

    getUpcomingGrants: async () => {
        try {
            const response = await api.get('grants/upcoming/');
            return response.data;
        } catch (error) {
            console.error('Error fetching upcoming grants:', error);
            throw error;
        }
    },

    getGrantsDeadlineSoon: async () => {
        try {
            const response = await api.get('grants/deadline_soon/');
            return response.data;
        } catch (error) {
            console.error('Error fetching grants with deadline soon:', error);
            throw error;
        }
    },

    // Conferences endpoints
    getConferences: async () => {
        try {
            const response = await api.get('conferences/');
            return response.data;
        } catch (error) {
            console.error('Error fetching conferences:', error);
            throw error;
        }
    },

    getUpcomingConferences: async () => {
        try {
            const response = await api.get('conferences/upcoming/');
            return response.data;
        } catch (error) {
            console.error('Error fetching upcoming conferences:', error);
            throw error;
        }
    },

    getRegistrationOpenConferences: async () => {
        try {
            const response = await api.get('conferences/registration_open/');
            return response.data;
        } catch (error) {
            console.error('Error fetching registration open conferences:', error);
            throw error;
        }
    },

    // Scientific Journals endpoints
    getScientificJournals: async () => {
        try {
            console.log('🔍 Fetching scientific journals...');
            const response = await api.get('journals/');
            console.log('📚 Journals response:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ Error fetching scientific journals:', error);
            throw error;
        }
    },

    getFeaturedJournals: async () => {
        try {
            const response = await api.get('journals/featured/');
            return response.data;
        } catch (error) {
            console.error('Error fetching featured journals:', error);
            throw error;
        }
    },

    getJournalDetails: async (journalId) => {
        try {
            const response = await api.get(`journals/${journalId}/`);
            return response.data;
        } catch (error) {
            console.error('Error fetching journal details:', error);
            throw error;
        }
    },

    // Journal Issues endpoints
    getJournalIssues: async () => {
        try {
            const response = await api.get('journal-issues/');
            return response.data;
        } catch (error) {
            console.error('Error fetching journal issues:', error);
            throw error;
        }
    },

    getJournalIssuesByJournal: async (journalId) => {
        try {
            const response = await api.get(`journal-issues/by_journal/?journal_id=${journalId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching journal issues by journal:', error);
            throw error;
        }
    },

    getJournalIssueDetails: async (issueId) => {
        try {
            const response = await api.get(`journal-issues/${issueId}/`);
            return response.data;
        } catch (error) {
            console.error('Error fetching journal issue details:', error);
            throw error;
        }
    }
};

export default researchAPI;

// Research API