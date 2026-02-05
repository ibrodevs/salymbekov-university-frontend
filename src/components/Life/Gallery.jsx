import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const Gallery = () => {
  const { t } = useTranslation();
  const [activeAlbum, setActiveAlbum] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentPhoto, setCurrentPhoto] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPhotos, setFilteredPhotos] = useState([]);
  
  // API state
  const [galleryData, setGalleryData] = useState({ albums: [], photos: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch gallery data from API
  useEffect(() => {
    const fetchGalleryData = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://med-backend-d61c905599c2.herokuapp.com/api/student-life/api/data/gallery_data/');
        if (!response.ok) {
          throw new Error('Failed to fetch gallery data');
        }
        const data = await response.json();
        setGalleryData(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching gallery data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryData();
  }, []);

  // Получение переведенных данных
  const getTranslatedAlbums = () => {
    return galleryData.albums.map(album => ({
      ...album,
      title: album.titleKey ? t(album.titleKey, { defaultValue: album.title }) : album.title,
      tags: album.tagsKey ? 
        t(album.tagsKey, { returnObjects: true, defaultValue: album.tags || [] }) : 
        (Array.isArray(album.tags) ? album.tags : [])
    }));
  };

  const getTranslatedPhotos = () => {
    return galleryData.photos.map(photo => ({
      ...photo,
      title: photo.titleKey ? t(photo.titleKey, { defaultValue: photo.title }) : photo.title,
      tags: photo.tagsKey ? 
        t(photo.tagsKey, { returnObjects: true, defaultValue: photo.tags || [] }) : 
        (Array.isArray(photo.tags) ? photo.tags : [])
    }));
  };

    // Фильтрация фотографий по поисковому запросу
  useEffect(() => {
    const translatedPhotos = getTranslatedPhotos();
    
    if (!searchQuery) {
      setFilteredPhotos(activeAlbum ? 
        translatedPhotos.filter(photo => photo.albumId === activeAlbum.id) : 
        []);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = translatedPhotos.filter(photo => 
        (!activeAlbum || photo.albumId === activeAlbum.id) && 
        (photo.title.toLowerCase().includes(query) || 
         (photo.tags || []).some(tag => tag.toLowerCase().includes(query)))
      );
      setFilteredPhotos(filtered);
    }
  }, [searchQuery, activeAlbum, galleryData, t]);

  // Открытие альбома
  const openAlbum = (album) => {
    // Используем уже переведенные данные
    setActiveAlbum(album);
    const translatedPhotos = getTranslatedPhotos();
    setFilteredPhotos(translatedPhotos.filter(photo => photo.albumId === album.id));
  };

  // Закрытие альбома
  const closeAlbum = () => {
    setActiveAlbum(null);
    setFilteredPhotos([]);
    setSearchQuery('');
  };

  // Открытие lightbox
  const openLightbox = (photo) => {
    setCurrentPhoto(photo);
    setLightboxOpen(true);
  };

  // Закрытие lightbox
  const closeLightbox = () => {
    setLightboxOpen(false);
    setTimeout(() => setCurrentPhoto(null), 300);
  };

  // Навигация по фотографиям в lightbox
  const navigatePhotos = (direction) => {
    if (!currentPhoto) return;
    
    const currentIndex = filteredPhotos.findIndex(photo => photo.id === currentPhoto.id);
    let newIndex;
    
    if (direction === 'prev') {
      newIndex = currentIndex === 0 ? filteredPhotos.length - 1 : currentIndex - 1;
    } else {
      newIndex = currentIndex === filteredPhotos.length - 1 ? 0 : currentIndex + 1;
    }
    
    setCurrentPhoto(filteredPhotos[newIndex]);
  };

  // Скачивание фотографии
  const downloadPhoto = (photoUrl, photoTitle) => {
    fetch(photoUrl)
      .then(response => response.blob())
      .then(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${photoTitle.replace(/\s+/g, '_')}.jpg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      })
      .catch(error => console.error(t('gallery.downloadError'), error));
  };

  // Обработка нажатия клавиш в lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxOpen) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') navigatePhotos('prev');
        if (e.key === 'ArrowRight') navigatePhotos('next');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, currentPhoto]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-blue-800 mb-2">
          {t('gallery.title')}
        </h1>
        <p className="text-center text-blue-600 mb-8">
          {t('gallery.subtitle')}
        </p>
        
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
              {t('gallery.error')}: {error}
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              {t('gallery.retry')}
            </button>
          </div>
        )}
        
        {/* Content */}
        {!loading && !error && (
          <>
            {!activeAlbum ? (
          // Отображение альбомов
          <>
            {galleryData.albums && galleryData.albums.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getTranslatedAlbums().map(album => (
                  <div 
                    key={album.id} 
                    className="bg-white rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-xl cursor-pointer"
                    onClick={() => openAlbum(album)}
                  >
                    <div className="relative">
                      <img 
                        src={album.cover || `https://picsum.photos/400/300?random=${album.id}`} 
                        alt={album.title} 
                        className="w-full h-56 object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-900 to-transparent p-4">
                        <h3 className="text-white font-bold text-xl">{album.title}</h3>
                        <p className="text-blue-200">
                          {t('gallery.photoCount', { count: album.photoCount })}
                        </p>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex flex-wrap gap-2">
                        {(album.tags || []).map(tag => (
                          <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="text-gray-500 text-lg">
                  {t('gallery.noAlbums', 'Альбомы пока не созданы')}
                </div>
              </div>
            )}
          </>
        ) : (
          // Отображение фотографий в альбоме
          <>
            <div className="flex items-center justify-between mb-6">
              <button 
                onClick={closeAlbum}
                className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                {t('gallery.backToAlbums')}
              </button>
              <h2 className="text-2xl font-bold text-blue-800">{activeAlbum.title}</h2>
              <div className="w-24"></div> {/* Для выравнивания */}
            </div>
            
            {/* Поиск и фильтрация */}
            <div className="mb-6">
              <div className="relative max-w-md mx-auto">
                <input
                  type="text"
                  placeholder={t('gallery.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pr-10 rounded-lg border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <svg className="w-5 h-5 absolute right-3 top-2.5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            
            {/* Фотографии */}
            {filteredPhotos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {filteredPhotos.map(photo => (
                  <div 
                    key={photo.id} 
                    className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 cursor-pointer"
                    onClick={() => openLightbox(photo)}
                  >
                    <img 
                      src={photo.url || `https://picsum.photos/400/300?random=${photo.id}`} 
                      alt={photo.title} 
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-3">
                      <h3 className="font-medium text-blue-900">{photo.title}</h3>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {(photo.tags || []).map(tag => (
                          <span key={tag} className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-100 rounded-lg">
                <div className="text-gray-500 text-lg">
                  {searchQuery 
                    ? t('gallery.noSearchResults', 'По вашему запросу ничего не найдено')
                    : t('gallery.noPhotos', 'В этом альбоме пока нет фотографий')
                  }
                </div>
              </div>
            )}
          </>
        )}
        
        {/* Lightbox */}
        {lightboxOpen && currentPhoto && (
          <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
            <button 
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-white hover:text-blue-300"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <button 
              onClick={() => navigatePhotos('prev')}
              className="absolute left-4 text-white hover:text-blue-300"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button 
              onClick={() => navigatePhotos('next')}
              className="absolute right-4 text-white hover:text-blue-300"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            
            <div className="max-w-4xl max-h-full">
              <img 
                src={currentPhoto.url || `https://picsum.photos/800/600?random=${currentPhoto.id}`} 
                alt={currentPhoto.title} 
                className="max-w-full max-h-screen object-contain"
              />
              <div className="mt-4 text-white text-center">
                <h3 className="text-xl font-bold">{currentPhoto.title}</h3>
                <div className="flex flex-wrap justify-center gap-2 mt-2">
                  {(currentPhoto.tags || []).map(tag => (
                    <span key={tag} className="px-2 py-1 bg-blue-700 rounded-full text-sm">
                      #{tag}
                    </span>
                  ))}
                </div>
                <button 
                  onClick={() => downloadPhoto(currentPhoto.url, currentPhoto.title)}
                  className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center mx-auto"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  {t('gallery.download')}
                </button>
              </div>
            </div>
          </div>
        )}
          </>
        )}
      </div>
    </div>
  );
};

export default Gallery;