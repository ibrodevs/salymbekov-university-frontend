import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Rocket } from 'lucide-react';
import { startupsAPI, infrastructureHelpers } from '../../services/infrastructureService';

const Startups = () => {
  const { t, i18n } = useTranslation();
  const [startups, setStartups] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const lang = i18n.language === 'kg' ? 'kg' : i18n.language === 'en' ? 'en' : 'ru';
        const response = await startupsAPI.getAllForFrontend(lang);
        if (response.success && response.data) {
          const transformed = infrastructureHelpers.transformStartupData(response, lang);
          setStartups(transformed.startups);
          setStatistics(transformed.statistics || {});
        } else {
          setStartups([]);
        }
      } catch (e) {
        console.error('Error fetching startups:', e);
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [i18n.language]);

  const stats = [
    { value: statistics.active_startups ?? startups.length, label: t('startups.activeStartups', 'Активные стартапы') },
    { value: statistics.total_funding || '5M+', label: t('startups.totalFunding', 'Финансирование') },
    { value: statistics.team_members ?? 0, label: t('startups.teamMembers', 'Члены команды') },
    { value: statistics.patents || '10+', label: t('startups.patents', 'Патенты') },
  ];

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
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
            {t('startups.heroTitle', 'Центр медицинских инноваций')}
          </h1>
          <p className="text-lg text-slate-500 max-w-3xl mx-auto">
            {t('startups.heroSubtitle', 'Трансформация здравоохранения через студенческие стартапы')}
          </p>
        </div>

        {error || startups.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
            <Rocket className="w-14 h-14 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">{t('startups.ourStartups', 'Стартапы недоступны')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {startups.map((startup) => (
              <div key={startup.id}
                className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300 p-6 flex flex-col">
                <div className="flex items-start gap-4 mb-3">
                  <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center text-[#0A2647] flex-shrink-0">
                    <Rocket className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 leading-snug">{startup.name}</h3>
                    {startup.category && <span className="text-sm text-slate-500">{startup.category}</span>}
                  </div>
                </div>

                {startup.description && (
                  <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-3">{startup.description}</p>
                )}

                <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between text-sm">
                  {startup.stage && (
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium">{startup.stage}</span>
                  )}
                  {startup.funding && (
                    <span className="font-bold text-[#0A2647]">{startup.funding}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Startups;
