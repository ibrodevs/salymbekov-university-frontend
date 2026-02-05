import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const SocOp = () => {
  const { t, i18n } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Состояния для данных
  const [events, setEvents] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [projects, setProjects] = useState([]);

  // Animation on mount
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Загрузка данных с API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const baseURL = 'https://med-backend-d61c905599c2.herokuapp.com/api/social-opportunities';

        const [eventsResponse, clubsResponse, projectsResponse] = await Promise.all([
          axios.get(`${baseURL}/events/`),
          axios.get(`${baseURL}/clubs/`),
          axios.get(`${baseURL}/projects/`)
        ]);

        // Обрабатываем пагинированные ответы
        setEvents(eventsResponse.data.results || eventsResponse.data);
        setClubs(clubsResponse.data.results || clubsResponse.data);
        setProjects(projectsResponse.data.results || projectsResponse.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Ошибка загрузки данных');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Функция для получения правильного поля в зависимости от языка
  const getLocalizedField = (item, fieldName) => {
    const currentLang = i18n.language;

    if (currentLang === 'en' && item[`${fieldName}_en`]) {
      return item[`${fieldName}_en`];
    } else if (currentLang === 'kg' && item[`${fieldName}_ky`]) {
      return item[`${fieldName}_ky`];
    }

    return item[fieldName] || '';
  };

  // Функция для обработки массивов переводов
  const getLocalizedArray = (item, fieldName) => {
    const currentLang = i18n.language;

    if (currentLang === 'en' && item[`${fieldName}_en`] && Array.isArray(item[`${fieldName}_en`])) {
      return item[`${fieldName}_en`];
    } else if (currentLang === 'kg' && item[`${fieldName}_ky`] && Array.isArray(item[`${fieldName}_ky`])) {
      return item[`${fieldName}_ky`];
    }

    return Array.isArray(item[fieldName]) ? item[fieldName] : [];
  };

  const sections = [
    { id: 'all', name: t('socop.categories.all'), icon: '🌟' },
    { id: 'events', name: t('socop.categories.events'), icon: '🎪' },
    { id: 'clubs', name: t('socop.categories.clubs'), icon: '👥' },
    { id: 'projects', name: t('socop.categories.projects'), icon: '🚀' }
  ];

  // Получение данных в зависимости от языка
  const socialData = {
    events: Array.isArray(events) ? events.map(event => ({
      ...event,
      uniqueId: `event-${event.id}`, // Уникальный ключ для события
      title: getLocalizedField(event, 'title'),
      description: getLocalizedField(event, 'description'),
      location: getLocalizedField(event, 'location'),
      organizer: getLocalizedField(event, 'organizer'),
      social_media_link: event.social_media_link,
      category: 'events'
    })) : [],
    clubs: Array.isArray(clubs) ? clubs.map(club => ({
      ...club,
      uniqueId: `club-${club.id}`, // Уникальный ключ для клуба
      title: getLocalizedField(club, 'title'),
      description: getLocalizedField(club, 'description'),
      meetings: getLocalizedField(club, 'meetings'),
      leader: getLocalizedField(club, 'leader'),
      achievements: getLocalizedArray(club, 'achievements'),
      social_media_link: club.social_media_link,
      category: 'clubs'
    })) : [],
    projects: Array.isArray(projects) ? projects.map(project => ({
      ...project,
      uniqueId: `project-${project.id}`, // Уникальный ключ для проекта
      title: getLocalizedField(project, 'title'),
      description: getLocalizedField(project, 'description'),
      needs: getLocalizedArray(project, 'needs'),
      social_media_link: project.social_media_link,
      category: 'projects'
    })) : []
  };

  const changeActiveSection = (sectionId) => {
    setActiveSection(sectionId);
  };

  // Фильтрация данных
  const getFilteredData = () => {
    let data = [];
    if (activeSection === 'all') {
      data = Object.values(socialData).flat();
    } else {
      data = socialData[activeSection];
    }

    if (searchTerm) {
      return data.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return data;
  };

  const filteredData = getFilteredData();

  // Статистика
  const statistics = [
    {
      label: t('socop.statistics.members'),
      value: '1500+',
      color: 'from-purple-500 to-purple-600'
    },
    {
      label: t('socop.statistics.projects'),
      value: socialData.projects.length,
      color: 'from-blue-500 to-blue-600'
    },
    {
      label: t('socop.statistics.events'),
      value: socialData.events.length,
      color: 'from-green-500 to-green-600'
    },
    {
      label: t('socop.statistics.clubs'),
      value: socialData.clubs.length,
      color: 'from-orange-500 to-orange-600'
    }
  ];

  const getActionButtonText = (category) => {
    const actions = {
      events: t('socop.actions.participate'),
      clubs: t('socop.actions.joinClub'),
      projects: t('socop.actions.joinProject')
    };
    return actions[category] || t('socop.actions.participate');
  };

  const renderAllContent = () => (
    <div className="space-y-6">
      <div className="flex items-center mb-6">
        <div className="p-3 bg-blue-100 rounded-xl mr-4">
          <span className="text-2xl">🌟</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-900">
          {t('socop.categories.all')}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredData.map((item) => (
          <div
            key={item.uniqueId}
            className="bg-white rounded-xl p-6 border border-blue-100 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className={`w-12 h-12 ${item.color} rounded-lg flex items-center justify-center text-2xl text-white mr-4`}>
                  {item.image}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    {item.title}
                  </h3>
                  <div className="flex items-center text-sm text-blue-600 mt-1">
                    <span className="bg-blue-100 px-2 py-1 rounded-full">
                      {item.category}
                    </span>
                  </div>
                </div>
              </div>
              {item.popular && (
                <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                  {t('socop.popularBadge')}
                </span>
              )}
            </div>

            <p className="text-gray-600 mb-4 leading-relaxed">
              {item.description}
            </p>

            <div className="space-y-2 mb-4">
              {item.category === 'events' && (
                <>
                  {item.date && (
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-medium mr-2">{t('socop.date')}:</span>
                      <span>{new Date(item.date).toLocaleDateString()}</span>
                    </div>
                  )}
                  {item.location && (
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-medium mr-2">{t('socop.location')}:</span>
                      <span>{item.location}</span>
                    </div>
                  )}
                  {item.organizer && (
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-medium mr-2">{t('socop.organizer')}:</span>
                      <span>{item.organizer}</span>
                    </div>
                  )}
                  {item.participants && (
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-medium mr-2">{t('socop.participants')}:</span>
                      <span>{item.participants}</span>
                    </div>
                  )}
                </>
              )}

              {item.category === 'clubs' && (
                <>
                  {item.members && (
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-medium mr-2">{t('socop.members')}:</span>
                      <span>{item.members}</span>
                    </div>
                  )}
                  {item.meetings && (
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-medium mr-2">{t('socop.meetings')}:</span>
                      <span>{item.meetings}</span>
                    </div>
                  )}
                  {item.leader && (
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-medium mr-2">{t('socop.leader')}:</span>
                      <span>{item.leader}</span>
                    </div>
                  )}
                </>
              )}

              {item.category === 'projects' && (
                <>
                  {item.team && (
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-medium mr-2">{t('socop.team')}:</span>
                      <span>{item.team}</span>
                    </div>
                  )}
                  {item.progress !== undefined && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>{t('socop.progress.title')}</span>
                        <span>{item.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-purple-500 h-2 rounded-full"
                          style={{ width: `${item.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {(item.achievements || item.needs) && (
              <div className="mb-4">
                <h4 className="font-semibold text-gray-800 text-sm mb-2">
                  {item.achievements ? t('socop.achievements') : t('socop.requirements')}:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {(item.achievements || item.needs || []).map((text, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                    >
                      {text}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <a
              href={item.social_media_link || '#'}
              target={item.social_media_link ? '_blank' : '_self'}
              rel={item.social_media_link ? 'noopener noreferrer' : ''}
              className={`w-full mt-4 px-4 py-2 rounded-lg transition-colors duration-300 font-medium text-center block ${item.social_media_link
                  ? 'bg-blue-500 text-white hover:bg-blue-600 cursor-pointer'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              onClick={!item.social_media_link ? (e) => e.preventDefault() : undefined}
            >
              {item.social_media_link ? getActionButtonText(item.category) : t('socop.comingSoon')}
            </a>
          </div>
        ))}
      </div>
    </div>
  );

  const renderEventsContent = () => (
    <div className="space-y-6">
      <div className="flex items-center mb-6">
        <div className="p-3 bg-blue-100 rounded-xl mr-4">
          <span className="text-2xl">🎪</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-900">
          {t('socop.categories.events')}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredData.map((event) => (
          <div
            key={event.uniqueId || `event-${event.id}`}
            className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className={`w-12 h-12 ${event.color} rounded-lg flex items-center justify-center text-2xl text-white mr-4`}>
                  {event.image}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    {event.title}
                  </h3>
                  <div className="flex items-center text-sm text-blue-600 mt-1">
                    <span className="bg-blue-100 px-2 py-1 rounded-full">
                      {event.type}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-gray-600 mb-4 leading-relaxed">
              {event.description}
            </p>

            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <span className="font-medium mr-2">{t('socop.date')}:</span>
                <span>{event.date}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <span className="font-medium mr-2">{t('socop.location')}:</span>
                <span>{event.location}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <span className="font-medium mr-2">{t('socop.organizer')}:</span>
                <span>{event.organizer}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <span className="font-medium mr-2">{t('socop.participants')}:</span>
                <span>{event.participants}</span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${event.registration === 'open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                {event.registration === 'open' ? t('socop.events.registration.open') : t('socop.events.registration.closed')}
              </span>
              <a
                href={event.social_media_link || '#'}
                target={event.social_media_link ? '_blank' : '_self'}
                rel={event.social_media_link ? 'noopener noreferrer' : ''}
                className={`px-4 py-2 rounded-lg transition-colors duration-300 text-sm font-medium ${event.social_media_link
                    ? 'bg-blue-500 text-white hover:bg-blue-600 cursor-pointer'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                onClick={!event.social_media_link ? (e) => e.preventDefault() : undefined}
              >
                {event.social_media_link ? t('socop.actions.participate') : t('socop.comingSoon')}
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderClubsContent = () => (
    <div className="space-y-6">
      <div className="flex items-center mb-6">
        <div className="p-3 bg-blue-100 rounded-xl mr-4">
          <span className="text-2xl">👥</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-900">
          {t('socop.categories.clubs')}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredData.map((club) => (
          <div
            key={club.uniqueId || `club-${club.id}`}
            className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className={`w-12 h-12 ${club.color} rounded-lg flex items-center justify-center text-2xl text-white mr-4`}>
                  {club.image}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    {club.title}
                  </h3>
                  <div className="flex items-center text-sm text-green-600 mt-1">
                    <span className="bg-green-100 px-2 py-1 rounded-full">
                      {club.members} {t('socop.members')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-gray-600 mb-4 leading-relaxed">
              {club.description}
            </p>

            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <span className="font-medium mr-2">{t('socop.meetings')}:</span>
                <span>{club.meetings}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <span className="font-medium mr-2">{t('socop.leader')}:</span>
                <span>{club.leader}</span>
              </div>
            </div>

            {club.achievements && (
              <div className="mb-4">
                <h4 className="font-semibold text-gray-800 text-sm mb-2">
                  {t('socop.achievements')}:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {club.achievements.map((achievement, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs"
                    >
                      {achievement}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <a
              href={club.social_media_link || '#'}
              target={club.social_media_link ? '_blank' : '_self'}
              rel={club.social_media_link ? 'noopener noreferrer' : ''}
              className={`w-full mt-4 px-4 py-2 rounded-lg transition-colors duration-300 font-medium text-center block ${club.social_media_link
                  ? 'bg-green-500 text-white hover:bg-green-600 cursor-pointer'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              onClick={!club.social_media_link ? (e) => e.preventDefault() : undefined}
            >
              {club.social_media_link ? t('socop.actions.joinClub') : t('socop.comingSoon')}
            </a>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProjectsContent = () => (
    <div className="space-y-6">
      <div className="flex items-center mb-6">
        <div className="p-3 bg-blue-100 rounded-xl mr-4">
          <span className="text-2xl">🚀</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-900">
          {t('socop.categories.projects')}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredData.map((project) => (
          <div
            key={project.uniqueId || `project-${project.id}`}
            className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className={`w-12 h-12 ${project.color} rounded-lg flex items-center justify-center text-2xl text-white mr-4`}>
                  {project.image}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    {project.title}
                  </h3>
                  <div className="flex items-center text-sm text-purple-600 mt-1">
                    <span className="bg-purple-100 px-2 py-1 rounded-full">
                      {project.team} {t('socop.team')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-gray-600 mb-4 leading-relaxed">
              {project.description}
            </p>

            {project.progress && (
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>{t('socop.progress.title')}</span>
                  <span>{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {project.needs && (
              <div className="mb-4">
                <h4 className="font-semibold text-gray-800 text-sm mb-2">
                  {t('socop.requirements')}:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {project.needs.map((need, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs"
                    >
                      {need}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <a
              href={project.social_media_link || '#'}
              target={project.social_media_link ? '_blank' : '_self'}
              rel={project.social_media_link ? 'noopener noreferrer' : ''}
              className={`w-full mt-4 px-4 py-2 rounded-lg transition-colors duration-300 font-medium text-center block ${project.social_media_link
                  ? 'bg-purple-500 text-white hover:bg-purple-600 cursor-pointer'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              onClick={!project.social_media_link ? (e) => e.preventDefault() : undefined}
            >
              {project.social_media_link ? t('socop.actions.joinProject') : t('socop.comingSoon')}
            </a>
          </div>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'all':
        return renderAllContent();
      case 'events':
        return renderEventsContent();
      case 'clubs':
        return renderClubsContent();
      case 'projects':
        return renderProjectsContent();
      default:
        return renderAllContent();
    }
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Loading состояние */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">{t('common.loading', 'Загрузка...')}</p>
          </div>
        )}

        {/* Error состояние */}
        {error && (
          <div className="text-center py-12">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              {t('common.retry', 'Попробовать снова')}
            </button>
          </div>
        )}

        {/* Основной контент */}
        {!loading && !error && (
          <>
            {/* Заголовок */}
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                {t('socop.hero.title')}
              </h1>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                {t('socop.hero.description')}
              </p>
            </div>

            {/* Статистика */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              {statistics.map((stat, index) => (
                <div
                  key={index}
                  className={`bg-gradient-to-br ${stat.color} rounded-xl p-6 text-white text-center`}
                >
                  <div className="text-2xl font-bold mb-2">{stat.value}</div>
                  <div className="text-sm opacity-90">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Поиск */}
            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder={t('socop.search.placeholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
              {/* Боковая навигация */}
              <div className="lg:w-1/4">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden sticky top-6">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-4 text-white font-bold text-lg">
                    {t('socop.categories.title')}
                  </div>
                  <nav className="p-2">
                    <ul className="space-y-1">
                      {sections.map((section) => (
                        <li key={section.id}>
                          <button
                            className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 flex items-center ${activeSection === section.id
                                ? "bg-blue-100 text-blue-700 font-medium shadow-sm"
                                : "text-gray-700 hover:bg-gray-100"
                              }`}
                            onClick={() => changeActiveSection(section.id)}
                          >
                            <span className="text-lg mr-3">{section.icon}</span>
                            {section.name}
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
                  {filteredData.length > 0 ? (
                    renderContent()
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-gray-500 text-lg">{t('socop.noResults.title')}</p>
                      <button
                        onClick={() => {
                          setSearchTerm('');
                          setActiveSection('all');
                        }}
                        className="text-blue-600 hover:text-blue-800 mt-2 font-medium"
                      >
                        {t('socop.noResults.clearFilters')}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SocOp;