// EResources API Service
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://med-backend-d61c905599c2.herokuapp.com';

/**
 * Получить статистику EResources
 */
export const fetchEResourcesStatistics = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/student-life/api/e-resources/statistics/`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching EResources statistics:', error);
        throw error;
    }
};

/**
 * Получить категории EResources
 */
export const fetchEResourcesCategories = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/student-life/api/e-resource-categories/`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching EResources categories:', error);
        throw error;
    }
};

/**
 * Получить все EResources
 */
export const fetchEResources = async (params = {}) => {
    try {
        const queryParams = new URLSearchParams();

        // Добавляем параметры поиска и фильтрации
        if (params.search) {
            queryParams.append('search', params.search);
        }
        if (params.category && params.category !== 'all') {
            queryParams.append('category', params.category);
        }
        if (params.status) {
            queryParams.append('status', params.status);
        }
        if (params.is_popular !== undefined) {
            queryParams.append('is_popular', params.is_popular);
        }
        if (params.ordering) {
            queryParams.append('ordering', params.ordering);
        }

        const url = `${API_BASE_URL}/api/student-life/api/e-resources/${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching EResources:', error);
        throw error;
    }
};

/**
 * Получить популярные EResources
 */
export const fetchPopularEResources = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/student-life/api/e-resources/popular/`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching popular EResources:', error);
        throw error;
    }
};

/**
 * Получить EResources сгруппированные по категориям
 */
export const fetchEResourcesByCategory = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/student-life/api/e-resources/by_category/`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching EResources by category:', error);
        throw error;
    }
};

/**
 * Получить конкретный EResource по ID
 */
export const fetchEResource = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/student-life/api/e-resources/${id}/`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Error fetching EResource ${id}:`, error);
        throw error;
    }
};

/**
 * Утилита для определения языка и получения соответствующих полей
 */
export const getLocalizedField = (item, fieldName, language = 'ru') => {
    const suffix = language === 'ru' ? '_ru' : language === 'kg' ? '_kg' : '_en';
    return item[`${fieldName}${suffix}`] || item[`${fieldName}_en`] || item[`${fieldName}_ru`] || '';
};

/**
 * Хук для определения текущего языка (если используется i18n)
 */
export const getCurrentLanguage = () => {
    // Это может быть интегрировано с i18n системой
    return localStorage.getItem('language') || 'ru';
};