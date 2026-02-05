
import React, { useState, useEffect } from 'react';
import { Clock, File, FileEdit, Mail, MapPin, Phone, Stethoscope } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import SideMenu from '../common/SideMenu';

const AdmissionCommittee = () => {

  const { t, i18n } = useTranslation();

  const admissionItems = [
    { title: t('nav.committee'), link: '/admissions/committee' },
    { title: t('nav.for_citizens_kg'), link: '/admissions/tuition/citizens-kg' },
    { title: t('nav.for_foreign_citizens'), link: '/admissions/tuition/foreign-citizens' },
  ];
  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    let lang = i18n.language;
    if (lang === 'kg') lang = 'ky';
    const url = `https://med-backend-d61c905599c2.herokuapp.com/api/admissions/requirements/?lang=${lang}`;
    fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setRequirements(Array.isArray(data) ? data : (data.results || []));
        setLoading(false);
      })
      .catch((err) => {
        setError('Ошибка загрузки требований');
        setLoading(false);
      });
  }, [i18n.language]);

  const contactInfo = [
    {
      id: 1,
      type: t('admission.phone'),
      value: '+996 (312) 123-456',
      icon: "Phone"
    },
    {
      id: 2,
      type: t('admission.email'),
      value: 'admission@medical.edu',
      icon: "Mail"
    },
    {
      id: 3,
      type: t('admission.address'),
      value: t('admission.addressValue'),
      icon: "MapPin"
    },
    {
      id: 4,
      type: t('admission.hours'),
      value: t('admission.hoursValue'),
      icon: "Clock"
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-blue-800">
              {t('admission.title')}
            </h1>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {t('admission.heroTitle')}
          </h2>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">

        {/* Requirements Grid */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-blue-800 mb-8 text-center">
            {t('admission.requirements')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {requirements.length === 0 && (
              <div className="col-span-4 text-center text-gray-500 py-8">
                {error || t('admission.noRequirements', 'Нет требований для отображения')}
              </div>
            )}
            {requirements.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-l-4 border-blue-500"
              >
                <div className="text-4xl mb-4"></div>
                <h3 className="text-xl font-bold text-blue-800 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Information */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-blue-800 mb-8 text-center">
            {t('admission.contact')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-2xl font-bold text-blue-800 mb-6">
                {t('admission.contactInfo')}
              </h3>
              <div className="space-y-4">
                {contactInfo.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <div className="text-2xl text-blue-600">
              </div>
                    <div>
                      <p className="font-semibold text-blue-800">{item.type}</p>
                      <p className="text-gray-700">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Application Form Preview */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-2xl font-bold text-blue-800 mb-6">
                {t('admission.startApplication')}
              </h3>
              <div className="space-y-4">
                <a href="https://2020.edu.gov.kg/" target="_blank" rel="noopener noreferrer">
                  <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-all duration-300 mb-2">
                    {t('admission.for_citizens_kg')}
                  </button>
                </a>
                <a href="https://edugate.edu.gov.kg/" target="_blank" rel="noopener noreferrer">
                  <button className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition-all duration-300">
                    {t('admission.for_foreign_citizens')}
                  </button>
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
      {/* Боковое меню для навигации по разделу */}
      <SideMenu items={admissionItems} currentPath={window.location.pathname} />
    </div>
  );
};

export default AdmissionCommittee;