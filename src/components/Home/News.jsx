import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { localizeItems } from '../../utils/i18nHelpers';

const API_BASE_URL = 'https://med-backend-d61c905599c2.herokuapp.com/api';

const NewsPreview = ({ maxItems = 3 }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNews();
  }, [i18n.language]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/news/?limit=${maxItems}`, {
        headers: {
          'Accept-Language': i18n.language === 'kg' ? 'ky' : i18n.language,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(t('news.loadingError'));
      }

      const data = await response.json();
      const localizedNews = localizeItems(data.results || data, 'news', i18n.language);
      setNewsData(localizedNews.slice(0, maxItems));
    } catch (err) {
      setError(err.message);

      // Fallback данные
      setNewsData([
        {
          id: 1,
          title: t('news.fallbackNews.0.title'),
          summary: t('news.fallbackNews.0.summary'),
          published_at: "2024-12-01",
          category: { name: "news" },
          image_url: "https://images.unsplash.com/photo-1582719471384-894e35a4b48f?w=400&h=250&fit=crop",
          slug: "fallback-news-1"
        },
        {
          id: 2,
          title: t('news.fallbackNews.1.title'),
          summary: t('news.fallbackNews.1.summary'),
          published_at: "2024-11-28",
          category: { name: "events" },
          image_url: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=400&h=250&fit=crop",
          slug: "fallback-news-2"
        }
      ].slice(0, maxItems));
    } finally {
      setLoading(false);
    }
  };

  // Функция для перехода на страницу новостей с прокруткой вверх
  const handleViewAllNews = () => {
    // Сначала переходим на страницу
    navigate('/news');
    
    // Затем прокручиваем вверх после небольшой задержки, чтобы страница успела загрузиться
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }, 100);
  };

  // Функция для перехода к конкретной новости с прокруткой вверх
  const handleNewsClick = (slug, id) => {
    navigate(`/news/detail/${slug || id}`);
    
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }, 100);
  };

  // Формируем полный URL картинки
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    return `https://med-backend-d61c905599c2.herokuapp.com${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(i18n.language === 'kg' ? 'ky-KG' : i18n.language, {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getCategoryName = (category) => {
    const categoryKey = category?.name || category;
    return t(`news.categories.${categoryKey}`, categoryKey);
  };

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-blue-800 mb-6 relative inline-block">
              {t('news.latestNews')}
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"></div>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(maxItems)].map((_, index) => (
              <div key={index} className="text-center p-8 bg-white rounded-2xl shadow-xl animate-pulse">
                <div className="h-48 bg-gray-300 rounded-xl mb-6"></div>
                <div className="h-4 bg-gray-300 rounded mb-4 w-20 mx-auto"></div>
                <div className="h-6 bg-gray-300 rounded mb-4"></div>
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-2/3 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error && newsData.length === 0) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <p className="text-red-600 mb-4">{t('news.error')}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-blue-800 mb-6 relative inline-block">
            {t('news.latestNews')}
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"></div>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('news.previewSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {newsData.map((item, index) => (
            <div 
              key={item.id} 
              className="group cursor-pointer"
              onClick={() => handleNewsClick(item.slug, item.id)}
            >
              <div className="text-center p-8 bg-white rounded-2xl shadow-xl transform transition-all duration-700 hover:shadow-2xl hover:-translate-y-2 h-full flex flex-col">
                <div className="relative overflow-hidden rounded-xl mb-6 flex-shrink-0">
                  <img 
                    src={getImageUrl(item.image_url || item.image)} 
                    alt={item.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      (item.category?.name || item.category) === 'news' ? 'bg-blue-100 text-blue-800' :
                      (item.category?.name || item.category) === 'events' ? 'bg-green-100 text-green-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {getCategoryName(item.category?.name || item.category)}
                    </span>
                  </div>
                </div>
                
                <div className="flex-1 flex flex-col">
                  <div className="text-sm text-gray-500 mb-3 font-medium">
                    {formatDate(item.published_at || item.date)}
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-800 mb-4 group-hover:text-blue-600 transition-colors line-clamp-2 flex-1">
                    {item.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm line-clamp-3 mb-6">
                    {item.summary}
                  </p>
                  
                  <div className="mt-auto">
                    <div className="inline-flex items-center text-blue-600 font-semibold group-hover:text-blue-700 transition-colors">
                      {t('news.readMore')}
                      <svg className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={handleViewAllNews}
            className="inline-flex items-center bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
          >
            {t('news.viewAllNews')}
            <svg className="ml-3 w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default NewsPreview;