import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  GlobeAltIcon, 
  CalendarDaysIcon, 
  StarIcon, 
  AcademicCapIcon,
  ArrowPathIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';
import { getMultilingualText } from '../../utils/multilingualUtils';

const AcademicMobility = () => {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState('opportunities');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    partner_universities: [],
    exchange_opportunities: []
  });
  const [rawData, setRawData] = useState({
    partner_universities: [],
    exchange_opportunities: []
  });

  useEffect(() => {
    fetchAcademicMobilityData();
  }, []);

  // Обновление данных при смене языка
  useEffect(() => {
    if (rawData && (
      (rawData.partner_universities && rawData.partner_universities.length > 0) || 
      (rawData.exchange_opportunities && rawData.exchange_opportunities.length > 0)
    )) {
      updateDataForCurrentLanguage();
    }
  }, [i18n.language, rawData]);

  const updateDataForCurrentLanguage = () => {
    // Адаптируем partner_universities
    const adaptedPartnerUniversities = (rawData.partner_universities || []).map(uni => ({
      ...uni,
      name: getMultilingualText(uni, 'name', uni.name),
      description: getMultilingualText(uni, 'description', uni.description),
      programs: (uni.programs || []).map(program => ({
        ...program,
        name: getMultilingualText(program, 'name', program.name)
      }))
    }));

    // Адаптируем exchange_opportunities
    const adaptedExchangeOpportunities = (rawData.exchange_opportunities || []).map(opportunity => ({
      ...opportunity,
      title: getMultilingualText(opportunity, 'title', opportunity.title),
      description: getMultilingualText(opportunity, 'description', opportunity.description),
      benefits: (opportunity.benefits || []).map(benefit => 
        getMultilingualText(benefit, 'text', benefit.text || benefit)
      )
    }));

    setData({
      partner_universities: adaptedPartnerUniversities,
      exchange_opportunities: adaptedExchangeOpportunities
    });
  };

  const fetchAcademicMobilityData = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://med-backend-d61c905599c2.herokuapp.com/api/student-life/api/data/academic_mobility_data/');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      // Сохраняем оригинальные данные
      setRawData(result);
      
      setError(null);
    } catch (err) {
      console.error('Error fetching academic mobility data:', err);
      setError('Ошибка загрузки данных с сервера. Проверьте подключение к API.');
      // Устанавливаем пустые данные в случае ошибки
      setData({
        partner_universities: [],
        exchange_opportunities: []
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col justify-center items-center h-96">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <GlobeAltIcon className="w-8 h-8 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
            <span className="mt-6 text-lg font-medium text-gray-700 animate-pulse">
              {t('studentLife.academicMobility.loading')}
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 border border-red-100 transform transition-all hover:scale-[1.01]">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
                <div className="w-12 h-12 bg-red-200 rounded-full flex items-center justify-center">
                  <ArrowPathIcon className="w-8 h-8 text-red-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-red-800 mb-3">{t('studentLife.academicMobility.error')}</h3>
              <p className="text-red-700 mb-6">{error}</p>
              <button 
                onClick={fetchAcademicMobilityData}
                className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-3 rounded-full font-medium flex items-center hover:shadow-lg transition-all duration-300"
              >
                <ArrowPathIcon className="w-5 h-5 mr-2" />
                {t('studentLife.academicMobility.tryAgain')}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Заголовок с анимацией */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {t('studentLife.academicMobility.title')}
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            {t('studentLife.academicMobility.subtitle')}
          </p>
        </div>

        {/* Анимированные табы */}
        <div className="mb-12">
          <div className="flex justify-center">
            <div className="inline-flex bg-white rounded-full p-1 shadow-lg border border-gray-200">
              <button
                onClick={() => setActiveTab('opportunities')}
                className={`py-3 px-6 rounded-full font-medium text-sm flex items-center transition-all duration-300 ${
                  activeTab === 'opportunities'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                <GlobeAltIcon className="w-5 h-5 mr-2" />
                {t('studentLife.academicMobility.tabs.opportunities')}
              </button>
              <button
                onClick={() => setActiveTab('universities')}
                className={`py-3 px-6 rounded-full font-medium text-sm flex items-center transition-all duration-300 ${
                  activeTab === 'universities'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                <AcademicCapIcon className="w-5 h-5 mr-2" />
                {t('studentLife.academicMobility.tabs.partners')}
              </button>
            </div>
          </div>
        </div>

        {/* Контент табов */}
        <div className="transition-all duration-500">
          {activeTab === 'opportunities' && (
            <div className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {data.exchange_opportunities && data.exchange_opportunities.length > 0 ? (
                  data.exchange_opportunities.map((opportunity, index) => (
                      <div 
                      key={opportunity.id || index} 
                      className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                    >
                      <div className="mb-5">
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center mb-4">
                          <GlobeAltIcon className="w-8 h-8 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">{opportunity.title}</h3>
                        <p className="text-gray-600 mb-4 leading-relaxed">{opportunity.description}</p>
                      </div>                      <div className="mb-5 p-4 bg-blue-50 rounded-xl">
                        <div className="flex items-center text-sm text-blue-700 font-medium">
                          <CalendarDaysIcon className="w-5 h-5 mr-2" />
                          <span>{t('studentLife.academicMobility.duration')}: {opportunity.duration}</span>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                          <StarIcon className="w-5 h-5 text-yellow-500 mr-2" />
                          {t('studentLife.academicMobility.advantages')}:
                        </h4>
                        <ul className="space-y-2">
                          {opportunity.benefits && opportunity.benefits.length > 0 ? (
                            opportunity.benefits.map((benefit, benefitIndex) => (
                              <li key={benefit.id || benefitIndex} className="flex items-start text-sm text-gray-700">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                {benefit.text || benefit}
                              </li>
                            ))
                          ) : null}
                        </ul>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <GlobeAltIcon className="w-12 h-12 text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-lg">Нет данных о возможностях академической мобильности</p>
                  </div>
                )}
              </div>

              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-6">{t('studentLife.academicMobility.applicationSteps.title')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[1, 2, 3, 4].map((step) => (
                    <div key={step} className="text-center transform transition-all duration-300 hover:scale-105">
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center font-bold text-2xl mx-auto mb-4 backdrop-blur-sm">
                        {step}
                      </div>
                      <p className="font-medium text-sm">
                        {t(`studentLife.academicMobility.applicationSteps.step${step}`)}
                      </p>
                    </div>
                  ))}
                </div>
                
              </div>
            </div>
          )}

          {activeTab === 'universities' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {data.partner_universities && data.partner_universities.length > 0 ? (
                  data.partner_universities.map((university) => (
                    <div 
                      key={university.id} 
                      className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 overflow-hidden transform transition-all duration-300 hover:shadow-xl"
                    >
                      <div className="flex items-start space-x-5 mb-5">
                        <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0 shadow-inner">
                          {university.logo ? (
                            <img src={university.logo} alt={university.name || 'University'} className="w-16 h-16 object-contain" />
                          ) : (
                            <AcademicCapIcon className="w-12 h-12 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-bold text-gray-900 mb-2 truncate">{university.name}</h3>
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPinIcon className="w-4 h-4 mr-1 flex-shrink-0" />
                            <span className="truncate">{university.city}, {university.country}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-5">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">{t('studentLife.academicMobility.programs')}:</h4>
                          <div className="flex flex-wrap gap-2">
                            {university.programs && university.programs.length > 0 ? (
                              university.programs.map((program, index) => (
                                <span 
                                  key={program.id || index} 
                                  className="bg-gradient-to-r from-green-100 to-emerald-100 text-emerald-800 text-xs px-3 py-1.5 rounded-full font-medium"
                                >
                                  {getMultilingualText(program, 'name', program.name)}
                                </span>
                              ))
                            ) : null}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 text-sm">
                          {university.programs && university.programs.length > 0 && (
                            <div className="bg-blue-50 p-4 rounded-xl">
                              <h4 className="font-semibold text-blue-900 mb-3">Детали программ:</h4>
                              <div className="space-y-3">
                                {university.programs.map((program, idx) => (
                                  <div key={idx} className="flex justify-between items-center text-sm">
                                    <span className="font-medium text-blue-800">
                                      {getMultilingualText(program, 'name', program.name)}
                                    </span>
                                    <div className="flex gap-4 text-blue-700">
                                      <span>📅 {program.duration}</span>
                                      <span>🌐 {program.language}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <span className="font-medium text-gray-900">{t('studentLife.academicMobility.universityCard.website')}:</span>
                            <p className="text-gray-600">
                              <a href={university.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                {university.website}
                              </a>
                            </p>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-gray-200">
                          <div className="flex items-center text-sm">
                            <span className="font-medium text-gray-900 mr-2">🌐 Веб-сайт:</span>
                            <a href={university.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate">
                              {university.website}
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <AcademicCapIcon className="w-12 h-12 text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-lg">Нет данных об университетах-партнерах</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AcademicMobility;