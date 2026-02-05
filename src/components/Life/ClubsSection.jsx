
import { useState, useEffect } from 'react';
import { Camera } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import SideMenu from '../common/SideMenu';

const StudentLife = () => {

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
  }, [i18n.language]);

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
  const [galleryImages, setGalleryImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch('https://med-backend-d61c905599c2.herokuapp.com/api/student-life/photos/', {
      headers: {
        'Accept-Language': i18n.language === 'kg' ? 'ky' : i18n.language,
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setGalleryImages(Array.isArray(data) ? data : (data.results || []));
        setLoading(false);
      })
      .catch((err) => {
        setError('Ошибка загрузки фотогалереи');
        setLoading(false);
      });
  }, [i18n.language]);

  // Функция для мультиязычного поля
  function getLangField(obj, base) {
    let lang = i18n.language.toLowerCase();
    if (lang === 'kg') lang = 'ky';
    if (lang.startsWith('ru') && obj[base + '_ru']) return obj[base + '_ru'];
    if (lang.startsWith('en') && obj[base + '_en']) return obj[base + '_en'];
    if ((lang.startsWith('ky') || lang.startsWith('kgz')) && obj[base + '_kg']) return obj[base + '_kg'];
    return obj[base + '_ru'] || obj[base + '_en'] || obj[base + '_kg'] || '';
  }


  const openLightbox = (image, index) => {
    setSelectedImage(image);
    setCurrentIndex(index);
  };


  const closeLightbox = () => {
    setSelectedImage(null);
  };


  const goToPrevious = () => {
    const newIndex = currentIndex === 0 ? galleryImages.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
    setSelectedImage(galleryImages[newIndex]);
  };


  const goToNext = () => {
    const newIndex = currentIndex === galleryImages.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
    setSelectedImage(galleryImages[newIndex]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 pt-24">
      {/* Hero Section */}
      <motion.section
        className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-blue-800 to-cyan-900 text-white py-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.h1 
              className="text-4xl md:text-5xl font-bold mb-8 leading-tight"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              {t('studentLife.title', 'Студенческая жизнь')}
            </motion.h1>
            <motion.div 
              className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-400 mx-auto rounded-full mb-8"
              initial={{ width: 0 }}
              animate={{ width: 96 }}
              transition={{ delay: 0.5, duration: 1 }}
            ></motion.div>
          </motion.div>
        </div>
      </motion.section>

      <div className="container mx-auto px-4 py-16">
        {/* Текстовая секция */}
        <motion.section
          className="max-w-4xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
            <motion.div
              className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <p className="text-xl md:text-2xl leading-relaxed mb-8 text-gray-800 font-light">
                {t('studentLife.intro', 'Студенческая жизнь – это необыкновенное время, время открытий, накопления знаний, яркая и запоминающаяся пора.')}
              </p>
              
              <p className="text-lg md:text-xl leading-relaxed text-gray-700">
                {t('studentLife.description', 'Это не только период лекций, семинаров и экзаменов, но так же и возможность проявить себя и в полной мере раскрыть свои способности.')}
              </p>
            </motion.div>
          </div>
        </motion.section>

        {/* Фотогалерея */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-12">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
            >
              {t('studentLife.galleryTitle', 'Фотогалерея')}
            </motion.h2>
            <motion.div 
              className="w-24 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto rounded-full"
              initial={{ width: 0 }}
              whileInView={{ width: 96 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 1 }}
            ></motion.div>
          </div>

          {/* Сетка фотографий */}
          {loading ? (
            <div className="text-center text-gray-400">Loading...</div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {galleryImages.map((image, index) => (
                <motion.div
                  key={image.id}
                  className="group relative overflow-hidden rounded-2xl shadow-lg cursor-pointer"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => openLightbox(image, index)}
                >
                  {/* Фото из backend */}
                  <div className="aspect-square bg-gradient-to-br from-blue-200 to-cyan-200 relative overflow-hidden">
                    {image.photo ? (
                      <img src={image.photo} alt={getLangField(image, 'description') || ''} className="object-cover w-full h-full" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <Camera className="w-6 h-6" />
                        </div>
                      </div>
                    )}
                    {/* Наложение при наведении */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                      <div className="text-white opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                        <div className="text-lg font-semibold mb-1">{getLangField(image, 'description')}</div>
                        <div className="text-sm">{t('studentLife.clickToView', 'Нажмите для просмотра')}</div>
                      </div>
                    </div>
                  </div>
                  {/* Бейдж категории */}
                  <div className="absolute top-3 left-3 bg-white bg-opacity-90 px-3 py-1 rounded-full text-sm font-medium text-blue-800">
                    {getLangField(image, 'category')}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative w-full h-full flex items-center justify-center"
              style={{ maxWidth: '100vw', maxHeight: '100vh' }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >

              {/* Кнопка "Назад" */}
              <button
                onClick={closeLightbox}
                className="absolute left-4 top-4 bg-white bg-opacity-80 hover:bg-opacity-100 text-blue-900 px-5 py-2 rounded-full font-semibold shadow z-20 transition-all"
              >
                {t('studentLife.back', 'Назад')}
              </button>
              {/* Кнопка закрытия */}
              <button
                onClick={closeLightbox}
                className="absolute -top-12 right-0 text-white hover:text-cyan-400 transition-colors z-10"
              >
                <XMarkIcon className="w-8 h-8" />
              </button>


              {/* Изображение */}
              <div className="w-full h-full flex items-center justify-center">
                {selectedImage.photo ? (
                  <img
                    src={selectedImage.photo}
                    alt={getLangField(selectedImage, 'description') || ''}
                    style={{
                      maxWidth: '90vw',
                      maxHeight: '85vh',
                      objectFit: 'contain',
                      borderRadius: '1.5rem',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.25)'
                    }}
                  />
                ) : (
                  <div className="text-center">
                    <Camera className="w-6 h-6" />
                  </div>
                )}
                {/* Подпись и категория */}
                <div className="absolute left-0 right-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent text-center">
                  <div className="text-2xl font-semibold text-white mb-2">
                    {getLangField(selectedImage, 'description')}
                  </div>
                  <div className="text-blue-200">{getLangField(selectedImage, 'category')}</div>
                </div>
              </div>

              {/* Навигация */}
              <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-all"
              >
                <ChevronLeftIcon className="w-6 h-6" />
              </button>

              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-all"
              >
                <ChevronRightIcon className="w-6 h-6" />
              </button>

              {/* Индикатор */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded-full">
                {currentIndex + 1} / {galleryImages.length}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Боковое меню для навигации по разделу */}
      <SideMenu items={studentItems} currentPath={window.location.pathname} />
    </div>
  );
};

export default StudentLife;