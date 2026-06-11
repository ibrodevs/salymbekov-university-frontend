import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, ClipboardList } from 'lucide-react';
import askarSalymbekovPhoto from '../../assets/founders/askar-salymbekov.jpg';
import esengeldiZhumadilovPhoto from '../../assets/founders/esengeldi-zhumadilov.jpg';

// Initials + a deterministic color so people without a photo get a clean,
// distinct avatar instead of a misleading stock portrait.
const AVATAR_COLORS = [
  '#2563EB', '#7C3AED', '#0891B2', '#059669', '#DC2626', '#D97706', '#DB2777', '#4F46E5',
];

const getInitials = (name = '') => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '?';
  return (parts[0][0] + (parts[1]?.[0] || '')).toUpperCase();
};

const colorFor = (name = '') => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};

const FounderAvatar = ({ name, image, className, style }) => {
  if (image) {
    return <img src={image} alt={name || ''} className={`${className} object-cover`} style={style} />;
  }
  return (
    <div
      className={`${className} flex items-center justify-center font-bold text-white select-none`}
      style={{ ...style, backgroundColor: colorFor(name) }}
      aria-label={name || ''}
    >
      {getInitials(name)}
    </div>
  );
};

// Verified leadership from the official university site (salymbekov.com).
// Photos are the university's own official portraits; people without a public
// portrait fall back to an initials avatar.
const FOUNDERS_DATA = [
  {
    id: 'salymbekov',
    image: askarSalymbekovPhoto,
    ru: { name: 'Аскар Салымбеков', position: 'Основатель университета', description: 'Предприниматель и меценат, основатель ассоциации «Дордой» и Салымбеков Университета.' },
    en: { name: 'Askar Salymbekov', position: 'Founder of the University', description: 'Entrepreneur and philanthropist, founder of the Dordoi Association and Salymbekov University.' },
    ky: { name: 'Аскар Салымбеков', position: 'Университеттин негиздөөчүсү', description: '«Дордой» ассоциациясынын жана Салымбеков Университетинин негиздөөчүсү, ишкер жана меценат.' },
  },
  {
    id: 'president',
    image: null,
    ru: { name: 'Жумадилов Амангелди Жумадилович', position: 'Президент университета', description: 'Президент Учреждения «Салымбеков Университет», PhD.' },
    en: { name: 'Amangeldi Zhumadilov', position: 'President of the University', description: 'President of Salymbekov University, PhD.' },
    ky: { name: 'Жумадилов Амангелди Жумадилович', position: 'Университеттин президенти', description: '«Салымбеков Университет» мекемесинин президенти, PhD.' },
  },
  {
    id: 'rector',
    image: esengeldiZhumadilovPhoto,
    ru: { name: 'Жумадилов Эсенгелди Жумадилович', position: 'Ректор университета', description: 'Ректор Салымбеков Университета, PhD.' },
    en: { name: 'Esengeldi Zhumadilov', position: 'Rector of the University', description: 'Rector of Salymbekov University, PhD.' },
    ky: { name: 'Жумадилов Эсенгелди Жумадилович', position: 'Университеттин ректору', description: 'Салымбеков Университетинин ректору, PhD.' },
  },
];

const localizeFounders = (lang = '') => {
  const code = lang.toLowerCase();
  const L = code.startsWith('ky') || code.startsWith('kg') ? 'ky' : code.startsWith('en') ? 'en' : 'ru';
  return FOUNDERS_DATA.map((f) => ({ id: f.id, image: f.image, years: '', ...f[L] }));
};

const Founders = () => {
  const { t, i18n } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [activeFounder, setActiveFounder] = useState(0);
  const [foundersData, setFoundersData] = useState(() => localizeFounders(i18n.language));
  const [loading] = useState(false);
  const [error] = useState(null);

  // Re-localize the curated founders list when the language changes.
  useEffect(() => {
    setFoundersData(localizeFounders(i18n.language));
  }, [i18n.language]);

  // Animation on mount
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Reset active founder when founders data changes
  useEffect(() => {
    if (foundersData.length > 0) {
      setActiveFounder(0);
    }
  }, [foundersData]);

  const changeActiveFounder = (index) => {
    setActiveFounder(index);
  };

  const getCurrentFounderData = () => {
    return foundersData[activeFounder] || {};
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 py-8 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('common.loading', 'Loading...')}</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 py-8 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 flex justify-center mb-4"><AlertTriangle className="w-12 h-12" /></div>
          <p className="text-gray-600 mb-4">{t('common.error', 'Error loading data')}</p>
          <p className="text-sm text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  // No data state
  if (!foundersData.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 py-8 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 flex justify-center mb-4"><ClipboardList className="w-12 h-12" /></div>
          <p className="text-gray-600">{t('founders.noData', 'No founders data available')}</p>
        </div>
      </div>
    );
  }

  const currentFounder = getCurrentFounderData();

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-white to-blue-50 py-8 px-4 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Заголовок */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('founders.title')}
          </h1>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            {t('founders.subtitle')}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Боковая навигация */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden sticky top-6">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-4 text-white font-bold text-lg">
                {t('founders.our_founders')}
              </div>
              <nav className="p-2">
                <ul className="space-y-1">
                  {foundersData.map((founder, index) => (
                    <li key={founder.id}>
                      <button
                        className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 ${activeFounder === index
                            ? "bg-blue-100 text-blue-700 font-medium shadow-sm"
                            : "text-gray-700 hover:bg-gray-100"
                          }`}
                        onClick={() => changeActiveFounder(index)}
                      >
                        <div className="flex items-center">
                          <FounderAvatar
                            name={founder.name}
                            image={founder.image}
                            className="w-10 h-10 rounded-full mr-3 border-2 border-gray-200 text-sm"
                          />
                          <div className="text-left">
                            <div className="font-medium text-sm">
                              {founder.name ? founder.name.split(' ')[0] : ''}
                            </div>
                            <div className="text-xs text-gray-500">
                              {founder.position ? founder.position.split(',')[0] : ''}
                            </div>
                          </div>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>

          {/* Основной контент */}
          <div className="lg:w-3/4">
            <div className="bg-white rounded-xl shadow-xl p-6 transition-all duration-500">
              {/* Заголовок и основная информация */}
              <div className="flex flex-col md:flex-row items-start mb-6 pb-6 border-b border-gray-200">
                <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                  <div className="relative">
                    <FounderAvatar
                      name={currentFounder.name}
                      image={currentFounder.image}
                      className="w-32 h-32 rounded-full border-4 border-blue-100 shadow-lg text-4xl"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                    {currentFounder.name || ''}
                  </h2>
                  <p className="text-blue-600 font-semibold text-lg mt-1">
                    {currentFounder.position || ''}
                  </p>
                  <p className="text-gray-500 mt-1">
                    {currentFounder.years || ''}
                  </p>
                  <p className="text-gray-700 mt-4 leading-relaxed">
                    {currentFounder.description || ''}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Founders;