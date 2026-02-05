import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const Centers = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language; // 'ru', 'en', или 'kg'
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [researchCenters, setResearchCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Функции для получения данных на текущем языке
  const getCenterName = (center) => {
    return center[`name_${currentLang}`] || center.name_ru || center.name;
  };

  const getCenterDescription = (center) => {
    return center[`description_${currentLang}`] || center.description_ru || center.description;
  };

  const getDirectorName = (center) => {
    return center[`director_${currentLang}`] || center.director_ru || center.director;
  };

  const getEquipment = (center) => {
    return center[`equipment_${currentLang}`] || center.equipment_ru || center.equipment || '';
  };

  // Функция для получения данных из API
  const fetchCenters = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://med-backend-d61c905599c2.herokuapp.com/research/api/centers/');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // API может возвращать paginated результаты
      const centersData = data.results || data;
      setResearchCenters(centersData);
      setError(null);
    } catch (err) {
      console.error('Error fetching centers:', err);
      setError(t('research.centers.errorLoading') || 'Ошибка загрузки центров');
      setResearchCenters([]);
    } finally {
      setLoading(false);
    }
  };

  // Загрузка данных при монтировании компонента
  useEffect(() => {
    fetchCenters();
  }, []);

  // Загрузка при смене языка
  useEffect(() => {
    if (researchCenters.length > 0) {
      // Обновляем отображение при смене языка
      setSelectedCenter(null);
    }
  }, [currentLang]);

  const formatEquipmentList = (equipmentText) => {
    if (!equipmentText) return [];
    // Разделяем оборудование по строкам или запятым
    return equipmentText.split(/[,\n]/).map(item => item.trim()).filter(Boolean);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-xl text-gray-600">{t('research.centers.loading') || 'Загрузка центров...'}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl text-gray-400 mb-4">⚠️</div>
          <p className="text-xl text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchCenters}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
          >
            {t('research.centers.retry') || 'Повторить попытку'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Заголовок */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            {t('research.centers.title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('research.centers.subtitle')}
          </p>
        </div>

        {/* Сетка карточек */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {researchCenters.map((center) => {
            const equipmentList = formatEquipmentList(getEquipment(center));
            return (
              <div
                key={center.id}
                className={`bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 ${
                  hoveredCard === center.id 
                    ? 'scale-105 shadow-2xl' 
                    : 'scale-100 hover:scale-102'
                }`}
                onMouseEnter={() => setHoveredCard(center.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Верхняя часть с логотипом и названием */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-4xl">🏥</div>
                    <div className="text-right">
                      <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
                        {center.staff_count} {t('research.centers.staffCount')}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold">{getCenterName(center)}</h3>
                  <p className="text-sm opacity-90 mt-2">{getCenterDescription(center)}</p>
                </div>

                {/* Контент карточки */}
                <div className="p-6">
                  {/* Руководитель */}
                  <div className="flex items-center mb-6 p-4 bg-gray-50 rounded-lg">
                    <div className="text-3xl mr-4">👨‍⚕️</div>
                    <div>
                      <h4 className="font-semibold text-gray-800">{getDirectorName(center)}</h4>
                      <p className="text-sm text-gray-600">{t('research.centers.positions.professor')}</p>
                    </div>
                  </div>

                  {/* Оборудование */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                      <span className="mr-2">⚙️</span>
                      {t('research.centers.equipmentTitle')}
                    </h4>
                    <div className="space-y-2">
                      {equipmentList.slice(0, 3).map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center text-sm text-gray-700 bg-blue-50 px-3 py-2 rounded-lg"
                        >
                          <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                          {item}
                        </div>
                      ))}
                      {equipmentList.length > 3 && (
                        <div className="text-sm text-blue-600 font-medium">
                          +{equipmentList.length - 3} {t('research.centers.moreItems')}
                        </div>
                      )}
                      {equipmentList.length === 0 && (
                        <div className="text-sm text-gray-500 italic">
                          {t('research.centers.noEquipment') || 'Информация об оборудовании отсутствует'}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Кнопка публикаций */}
                  <button
                    onClick={() => setSelectedCenter(center)}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    📚 {t('research.centers.viewDetails')}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Модальное окно с деталями */}
        {selectedCenter && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold">{getCenterName(selectedCenter)}</h2>
                    <p className="opacity-90">{getCenterDescription(selectedCenter)}</p>
                  </div>
                  <button
                    onClick={() => setSelectedCenter(null)}
                    className="text-white hover:text-gray-200 text-2xl"
                  >
                    ×
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Руководитель */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg mb-3">
                      {t('research.centers.director')}
                    </h3>
                    <div className="flex items-center">
                      <div className="text-4xl mr-4">👨‍⚕️</div>
                      <div>
                        <p className="font-semibold">{getDirectorName(selectedCenter)}</p>
                        <p className="text-sm text-gray-600">{t('research.centers.positions.professor')}</p>
                      </div>
                    </div>
                  </div>

                  {/* Сотрудники */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg mb-3">
                      {t('research.centers.team')}
                    </h3>
                    <p className="text-3xl font-bold text-blue-600">{selectedCenter.staff_count}</p>
                    <p className="text-sm text-gray-600">
                      {t('research.centers.researchers')}
                    </p>
                  </div>
                </div>

                {/* Контактная информация */}
                {(selectedCenter.website || selectedCenter.email || selectedCenter.phone) && (
                  <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg mb-3">
                      {t('research.centers.contacts') || 'Контактная информация'}
                    </h3>
                    <div className="space-y-2">
                      {selectedCenter.website && (
                        <div className="flex items-center">
                          <span className="text-blue-600 mr-2">🌐</span>
                          <a href={selectedCenter.website} target="_blank" rel="noopener noreferrer" 
                             className="text-blue-600 hover:text-blue-800 underline">
                            {selectedCenter.website}
                          </a>
                        </div>
                      )}
                      {selectedCenter.email && (
                        <div className="flex items-center">
                          <span className="text-blue-600 mr-2">📧</span>
                          <a href={`mailto:${selectedCenter.email}`} 
                             className="text-blue-600 hover:text-blue-800">
                            {selectedCenter.email}
                          </a>
                        </div>
                      )}
                      {selectedCenter.phone && (
                        <div className="flex items-center">
                          <span className="text-blue-600 mr-2">📞</span>
                          <span className="text-gray-700">{selectedCenter.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Оборудование */}
                <div className="mt-6">
                  <h3 className="font-semibold text-lg mb-3">
                    {t('research.centers.equipmentTitle')}
                  </h3>
                  {formatEquipmentList(getEquipment(selectedCenter)).length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {formatEquipmentList(getEquipment(selectedCenter)).map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center bg-blue-50 px-4 py-3 rounded-lg"
                        >
                          <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                          <span className="text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-500 italic text-center py-4">
                      {t('research.centers.noEquipment') || 'Информация об оборудовании отсутствует'}
                    </div>
                  )}
                </div>

                {/* Дополнительная информация */}
                <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2">
                    {t('research.centers.additionalInfo') || 'Дополнительная информация'}
                  </h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><strong>{t('research.centers.established') || 'Год основания'}:</strong> {selectedCenter.established_year}</p>
                    {selectedCenter.image && (
                      <div className="mt-3">
                        <img src={selectedCenter.image} alt={getCenterName(selectedCenter)} 
                             className="w-full h-40 object-cover rounded-lg" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Centers;