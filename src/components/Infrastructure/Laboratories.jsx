import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const Laboratories = () => {
  const { t, i18n } = useTranslation();
  const [laboratories, setLaboratories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLab, setSelectedLab] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    // Fetch laboratories from Django API
    const fetchLaboratories = async () => {
      try {
        const response = await fetch('https://med-backend-d61c905599c2.herokuapp.com/api/infrastructure/laboratories/');
        if (response.ok) {
          const data = await response.json();
          const labsData = data.results || data;
          setLaboratories(labsData);
        } else {
          console.error('Failed to fetch laboratories:', response.statusText);
          // Fallback to mock data if API fails
          setLaboratories(getMockLaboratories());
        }
      } catch (error) {
        console.error('Error fetching laboratories:', error);
        // Fallback to mock data if API fails
        setLaboratories(getMockLaboratories());
      } finally {
        setLoading(false);
      }
    };

    fetchLaboratories();
  }, []);

  const getMockLaboratories = () => {
    return [
      {
        id: 1,
        name: {
          ru: "Лаборатория биохимии",
          kg: "Биохимия лабораториясы",
          en: "Biochemistry Laboratory"
        },
        type: "biochemistry",
        photo: "/images/lab_biochemistry.jpg",
        equipment: [
          {
            name: { ru: "Спектрофотометр", kg: "Спектрофотометр", en: "Spectrophotometer" },
            description: { ru: "Для анализа биохимических показателей", kg: "Биохимиялык көрсөткүчтөрдү талдоо үчүн", en: "For biochemical analysis" }
          },
          {
            name: { ru: "Центрифуга", kg: "Центрифуга", en: "Centrifuge" },
            description: { ru: "Разделение биологических компонентов", kg: "Биологиялык компоненттерди бөлүү", en: "Separation of biological components" }
          },
          {
            name: { ru: "Микроскоп", kg: "Микроскоп", en: "Microscope" },
            description: { ru: "Изучение клеточных структур", kg: "Клеткалык түзүлүштөрдү изилдөө", en: "Study of cellular structures" }
          }
        ],
        description: {
          ru: "Современная лаборатория для изучения биохимических процессов в организме",
          kg: "Организмдеги биохимиялык процесстерди изилдөө үчүн заманбап лаборатория",
          en: "Modern laboratory for studying biochemical processes in the body"
        },
        access: {
          schedule: {
            ru: "Понедельник-Пятница: 8:00-18:00, Суббота: 9:00-15:00",
            kg: "Дүйшөмбү-Жума: 8:00-18:00, Ишемби: 9:00-15:00",
            en: "Monday-Friday: 8:00-18:00, Saturday: 9:00-15:00"
          },
          requirements: {
            ru: "Лабораторный халат, защитные очки, сменная обувь",
            kg: "Лабораториялык халат, коргоочу көз айнек, алмаштырма бут кийим",
            en: "Lab coat, safety goggles, indoor shoes"
          }
        },
        capacity: 24
      },
      {
        id: 2,
        name: {
          ru: "Анатомическая лаборатория",
          kg: "Анатомиялык лаборатория",
          en: "Anatomy Laboratory"
        },
        type: "anatomy",
        photo: "/images/lab_anatomy.jpg",
        equipment: [
          {
            name: { ru: "Анатомические препараты", kg: "Анатомиялык препараттар", en: "Anatomical specimens" },
            description: { ru: "Коллекция органов и систем человека", kg: "Адамдын органдарынын жана системаларынын коллекциясы", en: "Collection of human organs and systems" }
          },
          {
            name: { ru: "Скелеты", kg: "Скелеттер", en: "Skeletons" },
            description: { ru: "Полные скелеты и отдельные кости", kg: "Толук скелеттер жана өзүнчө сөөктөр", en: "Complete skeletons and individual bones" }
          },
          {
            name: { ru: "Муляжи органов", kg: "Органдардын муляждары", en: "Organ models" },
            description: { ru: "Детализированные модели органов", kg: "Органдардын деталдаштырылган модели", en: "Detailed organ models" }
          }
        ],
        description: {
          ru: "Лаборатория для изучения строения человеческого тела",
          kg: "Адам денесинин түзүлүшүн изилдөө үчүн лаборатория",
          en: "Laboratory for studying human body structure"
        },
        access: {
          schedule: {
            ru: "Понедельник-Пятница: 9:00-17:00",
            kg: "Дүйшөмбү-Жума: 9:00-17:00",
            en: "Monday-Friday: 9:00-17:00"
          },
          requirements: {
            ru: "Медицинский халат, перчатки, респиратор",
            kg: "Медициналык халат, кол чаткычтар, респиратор",
            en: "Medical coat, gloves, respirator"
          }
        },
        capacity: 30
      },
      {
        id: 3,
        name: {
          ru: "Фармацевтическая лаборатория",
          kg: "Фармацевтикалык лаборатория",
          en: "Pharmaceutical Laboratory"
        },
        type: "pharmacy",
        photo: "/images/lab_pharmacy.jpg",
        equipment: [
          {
            name: { ru: "Хроматограф", kg: "Хроматограф", en: "Chromatograph" },
            description: { ru: "Анализ лекарственных веществ", kg: "Дары заттарын талдоо", en: "Analysis of pharmaceutical substances" }
          },
          {
            name: { ru: "Таблетпресс", kg: "Таблеткапресс", en: "Tablet press" },
            description: { ru: "Изготовление таблеток", kg: "Таблетка жасоо", en: "Tablet manufacturing" }
          },
          {
            name: { ru: "Аналитические весы", kg: "Аналитикалык таразалар", en: "Analytical balance" },
            description: { ru: "Точное взвешивание препаратов", kg: "Дарылардын так өлчөмү", en: "Precise weighing of drugs" }
          }
        ],
        description: {
          ru: "Лаборатория для изучения фармацевтических технологий и анализа лекарств",
          kg: "Фармацевтикалык технологияларды изилдөө жана дарыларды талдоо үчүн лаборатория",
          en: "Laboratory for studying pharmaceutical technologies and drug analysis"
        },
        access: {
          schedule: {
            ru: "Понедельник-Пятница: 8:30-17:30",
            kg: "Дүйшөмбү-Жума: 8:30-17:30",
            en: "Monday-Friday: 8:30-17:30"
          },
          requirements: {
            ru: "Лабораторный халат, защитные очки, резиновые перчатки",
            kg: "Лабораториялык халат, коргоочу көз айнек, резина кол чаткычтар",
            en: "Lab coat, safety goggles, rubber gloves"
          }
        },
        capacity: 20
      },
      {
        id: 4,
        name: {
          ru: "Лаборатория микробиологии",
          kg: "Микробиология лабораториясы",
          en: "Microbiology Laboratory"
        },
        type: "microbiology",
        photo: "/images/lab_microbiology.jpg",
        equipment: [
          {
            name: { ru: "Автоклав", kg: "Автоклав", en: "Autoclave" },
            description: { ru: "Стерилизация оборудования", kg: "Жабдыктарды стерилдештирүү", en: "Equipment sterilization" }
          },
          {
            name: { ru: "Ламинарный бокс", kg: "Ламинардык бокс", en: "Laminar flow cabinet" },
            description: { ru: "Работа в стерильных условиях", kg: "Стерилдүү шартта иштөө", en: "Working in sterile conditions" }
          },
          {
            name: { ru: "Инкубатор", kg: "Инкубатор", en: "Incubator" },
            description: { ru: "Выращивание микроорганизмов", kg: "Микроорганизмдерди өстүрүү", en: "Growing microorganisms" }
          }
        ],
        description: {
          ru: "Лаборатория для изучения микроорганизмов и инфекционных заболеваний",
          kg: "Микроорганизмдерди жана инфекциялык оорулардын изилдөө үчүн лаборатория",
          en: "Laboratory for studying microorganisms and infectious diseases"
        },
        access: {
          schedule: {
            ru: "Понедельник-Пятница: 9:00-16:00",
            kg: "Дүйшөмбү-Жума: 9:00-16:00",
            en: "Monday-Friday: 9:00-16:00"
          },
          requirements: {
            ru: "Стерильный халат, маска, перчатки, защитные очки",
            kg: "Стерилдүү халат, маска, кол чаткычтар, коргоочу көз айнек",
            en: "Sterile coat, mask, gloves, safety goggles"
          }
        },
        capacity: 16
      }
    ];
  };

  const getCurrentLanguage = () => {
    return ['ru', 'kg', 'en'].includes(i18n.language) ? i18n.language : 'ru';
  };

  // Helper function to get translated field value
  const getTranslatedField = (obj, fieldPrefix) => {
    const lang = getCurrentLanguage();
    return obj[`${fieldPrefix}_${lang}`] || obj[`${fieldPrefix}_ru`] || '';
  };

  const filteredLabs = activeTab === 'all'
    ? laboratories
    : laboratories.filter(lab => lab.type === activeTab);

  const labTypes = [
    { id: 'all', name: { ru: 'Все', kg: 'Бардыгы', en: 'All' } },
    { id: 'biochemistry', name: { ru: 'Биохимия', kg: 'Биохимия', en: 'Biochemistry' } },
    { id: 'anatomy', name: { ru: 'Анатомия', kg: 'Анатомия', en: 'Anatomy' } },
    { id: 'pharmacy', name: { ru: 'Фармацевтика', kg: 'Фармацевтика', en: 'Pharmacy' } },
    { id: 'microbiology', name: { ru: 'Микробиология', kg: 'Микробиология', en: 'Microbiology' } }
  ];

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            {t('laboratories.title', 'Лаборатории университета')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('laboratories.subtitle', 'Современные лаборатории для практических занятий и научных исследований')}
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center mb-8">
          {labTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setActiveTab(type.id)}
              className={`m-2 px-6 py-2 rounded-full transition-colors ${activeTab === type.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-blue-50'
                }`}
            >
              {type.name[getCurrentLanguage()]}
            </button>
          ))}
        </div>

        <div className="grid gap-8">
          {filteredLabs.map((lab) => (
            <div key={lab.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/3">
                  <img
                    src={lab.photo || lab.photo_url || `https://via.placeholder.com/400x300?text=${encodeURIComponent(getTranslatedField(lab, 'name'))}`}
                    alt={getTranslatedField(lab, 'name')}
                    className="w-full h-64 md:h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x300?text=Laboratory+Photo';
                    }}
                  />
                </div>
                <div className="md:w-2/3 p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h2 className="text-2xl font-bold text-gray-800">
                      {getTranslatedField(lab, 'name')}
                    </h2>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      {t('laboratories.capacity', 'Вместимость')}: {lab.capacity || 20} {t('laboratories.students', 'студентов')}
                    </span>
                  </div>

                  <p className="text-gray-600 mb-4">
                    {getTranslatedField(lab, 'description')}
                  </p>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">
                        {t('laboratories.schedule', 'График работы')}:
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {getTranslatedField(lab, 'schedule') ||
                          (lab.access && lab.access.schedule && lab.access.schedule[getCurrentLanguage()]) ||
                          t('laboratories.defaultSchedule', 'Понедельник-Пятница 9:00-18:00')}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">
                        {t('laboratories.requirements', 'Требования')}:
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {getTranslatedField(lab, 'safety_requirements') ||
                          (lab.access && lab.access.requirements && lab.access.requirements[getCurrentLanguage()]) ||
                          t('laboratories.defaultRequirements', 'Специальная одежда, соблюдение техники безопасности')}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedLab(selectedLab === lab.id ? null : lab.id)}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {selectedLab === lab.id
                      ? t('laboratories.hideEquipment', 'Скрыть оборудование')
                      : t('laboratories.showEquipment', 'Показать оборудование')
                    }
                  </button>
                </div>
              </div>

              {selectedLab === lab.id && (
                <div className="bg-gray-50 p-6 border-t">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    {t('laboratories.equipment', 'Оборудование лаборатории')}
                  </h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {(lab.equipment || []).map((item, index) => (
                      <div key={index} className="bg-white p-4 rounded-lg shadow">
                        <h4 className="font-semibold text-gray-800 mb-2">
                          {getTranslatedField(item, 'name')}
                        </h4>
                        <p className="text-gray-600 text-sm">
                          {getTranslatedField(item, 'description')}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Access Information */}
        <div className="mt-12 bg-blue-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {t('laboratories.accessInfo', 'Информация о доступе к лабораториям')}
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                {t('laboratories.generalRules', 'Общие правила')}
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {t('laboratories.rule1', 'Вход только по студенческому билету')}
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {t('laboratories.rule2', 'Обязательное соблюдение техники безопасности')}
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {t('laboratories.rule3', 'Присутствие преподавателя или лаборанта')}
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {t('laboratories.rule4', 'Предварительная запись на самостоятельную работу')}
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                {t('laboratories.contactInfo', 'Контактная информация')}
              </h3>
              <div className="space-y-3 text-gray-700">
                <div>
                  <strong>{t('laboratories.coordinator', 'Координатор лабораторий')}:</strong>
                  <p>Иванов Петр Семенович</p>
                  <p>Тел: +996 312 123-789</p>
                  <p>Email: labs@salymbekov.edu.kg</p>
                </div>
                <div>
                  <strong>{t('laboratories.workingHours', 'Часы работы деканата')}:</strong>
                  <p>{t('laboratories.decanatSchedule', 'Понедельник-Пятница: 9:00-17:00')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Laboratories;