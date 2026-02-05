// API сервис для работы с данными ВШМ (Высшая школа медицины)

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://med-backend-d61c905599c2.herokuapp.com';


class HSMService {
  /**
   * Получить информацию о ВШМ (Высшая школа медицины)
   */
  async getHSMInfo() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/hsm/info/`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.results || data;
    } catch (error) {
      console.error('Error fetching HSM info:', error);
      throw error;
    }
  }

  /**
   * Получить все программы обучения
   */
  async getPrograms(params = {}) {
    try {
      const queryParams = new URLSearchParams(params);
      const response = await fetch(`${API_BASE_URL}/api/hsm/programs/?${queryParams}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.results || data;
    } catch (error) {
      console.error('Error fetching programs:', error);
      throw error;
    }
  }

  /**
   * Получить программы бакалавриата медицинских специальностей
   */
  async getBachelorPrograms() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/hsm/programs/bachelor/`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching bachelor programs:', error);
      throw error;
    }
  }

  /**
   * Получить программы магистратуры по медицинским специальностям
   */
  async getMasterPrograms() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/hsm/programs/master/`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching master programs:', error);
      throw error;
    }
  }

  /**
   * Получить программу по ID
   */
  async getProgram(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/hsm/programs/${id}/`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching program:', error);
      throw error;
    }
  }

  /**
   * Получить весь профессорско-преподавательский состав
   */
  async getFaculty(params = {}) {
    try {
      const queryParams = new URLSearchParams(params);
      const url = `${API_BASE_URL}/api/hsm/faculty/?${queryParams}`;
      console.log('HSM Service: Fetching faculty from URL:', url);
      const response = await fetch(url);
      console.log('HSM Service: Response status:', response.status);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('HSM Service: Faculty data received:', data);
      return data.results || data;
    } catch (error) {
      console.error('Error fetching faculty:', error);
      throw error;
    }
  }

  /**
   * Получить преподавателей по должностям
   */
  async getFacultyByPosition() {
    try {
      const url = `${API_BASE_URL}/api/hsm/faculty/by_position/`;
      console.log('HSM Service: Fetching faculty by position from URL:', url);
      const response = await fetch(url);
      console.log('HSM Service: Response status for by_position:', response.status);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('HSM Service: Faculty by position data received:', data);
      return data;
    } catch (error) {
      console.error('Error fetching faculty by position:', error);
      throw error;
    }
  }

  /**
   * Получить преподавателя по ID
   */
  async getFacultyMember(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/hsm/faculty/${id}/`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching faculty member:', error);
      throw error;
    }
  }

  /**
   * Поиск преподавателей
   */
  async searchFaculty(searchQuery) {
    try {
      const params = new URLSearchParams({ search: searchQuery });
      const response = await fetch(`${API_BASE_URL}/api/hsm/faculty/?${params}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.results || data;
    } catch (error) {
      console.error('Error searching faculty:', error);
      throw error;
    }
  }

  /**
   * Получить все аккредитации
   */
  async getAccreditations(params = {}) {
    try {
      const queryParams = new URLSearchParams(params);
      const response = await fetch(`${API_BASE_URL}/api/hsm/accreditations/?${queryParams}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.results || data;
    } catch (error) {
      console.error('Error fetching accreditations:', error);
      throw error;
    }
  }

  /**
   * Получить аккредитации по типам
   */
  async getAccreditationsByType() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/hsm/accreditations/by_type/`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching accreditations by type:', error);
      throw error;
    }
  }

  /**
   * Получить только действующие аккредитации
   */
  async getValidAccreditations() {
    try {
      const params = new URLSearchParams({ valid_only: 'true' });
      const response = await fetch(`${API_BASE_URL}/api/hsm/accreditations/?${params}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.results || data;
    } catch (error) {
      console.error('Error fetching valid accreditations:', error);
      throw error;
    }
  }

  /**
   * Получить цели и результаты обучения
   */
  async getLearningGoals(params = {}) {
    try {
      const queryParams = new URLSearchParams(params);
      const response = await fetch(`${API_BASE_URL}/api/hsm/learning-goals/?${queryParams}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.results || data;
    } catch (error) {
      console.error('Error fetching learning goals:', error);
      throw error;
    }
  }

  /**
   * Получить цели обучения для конкретной программы
   */
  async getLearningGoalsForProgram(programId) {
    try {
      const params = new URLSearchParams({ program: programId });
      const response = await fetch(`${API_BASE_URL}/api/hsm/learning-goals/?${params}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.results || data;
    } catch (error) {
      console.error('Error fetching learning goals for program:', error);
      throw error;
    }
  }

  /**
   * Получить статистику ВШМ (Высшая школа медицины)
   */
  async getHSMStats() {
    try {
      const [programs, faculty, accreditations] = await Promise.all([
        this.getPrograms(),
        this.getFaculty(),
        this.getAccreditations()
      ]);

      return {
        totalPrograms: programs.length,
        bachelorPrograms: programs.filter(p => p.program_type === 'bachelor').length,
        masterPrograms: programs.filter(p => p.program_type === 'master').length,
        totalFaculty: faculty.length,
        professors: faculty.filter(f => f.position === 'professor').length,
        totalAccreditations: accreditations.length,
        validAccreditations: accreditations.filter(a => a.is_valid).length
      };
    } catch (error) {
      console.error('Error fetching HSM stats:', error);
      throw error;
    }
  }
}

// Создаем единственный экземпляр сервиса
const hsmService = new HSMService();

export default hsmService;
