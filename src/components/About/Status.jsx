import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Landmark, Globe, MapPin, Zap } from 'lucide-react';
import hsmService from "../../services/hsmService";

const Status = () => {
  const { t, i18n } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [accreditationData, setAccreditationData] = useState([]);

  // Функция для загрузки данных из API
  const fetchAccreditations = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await hsmService.getAccreditations(i18n.language);
      setAccreditationData(data);
    } catch (err) {
      console.error("Error fetching accreditations:", err);
      setError(t("hsm.loading_error"));
    } finally {
      setLoading(false);
    }
  };

  // Загружаем данные при монтировании компонента
  useEffect(() => {
    fetchAccreditations();
  }, []);

  // Фильтрация данных
  const filteredData = activeFilter === "all"
    ? accreditationData
    : accreditationData.filter((item) => item.accreditation_type === activeFilter);

  // Список фильтров согласно ACCREDITATION_TYPES модели
  const filtersList = [
    { id: "all", name: t("hsm.all") },
    { id: "national", name: t("hsm.national") },
    { id: "international", name: t("hsm.international") },
    { id: "institutional", name: t("hsm.institutional") },
    { id: "programmatic", name: t("hsm.programmatic") },
  ];

  // Функция для получения стилей в зависимости от типа аккредитации
  const getAccreditationStyles = (type) => {
    const styles = {
      national: {
        color: "from-blue-500 to-blue-600",
        badgeColor: "bg-blue-500",
        iconColor: "text-blue-600",
        logo: Landmark
      },
      international: {
        color: "from-teal-600 to-teal-700",
        badgeColor: "bg-green-500",
        iconColor: "text-green-600",
        logo: Globe
      },
      institutional: {
        color: "from-indigo-600 to-indigo-700",
        badgeColor: "bg-purple-500",
        iconColor: "text-purple-600",
        logo: MapPin
      },
      programmatic: {
        color: "from-blue-600 to-blue-700",
        badgeColor: "bg-blue-600",
        iconColor: "text-orange-600",
        logo: Zap
      }
    };
    return styles[type] || styles.national; // Fallback to national
  };

  // Функция для получения отображаемых данных аккредитации
  const getDisplayData = (item, language) => {
    return {
      name: language === 'kg' ? (item.name_kg || item.name) :
        language === 'en' ? (item.name_en || item.name) : item.name,
      organization: language === 'kg' ? (item.organization_kg || item.organization) :
        language === 'en' ? (item.organization_en || item.organization) : item.organization,
      description: language === 'kg' ? (item.description_kg || item.description) :
        language === 'en' ? (item.description_en || item.description) : item.description,
      typeDisplay: language === 'kg' ? (item.accreditation_type_kg || item.accreditation_type_display) :
        language === 'en' ? (item.accreditation_type_en || item.accreditation_type_display) :
          item.accreditation_type_display
    };
  };

  // Функция изменения фильтра
  const changeFilter = (filterId) => {
    setActiveFilter(filterId);
  };

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className={`min-h-screen bg-slate-50 py-8 px-4 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`min-h-screen bg-slate-50 py-8 px-4 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <div className="text-red-600 mb-4">
                <svg
                  className="w-16 h-16 mx-auto"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {t("hsm.loading_error")}
              </h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {t("hsm.refresh_page")}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-slate-50 py-8 px-4 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}>
      <div className="max-w-7xl mx-auto">
        {/* Заголовок */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
            {t("hsm.accreditations_title")}
          </h1>
          <p className="text-lg text-slate-500 max-w-3xl mx-auto">
            {t("hsm.accreditations_description")}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Боковая навигация - фильтры */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden sticky top-24">
              <div className="bg-[#0A2647] px-5 py-4 text-white font-semibold">
                {t("hsm.filter_by_type")}
              </div>
              <nav className="p-2">
                <ul className="space-y-1">
                  {filtersList.map((filter) => (
                    <li key={filter.id}>
                      <button
                        className={`w-full text-left px-4 py-3 rounded-lg transition-colors duration-200 ${activeFilter === filter.id
                            ? "bg-slate-100 text-[#0A2647] font-semibold"
                            : "text-slate-600 hover:bg-slate-50"
                          }`}
                        onClick={() => changeFilter(filter.id)}
                      >
                        {filter.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            {/* Фильтры больше не имеют снизу блока статистики */}
          </div>

          {/* Основной контент */}
          <div className="lg:w-3/4">
            {/* Сетка аккредитаций */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {filteredData.map((item) => {
                const styles = getAccreditationStyles(item.accreditation_type);
                const displayData = getDisplayData(item, i18n.language);
                const issueYear = new Date(item.issue_date).getFullYear();
                const validityPeriod = item.expiry_date
                  ? `${new Date(item.issue_date).getFullYear()}-${new Date(item.expiry_date).getFullYear()}`
                  : t("hsm.indefinite");
                const status = item.is_valid ? t("hsm.active") : t("hsm.expired");

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200 hover:shadow-md hover:border-slate-300 transition-all duration-300"
                  >
                    {/* Верхняя часть */}
                    <div className="p-6 border-b border-slate-100">
                      <div className="flex items-center justify-between mb-4">
                        <div className="bg-slate-100 rounded-xl w-14 h-14 flex items-center justify-center">
                          {(() => { const LogoIcon = styles.logo; return <LogoIcon className="w-7 h-7 text-[#0A2647]" />; })()}
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${item.is_valid
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : "bg-rose-50 text-rose-700 border border-rose-200"
                          }`}>
                          {status}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-slate-900 leading-snug mb-1">
                        {displayData.name}
                      </h3>
                      <div className="flex items-center text-slate-500 text-sm">
                        <span>{issueYear}</span>
                        <span className="mx-2">•</span>
                        <span>{displayData.typeDisplay}</span>
                      </div>
                    </div>

                    {/* Содержание карточки */}
                    <div className="p-6">
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-gray-600 mb-2">
                          {t("hsm.accrediting_organization")}
                        </h4>
                        <p className="text-gray-800 font-medium">
                          {displayData.organization}
                        </p>
                      </div>

                      {displayData.description && (
                        <p className="text-gray-700 mb-4 leading-relaxed">
                          {displayData.description}
                        </p>
                      )}

                      {/* Детальная информация */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="bg-slate-50 border border-slate-100 rounded-lg p-3">
                          <div className="text-xs text-slate-500 font-semibold mb-1">
                            {t("hsm.validity_period")}
                          </div>
                          <div className="text-sm font-semibold text-slate-800">
                            {validityPeriod}
                          </div>
                        </div>
                        <div className="bg-slate-50 border border-slate-100 rounded-lg p-3">
                          <div className="text-xs text-slate-500 font-semibold mb-1">
                            {t("hsm.certificate_number")}
                          </div>
                          <div className="text-sm font-semibold text-slate-800">
                            {item.certificate_number || t("hsm.not_specified")}
                          </div>
                        </div>
                      </div>

                      {/* Изображения сертификата и логотипа */}
                      <div className="flex gap-4 mt-4">
                        {item.certificate_image_url && (
                          <div className="flex-1">
                            <img
                              src={item.certificate_image_url}
                              alt={t("hsm.certificate")}
                              className="w-full h-24 object-cover rounded-lg border border-gray-200"
                            />
                          </div>
                        )}
                        {item.organization_logo_url && (
                          <div className="w-24">
                            <img
                              src={item.organization_logo_url}
                              alt={displayData.organization}
                              className="w-24 h-24 object-contain rounded-lg border border-gray-200 bg-white p-2"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Status;