import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BuildingOfficeIcon, 
  MapPinIcon, 
  UsersIcon, 
  CheckBadgeIcon,
  DocumentTextIcon,
  ClockIcon,
  PhoneIcon,
  EnvelopeIcon,
  AcademicCapIcon,
  HomeModernIcon,
  ArrowRightIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

// Error Boundary Component
const ErrorBoundary = ({ children, fallback }) => {
  try {
    return children;
  } catch (error) {
    console.error('Component error:', error);
    return fallback || (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 m-4">
        <div className="flex items-center">
          <ExclamationTriangleIcon className="w-5 h-5 text-red-500 mr-2" />
          <span className="text-red-700">Something went wrong. Please try refreshing the page.</span>
        </div>
      </div>
    );
  }
};

// Анимированные компоненты
const FadeIn = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
  >
    {children}
  </motion.div>
);

const StaggerChildren = ({ children, className = '' }) => (
  <motion.div
    initial="hidden"
    animate="visible"
    variants={{
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1
        }
      }
    }}
    className={className}
  >
    {children}
  </motion.div>
);

const Dormitories = () => {
  const { t, i18n } = useTranslation();
  const [dormitories, setDormitories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDorm, setSelectedDorm] = useState(null);
  const [activeTab, setActiveTab] = useState('dormitories');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchDormitories = async () => {
      try {
        setLoading(true);
        // Имитация загрузки с красивой анимацией
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const response = await fetch('https://med-backend-d61c905599c2.herokuapp.com/api/infrastructure/dormitories/');
        if (response.ok) {
          const data = await response.json();
          const dormitoriesData = Array.isArray(data.results) ? data.results : Array.isArray(data) ? data : [];
          
          // Ensure each dormitory has required properties
          const processedData = dormitoriesData.map(dorm => ({
            ...dorm,
            rooms: dorm.rooms || (dorm.type === 'family' ? [
              {
                type: "studio",
                name: { ru: "Студия", kg: "Студия", en: "Studio" },
                price: { ru: "8000 сом/месяц", kg: "8000 сом/ай", en: "8000 som/month" },
                features: { ru: "Спальня, кухня, санузел, Wi-Fi", kg: "Уктоочу бөлмө, ашкана, даарет, Wi-Fi", en: "Bedroom, kitchen, bathroom, Wi-Fi" }
              },
              {
                type: "one_bedroom",
                name: { ru: "Однокомнатная", kg: "Бир бөлмөлүү", en: "One bedroom" },
                price: { ru: "12000 сом/месяц", kg: "12000 сом/ай", en: "12000 som/month" },
                features: { ru: "Отдельная спальня, кухня, санузел, Wi-Fi", kg: "Өзүнчө спальня, ашкана, даарет, Wi-Fi", en: "Separate bedroom, kitchen, bathroom, Wi-Fi" }
              }
            ] : [
              {
                type: "double",
                name: { ru: "Двухместная комната", kg: "Эки жактуу бөлмө", en: "Double room" },
                price: { ru: "3500 сом/месяц", kg: "3500 сом/ай", en: "3500 som/month" },
                features: { ru: "2 кровати, 2 стола, шкаф, Wi-Fi", kg: "2 керебет, 2 стол, шкаф, Wi-Fi", en: "2 beds, 2 desks, wardrobe, Wi-Fi" }
              },
              {
                type: "triple",
                name: { ru: "Трёхместная комната", kg: "Үч жактуу бөлмө", en: "Triple room" },
                price: { ru: "2800 сом/месяц", kg: "2800 сом/ай", en: "2800 som/month" },
                features: { ru: "3 кровати, 3 стола, шкаф, Wi-Fi", kg: "3 керебет, 3 стол, шкаф, Wi-Fi", en: "3 beds, 3 desks, wardrobe, Wi-Fi" }
              }
            ]),
            facilities: dorm.facilities || (dorm.type === 'family' ? [
              { ru: "Детская игровая площадка", kg: "Балдар оюн аянты", en: "Children's playground" },
              { ru: "Общая прачечная", kg: "Жалпы кир жуучу жай", en: "Shared laundry" },
              { ru: "Парковочные места", kg: "Унаа токтотуу жерлери", en: "Parking spaces" },
              { ru: "Круглосуточная охрана", kg: "Тун-күн коргоо", en: "24/7 security" }
            ] : [
              { ru: "Общая кухня на этаже", kg: "Кабатта жалпы ашкана", en: "Shared kitchen per floor" },
              { ru: "Прачечная", kg: "Кир жуучу жай", en: "Laundry room" },
              { ru: "Комната отдыха", kg: "Эс алуу бөлмөсү", en: "Recreation room" },
              { ru: "Круглосуточная охрана", kg: "Тун-күн коргоо", en: "24/7 security" },
              { ru: "Wi-Fi интернет", kg: "Wi-Fi интернет", en: "Wi-Fi internet" }
            ]),
            photos: dorm.photos || [],
            available: dorm.available || 0,
            capacity: dorm.capacity || 0
          }));
          
          setDormitories(processedData);
        } else {
          throw new Error('Failed to fetch dormitories');
        }
      } catch (error) {
        console.error('Error:', error);
        setDormitories(getMockDormitories());
      } finally {
        setLoading(false);
      }
    };

    fetchDormitories();
  }, []);

  const getMockDormitories = () => {
    return [
      {
        id: 1,
        name: {
          ru: "Общежитие №1 (Женское)",
          kg: "№1 жатакана (Аялдар)",
          en: "Dormitory #1 (Female)"
        },
        address: {
          ru: "г. Бишкек, ул. Студенческая, 10",
          kg: "Бишкек шаары, Студенттик көчө, 10",
          en: "Bishkek, Student Street, 10"
        },
        type: "female",
        capacity: 200,
        available: 15,
        main_photo: "/images/dorm1_exterior.jpg",
        exterior_photo: "/images/dorm1_exterior.jpg",
        description: {
          ru: "Комфортабельное общежитие для студенток с современными удобствами",
          kg: "Заманбап ыңгайлуулуктары бар студенттер үчүн ыңгайлуу жатакана",
          en: "Comfortable dormitory for female students with modern amenities"
        },
        rooms: [
          {
            type: "double",
            name: { ru: "Двухместная комната", kg: "Эки жактуу бөлмө", en: "Double room" },
            price: { ru: "3500 сом/месяц", kg: "3500 сом/ай", en: "3500 som/month" },
            features: { ru: "2 кровати, 2 стола, шкаф, Wi-Fi", kg: "2 керебет, 2 стол, шкаф, Wi-Fi", en: "2 beds, 2 desks, wardrobe, Wi-Fi" }
          },
          {
            type: "triple",
            name: { ru: "Трёхместная комната", kg: "Үч жактуу бөлмө", en: "Triple room" },
            price: { ru: "2800 сом/месяц", kg: "2800 сом/ай", en: "2800 som/month" },
            features: { ru: "3 кровати, 3 стола, шкаф, Wi-Fi", kg: "3 керебет, 3 стол, шкаф, Wi-Fi", en: "3 beds, 3 desks, wardrobe, Wi-Fi" }
          }
        ],
        facilities: [
          { ru: "Общая кухня на этаже", kg: "Кабатта жалпы ашкана", en: "Shared kitchen per floor" },
          { ru: "Прачечная", kg: "Кир жуучу жай", en: "Laundry room" },
          { ru: "Комната отдыха", kg: "Эс алуу бөлмөсү", en: "Recreation room" },
          { ru: "Круглосуточная охрана", kg: "Тун-күн коргоо", en: "24/7 security" },
          { ru: "Wi-Fi интернет", kg: "Wi-Fi интернет", en: "Wi-Fi internet" }
        ],
        photos: [
          { 
            id: 1, 
            type: "exterior", 
            url: "/images/dorm1_exterior.jpg",
            photo_url: "/images/dorm1_exterior.jpg",
            type_display: "Внешний вид",
            title_ru: "Внешний вид общежития",
            title_kg: "Жатакананын сырткы көрүнүшү", 
            title_en: "Dormitory exterior",
            order: 1
          },
          { 
            id: 2, 
            type: "room", 
            url: "/images/dorm1_room.jpg",
            photo_url: "/images/dorm1_room.jpg",
            type_display: "Комната",
            title_ru: "Жилая комната",
            title_kg: "Жашоо бөлмөсү",
            title_en: "Living room", 
            order: 2
          },
          { type: "kitchen", url: "/images/dorm1_kitchen.jpg" },
          { type: "common", url: "/images/dorm1_common.jpg" }
        ]
      },
      {
        id: 2,
        name: {
          ru: "Общежитие №2 (Мужское)",
          kg: "№2 жатакана (Эркектер)",
          en: "Dormitory #2 (Male)"
        },
        address: {
          ru: "г. Бишкек, ул. Студенческая, 12",
          kg: "Бишкек шаары, Студенттик көчө, 12",
          en: "Bishkek, Student Street, 12"
        },
        type: "male",
        capacity: 180,
        available: 8,
        description: {
          ru: "Современное общежитие для студентов с отличными условиями проживания",
          kg: "Мыкты жашоо шарттары бар студенттер үчүн заманбап жатакана",
          en: "Modern dormitory for male students with excellent living conditions"
        },
        rooms: [
          {
            type: "double",
            name: { ru: "Двухместная комната", kg: "Эки жактуу бөлмө", en: "Double room" },
            price: { ru: "3500 сом/месяц", kg: "3500 сом/ай", en: "3500 som/month" },
            features: { ru: "2 кровати, 2 стола, шкаф, Wi-Fi", kg: "2 керебет, 2 стол, шкаф, Wi-Fi", en: "2 beds, 2 desks, wardrobe, Wi-Fi" }
          },
          {
            type: "triple",
            name: { ru: "Трёхместная комната", kg: "Үч жактуу бөлмө", en: "Triple room" },
            price: { ru: "2800 сом/месяц", kg: "2800 сом/ай", en: "2800 som/month" },
            features: { ru: "3 кровати, 3 стола, шкаф, Wi-Fi", kg: "3 керебет, 3 стол, шкаф, Wi-Fi", en: "3 beds, 3 desks, wardrobe, Wi-Fi" }
          }
        ],
        facilities: [
          { ru: "Общая кухня на этаже", kg: "Кабатта жалпы ашкана", en: "Shared kitchen per floor" },
          { ru: "Прачечная", kg: "Кир жуучу жай", en: "Laundry room" },
          { ru: "Спортивная комната", kg: "Спорт бөлмөсү", en: "Sports room" },
          { ru: "Круглосуточная охрана", kg: "Тун-күн коргоо", en: "24/7 security" },
          { ru: "Wi-Fi интернет", kg: "Wi-Fi интернет", en: "Wi-Fi internet" }
        ],
        photos: [
          { type: "exterior", url: "/images/dorm2_exterior.jpg" },
          { type: "room", url: "/images/dorm2_room.jpg" },
          { type: "kitchen", url: "/images/dorm2_kitchen.jpg" },
          { type: "sports", url: "/images/dorm2_sports.jpg" }
        ]
      },
      {
        id: 3,
        name: {
          ru: "Семейное общежитие",
          kg: "Үй-бүлөлүк жатакана",
          en: "Family Dormitory"
        },
        address: {
          ru: "г. Бишкек, ул. Семейная, 5",
          kg: "Бишкек шаары, Үй-бүлөлүк көчө, 5",
          en: "Bishkek, Family Street, 5"
        },
        type: "family",
        capacity: 50,
        available: 3,
        description: {
          ru: "Общежитие для семейных студентов с отдельными квартирами",
          kg: "Өзүнчө батирлары бар үй-бүлөлүү студенттер үчүн жатакана",
          en: "Dormitory for married students with separate apartments"
        },
        rooms: [
          {
            type: "studio",
            name: { ru: "Студия", kg: "Студия", en: "Studio" },
            price: { ru: "8000 сом/месяц", kg: "8000 сом/ай", en: "8000 som/month" },
            features: { ru: "Спальня, кухня, санузел, Wi-Fi", kg: "Уктоочу бөлмө, ашкана, даарет, Wi-Fi", en: "Bedroom, kitchen, bathroom, Wi-Fi" }
          },
          {
            type: "one_bedroom",
            name: { ru: "Однокомнатная", kg: "Бир бөлмөлүү", en: "One bedroom" },
            price: { ru: "12000 сом/месяц", kg: "12000 сом/ай", en: "12000 som/month" },
            features: { ru: "Отдельная спальня, кухня, санузел, Wi-Fi", kg: "Өзүнчө спальня, ашкана, даарет, Wi-Fi", en: "Separate bedroom, kitchen, bathroom, Wi-Fi" }
          }
        ],
        facilities: [
          { ru: "Детская игровая площадка", kg: "Балдар оюн аянты", en: "Children's playground" },
          { ru: "Общая прачечная", kg: "Жалпы кир жуучу жай", en: "Shared laundry" },
          { ru: "Парковочные места", kg: "Унаа токтотуу жерлери", en: "Parking spaces" },
          { ru: "Круглосуточная охрана", kg: "Тун-күн коргоо", en: "24/7 security" }
        ],
        photos: [
          { type: "exterior", url: "/images/family_dorm_exterior.jpg" },
          { type: "apartment", url: "/images/family_apartment.jpg" },
          { type: "playground", url: "/images/playground.jpg" },
          { type: "parking", url: "/images/parking.jpg" }
        ]
      }
    ];
  };

  const getCurrentLanguage = () => {
    return ['ru', 'kg', 'en'].includes(i18n.language) ? i18n.language : 'ru';
  };

  const getTranslatedField = (obj, fieldPrefix) => {
    if (!obj) return '';
    
    const lang = getCurrentLanguage();
    
    // If obj is a string, return it directly
    if (typeof obj === 'string') return obj;
    
    // Handle backend API format (name_ru, name_kg, name_en)
    const backendFormat = obj[`${fieldPrefix}_${lang}`] || obj[`${fieldPrefix}_ru`];
    if (backendFormat) return backendFormat;
    
    // Handle nested object format (name.ru, name.kg, name.en)
    if (obj[fieldPrefix] && typeof obj[fieldPrefix] === 'object') {
      return obj[fieldPrefix][lang] || obj[fieldPrefix]['ru'] || '';
    }
    
    // Try different field name patterns
    const patterns = [
      `${fieldPrefix}_${lang}`,
      `${fieldPrefix}_ru`,
      fieldPrefix,
      lang,
      'ru',
      'name',
      'title'
    ];
    
    for (const pattern of patterns) {
      if (obj[pattern] && typeof obj[pattern] === 'string') {
        return obj[pattern];
      }
    }
    
    // If obj has the language directly as a property
    if (obj[lang]) return obj[lang];
    if (obj.ru) return obj.ru;
    if (obj.en) return obj.en;
    if (obj.kg) return obj.kg;
    
    return '';
  };

  // Поиск общежитий
  const filteredDormitories = useMemo(() => {
    if (!searchTerm) return dormitories;
    
    return dormitories.filter(dorm => {
      try {
        const name = getTranslatedField(dorm, 'name').toLowerCase();
        const description = getTranslatedField(dorm, 'description').toLowerCase();
        const address = getTranslatedField(dorm, 'address').toLowerCase();
        const search = searchTerm.toLowerCase();
        
        return name.includes(search) || description.includes(search) || address.includes(search);
      } catch (error) {
        console.warn('Error filtering dormitory:', error, dorm);
        return false;
      }
    });
  }, [dormitories, searchTerm, i18n.language]);

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100">
        <div className="text-center">
          <motion.div
            animate={{ 
              rotate: 360,
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              rotate: { duration: 2, repeat: Infinity, ease: "linear" },
              scale: { duration: 1.5, repeat: Infinity }
            }}
            className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl"
          >
            <HomeModernIcon className="w-12 h-12 text-white" />
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xl text-gray-700 font-medium"
          >
            {t('loading', 'Загрузка общежитий...')}
          </motion.p>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 200 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mt-4 mx-auto"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <FadeIn delay={0.1}>
          <div className="text-center mb-12">
            <motion.h1 
              className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, type: "spring" }}
            >
              {t('dormitories.title', 'Студенческие общежития')}
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {t('dormitories.subtitle', 'Комфортабельное проживание с современными условиями для успешной учебы')}
            </motion.p>
          </div>
        </FadeIn>

        {/* Search Section */}
        <FadeIn delay={0.2}>
          <div className="bg-white rounded-2xl shadow-2xl p-8 mb-12 border border-gray-100">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {t('dormitories.findDormitory', 'Найдите идеальное общежитие')}
              </h2>
              <p className="text-gray-600">
                {t('dormitories.searchHint', 'Ищите по названию, описанию или адресу')}
              </p>
            </div>
            <div className="relative max-w-2xl mx-auto">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <BuildingOfficeIcon className="h-6 w-6 text-blue-500" />
              </div>
              <input
                type="text"
                placeholder={t('dormitories.searchPlaceholder', 'Поиск общежитий...')}
                className="w-full pl-12 pr-6 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <motion.button
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                >
                  ×
                </motion.button>
              )}
            </div>
          </div>
        </FadeIn>

        {/* Tab Navigation */}
        <FadeIn delay={0.3}>
          <div className="flex justify-center mb-12">
            <div className="bg-white rounded-2xl shadow-lg p-2 border border-gray-200">
              <div className="flex">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab('dormitories')}
                  className={`px-8 py-4 rounded-xl transition-all flex items-center gap-3 text-lg font-medium ${
                    activeTab === 'dormitories'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                      : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  <HomeModernIcon className="w-6 h-6" />
                  {t('dormitories.dormitoriesTab', 'Общежития')}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab('application')}
                  className={`px-8 py-4 rounded-xl transition-all flex items-center gap-3 text-lg font-medium ${
                    activeTab === 'application'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                      : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  <DocumentTextIcon className="w-6 h-6" />
                  {t('dormitories.applicationTab', 'Заселение')}
                </motion.button>
              </div>
            </div>
          </div>
        </FadeIn>

        <AnimatePresence mode="wait">
          {activeTab === 'dormitories' && (
            <motion.div
              key="dormitories"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              {filteredDormitories.length > 0 ? (
                <StaggerChildren className="space-y-8">
                  {filteredDormitories.map((dorm, index) => (
                    <motion.div
                      key={dorm.id}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 border border-gray-100"
                    >
                      <div className="md:flex">
                        <div className="md:w-2/5 relative group">
                          <motion.img
                            src={dorm.main_photo || dorm.exterior_photo || dorm.photos?.[0]?.url || `https://picsum.photos/600/400?random=${dorm.id}`}
                            alt={getTranslatedField(dorm, 'name')}
                            className="w-full h-72 md:h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            onError={(e) => {
                              e.target.src = `https://picsum.photos/600/400?random=${Math.floor(Math.random() * 1000)}`;
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          
                          <div className="absolute top-4 left-4">
                            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                              dorm.type === 'female' ? 'bg-pink-100 text-pink-800' :
                              dorm.type === 'male' ? 'bg-blue-100 text-blue-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {t(`dormitories.types.${dorm.type}`, dorm.type || 'dormitory')}
                            </span>
                          </div>
                          
                          <div className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg">
                            <div className={`w-4 h-4 rounded-full ${(dorm.available || 0) > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
                          </div>
                        </div>
                        
                        <div className="md:w-3/5 p-8">
                          <div className="flex justify-between items-start mb-6">
                            <h2 className="text-3xl font-bold text-gray-900">
                              {getTranslatedField(dorm, 'name') || 'Dormitory'}
                            </h2>
                            <div className="text-right">
                              <div className="text-sm text-gray-500 mb-1">{t('dormitories.available', 'Свободно')}</div>
                              <div className={`text-2xl font-bold ${(dorm.available || 0) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {dorm.available || 0} / {dorm.capacity || 0}
                              </div>
                            </div>
                          </div>

                          <p className="text-gray-600 mb-8 leading-relaxed text-lg">
                            {getTranslatedField(dorm, 'description') || 'No description available'}
                          </p>

                          <div className="grid md:grid-cols-2 gap-6 mb-8">
                            <div className="flex items-center text-gray-700">
                              <MapPinIcon className="w-6 h-6 text-blue-500 mr-4" />
                              <span>{getTranslatedField(dorm, 'address') || 'Address not available'}</span>
                            </div>
                            <div className="flex items-center text-gray-700">
                              <UsersIcon className="w-6 h-6 text-green-500 mr-4" />
                              <span>{dorm.capacity || 0} {t('dormitories.capacity', 'мест')}</span>
                            </div>
                          </div>

                          <div className="flex gap-4">
                            <motion.button
                              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.4)" }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setSelectedDorm(selectedDorm === dorm.id ? null : dorm.id)}
                              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold text-lg flex items-center justify-center gap-3"
                            >
                              {selectedDorm === dorm.id ? (
                                <>
                                  <ChevronUpIcon className="w-5 h-5" />
                                  {t('dormitories.hideDetails', 'Скрыть')}
                                </>
                              ) : (
                                <>
                                  <ChevronDownIcon className="w-5 h-5" />
                                  {t('dormitories.showDetails', 'Подробнее')}
                                </>
                              )}
                            </motion.button>
                            
                          
                          </div>
                        </div>
                      </div>

                      <AnimatePresence>
                        {selectedDorm === dorm.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.4 }}
                            className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 border-t"
                          >
                            <div className="grid lg:grid-cols-2 gap-12">
                              <ErrorBoundary fallback={
                                <div className="text-center py-8">
                                  <p className="text-gray-500">Room information temporarily unavailable</p>
                                </div>
                              }>
                                <div>
                                  <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                                    <AcademicCapIcon className="w-8 h-8 text-blue-600 mr-4" />
                                    {t('dormitories.roomDetails', 'Типы комнат и цены')}
                                  </h3>
                                  <div className="space-y-6">
                                    {(dorm.rooms || []).map((room, index) => (
                                      <motion.div
                                        key={index}
                                        whileHover={{ scale: 1.02, y: -2 }}
                                        className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100"
                                      >
                                        <h4 className="font-bold text-gray-900 text-xl mb-3">
                                          {room?.name?.[getCurrentLanguage()] || 'Room'}
                                        </h4>
                                        <p className="text-blue-600 font-bold text-2xl mb-3">
                                          {room?.price?.[getCurrentLanguage()] || 'Price not available'}
                                        </p>
                                        <p className="text-gray-600">
                                          {room?.features?.[getCurrentLanguage()] || 'Features not available'}
                                        </p>
                                      </motion.div>
                                    ))}
                                  </div>
                                </div>
                              </ErrorBoundary>

                              <ErrorBoundary fallback={
                                <div className="text-center py-8">
                                  <p className="text-gray-500">Facilities information temporarily unavailable</p>
                                </div>
                              }>
                                <div>
                                  <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                                    <CheckBadgeIcon className="w-8 h-8 text-green-600 mr-4" />
                                    {t('dormitories.allFacilities', 'Все удобства')}
                                  </h3>
                                  <div className="grid grid-cols-1 gap-4">
                                    {(dorm.facilities || []).map((facility, index) => (
                                      <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="flex items-center p-4 bg-white rounded-xl shadow-sm border border-gray-200"
                                      >
                                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4">
                                          <CheckBadgeIcon className="w-5 h-5 text-green-600" />
                                        </div>
                                        <span className="text-gray-700 font-medium">
                                          {typeof facility === 'string' ? 
                                            facility : 
                                            (facility[getCurrentLanguage()] || facility.ru || facility.en || getTranslatedField(facility, 'name'))
                                          }
                                        </span>
                                      </motion.div>
                                    ))}
                                  </div>
                                </div>
                              </ErrorBoundary>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </StaggerChildren>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-20"
                >
                  <div className="bg-white rounded-2xl p-12 shadow-2xl max-w-2xl mx-auto">
                    <BuildingOfficeIcon className="w-20 h-20 text-gray-400 mx-auto mb-6" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      {t('dormitories.noDormitories', 'Общежития не найдены')}
                    </h3>
                    <p className="text-gray-600 mb-6 text-lg">
                      {t('dormitories.noDormitoriesDesc', 'Попробуйте изменить поисковый запрос')}
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSearchTerm('')}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold"
                    >
                      {t('dormitories.clearSearch', 'Очистить поиск')}
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {activeTab === 'application' && (
            <motion.div
              key="application"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl shadow-2xl p-8"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
                {t('dormitories.applicationProcess', 'Процесс заселения')}
              </h2>

              <div className="grid lg:grid-cols-2 gap-16">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-8 flex items-center">
                    <DocumentTextIcon className="w-8 h-8 text-blue-600 mr-4" />
                    {t('dormitories.requiredDocuments', 'Необходимые документы')}
                  </h3>
                  <div className="space-y-4">
                    {[
                      { ru: "Заявление на заселение", kg: "Орнотууга арыз", en: "Application for accommodation" },
                      { ru: "Справка о доходах семьи", kg: "Үй-бүлөнүн кирешеси жөнүндө маалымат", en: "Family income certificate" },
                      { ru: "Медицинская справка", kg: "Медициналык справка", en: "Medical certificate" },
                      { ru: "Копия паспорта", kg: "Паспорттун көчүрмөсү", en: "Passport copy" },
                      { ru: "Фотографии 3x4", kg: "3x4 сүрөттөр", en: "Photos 3x4" },
                      { ru: "Справка о флюорографии", kg: "Флюорография справкасы", en: "Fluorography certificate" }
                    ].map((doc, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ x: 10 }}
                        className="flex items-center p-5 bg-blue-50 rounded-xl border-l-4 border-blue-500"
                      >
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                          <span className="text-blue-600 font-bold">{index + 1}</span>
                        </div>
                        <span className="text-gray-700 font-medium">{doc[getCurrentLanguage()]}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-8 flex items-center">
                    <ClockIcon className="w-8 h-8 text-green-600 mr-4" />
                    {t('dormitories.applicationSteps', 'Этапы заселения')}
                  </h3>
                  <div className="space-y-6">
                    {[
                      {
                        title: { ru: "Подача документов", kg: "Документтерди тапшыруу", en: "Document submission" },
                        desc: { ru: "Подача полного пакета документов", kg: "Толук документтерди тапшыруу", en: "Submit complete documents" }
                      },
                      {
                        title: { ru: "Рассмотрение заявления", kg: "Арызды кароо", en: "Application review" },
                        desc: { ru: "Рассмотрение в течение 5-7 дней", kg: "5-7 күн ичинде кароо", en: "Review within 5-7 days" }
                      },
                      {
                        title: { ru: "Уведомление", kg: "Кабарлоо", en: "Notification" },
                        desc: { ru: "Уведомление о предоставлении места", kg: "Орун берүү жөнүндө кабарлоо", en: "Place allocation notification" }
                      },
                      {
                        title: { ru: "Заселение", kg: "Орношуу", en: "Check-in" },
                        desc: { ru: "Подписание договора и заселение", kg: "Келишим жана орношуу", en: "Contract signing and check-in" }
                      }
                    ].map((step, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
                      >
                        <div className="flex items-start">
                          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full flex items-center justify-center text-lg font-bold mr-4">
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-800 text-xl mb-2">
                              {step.title[getCurrentLanguage()]}
                            </h4>
                            <p className="text-gray-600">
                              {step.desc[getCurrentLanguage()]}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-16 pt-12 border-t border-gray-200"
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                  {t('dormitories.contactInfo', 'Контактная информация')}
                </h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl">
                    <h4 className="font-semibold text-gray-800 mb-4 text-lg">
                      {t('dormitories.dormitoryDepartment', 'Отдел общежитий')}
                    </h4>
                    <div className="space-y-3">
                      <p className="flex items-center text-gray-700">
                        <ClockIcon className="w-5 h-5 text-blue-600 mr-3" />
                        {t('dormitories.schedule', 'Пн-Пт: 9:00-17:00')}
                      </p>
                      <p className="flex items-center text-gray-700">
                        <PhoneIcon className="w-5 h-5 text-blue-600 mr-3" />
                        +996 312 123-456
                      </p>
                      <p className="flex items-center text-gray-700">
                        <EnvelopeIcon className="w-5 h-5 text-blue-600 mr-3" />
                        dormitory@salymbekov.edu.kg
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl">
                    <h4 className="font-semibold text-gray-800 mb-4 text-lg">
                      {t('dormitories.adminOffice', 'Администрация')}
                    </h4>
                    <div className="space-y-3">
                      <p className="flex items-center text-gray-700">
                        <PhoneIcon className="w-5 h-5 text-purple-600 mr-3" />
                        +996 555 123-456
                      </p>
                      <p className="text-gray-700">
                        {t('dormitories.administrator', 'Администратор')}: Петрова А.И.
                      </p>
                      <p className="text-gray-700">
                        {t('dormitories.mainAddress', 'ул. Студенческая, 8')}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Dormitories;