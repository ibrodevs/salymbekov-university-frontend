import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MapPinIcon, DocumentArrowDownIcon, ClockIcon, CheckCircleIcon, ArrowRightIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { getMultilingualText, adaptMultilingualArray } from '../../utils/multilingualUtils';

const Internships = () => {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState('partners');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('all');
  const [data, setData] = useState({
    partner_organizations: [],
    requirements: {},
    report_templates: []
  });
  const [rawData, setRawData] = useState({
    partner_organizations: [],
    requirements: {},
    report_templates: []
  });

  // Загрузка данных с API
  useEffect(() => {
    fetchInternshipsData();
  }, []);

  // Обновление данных при смене языка
  useEffect(() => {
    if (rawData.partner_organizations.length > 0) {
      updateDataForCurrentLanguage();
    }
  }, [i18n.language, rawData]);

  const updateDataForCurrentLanguage = () => {
    // Адаптируем partner_organizations
    const adaptedPartnerOrganizations = rawData.partner_organizations.map(org => ({
      ...org,
      name: getMultilingualText(org, 'name', org.name),
      description: getMultilingualText(org, 'description', org.description)
    }));

    // Адаптируем report_templates
    const adaptedReportTemplates = rawData.report_templates.map(template => ({
      ...template,
      title: getMultilingualText(template, 'title', template.title),
      description: getMultilingualText(template, 'description', template.description)
    }));

    setData({
      ...rawData,
      partner_organizations: adaptedPartnerOrganizations,
      report_templates: adaptedReportTemplates
    });
  };

  const fetchInternshipsData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('https://med-backend-d61c905599c2.herokuapp.com/api/student-life/api/data/internships_data/');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      // Сохраняем оригинальные данные
      setRawData(result);

    } catch (err) {
      console.error('Ошибка загрузки данных практики:', err);
      setError('Не удалось загрузить данные. Попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (template) => {
    if (template.download_url) {
      // Используем специальный download endpoint для правильной UTF-8 кодировки
      window.open(template.download_url, '_blank');
    } else if (template.file && (template.file.startsWith('http') || template.file.startsWith('/media'))) {
      // Fallback для старых файлов
      const downloadUrl = template.file.startsWith('http') ? template.file : `https://med-backend-d61c905599c2.herokuapp.com${template.file}`;
      window.open(downloadUrl, '_blank');
    } else {
      // Показываем сообщение, что файл недоступен
      alert('Файл временно недоступен для загрузки');
    }
  };

  // Получить все специализации для фильтра
  const allSpecializations = [...new Set(
    data.partner_organizations?.flatMap(org =>
      org.specializations?.map(spec => spec.name)
    ).filter(Boolean)
  )];

  // Фильтрация организаций
  const filteredOrganizations = data.partner_organizations?.filter(org => {
    const matchesSearch = org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialization = selectedSpecialization === 'all' ||
      org.specializations?.some(spec => spec.name === selectedSpecialization);
    return matchesSearch && matchesSpecialization;
  });

  // Показать загрузку
  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-blue-600 rounded-full animate-ping"></div>
          </div>
          <p className="text-gray-600 font-medium text-lg mt-4">{t('studentLife.internships.loading')}</p>
          <p className="text-gray-400 mt-2">...</p>
        </div>
      </div>
    );
  }

  // Показать ошибку
  if (error) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50">
        <div className="text-center max-w-md mx-auto bg-white p-8 rounded-2xl shadow-xl">
          <div className="text-red-500 mb-4 relative">
            <div className="relative w-20 h-20 mx-auto">
              <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div className="absolute inset-0 bg-red-100 rounded-full animate-ping opacity-20"></div>
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{t('studentLife.internships.error')}</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchInternshipsData}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:-translate-y-1 shadow-md hover:shadow-lg"
          >
            {t('studentLife.internships.tryAgain')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            {t('studentLife.internships.title')}
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {t('studentLife.internships.subtitle')}
          </p>
        </div>

        {/* Анимированные табы */}
        <div className="mb-8 flex justify-center">
          <div className="bg-white p-1 rounded-2xl shadow-inner flex flex-wrap justify-center">
            <nav className="flex flex-wrap justify-center gap-2">
              <button
                onClick={() => setActiveTab('partners')}
                className={`py-3 px-6 rounded-xl font-medium text-sm transition-all duration-300 flex items-center ${activeTab === 'partners'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
              >
                <MapPinIcon className="w-5 h-5 mr-2" />
                {t('studentLife.internships.tabs.partners')}
              </button>
              <button
                onClick={() => setActiveTab('requirements')}
                className={`py-3 px-6 rounded-xl font-medium text-sm transition-all duration-300 flex items-center ${activeTab === 'requirements'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
              >
                <CheckCircleIcon className="w-5 h-5 mr-2" />
                {t('studentLife.internships.tabs.requirements')}
              </button>
              <button
                onClick={() => setActiveTab('templates')}
                className={`py-3 px-6 rounded-xl font-medium text-sm transition-all duration-300 flex items-center ${activeTab === 'templates'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
              >
                <DocumentArrowDownIcon className="w-5 h-5 mr-2" />
                {t('studentLife.internships.tabs.documents')}
              </button>

            </nav>
          </div>
        </div>

        {/* Контент табов */}
        <div className="transition-all duration-500">
          {activeTab === 'partners' && (
            <div className="space-y-8 animate-fade-in">

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredOrganizations?.map((org, index) => (
                  <div
                    key={org.id}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={org.logo_url || `https://source.unsplash.com/random/600x400?company,office,${index}`}
                        alt={org.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                      <div className="absolute bottom-4 left-4">
                        <h3 className="text-xl font-bold text-white">{org.name}</h3>
                        <div className="flex items-center text-white/90 mt-1">
                          <MapPinIcon className="w-4 h-4 mr-1" />
                          <span className="text-sm">{org.location} • {org.type}</span>
                        </div>
                      </div>
                      <div className="absolute top-4 right-4">
                        <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full">
                          {org.specializations?.[0]?.name}
                        </span>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-900 mb-2">{t('studentLife.internships.specializations')}:</h4>
                        <div className="flex flex-wrap gap-2">
                          {org.specializations?.map((spec, index) => (
                            <span
                              key={index}
                              className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 text-xs px-3 py-1.5 rounded-full"
                            >
                              {spec.name}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="border-t border-gray-100 pt-4 mt-4">
                        <h4 className="font-medium text-gray-900 mb-2">{t('studentLife.internships.contact')}:</h4>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p><strong>{t('common.contactPerson')}:</strong> {org.contact_person}</p>
                          <p><strong>{t('studentLife.internships.phone')}:</strong> {org.phone}</p>
                          <p><strong>{t('studentLife.internships.email')}:</strong> {org.email}</p>
                          {org.website && (
                            <p><strong>{t('common.website')}:</strong> <a href={org.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline transition-colors">{org.website}</a></p>
                          )}
                        </div>
                      </div>


                    </div>
                  </div>
                ))}
              </div>

              {filteredOrganizations?.length === 0 && (
                <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                    <MagnifyingGlassIcon className="w-12 h-12 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-lg">Организации не найдены</p>
                  <p className="text-gray-400 mt-2">Попробуйте изменить параметры поиска</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'requirements' && (
            <div className="space-y-6 animate-fade-in">
              {Object.entries(data.requirements || {}).map(([category, requirements], index) => (
                <div
                  key={category}
                  className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg mr-3">
                      {category === 'academic' && <CheckCircleIcon className="w-6 h-6 text-blue-600" />}
                      {category === 'documents' && <DocumentArrowDownIcon className="w-6 h-6 text-blue-600" />}
                      {category === 'duration' && <ClockIcon className="w-6 h-6 text-blue-600" />}
                    </div>
                    {getMultilingualText(requirements[0], 'title', requirements[0]?.title || category)}
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm">
                    {getMultilingualText(requirements[0], 'description', requirements[0]?.description)}
                  </p>
                  <ul className="space-y-3">
                    {requirements[0]?.items?.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start group">
                        <div className="p-1 bg-green-100 rounded-full mr-3 mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform">
                          <CheckCircleIcon className="w-5 h-5 text-green-500" />
                        </div>
                        <span className="text-gray-700 group-hover:text-gray-900 transition-colors">
                          {getMultilingualText(item, 'text', item.text)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border-l-4 border-yellow-400 p-6 rounded-2xl shadow transition-all duration-300 hover:shadow-md">
                <h3 className="text-lg font-semibold text-yellow-800 mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {t('studentLife.internships.importantInfo')}
                </h3>
                <ul className="text-yellow-700 space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="inline-block w-1.5 h-1.5 bg-yellow-500 rounded-full mt-1.5 mr-2"></span>
                    {t('studentLife.internships.docDeadline')}
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-1.5 h-1.5 bg-yellow-500 rounded-full mt-1.5 mr-2"></span>
                    {t('studentLife.internships.medExamValidity')}
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-1.5 h-1.5 bg-yellow-500 rounded-full mt-1.5 mr-2"></span>
                    {t('studentLife.internships.rulesCompliance')}
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-1.5 h-1.5 bg-yellow-500 rounded-full mt-1.5 mr-2"></span>
                    {t('studentLife.internships.reportDeadline')}
                  </li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'templates' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 shadow transition-all duration-300 hover:shadow-md">
                <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
                  <DocumentArrowDownIcon className="w-5 h-5 mr-2" />
                  {t('studentLife.internships.reportRequirements')}
                </h3>
                <ul className="text-blue-800 space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="inline-block w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 mr-2"></span>
                    {t('studentLife.internships.reportFormat')}
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 mr-2"></span>
                    {t('studentLife.internships.reportLength')}
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 mr-2"></span>
                    {t('studentLife.internships.reportFont')}
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 mr-2"></span>
                    {t('studentLife.internships.reportSignatures')}
                  </li>
                </ul>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.report_templates?.map((template, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 group"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {getMultilingualText(template, 'title', template.title)}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3">
                          {getMultilingualText(template, 'description', template.description)}
                        </p>
                        <div className="flex items-center text-xs text-gray-500 space-x-4">
                          <span className="bg-gray-100 px-2 py-1 rounded">{t('studentLife.internships.format')}: {template.format}</span>
                          <span className="bg-gray-100 px-2 py-1 rounded">{t('studentLife.internships.size')}: {template.file_size}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDownload(template)}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:-translate-y-0.5 shadow-md flex items-center justify-center group-hover:shadow-lg"
                    >
                      <DocumentArrowDownIcon className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                      {t('studentLife.internships.downloadDocument')}
                    </button>
                  </div>
                ))}
              </div>

              {data.report_templates?.length === 0 && (
                <div className="text-center py-12 bg-white rounded-2xl shadow">
                  <p className="text-gray-500 text-lg">{t('studentLife.internships.noDocuments')}</p>
                </div>
              )}

              <div className="bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-2xl p-6 shadow transition-all duration-300 hover:shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('common.additionalInfo')}</h3>
                <div className="text-gray-700 space-y-2 text-sm">
                  <p className="flex items-start">
                    <span className="inline-block w-1.5 h-1.5 bg-gray-500 rounded-full mt-1.5 mr-2"></span>
                    {t('studentLife.internships.templatesInfo')}
                  </p>
                  <p className="flex items-start">
                    <span className="inline-block w-1.5 h-1.5 bg-gray-500 rounded-full mt-1.5 mr-2"></span>
                    {t('studentLife.internships.contactCoordinator')}
                  </p>
                  <p className="flex items-start">
                    <span className="inline-block w-1.5 h-1.5 bg-gray-500 rounded-full mt-1.5 mr-2"></span>
                    {t('studentLife.internships.submissionFormat')}
                  </p>
                  <p className="flex items-start">
                    <span className="inline-block w-1.5 h-1.5 bg-gray-500 rounded-full mt-1.5 mr-2"></span>
                    {t('studentLife.internships.practiceCoordinator')}: <a href="mailto:practice@su.edu.kg" className="text-blue-600 hover:underline transition-colors">practice@su.edu.kg</a>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default Internships;