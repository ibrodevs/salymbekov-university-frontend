import React, { useState, useEffect } from 'react';
import { BookOpen, Calendar, File, GraduationCap, Stethoscope, Users, Award, Clock, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import SEOComponent from '../SEO/SEOComponent';
import SideMenu from '../common/SideMenu';

const MedicalEducationPage = () => {
  const [selectedProgram, setSelectedProgram] = useState(null);
  const { t } = useTranslation();

  const hsmItems = [
    { title: t('nav.about_HSM'), link: '/hsm/about' },
    { title: t('nav.management'), link: '/hsm/manage' },
    { title: t('nav.programs'), link: '/hsm/programs' },
    { title: t('nav.academic_stuff'), link: '/hsm/AS' },
    { title: t('nav.partners'), link: '/hsm/partners' },
    { title: t('nav.cmk'), link: '/hsm/cmk' },
  ];


  // --- Получение программ с backend ---
  const [educationPrograms, setEducationPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { i18n } = useTranslation();

  useEffect(() => {
    setLoading(true);
    fetch('https://med-backend-d61c905599c2.herokuapp.com/api/hsm/programs/', {
      headers: {
        'Accept-Language': i18n.language === 'kg' ? 'ky' : i18n.language,
        'Content-Type': 'application/json'
      }
    })
      .then((res) => res.json())
      .then((data) => {
        setEducationPrograms(data.results || data || []);
        setLoading(false);
      })
      .catch((err) => {
        setError('Ошибка загрузки программ');
        setLoading(false);
      });
  }, [i18n.language]);

  // Функция для выбора нужного поля по языку
  function getLangField(obj, base) {
    let lang = i18n.language.toLowerCase();
    if (lang === 'kg') lang = 'ky';
    if (lang.startsWith('ru') && obj[base + '_ru']) return obj[base + '_ru'];
    if (lang.startsWith('en') && obj[base + '_en']) return obj[base + '_en'];
    if ((lang.startsWith('ky') || lang.startsWith('kgz')) && obj[base + '_kg']) return obj[base + '_kg'];
    return obj[base + '_ru'] || obj[base + '_en'] || obj[base + '_kg'] || '';
  }

  const getIconComponent = (iconName) => {
    const icons = {
      Stethoscope,
      GraduationCap,
      Award,
      BookOpen,
      Users
    };
    return icons[iconName] || Stethoscope;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-8 px-4">
      <SEOComponent pageType="medical-education" />
      
      <div className="max-w-7xl mx-auto">
        {/* Заголовок */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border-l-4 border-blue-600">
          <h1 className="text-4xl font-bold text-blue-800 mb-4">{t('mededu.pageTitle')}</h1>
        </div>

        {/* Карточки программ */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {loading ? (
            <div className="col-span-3 text-center text-gray-400">Loading...</div>
          ) : error ? (
            <div className="col-span-3 text-center text-red-500">{error}</div>
          ) : (
            educationPrograms.map((program, idx) => {
              // Иконки по индексу (можно доработать по профессии)
              const icons = [Stethoscope, GraduationCap, Award, BookOpen, Users];
              const IconComponent = icons[idx % icons.length];
              return (
                <div
                  key={program.id}
                  className={`bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl shadow-lg p-6 transform transition-all hover:scale-105 hover:shadow-xl`}
                >
                  <div className="flex items-center mb-4">
                    <IconComponent className="w-8 h-8 mr-3" />
                    <h3 className="text-xl font-bold">{program.name}</h3>
                  </div>
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      <span className="font-semibold">{program.duration}</span>
                    </div>
                    <div className="flex items-center">
                      <Award className="w-4 h-4 mr-2" />
                      <span>{program.profession}</span>
                    </div>
                  </div>
                  <p className="text-white/90 text-sm mb-6 leading-relaxed">
                    {program.description}
                  </p>
                  <button
                    onClick={() => setSelectedProgram(program)}
                    className="w-full bg-white text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center"
                  >
                    {t('mededu.detailsButton')}
                    <BookOpen className="w-4 h-4 ml-2" />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Модальное окно */}
      {selectedProgram && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Stethoscope className="w-8 h-8 mr-3" />
                  <h2 className="text-2xl font-bold">{selectedProgram.name}</h2>
                </div>
                <button
                  onClick={() => setSelectedProgram(null)}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="mt-4 flex flex-wrap gap-4">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>{selectedProgram.duration}</span>
                </div>
                <div className="flex items-center">
                  <Award className="w-4 h-4 mr-2" />
                  <span>{selectedProgram.profession}</span>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-3 capitalize">{t('mededu.overview')}</h3>
              <div className="text-gray-700 leading-relaxed">
                {selectedProgram.description}
              </div>
              {selectedProgram.review && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{t('mededu.modal.review', 'Обзор программы')}</h3>
                  <div className="text-gray-700 leading-relaxed">
                    {selectedProgram.review}
                  </div>
                </div>
              )}
            </div>
            <div className="border-t p-6 flex justify-end space-x-4">
              <button
                onClick={() => setSelectedProgram(null)}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {t('mededu.modal.close')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Боковое меню для навигации по разделу */}
      <SideMenu items={hsmItems} currentPath={window.location.pathname} />
    </div>
  );
};

export default MedicalEducationPage;