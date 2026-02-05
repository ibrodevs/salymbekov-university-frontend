import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://med-backend-d61c905599c2.herokuapp.com';

const api = axios.create({
    baseURL: `${API_BASE_URL}/api`,
    timeout: 10000,
});

// Student Life API
export const studentLifeAPI = {
    // Get all instructions/guides
    getInstructions: () => api.get('/student-life/api/data/instructions_data/'),

    // Get all partner organizations
    getPartnerOrganizations: () => api.get('/student-life/api/partner-organizations/'),

    // Get all student appeals
    getStudentAppeals: () => api.get('/student-life/api/student-appeals/'),

    // Create a new student appeal
    createStudentAppeal: (data) => api.post('/student-life/api/student-appeals/', data),

    // Get all photo albums
    getPhotoAlbums: () => api.get('/student-life/api/photo-albums/'),

    // Get all photos
    getPhotos: () => api.get('/student-life/api/photos/'),

    // Get all videos
    getVideos: () => api.get('/student-life/api/videos/'),

    // Get statistics
    getStatistics: () => api.get('/student-life/api/statistics/'),

    // Get internships data
    getInternshipsData: () => api.get('/student-life/api/data/internships_data/'),

    // Get academic mobility data
    getAcademicMobilityData: () => api.get('/student-life/api/data/academic_mobility_data/'),

    // Get regulations data
    getRegulationsData: () => api.get('/student-life/api/data/regulations_data/'),

    // Get gallery data
    getGalleryData: () => api.get('/student-life/api/data/gallery_data/'),

    // Get life overview data
    getLifeOverviewData: () => api.get('/student-life/api/data/life_overview_data/'),

    // Download file
    downloadFile: (fileId) => api.get(`/student-life/api/download/${fileId}/`, {
        responseType: 'blob'
    }),
};

export default api;