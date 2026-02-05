
import React, { useState, useEffect } from "react";
import { BookOpen, Microscope } from 'lucide-react';
import { useTranslation } from "react-i18next";
import SideMenu from '../common/SideMenu';

const Resources = () => {
  const { t, i18n } = useTranslation();

  // Ссылки из backend для student
  const [studentLinks, setStudentLinks] = useState([]);
  useEffect(() => {
    fetch('https://med-backend-d61c905599c2.herokuapp.com/api/home/navbar-links/', {
      headers: {
        'Accept-Language': i18n.language === 'kg' ? 'ky' : i18n.language,
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => setStudentLinks(data.results || []))
      .catch(() => setStudentLinks([]));
  }, [i18n]);

  // Функция для выбора названия ссылки по языку
  function getLinkName(link) {
    let lang = i18n.language.toLowerCase();
    if (lang === 'kg') lang = 'ky';
    if (lang.startsWith('ru') && link.name_ru) return link.name_ru;
    if (lang.startsWith('en') && link.name_en) return link.name_en;
    if ((lang.startsWith('ky') || lang.startsWith('kg')) && link.name_kg) return link.name_kg;
    return link.name || '';
  }

  const studentItems = [
    // Динамические ссылки с backend
    ...studentLinks.map(link => ({
      title: getLinkName(link),
      link: link.url,
      key: `${link.id || link.url}-${i18n.language}`
    })),
    // Статические ссылки
    { title: t('nav.acadop'), link: '/student/acadop' },
    { title: t('nav.clubs'), link: '/student/clubs' },
    { title: t('nav.resources'), link: '/hsm/resources' },
    { title: t('nav.instructions'), link: '/student/instructions' },
  ];
  const [isVisible, setIsVisible] = useState(false);
  const [moodleCredentials, setMoodleCredentials] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [activeResource, setActiveResource] = useState(null);
  const [activeSection, setActiveSection] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Animation on mount
  useEffect(() => {
    setIsVisible(true);
  }, []);


  // --- Backend data state ---
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch('https://med-backend-d61c905599c2.herokuapp.com/api/hsm/e-resources/', {
      headers: {
        'Accept-Language': i18n.language === 'kg' ? 'ky' : i18n.language,
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setResources(Array.isArray(data) ? data : (data.results || []));
        setLoading(false);
      })
      .catch((err) => {
        setError('Ошибка загрузки ресурсов');
        setLoading(false);
      });
  }, [i18n.language]);

  // Мультиязычные поля
  function getLangField(obj, base) {
    let lang = i18n.language.toLowerCase();
    if (lang === 'kg') lang = 'ky';
    if (lang.startsWith('ru') && obj[base + '_ru']) return obj[base + '_ru'];
    if (lang.startsWith('en') && obj[base + '_en']) return obj[base + '_en'];
    if ((lang.startsWith('ky') || lang.startsWith('kgz')) && obj[base + '_kg']) return obj[base + '_kg'];
    return obj[base + '_ru'] || obj[base + '_en'] || obj[base + '_kg'] || '';
  }


  // Получить features по языку
  function getLangFeatures(resource) {
    let lang = i18n.language.toLowerCase();
    if (lang === 'kg') lang = 'ky';
    if (lang.startsWith('ru') && resource.features_ru) return resource.features_ru;
    if (lang.startsWith('en') && resource.features_en) return resource.features_en;
    if ((lang.startsWith('ky') || lang.startsWith('kgz')) && resource.features_kg) return resource.features_kg;
    return resource.features_ru || resource.features_en || resource.features_kg || [];
  }

  // Фильтрация по поиску
  const filteredResources = resources.filter(resource => {
    const search = searchTerm.trim().toLowerCase();
    if (!search) return true;
    const title = getLangField(resource, 'name')?.toLowerCase() || '';
    const desc = getLangField(resource, 'description')?.toLowerCase() || '';
    const features = (getLangFeatures(resource) || []).join(' ').toLowerCase();
    return title.includes(search) || desc.includes(search) || features.includes(search);
  });

  const handleMoodleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert(t('resources.loginSuccess', 'Вход выполнен успешно!'));
      setMoodleCredentials({ username: '', password: '' });
      setActiveResource(null);
    } catch (error) {
      console.error('Login error:', error);
      alert(t('resources.loginError', 'Ошибка входа. Проверьте данные.'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMoodleCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Loading state
  if (loading) {
    return (
      <div
        className={`min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 transition-all duration-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Заголовок */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t("resources.title", "Электронная библиотека")}
          </h1>
        </div>

        <div>
          {/* Основной контент */}
          <div className="w-full">
            <div className="bg-white rounded-xl shadow-xl p-6 transition-all duration-500">

              {/* Поиск */}
              <div className="mb-6 flex justify-end">
                <input
                  type="text"
                  className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder={t('resources.searchPlaceholder', 'Поиск по ресурсам...')}
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Ресурсы */}
              <div className="space-y-6">
                {filteredResources.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredResources.map((resource, index) => (
                      <div
                        key={resource.id}
                        className="bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-md overflow-hidden border border-blue-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="p-6">
                          <div className="flex items-center mb-4">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-xl mr-4`}>
                              <BookOpen className="w-7 h-7 text-blue-700" />
                            </div>
                            <div>
                              <h3 className="font-bold text-lg text-gray-900">
                                {getLangField(resource, 'name')}
                              </h3>
                              <p className="text-blue-600 text-sm">
                                {getLangField(resource, 'description')}
                              </p>
                            </div>
                          </div>

                          {/* Особенности */}
                          <div className="mb-4">
                            <ul className="space-y-2">
                              {getLangFeatures(resource).map((feature, idx) => (
                                <li key={idx} className="flex items-center text-sm text-gray-600">
                                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></span>
                                  <span className="break-words">{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Действия */}
                          <div className="mt-4">
                            {resource.links && resource.links.main && (
                              <a
                                href={resource.links.main}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 w-full font-medium text-sm"
                              >
                                <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                                <span className="truncate">{t('resources.libLink', 'Перейти в библиотеку')}</span>
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <svg
                      className="mx-auto h-16 w-16 text-gray-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                    <h3 className="mt-4 text-lg font-medium text-gray-900">
                      {t("resources.noResources", "Ресурсы не найдены")}
                    </h3>
                    <p className="mt-2 text-gray-500">
                      {searchTerm.trim() ? t("resources.noSearchResults", "По вашему запросу ничего не найдено") : t("resources.noResourcesDesc", "В этой категории пока нет доступных ресурсов")}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Боковое меню для навигации по разделу */}
      <SideMenu items={studentItems} currentPath={window.location.pathname} />
    </div>
  );
};

export default Resources;