import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Newspaper, Image as ImageIcon, ExternalLink } from 'lucide-react';
import { getOfficialNews, getLatestNews } from '../../services/officialNewsService';

const News = () => {
  const { t, i18n } = useTranslation();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setError(null);
        setLoading(true);

        // 1) Быстро показываем 3 последние новости (одна лёгкая страница).
        const latest = await getLatestNews(3);
        if (cancelled) return;
        setNews(latest);
        setLoading(false);

        // 2) В фоне догружаем все остальные новости и заменяем список.
        setLoadingMore(true);
        const all = await getOfficialNews();
        if (cancelled) return;
        setNews(all);
      } catch (err) {
        if (cancelled) return;
        console.error('Official news fetch failed:', err);
        setError(err.message);
        setNews([]);
      } finally {
        if (!cancelled) {
          setLoading(false);
          setLoadingMore(false);
        }
      }
    };

    load();
    return () => { cancelled = true; };
  }, []);

  const featured = news.filter((i) => i.isFeatured).slice(0, 2);
  const featuredIds = new Set(featured.map((i) => i.id));
  const rest = news.filter((i) => !featuredIds.has(i.id));

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleDateString(i18n.language === 'kg' ? 'ky-KG' : i18n.language,
      { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const ImagePlaceholder = ({ className }) => (
    <div className={`${className} bg-slate-100 flex items-center justify-center text-slate-300`}>
      <ImageIcon className="w-12 h-12" />
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-10 w-10 border-2 border-slate-200 border-t-[#0A2647]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Заголовок */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">{t('news.title', 'Новости')}</h1>
          <p className="text-lg text-slate-500 max-w-3xl mx-auto">{t('news.subtitle', 'Последние новости и события университета')}</p>
        </div>

        {error && (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
            <p className="text-slate-500 mb-4">{t('news.error', 'Ошибка загрузки')}: {error}</p>
            <button onClick={() => window.location.reload()}
              className="px-4 py-2 bg-[#0A2647] text-white rounded-lg hover:bg-[#144272]">
              {t('news.tryAgain', 'Попробовать снова')}
            </button>
          </div>
        )}

        {!error && news.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
            <Newspaper className="w-14 h-14 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">{t('news.empty', 'Новостей пока нет')}</p>
          </div>
        )}

        {/* Главные новости */}
        {featured.length > 0 && (
          <div className="mb-10">
            <h2 className="text-xl font-bold text-slate-900 mb-5">{t('news.featured', 'Главное')}</h2>
            <div className="grid md:grid-cols-2 gap-5">
              {featured.map((item) => (
                <a key={item.id} href={item.sourceUrl} target="_blank" rel="noopener noreferrer"
                  className="group bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300 overflow-hidden block">
                  <div className="relative">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.title}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextSibling.style.display = 'flex'; }} />
                    ) : null}
                    <ImagePlaceholder className={`w-full h-64 ${item.imageUrl ? 'hidden' : 'flex'}`} />
                    <span className="absolute top-4 left-4 bg-[#0A2647] text-white px-3 py-1 rounded text-xs font-semibold">
                      {t('news.important', 'Важное')}
                    </span>
                  </div>
                  <div className="p-6">
                    <div className="text-sm text-slate-400 mb-2">{formatDate(item.date)}</div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-[#0A2647] transition-colors">{item.title}</h3>
                    <p className="text-slate-500 text-sm line-clamp-2">{item.summary}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Все новости */}
        {rest.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {rest.map((item) => (
              <a key={item.id} href={item.sourceUrl} target="_blank" rel="noopener noreferrer"
                className="group bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300 overflow-hidden flex flex-col">
                <div className="relative">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextSibling.style.display = 'flex'; }} />
                  ) : null}
                  <ImagePlaceholder className={`w-full h-48 ${item.imageUrl ? 'hidden' : 'flex'}`} />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-slate-400">{formatDate(item.date)}</span>
                    <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-[#0A2647] transition-colors" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-[#0A2647] transition-colors">{item.title}</h3>
                  <p className="text-slate-500 text-sm line-clamp-3">{item.summary}</p>
                </div>
              </a>
            ))}
          </div>
        )}

        {/* Индикатор фоновой подгрузки остальных новостей */}
        {loadingMore && (
          <div className="flex items-center justify-center gap-3 py-10 text-slate-400">
            <span className="inline-block animate-spin rounded-full h-5 w-5 border-2 border-slate-200 border-t-[#0A2647]"></span>
            <span className="text-sm">{t('news.loadingMore', 'Загружаем остальные новости…')}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default News;
