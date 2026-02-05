import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertTriangle } from 'lucide-react';

const Grants = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language; // 'ru', 'en', или 'kg'

  // State для данных из API
  const [grants, setGrants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedGrant, setSelectedGrant] = useState(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  
  // State для формы заявки
  const [formData, setFormData] = useState({
    grant: '',
    project_title: '',
    principal_investigator: '',
    email: '',
    phone: '',
    department: '',
    team_members: '',
    project_description: '',
    budget: '',
    timeline: '',
    expected_results: '',
    files: null
  });

  // Функция для получения грантов из API
  const fetchGrants = async (endpoint = 'grants') => {
    try {
      setLoading(true);
      const response = await fetch(`https://med-backend-d61c905599c2.herokuapp.com/research/api/${endpoint}/`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // API может возвращать paginated результаты
      const grantsData = data.results || data;
      setGrants(grantsData);
      setError(null);
    } catch (err) {
      console.error('Error fetching grants:', err);
      setError(t('research.grants.errorLoading'));
      setGrants([]);
    } finally {
      setLoading(false);
    }
  };

  // Загрузка данных при монтировании компонента
  useEffect(() => {
    fetchGrants();
  }, []);

  // Функция для получения названия гранта на текущем языке
  const getGrantTitle = (grant) => {
    return grant[`title_${currentLang}`] || grant.title_ru;
  };

  // Функция для получения описания гранта на текущем языке
  const getGrantDescription = (grant) => {
    return grant[`description_${currentLang}`] || grant.description_ru;
  };

  // Функция для получения требований на текущем языке
  const getGrantRequirements = (grant) => {
    return grant[`requirements_${currentLang}`] || grant.requirements_ru;
  };

  // Функция для получения срока реализации на текущем языке
  const getGrantDuration = (grant) => {
    return grant[`duration_${currentLang}`] || grant.duration_ru;
  };

  // Фильтрация грантов по активной вкладке
  const filteredGrants = grants.filter(grant => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') return grant.status === 'active';
    if (activeTab === 'upcoming') return grant.status === 'upcoming';
    if (activeTab === 'closed') return grant.status === 'closed';
    return true;
  });

  // Обработчик смены вкладки с загрузкой соответствующих данных
  const handleTabChange = async (tab) => {
    setActiveTab(tab);
    
    // Загружаем данные в зависимости от вкладки
    if (tab === 'active') {
      await fetchGrants('grants/active');
    } else if (tab === 'upcoming') {
      await fetchGrants('grants/upcoming');
    } else {
      await fetchGrants('grants');
    }
  };

  // Обработчик изменения формы
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  // Отправка заявки на грант
  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    
    try {
      const formDataToSend = new FormData();
      
      // Добавляем все поля формы
      Object.keys(formData).forEach(key => {
        if (formData[key] && key !== 'files') {
          formDataToSend.append(key, formData[key]);
        }
      });
      
      // Добавляем файл, если есть
      if (formData.files) {
        formDataToSend.append('files', formData.files);
      }

      const response = await fetch('https://med-backend-d61c905599c2.herokuapp.com/research/api/grant-applications/', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Ошибка при отправке заявки');
      }

      const result = await response.json();
      alert(t('research.grants.applicationSuccess'));
      
      // Сброс формы
      setFormData({
        grant: '',
        project_title: '',
        principal_investigator: '',
        email: '',
        phone: '',
        department: '',
        team_members: '',
        project_description: '',
        budget: '',
        timeline: '',
        expected_results: '',
        files: null
      });
      
      setShowApplicationForm(false);
    } catch (err) {
      console.error('Error submitting application:', err);
      alert(t('research.grants.applicationError') + ': ' + err.message);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'active': { text: t('research.grants.statusLabels.active'), color: 'bg-green-100 text-green-800' },
      'upcoming': { text: t('research.grants.statusLabels.upcoming'), color: 'bg-blue-100 text-blue-800' },
      'closed': { text: t('research.grants.statusLabels.closed'), color: 'bg-red-100 text-red-800' }
    };
    return statusConfig[status] || { text: '', color: '' };
  };

  const getCategoryColor = (category) => {
    const colors = {
      'youth': 'bg-purple-100 text-purple-800',
      'international': 'bg-indigo-100 text-indigo-800',
      'fundamental': 'bg-blue-100 text-blue-800',
      'innovative': 'bg-teal-100 text-teal-800',
      'clinical': 'bg-orange-100 text-orange-800',
      'applied': 'bg-yellow-100 text-yellow-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(currentLang === 'ru' ? 'ru-RU' : currentLang === 'kg' ? 'ky-KG' : 'en-US');
  };

  // Показать индикатор загрузки
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-lg">{t('research.grants.loading')}</span>
      </div>
    );
  }

  // Показать ошибку
  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 text-lg mb-4">{error}</div>
        <button 
          onClick={() => fetchGrants()}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {t('research.grants.retry')}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Заголовок */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {t('research.grants.title')}
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          {t('research.grants.subtitle')}
        </p>
      </div>

      {/* Вкладки фильтрации */}
      <div className="mb-8">
        <nav className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {[
            { id: 'all', label: t('research.grants.tabs.all') },
            { id: 'active', label: t('research.grants.tabs.active') },
            { id: 'upcoming', label: t('research.grants.tabs.upcoming') },
            { id: 'closed', label: t('research.grants.tabs.closed') }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-blue-700 shadow'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Список грантов */}
      {filteredGrants.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">{t('research.grants.noGrants')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGrants.map((grant) => {
            const statusBadge = getStatusBadge(grant.status);
            const categoryColor = getCategoryColor(grant.category);

            return (
              <div
                key={grant.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200"
              >
                {/* Статус и категория */}
                <div className="flex justify-between items-start mb-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadge.color}`}>
                    {statusBadge.text}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryColor}`}>
                    {t(`research.grants.categories.${grant.category}`)}
                  </span>
                </div>

                {/* Название гранта */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {getGrantTitle(grant)}
                </h3>

                {/* Организация */}
                <p className="text-gray-600 text-sm mb-2">
                  <span className="font-medium">{t('research.grants.organization')}:</span> {grant.organization}
                </p>

                {/* Сумма */}
                <p className="text-gray-600 text-sm mb-2">
                  <span className="font-medium">{t('research.grants.amount')}:</span> {grant.amount}
                </p>

                {/* Дедлайн */}
                <p className="text-gray-600 text-sm mb-4">
                  <span className="font-medium">{t('research.grants.deadline')}:</span> {formatDate(grant.deadline)}
                  {grant.is_deadline_soon && (
                    <span className="ml-2 text-red-600 text-xs"><AlertTriangle className="w-5 h-5" /> {t('research.grants.deadlineSoon')}</span>
                  )}
                </p>

                {/* Кнопки */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => setSelectedGrant(grant)}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded text-sm hover:bg-blue-700 transition-colors"
                  >
                    {t('research.grants.viewDetails')}
                  </button>
                  {grant.status === 'active' && (
                    <button
                      onClick={() => {
                        setFormData(prev => ({ ...prev, grant: grant.id }));
                        setShowApplicationForm(true);
                      }}
                      className="bg-green-600 text-white py-2 px-4 rounded text-sm hover:bg-green-700 transition-colors"
                    >
                      {t('research.grants.apply')}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Модальное окно с деталями гранта */}
      {selectedGrant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Заголовок модального окна */}
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  {getGrantTitle(selectedGrant)}
                </h2>
                <button
                  onClick={() => setSelectedGrant(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                  ×
                </button>
              </div>

              {/* Основная информация */}
              <div className="space-y-4 mb-6">
                <div>
                  <span className="font-medium text-gray-700">{t('research.grants.organization')}:</span>
                  <span className="ml-2 text-gray-900">{selectedGrant.organization}</span>
                </div>
                
                <div>
                  <span className="font-medium text-gray-700">{t('research.grants.amount')}:</span>
                  <span className="ml-2 text-gray-900">{selectedGrant.amount}</span>
                </div>
                
                <div>
                  <span className="font-medium text-gray-700">{t('research.grants.deadline')}:</span>
                  <span className="ml-2 text-gray-900">{formatDate(selectedGrant.deadline)}</span>
                </div>
                
                <div>
                  <span className="font-medium text-gray-700">{t('research.grants.duration')}:</span>
                  <span className="ml-2 text-gray-900">{getGrantDuration(selectedGrant)}</span>
                </div>
              </div>

              {/* Описание */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('research.grants.description')}</h3>
                <p className="text-gray-700 leading-relaxed">{getGrantDescription(selectedGrant)}</p>
              </div>

              {/* Требования */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('research.grants.requirements')}</h3>
                <p className="text-gray-700 leading-relaxed">{getGrantRequirements(selectedGrant)}</p>
              </div>

              {/* Контакты */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('research.grants.contacts')}</h3>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium text-gray-700">Email:</span>
                    <a href={`mailto:${selectedGrant.contact}`} className="ml-2 text-blue-600 hover:text-blue-800">
                      {selectedGrant.contact}
                    </a>
                  </p>
                  {selectedGrant.website && (
                    <p>
                      <span className="font-medium text-gray-700">{t('research.grants.website')}:</span>
                      <a 
                        href={selectedGrant.website} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        {selectedGrant.website}
                      </a>
                    </p>
                  )}
                </div>
              </div>

              {/* Кнопки действий */}
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setSelectedGrant(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
                >
                  {t('research.grants.close')}
                </button>
                {selectedGrant.status === 'active' && (
                  <button
                    onClick={() => {
                      setFormData(prev => ({ ...prev, grant: selectedGrant.id }));
                      setSelectedGrant(null);
                      setShowApplicationForm(true);
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    {t('research.grants.apply')}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Форма подачи заявки */}
      {showApplicationForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {t('research.grants.applicationForm.title')}
                </h2>
                <button
                  onClick={() => setShowApplicationForm(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmitApplication} className="space-y-6">
                {/* Название проекта */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('research.grants.applicationForm.projectTitle')} *
                  </label>
                  <input
                    type="text"
                    name="project_title"
                    value={formData.project_title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Руководитель проекта */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('research.grants.applicationForm.principalInvestigator')} *
                  </label>
                  <input
                    type="text"
                    name="principal_investigator"
                    value={formData.principal_investigator}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Email и телефон в одной строке */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('research.grants.applicationForm.phone')}
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Кафедра */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('research.grants.applicationForm.department')} *
                  </label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Члены команды */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('research.grants.applicationForm.teamMembers')}
                  </label>
                  <textarea
                    name="team_members"
                    value={formData.team_members}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={t('research.grants.applicationForm.teamMembersPlaceholder')}
                  />
                </div>

                {/* Описание проекта */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('research.grants.applicationForm.projectDescription')} *
                  </label>
                  <textarea
                    name="project_description"
                    value={formData.project_description}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Бюджет и сроки в одной строке */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('research.grants.applicationForm.budget')} *
                    </label>
                    <input
                      type="number"
                      name="budget"
                      value={formData.budget}
                      onChange={handleInputChange}
                      required
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('research.grants.applicationForm.timeline')} *
                    </label>
                    <input
                      type="number"
                      name="timeline"
                      value={formData.timeline}
                      onChange={handleInputChange}
                      required
                      min="1"
                      max="60"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Ожидаемые результаты */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('research.grants.applicationForm.expectedResults')} *
                  </label>
                  <textarea
                    name="expected_results"
                    value={formData.expected_results}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Файлы */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('research.grants.applicationForm.attachments')}
                  </label>
                  <input
                    type="file"
                    name="files"
                    onChange={handleInputChange}
                    accept=".pdf,.doc,.docx,.txt"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {t('research.grants.applicationForm.fileFormats')}
                  </p>
                </div>

                {/* Кнопки */}
                <div className="flex justify-end space-x-3 pt-6">
                  <button
                    type="button"
                    onClick={() => setShowApplicationForm(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
                  >
                    {t('research.grants.applicationForm.cancel')}
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    {t('research.grants.applicationForm.submit')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Grants;
