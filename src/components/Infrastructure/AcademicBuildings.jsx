import { useState, useEffect } from 'react';
import { BookOpen, Camera, GraduationCap, Monitor } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const AcademicBuildings = () => {
  const { t, i18n } = useTranslation();
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' или 'list'
  const [activeTab, setActiveTab] = useState('overview'); // Для деталей здания

  useEffect(() => {
    // Fetch academic buildings from Django API
    const fetchBuildings = async () => {
      try {
        const response = await fetch('https://med-backend-d61c905599c2.herokuapp.com/api/infrastructure/academic-buildings/');
        if (response.ok) {
          const data = await response.json();
          const buildingsData = data.results || data;
          setBuildings(buildingsData);
        } else {
          // Fallback to mock data if API fails
          setBuildings(getMockBuildings());
        }
      } catch (error) {
        console.error('Error fetching academic buildings:', error);
        // Fallback to mock data if API fails
        setBuildings(getMockBuildings());
      } finally {
        setLoading(false);
      }
    };

    fetchBuildings();
  }, []);

  const getMockBuildings = () => {
    return [
      {
        id: 1,
        name: {
          ru: "Главный учебный корпус",
          kg: "Негизги окуу корпусу",
          en: "Main Academic Building"
        },
        address: {
          ru: "г. Бишкек, ул. Ахунбаева, 92",
          kg: "Бишкек шаары, Ахунбаев көчөсү, 92",
          en: "Bishkek, Akhunbaev Street, 92"
        },
        description: {
          ru: "Основное здание университета с лекционными залами и административными офисами",
          kg: "Университеттин негизги имараты лекциялык залдар жана административдик кеңселер менен",
          en: "Main university building with lecture halls and administrative offices"
        },
        floors: 5,
        yearBuilt: 1998,
        totalArea: "12,500 м²",
        facilities: [
          {
            name: { ru: "Лекционные залы", kg: "Лекциялык залдар", en: "Lecture halls" },
            count: 12,
            capacity: "50-200 человек",
            Icon: GraduationCap
          },
          {
            name: { ru: "Аудитории", kg: "Аудиториялар", en: "Classrooms" },
            count: 25,
            capacity: "20-40 человек",
            Icon: BookOpen
          },
          {
            name: { ru: "Компьютерные классы", kg: "Компьютердик класстар", en: "Computer labs" },
            count: 4,
            capacity: "20-30 человек",
            Icon: Monitor
          },
          {
            name: { ru: "Библиотека", kg: "Китепкана", en: "Library" },
            count: 1,
            capacity: "100 мест для чтения",
          }
        ],
        photos: [
          { type: "facade", url: "/images/main_building_facade.jpg", caption: { ru: "Фасад", kg: "Фасад", en: "Facade" } },
          { type: "lobby", url: "/images/main_building_lobby.jpg", caption: { ru: "Холл", kg: "Холл", en: "Lobby" } },
          { type: "lecture_hall", url: "/images/main_lecture_hall.jpg", caption: { ru: "Лекционный зал", kg: "Лекциялык зал", en: "Lecture Hall" } },
          { type: "library", url: "/images/main_library.jpg", caption: { ru: "Библиотека", kg: "Китепкана", en: "Library" } }
        ],
        coordinates: { lat: 42.8746, lng: 74.5698 },
        workingHours: {
          ru: "Пн-Пт: 8:00-20:00, Сб: 9:00-16:00",
          kg: "Дүй-Жум: 8:00-20:00, Ишемби: 9:00-16:00",
          en: "Mon-Fri: 8:00-20:00, Sat: 9:00-16:00"
        },
        contacts: {
          phone: "+996 312 123-001",
          email: "mainbuilding@salymbekov.edu.kg"
        }
      },
      // Остальные здания с аналогичными улучшениями...
    ];
  };

  const getCurrentLanguage = () => {
    return ['ru', 'kg', 'en'].includes(i18n.language) ? i18n.language : 'ru';
  };

  // Helper function to get translated field value
  const getTranslatedField = (obj, fieldPrefix) => {
    if (!obj) return '';
    
    const lang = getCurrentLanguage();
    
    // Try direct field access with language suffix (e.g., title_en, name_ru)
    const directField = obj[`${fieldPrefix}_${lang}`];
    if (directField) return directField;
    
    // Try nested object access (e.g., obj.title.en, obj.name.ru)
    if (obj[fieldPrefix] && typeof obj[fieldPrefix] === 'object') {
      const nestedField = obj[fieldPrefix][lang];
      if (nestedField) return nestedField;
      
      // Fallback to Russian if current language not available
      const fallbackField = obj[fieldPrefix]['ru'];
      if (fallbackField) return fallbackField;
    }
    
    // Final fallback to the field itself
    return obj[fieldPrefix] || '';
  };

  // Safe base64 encoding function that handles Unicode characters
  const safeBase64Encode = (str) => {
    try {
      // Use encodeURIComponent and then btoa to handle Unicode characters
      return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => {
        return String.fromCharCode('0x' + p1);
      }));
    } catch (error) {
      console.warn('Error encoding string to base64:', error);
      return btoa('Invalid text');
    }
  };

  // Create placeholder SVG with safe encoding
  const createPlaceholderSVG = (width, height, text) => {
    const svgContent = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg"><rect width="${width}" height="${height}" fill="#f3f4f6"/><text x="${width/2}" y="${height/2}" text-anchor="middle" fill="#6b7280" font-family="Arial" font-size="16">${text.replace(/[<>&"']/g, '')}</text></svg>`;
    return `data:image/svg+xml;base64,${safeBase64Encode(svgContent)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            {t('academicBuildings.title', 'Учебные корпуса университета')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            {t('academicBuildings.subtitle', 'Современная инфраструктура для качественного образования')}
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <button
              onClick={() => setShowMap(!showMap)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 inline-flex items-center shadow-md hover:shadow-lg"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {showMap ? t('academicBuildings.hideMap', 'Скрыть карту') : t('academicBuildings.showMap', 'Показать карту кампуса')}
            </button>
            
            <div className="bg-white rounded-lg p-1 shadow-md flex">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Campus Map */}
        {showMap && (
          <div className="mb-12 bg-white rounded-2xl shadow-xl p-6 transition-all duration-500">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <svg className="w-6 h-6 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              {t('academicBuildings.campusMap', 'Карта кампуса')}
            </h2>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 text-center">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                {buildings.map((building, index) => (
                  <div 
                    key={building.id} 
                    className="bg-white p-4 rounded-xl shadow-md border-2 border-blue-100 hover:border-blue-300 transition-all duration-300 cursor-pointer hover:shadow-lg"
                    onClick={() => {
                      setSelectedBuilding(building.id);
                      document.getElementById(`building-${building.id}`)?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    <div className="text-2xl font-bold text-blue-600 mb-2">{index + 1}</div>
                    <div className="text-sm font-medium text-gray-800">
                      {getTranslatedField(building, 'name')}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {getTranslatedField(building, 'address')}
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-gray-600 mt-6 text-sm bg-white p-3 rounded-lg inline-block">
                {t('academicBuildings.mapNote', 'Интерактивная карта в разработке. Используйте адреса для навигации.')}
              </p>
            </div>
          </div>
        )}

        {/* Buildings Grid/List View */}
        <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-6'}>
          {buildings.map((building) => (
            <div 
              key={building.id} 
              id={`building-${building.id}`}
              className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl ${viewMode === 'list' && 'flex'}`}
            >
              <div className={viewMode === 'list' ? 'w-1/3' : ''}>
                <div className="relative">
                  <img
                    src={building.photo_url || building.facade_photo ||
                      createPlaceholderSVG(400, 300, getTranslatedField(building, 'name') || 'Building')}
                    alt={getTranslatedField(building, 'name')}
                    className={`w-full ${viewMode === 'list' ? 'h-48' : 'h-48 md:h-56'} object-cover`}
                    onError={(e) => {
                      e.target.src = createPlaceholderSVG(400, 300, 'Building Photo');
                    }}
                  />
                  <div className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded">
                    {building.floors || 3} {t('academicBuildings.floors', 'этажа')}
                  </div>
                </div>
              </div>
              
              <div className={viewMode === 'list' ? 'w-2/3 p-5' : 'p-5'}>
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  {getTranslatedField(building, 'name')}
                </h2>
                
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {getTranslatedField(building, 'description')}
                </p>

                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  <span className="truncate">{getTranslatedField(building, 'address')}</span>
                </div>

                <div className="flex justify-between items-center">
                  <button
                    onClick={() => setSelectedBuilding(selectedBuilding === building.id ? null : building.id)}
                    className="text-blue-600 hover:text-blue-800 font-medium flex items-center transition-colors"
                  >
                    {selectedBuilding === building.id
                      ? t('academicBuildings.hideDetails', 'Скрыть детали')
                      : t('academicBuildings.showDetails', 'Подробнее')
                    }
                    <svg className={`w-4 h-4 ml-1 transform ${selectedBuilding === building.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  <button 
                    onClick={() => {
                      setSelectedBuilding(building.id);
                      setShowMap(true);
                    }}
                    className="text-gray-500 hover:text-blue-600"
                    title={t('academicBuildings.showOnMap', 'Показать на карте')}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Expanded Details */}
              {selectedBuilding === building.id && (
                <div className="border-t border-gray-100 p-5 col-span-full">
                  <div className="flex border-b border-gray-200 mb-6">
                    <button
                      className={`py-2 px-4 font-medium ${activeTab === 'overview' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                      onClick={() => setActiveTab('overview')}
                    >
                      {t('academicBuildings.overview', 'Обзор')}
                    </button>
                    <button
                      className={`py-2 px-4 font-medium ${activeTab === 'facilities' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                      onClick={() => setActiveTab('facilities')}
                    >
                      {t('academicBuildings.facilities', 'Помещения')}
                    </button>
                    <button
                      className={`py-2 px-4 font-medium ${activeTab === 'gallery' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                      onClick={() => setActiveTab('gallery')}
                    >
                      {t('academicBuildings.gallery', 'Галерея')}
                    </button>
                  </div>

                  {activeTab === 'overview' && (
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('academicBuildings.buildingInfo', 'Информация о здании')}</h3>
                        <div className="space-y-3">
                          <div className="flex">
                            <span className="text-gray-600 w-32">{t('academicBuildings.address', 'Адрес')}:</span>
                            <span className="text-gray-800">{getTranslatedField(building, 'address')}</span>
                          </div>
                          <div className="flex">
                            <span className="text-gray-600 w-32">{t('academicBuildings.floors', 'Этажи')}:</span>
                            <span className="text-gray-800">{building.floors}</span>
                          </div>
                          {building.yearBuilt && (
                            <div className="flex">
                              <span className="text-gray-600 w-32">{t('academicBuildings.yearBuilt', 'Год постройки')}:</span>
                              <span className="text-gray-800">{building.yearBuilt}</span>
                            </div>
                          )}
                          {building.totalArea && (
                            <div className="flex">
                              <span className="text-gray-600 w-32">{t('academicBuildings.totalArea', 'Общая площадь')}:</span>
                              <span className="text-gray-800">{building.totalArea}</span>
                            </div>
                          )}
                          {building.workingHours && (
                            <div className="flex">
                              <span className="text-gray-600 w-32">{t('academicBuildings.workingHours', 'Часы работы')}:</span>
                              <span className="text-gray-800">{getTranslatedField(building, 'workingHours')}</span>
                            </div>
                          )}
                          {building.contacts && (
                            <div className="flex">
                              <span className="text-gray-600 w-32">{t('academicBuildings.contacts', 'Контакты')}:</span>
                              <span className="text-gray-800">
                                {building.contacts.phone && <div>{building.contacts.phone}</div>}
                                {building.contacts.email && <div>{building.contacts.email}</div>}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('academicBuildings.quickStats', 'Краткая статистика')}</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-blue-50 p-4 rounded-lg text-center">
                            <div className="text-2xl font-bold text-blue-600">
                              {(building.facilities || []).reduce((total, facility) => total + (facility.count || 1), 0)}
                            </div>
                            <div className="text-sm text-gray-600">{t('academicBuildings.rooms', 'помещений')}</div>
                          </div>
                          <div className="bg-green-50 p-4 rounded-lg text-center">
                            <div className="text-2xl font-bold text-green-600">{building.floors || 3}</div>
                            <div className="text-sm text-gray-600">{t('academicBuildings.floors', 'этажей')}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'facilities' && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('academicBuildings.detailedFacilities', 'Подробное описание помещений')}</h3>
                      {(building.facilities && building.facilities.length > 0) ? (
                        <div className="grid md:grid-cols-2 gap-4">
                          {building.facilities.map((facility, index) => (
                            <div key={index} className="bg-gray-50 p-4 rounded-lg flex items-start">
                              <span className="text-2xl mr-3">{facility.icon || '📌'}</span>
                              <div>
                                <h4 className="font-semibold text-gray-800">
                                  {getTranslatedField(facility, 'name')}
                                </h4>
                                <div className="flex justify-between text-sm text-gray-600 mt-1">
                                  <span>{facility.count} {t('academicBuildings.units', 'ед.')}</span>
                                  <span>{getTranslatedField(facility, 'capacity') || facility.capacity}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <p>{t('academicBuildings.noFacilities', 'Информация о помещениях пока недоступна')}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'gallery' && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('academicBuildings.photoGallery', 'Фотогалерея')}</h3>
                      {(building.photos && building.photos.length > 0) ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {building.photos.map((photo, index) => (
                            <div key={photo.id || index} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                              <div className="bg-gray-100">
                                <img
                                  src={photo.photo_url}
                                  alt={getTranslatedField(photo, 'title') || `Photo ${index + 1}`}
                                  className="w-full h-40 object-cover"
                                  loading="lazy"
                                  onLoad={(e) => {
                                    e.target.parentElement.classList.remove('bg-gray-100');
                                    e.target.parentElement.classList.add('bg-white');
                                  }}
                                  onError={(e) => {
                                    console.error('<XCircle className="w-5 h-5" /> Gallery image failed:', photo.photo_url);
                                    e.target.parentElement.classList.remove('bg-gray-100');
                                    e.target.parentElement.classList.add('bg-red-50');
                                    // Create a simple error placeholder
                                    const errorSvg = `data:image/svg+xml;base64,${btoa(`
                                      <svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
                                        <rect width="300" height="200" fill="#fef2f2"/>
                                        <text x="150" y="90" text-anchor="middle" fill="#dc2626" font-family="Arial" font-size="14">Unable to load image</text>
                                        <text x="150" y="110" text-anchor="middle" fill="#9ca3af" font-family="Arial" font-size="12">${photo.type_display || 'Photo'}</text>
                                      </svg>
                                    `)}`;
                                    e.target.src = errorSvg;
                                  }}
                                />
                              </div>
                              <div className="p-3 bg-white">
                                <h4 className="font-medium text-sm text-gray-800 truncate">
                                  {getTranslatedField(photo, 'title') || `Photo ${index + 1}`}
                                </h4>
                                <p className="text-xs text-gray-500 mt-1">
                                  {photo.type_display || photo.type}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                          <Camera className="w-6 h-6" />
                          <p>{t('academicBuildings.noPhotos', 'Фотографии пока недоступны')}</p>
                          <p className="text-sm text-gray-400 mt-2">
                            {building.photos ? `Found ${building.photos.length} photos` : 'No photos array found'}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Navigation and Contact Information */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8 text-white">
            <h2 className="text-2xl font-bold mb-6">
              {t('academicBuildings.navigationInfo', 'Навигация и контакты')}
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  {t('academicBuildings.howToReach', 'Как добраться')}
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-blue-300 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {t('academicBuildings.transport1', 'Автобусы: №10, №15, №22 до остановки "Университет"')}
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-blue-300 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {t('academicBuildings.transport2', 'Маршрутки: №105, №120, №130')}
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-blue-300 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {t('academicBuildings.parking', 'Парковка для студентов и преподавателей')}
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {t('academicBuildings.contactInfo', 'Контактная информация')}
                </h3>
                <div className="space-y-3">
                  <div>
                    <strong>{t('academicBuildings.security', 'Служба безопасности')}:</strong>
                    <p>Тел: +996 312 123-000</p>
                  </div>
                  <div>
                    <strong>{t('academicBuildings.maintenance', 'Служба эксплуатации')}:</strong>
                    <p>Тел: +996 312 123-111</p>
                  </div>
                  <div>
                    <strong>{t('academicBuildings.reception', 'Общая информация')}:</strong>
                    <p>Тел: +996 312 123-456</p>
                    <p>Email: info@salymbekov.edu.kg</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcademicBuildings;