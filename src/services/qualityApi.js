// API функции для работы с системой менеджмента качества
const API_BASE_URL = 'https://med-backend-d61c905599c2.herokuapp.com/api';

/**
 * Получить все данные системы менеджмента качества
 */
export const getQualityManagementSystem = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/hsm/quality/system/`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Ошибка получения данных системы качества:', error);
    throw error;
  }
};

/**
 * Получить настройки системы качества
 */
export const getQualitySettings = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/hsm/quality/settings/`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Ошибка получения настроек системы качества:', error);
    throw error;
  }
};

/**
 * Получить принципы качества
 */
export const getQualityPrinciples = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/hsm/quality/principles/`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.results || data;
  } catch (error) {
    console.error('Ошибка получения принципов качества:', error);
    throw error;
  }
};

/**
 * Получить документы качества
 */
export const getQualityDocuments = async (category = null) => {
  try {
    let url = `${API_BASE_URL}/hsm/quality/documents/`;
    if (category) {
      url += `?category=${category}`;
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.results || data;
  } catch (error) {
    console.error('Ошибка получения документов качества:', error);
    throw error;
  }
};

/**
 * Получить документы по категориям
 */
export const getQualityDocumentsByCategory = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/hsm/quality/documents/by_category/`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Ошибка получения документов по категориям:', error);
    throw error;
  }
};

/**
 * Получить группы процессов качества
 */
export const getQualityProcessGroups = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/hsm/quality/process-groups/`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.results || data;
  } catch (error) {
    console.error('Ошибка получения групп процессов качества:', error);
    throw error;
  }
};

/**
 * Получить процессы качества
 */
export const getQualityProcesses = async (groupId = null) => {
  try {
    let url = `${API_BASE_URL}/hsm/quality/processes/`;
    if (groupId) {
      url += `?group=${groupId}`;
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.results || data;
  } catch (error) {
    console.error('Ошибка получения процессов качества:', error);
    throw error;
  }
};

/**
 * Получить статистику качества
 */
export const getQualityStatistics = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/hsm/quality/statistics/`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.results || data;
  } catch (error) {
    console.error('Ошибка получения статистики качества:', error);
    throw error;
  }
};

/**
 * Получить преимущества качества
 */
export const getQualityAdvantages = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/hsm/quality/advantages/`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.results || data;
  } catch (error) {
    console.error('Ошибка получения преимуществ качества:', error);
    throw error;
  }
};

/**
 * Увеличить счетчик скачиваний документа
 */
export const incrementDocumentDownload = async (documentId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/hsm/quality/documents/${documentId}/download/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Ошибка увеличения счетчика скачиваний:', error);
    throw error;
  }
};

/**
 * Функция для получения переводов в зависимости от языка
 */
export const getLocalizedField = (item, fieldName, language = 'ru') => {
  if (!item) return '';

  const fieldMap = {
    'ru': fieldName,
    'kg': `${fieldName}_kg`, // Кыргызский язык
    'en': `${fieldName}_en`
  };

  const localizedField = fieldMap[language] || fieldName;
  const result = item[localizedField] || item[fieldName] || '';

  return result;
};