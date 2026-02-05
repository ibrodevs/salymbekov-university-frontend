import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Bell, Calendar, Download, ExternalLink, Pin } from 'lucide-react';

const API_BASE_URL = 'https://med-backend-d61c905599c2.herokuapp.com/api';

const NewsAnnouncements = () => {
  const { t, i18n } = useTranslation();
  const [filter, setFilter] = useState('all');
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnnouncements();
  }, [i18n.language]);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/announcements/`, {
        headers: {
          'Accept-Language': i18n.language === 'kg' ? 'ky' : i18n.language,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error(t('news.announcements.loadError'));
      }
      const data = await response.json();
      // Маппинг полей API к фронтенду
      const mappedAnnouncements = (data.results || data).map(announcement => ({
        ...announcement,
        // Дата публикации
        date: announcement.published_at,
        // Тип объявления
        type: announcement.announcement_type,
        // Описание из summary
        description: announcement.summary,
        // Приоритет
        priority: announcement.priority,
        // Закреплено
        pinned: announcement.is_pinned,
        // Имя вложения
        attachment: announcement.attachment_name,
        // Приближается дедлайн
        deadlineApproaching: announcement.is_deadline_approaching,
        // Изображение из API (теперь всегда есть благодаря стоковым фото)
        image: announcement.image_url,
      }));
      setAnnouncements(mappedAnnouncements);
    } catch (err) {
      setError(err.message);
      setAnnouncements([]);
    }
    setLoading(false);
  };

  const filteredAnnouncements = filter === 'all' 
    ? announcements 
    : announcements.filter(item => item.type === filter);

  const pinnedAnnouncements = announcements.filter(item => item.pinned);
  const regularAnnouncements = filteredAnnouncements.filter(item => !item.pinned);

  const formatDate = (dateString) => {
    if (!dateString) return t('news.announcements.noDate', 'Дата не указана');
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return t('news.announcements.invalidDate', 'Некорректная дата');
    }
    
    return date.toLocaleDateString(i18n.language === 'kg' ? 'ky-KG' : i18n.language, {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    
    return date.toLocaleTimeString(i18n.language === 'kg' ? 'ky-KG' : i18n.language, {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDeadline = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    
    const dateStr = date.toLocaleDateString(i18n.language === 'kg' ? 'ky-KG' : i18n.language, {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    
    const timeStr = date.toLocaleTimeString(i18n.language === 'kg' ? 'ky-KG' : i18n.language, {
      hour: '2-digit',
      minute: '2-digit'
    });
    
    return `${dateStr}, ${timeStr}`;
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return t('news.announcements.noDate', 'Дата не указана');
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return t('news.announcements.invalidDate', 'Некорректная дата');
    }
    
    const dateStr = formatDate(dateString);
    const timeStr = formatTime(dateString);
    
    return `${dateStr}, ${timeStr}`;
  };

  const getTypeInfo = (type) => {
    const types = {
      academic: { 
        name: t('news.announcements.types.academic'), 
        color: 'bg-blue-100 text-blue-800', 
        icon: '📚' 
      },
      scholarship: { 
        name: t('news.announcements.types.scholarship'), 
        color: 'bg-green-100 text-green-800', 
        icon: '💰' 
      },
      schedule: { 
        name: t('news.announcements.types.schedule'), 
        color: 'bg-purple-100 text-purple-800', 
        icon: '📅' 
      },
      competition: { 
        name: t('news.announcements.types.competition'), 
        color: 'bg-orange-100 text-orange-800', 
        icon: '🏆' 
      },
      health: { 
        name: t('news.announcements.types.health'), 
        color: 'bg-red-100 text-red-800', 
        icon: '🏥' 
      },
      technical: { 
        name: t('news.announcements.types.technical'), 
        color: 'bg-gray-100 text-gray-800', 
        icon: '⚙️' 
      }
    };
    return types[type] || types.academic;
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-300';
    }
  };

  const isDeadlineApproaching = (deadline) => {
    if (!deadline) return false;
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays >= 0;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-yellow-600 to-yellow-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {t('news.announcements.title')}
            </h1>
            <p className="text-xl text-yellow-100 max-w-2xl mx-auto">
              {t('news.announcements.subtitle')}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Error Message */}
        {error && (
          <div className="text-center py-8 mb-8">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">
              {t('news.announcements.loading', '...')}
            </div>
          </div>
        ) : !error && (
          <>
            {/* Pinned Announcements */}
            {pinnedAnnouncements.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <Pin className="w-6 h-6 mr-2 text-red-500" />
              {t('news.announcements.pinned')}
            </h2>
            <div className="space-y-4">
              {pinnedAnnouncements.map((item) => {
                const typeInfo = getTypeInfo(item.type);
                return (
                  <div key={item.id} className={`bg-white rounded-xl shadow-md overflow-hidden border-l-4 ${getPriorityColor(item.priority)}`}>
                    <div className="md:flex">
                      {item.image_url ? (
                        <div className="md:w-1/4">
                          <img 
                            src={item.image_url?.startsWith('http') ? item.image_url : `https://med-backend-d61c905599c2.herokuapp.com${item.image_url}`} 
                            alt={item.title}
                            className="w-full h-48 md:h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="md:w-1/4 bg-gray-200 h-48 md:h-auto flex items-center justify-center">
                          <div className="text-gray-400 text-center">
                            <Bell className="w-8 h-8 mx-auto mb-1" />
                            <p className="text-xs">{t('news.announcements.noImage', 'Изображение не добавлено')}</p>
                          </div>
                        </div>
                      )}
                      <div className={`${item.image_url ? 'md:w-3/4' : 'w-full'} p-6`}>
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-3">
                              <span className="text-2xl">{typeInfo.icon}</span>
                              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${typeInfo.color}`}>
                                {typeInfo.name}
                              </span>
                              {isDeadlineApproaching(item.deadline) && (
                                <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-semibold animate-pulse">
                                  {t('news.announcements.urgent')}
                                </span>
                              )}
                            </div>
                            
                            <h3 className="text-xl font-bold text-gray-800 mb-2">
                              {item.title}
                            </h3>
                            
                            <p className="text-gray-600 mb-4">
                              {item.content}
                            </p>
                            
                            <div className="flex flex-wrap items-center gap-4 text-sm">
                              {item.deadline ? (
                                <div className={`flex items-center ${isDeadlineApproaching(item.deadline) ? 'text-red-600 font-semibold' : 'text-gray-700'}`}>
                                  <Bell className="w-4 h-4 mr-2" />
                                  <span className="font-medium">{t('news.announcements.deadline')}:</span>
                                  <span className="ml-1">{formatDeadline(item.deadline)}</span>
                                </div>
                              ) : (
                                <div className="flex items-center text-gray-500">
                                  <Calendar className="w-4 h-4 mr-2" />
                                  <span>{formatDateTime(item.date)}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex flex-col gap-2">
                            {item.attachment && (
                              <button className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-semibold transition-colors">
                                <Download className="w-4 h-4 mr-1" />
                                {t('news.announcements.download')}
                              </button>
                            )}
                            <Link 
                              to={`/news/detail/${item.id}`}
                              className="flex items-center text-gray-600 hover:text-gray-800 text-sm transition-colors"
                            >
                              <ExternalLink className="w-4 h-4 mr-1" />
                              {t('news.announcements.details')}
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-3 rounded-full font-semibold transition-colors ${
              filter === 'all'
                ? 'bg-yellow-600 text-white'
                : 'bg-white text-gray-600 hover:bg-yellow-50'
            }`}
          >
            {t('news.announcements.filters.all')}
          </button>
          <button
            onClick={() => setFilter('academic')}
            className={`px-6 py-3 rounded-full font-semibold transition-colors ${
              filter === 'academic'
                ? 'bg-yellow-600 text-white'
                : 'bg-white text-gray-600 hover:bg-yellow-50'
            }`}
          >
            {t('news.announcements.filters.academic')}
          </button>
          <button
            onClick={() => setFilter('scholarship')}
            className={`px-6 py-3 rounded-full font-semibold transition-colors ${
              filter === 'scholarship'
                ? 'bg-yellow-600 text-white'
                : 'bg-white text-gray-600 hover:bg-yellow-50'
            }`}
          >
            {t('news.announcements.filters.scholarship')}
          </button>
          <button
            onClick={() => setFilter('competition')}
            className={`px-6 py-3 rounded-full font-semibold transition-colors ${
              filter === 'competition'
                ? 'bg-yellow-600 text-white'
                : 'bg-white text-gray-600 hover:bg-yellow-50'
            }`}
          >
            {t('news.announcements.filters.competition')}
          </button>
        </div>

        {/* Regular Announcements */}
        <div className="space-y-6">
          {regularAnnouncements.map((item) => {
            const typeInfo = getTypeInfo(item.type);
            return (
              <div key={item.id} className={`bg-white rounded-xl shadow-sm overflow-hidden border-l-4 ${getPriorityColor(item.priority)} hover:shadow-md transition-shadow`}>
                <div className="md:flex">
                  {item.image_url ? (
                    <div className="md:w-1/4">
                      <img 
                        src={item.image_url?.startsWith('http') ? item.image_url : `https://med-backend-d61c905599c2.herokuapp.com${item.image_url}`} 
                        alt={item.title}
                        className="w-full h-48 md:h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="md:w-1/4 bg-gray-200 h-48 md:h-auto flex items-center justify-center">
                      <div className="text-gray-400 text-center">
                        <Bell className="w-8 h-8 mx-auto mb-1" />
                        <p className="text-xs">{t('news.announcements.noImage', 'Изображение не добавлено')}</p>
                      </div>
                    </div>
                  )}
                  <div className={`${item.image_url ? 'md:w-3/4' : 'w-full'} p-6`}>
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-lg">{typeInfo.icon}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${typeInfo.color}`}>
                            {typeInfo.name}
                          </span>
                          {isDeadlineApproaching(item.deadline) && (
                            <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-semibold">
                              {t('news.announcements.urgent')}
                            </span>
                          )}
                        </div>
                        
                        <h3 className="text-lg font-bold text-gray-800 mb-2">
                          {item.title}
                        </h3>
                        
                        <p className="text-gray-600 mb-3 text-sm">
                          {item.description}
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm">
                          {item.deadline ? (
                            <div className={`flex items-center ${isDeadlineApproaching(item.deadline) ? 'text-red-600 font-semibold' : 'text-gray-700'}`}>
                              <Bell className="w-4 h-4 mr-2" />
                              <span className="font-medium">{t('news.announcements.deadline')}:</span>
                              <span className="ml-1">{formatDeadline(item.deadline)}</span>
                            </div>
                          ) : (
                            <div className="flex items-center text-gray-500">
                              <Calendar className="w-4 h-4 mr-2" />
                              <span>{formatDateTime(item.date)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        {item.attachment && (
                          <button className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-semibold transition-colors">
                            <Download className="w-4 h-4 mr-1" />
                            {item.attachment}
                          </button>
                        )}
                        <Link 
                          to={`/news/detail/${item.id}`}
                          className="flex items-center text-gray-600 hover:text-gray-800 text-sm transition-colors"
                        >
                          <ExternalLink className="w-4 h-4 mr-1" />
                          {t('news.announcements.details')}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredAnnouncements.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">
              {t('news.announcements.noAnnouncements')}
            </div>
          </div>
        )}

        {/* Newsletter Subscription */}
        <div className="mt-16 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-xl p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">
              {t('news.announcements.newsletter.title')}
            </h2>
            <p className="mb-6">
              {t('news.announcements.newsletter.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder={t('news.announcements.newsletter.placeholder')}
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500"
              />
              <button className="bg-white text-yellow-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                {t('news.announcements.newsletter.button')}
              </button>
            </div>
          </div>
        </div>
          </>
        )}
      </div>
    </div>
  );
};

export default NewsAnnouncements;