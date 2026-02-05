import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import './Facts.css';

// Компонент для одного счетчика
const CounterItem = ({ number, iconUrl, description, duration = 2000, delay = 0 }) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  // Извлекаем число из строки (например, "200+" -> 200)
  const getNumber = (numStr) => {
    const match = numStr.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  };

  useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setIsVisible(true);
          setTimeout(() => {
            setHasAnimated(true);
            let startTime = null;
            const end = getNumber(number);
            const step = (timestamp) => {
              if (!startTime) startTime = timestamp;
              const progress = Math.min((timestamp - startTime) / duration, 1);
              const easeOutQuart = 1 - Math.pow(1 - progress, 4);
              setCount(Math.floor(easeOutQuart * end));
              if (progress < 1) {
                window.requestAnimationFrame(step);
              }
            };
            window.requestAnimationFrame(step);
          }, delay);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [number, duration, hasAnimated, delay]);

  return (
    <div
      ref={ref}
      className={`text-center p-8 bg-white rounded-2xl shadow-xl transform transition-all duration-700 ${
        isVisible
          ? 'opacity-100 translate-y-0 scale-100 hover:shadow-2xl hover:-translate-y-2'
          : 'opacity-0 translate-y-10 scale-95'
      }`}
    >
      <div className="relative inline-block mb-4">
        <img src={iconUrl} alt="icon" className="w-16 h-16 mb-2 mx-auto" />
        {hasAnimated && (
          <div className="absolute -top-2 -right-4">
            <div className="relative">
              <div className="animate-ping absolute inline-flex h-5 w-5 rounded-full bg-blue-400 opacity-75"></div>
              <div className="relative inline-flex rounded-full h-5 w-5 bg-blue-600"></div>
            </div>
          </div>
        )}
      </div>
      <div className="text-5xl font-bold text-blue-600 mb-2 transition-all duration-300">
        {hasAnimated ? `${count.toLocaleString()}+` : number}
      </div>
      <div className="text-lg text-gray-700 font-medium bg-blue-50 py-2 px-4 rounded-full inline-block">
        {description}
      </div>
      {hasAnimated && (
        <div className="mt-4 h-1 w-20 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full mx-auto"></div>
      )}
    </div>
  );
};

const AnimatedFactsSection = () => {
  const { t, i18n } = useTranslation();
  const [facts, setFacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch('https://med-backend-d61c905599c2.herokuapp.com/api/home/numbers/', {
      headers: {
        'Accept-Language': i18n.language === 'kg' ? 'ky' : i18n.language,
        'Content-Type': 'application/json'
      }
    })
      .then((res) => res.json())
      .then((data) => {
        setFacts(data.results || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [i18n.language]);


  // Функция для выбора нужного поля description по языку
  function getDescription(fact) {
    // Унифицируем код языка для кыргызского
    let lang = i18n.language.toLowerCase();
    if (lang === 'kg') lang = 'ky';
    if (lang.startsWith('ru') && fact.description_ru) return fact.description_ru;
    if (lang.startsWith('en') && fact.description_en) return fact.description_en;
    // description_kgz для кыргызского
    if ((lang.startsWith('ky') || lang.startsWith('kgz')) && fact.description_kgz) return fact.description_kgz;
    return fact.description || '';
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-blue-800 mb-6 relative inline-block">
            {t('facts.title')}
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"></div>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('facts.subtitle')}
          </p>
        </div>

        {/* counters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Debug info: показать язык и поля description для проверки */}
          <div style={{display:'none'}}>
            <pre>LANG: {i18n.language}</pre>
            <pre>{JSON.stringify(facts, null, 2)}</pre>
          </div>
          {loading ? (
            <div className="col-span-4 text-center text-gray-400">Loading...</div>
          ) : (
            facts.map((fact, index) => (
              <CounterItem
                key={fact.id || index}
                number={fact.number}
                iconUrl={fact.icon}
                description={getDescription(fact)}
                delay={index * 200}
              />
            ))
          )}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center justify-center space-x-2 animate-bounce">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animation-delay-200"></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animation-delay-400"></div>
          </div>
          <p className="text-gray-500 mt-2">{t('facts.scrollHint')}</p>
        </div>
      </div>
    </section>
  );
};

export default AnimatedFactsSection;