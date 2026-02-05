
import React, { useEffect, useState } from 'react';
import { Building2, DollarSign, FileText, GraduationCap, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import SideMenu from '../../common/SideMenu';


const TuitionForeignCitizens = () => {
  const { t, i18n } = useTranslation();

  const admissionItems = [
    { title: t('nav.committee'), link: '/admissions/committee' },
    { title: t('nav.for_citizens_kg'), link: '/admissions/tuition/citizens-kg' },
    { title: t('nav.for_foreign_citizens'), link: '/admissions/tuition/foreign-citizens' },
  ];
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bankDetails, setBankDetails] = useState(null);
  const [contacts, setContacts] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fees
        const feesRes = await fetch('https://med-backend-d61c905599c2.herokuapp.com/api/admissions/fees-foreign/?lang=' + i18n.language);
        let feesData = await feesRes.json();
        if (Array.isArray(feesData)) {
          setFees(feesData);
        } else if (feesData && Array.isArray(feesData.results)) {
          setFees(feesData.results);
        } else if (feesData && typeof feesData === 'object') {
          setFees([feesData]);
        } else {
          setFees([]);
        }

        // Bank details
        const bankRes = await fetch('https://med-backend-d61c905599c2.herokuapp.com/api/admissions/requisities-foreign/?lang=' + i18n.language);
        const bankData = await bankRes.json();
        let bankArr = Array.isArray(bankData) ? bankData : (bankData && Array.isArray(bankData.results) ? bankData.results : [bankData]);
        setBankDetails(bankArr[0]);

        // Contacts
        const contactsRes = await fetch('https://med-backend-d61c905599c2.herokuapp.com/api/admissions/contacts-foreign/?lang=' + i18n.language);
        const contactsData = await contactsRes.json();
        let contactsArr = Array.isArray(contactsData) ? contactsData : (contactsData && Array.isArray(contactsData.results) ? contactsData.results : [contactsData]);
        setContacts(contactsArr[0]);
      } catch (err) {
        setError('Ошибка загрузки данных');
        setFees([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [i18n.language]);

  // Helper to get field by language
  const getLangField = (item, field) => {
    if (!item) return '';
    const lang = i18n.language === 'ky' ? 'kg' : i18n.language;
    if (item[`${field}_${lang}`]) return item[`${field}_${lang}`];
    if (item[`${field}_ru`]) return item[`${field}_ru`];
    if (item[field]) return item[field];
    return '';
  };

  // Статичные данные для дополнительных расходов
  const additionalCosts = [
    {
      category: t('tuitionForeign.costs.accommodation', 'Проживание'),
      items: [
        { name: t('tuitionForeign.costs.dormitory', 'Общежитие'), cost: '$200-300/мес', description: t('tuitionForeign.costs.dormitoryDesc', 'Двухместная комната') },
        { name: t('tuitionForeign.costs.apartment', 'Аренда квартиры'), cost: '$300-600/мес', description: t('tuitionForeign.costs.apartmentDesc', 'Зависит от района') }
      ],
      Icon: Building2,
      color: 'blue'
    },
    {
      category: t('tuitionForeign.costs.living', 'Ежемесячные расходы'),
      items: [
        { name: t('tuitionForeign.costs.food', 'Питание'), cost: '$150-250/мес', description: t('tuitionForeign.costs.foodDesc', 'Включая столовую и продукты') },
        { name: t('tuitionForeign.costs.transport', 'Транспорт'), cost: '$20-40/мес', description: t('tuitionForeign.costs.transportDesc', 'Общественный транспорт') },
        { name: t('tuitionForeign.costs.personal', 'Личные расходы'), cost: '$100-200/мес', description: t('tuitionForeign.costs.personalDesc', 'Одежда, развлечения') }
      ],
      Icon: DollarSign,
      color: 'green'
    },
    {
      category: t('tuitionForeign.costs.oneTime', 'Единоразовые расходы'),
      items: [
        { name: t('tuitionForeign.costs.visa', 'Студенческая виза'), cost: '$50-100', description: t('tuitionForeign.costs.visaDesc', 'Консульский сбор') },
        { name: t('tuitionForeign.costs.medical', 'Медицинская страховка'), cost: '$200-400/год', description: t('tuitionForeign.costs.medicalDesc', 'Полное покрытие') },
        { name: t('tuitionForeign.costs.documents', 'Оформление документов'), cost: '$100-200', description: t('tuitionForeign.costs.documentsDesc', 'Переводы, нострификация') }
      ],
      Icon: FileText,
      color: 'purple'
    }
  ];

  // Статичные данные для стипендий
  const scholarships = [
    {
      title: t('tuitionForeign.scholarships.government', 'Государственная стипендия'),
      description: t('tuitionForeign.scholarships.governmentDesc', 'Полное покрытие обучения от правительства КР'),
      coverage: t('tuitionForeign.scholarships.governmentCoverage', '100% стоимости обучения'),
      requirements: [
        t('tuitionForeign.scholarships.govReq1', 'Высокие академические показатели'),
        t('tuitionForeign.scholarships.govReq2', 'Рекомендации от посольства'),
        t('tuitionForeign.scholarships.govReq3', 'Знание русского или английского языка')
      ],
      deadline: t('tuitionForeign.scholarships.govDeadline', '31 марта'),
  Icon: Building2
    },
    {
      title: t('tuitionForeign.scholarships.university', 'Университетская стипендия'),
      description: t('tuitionForeign.scholarships.universityDesc', 'Частичная компенсация от университета'),
      coverage: t('tuitionForeign.scholarships.universityCoverage', '25-50% стоимости обучения'),
      requirements: [
        t('tuitionForeign.scholarships.uniReq1', 'Отличные результаты вступительных экзаменов'),
        t('tuitionForeign.scholarships.uniReq2', 'Мотивационное письмо'),
        t('tuitionForeign.scholarships.uniReq3', 'Портфолио достижений')
      ],
      deadline: t('tuitionForeign.scholarships.uniDeadline', '15 мая'),
      Icon: GraduationCap
    },
    {
      title: t('tuitionForeign.scholarships.merit', 'Стипендия за заслуги'),
      description: t('tuitionForeign.scholarships.meritDesc', 'Поощрение выдающихся студентов'),
      coverage: t('tuitionForeign.scholarships.meritCoverage', '15-30% скидка'),
      requirements: [
        t('tuitionForeign.scholarships.merReq1', 'Активное участие в научной работе'),
        t('tuitionForeign.scholarships.merReq2', 'Волонтерская деятельность'),
        t('tuitionForeign.scholarships.merReq3', 'Лидерские качества')
      ],
      deadline: t('tuitionForeign.scholarships.merDeadline', 'В течение года'),
      Icon: Star
    }
  ];


  // --- UI ---


  const getCurrencySymbol = () => '$';

  const getColorClasses = (color) => {
    const colors = {
      blue: 'border-blue-200 bg-blue-50',
      green: 'border-green-200 bg-green-50',
      purple: 'border-purple-200 bg-purple-50'
    };
    return colors[color] || colors.blue;
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">{t('loading', 'Загрузка...')}</div>;
  }
  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">
            {t('tuitionForeign.title', 'Стоимость обучения для иностранных граждан')}
          </h1>
          <p className="text-xl opacity-90">
            {t('tuitionForeign.subtitle', 'Полная информация о стоимости программ, дополнительных расходах и стипендиях')}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Стоимость программ только в USD */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {t('tuitionForeign.tuition.title', 'Стоимость программ обучения')}
            </h2>
            <div className="flex space-x-2">
              <span className="px-4 py-2 rounded-lg bg-green-600 text-white">USD ($)</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {Array.isArray(fees) && fees.length > 0 ? (
              fees.map((fee) => (
                <div key={fee.id} className="border border-gray-200 rounded-lg p-6 bg-white shadow hover:shadow-md transition-shadow flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-blue-800 mb-2">{getLangField(fee, 'title')}</h3>
                    <p className="text-gray-700 mb-4">{getLangField(fee, 'faculty')}</p>
                  </div>
                  <div className="flex items-end justify-between mt-auto">
                    <span className="text-2xl font-bold text-green-600">
                      {getCurrencySymbol()}{fee.amount ? Number(fee.amount).toLocaleString() : ''}
                    </span>
                    <span className="text-sm text-gray-600 ml-2">/year</span>
                  </div>
                  {/* Warnings */}
                  {(fee[`warnings_${i18n.language === 'ky' ? 'kg' : i18n.language}`] || fee.warnings) && (
                    <ul className="mt-4 text-red-700 text-sm list-disc pl-5">
                      {(fee[`warnings_${i18n.language === 'ky' ? 'kg' : i18n.language}`] || fee.warnings || []).map((w, idx) => (
                        <li key={idx}>{w}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))
            ) : (
              <div className="col-span-full text-gray-500 text-center py-8">
                {t('tuitionForeign.noFees', 'Нет данных о стоимости обучения')}
              </div>
            )}
          </div>
        </div>





        {/* Банковские реквизиты */}
        {bankDetails && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {t('tuitionForeign.bankDetails.title', 'Банковские реквизиты для международных переводов')}
              </h2>
            </div>
            <div>
              <div className="border-2 border-blue-200 rounded-lg p-6 bg-blue-50">
                <h3 className="text-lg font-semibold text-blue-800 mb-4">
                  {t('tuitionForeign.bankDetails.usdTitle', 'Для переводов в USD')}
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <label className="font-medium text-gray-600">
                      {t('tuitionForeign.bankDetails.bank', 'Банк:')}
                    </label>
                    <p className="text-gray-800">{getLangField(bankDetails, 'bank_name')}</p>
                  </div>
                  <div>
                    <label className="font-medium text-gray-600">
                      {t('tuitionForeign.bankDetails.account', 'Счет:')}
                    </label>
                    <p className="text-gray-800 font-mono">{bankDetails.account_number}</p>
                  </div>
                  <div>
                    <label className="font-medium text-gray-600">SWIFT:</label>
                    <p className="text-gray-800 font-mono">{bankDetails.swift_code}</p>
                  </div>
                  <div>
                    <label className="font-medium text-gray-600">
                      {t('tuitionForeign.bankDetails.correspondent', 'Банк-корреспондент:')}
                    </label>
                    <p className="text-gray-800">{bankDetails.correspondent_bank}</p>
                  </div>
                  <div>
                    <label className="font-medium text-gray-600">
                      {t('tuitionForeign.bankDetails.recipient', 'Получатель:')}
                    </label>
                    <p className="text-gray-800">{getLangField(bankDetails, 'recipient')}</p>
                  </div>
                </div>
              </div>
            </div>
            {(bankDetails[`warnings_${i18n.language === 'ky' ? 'kg' : i18n.language}`] || bankDetails.warnings) && (
              <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-400">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-red-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.99-.833-2.768 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <div>
                    <p className="text-sm text-red-800 mb-2">
                      <strong>{t('tuitionForeign.bankDetails.important', 'Важные моменты при переводе:')}</strong>
                    </p>
                    <ul className="text-sm text-red-800 space-y-1">
                      {(bankDetails[`warnings_${i18n.language === 'ky' ? 'kg' : i18n.language}`] || bankDetails.warnings || []).map((w, idx) => (
                        <li key={idx}>• {w}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Контактная информация */}
        {contacts && (
          <div className="mt-12 bg-white rounded-lg shadow-lg p-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {t('tuitionForeign.contact.title', 'Финансовый отдел для иностранных студентов')}
              </h2>
              <p className="text-gray-600">
                {t('tuitionForeign.contact.subtitle', 'Мы поможем с любыми вопросами по оплате и финансированию обучения')}
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="p-4">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-800 mb-1">
                  {t('tuitionForeign.contact.phone', 'Телефон')}
                </h3>
                <p className="text-gray-600">{contacts.phone_number}</p>
                {contacts.whatsapp && <p className="text-gray-600">WhatsApp: {contacts.whatsapp}</p>}
              </div>
              <div className="p-4">
                <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-800 mb-1">
                  {t('tuitionForeign.contact.email', 'Email')}
                </h3>
                <p className="text-gray-600">{contacts.email}</p>
              </div>
              <div className="p-4">
                <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-800 mb-1">
                  {t('tuitionForeign.contact.support', 'Поддержка 24/7')}
                </h3>
                {contacts.telegram && <p className="text-gray-600">Telegram: {contacts.telegram}</p>}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Боковое меню для навигации по разделу */}
      <SideMenu items={admissionItems} currentPath={window.location.pathname} />
    </div>
  );
};

export default TuitionForeignCitizens;
