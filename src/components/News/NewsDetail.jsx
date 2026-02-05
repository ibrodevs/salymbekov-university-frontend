import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Calendar, Tag, Share2 } from "lucide-react";
import SEOComponent from '../SEO/SEOComponent';
import SideMenu from '../common/SideMenu';

const API_BASE_URL = 'https://med-backend-d61c905599c2.herokuapp.com/api';

const NewsDetail = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const newsItems = [
    { title: t('nav.all_news'), link: '/news' },
    { title: t('nav.events'), link: '/news/events' },
    { title: t('nav.media'), link: '/media' },
  ];

  const fetchArticle = async () => {
    try {
      setLoading(true);
      const currentLanguage = i18n.language === "kg" ? "ky" : i18n.language;

      const apiUrl = `${API_BASE_URL}/news/${id}/`;

      const response = await fetch(apiUrl, {
        headers: {
          "Accept-Language": currentLanguage,
          "Content-Type": "application/json",
        },
      });


      if (!response.ok) {
        throw new Error(t("news.detail.notFound", "Новость не найдена"));
      }

      const data = await response.json();


      if (!data || typeof data !== "object" || Array.isArray(data)) {
        throw new Error(t("news.detail.notFound", "Новость не найдена"));
      }

      setArticle(data);
    } catch (err) {
      console.error("Error fetching article:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, i18n.language]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(
      i18n.language === "kg" ? "ky-KG" : i18n.language,
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );
  };

  const getLocalizedTitle = (article) => {
    const currentLang = i18n.language === "kg" ? "kg" : i18n.language;
    return (
      article[`title_${currentLang}`] ||
      article.title_ru ||
      article.title ||
      t("news.detail.noTitle", "Без названия")
    );
  };

  const getLocalizedContent = (article) => {
    const currentLang = i18n.language === "kg" ? "kg" : i18n.language;
    return (
      article[`content_${currentLang}`] ||
      article.content_ru ||
      article.content ||
      article.summary ||
      ""
    );
  };

  const getLocalizedSummary = (article) => {
    const currentLang = i18n.language === "kg" ? "kg" : i18n.language;
    return (
      article[`summary_${currentLang}`] ||
      article.summary_ru ||
      article.summary ||
      ""
    );
  };

  const getImageUrl = (article) => {
    if (
      article.image_url &&
      article.image_url !== "null" &&
      article.image_url !== null
    ) {
      if (article.image_url.startsWith("http")) {
        return article.image_url;
      }
      return `${MEDIA_BASE_URL}${article.image_url}`;
    }
    return null;
  };

  const getCategoryName = (category) => {
    const categoryName = category?.name || category;
    return t(`news.categories.${categoryName}`, categoryName);
  };

  const getCategoryColor = (category) => {
    const categoryName = category?.name || category;
    switch (categoryName) {
      case "news":
        return "bg-blue-100 text-blue-800";
      case "events":
        return "bg-green-100 text-green-800";
      case "announcements":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: getLocalizedTitle(article),
      text: getLocalizedSummary(article) || getLocalizedTitle(article),
      url: window.location.href,
    };

    try {
      // Проверяем поддержку Web Share API
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback - копируем ссылку в буфер обмена
        await navigator.clipboard.writeText(window.location.href);

        // Показываем уведомление пользователю
        alert(t("news.detail.linkCopied", "Ссылка скопирована в буфер обмена"));
      }
    } catch (err) {
      console.error("Error sharing:", err);
      // Если все остальное не работает, пытаемся скопировать ссылку
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert(t("news.detail.linkCopied", "Ссылка скопирована в буфер обмена"));
      } catch (clipboardErr) {
        console.error("Clipboard error:", clipboardErr);
        // Последний fallback - показываем ссылку для ручного копирования
        prompt(
          t("news.detail.copyLink", "Скопируйте эту ссылку:"),
          window.location.href
        );
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            {t("news.detail.loading", "Загрузка новости...")}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">
            {t("news.detail.error", "Ошибка")}: {error}
          </p>
          <Link
            to="/news"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {t("news.detail.backToNews", "Вернуться к новостям")}
          </Link>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            {t("news.detail.notFound", "Новость не найдена")}
          </p>
          <Link
            to="/news"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {t("news.detail.backToNews", "Вернуться к новостям")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* SEO Component for News Detail */}
      <SEOComponent 
        isNewsDetail={true}
        newsTitle={article?.title}
        newsDescription={article?.description || article?.content?.substring(0, 160)}
        customImage={article?.image}
      />
      
      {/* Back Button */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Link
            to="/news"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            {t("news.detail.backToNews", "Вернуться к новостям")}
          </Link>
        </div>
      </div>

      {/* Article Header */}
      <div className="bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getCategoryColor(
                  article.category
                )}`}
              >
                {getCategoryName(article.category)}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              {getLocalizedTitle(article)}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-8">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                {formatDate(article.published_at || article.created_at)}
              </div>
              {article.author && (
                <div className="flex items-center">
                  <Tag className="w-5 h-5 mr-2" />
                  {article.author}
                </div>
              )}
              <button
                className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                onClick={handleShare}
              >
                <Share2 className="w-5 h-5 mr-2" />
                {t("news.detail.share", "Поделиться")}
              </button>
            </div>

            {/* Image */}
            {getImageUrl(article) && (
              <div className="aspect-w-16 aspect-h-9 mb-8">
                <img
                  src={getImageUrl(article)}
                  alt={getLocalizedTitle(article)}
                  className="w-full h-96 object-cover rounded-xl shadow-lg"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-8">
            {/* Summary if exists */}
            {getLocalizedSummary(article) && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-lg text-gray-700 font-medium">
                  {getLocalizedSummary(article)}
                </p>
              </div>
            )}

            {/* Main Content */}
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
              {getLocalizedContent(article) ? (
                <div
                  dangerouslySetInnerHTML={{
                    __html: getLocalizedContent(article),
                  }}
                />
              ) : (
                <p>
                  {getLocalizedSummary(article) ||
                    t("news.detail.noContent", "Содержимое недоступно")}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Боковое меню для навигации по разделу */}
      <SideMenu items={newsItems} currentPath={window.location.pathname} />
    </div>
  );
};

export default NewsDetail;
