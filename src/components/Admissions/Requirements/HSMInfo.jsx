import { useState, useEffect, useMemo, useRef } from 'react';
import { Globe, Hospital, Microscope, Stethoscope, Heart, BookOpen } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { getHSMInfo, getLocalizedText } from '../../../data/hsmData';
import SideMenu from '../../common/SideMenu';
// Анимированный счетчик
const CounterItem = ({ end, icon, label, duration = 2000, delay = 0 }) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setIsVisible(true);
          setTimeout(() => {
            setHasAnimated(true);
            let startTime = null;
            const step = (timestamp) => {
              if (!startTime) startTime = timestamp;
              const progress = Math.min((timestamp - startTime) / duration, 1);
              const easeOutQuart = 1 - Math.pow(1 - progress, 4);
              setCount(Math.floor(easeOutQuart * end));
              if (progress < 1) {
                window.requestAnimationFrame(step);
              }
            };
            window.requestAnimationFrame(step);
          }, delay);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [end, duration, hasAnimated, delay]);

  return (
    <div
      ref={ref}
      className={`text-center p-8 bg-white rounded-2xl shadow-xl transform transition-all duration-700 ${
        isVisible
          ? 'opacity-100 translate-y-0 scale-100 hover:shadow-2xl hover:-translate-y-2'
          : 'opacity-0 translate-y-10 scale-95'
      }`}
    >
      <div className="relative inline-block mb-4">
        <div className="text-5xl mb-2">{icon}</div>
        {hasAnimated && (
          <div className="absolute -top-2 -right-4">
            <div className="relative">
              <div className="animate-ping absolute inline-flex h-5 w-5 rounded-full bg-blue-400 opacity-75"></div>
              <div className="relative inline-flex rounded-full h-5 w-5 bg-blue-600"></div>
            </div>
          </div>
        )}
      </div>
      <div className="text-5xl font-bold text-blue-600 mb-2 transition-all duration-300">
        {count.toLocaleString()}+
      </div>
      <div className="text-lg text-gray-700 font-medium bg-blue-50 py-2 px-4 rounded-full inline-block">
        {label}
      </div>
      {hasAnimated && (
        <div className="mt-4 h-1 w-20 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full mx-auto"></div>
      )}
    </div>
  );
};
import { 
  AcademicCapIcon, 
  UserGroupIcon, 
  DocumentCheckIcon, 
  ChartBarIcon,
  ArrowTopRightOnSquareIcon,
  HeartIcon,
  ShieldCheckIcon,
  StarIcon,
  ClockIcon,
  BuildingLibraryIcon
} from '@heroicons/react/24/outline';

const HSMInfo = () => {
  const { t, i18n } = useTranslation();

  const hsmItems = [
    { title: t('nav.about_HSM'), link: '/hsm/about' },
    { title: t('nav.management'), link: '/hsm/manage' },
    { title: t('nav.programs'), link: '/hsm/programs' },
    { title: t('nav.academic_stuff'), link: '/hsm/AS' },
    { title: t('nav.partners'), link: '/hsm/partners' },
    { title: t('nav.cmk'), link: '/hsm/cmk' },
  ];
  const [hsmInfo, setHsmInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    try {
      const loadData = async () => {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 800));
        const data = getHSMInfo();
        
        if (!data) {
          throw new Error('Failed to load HSM data');
        }
        
        setHsmInfo(data);
        setLoading(false);
      };
      
      loadData();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, []);

  const localizedData = useMemo(() => {
    if (!hsmInfo) return null;
    
    return {
      title: getLocalizedText(hsmInfo, 'title', i18n.language),
      description: getLocalizedText(hsmInfo, 'description', i18n.language),
      history: getLocalizedText(hsmInfo, 'history', i18n.language),
      mainDirections: getLocalizedText(hsmInfo, 'main_directions', i18n.language)
    };
  }, [hsmInfo, i18n.language]);

  useEffect(() => {
    if (localizedData?.title) {
      document.title = `${localizedData.title} - Салымбеков Университет`;
    }
  }, [localizedData?.title]);

  // Автоматическая смена секций
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSection(prev => (prev + 1) % 3);
    }, 20000); 
    return () => clearInterval(interval);
  }, []);


  // --- Блок статистики: данные с backend ---
  const [facts, setFacts] = useState([]);
  const [factsLoading, setFactsLoading] = useState(true);
  useEffect(() => {
    setFactsLoading(true);
    fetch('https://med-backend-d61c905599c2.herokuapp.com/api/home/numbers/', {
      headers: {
        'Accept-Language': i18n.language === 'kg' ? 'ky' : i18n.language,
        'Content-Type': 'application/json'
      }
    })
      .then((res) => res.json())
      .then((data) => {
        setFacts(data.results || data || []);
        setFactsLoading(false);
      })
      .catch(() => setFactsLoading(false));
  }, [i18n.language]);

  function getDescription(fact) {
    let lang = i18n.language.toLowerCase();
    if (lang === 'kg') lang = 'ky';
    if (lang.startsWith('ru') && fact.description_ru) return fact.description_ru;
    if (lang.startsWith('en') && fact.description_en) return fact.description_en;
    if ((lang.startsWith('ky') || lang.startsWith('kgz')) && fact.description_kg) return fact.description_kg;
    return fact.description || '';
  }

  const quickLinks = [
    {
      href:'/hsm/programs',
      icon: <AcademicCapIcon className="w-6 h-6" />,
      title: t('hsm.programs', 'Программы'),
      description: t('hsm.view_programs', 'Ознакомьтесь с нашими образовательными программами'),
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      href: "/hsm/AS",
      icon: <UserGroupIcon className="w-6 h-6" />,
      title: t('hsm.faculty', 'Преподаватели'),
      description: t('hsm.meet_faculty', 'Познакомьтесь с нашими преподавателями'),
      gradient: "from-green-500 to-emerald-500"
    },
    {
      href: "/hsm/accreditation",
      icon: <DocumentCheckIcon className="w-6 h-6" />,
      title: t('hsm.accreditation', 'Аккредитация'),
      description: t('hsm.view_accreditation', 'Наши аккредитации и сертификаты'),
      gradient: "from-purple-500 to-violet-500"
    },
    {
      href: "/hsm/learning-goals",
      icon: <ChartBarIcon className="w-6 h-6" />,
      title: t('hsm.learning_goals', 'Цели обучения'),
      description: t('hsm.view_goals', 'Цели и результаты обучения'),
      gradient: "from-orange-500 to-red-500"
    }
  ];

  const medicalFeatures = [
    {
      icon: "Hospital",
      title: t('hsm.modern_equipment', 'Современное оборудование'),
      description: t('hsm.modern_equipment_desc', 'Оснащение последними медицинскими технологиями')
    },
    {
      icon: "Stethoscope",
      title: t('hsm.practice', 'Практическая подготовка'),
      description: t('hsm.practice_desc', 'Реальная практика в лучших клиниках')
    },
    {
      icon: "Globe",
      title: t('hsm.international', 'Международные стандарты'),
      description: t('hsm.international_desc', 'Обучение по мировым стандартам медицины')
    },
    {
      icon: "Microscope",
      title: t('hsm.research', 'Научные исследования'),
      description: t('hsm.research_desc', 'Участие в передовых медицинских исследованиях')
    }
  ];

  const renderFormattedText = (text) => {
    return text.split('\n').map((paragraph, index) => {
      if (!paragraph.trim()) return null;
      
      if (paragraph.trim().startsWith('•')) {
        return (
          <motion.div 
            key={index} 
            className="flex items-start mb-3"
            whileHover={{ x: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
            <span className="text-gray-700">{paragraph.replace('•', '').trim()}</span>
          </motion.div>
        );
      }
      
      if (paragraph.trim().endsWith(':')) {
        return (
          <motion.p 
            key={index} 
            className="mb-4 font-semibold text-lg bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {paragraph}
          </motion.p>
        );
      }
      
      return (
        <motion.p 
          key={index} 
          className="mb-4 text-gray-700 leading-relaxed"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          {paragraph}
        </motion.p>
      );
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 pt-24">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-96">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <motion.div
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                  scale: { duration: 1, repeat: Infinity }
                }}
                className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-6"
              ></motion.div>
              <motion.p 
                className="text-gray-600 text-lg"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                {t('common.loading', 'Загрузка медицинских данных...')}
              </motion.p>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !hsmInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 pt-24">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto border-l-4 border-red-500">
              <motion.div
                animate={{ pulse: 1 }}
                transition={{ duration: 0.5 }}
                className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </motion.div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('hsm.error', 'Ошибка загрузки')}</h2>
              <p className="text-gray-600 mb-6">{t('hsm.no_data', 'Не удалось загрузить информацию о медицинской школе')}</p>
              <motion.button 
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-semibold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {t('common.try_again', 'Попробовать снова')}
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 pt-24">
      {/* Hero Section с медицинской тематикой */}
      <motion.section
        className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-blue-800 to-cyan-900 text-white py-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-medical-pattern opacity-10"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black opacity-20"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.h1 
              className="text-5xl md:text-6xl font-bold mb-6 leading-tight"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              {localizedData.title}
            </motion.h1>
            <motion.div 
              className="w-32 h-1 bg-gradient-to-r from-cyan-400 to-blue-400 mx-auto rounded-full mb-8"
              initial={{ width: 0 }}
              animate={{ width: 128 }}
              transition={{ delay: 0.5, duration: 1 }}
            ></motion.div>
          </motion.div>
        </div>

        {/* Плавающие медицинские иконки */}
        <motion.div
          className="absolute top-10 left-10 text-4xl opacity-20"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <Hospital className="w-5 h-5" />
        </motion.div>
        <motion.div
          className="absolute top-20 right-20 text-3xl opacity-20"
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
        >
          <Heart className="w-5 h-5" />
        </motion.div>
        <motion.div
          className="absolute bottom-10 left-20 text-2xl opacity-20"
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 6, repeat: Infinity, delay: 2 }}
        >
          <Stethoscope className="w-5 h-5" />
        </motion.div>
      </motion.section>

      {/* Статистика с анимацией (цифры с backend) */}
      <section className="relative -mt-10 z-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {factsLoading ? (
              <div className="col-span-4 text-center text-gray-400">Loading...</div>
            ) : (
              facts.map((fact, index) => (
                <CounterItem
                  key={fact.id || index}
                  end={parseInt(fact.number)}
                  icon={<img src={fact.icon} alt="icon" className="w-12 h-12 mx-auto" />}
                  label={getDescription(fact)}
                  delay={index * 200}
                />
              ))
            )}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        {/* Особенности медицинского образования */}

        {/* Основной контент с табами */}
        <motion.section
          className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Навигация по табам */}
          <div className="border-b border-gray-200">
            <div className="flex overflow-x-auto">
              {['about', 'history', 'directions'].map((tab, index) => (
                <button
                  key={tab}
                  onClick={() => setActiveSection(index)}
                  className={`flex-1 min-w-0 px-6 py-4 text-lg font-medium transition-all duration-300 ${
                    activeSection === index
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {t(`hsm.${tab}`, 
                    tab === 'about' ? 'О ВШМ' : 
                    tab === 'history' ? 'История' : 'Направления'
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Контент табов */}
          <div className="p-8 md:p-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="prose prose-lg max-w-none"
              >
                {activeSection === 0 && (
                  <div>
                    {renderFormattedText(localizedData.description)}
                  </div>
                )}
                {activeSection === 1 && (
                  <div>
                    {renderFormattedText(localizedData.history)}
                  </div>
                )}
                {activeSection === 2 && (
                  <div>
                    <ul className="space-y-4 text-lg">
                      <li><span className="font-semibold">{t('hsm.direction.therapeutic5', 'Лечебное дело')}</span> — {t('hsm.direction.5years', '5 лет')}</li>
                      <li><span className="font-semibold">{t('hsm.direction.therapeutic6', 'Лечебное дело')}</span> — {t('hsm.direction.6years', '6 лет')}</li>
                      <li><span className="font-semibold">{t('hsm.direction.residency', 'Ординатура')}</span></li>
                      <li><span className="font-semibold">{t('hsm.direction.phd', 'PhD докторантура')}</span></li>
                      <li><span className="font-semibold">{t('hsm.direction.postgraduate', 'Аспирантура')}</span></li>
                      <li><span className="font-semibold">{t('hsm.direction.additional', 'Дополнительное образование')}</span></li>
                    </ul>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.section>
      </div>

      {/* Боковое меню для навигации по разделу */}
      <SideMenu items={hsmItems} currentPath={window.location.pathname} />

      {/* Стили для медицинского паттерна */}
      <style jsx>{`
        .bg-medical-pattern {
          background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E");
        }
      `}</style>
    </div>
  );
};

export default HSMInfo;