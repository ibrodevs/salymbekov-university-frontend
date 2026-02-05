import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import SideMenu from './common/SideMenu';

const FAQ = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();

  const faqItems = [
    { title: t('nav.contacts'), link: '/contacts' },
    { title: t('nav.vacancies'), link: '/about/vacancies' },
    { title: t('faq.title', 'FAQ'), link: '/admissions/faq' },
  ];
  const [openItems, setOpenItems] = useState({});
  const [faqData, setFaqData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fallback данные на случай проблем с backend или i18n
  const fallbackFaqData = [
    {
      question_en: "How do I apply to the university?",
      answer_en: "To apply, use the online application form available in the Admissions section. Fill out all required fields and upload your documents.",
      question_ru: "Как подать заявку в университет?",
      answer_ru: "Для подачи заявки используйте онлайн-форму в разделе Приемная комиссия. Заполните все обязательные поля и загрузите документы.",
      question_kg: "Университетке кантип тапшырам?",
      answer_kg: "Кабыл алуу бөлүмүндөгү онлайн форманы толтуруңуз. Бардык талааларды толтуруп, документтерди жүктөңүз."
    },
    {
      question_en: "Where can I find information about tuition fees?",
      answer_en: "Tuition fees for citizens and foreign students are listed in the Admissions > Tuition section.",
      question_ru: "Где найти информацию о стоимости обучения?",
      answer_ru: "Стоимость обучения для граждан и иностранных студентов указана в разделе Приемная комиссия > Оплата.",
      question_kg: "Окуу акысы тууралуу маалыматты кайдан тапсам болот?",
      answer_kg: "Окуу акысы тууралуу маалымат кабыл алуу > Окуу акысы бөлүмүндө көрсөтүлгөн."
    },
    {
      question_en: "How can I contact the admissions office?",
      answer_en: "You can find contact details in the Contacts section or use the email and phone numbers provided there.",
      question_ru: "Как связаться с приемной комиссией?",
      answer_ru: "Контактные данные указаны в разделе Контакты или используйте указанные там email и телефоны.",
      question_kg: "Кабыл алуу бөлүмү менен кантип байланышсам болот?",
      answer_kg: "Контакт маалыматтары Контакты бөлүмүндө же көрсөтүлгөн телефон/электрондук почта аркылуу жеткиликтүү."
    }
  ];


  // Получение данных с backend
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);
    // Добавляем язык в query-параметр для принудительного обновления (и поддержки language-aware backend)
    const lang = (i18n.language || 'en').split('-')[0];
    fetch(`https://med-backend-d61c905599c2.herokuapp.com/api/admissions/faqs/?lang=${lang}`)
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(data => {
        if (isMounted) {
          let arr = [];
          if (data && typeof data === 'object' && Array.isArray(data.results)) {
            arr = data.results;
          } else if (Array.isArray(data)) {
            arr = data;
          } else if (data && typeof data === 'object') {
            arr = [data];
          }
          if (arr.length > 0) {
            setFaqData(arr);
          } else {
            // fallback to i18n
            const items = t('faq.items', { returnObjects: true, defaultValue: fallbackFaqData });
            setFaqData(Array.isArray(items) ? items : fallbackFaqData);
          }
        }
      })
      .catch(err => {
        if (isMounted) {
          // fallback to i18n
          const items = t('faq.items', { returnObjects: true, defaultValue: fallbackFaqData });
          setFaqData(Array.isArray(items) ? items : fallbackFaqData);
          setError(err.message);
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => { isMounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language]);

  // Получить поле с учетом языка
  const getLangField = (item, base) => {
    // Извлекаем базовый язык (ru, en, kg) из i18n.language (например, ru-RU, en-US)
    let lang = (i18n.language || 'en').split('-')[0];
    // Поддержка ru, kg, en, а также fallback на question/answer без суффикса
    return (
      item[`${base}_${lang}`] ||
      item[`${base}_en`] ||
      item[`${base}_ru`] ||
      item[`${base}_kg`] ||
      item[base] ||
      ''
    );
  };

  const toggleItem = (index) => {
    setOpenItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <section className="faq-section py-16 bg-gradient-to-br from-blue-50 to-white relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Заголовок */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-blue-900 mb-4">
            {t('faq.title', 'Frequently Asked Questions')}
          </h2>
          <div className="w-20 h-1 bg-blue-500 mx-auto rounded-full"></div>
        </div>

        {/* Аккордеон FAQ */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center text-blue-700">{t('loading', 'Loading...')}</div>
          ) : error ? (
            <div className="text-center text-red-500">{t('error', 'Failed to load FAQ.')}</div>
          ) : faqData && faqData.length > 0 ? (
            faqData.map((item, index) => (
              <div
                key={item.id || index}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100 overflow-hidden"
              >
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                >
                  <h3 className="font-semibold text-lg text-blue-900 pr-4">
                    {getLangField(item, 'question')}
                  </h3>
                  <svg
                    className={`w-6 h-6 text-blue-500 transition-transform duration-300 ${
                      openItems[index] ? 'transform rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <div
                  className={`transition-all duration-300 overflow-hidden ${
                    openItems[index] ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-6 pb-5 pt-2">
                    <div className="w-12 h-1 bg-blue-200 rounded-full mb-4"></div>
                    <p className="text-blue-800 leading-relaxed">
                      {getLangField(item, 'answer')}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-blue-700">{t('faq.empty', 'No FAQ data available.')}</div>
          )}
        </div>
      </div>

      {/* Декоративные элементы */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-blue-200 rounded-full -translate-x-16 -translate-y-16 opacity-20"></div>
      <div className="absolute bottom-0 right-0 w-48 h-48 bg-blue-300 rounded-full translate-x-24 translate-y-24 opacity-10"></div>

      {/* Боковое меню для навигации по разделу */}
      <SideMenu items={faqItems} currentPath={location.pathname} />
    </section>
  );
};

export default FAQ;