import axios from 'axios';

const API_URL = 'https://med-backend-d61c905599c2.herokuapp.com/api/teachers/';
const API_MANAGEMENT_URL = 'https://med-backend-d61c905599c2.herokuapp.com/api/management/';

export const getTeachers = async () => {
    try {
        const response = await axios.get(API_URL);
        console.log("Teachers API response:", response.data);
        return response.data.results || [];
    } catch (error) {
        console.error("Error fetching teachers:", error);
        return [];
    }
};

export const getManagement = async () => {
    try {
        console.log('Making request to:', API_MANAGEMENT_URL);
        const response = await axios.get(API_MANAGEMENT_URL);
        console.log("Management API response:", response.data);
        return response.data.results || [];
    } catch (error) {
        console.error("Error fetching management:", error);
        console.error("Error details:", error.response?.data || error.message);
        return [];
    }
};
