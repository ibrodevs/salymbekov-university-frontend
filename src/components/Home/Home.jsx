import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const API_BASE_URL = 'https://med-backend-d61c905599c2.herokuapp.com/api/';

const HeroSlider = () => {
  const { i18n } = useTranslation();
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageErrors, setImageErrors] = useState({});

  // Fetch banners
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`${API_BASE_URL}banners/`, {
          headers: {
            'Accept-Language': i18n.language === 'kg' ? 'ky' : i18n.language,
          },
        });

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

        const data = await res.json();
        const banners = data.results || data;

        if (!banners.length) throw new Error('No banners received');

        // processed banners with S3 URLs
        const processed = banners.map((b) => ({
          id: b.id,
          photo: b.photo, // ожидаем, что сериализатор возвращает полный URL
        }));

        setSlides(processed);
      } catch (err) {
        console.error('Error fetching banners:', err);
        setError(err.message);

        // fallback
        setSlides([
          { id: 1, photo: 'https://img2.rtve.es/i/?w=1600&i=01712310257437.jpg' },
          { id: 2, photo: 'https://www.fundacionhergar.org/sites/fundacionhergar.org/files/GettyImages-1961399015.jpg' },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, [i18n.language]);

  // Автопрокрутка
  useEffect(() => {
    if (slides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [slides]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  const goToSlide = (index) => setCurrentSlide(index);

  const handleImageError = (index) => {
    setImageErrors((prev) => ({ ...prev, [index]: true }));
  };

  if (loading) {
    return (
      <div className="relative w-full h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div
        className="flex transition-transform duration-700 ease-in-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide, index) => {
          const hasError = imageErrors[index];
          return (
            <div key={slide.id} className="w-full h-full flex-shrink-0 relative">
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: hasError
                    ? 'linear-gradient(to right, #4F46E5, #7C3AED)'
                    : `url("${slide.photo}")`,
                }}
              >
                {!hasError && <div className="absolute inset-0 bg-black bg-opacity-30 z-10"></div>}

                {hasError && (
                  <div className="absolute inset-0 flex items-center justify-center text-white bg-gray-800 bg-opacity-75">
                    <div className="text-center p-4">
                      <p className="text-lg mb-2">Изображение не загрузилось</p>
                      <p className="text-sm break-all">{slide.photo}</p>
                      <button
                        onClick={() => window.open(slide.photo, '_blank')}
                        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Открыть в новой вкладке
                      </button>
                    </div>
                  </div>
                )}

                <img
                  src={slide.photo}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover z-50"
                  onError={() => handleImageError(index)}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 text-blue-900 p-3 sm:p-4 rounded-full shadow-lg transition-all duration-300 z-20 hover:scale-110"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 text-blue-900 p-3 sm:p-4 rounded-full shadow-lg transition-all duration-300 z-20 hover:scale-110"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        </>
      )}

      {/* Indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 sm:space-x-3 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-8 sm:w-12 h-2 rounded-full bg-white bg-opacity-40 transition-all duration-300 hover:bg-opacity-60 ${
                currentSlide === index ? 'bg-opacity-100' : ''
              }`}
            ></button>
          ))}
        </div>
      )}
    </div>
  );
};

export default HeroSlider;
