import axios from "axios";

const API_BASE_URL = "https://med-backend-d61c905599c2.herokuapp.com/api/about-section";

// Create axios instance with default config - Updated 2025-09-29
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Create a separate instance for research API
const researchAPI = axios.create({
  baseURL: "https://med-backend-d61c905599c2.herokuapp.com/research/api",
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

// Add the same interceptor for research API
researchAPI.interceptors.request.use(
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
      console.error("Error setting up request:", error.message);
    }

    return Promise.reject(error);
  }
);

// Add the same response interceptor for research API
researchAPI.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("Research API Error:", error);

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
          console.error("Research API Error:", data?.error || error.message);
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error("Network error - no response received");
    } else {
      // Something else happened
      console.error("Error setting up request:", error.message);
    }

    return Promise.reject(error);
  }
);

/**
 * Accreditations API
 */
export const accreditationsAPI = {
  /**
   * Get all accreditations for frontend Status component
   * @param {string} type - Filter by accreditation type ('all', 'government', 'international', etc.)
   * @returns {Promise<Array>} Array of accreditation objects
   */
  getAccreditations: async (type = "all") => {
    try {
      const response = await api.get(
        "/about-section/accreditations/frontend/",
        {
          params: { type },
        }
      );

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(
          response.data.error || "Failed to fetch accreditations"
        );
      }
    } catch (error) {
      console.error("Error fetching accreditations:", error);
      throw error;
    }
  },

  /**
   * Get detailed information about specific accreditation
   * @param {number} id - Accreditation ID
   * @returns {Promise<Object>} Accreditation object
   */
  getAccreditationDetail: async (id) => {
    try {
      const response = await api.get(`/about-section/accreditations/${id}/`);

      if (response.data) {
        return response.data;
      } else {
        throw new Error("Failed to fetch accreditation details");
      }
    } catch (error) {
      console.error("Error fetching accreditation details:", error);
      throw error;
    }
  },

  /**
   * Get accreditation types for filtering
   * @returns {Promise<Array>} Array of accreditation types
   */
  getAccreditationTypes: async () => {
    try {
      const response = await api.get("/about-section/accreditations/");

      if (response.data && response.data.results) {
        // Extract unique types
        const types = [
          ...new Set(
            response.data.results.map((acc) => acc.accreditation_type)
          ),
        ];
        return types;
      } else {
        return [];
      }
    } catch (error) {
      console.error("Error fetching accreditation types:", error);
      return [];
    }
  },
};

/**
 * Councils API
 */
export const councilsAPI = {
  /**
   * Get all councils data for frontend Advices component
   * @returns {Promise<Object>} Object with sections_data and sections_list
   */
  getCouncils: async () => {
    try {
      const response = await researchAPI.get("/councils/");
      console.log("API Response:", response.data); // Debug log

      if (response.data && response.data.results) {
        const councils = response.data.results;

        // Transform the data to match frontend expectations
        const sectionsData = {};
        const sectionsList = [];

        councils.forEach((council, index) => {
          const councilId = council.id.toString();

          // Get current language
          let currentLanguage = "ru";
          if (typeof localStorage !== "undefined") {
            currentLanguage = localStorage.getItem("i18nextLng") || "ru";
          }

          // Map language suffixes
          const langSuffix = currentLanguage === "en" ? "_en" :
                            currentLanguage === "kg" ? "_kg" : "_ru";

          // FIX: Safely handle members data - the main issue
          let members = [];
          try {
            // Check if members data exists in the language-specific field
            const membersData = council[`members${langSuffix}`];
            
            if (Array.isArray(membersData)) {
              // If it's already an array, use it directly
              members = membersData.map((member, memberIndex) => ({
                id: `${councilId}_member_${memberIndex}`,
                name: typeof member === "string" ? member : member.name || member || `Member ${memberIndex + 1}`,
                position: typeof member === "object" ? member.position || "" : "",
                department: typeof member === "object" ? member.department || "" : "",
                bio: typeof member === "object" ? member.bio || "" : "",
                email: typeof member === "object" ? member.email || "" : "",
                phone: typeof member === "object" ? member.phone || "" : "",
                photo: typeof member === "object" ? member.photo || null : null,
              }));
            } else if (membersData && typeof membersData === 'object') {
              // If it's a single object, wrap it in array
              members = [{
                id: `${councilId}_member_0`,
                name: membersData.name || membersData || "Member",
                position: membersData.position || "",
                department: membersData.department || "",
                bio: membersData.bio || "",
                email: membersData.email || "",
                phone: membersData.phone || "",
                photo: membersData.photo || null,
              }];
            } else if (typeof membersData === 'string') {
              // If it's a string, create a basic member object
              members = [{
                id: `${councilId}_member_0`,
                name: membersData,
                position: "",
                department: "",
                bio: "",
                email: "",
                phone: "",
                photo: null,
              }];
            }
          } catch (error) {
            console.warn(`Error processing members for council ${councilId}:`, error);
            members = [];
          }

          // Add chairman and secretary as members if they exist
          const chairman = council[`chairman${langSuffix}`];
          const secretary = council[`secretary${langSuffix}`];

          if (chairman) {
            members.unshift({
              id: `${councilId}_chairman`,
              name: chairman,
              position: currentLanguage === "en" ? "Chairman" :
                      currentLanguage === "kg" ? "Төрага" : "Председатель",
              department: "",
              bio: "",
              email: council.contact_email || "",
              phone: council.contact_phone || "",
              photo: null,
            });
          }

          if (secretary) {
            members.push({
              id: `${councilId}_secretary`,
              name: secretary,
              position: currentLanguage === "en" ? "Secretary" :
                      currentLanguage === "kg" ? "Катчы" : "Секретарь",
              department: "",
              bio: "",
              email: council.contact_email || "",
              phone: council.contact_phone || "",
              photo: null,
            });
          }

          // Create section data
          sectionsData[councilId] = {
            id: councilId,
            title: council[`name${langSuffix}`] || council.name_ru || `Council ${index + 1}`,
            description: council[`description${langSuffix}`] || council.description_ru || "",
            members: members,
            documents: [], // No documents in the current model
            responsibilities: council[`responsibilities${langSuffix}`] || "",
            meetingSchedule: council[`meeting_schedule${langSuffix}`] || "",
          };

          // Create section list item
          sectionsList.push({
            id: councilId,
            name: council[`name${langSuffix}`] || council.name_ru || `Council ${index + 1}`,
          });
        });

        console.log("Processed sections data:", { sectionsData, sectionsList }); // Debug log

        return {
          sectionsData: sectionsData,
          sectionsList: sectionsList,
          count: councils.length,
        };
      } else {
        console.warn("No results in API response:", response.data);
        // Return empty data structure instead of throwing error
        return {
          sectionsData: {},
          sectionsList: [],
          count: 0,
        };
      }
    } catch (error) {
      console.error("Error fetching councils:", error);
      // Return empty data structure on error
      return {
        sectionsData: {},
        sectionsList: [],
        count: 0,
      };
    }
  },
};

/**
 * About Section API (for other components if needed)
 */
export const aboutSectionAPI = {
  /**
   * Get about section with partners
   * @returns {Promise<Object>} About section with partners data
   */
  getAboutWithPartners: async () => {
    try {
      const response = await api.get("/about-section/about-with-partners/");

      if (response.data.success) {
        return {
          aboutSection: response.data.about_section,
          partners: response.data.partners,
          partnersCount: response.data.partners_count,
        };
      } else {
        throw new Error(response.data.error || "Failed to fetch about section");
      }
    } catch (error) {
      console.error("Error fetching about section with partners:", error);
      throw error;
    }
  },

  /**
   * Get about sections list
   * @returns {Promise<Array>} Array of about sections
   */
  getAboutSections: async () => {
    try {
      const response = await api.get("/about-section/about-sections/");

      if (response.data && response.data.results) {
        return response.data.results;
      } else {
        return [];
      }
    } catch (error) {
      console.error("Error fetching about sections:", error);
      return [];
    }
  },
};

/**
 * Utility functions
 */
export const aboutUtils = {
  /**
   * Format date for display
   * @param {string} dateString - Date string from API
   * @returns {string} Formatted date
   */
  formatDate: (dateString) => {
    if (!dateString) return "";

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("ru-RU", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    } catch {
      return dateString;
    }
  },

  /**
   * Get file extension from filename
   * @param {string} filename - Filename
   * @returns {string} File extension
   */
  getFileExtension: (filename) => {
    if (!filename) return "";
    return filename.split(".").pop().toUpperCase();
  },

  /**
   * Handle download of documents
   * @param {string} fileUrl - File URL
   * @param {string} filename - Filename for download
   */
  downloadFile: (fileUrl, filename) => {
    try {
      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = filename || "document";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading file:", error);
      // Fallback: open in new tab
      window.open(fileUrl, "_blank");
    }
  },

  // New API methods for About section

  /**
   * Get founders data
   * @param {string} language - Language code (ru, kg, en)
   * @returns {Promise} Axios response with founders data
   */
  getFounders: (language = null) => {
    const endpoint = `/founders/frontend/`;
    return api.get(endpoint);
  },

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
   * Get structure hierarchy
   * @param {string} language - Language code (ru, kg, en)
   * @returns {Promise} Axios response with hierarchy data
   */
  getStructureHierarchy: (language = null) => {
    const endpoint = language
      ? `/structure/hierarchy/?lang=${language}`
      : `/structure/hierarchy/`;
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
   * Get featured achievements
   * @param {string} language - Language code (ru, kg, en)
   * @returns {Promise} Axios response with featured achievements
   */
  getFeaturedAchievements: (language = null) => {
    const endpoint = language
      ? `/achievements/featured/?lang=${language}`
      : `/achievements/featured/`;
    return api.get(endpoint);
  },

  /**
   * Get achievement categories
   * @returns {Promise} Axios response with categories list
   */
  getAchievementCategories: () => {
    return api.get(`/achievements/categories/`);
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
   * Get structure departments by type
   * @param {string} departmentType - Type of departments (leadership, faculty, etc.)
   * @param {string} language - Language code (ru, kg, en)
   * @returns {Promise} Axios response with departments data
   */
  getDepartmentsByType: (departmentType, language = null) => {
    let endpoint = `/structure/by_type/?type=${departmentType}`;
    if (language) {
      endpoint += `&lang=${language}`;
    }
    return api.get(endpoint);
  },
};

// Export default api instance for custom requests
export default api;
