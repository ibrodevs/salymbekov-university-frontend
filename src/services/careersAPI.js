import i18n from '../i18n';

const API_BASE_URL = 'https://med-backend-d61c905599c2.herokuapp.com/api/careers';

// Get current language from i18n
const getCurrentLanguage = () => {
  let currentLang = 'ru'; // default
  
  try {
    // First try to get from i18next instance
    if (i18n && i18n.language) {
      currentLang = i18n.language;
      console.log('Language from i18n instance:', currentLang);
    } else if (i18n && i18n.resolvedLanguage) {
      currentLang = i18n.resolvedLanguage;
      console.log('Language from i18n.resolvedLanguage:', currentLang);
    } else if (typeof window !== 'undefined' && window.i18n) {
      currentLang = window.i18n.language;
      console.log('Language from window.i18n:', currentLang);
    } else if (typeof document !== 'undefined' && document.documentElement.lang) {
      currentLang = document.documentElement.lang;
      console.log('Language from document.documentElement.lang:', currentLang);
    } else {
      // Try localStorage as last resort
      const stored = localStorage.getItem('i18nextLng');
      if (stored && stored !== 'undefined') {
        currentLang = stored;
        console.log('Language from localStorage:', currentLang);
      } else {
        // Fallback to browser language or default
        const browserLang = navigator.language.split('-')[0];
        currentLang = ['ru', 'en', 'kg', 'ky'].includes(browserLang) ? browserLang : 'ru';
        console.log('Language from browser or default:', currentLang);
      }
    }
  } catch (error) {
    console.error('Error getting language:', error);
    currentLang = 'ru';
  }
  
  // Handle language variants
  if (currentLang.startsWith('kg') || currentLang.startsWith('ky')) {
    currentLang = 'ky';
  } else if (currentLang.startsWith('en')) {
    currentLang = 'en';  
  } else {
    currentLang = 'ru';
  }
  
  console.log('Final language for API:', currentLang);
  return currentLang;
};

// Utility function to handle fetch requests
const apiFetch = async (url, options = {}) => {
  try {
    const currentLang = getCurrentLanguage();
    console.log('Making API request to:', url);
    console.log('With language:', currentLang);
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': currentLang,
        ...options.headers,
      },
      ...options,
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
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

// API methods
const careersAPI = {
  // Get all categories
  getCategories: () => apiFetch(`${API_BASE_URL}/categories/`),
  
  // Get all departments
  getDepartments: () => apiFetch(`${API_BASE_URL}/departments/`),
  
  // Get vacancies with optional filters
  getVacancies: (params = {}) => {
    const searchParams = new URLSearchParams(params);
    const url = `${API_BASE_URL}/vacancies/${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    return apiFetch(url);
  },
  
  // Get single vacancy by ID
  getVacancy: (id) => apiFetch(`${API_BASE_URL}/vacancies/${id}/`),
  
  // Submit job application
  submitApplication: (formData) => apiFetch(`${API_BASE_URL}/applications/`, {
    method: 'POST',
    body: formData,
    headers: {
      // Don't set Content-Type for FormData - let browser set it with boundary
    }
  }),
  
  // Get vacancy statistics
  getVacancyStats: () => apiFetch(`${API_BASE_URL}/statistics/`),
};

export default careersAPI;
