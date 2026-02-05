
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { AcademicCapIcon, UserGroupIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import SideMenu from '../common/SideMenu';


const PPSCard = () => {
  const { t, i18n } = useTranslation();

  const hsmItems = [
    { title: t('nav.about_HSM'), link: '/hsm/about' },
    { title: t('nav.management'), link: '/hsm/manage' },
    { title: t('nav.programs'), link: '/hsm/programs' },
    { title: t('nav.academic_stuff'), link: '/hsm/AS' },
    { title: t('nav.partners'), link: '/hsm/partners' },
    { title: t('nav.cmk'), link: '/hsm/cmk' },
  ];
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch('https://med-backend-d61c905599c2.herokuapp.com/api/hsm/as-numbers/', {
      headers: {
        'Accept-Language': i18n.language === 'kg' ? 'ky' : i18n.language,
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setStats(Array.isArray(data) ? data : (data.results || []));
        setLoading(false);
      })
      .catch((err) => {
        setError('Ошибка загрузки статистики');
        setLoading(false);
      });
  }, [i18n.language]);

  // Функция для получения поля по языку
  function getLangField(obj, base) {
    let lang = i18n.language.toLowerCase();
    if (lang === 'kg') lang = 'ky';
    if (lang.startsWith('ru') && obj[base + '_ru']) return obj[base + '_ru'];
    if (lang.startsWith('en') && obj[base + '_en']) return obj[base + '_en'];
    if ((lang.startsWith('ky') || lang.startsWith('kgz')) && obj[base + '_kg']) return obj[base + '_kg'];
    return obj[base + '_ru'] || obj[base + '_en'] || obj[base + '_kg'] || '';
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 pt-24">
      {/* Hero Section */}
      <motion.section
        className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-blue-800 to-cyan-900 text-white py-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-white opacity-5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.h1 
              className="text-4xl md:text-5xl font-bold mb-6 leading-tight"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              {t('pps.title', 'Профессорско-преподавательский состав ВШМ')}
            </motion.h1>
            <motion.div 
              className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-400 mx-auto rounded-full mb-6"
              initial={{ width: 0 }}
              animate={{ width: 96 }}
              transition={{ delay: 0.5, duration: 1 }}
            ></motion.div>
          </motion.div>
        </div>
      </motion.section>

      <div className="container mx-auto px-4 py-12">
        {/* Основная статистика */}
        <motion.section
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {loading ? (
            <div className="text-center text-gray-400">Loading...</div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : (
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.id || index}
                  className="bg-white rounded-2xl shadow-lg p-6 text-center border border-gray-100 min-w-[220px]"
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
                  }}
                  transition={{ type: "spring", stiffness: 300, delay: index * 0.1 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <div className="text-blue-600 mb-4 flex justify-center">
                    <AcademicCapIcon className="w-8 h-8" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.intTitle}</div>
                  <div className="text-xl font-bold text-blue-700 mb-1">{getLangField(stat, 'title')}</div>
                  <div className="text-lg font-semibold text-gray-800 mb-2">{getLangField(stat, 'description')}</div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Описание и цели */}
          <motion.section
            className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="p-8 md:p-12">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
              >
                <p
                  className="mb-6"
                  style={{ textIndent: '2em' }}
                >
                  {t(
                    'pps.mission_text',
                    'ВШМ ставит перед собой три ключевые цели: соответствовать потребностям рынка образовательных услуг, способствовать экспорту знаний и успешно внедрять многоязычное образование в Кыргызстане.'
                  )}
                </p>
                              
                <p className="mb-6"
                  style={{ textIndent: '2em' }}>
                  {t('pps.faculty_text', 'Для достижения этих целей к учебному процессу привлекаются лучшие отечественные педагоги и эксперты. Преподавательский состав отличается высокой квалификацией, включая более 20 докторов и кандидатов наук. Образовательные программы разрабатываются согласно государственным стандартам.')}
                </p>

                <div className="my-8">
                  <p className="mb-4">
                    <strong>{t('pps.notable_professors', 'Ведущие профессора медицинской школы')}:</strong>
                  </p>
                  <p className="mb-3"
                  style={{ textIndent: '2em' }}>
                    {t('pps.professor_list', 'Доктора медицинских наук из числа ППС: Абдылдаев Рысбек Алдагандаевич – профессор, онколог, вице-президент по перспективным исследованиям, Тулекеев Токтогазы Молдалиевич – профессор, хирург, анатом, проректор по научной работе, Узакбаев Камчыбек Аскарбекович – профессор, детский хирург, руководитель департамента науки, Иманкулова Асель Сансызбаевна – хирург, проректор по последипломному образованию, Атыканов Арыстанбек Орозалиевич – акушер-гинеколог, заведующий кафедрой МФД и др.')}
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.section>
        </motion.section>
      </div>

      {/* Боковое меню для навигации по разделу */}
      <SideMenu items={hsmItems} currentPath={window.location.pathname} />
    </div>
  );
};

export default PPSCard;