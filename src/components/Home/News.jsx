import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { localizeItems } from '../../utils/i18nHelpers';

const API_BASE_URL = import.meta.env.DEV 
  ? '/proxy-backend/api' 
  : (import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_BASE_URL || '/proxy-backend');

const NewsPreview = ({ maxItems = 3 }) => {
  const { t, i18n } = useTranslation();
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imgErrors, setImgErrors] = useState({});

  useEffect(() => {
    fetchNews();
  }, [i18n.language]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/news?limit=${maxItems}`, {
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

  // Формируем полный URL картинки
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/placeholder-news.jpg';
    
    if (imagePath.startsWith('http')) {
      return `https://images.weserv.nl/?url=${encodeURIComponent(imagePath)}&w=600`;
    }
    
    return `/media${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return ''; // avoid rendering "Invalid Date"
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
      <div className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">{t('news.latestNews')}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[...Array(maxItems)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-300"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-6 bg-gray-300 rounded mb-3"></div>
                  <div className="h-4 bg-gray-300 rounded mb-1"></div>
                  <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error && newsData.length === 0) {
    return (
      <div className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <p className="text-red-600 mb-4">{t('news.error')}</p>
        </div>
      </div>
    );
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            {t('news.latestNews')}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('news.previewSubtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {newsData.map((item) => (
            <Link 
              key={item.id} 
              to={`/news/detail/${item.slug || item.id}`}
              state={{ article: item }}
              className="group block"
            >
              <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full">
                <div className="aspect-w-16 aspect-h-9">
                  {(() => {
                    const rawUrl = item.image_url || item.image;
                    const showFallback = !rawUrl || imgErrors[item.id];
                    if (showFallback) {
                      return (
                        <div className="w-full h-48 flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700">
                          <span className="text-white/90 text-lg font-bold tracking-wide">SALYMBEKOV</span>
                        </div>
                      );
                    }
                    return (
                      <img
                        src={getImageUrl(rawUrl)}
                        alt={item.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={() => setImgErrors((prev) => ({ ...prev, [item.id]: true }))}
                      />
                    );
                  })()}
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-500">
                      {formatDate(item.published_at || item.date)}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      (item.category?.name || item.category) === 'news' ? 'bg-blue-100 text-blue-800' :
                      (item.category?.name || item.category) === 'events' ? 'bg-green-100 text-green-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {getCategoryName(item.category?.name || item.category)}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-3">
                    {item.summary}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Link 
            to="/news"
            className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            {t('news.viewAllNews')}
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NewsPreview;
