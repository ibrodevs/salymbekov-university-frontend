import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const LifeOverview = () => {
  const { t } = useTranslation();
  const [activeVideo, setActiveVideo] = useState(null);
  const videoRefs = [useRef(null), useRef(null), useRef(null)];
  
  // API state
  const [lifeData, setLifeData] = useState({
    photo_urls: [],
    video_data: [],
    stats: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageLoadStatus, setImageLoadStatus] = useState({});

    // Fetch life overview data from API
  useEffect(() => {
    const fetchLifeData = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://med-backend-d61c905599c2.herokuapp.com/api/student-life/api/data/life_overview_data/');
        if (!response.ok) {
          throw new Error('Failed to fetch life overview data');
        }
        const data = await response.json();
        setLifeData(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching life overview data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLifeData();
  }, []);

  // Генерируем SVG placeholder
  const generatePlaceholder = (text, width = 400, height = 250, type = 'photo') => {
    const iconSvg = type === 'video' 
      ? `<circle cx="200" cy="125" r="30" fill="white"/><polygon points="190,110 190,140 215,125" fill="#3B82F6"/>`
      : '';
    
    const svgContent = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#3B82F6"/>
      ${iconSvg}
      <text x="50%" y="${type === 'video' ? '80%' : '50%'}" text-anchor="middle" dy=".3em" font-family="Arial" font-size="16" fill="white">${text}</text>
    </svg>`;
    
    // Безопасная кодировка для UTF-8 символов
    try {
      return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgContent)))}`;
    } catch (e) {
      // Fallback без русских символов
      const fallbackText = `Image ${type === 'video' ? 'Video' : 'Photo'}`;
      const fallbackSvg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#3B82F6"/>
        ${iconSvg}
        <text x="50%" y="${type === 'video' ? '80%' : '50%'}" text-anchor="middle" dy=".3em" font-family="Arial" font-size="16" fill="white">${fallbackText}</text>
      </svg>`;
      return `data:image/svg+xml;base64,${btoa(fallbackSvg)}`;
    }
  };

  // Временные локальные изображения для демонстрации
  const fallbackPhotos = [
    'https://med-backend-d61c905599c2.herokuapp.com/media/news/images/IMG_0249.JPG',
    'https://med-backend-d61c905599c2.herokuapp.com/media/news/images/scholarship.jpg',
    // Добавляем placeholder'ы для остальных
    generatePlaceholder('Student Life 1'),
    generatePlaceholder('Student Life 2'),
    generatePlaceholder('Student Life 3'),
    generatePlaceholder('Student Life 4'),
    generatePlaceholder('Student Life 5'),
    generatePlaceholder('Student Life 6')
  ];

  // Use video data from API
  const videoData = lifeData.video_data.map((video, index) => ({
    ...video,
    thumbnail: fallbackPhotos[index] || generatePlaceholder(`Video ${index + 1}`, 400, 250, 'video'),
    url: video.url || "#"
  }));

  // Use stats from API
  const stats = lifeData.stats;

  const handleVideoPlay = (index) => {
    const video = videoData[index];
    // Проверяем, есть ли URL для видео
    if (!video.url || !video.url.trim()) {
      console.warn('No video URL available for video:', video.title);
      return;
    }

    if (activeVideo === index) {
      // Если кликаем на уже активное видео, останавливаем его
      videoRefs[index].current.pause();
      setActiveVideo(null);
    } else {
      // Останавливаем предыдущее видео и запускаем новое
      if (activeVideo !== null) {
        videoRefs[activeVideo].current.pause();
      }
      setActiveVideo(index);
      setTimeout(() => videoRefs[index].current.play(), 100);
    }
  };

  const handleImageError = (e, index, type = 'photo') => {
    setImageLoadStatus(prev => ({ ...prev, [`${type}_${index}`]: 'error' }));
    e.target.src = generatePlaceholder(type === 'photo' ? `Photo ${index + 1}` : `Video ${index + 1}`, 400, 250, type);
  };

  const handleImageLoad = (e, index, type = 'photo') => {
    setImageLoadStatus(prev => ({ ...prev, [`${type}_${index}`]: 'loaded' }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-blue-800 mb-12">
          {t('life.title')}
        </h2>
        
        {/* Loading state */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
          </div>
        )}
        
        {/* Error state */}
        {error && (
          <div className="text-center py-20">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              Error loading data: {error}
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Retry
            </button>
          </div>
        )}
        
        {/* Content */}
        {!loading && !error && (
          <>
            {/* Debug info */}
                        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
              <strong>Debug info:</strong><br/>
              Photos: {lifeData.photo_urls ? lifeData.photo_urls.length : 'none'}<br/>
              Videos: {lifeData.video_data ? lifeData.video_data.length : 'none'}<br/>
              Stats: {lifeData.stats ? lifeData.stats.length : 'none'}<br/>
              Image Load Status: {JSON.stringify(imageLoadStatus, null, 2)}
            </div>
        
        {/* Фото-коллаж */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold text-blue-700 mb-6 text-center">
            {t('life.photoCollage.title')}
          </h3>
          {lifeData.photo_urls && lifeData.photo_urls.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {lifeData.photo_urls.map((url, index) => (
                <div 
                  key={index} 
                  className="relative overflow-hidden rounded-lg shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl"
                >
                  <img 
                    src={fallbackPhotos[index] || generatePlaceholder(`Фото ${index + 1}`)} 
                    alt={t('life.photoCollage.alt', { number: index + 1 })} 
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.src = generatePlaceholder(`Фото ${index + 1}`);
                    }}
                    onLoad={(e) => handleImageLoad(e, index, 'photo')}
                  />
                  <div className="absolute inset-0 bg-blue-900 bg-opacity-0 hover:bg-opacity-20 transition-all duration-300 cursor-pointer"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-100 rounded-lg">
              <div className="text-gray-500 text-lg">
                {t('life.photoCollage.noPhotos', 'Фотографии пока не загружены')}
              </div>
              <div className="text-sm text-gray-400 mt-2">
                Debug: photos array length = {lifeData.photo_urls ? lifeData.photo_urls.length : 'undefined'}
              </div>
            </div>
          )}
        </div>
        
        {/* Видео-репортажи */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold text-blue-700 mb-6 text-center">
            {t('life.videos.title')}
          </h3>
          {lifeData.video_data && lifeData.video_data.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {videoData.map((video, index) => (
                <div 
                  key={video.id} 
                  className="relative bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
                >
                  <div className="relative">
                    <img 
                      src={video.thumbnail} 
                      alt={t(video.titleKey)} 
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.target.src = generatePlaceholder(`Video ${index + 1}`, 400, 250, 'video');
                      }}
                      onLoad={(e) => handleImageLoad(e, index, 'video')}
                    />
                    {video.url && video.url.trim() ? (
                      // Показываем кнопку воспроизведения только если есть URL видео
                      <div 
                        className={`absolute inset-0 flex items-center justify-center bg-blue-900 bg-opacity-50 transition-all duration-300 ${activeVideo === index ? 'opacity-0' : 'opacity-100 cursor-pointer'}`}
                        onClick={() => handleVideoPlay(index)}
                      >
                        <div className="w-16 h-16 bg-blue-700 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    ) : (
                      // Показываем placeholder если нет URL видео
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-70">
                        <div className="text-center text-white">
                          <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mb-2 mx-auto">
                            <svg className="w-8 h-8 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <p className="text-sm">Видео скоро будет доступно</p>
                        </div>
                      </div>
                    )}
                    {video.url && video.url.trim() && (
                      <video
                        ref={videoRefs[index]}
                        className={`w-full h-48 object-cover ${activeVideo === index ? 'block' : 'hidden'}`}
                        controls={activeVideo === index}
                      >
                        <source src={video.url} type="video/mp4" />
                        {t('life.videos.browserSupport')}
                      </video>
                    )}
                  </div>
                  <div className="p-4">
                    <h4 className="text-lg font-medium text-blue-900">
                      {t(video.titleKey)}
                    </h4>
                    <p className="text-blue-600">
                      {t(video.durationKey)} {video.duration && `- ${video.duration}`}
                    </p>
                    {!video.url || !video.url.trim() && (
                      <p className="text-gray-500 text-sm mt-1">
                        Видео в процессе загрузки
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-100 rounded-lg">
              <div className="text-gray-500 text-lg">
                {t('life.videos.noVideos', 'Видео пока не загружены')}
              </div>
              <div className="text-sm text-gray-400 mt-2">
                Debug: videos array length = {lifeData.video_data ? lifeData.video_data.length : 'undefined'}
              </div>
            </div>
          )}
        </div>
        
        {/* Цифры и статистика */}
        {lifeData.stats && lifeData.stats.length > 0 && (
          <div className="bg-blue-800 text-white rounded-2xl p-8 shadow-xl">
            <h3 className="text-2xl font-semibold mb-8 text-center">
              {t('life.stats.title')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center p-6 bg-blue-700 rounded-xl transition-transform duration-300 hover:scale-105">
                  <div className="text-5xl font-bold mb-2">{stat.value}</div>
                  <div className="text-xl">{t(stat.labelKey)}</div>
                </div>
              ))}
            </div>
          </div>
        )}
          </>
        )}
      </div>
    </div>
  );
};

export default LifeOverview;