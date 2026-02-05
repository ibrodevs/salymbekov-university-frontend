import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { DocumentTextIcon, DocumentArrowDownIcon, ClockIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { getMultilingualText, adaptMultilingualArray } from '../../utils/multilingualUtils';

const StudentRegulations = () => {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState('rules');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    internal_rules: [],
    academic_regulations: [],
    downloadable_files: []
  });
  const [rawData, setRawData] = useState({
    internal_rules: [],
    academic_regulations: [],
    downloadable_files: []
  });

  // Анимация переключения табов
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Загрузка данных с API
  useEffect(() => {
    fetchRegulationsData();
  }, []);

  // Обновление данных при смене языка
  useEffect(() => {
    if (rawData && (rawData.internal_rules?.length > 0 || rawData.academic_regulations?.length > 0 || rawData.downloadable_files?.length > 0)) {
      updateDataForCurrentLanguage();
    }
  }, [i18n.language, rawData]);

  const updateDataForCurrentLanguage = () => {
    // Адаптируем internal_rules
    const adaptedInternalRules = (rawData.internal_rules || []).map(rule => ({
      ...rule,
      title: getMultilingualText(rule, 'title', rule.title),
      content: rule.content?.map(item => ({
        ...item,
        text: getMultilingualText(item, 'text', item.text)
      })) || []
    }));

    // Адаптируем academic_regulations  
    const adaptedAcademicRegulations = (rawData.academic_regulations || []).map(regulation => ({
      ...regulation,
      title: getMultilingualText(regulation, 'title', regulation.title),
      sections: regulation.sections?.map(section => ({
        ...section,
        subtitle: getMultilingualText(section, 'subtitle', section.subtitle),
        rules: section.rules?.map(rule => ({
          ...rule,
          text: getMultilingualText(rule, 'text', rule.text)
        })) || []
      })) || []
    }));

    // Адаптируем downloadable_files
    const adaptedDownloadableFiles = (rawData.downloadable_files || []).map(file => ({
      ...file,
      title: getMultilingualText(file, 'title', file.title),
      description: getMultilingualText(file, 'description', file.description)
    }));

    setData({
      internal_rules: adaptedInternalRules,
      academic_regulations: adaptedAcademicRegulations,
      downloadable_files: adaptedDownloadableFiles
    });
  };

  const fetchRegulationsData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('https://med-backend-d61c905599c2.herokuapp.com/api/student-life/api/data/regulations_data/');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      // Обеспечиваем, что все свойства существуют с правильными значениями по умолчанию
      const processedResult = {
        internal_rules: result.internal_rules || [],
        academic_regulations: result.academic_regulations || [],
        downloadable_files: result.downloadable_files || []
      };
      
      // Сохраняем оригинальные данные
      setRawData(processedResult);
      
      // Первоначальная адаптация будет выполнена через useEffect
    } catch (err) {
      console.error('Ошибка загрузки данных НПА:', err);
      setError('Не удалось загрузить данные. Попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveTab(tab);
      setIsTransitioning(false);
    }, 200);
  };

  const handleDownload = (url, filename) => {
    if (url && (url.startsWith('http') || url.startsWith('/media'))) {
      // Создаем правильный URL для скачивания
      const downloadUrl = url.startsWith('http') ? url : `https://med-backend-d61c905599c2.herokuapp.com${url}`;
      window.open(downloadUrl, '_blank');
    } else {
      // Показываем сообщение, что файл недоступен
      alert('Файл временно недоступен для загрузки');
    }
  };

  // Показать загрузку
  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <DocumentTextIcon className="w-8 h-8 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
        </div>
      </div>
    );
  }

  // Показать ошибку
  if (error) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg">
          <div className="text-red-500 mb-4">
            <div className="relative w-16 h-16 mx-auto">
              <div className="absolute inset-0 bg-red-100 rounded-full animate-ping"></div>
              <ExclamationTriangleIcon className="w-16 h-16 relative" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('studentLife.regulations.errorTitle')}</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchRegulationsData}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            {t('studentLife.regulations.tryAgain')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            {t('studentLife.regulations.title')}
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t('studentLife.regulations.subtitle')}
          </p>
        </div>

        {/* Табы с улучшенным дизайном */}
        <div className="mb-8">
          <div className="bg-white rounded-xl p-1 shadow-inner max-w-2xl mx-auto">
            <div className="flex space-x-1">
              <button
                onClick={() => handleTabChange('rules')}
                className={`flex-1 py-3 px-4 rounded-xl font-medium text-sm transition-all duration-300 ${
                  activeTab === 'rules'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                {t('studentLife.regulations.tabs.rules')}
              </button>
              <button
                onClick={() => handleTabChange('academic')}
                className={`flex-1 py-3 px-4 rounded-xl font-medium text-sm transition-all duration-300 ${
                  activeTab === 'academic'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                {t('studentLife.regulations.tabs.academic')}
              </button>
              <button
                onClick={() => handleTabChange('documents')}
                className={`flex-1 py-3 px-4 rounded-xl font-medium text-sm transition-all duration-300 ${
                  activeTab === 'documents'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                {t('studentLife.regulations.tabs.documents')}
              </button>
            </div>
          </div>
        </div>

        {/* Контент табов с анимацией */}
        <div className={`transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
          {activeTab === 'rules' && (
            <div className="space-y-6">
              {data.internal_rules?.map((section, index) => (
                <div 
                  key={index} 
                  className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100"
                >
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg mr-3">
                      <DocumentTextIcon className="w-6 h-6 text-blue-600" />
                    </div>
                    {section.title}
                  </h3>
                  <ul className="space-y-3">
                    {section.content?.map((item, itemIndex) => (
                      <li 
                        key={itemIndex} 
                        className="flex items-start p-3 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                      >
                        <div className="w-2 h-2 bg-blue-600 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700">{item.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              {data.internal_rules?.length === 0 && (
                <div className="text-center py-8 bg-white rounded-2xl shadow">
                  <p className="text-gray-500">{t('studentLife.regulations.noData.rules')}</p>
                </div>
              )}

              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-400 p-6 rounded-2xl shadow">
                <div className="flex items-start">
                  <div className="p-2 bg-amber-100 rounded-lg mr-4">
                    <ExclamationTriangleIcon className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-amber-800 mb-2">{t('studentLife.regulations.importantInfo.title')}</h3>
                    <ul className="text-amber-700 space-y-2">
                      <li className="flex items-center">
                        <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-2"></div>
                        {t('studentLife.regulations.importantInfo.ignoranceNotExcused')}
                      </li>
                      <li className="flex items-center">
                        <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-2"></div>
                        {t('studentLife.regulations.importantInfo.disciplinaryMeasures')}
                      </li>
                      <li className="flex items-center">
                        <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-2"></div>
                        {t('studentLife.regulations.importantInfo.contactDean')}
                      </li>
                      <li className="flex items-center">
                        <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-2"></div>
                        {t('studentLife.regulations.importantInfo.rulesCanChange')}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'academic' && (
            <div className="space-y-6">
              {data.academic_regulations?.map((regulation, index) => (
                <div 
                  key={index} 
                  className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100"
                >
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">{regulation.title}</h3>
                  
                  {regulation.sections?.map((section, sectionIndex) => (
                    <div key={sectionIndex} className="mb-6 last:mb-0 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                      <h4 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        {section.subtitle}
                      </h4>
                      <ul className="space-y-3">
                        {section.rules?.map((rule, ruleIndex) => (
                          <li key={ruleIndex} className="flex items-start p-2 rounded-lg hover:bg-green-50 transition-colors">
                            <ClockIcon className="w-4 h-4 text-green-500 mr-3 mt-1 flex-shrink-0" />
                            <span className="text-gray-700">{rule.text}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ))}

              {data.academic_regulations?.length === 0 && (
                <div className="text-center py-8 bg-white rounded-2xl shadow">
                  <p className="text-gray-500">{t('studentLife.regulations.noData.academic')}</p>
                </div>
              )}

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 shadow">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">{t('studentLife.regulations.contact.title')}</h3>
                <div className="text-blue-800 space-y-3">
                  <div className="flex items-center">
                    <span className="font-medium mr-2">{t('studentLife.regulations.contact.dean')}:</span> 
                    {t('studentLife.regulations.contact.deanAddress')}
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium mr-2">{t('studentLife.regulations.contact.phone')}:</span> 
                    +996 312 123-456 (доб. 105)
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium mr-2">Email:</span> 
                    <a href="mailto:dean@su.edu.kg" className="underline hover:text-blue-600 transition-colors">dean@su.edu.kg</a>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium mr-2">{t('studentLife.regulations.contact.hours')}:</span> 
                    {t('studentLife.regulations.contact.hoursTime')}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-2xl p-6 shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('studentLife.regulations.documentsInfo.title')}</h3>
                <div className="text-gray-700 space-y-2 text-sm">
                  <div className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                    {t('studentLife.regulations.documentsInfo.currentVersion')}
                  </div>
                  <div className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                    {t('studentLife.regulations.documentsInfo.readerRequired')}
                  </div>
                  <div className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                    {t('studentLife.regulations.documentsInfo.contactIT')}
                  </div>
                  <div className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                    {t('studentLife.regulations.documentsInfo.mayUpdate')}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.downloadable_files?.map((file, index) => (
                  <div 
                    key={index} 
                    className="bg-white rounded-2xl shadow-md p-5 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
                  >
                    <div className="mb-4 flex-grow">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg font-semibold text-gray-900 pr-4">{file.title}</h3>
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex-shrink-0">
                          {file.type}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-4">{file.description}</p>
                      
                      <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-4">
                        <span className="bg-gray-100 px-2 py-1 rounded-full">{t('studentLife.regulations.fileInfo.format')}: {file.format}</span>
                        <span className="bg-gray-100 px-2 py-1 rounded-full">{t('studentLife.regulations.fileInfo.size')}: {file.file_size}</span>
                        <span className="bg-gray-100 px-2 py-1 rounded-full">{t('studentLife.regulations.fileInfo.updated')}: {file.last_updated}</span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleDownload(file.download_url, file.title)}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center mt-auto"
                    >
                      <DocumentArrowDownIcon className="w-5 h-5 mr-2" />
                      {t('studentLife.regulations.downloadDocument')}
                    </button>
                  </div>
                ))}
              </div>

              {data.downloadable_files?.length === 0 && (
                <div className="text-center py-8 bg-white rounded-2xl shadow">
                  <p className="text-gray-500">{t('studentLife.regulations.noData.documents')}</p>
                </div>
              )}

              <div className="bg-gradient-to-r from-green-50 to-teal-50 border border-green-200 rounded-2xl p-6 shadow">
                <h3 className="text-lg font-semibold text-green-800 mb-3">{t('studentLife.regulations.usefulLinks.title')}</h3>
                <div className="space-y-2 text-green-700">
                  <div className="hover:underline hover:text-green-600 transition-all">
                    <a href="#" className="flex items-center">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                      {t('studentLife.regulations.usefulLinks.ministry')}
                    </a>
                  </div>
                  <div className="hover:underline hover:text-green-600 transition-all">
                    <a href="#" className="flex items-center">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                      {t('studentLife.regulations.usefulLinks.accreditation')}
                    </a>
                  </div>
                  <div className="hover:underline hover:text-green-600 transition-all">
                    <a href="#" className="flex items-center">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                      {t('studentLife.regulations.usefulLinks.testingCenter')}
                    </a>
                  </div>
                  <div className="hover:underline hover:text-green-600 transition-all">
                    <a href="#" className="flex items-center">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                      {t('studentLife.regulations.usefulLinks.studentPortal')}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentRegulations;