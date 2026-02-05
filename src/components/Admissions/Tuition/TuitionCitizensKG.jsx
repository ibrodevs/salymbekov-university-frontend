
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SideMenu from '../../common/SideMenu';


const TuitionCitizensKG = () => {
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

  // Fetch tuition fees, bank details, and contacts from backend
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fees
        const feesRes = await fetch('https://med-backend-d61c905599c2.herokuapp.com/api/admissions/fees/?lang=' + i18n.language);
        let feesData = await feesRes.json();
        // Handle DRF pagination (object with .results)
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
        const bankRes = await fetch('https://med-backend-d61c905599c2.herokuapp.com/api/admissions/bank-requisites-kg/?lang=' + i18n.language);
        const bankData = await bankRes.json();
        let bankArr = Array.isArray(bankData) ? bankData : (bankData && Array.isArray(bankData.results) ? bankData.results : [bankData]);
        setBankDetails(bankArr[0]);

        // Contacts
        const contactsRes = await fetch('https://med-backend-d61c905599c2.herokuapp.com/api/admissions/contacts/?lang=' + i18n.language);
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
    // Try multilingual fields
    if (item[`${field}_${lang}`]) return item[`${field}_${lang}`];
    if (item[`${field}_ru`]) return item[`${field}_ru`];
    // Try non-suffixed field (for non-multilingual API)
    if (item[field]) return item[field];
    return '';
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">{t('loading', 'Загрузка...')}</div>;
  }
  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>;
  }

  // DEBUG: Show fetched data for troubleshooting
  if (process.env.NODE_ENV !== 'production') {
    console.log('DEBUG FEES:', fees);
    console.log('DEBUG BANK:', bankDetails);
    console.log('DEBUG CONTACTS:', contacts);
  }

  // Optionally, show debug info in UI for easier troubleshooting
  const debug = false; // отключить debug для показа обычного UI
  if (debug) {
    return (
      <div className="p-4 text-xs text-left text-gray-700 bg-yellow-50">
        <div><b>DEBUG FEES:</b> <pre>{JSON.stringify(fees, null, 2)}</pre></div>
        <div><b>DEBUG BANK:</b> <pre>{JSON.stringify(bankDetails, null, 2)}</pre></div>
        <div><b>DEBUG CONTACTS:</b> <pre>{JSON.stringify(contacts, null, 2)}</pre></div>
        <div className="mt-4 text-red-600">Отключите debug для показа обычного UI.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">
            {t('tuitionCitizens.title', 'Стоимость обучения для граждан КР')}
          </h1>
          <p className="text-xl opacity-90">
            {t('tuitionCitizens.subtitle', 'Актуальные цены и условия оплаты')}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Программы как карточки */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {t('tuitionCitizens.faculties.title', 'Программы и стоимость')}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.isArray(fees) && fees.length > 0 ? (
              fees.map((fee) => (
                <div key={fee.id} className="border border-gray-200 rounded-lg p-6 bg-white shadow hover:shadow-md transition-shadow flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-blue-800 mb-2">{getLangField(fee, 'title')}</h3>
                    <p className="text-gray-700 mb-4">{getLangField(fee, 'faculty')}</p>
                  </div>
                  <div className="flex items-end justify-between mt-auto">
                    <span className="text-2xl font-bold text-blue-600">
                      {fee.amount ? Number(fee.amount).toLocaleString() : ''} {t('tuitionCitizens.som', 'сом')}
                    </span>
                  </div>
                  {/* Warnings */}
                  {(fee[`warnings_${i18n.language === 'ky' ? 'kg' : i18n.language}`] || fee.warnings) && (
                    <ul className="mt-4 text-yellow-700 text-sm list-disc pl-5">
                      {(fee[`warnings_${i18n.language === 'ky' ? 'kg' : i18n.language}`] || fee.warnings || []).map((w, idx) => (
                        <li key={idx}>{w}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))
            ) : (
              <div className="col-span-full text-gray-500 text-center py-8">
                {t('tuitionCitizens.noFees', 'Нет данных о стоимости обучения')}
              </div>
            )}
          </div>
        </div>

        {/* Банковские реквизиты */}
        {bankDetails && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {t('tuitionCitizens.bankDetails.title', 'Банковские реквизиты')}
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="border-b border-gray-200 pb-2">
                  <label className="text-sm font-medium text-gray-600">
                    {t('tuitionCitizens.bankDetails.bankName', 'Банк')}
                  </label>
                  <p className="text-gray-800 font-semibold">{getLangField(bankDetails, 'bank_name')}</p>
                </div>

                <div className="border-b border-gray-200 pb-2">
                  <label className="text-sm font-medium text-gray-600">
                    {t('tuitionCitizens.bankDetails.account', 'Расчетный счет')}
                  </label>
                  <p className="text-gray-800 font-mono text-lg">{bankDetails.account_number || bankDetails.account || ''}</p>
                </div>

                <div className="border-b border-gray-200 pb-2">
                  <label className="text-sm font-medium text-gray-600">
                    {t('tuitionCitizens.bankDetails.bik', 'БИК')}
                  </label>
                  <p className="text-gray-800 font-mono">{bankDetails.bik || ''}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="border-b border-gray-200 pb-2">
                  <label className="text-sm font-medium text-gray-600">
                    {t('tuitionCitizens.bankDetails.inn', 'ИНН')}
                  </label>
                  <p className="text-gray-800 font-mono">{bankDetails.inn || ''}</p>
                </div>

                <div className="border-b border-gray-200 pb-2">
                  <label className="text-sm font-medium text-gray-600">
                    {t('tuitionCitizens.bankDetails.recipient', 'Получатель')}
                  </label>
                  <p className="text-gray-800 font-semibold">{getLangField(bankDetails, 'recipient')}</p>
                </div>

                <div className="border-b border-gray-200 pb-2">
                  <label className="text-sm font-medium text-gray-600">
                    {t('tuitionCitizens.bankDetails.purpose', 'Назначение платежа')}
                  </label>
                  <p className="text-gray-800">{getLangField(bankDetails, 'payment_purpose')}</p>
                </div>
              </div>
            </div>

            {/* Важные правила (warnings) */}
            {(bankDetails[`warnings_${i18n.language === 'ky' ? 'kg' : i18n.language}`] || bankDetails.warnings) && (
              <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.99-.833-2.768 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <div>
                    <p className="text-sm text-yellow-800 mb-2">
                      <strong>{t('tuitionCitizens.bankDetails.important', 'Важно!')}</strong>
                    </p>
                    <ul className="text-sm text-yellow-800 space-y-1">
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
                {t('tuitionCitizens.contact.title', 'Контактная информация')}
              </h2>
              <p className="text-gray-600">
                {t('tuitionCitizens.contact.subtitle', 'По всем вопросам обращайтесь')}
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
                  {t('tuitionCitizens.contact.phone', 'Телефон')}
                </h3>
                <p className="text-gray-600">{contacts.phone_number}</p>
              </div>

              <div className="p-4">
                <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-800 mb-1">
                  {t('tuitionCitizens.contact.email', 'Email')}
                </h3>
                <p className="text-gray-600">{contacts.email}</p>
              </div>

              <div className="p-4">
                <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-800 mb-1">
                  {t('tuitionCitizens.contact.hours', 'Часы работы')}
                </h3>
                <p className="text-gray-600">
                  {contacts.working_hours}
                </p>
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

export default TuitionCitizensKG;
