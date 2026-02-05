// import icons removed
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import SideMenu from '../common/SideMenu';

const AcadOp = () => {
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
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    setLoading(true);
    fetch("https://med-backend-d61c905599c2.herokuapp.com/api/student-life/exchange-programs/")
      .then((res) => {
        if (!res.ok) throw new Error("Ошибка загрузки данных");
        return res.json();
      })
      .then((json) => {
        setData(json.results || []);
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // Определяем язык
  const lang = i18n.language;

  // Маппинг данных под текущий язык
  const opportunitiesData = data.map((item) => ({
    id: item.id,
    title:
      lang === "kg"
        ? item.title_kg
        : lang === "en"
        ? item.title_en
        : item.title_ru,
    description:
      lang === "kg"
        ? item.description_kg
        : lang === "en"
        ? item.description_en
        : item.description_ru,
    features:
      lang === "kg"
        ? item.features_kg
        : lang === "en"
        ? item.features_en
        : item.features_ru,
    color: "from-blue-500 to-cyan-500", // Можно добавить цвет из backend при необходимости
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Заголовок */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t("acadop.hero.title", "Академическая мобильность")}{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {t("acadop.hero.highlight", "для студентов")}
            </span>
          </h1>
        </div>

        <div className="flex flex-col gap-6">
          <div className="w-full">
            <div className="bg-white rounded-xl shadow-xl p-6 transition-all duration-500">
              <div className="space-y-6">
                {loading ? (
                  <div className="text-center py-8 text-lg text-gray-500">Загрузка...</div>
                ) : error ? (
                  <div className="text-center py-8 text-lg text-red-500">{error}</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {opportunitiesData.map((opportunity, index) => (
                      <div
                        key={opportunity.id}
                        className="bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-md overflow-hidden border border-blue-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className={`bg-gradient-to-r ${opportunity.color} p-6 text-white relative overflow-hidden`}>
                          <div className="flex items-center mb-4">
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h3 className="text-2xl font-bold">{opportunity.title}</h3>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="p-6">
                          <p className="text-gray-700 mb-4 leading-relaxed text-sm">{opportunity.description}</p>
                          <div className="mb-6">
                            <h4 className="text-sm font-semibold text-gray-800 mb-3">
                              {t("acadop.featuresTitle", "Особенности")}
                            </h4>
                            <div className="space-y-2">
                              {opportunity.features?.map((feature, idx) => (
                                <div key={idx} className="flex items-center text-gray-600 text-sm">
                                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3"></div>
                                  {feature}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Боковое меню для навигации по разделу */}
      <SideMenu items={studentItems} currentPath={window.location.pathname} />
    </div>
  );
};

export default AcadOp;